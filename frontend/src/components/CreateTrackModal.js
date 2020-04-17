import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'

import { addTrack } from '../store/actions'

import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import Checkbox from '@material-ui/core/Checkbox';

import api from '../utils/api'

const CreateTrack = props => {
    const [includeAll, setIncludeAll] = useState(true)
    const [loading, setLoading] = useState(false)

    const submit = async () => {
        setLoading(true)
        const { id } = props.device
        const resp = await api.post(`/devices/${id}/track/`, {include_all: includeAll})
        setLoading(false)
        if (!resp.ok)
            return
        props.addTrack(resp.data)
        props.closeModal()
    }

    const renderForm = () => <Form>
        <Form.Group controlId="formGroupIncludeAll" onClick={ () => setIncludeAll(!includeAll) }>
            <Form.Label>Include the whole track</Form.Label>
            <Checkbox checked={includeAll}
                inputProps={{ 'aria-label': 'primary checkbox' }} />
        </Form.Group>
        <Form.Text className="text-muted">
            Include the full track (as it is displayed currently on the map), or only the part of it which is not saved.
        </Form.Text>
    </Form>

    return <Modal show={ props.visible } onHide={ props.toggleModal } >
        <Modal.Header className="modal-header modal-header-create-track">
            <Modal.Title>{ `Create track for ${props.device && props.device.name}` }</Modal.Title>
        </Modal.Header>
        <Modal.Body className="create-track-body">
            { loading ?
                <Spinner animation="border" /> :
                <Fragment>
                    <Alert variant={'info'}>
                        Here you can save the currently active track. The active track is the same track as what you can see currently on the map.
                    </Alert>
                    { renderForm() }
                </Fragment>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={ props.toggleModal } disabled={ loading }>Cancel</Button>
            <Button variant="success" onClick={ submit } disabled={ loading }>Save</Button>
        </Modal.Footer>
    </Modal>
}


export default connect(null, { addTrack })(CreateTrack)