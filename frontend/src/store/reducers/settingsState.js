import { SET_TRACKING, TOGGLE_OVERLAY, TOGGLE_MENU } from '../actiontypes'

const initialState = {
    menuOpen: true,
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
        case TOGGLE_MENU: {
            return {
                ...state,
                menuOpen: !state.menuOpen,
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