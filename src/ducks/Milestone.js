/*import { createReducer } from 'redux-act'
import * as app from './app'*/

import {XPMobileSDKInterface, XPMobileSDKSettings } from "./XPMobileSDK";
import cookie from "react-cookie";
import {push} from "react-router-redux";
import {notification} from "antd";
import {createAction} from "redux-act";

const INITIAL_STATE = {/* connectInfo: {},*/ cameras: [], imageURLs: {}, playbackCamera: {}, playBackTime: {}, playBackTimeSeek: 0, isPlaying: false, videoInfo: {enabled: false} };

const REDUCER = 'app'
const NS = `@@${REDUCER}/`
const _setHideLogin = createAction(`${NS}SET_HIDE_LOGIN`)


export let mobileSDK = new XPMobileSDKInterface();
let disp;

export function connect(server, dispatch) {
    //connectMilestone(server, dispatch);
    disp = dispatch;
    if (!/^http/.test(server)) {
        server = 'http://' + server;
    }
    XPMobileSDKSettings.MobileServerURL = server;
    var observer = {
        connectionDidConnect: connectionDidConnect,
        connectionDidLogIn: connectionDidLogIn
    };
    mobileSDK.addObserver(observer);
    mobileSDK.connect(server);
}

/**
 * Connection state observing.
 */
function connectionDidConnect(parameters) {
    var username = 'User';//prompt('Username');
    var password = 'Pa$$w0rd';//prompt('Password');

    mobileSDK.login(username, password);
}

/**
 * Connection state observing.
 */
export function triggerManualEvent() {
    console.log("trigger manual event")
    let event = document.createEvent("MouseEvents");
    event.initMouseEvent("mousemove", true, false, window, 1, 50, 50, 50, 50, false, false, false, false, 0, null);
    document.body.dispatchEvent(event);
};

function connectionDidLogIn() {
    mobileSDK.getAllViews(function (items) {
        console.log('getAllViews: ', items);
        if(items != null && items[0].Items[0].Items[0].Items.length > 0){
            let cameras = items[0].Items[0].Items[0].Items;
            disp({
                type: 'SET_CAMERAS',
                cameras: cameras
            });
            disp(_setHideLogin(true));
            disp(push('/dashboard'));
            document.getElementById("root").style.cursor = "default";
            triggerManualEvent();
            notification.open({
                type: 'success',
                message: 'You have successfully logged in!',
                description:
                    'Welcome to the Clean UI Admin Template. The Clean UI Admin Template is a complimentary template that empowers developers to make perfect looking and useful apps!',
            });
            console.log('All Cameras parsed and saved for further use.', cameras);
        }


        //XPMobileSDK.createVideoPushConnection(

        //	function (videoPushConnection) {

        //		var vids = document.getElementsByTagName('video')
        //		video = vids.item(0);
        //		var canvases = document.getElementsByTagName('canvas');
        //		canvas =  canvases.item(0);
        //		canvasContext = canvas.getContext('2d');

        //		video.onloadedmetadata = function (event) {

        //			video.onloadedmetadata = function (event) {};
        //			video.play();
        //		};
        //		video.ontimeupdate = function (event) {

        //			video.ontimeupdate = function (event) {};
        //			videoPushConnection.open(onVideoPushConnection, function (error) {});
        //		};
        //		video.src = window.URL.createObjectURL(videoPushConnection.getMediaStream());
        //	},
        //	function (error) {}
        //);
    });
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_URL':
        {
            return { ...state, ...state.imageURLs[action.cameraId] = action.url}
        }
        case 'SET_PLAYBACK':
        {
            return {...state, ...state.playbackCamera = action.playbackCamera}
        }
        case 'SET_PLAYBACK_TIME':
        {
            return {...state, ...state.playBackTime = action.playBackTime}
        }
        case 'SET_PLAYBACK_TIME_SEEK':
        {
            return {...state, ...state.playBackTimeSeek = action.playBackTimeSeek}
        }
        case 'SET_PLAYBACK_VIDEO_DOWNLOAD':
        {
            return {...state, ...state.videoInfo = action.videoInfo}
        }
        case 'SET_CAMERAS':
        {
            return {...state, ...state.cameras = action.cameras}
        }
        default:
    }
    return state;
}