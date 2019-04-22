import React from 'react'
import { connect } from 'react-redux'
import { getAllSecurityEvents } from 'ducks/event'
import $ from 'jquery'
import './style.scss'

let scroll_flag = true;
let update_flag = true;
let eventRow_count = 100;

const mapStateToProps = (state, props) => ({
  cameraEventViewInfo: state.cameraEventViewInfo
});

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
});

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class CameraEventView extends React.Component {
  state = {
    border: 'blue',
    sortType: 'datetime',
    sortOrder: 0,
    limit_count: 100,
  }

  componentDidMount() {}

  onSortClick = type => {
      let { sortType, sortOrder } = this.state
      let { dispatch } = this.props
      if (sortType === type) {
          getAllSecurityEvents(dispatch, type, 1 - sortOrder)
          dispatch({
              type: 'SET_EVENT_LOG',
              eventLogs: [],
          });
          this.setState({
              sortOrder: 1 - sortOrder,
              limit_count: 100,
          })
      } else {
          getAllSecurityEvents(dispatch, type, 1);
          dispatch({
              type: 'SET_EVENT_LOG',
              eventLogs: [],
          });
          this.setState({
              sortType: type,
              sortOrder: 1,
              limit_count: 100,
          })
      }
      eventRow_count = 100;
      $('#cameraEventTableContainer').scrollTop(0);
      $('#cameraEventTableContainer').find(".tableArea").css('display', 'none');
  };

  handleScroll = e => {
      var node = e.target;
      let { dispatch } = this.props;
      if (node.scrollTop === 0) {
          scroll_flag = !scroll_flag;
          eventRow_count = 100;
          dispatch({
              type: 'SET_UPDATE',
              update: true,
          })
      } else {
          if(scroll_flag) {
              scroll_flag = !scroll_flag;
              dispatch({
                  type: 'SET_UPDATE',
                  update: false,
              })
          }
      }
      const bottom = node.scrollHeight - node.scrollTop - node.clientHeight
      if (bottom < 10) {
          update_flag = !update_flag;
          let eventLogs = [];
          let { cameraEventViewInfo } = this.props;
          let eventArray = cameraEventViewInfo.cameraEventArray;
          let cur_eventArray = [];
          let count = 0;
          if (typeof eventArray !== 'undefined') {
              count = eventRow_count + 100 > eventArray.length ? eventArray.length : eventRow_count + 100;
              cur_eventArray = eventArray.slice(eventRow_count, count);
          }
          cur_eventArray.forEach(event => {
              let row = {};
              row.eventType = event.EventMsg.toUpperCase()
              row.datetime = new Date(event.DateTime)
                  .toLocaleString('en-GB', { timeZone: 'UTC' })
                  .replace(',', '')
              row.device = event.SecurityDevice.DeviceName.toUpperCase()
              row.location = event.SecurityDevice.DeckLocation.LocationName.toUpperCase()
              let type_temp = row.eventType.split(' ')
              if (type_temp.includes('GRANTED')) {
                  row.type = 'green'
              } else if (
                  type_temp.includes('SENSOR') ||
                  type_temp.includes('DETECTED') ||
                  type_temp.includes('MOTION')
              ) {
                  row.type = 'red'
              } else {
                  row.type = 'blue'
              }
              eventLogs.push(row)
          })
          eventLogs.forEach(log => {
              let className = 'row eventRow';
              switch (log.type) {
                  case 'red': {
                      className += ' redRow';
                      break;
                  }
                  case 'green': {
                      className += ' greenRow';
                      break;
                  }
                  case 'blue': {
                      className += ' blueRow';
                      break;
                  }
              }
              let new_row = $(`<div class="` + className + `">
                  <div class="col-3 eventItem">` + log.eventType + `</div>
                  <div class="col-3 eventItem">` + log.datetime + `</div>
                  <div class="col-3 eventItem">` + log.location + `</div>
                  <div class="col-3 eventItem">` + log.device + `</div>
                </div>`);
              $("#cameraEventTableContainer").find(".tableArea").append(new_row);
          });
          eventRow_count = count;
          /*this.setState({
            limit_count: limit_count + 100,
          })*/
      }
  };

  onClose = () => {
      let { dispatch } = this.props;
      dispatch({
          type: "SET_CAMERA_EVENT_VIEW_DISPLAY",
          display: false
      });
  };

  render() {
      let { border, sortType, sortOrder, limit_count } = this.state
      let cornerImage = ''
      if (border === 'blue') {
          cornerImage = 'resources/images/background/blue-corner.png'
      }
      let eventLogs = []
      let { cameraEventViewInfo } = this.props;
      // let eventInfo = cameraEventViewInfo.cameraEventArray;
      // console.log("CameraEventArray: ", eventInfo)
      let eventArray = [];
      if(cameraEventViewInfo) eventArray = cameraEventViewInfo.cameraEventArray;
      console.log("CameraEventArray: ", eventArray, cameraEventViewInfo)
      let cur_eventArray = [];
      let count = 0;
      if (typeof eventArray !== 'undefined') {
          count = limit_count > eventArray.length ? eventArray.length : limit_count;
          let start = 0;
          /*if(count > 300) {
            start = count - 300;
            if(update_flag) {
              $('#eventTableContainer').scrollTop($('#eventTableContainer').scrollTop() - 1000);
              update_flag = !update_flag;
            }
          }*/
          cur_eventArray = eventArray.slice(start, count);
      }

      cur_eventArray.forEach(event => {
          let row = {}
          row.eventType = event.EventMsg.toUpperCase()
          row.datetime = new Date(event.DateTime)
              .toLocaleString('en-GB', { timeZone: 'UTC' })
              .replace(',', '')
          row.device = event.SecurityDevice.DeviceName.toUpperCase()
          row.location = event.SecurityDevice.DeckLocation.LocationName.toUpperCase()
          let type_temp = row.eventType.split(' ')
          if (type_temp.includes('GRANTED')) {
              row.type = 'green'
          } else if (
              type_temp.includes('SENSOR') ||
              type_temp.includes('DETECTED') ||
              type_temp.includes('MOTION')
          ) {
              row.type = 'red'
          } else {
              row.type = 'blue'
          }
          eventLogs.push(row)
      })

      if($('#CameraEventTableContainer'))$('#CameraEventTableContainer').find(".tableArea").css('display', 'block');

    let display = cameraEventViewInfo.display?'block':'none';

    return (
      <div className="CameraEventLogView" style={{display: display}}>
        <div className={'captionArea'}>CAMERA EVENT LOG</div>
        <div className={'sortArea'}>
          <div
            className={sortType === 'datetime' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'datetime')}
          >
            {sortType === 'datetime' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
              <span className={'icon'}>
                <i className="fa fa-caret-right" />
              </span>
            )}
            <span className={'sortType'}>Event Time</span>
          </div>
          <div
            className={sortType === 'eventType' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'eventType')}
          >
            {sortType === 'eventType' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
              <span className={'icon'}>
                <i className="fa fa-caret-right" />
              </span>
            )}
            <span className={'sortType'}>Event Type</span>
          </div>
          <div
            className={sortType === 'location' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'location')}
          >
            {sortType === 'location' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
              <span className={'icon'}>
                <i className="fa fa-caret-right" />
              </span>
            )}
            <span className={'sortType'}>Location</span>
          </div>
          <div
            className={sortType === 'device' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'device')}
          >
            {sortType === 'device' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
              <span className={'icon'}>
                <i className="fa fa-caret-right" />
              </span>
            )}
            <span className={'sortType'}>Device Type</span>
          </div>
        </div>
        <div className={'headerArea row'}>
          <div className={'col-3 headerItem'}>EVENT</div>
          <div className={'col-3 headerItem'}>DATE/TIME</div>
          <div className={'col-3 headerItem'}>LOCATION</div>
          <div className={'col-3 headerItem'}>DEVICE</div>
        </div>
        <div className={'cameraEvent_mainContainer'} id={'CameraEventTableContainer'} onScroll={this.handleScroll}>
          <div className={'tableArea'}>
            {eventLogs.map(event => {
              let className = 'row eventRow'
              switch (event.type) {
                case 'red': {
                  className += ' redRow'
                  break
                }
                case 'green': {
                  className += ' greenRow'
                  break
                }
                case 'blue': {
                  className += ' blueRow'
                  break
                }
              }
              return (
                <div className={className}>
                  <div className={'col-3 eventItem'}>{event.eventType}</div>
                  <div className={'col-3 eventItem'}>{event.datetime}</div>
                  <div className={'col-3 eventItem'}>{event.location}</div>
                  <div className={'col-3 eventItem'}>{event.device}</div>
                </div>
              )
            })}
          </div>
        </div>
        <img src={cornerImage} className="cornerImage" alt="corner" />
        <button className={'closeButton'} onClick={this.onClose} />
      </div>
    )
  }
}

export default CameraEventView