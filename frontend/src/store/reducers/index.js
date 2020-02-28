import { combineReducers } from "redux"

import mapState from './mapState'
import locationState from './locationState'
import settingsState from './settingsState'

export default combineReducers({ mapState, locationState, settingsState })
