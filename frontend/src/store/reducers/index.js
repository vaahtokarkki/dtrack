import { combineReducers } from "redux"

import mapState from './mapState'
import settingsState from './settingsState'
import devicesState from './deviceState'
import notificationsState from './notificationsState'
import userState from './userState'

export default combineReducers({ mapState, settingsState, devicesState, notificationsState, userState })
