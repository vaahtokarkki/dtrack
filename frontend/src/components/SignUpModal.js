import React, { useState, Fragment, useEffect } from 'react'
import { connect } from 'react-redux'

import api from '../utils/api'
import { addNotification, authenticate } from '../store/actions'


import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'


const useInput = ({ type, placeholder, initialDisabled = false, initialValue = "" }) => {
    const [value, setValue] = useState(initialValue)
    const [disabled, setDisabled] = useState(initialDisabled)
    const resetInput = () => setValue("")
    const disableInput = () => setDisabled(true)
    const input = <Form.Control
        value={ value }
        type={ type }
        placeholder={ placeholder }
        disabled={ disabled }
        onChange={e => setValue(e.target.value)} />
    return [value, input, resetInput, disableInput, setValue];
}

const STRINGS = {
    success_signup: 'Check your email for instructions how to finish sign up',
    success_finish_signup: 'Sign up finished successfully. New trackers can be added form settings.',
    info_signup: 'Fill in your email. You will receive an email how to finish your sign up and setup trackers.',
    info_finish_signup: 'Fill in your details and password to finish the sign up',
    submit_signup: 'Sign up',
    submit_details: 'Submit'
}

const SignUpModalComponent = props => {
    const getUser = () => new URLSearchParams(window.location.search).get("user")
    const getToken = () => new URLSearchParams(window.location.search).get("token")
    const isSignUpConfirmation = () => getUser() && getToken()

    const [email, emailInput, resetEmailInput, disableEmail, setEmail] = useInput({ type: "email", placeholder: "Enter email" });
    const [password, passwordInput] = useInput({ type: "password" })
    const [passwordRepeat, passwordRepeatInput] = useInput({ type: "password" })
    const [firstName, firstNameInput] = useInput({ type: "text" })
    const [lastName, lastNameInput] = useInput({ type: "text" })
    const [error, setError] = useState("")
    const [tokenError, setTokenError] = useState(false)
    const [loading, setLoading] = useState(isSignUpConfirmation() ? true : false)

    const initEmailField = async () => {
        if (!isSignUpConfirmation()) return
        const resp = await api.get(getUrl(), { token: getToken() })
        setLoading(false)
        if (!resp.ok) return setTokenError(true)
        setEmail(resp.data.email)
        disableEmail()
    }

    useEffect(() => {
        initEmailField()
    }, [])

    const submit = async () => {
        setLoading(true)
        const response = await api.post(getUrl(), getFormData())
        setLoading(false)
        if (!response.ok) return setError(response.data)

        if (isSignUpConfirmation()) {
            props.authenticate(email, password)
            props.addNotification('success', STRINGS.success_finish_signup)
        } else
            props.addNotification('success', STRINGS.success_signup)
        props.toggleModal()
        resetForm()
    }

    const toggleModal = () => {
        if (isSignUpConfirmation()) window.history.pushState(null, '', '/')
        setTokenError(false)
        props.toggleModal()
    }

    const resetForm = () => {
        resetEmailInput()
        setError("")
    }

    const getFormData = () => {
        if (isSignUpConfirmation())
            return {
                user: getUser(),
                token: getToken(),
                password: password,
                password_repeat: passwordRepeat,
                last_name: lastName,
                first_name: firstName,
            }
        return { email }
    }

    const getUrl = () => isSignUpConfirmation()
        ? `/user/${getUser()}/token/`
        : '/user/signup/'

    const getInfoText = () => isSignUpConfirmation ? STRINGS.info_finish_signup : STRINGS.info_signup

    const renderUserDetailInputs = () => isSignUpConfirmation()
        && <Fragment>
            <Form.Group>
                <Form.Label>First name</Form.Label>
                { firstNameInput }
                { error.first_name &&
                    <Form.Control.Feedback type="invalid">{ error.first_name }</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group>
                <Form.Label>Last name</Form.Label>
                { lastNameInput }
                { error.last_name &&
                    <Form.Control.Feedback type="invalid">{ error.last_name }</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                { passwordInput }
                { error.password &&
                    <Form.Control.Feedback type="invalid">{ error.password }</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group>
                <Form.Label>Password repeat</Form.Label>
                { passwordRepeatInput }
            </Form.Group>
        </Fragment>

    const renderForm = () => {
        if (loading) return <Spinner animation="border" />
        if (tokenError) return <Alert variant="danger">Sign up link expired or invalid.</Alert>
        return <Form>
            <Alert variant="info">{ getInfoText() }</Alert>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                { emailInput }
                { error.email &&
                    <Form.Control.Feedback type="invalid">{ error.email }</Form.Control.Feedback>}
            </Form.Group>
            { renderUserDetailInputs() }
        </Form>
    }

    return <Modal show={ props.visible } onHide={ toggleModal } animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Sign up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { renderForm() }
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={ toggleModal }>Cancel</Button>
            <Button variant="success" onClick={ submit } disabled={ loading }>
                { isSignUpConfirmation() ? STRINGS.submit_details : STRINGS.submit_signup }
            </Button>
        </Modal.Footer>
    </Modal>
}

export default connect(null, { addNotification, authenticate })(SignUpModalComponent)
