import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'

import { authenticate } from '../store/actions'
import { getNotificationsState, getAuthError } from '../store/selectors'

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

    const submit = async () => {
        await props.authenticate(email, password)
        if (props.authError) return
        props.toggleModal()
        resetForm()
    }

    const resetForm = () => {
        resetEmailInput()
        resetPasswordInput()
    }

    const renderError = () =>
        props.authError && <Alert variant={ 'danger' }>{ props.authError }</Alert>

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

const mapStateToProps = state => {
    const authError = getAuthError(getNotificationsState(state))
    return { authError }
}


export const LoginModal = connect(mapStateToProps, { authenticate })(LoginModalComponent)