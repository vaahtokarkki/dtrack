import { combineReducers } from "redux"

import mapState from './mapState'
import settingsState from './settingsState'
import devicesState from './deviceState'

export default combineReducers({ mapState, settingsState, devicesState })
