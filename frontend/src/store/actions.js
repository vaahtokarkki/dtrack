import { ZOOM_IN, ZOOM_OUT, SET_POSITION, SET_ZOOM, SET_TRACKING, ADD_DEVICE, ADD_LOCATION, TOGGLE_OVERLAY } from "./actiontypes"
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

export const setPosition = position => ({
    type: SET_POSITION,
    payload: { position }
})

// Device actions

export const addDevice = device => ({
  type: ADD_DEVICE,
  payload: device,
})


export const addLocation = (deviceId, location) =>
  (dispatch, getState) => {
    dispatch(({
      type: ADD_LOCATION,
      payload: { deviceId, location }
    }))

    const currentState = getState()
    if (currentState.settingsState.trackedDevice === deviceId)
      dispatch(setPosition(location[0].position))
  }


export const fetchLocations = () => {
  return async (dispatch, getState) => {
    const requestData = getState().devicesState.devices
      .filter(device => device.locations && device.locations.length)
      .map(device => ({device: device.id, location: device.locations[0] }))

    const resp = await api.post("/locations/latest/", { requestData })

    resp.data.forEach(device => {
      const locations = device.locations.map(location => {
        return {
          id: location.id,
          position: location.point.coordinates,
          speed: location.speed,
          timestamp: location.timestamp,
        }
      })
      dispatch(addLocation(device.id, [ ...locations ]))
    })
  }
}

export const initDevices = () =>
  async dispatch => {
    const resp = await api.get("/devices/")
    resp.data.map(device => {
      const deviceLocations = device.locations.map(location => {
        return {
          id: location.id,
          position: location.point.coordinates,
          speed: location.speed,
          timestamp: location.timestamp,
        }
      })
      dispatch(addDevice({
        ...device, locations: deviceLocations
      }))
    })
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