import { ADD_DEVICE, ADD_LOCATION } from '../actiontypes'

/*
devices: [{
    name,
    id,
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
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_DEVICE: {
            const devices = state.devices.filter(device => device.id !== action.payload.id)
            return { ...state, devices: devices.concat(action.payload) }
        }
        case ADD_LOCATION: {
            const { payload } = action
            const deviceToUpdate = state.devices
                .filter(device => device.id === payload.deviceId)[0]

            const currentLocationIds = deviceToUpdate.locations.map(location => location.id)
            const newLocations = payload.location.filter(location => !currentLocationIds.includes(location.id))

            const updatedDevice = {
                ...deviceToUpdate,
                locations: deviceToUpdate.locations.concat(newLocations)
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