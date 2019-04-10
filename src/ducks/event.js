import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { display: true, eventLogs: [] };

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_EVENT_LOG': {
            return { ...state, ...state.eventLogs = action.eventLogs }
        }
        case 'ADD_EVENT_LOG': {
            return { ...state, ...state.eventLogs.concat(action.eventLogs) }
        }
        default:
    }
    return state
}

export function getAllSecurityEvents(dispatch) {
    let url = rootReducer.serverUrl + '/api/SecurityEvents/allEventLogs';
    axios.get(url).then( response => {
        let eventLogs = response.data;
        dispatch({
            type: 'SET_EVENT_LOG',
            eventLogs: eventLogs
        });
    });
}

