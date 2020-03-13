import React, { useState } from 'react'

import Alert from 'react-bootstrap/Alert'

export const Notification = ({ heading, content, color }) => {
    const [show, setShow] = useState(true)

    if (!show)
        return null

    return <Alert variant={ color } className="notification" onClose={ () => setShow(false) } dismissible>
        { content }
    </Alert>
}
