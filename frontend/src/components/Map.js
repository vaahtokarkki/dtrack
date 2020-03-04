import React, { Fragment } from 'react'
import { connect } from "react-redux"

import L from 'leaflet'
import { geolocated } from "react-geolocated"
import { Map, Marker, TileLayer, Circle, CircleMarker } from 'react-leaflet'

import { getMapState, getLocationState, getUserLocation } from '../store/selectors'
import { setZoom , setPosition} from '../store/actions'


const MapComponent = props => {
    let mapElement

    const handleMapMove = () => {
      if (!mapElement)
        return
      const zoom = mapElement.leafletElement.getZoom()
      const { lat, lng } = mapElement.leafletElement.getCenter()
      props.setZoom(zoom)
      props.setPosition([ lat, lng ])
    }

    const renderUserLocation = () => {
      const userLocation = getUserLocation(props.locationState)
      if (!userLocation)
        return null

      const { position, accuracy } = userLocation
      let radius
      if (accuracy < 40)
        radius = 40
      else if (accuracy > 500)
        radius = 500

      return <Fragment>
        <Circle
            center={position}
            radius={radius}
            stroke={false}
            fillOpacity={0.4} />
        <CircleMarker center={position} radius={5} stroke={false} fillOpacity={1} />
      </Fragment>
    }

    const renderMarkers = () => {
      const icon = new L.Icon({
        iconUrl: require('../assets/dog.png'),
        className: 'dog-icon',
        iconAnchor: [25, 25]
      })

      const devices = props.locationState.locations.filter(device => device.name !== "user")
      return devices.map(device => <Marker icon={ icon } position={ device.position } key={ device.id } />)
    }

    let { position, zoom } = props.mapSate
    //let { trackedPositions } = props.trackedState <-- array of positions
    // if (props.settingsState.trackUserLocation)
      // position = ...
      //url='http://tanger.belectro.fi/tiles/mmltopo/v20200217/512/{z}/{x}/{y}.jpg'
      //
    return <div className='map-wrapper'>
      <Map
        ref={(ref) => { mapElement = ref }}
        center={position}
        zoom={zoom}
        zoomControl={false}
        onZoomEnd={ handleMapMove }
        onMoveend= { handleMapMove } >
        <TileLayer
          url=' http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg' />
        { renderUserLocation() }
        { renderMarkers() }
    </Map>
  </div>
}

const mapStateToProps = state => {
  const mapSate = getMapState(state)
  const locationState = getLocationState(state)
  return { mapSate, locationState }
}

export default connect(mapStateToProps, { setZoom , setPosition })(geolocated({
  watchPosition: true,
  userDecisionTimeout: 10000,
})(MapComponent))
