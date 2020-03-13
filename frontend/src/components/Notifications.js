import React from 'react'
import { connect, useDispatch } from 'react-redux'

import Alert from 'react-bootstrap/Alert'

import { getNotificationsState, getNotifications } from '../store/selectors'
import { removeNotification } from '../store/actions'


const AllNotifications = props =>
    props.notifications.map(notification => <Notification { ...notification } />)

const Notification = ({ content, color }) => {
    const dispatch = useDispatch()

    const dismissNotification = () =>
        dispatch(removeNotification(color, connect))

    return <Alert variant={ color } className="notification" onClose={ dismissNotification } dismissible>
        { content }
    </Alert>
}

const mapStateToProps = state => {
    const notificationsState = getNotificationsState(state)
    const notifications = getNotifications(notificationsState)
    return { notifications }
}

export default connect(mapStateToProps, {})(AllNotifications)