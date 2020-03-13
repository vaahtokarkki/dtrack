import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../actiontypes'

const initialState = {
    notifications: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_NOTIFICATION: {
            console.log('sadas', state.notifications, action.payload);
            const notifications = state.notifications.concat([action.payload])
            return {...state, notifications }
        }
        case REMOVE_NOTIFICATION: {
            const { color, content } = action.payload
            const notifications = state.notifications
                .filter(notification => notification.color !== color && notification.content !== content)
            return {...state, notifications }
        }
        default:
            return state
    }
}
