import React from 'react'
import { connect } from "react-redux"

import { setTracking, clearTracking } from '../store/actions'
import { getSettingsState, getTrackedDevice } from '../store/selectors'

import Dropdown from 'react-bootstrap/Dropdown'

import MyLocation from '@material-ui/icons/MyLocation'
import Pets from '@material-ui/icons/Pets'


const FollowDropdown = props => {
    // The forwardRef is important!!
    // Dropdown needs access to the DOM node in order to position the Menu
    const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      className='map-control-background'
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }} >
        <MyLocation className='map-control' style={{ opacity: 1 }} />Follow
    </div>
  ))

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className }, ref) => {
      return (
        <div
          ref={ref}
          style={{ ...style, backgroundColor: 'transparent', border: 0 }}
          className={className} >
          { children }
        </div>
      )
    }
  )

  const handleSetTracking = device =>
    getTrackedDevice(props.settingsState) === device ?
      props.clearTracking() :
      props.setTracking(device)


  return <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
        <Dropdown.Menu as={CustomMenu}>
            <Dropdown.Item eventKey="2" className='dropdown-item'>
                <Pets className='dropdown-item-icon' />Helka
            </Dropdown.Item>
            <Dropdown.Item eventKey="1" className='dropdown-item' onClick={ () => handleSetTracking("user") }>
                <MyLocation className='dropdown-item-icon' />My location
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
}

const mapStateToProps = state => {
  const settingsState = getSettingsState(state)
  return { settingsState }
}

export default connect(mapStateToProps, { setTracking, clearTracking })(FollowDropdown)
