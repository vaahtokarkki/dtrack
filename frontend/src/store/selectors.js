export const getMapState = store => store.mapState

export const getDevicesState = store => store.devicesState
export const getDevices = devicesState => devicesState.devices
export const getDeviceById = ( devicesState, id ) =>
    devicesState.devices.filter(device => device.id === id)[0] || null
export const getLatestLocationByDevice = ( devicesState, deviceId ) => {
    const device = getDeviceById(devicesState, deviceId)
    return device && device.locations ? device.locations[0] || null : null
}

export const getUserLocation = devicesState =>
    getLatestLocationByDevice(devicesState, "user")

export const getSettingsState = store => store.settingsState
export const getTrackedDevice = settingsState => settingsState.trackedDevice || null

export const getNotificationsState = store => store.notificationsState
export const getNotifications = notificationsState => notificationsState.notifications
