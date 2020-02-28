import { ZOOM_IN, ZOOM_OUT, SET_POSITION, SET_ZOOM, UPDATE_LOCATION, SET_TRACKING } from "./actiontypes"


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

// Settings actions

export const setTracking = device => ({
  type: SET_TRACKING,
  payload: device
})

export const clearTracking = () => ({
  type: SET_TRACKING,
  payload: null
})