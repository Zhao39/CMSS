import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'

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
  }

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.cameraPosition = new THREE.Vector3(0, 0, 5)

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.

    this.state = {
      cubeRotation: new THREE.Euler(),
      border: 'blue',
    }

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0,
        ),
      })
    }
  }

  componentDidMount() {}

  render() {
    /*const {
            width,
            height,
        } = this.props;*/
    let width = 150
    let height = 180
    let { border } = this.state
    let borderImage = ''
    let cornerImage = ''
    if (border === 'blue') {
      cornerImage = 'resources/images/background/blue-corner.png'
    }
    return (
      <div className="CameraController">
        <React3
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={width}
          height={height}
          //onAnimate={this._onAnimate}
        >
          <scene>
            <perspectiveCamera
              name="camera"
              fov={75}
              aspect={width / height}
              near={0.1}
              far={1000}
              position={this.cameraPosition}
            />
            <mesh rotation={this.state.cubeRotation}>
              <boxGeometry width={3} height={3} depth={2} />
              <meshBasicMaterial color={'rgba(0,200,0,0.3)'} />
            </mesh>
          </scene>
        </React3>
        <img src={cornerImage} className="cornerImage" alt="corner" />
      </div>
    )
  }
}

export default SensorView
