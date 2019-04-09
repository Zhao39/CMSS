import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { display: true }

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_DISPLAY': {
            return { ...state, ...(state.display = action.display) }
        }
        default:
    }
    return state
}

