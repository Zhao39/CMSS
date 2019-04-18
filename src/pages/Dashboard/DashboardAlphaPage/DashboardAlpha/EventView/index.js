import React from 'react'
import { connect } from 'react-redux'
import { getAllSecurityEvents } from 'ducks/event'
import $ from 'jquery'
import './style.scss'

const mapStateToProps = (state, props) => ({
    urls: state.urls,
    eventInfo: state.eventInfo,
    devicesInfo: state.devicesInfo,
    deckLocationsInfo: state.deckLocationsInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class EventView extends React.Component {
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
            })
            this.setState({
                sortOrder: 1 - sortOrder,
                limit_count: 100,
            })
        } else {
            getAllSecurityEvents(dispatch, type, 1)
            dispatch({
                type: 'SET_EVENT_LOG',
                eventLogs: [],
            })
            this.setState({
                sortType: type,
                sortOrder: 1,
                limit_count: 100,
            })
        }

        $('#eventTableContainer').scrollTop(0)
    }

    handleScroll = e => {
        var node = e.target;
        let { dispatch } = this.props;
        if( node.scrollTop === 0 ) {
            dispatch({
                type: 'SET_UPDATE',
                update: true
            });
        } else {
            dispatch({
                type: 'SET_UPDATE',
                update: false
            });
        }
        const bottom = node.scrollHeight - node.scrollTop - node.clientHeight
        if (bottom < 1) {
            let { limit_count } = this.state
            console.log(bottom, limit_count, this.props.eventInfo.eventLogs.length)
            this.setState({
                limit_count: limit_count + 100,
            })
        }
    }

    render() {
        let { border, sortType, sortOrder, limit_count } = this.state;
        let cornerImage = '';
        if (border === 'blue') {
            cornerImage = 'resources/images/background/blue-corner.png';
        }
        let eventLogs = [];
        let { eventInfo } = this.props;
        let eventArray = eventInfo.eventLogs;
        let cur_eventArray = [];
        if(typeof eventArray !== 'undefined') {
            let count = limit_count > eventArray.length? eventArray.length : limit_count;
            cur_eventArray = eventArray.slice(0, count);
        }

        cur_eventArray.forEach(event => {
            let row = {};
            row.eventType = event.EventMsg.toUpperCase();
            row.datetime = new Date(event.DateTime)
                .toLocaleString('en-GB', { timeZone: 'UTC' })
                .replace(',', '');
            row.device = event.SecurityDevice.DeviceName.toUpperCase();
            row.location = event.SecurityDevice.DeckLocation.LocationName.toUpperCase();
            let type_temp = row.eventType.split(' ');
            if (type_temp.includes('GRANTED')) {
                row.type = 'green';
            } else if (
                type_temp.includes('SENSOR') ||
                type_temp.includes('DETECTED') ||
                type_temp.includes('MOTION')
            ) {
                row.type = 'red';
            } else {
                row.type = 'blue'
            }
            eventLogs.push(row);
        });

        return (
            <div className="EventLogView">
                <div className={'captionArea'}>EVENT LOG</div>
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
                <div className={'mainContainer'} id={'eventTableContainer'} onScroll={this.handleScroll}>
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
            </div>
        )
    }
}

export default EventView
