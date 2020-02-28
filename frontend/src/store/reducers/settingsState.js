import { SET_TRACKING } from '../actiontypes'

const initialState = {
    trackedDevice: null,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TRACKING: {
            return {
                ...state,
                trackedDevice: action.payload
            }
        }
        default:
            return state
    }
}