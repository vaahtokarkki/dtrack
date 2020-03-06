import React from 'react'
import { connect } from "react-redux"

import { setTracking, clearTracking, toggleOverlay } from '../store/actions'
import { getSettingsState, getTrackedDevice, getDevicesState } from '../store/selectors'

import Dropdown from 'react-bootstrap/Dropdown'

import MyLocation from '@material-ui/icons/MyLocation'
import Pets from '@material-ui/icons/Pets'


const FollowDropdown = props => {
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      className='map-control-background'
      ref={ref}
      onClick={e => {
        e.preventDefault()
        onClick(e)
      }} >
        <MyLocation className='map-control' style={{ opacity: 1 }} />Follow
    </div>
  ))

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

  const handleSetTracking = device => {
    getTrackedDevice(props.settingsState) === device ?
      props.clearTracking() :
      props.setTracking(device)
  }

  const renderDevices = () =>
    props.devicesState.devices.map(device => {
      return <Dropdown.Item
        eventKey={device.id}
        key={device.id}
        className={ resolveClass(device.id) }
        onClick={ () => handleSetTracking(device.id) }>
        <Pets className='dropdown-item-icon' />{ device.name }
      </Dropdown.Item>
    })

  const resolveClass = deviceId =>
    getTrackedDevice(props.settingsState) === deviceId ? 'dropdown-item active' : 'dropdown-item'

  return <Dropdown onToggle={ props.toggleOverlay }>
    <Dropdown.Toggle as={ CustomToggle } id="dropdown-custom-components" />
    <Dropdown.Menu as={ CustomMenu }>
        { renderDevices() }
        <Dropdown.Item eventKey="1" className={ resolveClass("user") } onClick={ () => handleSetTracking("user") }>
          <MyLocation className='dropdown-item-icon' />My location
        </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
}

const mapStateToProps = state => {
  const settingsState = getSettingsState(state)
  const devicesState = getDevicesState(state)
  return { settingsState, devicesState }
}

export default connect(mapStateToProps, { setTracking, clearTracking, toggleOverlay })(FollowDropdown)
