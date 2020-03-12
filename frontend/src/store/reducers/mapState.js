import { ZOOM_IN, ZOOM_OUT, SET_POSITION, SET_ZOOM, FIT_MAP } from '../actiontypes'

const initialState = {
    position: [ 60.2, 25 ],
    zoom: 15,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ZOOM_IN: {
      const { zoom } = state
      return {...state, zoom: Math.min(19, zoom + 1)}
    }
    case ZOOM_OUT: {
      const { zoom } = state
      return { ...state, zoom: Math.max(5, zoom - 1) }
    }
    case SET_ZOOM: {
      const { zoom } = action.payload
      return {
        ...state,
        zoom
      }
    }
    case SET_POSITION: {
      const { position } = action.payload
        return {
            ...state,
            position
        }
    }
    case FIT_MAP: {
      return {
        ...state,
        position: null, zoom: null
      }
    }
    default:
      return state
  }
}
