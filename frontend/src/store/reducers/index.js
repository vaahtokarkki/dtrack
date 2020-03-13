import { combineReducers } from "redux"

import mapState from './mapState'
import settingsState from './settingsState'
import devicesState from './deviceState'
import notificationsState from './notificationsState'

export default combineReducers({ mapState, settingsState, devicesState, notificationsState })
