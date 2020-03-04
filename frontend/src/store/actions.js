import { ZOOM_IN, ZOOM_OUT, SET_POSITION, SET_ZOOM, UPDATE_LOCATION, SET_TRACKING, ADD_DEVICES, TOGGLE_OVERLAY } from "./actiontypes"
import api from '../utils/api'

// Map actions

export const zoomIn = content => ({
  type: ZOOM_IN,
  payload: {
    zoom: content
  }
})

export const zoomOut = () => ({
    type: ZOOM_OUT,
    payload: null
})

export const setZoom = zoom => ({
  type: SET_ZOOM,
  payload: { zoom }
})

export const setPosition = content => ({
    type: SET_POSITION,
    payload: {
      position: content
    }
})

// Location actions

export const updateLocation = content => ({
  type: UPDATE_LOCATION,
  payload: content
})

export const updateLocationTracking = location =>
  (dispatch, getState) => {
    dispatch(updateLocation(location))
    const currentState = getState()
    if (currentState.settingsState.trackedDevice === location.id)
      dispatch(setPosition(location.position))
  }

export const fetchLocations = () =>
  async (dispatch, getState) => {
    const resp = await api.get("/locations/latest/")
    resp.data.map(location => {
      dispatch(updateLocation({
        id: location.device.id,
        name: location.device.name,
        position: location.point.coordinates,
        speed: location.speed,
        timestamp: location.timestamp,
      }))

      const currentState = getState()
      if (currentState.settingsState.trackedDevice === location.device.id)
        dispatch(setPosition(location.point.coordinates))
      return null
    })
  }

// Device actions

export const addDevices = devices => ({
  type: ADD_DEVICES,
  payload: devices,
})


export const fetchDevices = () => {
  return async dispatch => {
    const resp = await api.get("/devices/")
    dispatch(addDevices(
      resp.data.map(device => ({ id: device.id, name: device.name }))
    ))
  }
}


// Settings actions

export const setTracking = device => ({
  type: SET_TRACKING,
  payload: device
})

export const clearTracking = () => ({
  type: SET_TRACKING,
  payload: null
})

export const toggleOverlay = () => ({
  type: TOGGLE_OVERLAY,
  payload: null
})