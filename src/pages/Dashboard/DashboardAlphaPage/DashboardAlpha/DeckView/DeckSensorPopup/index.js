import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import $ from 'jquery'
import './style.scss'

const mapStateToProps = (state, props) => ({
  deckZonesInfo: state.deckZonesInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class DeckSensorPopup extends React.Component {
  state = {
    expandedList: [],
  }

  onOptionClick = type => {
    console.log(type)
  }

  dropDownItemClick = number => {
    let { expandedList } = this.state
    if (!expandedList.includes(number)) {
      expandedList.push(number)
    } else {
      let index = expandedList.indexOf(number)
      console.log(index)
      expandedList.splice(index, 1)
    }
    this.setState({
      expandedList: expandedList,
    })
  }

  render() {
    let { displayInfo, deckZonesInfo } = this.props
    let { display, left, top } = displayInfo
    let { expandedList } = this.state
    let deckZones = deckZonesInfo.deckZones
    let deckView = $('#DeckViewController')
    let absolute_top =
      typeof deckView.parents()[1] !== 'undefined' ? $(deckView.parents()[1]).position().top : 0
    return (
      <div
        className={'DeckSensorPopup'}
        style={{
          display: display,
          left: left + 15 < 100 ? left + 1 + '%' : left - 16 + '%',
          top: absolute_top < 100 ? top + 5 + '%' : top - 100 + '%',
        }}
      >
        <div className={'caption'}>DECK SENSORS</div>
        <ul className="popupArea">
          <li>
            <div className="dropdownItem" onClick={this.dropDownItemClick.bind(this, 0)}>
              <i
                className={
                  !expandedList.includes(0)
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              <span className={'subTitle'}>{'ALL'}</span>
            </div>
            <ul
              className="submenuItems"
              style={expandedList.includes(0) ? { display: 'block' } : { display: 'none' }}
            >
              <li>
                <div className={'listItem functionItem'}>{'ON'}</div>
              </li>
              <li>
                <div className={'listItem functionItem'}>{'OFF'}</div>
              </li>
            </ul>
          </li>
          <li>
            <div className="dropdownItem" onClick={this.dropDownItemClick.bind(this, 1)}>
              <i
                className={
                  !expandedList.includes(1)
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              <span className={'subTitle'}>{'BY ZONE'}</span>
            </div>
            <ul
              className="submenuItems"
              style={expandedList.includes(1) ? { display: 'block' } : { display: 'none' }}
            >
              {deckZones.map(deckZone => {
                if (deckZone.DeckZoneName === 'No Zone') return <div />
                return (
                  <li>
                    <div className={'listItem subCaption'}>{deckZone.DeckZoneName}</div>
                    <div className={'listItem functionItem'}>{'ON'}</div>
                    <div className={'listItem functionItem'}>{'OFF'}</div>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default DeckSensorPopup
