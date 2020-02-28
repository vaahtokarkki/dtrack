export const getMapState = store => store.mapState

export const getLocationState = store => store.locationState

export const getLocationByDevice = ( store, device ) => {
    const { locations } = store
    return locations.filter(location => location.device === device)[0] || null
}

export const getSettingsState = store => store.settingsState
export const getTrackedDevice = store => store.trackedDevice || null
