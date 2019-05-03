import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getSecurityEventsByCameraId } from 'ducks/CameraEventView'
import rootReducer from 'ducks/redux'
import './style.scss'
import {message} from "antd";
import cookie from "react-cookie";

let socketUrl = rootReducer.socketUrl

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class CameraPopup extends React.Component {
    ws = new WebSocket(socketUrl)
    socketOpened = false

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('opened')
            this.socketOpened = true
        }

        this.ws.onmessage = evt => {
            console.log('receive mag', evt.data)
            var received_msg = evt.data
            let result_array = received_msg.split('<')
            if (result_array.length > 1) {
                let command_type = result_array[1].slice(0, -1)
                switch (command_type) {
                    case 'CameraLiftActionSingle': {
                        if (result_array.length === 6) {
                            let result = result_array[5].slice(0, -1)
                            if (result === 'OK') {
                                this.setState({
                                    securitySettingDisplay: 'block',
                                })
                            } else {
                                message.error('User has no permission for setting system security level.')
                            }
                        }
                        document.getElementById('root').style.cursor = 'default'
                        break
                    }
                }
            }
        }

        this.ws.onclose = () => {
            // websocket is closed.
            console.log('Connection is closed...')
            this.socketOpened = false
            document.getElementById('root').style.cursor = 'default'
        }
    }

    openSocket = () => {
        this.ws.onopen = () => {
            console.log('opened')
            this.socketOpened = true
        }

        this.ws.onmessage = evt => {
            console.log('receive mag', evt.data)
            var received_msg = evt.data
            let result_array = received_msg.split('<')
            if (result_array.length > 1) {
                let command_type = result_array[1].slice(0, -1)
                switch (command_type) {
                    case 'CameraLiftActionSingle': {
                        if (result_array.length === 6) {
                            let result = result_array[5].slice(0, -1)
                            if (result === 'OK') {
                                this.setState({
                                    securitySettingDisplay: 'block',
                                })
                            } else {
                                message.error('User has no permission for setting system security level.')
                            }
                        }
                        document.getElementById('root').style.cursor = 'default'
                        break
                    }
                }
            }
        }

        this.ws.onclose = () => {
            // websocket is closed.
            console.log('Connection is closed...')
            this.socketOpened = false
            document.getElementById('root').style.cursor = 'default'
        }

        setTimeout(() => {
            if (!this.socketOpened) {
                //message.error('Cannot connect to Safety and Security System.');
            }
        }, 2000)
    }

    onRaiseLowerClick = () => {
        if (!this.socketOpened) {
            this.openSocket();
            message.error('Socket is disconnected! ...Please try again.');
        }
    };

    onCamDisplayClick = cameraID => {
        let { addCameraView } = this.props
        addCameraView(cameraID)
    };

    onEventHistoryClick = () => {
        let { dispatch, info } = this.props;
        dispatch({
            type: 'SET_CAMERA_EVENT_VIEW_DISPLAY',
            display: true,
            cameraInfo: info,
        });
        getSecurityEventsByCameraId(info.accessInfo.DeviceID, dispatch);

    };

    render() {
        let { info, displayInfo } = this.props
        let { display, left, top } = displayInfo
        let cameraId = ''
        let visible = false
        if (info.accessInfo) {
            console.log("CameraInfo: ", info);
            cameraId = info.accessInfo.camera?info.accessInfo.camera.Id:'';
            visible = info.accessInfo.cameraViewInfo?info.accessInfo.cameraViewInfo.visible:true;
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
                <div className={'option'} onClick={this.onRaiseLowerClick}>
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
