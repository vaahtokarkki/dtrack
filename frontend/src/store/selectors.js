export const getMapState = store => store.mapState

export const getDevicesState = store => store.devicesState
export const getDevices = devicesState => devicesState.devices
export const getDeviceById = ( devicesState, id ) =>
    devicesState.devices.filter(device => device.id === id)[0] || null
export const getLatestLocationByDevice = ( devicesState, deviceId ) => {
    const device = getDeviceById(devicesState, deviceId)
    return device && device.locations ? device.locations[0] || null : null
}
export const isDevicesOnline = devicesState =>
    devicesState.devices
        .filter(device => device.id !== "user")
        .some(device => device.locations.length)

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
    firstName: userState.firstName,
    lastName: userState.lastName,
})
export const getAccessToken = userState => userState.accessToken
export const getRefreshToken = userState => userState.refreshToken
export const getRefreshInterval = userState => userState.refreshInterval
export const isLoggedIn = userState => userState.accessToken && userState.refreshToken && userState.id

export const getTracksState = store => store.tracksState
export const getTracks = tracksState => tracksState.tracks
export const getTracksOnMap = tracksState => tracksState.tracks.filter(track => track.displayOnMap)
