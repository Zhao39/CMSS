import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getSecurityEventsByDeviceID } from 'ducks/logHistory'
import CameraPopup from './CameraPopup'
import DeckSensorPopup from './DeckSensorPopup'
import { triggerManualEvent } from 'ducks/Milestone'
import './style.scss'

const mapStateToProps = (state, props) => ({
    urls: state.urls,
    decks: state.decksInfo,
    devices: state.devicesInfo,
    deckLocations: state.deckLocationsInfo,
    accessInfo: state.accessInfo,
    eventInfo: state.eventInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class DeckView extends React.PureComponent {
    state = {
        border: 'blue',
        cameraPopupDisplay: {
            display: 'none',
            left: 0,
            top: 0,
        },
        cameraPopupInfo: {},
        deckSensorPopupDisplay: {
            display: 'none',
            left: 0,
            top: 0,
        },
        deckSensorPopupInfo: {},
    };

    componentDidMount = () => {
        this.setState({
            //dimensions: {
            //width: this._element.current.clientWidth,
            //height: this._element.current.clientHeight
            //}
        })
    };

    onDeckSelect = deck => {
        let { dispatch } = this.props;
        if (typeof deck !== 'undefined') {
            dispatch({
                type: 'SET_CUR_DECK',
                currentDeck: deck,
            });
        }
    };

    onDeckViewClick = e => {
        console.log(e.target.classList);
        if (
            e.target.classList.contains('deckImage') ||
            e.target.classList.contains('option') ||
            e.target.classList.contains('functionItem')
        ) {
            this.setState({
                cameraPopupDisplay: {
                    display: 'none',
                    left: 0,
                    top: 0,
                },
                cameraPopupInfo: {},
            });
            this.setState({
                deckSensorPopupDisplay: {
                    display: 'none',
                    left: 0,
                    top: 0,
                },
                deckSensorPopupInfo: {},
            });
        }
    };

    onDeviceClick = (accessInfo, e) => {
        let { dispatch } = this.props;
        switch (accessInfo.EquipmentTypeID) {
            case 2: {
                this.setState({
                    cameraPopupDisplay: {
                        display: 'block',
                        left: accessInfo.left,
                        top: accessInfo.top,
                    },
                    cameraPopupInfo: {},
                });

                this.setState({
                    deckSensorPopupDisplay: {
                        display: 'none',
                        left: 0,
                        top: 0,
                    },
                    deckSensorPopupInfo: {},
                });
                break;
            }
            case 3: {
                this.setState({
                    cameraPopupDisplay: {
                        display: 'none',
                        left: 0,
                        top: 0,
                    },
                    cameraPopupInfo: {},
                });
                this.setState({
                    deckSensorPopupDisplay: {
                        display: 'none',
                        left: 0,
                        top: 0,
                    },
                    deckSensorPopupInfo: {},
                });
                let eventLogs = this.props.eventInfo.eventLogs;

                console.log("DeviceClick");
                document.getElementById('root').style.cursor = 'wait';
                triggerManualEvent();
                setTimeout(() => {
                    getSecurityEventsByDeviceID(accessInfo, eventLogs, dispatch)
                }, 100);
                break;
            }
            case 5: {
                this.setState({
                    deckSensorPopupDisplay: {
                        display: 'block',
                        left: accessInfo.left,
                        top: accessInfo.top,
                    },
                    deckSensorPopupInfo: {},
                });
                this.setState({
                    cameraPopupDisplay: {
                        display: 'none',
                        left: 0,
                        top: 0,
                    },
                    cameraPopupInfo: {},
                });
                break;
            }
        }
    }

    onResize = () => {
        console.log('resizing now')
    }

    render() {
        // let width = 0,
        //     height = 0;
        // if (typeof this.divElement !== 'undefined') {
        //     width = this.divElement.clientWidth
        //     height = this.divElement.clientHeight
        // }
        let {
            border,
            cameraPopupDisplay,
            cameraPopupInfo,
            deckSensorPopupDisplay,
            deckSensorPopupInfo,
        } = this.state;
        let cornerImage = '';
        if (border === 'blue') {
            cornerImage = 'resources/images/background/blue-corner.png';
        }
        let { currentDeck, decksArray } = this.props.decks;
        let { devices, deckLocations, dispatch } = this.props;
        let deviceArray = devices.devicesArray;
        let deckLocationArray = deckLocations.deckLocationArray;
        let curLocations = [],
            curDevices = [];
        if (
            typeof currentDeck !== 'undefined' &&
            !currentDeck.hasOwnProperty('DeckName') &&
            decksArray.length > 0
        ) {
            this.props.dispatch({
                type: 'SET_CUR_DECK',
                currentDeck: decksArray[1],
            });
        } else {
            curLocations = deckLocationArray.filter(deckLocation => {
                return deckLocation.DeckNumber === currentDeck.DeckNumber;
            });
        }
        curLocations.map(location => {
            let device = deviceArray.find(device => {
                return device.LocationID === location.LocationID
            })
            if (typeof device !== 'undefined') {
                let deviceInfo = Object.assign({}, device, location);
                curDevices.push(deviceInfo);
            }
        });
        //let deckImage = 'resources/images/icons/SVG/Deck ' + currentDeck.DeckNumber + ' Schematic.svg'
        let deckImage = 'resources/images/decks/deck' + currentDeck.DeckNumber + '.png';

        return (
            <div
                className="DeckViewController"
                id={'DeckViewController'}
                ref={divElement => (this.divElement = divElement)}
                onClick={this.onDeckViewClick}
            >
                {currentDeck.hasOwnProperty('DeckName') ? (
                    <img className={'deckImage'} src={deckImage} alt={currentDeck.DeckName} />
                ) : (
                    <div />
                )}
                <div
                    className="h7 deckName blue"
                    style={{ display: currentDeck.hasOwnProperty('DeckName') ? 'block' : 'none' }}
                >
                    <i className="fa fa-caret-right" aria-hidden="true" />
                    {currentDeck.DeckName}
                    <ul className="dropdown">
                        {decksArray.map(deck => {
                            if (deck.DeckName === 'No Deck') return <div />;
                            let className = 'dropdownlink';
                            if (currentDeck === deck) {
                                className += ' selected';
                            }
                            return (
                                <li onClick={this.onDeckSelect.bind(this, deck)}>
                                    <div className={className}>{deck.DeckName}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {curDevices.map(device => {
                    //let s_w = this.divElement.clientWidth
                    //let s_h = this.divElement.clientHeight
                    let {
                        DeviceID,
                        DeviceName,
                        EquipmentTypeID,
                        EquipmentSubTypeID,
                        LocationX,
                        LocationY,
                    } = device
                    let left = LocationX * 100
                    let top = 50 + LocationY * 50
                    //let top = s_h/2 + LocationY * (467 * s_w/(1920*2));
                    let buttonImage = ''
                    let accessInfo = {}
                    switch (EquipmentTypeID) {
                        case 2: {
                            let currentCamera = this.props.devices.currentCamera
                            let playbackCamera = this.props.urls.playbackCamera
                            let isSelected = false
                            if (
                                typeof currentCamera !== 'undefined' &&
                                currentCamera.hasOwnProperty('DeviceName')
                            ) {
                                if (currentCamera.DeviceName === DeviceName) {
                                    isSelected = true
                                }
                            }
                            if (typeof playbackCamera !== 'undefined' && playbackCamera.hasOwnProperty('Name')) {
                                if (playbackCamera.Name === DeviceName) {
                                    isSelected = true
                                }
                            }
                            if (isSelected) {
                            }

                            switch (EquipmentSubTypeID) {
                                case 2: {
                                    if (isSelected) {
                                        buttonImage = 'resources/images/decks/cameras/2/cameraFixedGreen.png'
                                    } else {
                                        buttonImage = 'resources/images/decks/cameras/2/cameraFixedBlue.png'
                                    }
                                    break
                                }
                                case 3: {
                                    if (isSelected) {
                                        buttonImage = 'resources/images/decks/cameras/2/cameraPTZGreen.png'
                                    } else {
                                        buttonImage = 'resources/images/decks/cameras/2/cameraPTZBlue.png'
                                    }
                                    break
                                }
                                case 4: {
                                    if (isSelected) {
                                        buttonImage = 'resources/images/decks/cameras/2/camera360Green.png'
                                    } else {
                                        buttonImage = 'resources/images/decks/cameras/2/camera360Blue.png'
                                    }
                                    break
                                }
                            }
                            accessInfo = device
                            accessInfo.left = left
                            accessInfo.top = top
                            break
                        }
                        case 3: {
                            if (typeof currentDeck === 'undefined' || !currentDeck.hasOwnProperty('DeckName'))
                                return
                            //console.log("currentDeck: ", current);
                            accessInfo = device
                            accessInfo.enabled = true
                            accessInfo.DeckName = currentDeck.DeckName
                            switch (EquipmentSubTypeID) {
                                case 5: {
                                    buttonImage = 'resources/images/decks/accessControlGreen.png'
                                    break
                                }
                                case 6: {
                                    buttonImage = 'resources/images/decks/accessControlGreen.png'
                                    break
                                }
                            }
                            break
                        }
                        case 4: {
                            break
                        }
                        case 5: {
                            accessInfo = device
                            accessInfo.left = left
                            accessInfo.top = top
                            buttonImage = 'resources/images/decks/deckSensorGreen.png'
                            break
                        }
                    }
                    return (
                        <button
                            className={'securityDevice'}
                            style={{ left: left + '%', top: top + '%' /*'px'*/ }}
                            onClick={this.onDeviceClick.bind(this, accessInfo)}
                        >
                            <img src={buttonImage} className={'deviceButtonImage'} />
                        </button>
                    )
                })}
                <CameraPopup displayInfo={cameraPopupDisplay} info={cameraPopupInfo} />
                <DeckSensorPopup displayInfo={deckSensorPopupDisplay} info={deckSensorPopupInfo} />
                <img src={cornerImage} className="cornerImage" alt="corner" />
            </div>
        )
    }
}

export default DeckView
