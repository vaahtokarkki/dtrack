import { ZOOM_IN, ZOOM_OUT, SET_POSITION, SET_ZOOM, SET_TRACKING, ADD_DEVICE, ADD_LOCATION, TOGGLE_OVERLAY, FIT_MAP, ADD_NOTIFICATION, REMOVE_NOTIFICATION, TOGGLE_MENU, UPDATE_ACCESS_TOKEN, UPDATE_REFRESH_TOKEN, UPDATE_DETAILS } from "./actiontypes"
import { getLatestLocationByDevice } from './selectors'
import api, { updateApiToken } from '../utils/api'

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

export const fitMap = () => ({
  type: FIT_MAP,
  payload: null,
})

// Device actions

export const addDevice = device => ({
  type: ADD_DEVICE,
  payload: device,
})


export const addLocation = (deviceId, location) =>
  (dispatch, getState) => {
    if (!Array.isArray(location) || !location.length)
      return
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
    const { devicesState, userState } = getState()
    if (!userState.accessToken)
      return // User is not logged in

    const requestData = devicesState.devices
      .filter(device => device.locations && device.locations.length && device.id !== "user")
      .map(device => ({ device: device.id, location: getLatestLocationByDevice(devicesState, device.id).id }))

    const resp = await api.post("/locations/latest/", [ ...requestData ])

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
  async (dispatch, getState) => {
    const { userState } = getState()
    if (!userState.accessToken)
      return // User is not logged in

    const resp = await api.get("/devices/")
    resp.data.map(device => {
      const deviceLocations = device.locations
        .map(location => {
          return {
            id: location.id,
            position: location.point.coordinates,
            speed: location.speed,
            timestamp: location.timestamp,
          }
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      dispatch(addDevice({
        ...device, locations: deviceLocations
      }))
      return null
    })
  }


// Settings actions

const updateTracking = device => ({
  type: SET_TRACKING,
  payload: device
})


export const setTracking = deviceId =>
  (dispatch, getState) => {
    const { devicesState } = getState()
    dispatch(updateTracking(deviceId))

    const latestLocation = getLatestLocationByDevice(devicesState, deviceId)
    dispatch(setPosition(latestLocation.position))
  }

export const clearTracking = () => ({
  type: SET_TRACKING,
  payload: null
})

export const toggleOverlay = () => ({
  type: TOGGLE_OVERLAY,
  payload: null
})

export const toggleMenu = () => ({
  type: TOGGLE_MENU,
  payload: null
})

// Notification actions

export const addNotification = (color, content, dismissable=true) => ({
  type: ADD_NOTIFICATION,
  payload: { color, content, dismissable }
})

export const removeNotification = (color, content) => ({
  type: REMOVE_NOTIFICATION,
  payload: { color, content }
})

// User actions

export const updateAccessToken = (accessToken, id) => {
  updateApiToken(accessToken)
  window.localStorage.setItem("accessToken", accessToken)
  if (id)
    window.localStorage.setItem("userId", id)
  return {
    type: UPDATE_ACCESS_TOKEN,
    payload: { accessToken, id }
  }
}

export const updateRefreshToken = token => {
  window.localStorage.setItem("refreshToken", token)
  return {
    type: UPDATE_REFRESH_TOKEN,
    payload: token
  }
}

export const updateUserDetails = details => ({
  type: UPDATE_DETAILS,
  payload: details
})

export const fetchUserDetails = () =>
  async (dispatch, getState) => {
    const { userState } = getState()
    const { accessToken, id } = userState

    if (!accessToken || !id)
      return

    const resp = await api.get(`/user/${id}/`)
    if (!resp.ok)
      return // TODO: logout
    const { name, email, first_name, last_name } = resp.data
    dispatch(updateUserDetails({ id, name, email, firstName: first_name, lastName: last_name}))
  }

export const fetchAccessToken = () =>
  async (dispatch, getState) => {
    const { refreshToken } = getState().userState
    const resp = await api.post('/token/refresh/', { refresh: refreshToken })
    if (!resp.ok)
      return // TODO: perform logout
    dispatch(updateAccessToken(resp.data.access))
  }

export const initUser = () =>
  async dispatch => {
    await dispatch(fetchAccessToken())
    await dispatch(fetchUserDetails())
  }