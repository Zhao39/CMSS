import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { display: true, sortType: 'datetime', eventLogs: [] };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_EVENT_LOG': {
      return { ...state, ...state.eventLogs = action.eventLogs }
    }
    case 'ADD_EVENT_LOG': {
      return { ...state, ...(state.eventLogs = (state.sortType === action.sortType)?state.eventLogs.concat(action.eventLogs):state.eventLogs) }
    }
    case 'PREPEND_EVENT_LOG': {
      return { ...state, ...(state.eventLogs = (state.sortType === action.sortType)?action.eventLogs.concat(state.eventLogs):state.eventLogs) }
    }
    default:
  }
  return state
}

export function getAllSecurityEvents( dispatch, sortType = "datetime", order = 0) {
  INITIAL_STATE.sortType = sortType;
  let url = rootReducer.serverUrl + '/api/securityEvents/allEventLogs';
  let url1 = rootReducer.serverUrl + '/api/securityEvents/count';
  axios.get(url1).then(response => {
    let total_count = response.data.count;
    let limit = 100;
    let page_count =
      total_count % limit === 0 ? total_count / limit : Math.ceil(total_count / limit);
    getEventLogs(url, 0, limit, page_count, sortType, order, dispatch);
  });
}

function updateEventLogs(url, latest, dispatch) {
  axios
    .get(url, {
      params: {
        latest: latest,
      },
    })
    .then(response => {
      let eventLogs = response.data
      if (eventLogs.length > 0) {
        dispatch({
          type: 'PREPEND_EVENT_LOG',
          sortType: 'datetime',
          eventLogs: eventLogs,
        })
        latest = eventLogs[0].DateTime
      }
      setTimeout(() => {
        updateEventLogs(url, latest, dispatch)
      }, 1000)
    })
}

function getEventLogs( url, index, limit, page_count, sortType, order, dispatch) {
    axios.get(url, {
      params: {
        limit: limit,
        offset: index * limit,
        sortType: sortType,
        order: order
      },
    })
    .then(response => {
      let eventLogs = response.data;
      if (index === 0) {
        dispatch({
          type: 'SET_EVENT_LOG',
          eventLogs: eventLogs,
        });
        if(sortType === 'datetime' && order === 0) {
            let url = rootReducer.serverUrl + '/api/securityEvents/updateEventLogs';
            updateEventLogs(url, eventLogs[0].DateTime, dispatch);
        }
      } else {
        dispatch({
          type: 'ADD_EVENT_LOG',
          sortType: sortType,
          eventLogs: eventLogs,
        })
      }
      index ++;
      if (index === page_count || sortType !== INITIAL_STATE.sortType) return;
      setTimeout(() => {
        getEventLogs(url, index, limit, page_count, sortType, order, dispatch)
      }, 100)
    })
}
