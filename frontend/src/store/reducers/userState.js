import { UPDATE_DETAILS, UPDATE_ACCESS_TOKEN, UPDATE_REFRESH_TOKEN } from '../actiontypes'


const initialState = {
    id: null,
    email: null,
    name: null,
    refreshInterval: 60,  // seconds
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
}

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_DETAILS: {
            const { details } = action.payload
            return {
                ...state, ...details
            }
        }
        case UPDATE_ACCESS_TOKEN: {
            return {
                ...state, accessToken: action.payload
            }
        }
        case UPDATE_REFRESH_TOKEN: {
            return {
                ...state, refreshToken: action.payload
            }
        }
        default:
            return state
    }
}