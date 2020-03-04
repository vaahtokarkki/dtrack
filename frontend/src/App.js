import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch } from 'react-redux'

import MapComponent from './components/Map'
import { LocationCards } from './components/Cards'
import MapControls from './components/MapControls'

import { updateLocationTracking, setPosition, addDevices, fetchLocations, fetchDevices } from './store/actions'
import { getLocationByDeviceName, getLocationState, getSettingsState } from './store/selectors'

import './App.css';
import './styles/Map.scss'
import './styles/MapControls.scss'
import './styles/Card.scss'


const App = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchLocations())
    dispatch(fetchDevices())

    const id = setInterval(() => dispatch(fetchLocations()), 3000)
    return () => clearInterval(id)
  }, [dispatch])



  const handleUserLocationChange = position => {
    const isInitialLocation = !getLocationByDeviceName(props.locationState, "user")

    const { coords } = position
    dispatch(updateLocationTracking({
      id: "user",
      name: "user",
      position: [ coords.latitude, coords.longitude ],
      accuracy: coords.accuracy,
      speed: coords.speed,
      timestamp: new Date().toISOString(),
    }))

    if (isInitialLocation)
      props.setPosition([ coords.latitude, coords.longitude ])
  }

  const renderOverlay = () => {
    return props.settingsState.displayOverlay ?
      <div className='dropdown-overlay'></div> :
      null
  }

  return <Fragment>
    <div className="app-container">
      <LocationCards />
      <MapControls />
      <MapComponent onError={e => console.log("error", e)} onSuccess={ handleUserLocationChange } />
    </div>
    { renderOverlay() }
  </Fragment>
}

const mapStateToProps = state => {
  const locationState = getLocationState(state)
  const settingsState = getSettingsState(state)
  return { locationState, settingsState }
}

export default connect(mapStateToProps, { setPosition, updateLocationTracking, addDevices })(App)
