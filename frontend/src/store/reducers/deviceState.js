import { ADD_DEVICE, ADD_LOCATION, CLEAR_DEVICES } from '../actiontypes'

/*
devices: [{
    ...
    locations: [{
        position: { lat, lon },
        accuracy,
        speed,
        timestamp
    }]
}]
*/
const initialState = {
    devices: [],
    id: null,
    last_seen: null,
    name: null,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_DEVICE: {
            const devices = state.devices.filter(device => device.id !== action.payload.id)
            return { ...state, devices: devices.concat(action.payload) }
        }
        case CLEAR_DEVICES: {
            const devices = state.devices.filter(device => device.id === "user")
            return { ...state, devices }
        }
        case ADD_LOCATION: {
            const { payload } = action
            const deviceToUpdate = state.devices
                .filter(device => device.id === payload.deviceId)[0]

            const currentLocationIds = deviceToUpdate.locations.map(location => location.id)
            const newLocations = payload.location.filter(location => !currentLocationIds.includes(location.id))
            const locations = deviceToUpdate.locations
                .concat(newLocations)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

            const updatedDevice = {
                ...deviceToUpdate, locations
            }
            const devices = state.devices
                .filter(device => device.id !== payload.deviceId)
                .concat(updatedDevice)

            return { ...state, devices }
        }
        default:
            return state
    }
}