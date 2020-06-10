import React, { Fragment, useEffect, useState } from 'react'
import { connect } from "react-redux"

import L from 'leaflet'
import { geolocated } from "react-geolocated"
import { Map, Marker, TileLayer, Circle, CircleMarker, Polyline } from 'react-leaflet'

import { getMapState, getUserLocation, getDevices, getDevicesState, getLatestLocationByDevice, getTracksOnMap, getTracksState, getTracks } from '../store/selectors'
import { setZoom , setPosition} from '../store/actions'

const ICON = new L.Icon({
  iconUrl: require('../assets/dog.png'),
  className: 'dog-icon',
  iconAnchor: [25, 25]
})

const MapComponent = props => {
    const [markers, setMarkers] = useState("")
    const [tracks, setTracks] = useState(null)
    const [mapElement, setMapElement] = useState(null)

    const renderMarkers = () => {
      const devices = getDevices(props.devicesState).filter(device => device.name !== "user")
      return devices.map(device => {
        const location = getLatestLocationByDevice(props.devicesState, device.id)
        if (!location)
          return null
        return <Marker icon={ ICON } position={ location.position } key={ device.id } />
      })
    }

    const renderTracks = () => {
      const devices = getDevices(props.devicesState).filter(device => device.name !== "user")
      const activeTracks = devices.map(device => {
        const locations = device.locations.map(location => location.position)
        return <Polyline key={ device.id } positions={ locations } color={ 'red' } />
      })
      const savedTracksOnMap = props.visibleTracksOnMap.map(track => {
        const locations = track.track.coordinates
        return <Polyline key={ track.id } positions={ locations } color={ 'blue' } />
      })
      return activeTracks.concat(savedTracksOnMap)
    }

    useEffect(() => {
      setMarkers(renderMarkers())
    }, [props.devicesState])

    useEffect(() => {
      setTracks(renderTracks())
    }, [props.visibleTracksOnMap])

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


    if (props.mapState && props.mapState.fitBounds) {
      if (props.mapState.fitBounds === "devices") {
        const markers = getDevices(props.devicesState)
          .map(device => L.marker(getLatestLocationByDevice(props.devicesState, device.id).position))
        mapElement.leafletElement.fitBounds(L.featureGroup(markers).getBounds())
      } else {
        const trackToFit = getTracks(props.tracksState).filter(track => track.id === props.mapState.fitBounds)
        if (trackToFit.length) {
          // Hack to fit map on line
          const markers = trackToFit[0].track.coordinates.map(location => L.marker(location))
          mapElement.leafletElement.fitBounds(L.featureGroup(markers).getBounds())
        }
      }
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
        onMoveend= { handleMapMove }
        maxZoom={ 19 }>
        <TileLayer
          url='https://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg' />
        { renderUserLocation() }
        { markers }
        { tracks }
    </Map>
  </div>
}

const mapStateToProps = state => {
  const mapState = getMapState(state)
  const devicesState = getDevicesState(state)
  const tracksState = getTracksState(state)
  const visibleTracksOnMap = getTracksOnMap(tracksState)
  return { mapState, devicesState, visibleTracksOnMap, tracksState }
}

export default connect(mapStateToProps, { setZoom , setPosition })(geolocated({
  watchPosition: true,
  userDecisionTimeout: 10000,
})(MapComponent))
