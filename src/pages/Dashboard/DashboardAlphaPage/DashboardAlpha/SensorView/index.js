import React from 'react'
import Unity, { UnityContent } from 'react-unity-webgl';
import { connect } from 'react-redux'
import './style.scss'

const mapStateToProps = (state, props) => ({
    urls: state.urls,
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class SensorView extends React.Component {
    state = {
        border: 'blue',
    };
    constructor(props) {
        super(props);

        this.unityContent = new UnityContent(
            "Build/webgl.json",
            "Build/UnityLoader.js"
        );
    }

    componentDidMount() {}

    render() {
        let { border } = this.state;
        let cornerImage = '';
        if (border === 'blue') {
            cornerImage = 'resources/images/background/blue-corner.png'
        }

        return (
            <div className={"CameraController"}>
                <Unity unityContent={this.unityContent} />
                <img src={cornerImage} className="cornerImage" alt="corner" />
            </div>
        )
    }
}

export default SensorView
