import React, { useEffect, useState, Fragment } from 'react';
import { connect, useDispatch } from 'react-redux'
import PageVisibility from 'react-page-visibility'

import NavMenu from './components/Navigation'
import MapComponent from './components/Map'
import Notifications from './components/Notifications'
import MapControls from './components/MapControls'
import { LocationCards } from './components/Cards'

import { setPosition, fetchLocations, addLocation, addDevice, addNotification, removeNotification, initApp, fetchAccessToken } from './store/actions'
import { getUserLocation, getDevicesState, getSettingsState, getUserState, isLoggedIn, getUser } from './store/selectors'

import './App.css';
import './styles/Map.scss'
import './styles/Notifications.scss'
import './styles/MapControls.scss'
import './styles/Card.scss'
import './styles/Navigation.scss'


const App = props => {
  const dispatch = useDispatch()

  const [fetchLocationsInterval, setFetchLocationsInterval] = useState(false)
  const [updateTokenInterval, setUpdateTokenInterval] = useState(false)

  useEffect(() => {
    const loginInfo = "Login to track dogs and view saved tracks"
    if (!isLoggedIn(props.userState)) {
      dispatch(addNotification("info", loginInfo, false))
      clearIntervals()
    }
    else {
      dispatch(removeNotification("info", loginInfo))
      initIntervals()
    }
  }, [dispatch, props.userState])

  useEffect(() => {
    props.initApp()
    if (isLoggedIn(props.userState))
      initIntervals()
    return () => clearIntervals()
  }, [])


  const initIntervals = () => {
    setFetchLocationsInterval(setInterval(() => props.fetchLocations(), props.user.refreshInterval * 1000))
    setUpdateTokenInterval(setInterval(() => props.fetchAccessToken(), 240000)) // 4min
  }

  const clearIntervals = () => {
    clearInterval(fetchLocationsInterval)
    clearInterval(updateTokenInterval)
  }



  const handleUserLocationChange = position => {
    const currentLocation = getUserLocation(props.devicesState)
    const { coords } = position
    if (!coords || Number.isNaN(coords.latitude) || Number.isNaN(coords.longitude))
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

  const handleLocationError = error => {
    console.log('Location err', error)
    if (error && error.message)
    dispatch(addNotification("danger", error.message))
  }

  const handleVisibilityChange = visible => {
    if (visible && isLoggedIn(props.userState)) {
      dispatch(fetchAccessToken())
      dispatch(fetchLocations())
    }
  }

  return <PageVisibility onChange={ handleVisibilityChange }>
    <Fragment>
      <NavMenu />
      <div className="app-container">
        <LocationCards />
        <Notifications />
        <MapControls />
        <MapComponent onError={ e => handleLocationError(e) } onSuccess={ handleUserLocationChange } />
      </div>
      { renderOverlay() }
    </Fragment>
  </PageVisibility>
}

const mapStateToProps = state => {
  const devicesState = getDevicesState(state)
  const userState = getUserState(state)
  const user = getUser(userState)
  const settingsState = getSettingsState(state)
  return { devicesState, settingsState, userState, user }
}

export default connect(mapStateToProps, { setPosition, initApp, fetchLocations, fetchAccessToken })(App)
