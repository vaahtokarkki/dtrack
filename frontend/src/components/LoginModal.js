import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'

import api from '../utils/api'
import { fetchUserDetails, updateAccessToken, updateRefreshToken, initDevices } from '../store/actions'

import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


const LoginModalComponent = props => {

    const useInput = ({ type, placeholder }) => {
        const [value, setValue] = useState("")
        const resetInput = () => setValue("")
        const input = <Form.Control
            value={ value }
            type={ type }
            placeholder={ placeholder }
            onChange={e => setValue(e.target.value)} />
        return [value, input, resetInput];
    }

    const [email, emailInput, resetEmailInput] = useInput({ type: "email", placeholder: "Enter email" });
    const [password, passwordInput, resetPasswordInput] = useInput({ type: "password",placeholder: 'Password' });
    const [error, setError] = useState("")

    const submit = async () => {
        const response = await api.post("/token/", { email, password })

        if (!response.ok)
            return setError("Wrong email or password!")

        props.toggleModal()
        props.updateAccessToken(response.data.access, response.data.user_id)
        props.updateRefreshToken(response.data.refresh)
        props.fetchUserDetails()
        props.initDevices()
        resetForm()
    }

    const resetForm = () => {
        resetEmailInput()
        resetPasswordInput()
        setError("")
    }

    const renderError = () =>
        error && <Alert variant={ 'danger' }>{ error }</Alert>

    const renderForm = () => <Fragment>
        { renderError() }
        <Form>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                { emailInput }
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                { passwordInput }
            </Form.Group>
        </Form>
    </Fragment>

    return <Modal show={ props.visible } onHide={ props.toggleModal } animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Log in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { renderForm() }
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={ props.toggleModal }>Cancel</Button>
            <Button variant="success" onClick={ submit }>Log in</Button>
        </Modal.Footer>
    </Modal>
}

export const LoginModal = connect(null, { updateAccessToken, updateRefreshToken, fetchUserDetails, initDevices })(LoginModalComponent)