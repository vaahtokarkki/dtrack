import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, SET_AUTH_ERROR } from '../actiontypes'

const initialState = {
    notifications: [],
    authError: null,
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_NOTIFICATION: {
            if (!action.payload.color || !action.payload.content)
                return state
            const { color, content, dismissable } = action.payload
            const oldNotifications = state.notifications
                .filter(notification => notification.color !== color && notification.content !== content)
            const notifications = oldNotifications.concat([{ color, content, dismissable }])
            return {...state, notifications }
        }
        case REMOVE_NOTIFICATION: {
            const { color, content } = action.payload
            const notifications = state.notifications
                .filter(notification => notification.color !== color && notification.content !== content)
            return {...state, notifications }
        }
        case SET_AUTH_ERROR: {
            const { content } = action.payload
            return { ...state, authError: content }
        }
        default:
            return state
    }
}
