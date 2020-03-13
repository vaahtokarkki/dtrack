import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch } from 'react-redux'

import MapComponent from './components/Map'
import Notifications from './components/Notifications'
import MapControls from './components/MapControls'
import { LocationCards } from './components/Cards'

import { setPosition, fetchLocations, initDevices, addLocation, addDevice, addNotification } from './store/actions'
import { getUserLocation, getDevicesState, getSettingsState } from './store/selectors'

import './App.css';
import './styles/Map.scss'
import './styles/Notifications.scss'
import './styles/MapControls.scss'
import './styles/Card.scss'


const App = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initDevices())
    dispatch(addNotification("danger", "boiiii"))

    const id = setInterval(() => dispatch(fetchLocations()), 60000)
    return () => clearInterval(id)
  }, [dispatch])


  const handleUserLocationChange = position => {
    const currentLocation = getUserLocation(props.devicesState)

    const { coords } = position
    if (!coords.latitude || !coords.longitude)
      return


    const location = {
      position: [ coords.latitude, coords.longitude ],
      id: currentLocation ? currentLocation.id + 1 : 0,
      speed: coords.speed,
      timestamp: new Date().toISOString(),
      accuracy: coords.accuracy,
    }

    const device = {
      id: "user",
      name: "user",
    }

    if (!currentLocation) {
      dispatch(addDevice({ ...device, locations: [location] }))
      return props.setPosition([ coords.latitude, coords.longitude ])
    }

    dispatch(addLocation(device.id, [location]))
  }

  const renderOverlay = () => {
    return props.settingsState.displayOverlay ?
      <div className='dropdown-overlay'></div> :
      null
  }

  return <Fragment>
    <div className="app-container">
      <LocationCards />
      <Notifications />
      <MapControls />
      <MapComponent onError={ e => dispatch(addNotification("danger", e)) } onSuccess={ handleUserLocationChange } />
    </div>
    { renderOverlay() }
  </Fragment>
}

const mapStateToProps = state => {
  const devicesState = getDevicesState(state)
  const settingsState = getSettingsState(state)
  return { devicesState, settingsState }
}

export default connect(mapStateToProps, { setPosition })(App)
