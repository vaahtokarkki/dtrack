import React, { useState } from 'react'

import api from '../utils/api'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


export const LoginModal = ({visible, toggleModal}) => {

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
        try {
            const response = await api.post("/token/", { email, password })
        } catch(error) {
            console.log('er', error)
        }
        resetEmailInput()
        resetPasswordInput()
    }

    const renderForm = () => <Form>
        <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            { emailInput }
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            { passwordInput }
        </Form.Group>
    </Form>

    return <Modal show={ visible } onHide={ toggleModal } animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Log in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { renderForm() }
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={ toggleModal }>Cancel</Button>
            <Button variant="success" onClick={ submit }>Log in</Button>
        </Modal.Footer>
    </Modal>
}
