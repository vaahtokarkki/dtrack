import React, { useEffect } from 'react';

import api from './utils/api'
import { connect } from 'react-redux'

import MapComponent from './components/Map'
import { LocationCards } from './components/Cards'
import MapControls from './components/MapControls'

import { updateLocation, setPosition } from './store/actions'
import { getLocationByDevice, getLocationState, getTrackedDevice, getSettingsState } from './store/selectors'

import './App.css';
import './styles/Map.scss'
import './styles/MapControls.scss'
import './styles/Card.scss'


const App = props => {
  useEffect(() => {
    async function fetchLocations() {
      const resp = await api.get("/locations/latest/")
      resp.data.map(location => props.updateLocation({
        id: location.device.id,
        name: location.device.name,
        position: location.point.coordinates,
        speed: location.speed,
        timestamp: location.timestamp,
      }))
    }

    fetchLocations()
    const id = setInterval(fetchLocations, 60000)

    return () => clearInterval(id)
  }, [])

  const handlePositionChange = position => {
    const isInitialLocation = !getLocationByDevice(props.locationState, "user")

    const { coords } = position
    props.updateLocation({
      name: "user",
      position: [ coords.latitude, coords.longitude ],
      accuracy: coords.accuracy,
      speed: coords.speed
    })

    if (isInitialLocation)
      props.setPosition([ coords.latitude, coords.longitude ])

    if (getTrackedDevice(props.settingsState) === "user")
      props.setPosition([ coords.latitude, coords.longitude ])
  }

  return <div className="app-container">
    <LocationCards locationState={ props.locationState } />
    <MapControls />
    <MapComponent onError={e => console.log(e)} onSuccess={ handlePositionChange } />
  </div>
}

const mapStateToProps = state => {
  const locationState = getLocationState(state)
  const settingsState = getSettingsState(state)
  return { locationState, settingsState }
}

export default connect(mapStateToProps, { setPosition, updateLocation })(App)
