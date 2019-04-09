import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import './style.scss'

const mapStateToProps = (state, props) => ({
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class CameraPopup extends React.Component {

    onOptionClick = (type) => {
        console.log(type);

    }

    render() {
        let {info, displayInfo} = this.props;
        let {display, left, top} = displayInfo;

        return (
            <div
                className={"CameraPopup"}
                style={{
                    display: display,
                    left: (left + 15 < 100)?left + 1 + "%":left - 16 + "%",
                    top: (top + 60 < 100)?top + 5 + "%":top - 60 + "%"
                }}
            >
                <div className={"caption"}>
                    CAMERA OPTIONS
                </div>
                <div className={"option"} onClick={this.onOptionClick.bind(this, 1)}>
                    RAISE/LOWER
                </div>
                <div className={"option"} onClick={this.onOptionClick.bind(this, 2)}>
                    DISPLAY CAM
                </div>
                <div className={"option"} onClick={this.onOptionClick.bind(this, 3)}>
                    EVENT HISTORY
                </div>
            </div>
        )
    }
}

export default CameraPopup
