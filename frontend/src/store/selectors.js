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
export const getMenuState = settingsState => settingsState.menuOpen

export const getNotificationsState = store => store.notificationsState
export const getNotifications = notificationsState => notificationsState.notifications

export const getUserState = store => store.userState
export const getUser = userState => ({
    id: userState.id,
    email: userState.email,
    name: userState.name,
})
export const getAccessToken = userState => userState.accessToken
export const getRefreshToken = userState => userState.refreshToken
export const getRefreshInterval = userState => userState.refreshInterval
export const isLoggedIn = userState => Boolean(userState.accessToken)
