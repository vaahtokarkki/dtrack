import { SET_TRACKING, TOGGLE_OVERLAY } from '../actiontypes'

const initialState = {
    trackedDevice: null,
    displayOverlay: false,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TRACKING: {
            return {
                ...state,
                trackedDevice: action.payload
            }
        }
        case TOGGLE_OVERLAY: {
            return {
                ...state,
                displayOverlay: !state.displayOverlay
            }
        }
        default:
            return state
    }
}