import React from 'react'
import { connect } from 'react-redux'
import rootReducer from 'ducks/redux'
import './style.scss'
import cookie from 'react-cookie'
import { message } from 'antd'

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

let socketUrl = rootReducer.socketUrl

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class SecuritySetting extends React.Component {
  state = {
    selectedLevel: 0,
  }

  ws = new WebSocket(socketUrl)
  socketOpened = false

  componentDidMount() {
    this.ws.onopen = () => {
      console.log('opened')
      this.socketOpened = true
    }

    this.ws.onmessage = evt => {
      var received_msg = evt.data
      let result_array = received_msg.split('<')
      if (result_array.length > 1) {
        let command_type = result_array[1].slice(0, -1)
        switch (command_type) {
          case 'UserChangeSecurityLevel': {
            if (result_array.length === 6) {
              let result = result_array[5].slice(0, -1)
              if (result === 'OK') {
                let data = '<GetSystemInfo>'
                this.ws.send(data)
              }
            }
            break
          }
          case 'GetSystemInfo': {
            if (result_array.length === 7) {
              let securityLevel = result_array[4].slice(0, -1)
              let result = result_array[2].slice(0, -1)
              if (result === 'OK') {
                let { dispatch } = this.props
                dispatch({
                  type: 'SET_System_Security_Level',
                  systemSecurityLevel: securityLevel,
                })
              }
              document.getElementById('root').style.cursor = 'default'
            }
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

  selectLevel = index => {
    this.setState({
      selectedLevel: index,
    })
  }

  openSocket = data => {
    this.ws = new WebSocket(socketUrl)
    this.ws.onopen = () => {
      console.log('opened')
      this.socketOpened = true
      this.ws.send(data)
    }
    this.ws.onmessage = evt => {
      var received_msg = evt.data
      document.getElementById('root').style.cursor = 'default'
    }

    this.ws.onclose = () => {
      // websocket is closed.
      console.log('Connection is closed...')
      this.socketOpened = false
      document.getElementById('root').style.cursor = 'default'
    }

    this.ws.onerror = () => {
      message.error('Cannot connect to Safety and Security System.')
      document.getElementById('root').style.cursor = 'default'
    }

    setTimeout(() => {
      if (!this.socketOpened) {
        //message.error('Cannot connect to Safety and Security System.');
      }
    }, 2000)
  }

  setSecurityLevel = () => {
    let { selectedLevel } = this.state
    if (selectedLevel === 0) {
      message.error('PLEASE SELECT SYSTEM SECURITY LEVEL.')
      return
    }
    let currentSecurityLevel = cookie.load('SecurityLevelId')
    if (currentSecurityLevel === selectedLevel.toString()) {
      document.getElementById('root').style.cursor = 'default'
    } else {
      let userName = cookie.load('UserName')
      let password = cookie.load('Password')
      let userPermission = cookie.load('SystemSecurityLevel')
      if (userPermission !== 'Modify System Security Level') {
        message.error('YOU CAN NOT CHANGE SYSTEM SECURITY LEVEL.')
        document.getElementById('root').style.cursor = 'default'
      } else {
        let data =
          '<UserChangeSecurityLevel><' + userName + '><' + password + '><' + selectedLevel + '>'
        if (!this.socketOpened) {
          this.openSocket(data)
        } else {
          this.ws.send(data)
          document.getElementById('root').style.cursor = 'wait'
        }
      }
    }
    this.setState({
      selectedLevel: 0,
    })
    let { onClose } = this.props
    onClose()
  }

  render() {
    let cornerImage = 'resources/images/background/blue-corner.png'
    let { selectedLevel } = this.state
    let { display, onClose } = this.props
    return (
      <div className="SecuritySettingView" style={{ display: display }}>
        <div className={'captionArea'}>CHANGE SECURITY LEVEL</div>
        <div className={'SecurityNumberArea'}>
          <div
            className={selectedLevel === 1 ? 'NumberButton first selected' : 'NumberButton first'}
            onClick={this.selectLevel.bind(this, 1)}
          >
            1
          </div>
          <div
            className={selectedLevel === 2 ? 'NumberButton second selected' : 'NumberButton second'}
            onClick={this.selectLevel.bind(this, 2)}
          >
            2
          </div>
          <div
            className={selectedLevel === 3 ? 'NumberButton third selected' : 'NumberButton third'}
            onClick={this.selectLevel.bind(this, 3)}
          >
            3
          </div>
        </div>
        <div className={'buttonArea'}>
          <div className={'setButton'} onClick={this.setSecurityLevel}>
            CHANGE
          </div>
        </div>
        <button className={'closeButton'} onClick={onClose} />
      </div>
    )
  }
}

export default SecuritySetting
