import { UPDATE_LOCATION } from '../actiontypes'

//{locations: [{name, position:{lat, lon}, accuracy, speed}]}
const initialState = {
    locations: []
}

export default function(state = initialState, action) {
    switch (action.type) {
      case UPDATE_LOCATION: {
        const { locations } = state
        const { name, position, accuracy, speed, id, timestamp } = action.payload
        let filteredByDevide = locations.filter(location => location.id === id)
        if (filteredByDevide.length) {
            const updatedDevice = { name, position, accuracy, speed, id, timestamp }
            const notChangedDevices = locations.filter(location => location.id !== id)
            return {
                ...state,
                locations: notChangedDevices.concat(updatedDevice)
            }
        }
        const oldLocations = [ ...state.locations ]
        const newLocation = { name, position, accuracy, speed, id, timestamp }
        return {
            ...state,
            locations: oldLocations.concat(newLocation)
        }
      }
      default:
        return state
    }
  }