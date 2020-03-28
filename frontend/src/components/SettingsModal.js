import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'

import api from '../utils/api'

import { updateUserDetails, addNotification } from '../store/actions'
import { getUserState, getUser } from '../store/selectors'

import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'


const SettingsComponent = props => {
    const useInput = ({ type, initialValue = "" }) => {
        const [value, setValue] = useState(initialValue)
        const input = <Form.Control
            value={ value }
            type={ type }
            onChange={e => setValue(e.target.value)} />
        return [value, input, setValue]
    }

    let [firstName, firstNameInput, setFirstName] = useInput({ type: "text", initialValue: props.user.firstName })
    let [lastName, lastNameInput, setLastName] = useInput({ type: "text" })
    let [refreshInterval, refreshIntervalInput, setRefreshInterval] = useInput({ type: "range" })

    useEffect(() => {
        setFirstName(props.user.firstName)
        setLastName(props.user.lastName)
        setRefreshInterval(props.user.refreshInterval)
    }, [props.user])

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const submit = async () => {
        setLoading(true)
        setError("")
        const data = { first_name: firstName, last_name: lastName, refresh_interval: refreshInterval }
        const resp = await api.put(`/user/${props.user.id}/`, data)
        setLoading(false)
        if (!resp.ok)
            return setError("Failed to save user details!")
        props.updateUserDetails({ firstName, lastName, refreshInterval })
        props.addNotification("success", "Settings saved successfully!")
        props.closeModal()
    }

    const renderError = () =>
        error && <Alert variant={ 'danger' }>{ error }</Alert>

    const renderForm = () => <Fragment>
        { renderError() }
        <Form>
            <Form.Group controlId="firstName">
                <Form.Label>First name</Form.Label>
                { firstNameInput }
            </Form.Group>
            <Form.Group controlId="lastName">
                <Form.Label>Last name</Form.Label>
                { lastNameInput }
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email (username)</Form.Label>
                <Form.Control type="text" value={ props.user.email } disabled />
            </Form.Group>
            <Form.Group controlId="refreshInterval">
                <Form.Label>Device refresh interval { refreshInterval } seconds</Form.Label>
                { refreshIntervalInput }
            </Form.Group>
        </Form>
    </Fragment>

    return<Modal show={ props.visible } onHide={ props.toggleModal } >
        <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { loading ? <Spinner animation="border" /> : renderForm() }
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={ props.toggleModal } disabled={ loading }>Cancel</Button>
            <Button variant="success" onClick={ submit } disabled={ loading }>Save</Button>
        </Modal.Footer>
    </Modal>
}

const mapStateToProps = state => {
    const userState = getUserState(state)
    const user = getUser(userState)
    return { user }
}

export default connect(mapStateToProps, { updateUserDetails, addNotification })(SettingsComponent)