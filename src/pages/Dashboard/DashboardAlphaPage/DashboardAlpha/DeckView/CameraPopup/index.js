import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getSecurityEventsByCameraId } from 'ducks/CameraEventView'
import './style.scss'

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class CameraPopup extends React.Component {
  onOptionClick = type => {
    console.log(type)
    switch (type) {
      case 1: {
        break
      }
      case 2: {
      }
      case 3: {
        break
      }
    }
  }

  onCamDisplayClick = cameraID => {
    let { addCameraView } = this.props
    addCameraView(cameraID)
  }

  onEventHistoryClick = () => {
    let { dispatch, info } = this.props
    getSecurityEventsByCameraId(info.accessInfo.DeviceID, dispatch)
    dispatch({
      type: 'SET_CAMERA_EVENT_VIEW_DISPLAY',
      display: true,
      cameraInfo: info,
    })
  }

  render() {
    let { info, displayInfo } = this.props
    let { display, left, top } = displayInfo
    console.log('CameraInfo: ', info)
    let cameraId = ''
    let visible = false
    if (info.accessInfo) {
      cameraId = info.accessInfo.camera.Id
      visible = info.accessInfo.cameraViewInfo.visible
    }
    let displayCam = visible ? 'none' : 'block'
    return (
      <div
        className={'CameraPopup'}
        style={{
          display: display,
          left: left + 15 < 100 ? left + 1 + '%' : left - 16 + '%',
          top: top + 60 < 100 ? top + 5 + '%' : top - 60 + '%',
        }}
      >
        <div className={'caption'}>CAMERA OPTIONS</div>
        <div className={'option'} onClick={this.onOptionClick.bind(this, 1)}>
          RAISE/LOWER
        </div>
        <div
          className={'option'}
          style={{ display: displayCam }}
          onClick={this.onCamDisplayClick.bind(this, cameraId)}
        >
          DISPLAY CAM
        </div>
        <div className={'option'} onClick={this.onEventHistoryClick}>
          EVENT HISTORY
        </div>
      </div>
    )
  }
}

export default CameraPopup
