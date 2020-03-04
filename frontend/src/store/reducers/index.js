import { combineReducers } from "redux"

import mapState from './mapState'
import locationState from './locationState'
import settingsState from './settingsState'
import devicesState from './deviceState'

export default combineReducers({ mapState, locationState, settingsState, devicesState })
