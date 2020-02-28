import { UPDATE_LOCATION } from '../actiontypes'

//{locations: [{device, position:{lat, lon}, accuracy, speed}]}
const initialState = {
    locations: []
}

export default function(state = initialState, action) {
    switch (action.type) {
      case UPDATE_LOCATION: {
        const { locations } = state
        const { device, position, accuracy, speed } = action.payload
        let filteredByDevide = locations.filter(location => location.device === device)
        if (filteredByDevide.length) {
            const updatedDevice = { device, position, accuracy, speed }
            const notChangedDevices = locations.filter(location => location.device !== device)
            return {
                ...state,
                locations: notChangedDevices.concat(updatedDevice)
            }
        }
        const oldLocations = [ ...state.locations ]
        const newLocation = { device, position, accuracy, speed }
        return {
            ...state,
            locations: oldLocations.concat(newLocation)
        }
      }
      default:
        return state
    }
  }