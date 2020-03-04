export const getMapState = store => store.mapState

export const getLocationState = store => store.locationState

export const getLocationByDeviceName = ( store, name ) => {
    const { locations } = store
    return locations.filter(location => location.name === name)[0] || null
}

export const getLocationByDeviceId = ( store, id ) =>
    store.locations.filter(location => location.id === id)[0] || null

export const getUserLocation = store =>
    store.locations.filter(device => device.name === "user")[0] || null

export const getDevicesState = store => store.devicesState
export const getDevices = devicesState => devicesState.devices

export const getSettingsState = store => store.settingsState
export const getTrackedDevice = settingsState => settingsState.trackedDevice || null
