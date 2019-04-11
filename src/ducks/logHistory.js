import rootReducer from './redux'
import axios from 'axios'

const INITIAL_STATE = {
  logHistory: [],
  accessInfo: {
    enabled: false,
    AuxDeviceID: -1,
    ClearanceLevelID: -1,
    DeckNumber: -1,
    DeckName: '',
    DeckZoneID: -1,
    DeviceGUID: '',
    DeviceID: -1,
    DeviceName: '',
    EquipmentSubTypeID: -1,
    EquipmentTypeID: -1,
    LocationID: -1,
    LocationName: '',
    LocationX: 0,
    LocationY: 0,
    count: -1,
  },
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'PUSH_DATA': {
      return { ...state, ...state.logHistory.push(action.data) }
    }
    case 'CLEAR_DATA': {
      console.log('clear data')
      return { ...state, ...(state.logHistory = []), ...(state.accessInfo = action.accessInfo) }
    }
    case 'SET_ACCESS': {
      return { ...state, ...(state.accessInfo = action.accessInfo) }
    }
    case 'SET_IMAGE': {
      return { ...state, ...(state.cameraImage = action.cameraImage) }
    }
    default:
  }
  return state
}

export let getSecurityEventsByDeviceID = (accessInfo, eventLogs, dispatch) => {
  let deviceId = accessInfo.DeviceID
  let url = rootReducer.serverUrl + '/api/SecurityEvents?DeviceID=' + deviceId
  let securityEvents = eventLogs.filter(event => {
    return event.DeviceID === deviceId
  })
  securityEvents.forEach(event => {
    let row = {}
    row.datetime = event.DateTime
    let datetime_string = new Date(event.DateTime)
      .toLocaleString('en-GB', { timeZone: 'UTC' })
      .replace(',', '')
    row.date = datetime_string.split(' ')[0]
    row.time = datetime_string.split(' ')[1]

    let eventId = event.EventID
    row.access = (event.EventMsg.split(' ').length > 1
      ? event.EventMsg.split(' ')[1]
      : event.EventMsg
    ).toUpperCase()
    row.operator = ''
    row.clearanceId = 0
    row.memberId = ''
    getEventAttributeByEventID(eventId, eventAttribute => {
      if (eventAttribute.hasOwnProperty('AttributeValueString')) {
        row.operator = eventAttribute.AttributeValueString
        getUserByUsername(row.operator, user => {
          row.memberId = user.UserID
          row.clearanceId = user.UserSecurityClearance_ClearanceID
          dispatch({
            type: 'PUSH_DATA',
            data: row,
          })
        })
      } else {
        dispatch({
          type: 'PUSH_DATA',
          data: row,
        })
      }
    })
  })
  accessInfo.count = securityEvents.length
  dispatch({
    type: 'SET_ACCESS',
    accessInfo: accessInfo,
  })
}

let getEventAttributeByEventID = (eventId, callback) => {
  let url = rootReducer.serverUrl + '/api/EventAttributes?EventID=' + eventId
  axios.get(url).then(response => {
    let eventAttribute = response.data
    callback(eventAttribute)
  })
}
let getUserByUsername = (username, callback) => {
  let url = rootReducer.serverUrl + '/api/Users?username=' + username
  axios.get(url).then(response => {
    let user = response.data
    callback(user)
  })
}

export let getCameraInfoByDeviceId = (deviceId, callback) => {
  let url = rootReducer.serverUrl + '/api/DeviceAttributes?SecurityDeviceID=' + deviceId
  axios.get(url).then(response => {
    callback(response.data)
  })
}
