import React from 'react';

import { connect } from 'react-redux'

import MapComponent from './components/Map'
import { SmallCard } from './components/Card'
import MapControls from './components/MapControls'

import { updateLocation, setPosition } from './store/actions'
import { getLocationByDevice, getLocationState, getTrackedDevice, getSettingsState } from './store/selectors'

import './App.css';
import './styles/Map.scss'
import './styles/MapControls.scss'
import './styles/Card.scss'


const App = props => {

  const handlePositionChange = position => {
    const isInitialLocation = !getLocationByDevice(props.locationState, "user")

    const { coords } = position
    props.updateLocation({
      device: "user",
      position: [ coords.latitude, coords.longitude ],
      accuracy: coords.accuracy,
      speed: coords.speed
    })

    if (isInitialLocation)
      props.setPosition([ coords.latitude, coords.longitude ])

    if (getTrackedDevice(props.settingsState) === "user")
      props.setPosition([ coords.latitude, coords.longitude ])
  }

  return <div style={{ width: '100%', height: '100%' }}>
    <SmallCard />
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
