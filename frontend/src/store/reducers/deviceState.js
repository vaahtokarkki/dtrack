import { ADD_DEVICES } from '../actiontypes'

const initialState = {
    devices: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_DEVICES: {
            return { ...state, devices: action.payload }
        }
        default:
            return state
    }
}