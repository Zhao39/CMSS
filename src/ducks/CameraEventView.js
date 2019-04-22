import axios from 'axios';
import rootReducer from './redux'

const INITIAL_STATE = { display: false, cameraInfo: {}, cameraEventArray: [] };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_CAMERA_EVENT_VIEW_DISPLAY':
        {
            return {
                ...state,
                ...state.display = action.display,
                ...state.cameraEventArray = [],
                ...state.cameraInfo = action.cameraInfo
            };
        }
        case 'SET_CAMERA_EVENT_LOG': {
            return { ...state, ...(state.cameraEventArray = action.cameraEventArray) }
        }
        case 'ADD_CAMERA_EVENT_LOG': {
            return {
                ...state,
                ...(state.cameraEventArray = state.cameraEventArray.concat(action.cameraEventArray)),
            }
        }
        case 'PREPEND_CAMERA_EVENT_LOG': {
            return {
                ...state,
                ...(state.cameraEventArray =
                    state.sortType === action.sortType && state.update
                        ? action.cameraEventArray.concat(state.cameraEventArray)
                        : state.cameraEventArray),
            }
        }
        default:
    }
    return state;
}

export function getSecurityEventsByCameraId(cameraId, dispatch, sortType = 'datetime', order = 0) {
    INITIAL_STATE.sortType = sortType
    INITIAL_STATE.order = order
    let url = rootReducer.serverUrl + '/api/securityEvents/eventLogsByCameraId';
    let url1 = rootReducer.serverUrl + '/api/securityEvents/countByCameraId';
    axios.get(url1, {
        params: {
            cameraId: cameraId,
        },
    }).then(response => {
        let total_count = response.data.count;
        let limit = 100;
        let page_count =
            total_count % limit === 0 ? total_count / limit : Math.ceil(total_count / limit);
        getEventLogs(cameraId, url, 0, limit, page_count, sortType, order, dispatch);
    })
}

function updateEventLogs(url, latest, dispatch) {
    if (INITIAL_STATE.sortType !== 'datetime' || INITIAL_STATE.order !== 0) return
    axios
        .get(url, {
            params: {
                latest: latest,
            },
        })
        .then(response => {
            if (INITIAL_STATE.sortType !== 'datetime' || INITIAL_STATE.order !== 0) return
            let eventLogs = response.data
            //latest = INITIAL_STATE.eventLogs[0].DateTime;
            if (eventLogs.length > 0) {
                dispatch({
                    type: 'PREPEND_CAMERA_EVENT_LOG',
                    sortType: 'datetime',
                    cameraEventArray: eventLogs,
                })
                latest = eventLogs[0].DateTime
            }
            setTimeout(() => {
                updateEventLogs(url, latest, dispatch)
            }, 1000)
        })
}

function getEventLogs(cameraId, url, index, limit, page_count, sortType, order, dispatch) {
    axios
        .get(url, {
            params: {
                limit: limit,
                offset: index * limit,
                sortType: sortType,
                order: order,
                cameraId: cameraId
            },
        })
        .then(response => {
            let eventLogs = response.data
            if (index === 0) {
                dispatch({
                    type: 'SET_CAMERA_EVENT_LOG',
                    cameraEventArray: eventLogs,
                })
                if (sortType === 'datetime' && order === 0) {
                    let url = rootReducer.serverUrl + '/api/securityEvents/updateEventLogs'
                    if (eventLogs.length > 0) {
                        //updateEventLogs(url, INITIAL_STATE.cameraEventArray[0].DateTime, dispatch)
                    }
                }
            } else {
                if (
                    index === page_count ||
                    sortType !== INITIAL_STATE.sortType ||
                    order !== INITIAL_STATE.order
                ) {
                    return
                } else {
                    dispatch({
                        type: 'ADD_CAMERA_EVENT_LOG',
                        cameraEventArray: eventLogs,
                    })
                }
            }
            index++
            getEventLogs(cameraId, url, index, limit, page_count, sortType, order, dispatch)
        })
}

