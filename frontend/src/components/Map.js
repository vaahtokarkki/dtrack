import React, { Fragment, useEffect, useState } from 'react'
import { connect } from "react-redux"

import L from 'leaflet'
import { geolocated } from "react-geolocated"
import { Map, Marker, TileLayer, Circle, CircleMarker, Polyline } from 'react-leaflet'

import { getMapState, getUserLocation, getDevices, getDevicesState, getLatestLocationByDevice } from '../store/selectors'
import { setZoom , setPosition} from '../store/actions'

const ICON = new L.Icon({
  iconUrl: require('../assets/dog.png'),
  className: 'dog-icon',
  iconAnchor: [25, 25]
})

const MapComponent = props => {
    const renderMarkers = () => {
      const devices = getDevices(props.devicesState).filter(device => device.name !== "user")
      return devices.map(device => {
        const location = getLatestLocationByDevice(props.devicesState, device.id)
        if (!location)
          return null
        return <Marker icon={ ICON } position={ location.position } key={ device.id } />
      })
    }

    const [markers, setMarkers] = useState("")
    const [mapElement, setMapElement] = useState(null)

    useEffect(() => {
      setMarkers(renderMarkers())
    }, [props.devicesState])

    const handleMapMove = () => {
      if (!mapElement)
        return
      const zoom = mapElement.leafletElement.getZoom()
      const { lat, lng } = mapElement.leafletElement.getCenter()
      props.setZoom(zoom)
      props.setPosition([ lat, lng ])
    }

    const renderUserLocation = () => {
      const userLocation = getUserLocation(props.devicesState)
      if (!userLocation)
        return null

      const { position, accuracy } = userLocation
      let radius = 100
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

    const renderTracks = () => {
      const devices = getDevices(props.devicesState).filter(device => device.name !== "user")
      return devices.map(device => {
        const locations = device.locations.map(location => location.position)
        return <Polyline key={ device.id } positions={ locations } color={ 'red' } />
      })
    }

    if (props.mapState && props.mapState.fitBounds) {
      const markers = getDevices(props.devicesState)
        .map(device => L.marker(getLatestLocationByDevice(props.devicesState, device.id).position))
      mapElement.leafletElement.fitBounds(L.featureGroup(markers).getBounds())
    }

    let { position, zoom } = props.mapState

    //let { trackedPositions } = props.trackedState <-- array of positions
    // if (props.settingsState.trackUserLocation)
      // position = ...
      //url='http://tanger.belectro.fi/tiles/mmltopo/v20200217/512/{z}/{x}/{y}.jpg'
      //
    return <div className='map-wrapper'>
      <Map
        ref={(ref) => { setMapElement(ref) }}
        center={ position }
        zoom={zoom}
        zoomControl={false}
        onZoomEnd={ handleMapMove }
        onMoveend= { handleMapMove } >
        <TileLayer
          url='https://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg' />
        { renderUserLocation() }
        { markers }
        { renderTracks() }
    </Map>
  </div>
}

const mapStateToProps = state => {
  const mapState = getMapState(state)
  const devicesState = getDevicesState(state)
  return { mapState, devicesState }
}

export default connect(mapStateToProps, { setZoom , setPosition })(geolocated({
  watchPosition: true,
  userDecisionTimeout: 10000,
})(MapComponent))
