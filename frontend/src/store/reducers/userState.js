import { UPDATE_DETAILS, UPDATE_ACCESS_TOKEN, UPDATE_REFRESH_TOKEN, LOG_OUT } from '../actiontypes'


const initialState = {
    id: localStorage.getItem("userId"),
    email: null,
    name: null,
    firstName: null,
    lastName: null,
    refreshInterval: 60,  // seconds
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
}

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_DETAILS: {
            return { ...state, ...action.payload }
        }
        case UPDATE_ACCESS_TOKEN: {
            const { accessToken } = action.payload
            const id = action.payload.id ? action.payload.id : state.id
            return { ...state, accessToken, id }
        }
        case UPDATE_REFRESH_TOKEN: {
            return { ...state, refreshToken: action.payload }
        }
        case LOG_OUT: {
            return { initialState, refreshToken: null, accessToken: null, id: null }
        }
        default:
            return state
    }
}