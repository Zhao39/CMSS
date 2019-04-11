import React from 'react'
import { connect } from 'react-redux'
import { getSecurityEventsByDeviceID } from 'ducks/logHistory'
import cookie from 'react-cookie'
import { triggerManualEvent } from 'ducks/Milestone'
import _ from 'lodash'
import './style.scss'

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  decks: state.decksInfo,
  devices: state.devicesInfo,
  accessInfo: state.accessInfo,
  deckLocations: state.deckLocationsInfo,
  widgetInfo: state.widgetInfo,
  deckZonesInfo: state.deckZonesInfo,
  eventInfo: state.eventInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class TopMenu extends React.Component {
  state = {
    playbackExpand: -1,
    cameraExpand: -1,
    accessDeckExpand: -1,
    deckSensorExpand: -1,
  }

  selectPlayback = (camera, cameras, e) => {
    let deviceName = camera.DeviceName
    let playbackCamera = cameras.find(camera => {
      return camera.Name === deviceName
    })
    let { dispatch, widgetInfo, addPlaybackView } = this.props
    if (typeof playbackCamera !== 'undefined') {
      dispatch({
        type: 'SET_PLAYBACK',
        playbackCamera: playbackCamera,
      })
      dispatch({
        type: 'SET_CUR_CAMERA',
        currentCamera: {},
      })
    }
    let visible = widgetInfo.playbackView.visible
    if (!visible) {
      addPlaybackView()
    }
    dispatch({
      type: 'SET_PLAYBACK_VIDEO_DOWNLOAD',
      videoInfo: {},
    })
  }

  selectDeck = (deck, shown) => {
    console.log('currentDeck: ', deck)
    let { dispatch, addDeckView } = this.props
    if (typeof deck !== 'undefined') {
      dispatch({
        type: 'SET_CUR_DECK',
        currentDeck: deck,
      })
    }
    if (!shown) {
      addDeckView()
    }
    let accessInfo = {
      enabled: false,
      location: {
        room: '',
        deck: '',
      },
      clearance: 0,
      cameraId: '',
    }
    dispatch({
      type: 'CLEAR_ACCESS',
      accessInfo: accessInfo,
    })
  }

  onCameraSelect = (cameraId, visible) => {
    let { dispatch, addCameraView } = this.props
    if (!visible) {
      this.props.addCameraView(cameraId)
    }
  }

  onPlaybackExpand = index => {
    let { playbackExpand } = this.state
    if (index === playbackExpand) {
      this.setState({
        playbackExpand: -1,
      })
    } else {
      this.setState({
        playbackExpand: index,
      })
    }
  }

  onAccessDeckExpand = index => {
    let { accessDeckExpand } = this.state
    if (index === accessDeckExpand) {
      this.setState({
        accessDeckExpand: -1,
      })
    } else {
      this.setState({
        accessDeckExpand: index,
      })
    }
  }

  onCameraExpand = index => {
    let { cameraExpand } = this.state
    if (index === cameraExpand) {
      this.setState({
        cameraExpand: -1,
      })
    } else {
      this.setState({
        cameraExpand: index,
      })
    }
  }

  onAccessMenuClick = accessInfo => {
    let { dispatch } = this.props
    console.log('accessInfo: ', accessInfo)
    if (accessInfo.EquipmentTypeID !== 3) return
    let eventLogs = this.props.eventInfo.eventLogs
    getSecurityEventsByDeviceID(accessInfo, eventLogs, dispatch)
    document.getElementById('root').style.cursor = 'wait'
    triggerManualEvent()
  }

  onDeckSensorDropDownClick = index => {
    let { deckSensorExpand } = this.state
    let tempIndex = -1
    if (deckSensorExpand !== index) {
      tempIndex = index
    }
    this.setState({
      deckSensorExpand: tempIndex,
    })
  }

  onEventItemClick = type => {
    console.log(type)
    let { addEventView, removeView } = this.props
    if (type === 0) {
      addEventView()
    }
    if (type === 1) {
      removeView('eventView')
    }
  }

  render() {
    let { decks, devices, deckLocations, urls, accessInfo, deckZonesInfo } = this.props
    let deckZones
    if (deckZonesInfo.deckZones) {
      deckZones = deckZonesInfo.deckZones
    }
    let securityLevel = cookie.load('UserSecurityClearance')
    let solarisLogo = 'resources/images/logo/4.png'
    let customViewImage = 'resources/images/icons/SVG/View Layout Icon.svg'
    let deckViewImage = 'resources/images/icons/SVG/Deck Select Icon.svg'
    let volumeImage = 'resources/images/icons/SVG/Sound On Icon.svg'
    let cameraViewImage = 'resources/images/icons/SVG/Cam Generic Icon.svg'
    let camLiftImage = 'resources/images/icons/SVG/Cam Lift Icon.svg'
    let playbackImage = 'resources/images/icons/SVG/Playback Icon.svg'
    let accessControlImage = 'resources/images/icons/SVG/Access Control Icon.svg'
    let deckSensorImage = 'resources/images/icons/SVG/Deck Sensor Icon.svg'
    let droneImage = 'resources/images/icons/SVG/Drone Icon.svg'
    let eventLogImage = 'resources/images/icons/SVG/Event Log Icon.svg'
    let palladiumLogoImage = 'resources/images/icons/SVG/Palladium Logo.svg'
    let securityLevelImage =
      'resources/images/icons/SVG/' + 'Security Level ' + securityLevel + '.svg'
    return (
      <div className="topMenu">
        <ul className="nav" style={{ height: '4rem' }}>
          <li className="mySolaris">
            <img className="logoImage" src={solarisLogo} alt="CustomView" />
          </li>
          <li>
            <img className="menuItemImage" src={customViewImage} alt="CustomView" />
            <DropDownViewOption type="VIEW OPTIONS" />
          </li>
          <li>
            <img className="menuItemImage" src={deckViewImage} alt="DeckView" />
            <DropDownDecks
              type="DECK SELECT"
              decks={decks.decksArray}
              currentDeck={decks.currentDeck}
              onSelect={this.selectDeck}
              widgetInfo={this.props.widgetInfo.deckView}
            />
          </li>
          <li>
            <img className="menuItemImage" src={volumeImage} alt="Volume" />
            <DropDownSound type="SOUND" />
          </li>
          <li>
            <img className="menuItemImage" src={cameraViewImage} alt="CameraView" />
            <DropDownCameras
              type={'CAMERAS'}
              decks={decks.decksArray}
              cameras={urls.cameras}
              currentCamera={devices.currentCamera}
              devices={devices.devicesArray}
              deckLocations={deckLocations.deckLocationArray}
              onCameraSelect={this.onCameraSelect}
              onExpand={this.onCameraExpand}
              expandedIndex={this.state.cameraExpand}
              widgetInfo={this.props.widgetInfo.cameraViews}
            />
          </li>
          <li>
            <img className="menuItemImage" src={camLiftImage} alt="CameraLift" />
            <DropDownCamLift type={'CAM LIFTS'} />
          </li>
          <li>
            <img className="menuItemImage" src={playbackImage} alt="Playback" />
            <DropDownPlayback
              type={'CAMERAS'}
              decks={decks.decksArray}
              cameras={urls.cameras}
              currentPlayback={urls.playbackCamera}
              devices={devices.devicesArray}
              deckLocations={deckLocations.deckLocationArray}
              onSelect={this.selectPlayback}
              onExpand={this.onPlaybackExpand}
              expandedIndex={this.state.playbackExpand}
            />
          </li>
          <li>
            <img className="menuItemImage" src={accessControlImage} alt="AccessControl" />
            <DropDownAccessPoint
              type={'ACCESS CONTROL'}
              decks={decks.decksArray}
              devices={devices.devicesArray}
              deckLocations={deckLocations.deckLocationArray}
              accessInfo={accessInfo}
              onAccessMenuClick={this.onAccessMenuClick}
              onAccessDeckExpand={this.onAccessDeckExpand}
              expandedIndex={this.state.accessDeckExpand}
            />
          </li>
          <li>
            <img className="menuItemImage" src={deckSensorImage} alt="DeckSensor" />
            <DropDownDeckSensor
              type={'DECK SENSORS'}
              deckZones={deckZones}
              dropDownItemClick={this.onDeckSensorDropDownClick}
              expandedIndex={this.state.deckSensorExpand}
            />
          </li>
          <li>
            <img className="menuItemImage" src={droneImage} alt="DroneView" />
            <DropDown type={'DRONE VIEW'} />
          </li>
          <li>
            <img className="menuItemImage" src={eventLogImage} alt="EventLog" />
            <DropDownEvent type={'EVENT LOG'} onClick={this.onEventItemClick} />
          </li>
          <li className={'palladiumLogo'}>
            <img
              className="menuItemImage bigItemImage"
              src={palladiumLogoImage}
              alt="PalladiumLogo"
            />
            <DropDown type={'PALLADIUM TECHNOLOGIES'} />
          </li>
          <li className={'securityLavel'}>
            <img
              className="menuItemImage bigItemImage"
              src={securityLevelImage}
              alt="SecurityLevel"
            />
            <DropDown />
          </li>
        </ul>
      </div>
    )
  }
}

function DropDown(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-road" aria-hidden="true" /> History
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">History book 1</a>
          </li>
          <li>
            <a href="#">History book 2</a>
          </li>
          <li>
            <a href="#">History book 3</a>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-paper-plane" aria-hidden="true" /> Fiction
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">Fiction book 1</a>
          </li>
          <li>
            <a href="#">Fiction book 2</a>
          </li>
          <li>
            <a href="#">Fiction book 3</a>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-quote-left" aria-hidden="true" /> Fantasy
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">Fantasy book 1</a>
          </li>
          <li>
            <a href="#">Fantasy book 2</a>
          </li>
          <li>
            <a href="#">Fantasy book 3</a>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-motorcycle" aria-hidden="true" /> Action
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">Action book 1</a>
          </li>
          <li>
            <a href="#">Action book 2</a>
          </li>
          <li>
            <a href="#">Action book 3</a>
          </li>
        </ul>
      </li>
    </ul>
  )
}

function DropDownViewOption(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">LOAD CUSTOM</div>
      </li>
      <li>
        <div className="dropdownlink">SAVE CUSTOM</div>
      </li>
    </ul>
  )
}

function DropDownDecks(props) {
  let { type, decks, currentDeck, onSelect, widgetInfo } = props
  let visible = widgetInfo.visible
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let className = 'dropdownlink'
        let shown = false
        if (currentDeck === deck && visible) {
          shown = true
          className += ' shown'
        }
        return (
          <li onClick={onSelect.bind(this, deck, shown)}>
            <div className={className}>
              {deck.DeckName}
              {shown ? <i className={'fa fa-eye'} /> : <i className={'fa fa-eye-slash'} />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownSound(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">ON</div>
      </li>
      <li>
        <div className="dropdownlink">OFF</div>
      </li>
    </ul>
  )
}

function DropDownCameras(props) {
  let {
    type,
    decks,
    cameras,
    devices,
    deckLocations,
    onCameraSelect,
    onExpand,
    expandedIndex,
    widgetInfo,
  } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let deckNumber = deck.DeckNumber
        let deckCameras = []
        let currentLocations = deckLocations.filter(location => {
          return location.DeckNumber === deckNumber
        })
        currentLocations.map(location => {
          let locationId = location.LocationID
          let curDevice = devices.find(device => {
            return device.LocationID === locationId && device.EquipmentTypeID === 2
          })
          if (curDevice !== undefined) {
            deckCameras.push(curDevice)
          }
        })
        let cameraPtzImage = 'resources/images/icons/camera-ptz.png'
        let cameraFixedImage = 'resources/images/icons/camera-fixed.png'
        let camera360Image = 'resources/images/icons/camera-360.png'
        let index = decks.indexOf(deck)
        return (
          <li>
            <div className="dropdownlink" onClick={onExpand.bind(this, index)}>
              <i
                className={
                  index !== expandedIndex
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              {deck.DeckName}
            </div>
            <ul
              className="submenuItems"
              style={expandedIndex === index ? { display: 'block' } : { display: 'none' }}
            >
              {deckCameras.map(camera => {
                let className = 'listItem'
                let curCamera = cameras.find(__camera => {
                  return __camera.Name === camera.DeviceName
                })
                if (typeof curCamera === 'undefined') return
                let curWidget = widgetInfo.find(widget => {
                  return widget.id === curCamera.Id
                })
                let visible = false
                let cameraId = ''
                if (typeof curWidget !== 'undefined' && curWidget.hasOwnProperty('visible')) {
                  visible = curWidget.visible
                  cameraId = curWidget.id
                }
                if (visible) {
                  className += ' shown'
                }
                return (
                  <li onClick={onCameraSelect.bind(this, cameraId, visible)}>
                    <div className={className}>
                      <img
                        className="liItemImage"
                        src={
                          camera.EquipmentSubTypeID === 2
                            ? cameraFixedImage
                            : camera.EquipmentSubTypeID === 3
                            ? cameraPtzImage
                            : camera360Image
                        }
                        alt="CameraImage"
                      />
                      <p className={'cameraName'}>{camera.DeviceName}</p>
                      {visible ? (
                        <i className="fa fa-eye" aria-hidden="true" />
                      ) : (
                        <i className="fa fa-eye-slash" aria-hidden="true" />
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownPlayback(props) {
  let {
    type,
    decks,
    cameras,
    devices,
    deckLocations,
    onSelect,
    currentPlayback,
    onExpand,
    expandedIndex,
  } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let deckNumber = deck.DeckNumber
        let deckCameras = []
        let currentLocations = deckLocations.filter(location => {
          return location.DeckNumber === deckNumber
        })
        currentLocations.map(location => {
          let locationId = location.LocationID
          let curDevice = devices.find(device => {
            return device.LocationID === locationId && device.EquipmentTypeID === 2
          })
          if (curDevice !== undefined) {
            deckCameras.push(curDevice)
          }
        })
        let cameraPtzImage = 'resources/images/icons/camera-ptz.png'
        let cameraFixedImage = 'resources/images/icons/camera-fixed.png'
        let camera360Image = 'resources/images/icons/camera-360.png'
        let index = decks.indexOf(deck)
        return (
          <li>
            <div className="dropdownlink" onClick={onExpand.bind(this, index)}>
              <i
                className={
                  expandedIndex !== index
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              {deck.DeckName}
            </div>
            <ul
              className="submenuItems"
              style={expandedIndex === index ? { display: 'block' } : { display: 'none' }}
            >
              {deckCameras.map(camera => {
                let className = 'listItem'
                if (
                  typeof currentPlayback !== 'undefined' &&
                  currentPlayback.hasOwnProperty('Name') &&
                  camera.DeviceName === currentPlayback.Name
                )
                  className += ' selected'
                return (
                  <li onClick={onSelect.bind(this, camera, cameras)}>
                    <div className={className}>
                      <img
                        className="liItemImage"
                        src={
                          camera.EquipmentSubTypeID === 2
                            ? cameraFixedImage
                            : camera.EquipmentSubTypeID === 3
                            ? cameraPtzImage
                            : camera360Image
                        }
                        alt="CameraImage"
                      />
                      <p className={'cameraName'}>{camera.DeviceName}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownCamLift(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-caret-right parentItem" aria-hidden="true" />
          ALL
        </div>
        <ul className="submenuItems">
          <li>UP</li>
          <li>DOWN</li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-caret-right parentItem" aria-hidden="true" />
          BY CAMERA
        </div>
        <ul className="submenuItems">
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              OBSERVATION FORE DECK
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              AFT OPEN DECK AREA SS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              AFT OPEN DECK AREA PS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              OWNERS DECK SS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              OWNERS DECK PS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              MAIN OUTDOOR DINING SS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              MAIN OUTDOOR DINING PS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              OPEN DECK AREA PS
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
          <li>
            <div className="dropdownlink">
              <i className="fa fa-caret-right" aria-hidden="true" />
              CAMERA 9
            </div>
            <ul className="submenuItems">
              <li>UP</li>
              <li>DOWN</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  )
}

function DropDownAccessPoint(props) {
  let {
    type,
    decks,
    devices,
    deckLocations,
    accessInfo,
    onAccessMenuClick,
    onAccessDeckExpand,
    expandedIndex,
  } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let deckNumber = deck.DeckNumber
        let index = decks.indexOf(deck)
        let curDevices = []
        let curLocations = deckLocations.filter(deckLocation => {
          return deckLocation.DeckNumber === deck.DeckNumber
        })
        curLocations.map(location => {
          let device = devices.find(device => {
            return device.LocationID === location.LocationID
          })
          if (typeof device !== 'undefined') {
            let deviceInfo = Object.assign({}, device, location)
            curDevices.push(deviceInfo)
          }
        })
        curDevices = curDevices.filter(device => {
          return device.EquipmentTypeID === 3
        })
        return (
          <li>
            <div className="dropdownlink" onClick={onAccessDeckExpand.bind(this, index)}>
              <i
                className={
                  expandedIndex !== index
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              {deck.DeckName}
            </div>
            <ul
              className="submenuItems"
              style={expandedIndex === index ? { display: 'block' } : { display: 'none' }}
            >
              {curDevices.map(device => {
                let accessInfo = device
                accessInfo.enabled = true
                accessInfo.DeckName = deck.DeckName
                let className = 'listItem'
                return (
                  <li onClick={onAccessMenuClick.bind(this, accessInfo)}>
                    <div className={className}>
                      <p
                        className={'cameraName'}
                        style={{ textAlign: 'left', paddingLeft: '20px' }}
                      >
                        {'- ' + device.LocationName}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownDeckSensor(props) {
  let { type, deckZones, dropDownItemClick, expandedIndex } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink" onClick={dropDownItemClick.bind(this, 0)}>
          <i
            className={
              expandedIndex !== 0 ? 'fa fa-caret-right parentItem' : 'fa fa-caret-down parentItem'
            }
            aria-hidden="true"
          />
          <span className={'subTitle'}>{'ALL'}</span>
        </div>
        <ul
          className="submenuItems"
          style={expandedIndex === 0 ? { display: 'block' } : { display: 'none' }}
        >
          <li>
            <div className={'listItem functionItem'}>{'ON'}</div>
          </li>
          <li>
            <div className={'listItem functionItem'}>{'OFF'}</div>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink" onClick={dropDownItemClick.bind(this, 1)}>
          <i
            className={
              expandedIndex !== 1 ? 'fa fa-caret-right parentItem' : 'fa fa-caret-down parentItem'
            }
            aria-hidden="true"
          />
          <span className={'subTitle'}>{'BY ZONE'}</span>
        </div>
        <ul
          className="submenuItems"
          style={expandedIndex === 1 ? { display: 'block' } : { display: 'none' }}
        >
          {deckZones.map(deckZone => {
            if (deckZone.DeckZoneName === 'No Zone') return <div />
            return (
              <li>
                <div className={'subCaption'}>{deckZone.DeckZoneName}</div>
                <div className={'listItem functionItem'}>{'ON'}</div>
                <div className={'listItem functionItem'}>{'OFF'}</div>
              </li>
            )
          })}
        </ul>
      </li>
    </ul>
  )
}

function DropDownEvent(props) {
  let { type, onClick } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink" onClick={onClick.bind(this, 0)}>
          OPEN
        </div>
      </li>
      <li>
        <div className="dropdownlink" onClick={onClick.bind(this, 1)}>
          CLOSE
        </div>
      </li>
    </ul>
  )
}

export default TopMenu
