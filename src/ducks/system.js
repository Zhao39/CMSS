import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { systemSecurityLevel: "Security Level -1" }

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_System_Security_Level': {
      return { ...state, ...(state.systemSecurityLevel = action.systemSecurityLevel) }
    }
    default:
  }
  return state
}
