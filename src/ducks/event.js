import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { display: true, eventLogs: [] }

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_EVENT_LOG': {
      return { ...state, ...(state.eventLogs = action.eventLogs) }
    }
    case 'ADD_EVENT_LOG': {
      return { ...state, ...state.eventLogs.concat(action.eventLogs) }
    }
    default:
  }
  return state
}

export function getAllSecurityEvents(dispatch) {
  let url = rootReducer.serverUrl + '/api/securityEvents/allEventLogs';
  let url1 = rootReducer.serverUrl + '/api/securityEvents/count';
  axios.get(url1).then(response => {
      let total_count = response.data.count;
      let limit = 1000;
      let page_count = (total_count % limit) === 0 ? total_count / limit : Math.ceil(total_count / limit);
      getEventLogs(url, 0, limit, page_count, dispatch);
  })
}

function getEventLogs(url, index, limit, page_count, dispatch) {
    axios.get(url, {params: {
            limit: limit,
            offset: index * limit
        }}).then(response => {
        let eventLogs = response.data;
        if(index === 0) {
            dispatch({
                type: 'SET_EVENT_LOG',
                eventLogs: eventLogs,
            });
        } else {
            dispatch({
                type: 'ADD_EVENT_LOG',
                eventLogs: eventLogs,
            });
        }

        index ++;
        if(index === page_count) return;
        setTimeout(() => {
            getEventLogs(url, index, limit, page_count, dispatch);
        }, 100);

    });
}
