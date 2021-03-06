import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import api from '../utils/api'

import { updateUserDetails, addNotification, updateDevice, addDevice } from '../store/actions'
import { getUserState, getUser, getDevicesState, getDevices } from '../store/selectors'

import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Table from 'react-bootstrap/Table'

import EditIcon from '@material-ui/icons/Edit'
import CheckIcon from '@material-ui/icons/Check'


const SettingsComponent = props => {
    const [activeTab, setActiveTab] = useState('user')

    return <Modal show={ props.visible } onHide={ props.toggleModal } >
        <Modal.Header>
            <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <div className="tab-wrapper">
            <Tabs id="controlled-tab-example"
                activeKey={ activeTab }
                onSelect={ (k) => setActiveTab(k) } >
                <Tab eventKey="user" title="User">
                    <Modal.Title className="modal-subtitle">
                        User settings
                    </Modal.Title>
                    <SettingsForm { ...props } />
                </Tab>
                <Tab eventKey="devices" title="Devices">
                    <Modal.Title className="modal-subtitle">
                        Device settings
                    </Modal.Title>
                    <DeviceSettings { ...props } />
                </Tab>
                <Tab eventKey="add-device" title="Add device">
                    <Modal.Title className="modal-subtitle">
                        Add new device
                    </Modal.Title>
                    <AddDeviceForm { ...props } />
                </Tab>
            </Tabs>
        </div>
    </Modal>
}


const SettingsForm = props => {
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
    }, [props.user, setFirstName, setLastName, setRefreshInterval])

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

    return loading ? <Spinner animation="border" /> : <Fragment>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={ props.toggleModal } disabled={ loading }>Cancel</Button>
            <Button variant="success" onClick={ submit } disabled={ loading }>Save</Button>
        </Modal.Footer>
    </Fragment>
}

const DeviceSettings = props => {
    return <Fragment>
        <Modal.Body>
            <EditDevicesForm { ...props } />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={ props.toggleModal }>Cancel</Button>
            <Button variant="outline-success" onClick={ props.closeModal }>Done</Button>
        </Modal.Footer>
    </Fragment>
}

const EditDevicesForm = props => {
    const [editing, setEditing] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(null) // Id of device

    const toggleEdit = device => {
        if (device.id === editing)
            return setEditing(null)
        setEditing(device.id)
        setName(device.name)
    }

    const renderIcon = id => {
        if (!editing)
            return <EditIcon disabled={ loading }/>
        return editing === id ? <CheckIcon /> : null
    }

    const renderButton = device =>
        editing === device.id && loading === device.id ?
            <Spinner animation="border" /> :
            <Button variant="outline-success" size="sm" onClick={ () => editing === device.id ? submit() : toggleEdit(device) }>
                { renderIcon(device.id) }
            </Button>

    const submit = async () => {
        setLoading(editing)
        const resp = await api.put(`/devices/${editing}/`, { name })
        if (!resp.ok)
            return setLoading(null)
        setLoading(null)
        setEditing(null)
        props.updateDevice(resp.data)
    }

    const renderDevices = () =>
        props.devices.map(device => <tr key={ device.id }>
            <td colSpan={ editing === device.id ? 3 : 1 }>
                { editing === device.id ?
                    <Form.Control type="text" value={ name } onChange={ (e) => setName(e.target.value) }/> :
                    device.name }
            </td>
            { editing !== device.id && <Fragment>
                <td>{ moment(device.last_seen).format("DD.MM.") }</td>
                <td>{ renderTrackerId(device.tracker_id) }</td>
            </Fragment> }
            <td>{ renderButton(device) }</td>
        </tr>)

    return <Table size="sm">
        <thead>
            <tr><td>Device</td><td>Last seen</td><td>Tracker id</td><td>Edit</td></tr>
        </thead>
        <tbody>
            { renderDevices() }
        </tbody>
    </Table>
}

const AddDeviceForm = props => {
    const [trackerId, setTrackerId] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const renderError = () =>
        error && <Alert variant='danger'>{ error }</Alert>

    const submit = async () => {
        setError("")
        setLoading(true)
        const resp = await api.post('/devices/', { tracker_id: trackerId })
        setLoading(false)
        if (!resp.ok)
            return setError("Invalid tracker id") // TODO: Do better

        const device = resp.data
        device.locations = device.locations
            .map(location => {
                return {
                    id: location.id,
                    position: location.point.coordinates,
                    speed: location.speed,
                    timestamp: location.timestamp,
                }
            })
        props.addDevice(device)
        props.addNotification(`Device ${device.name} added successfully`)
        props.closeModal()
    }

    const renderForm = () => <Modal.Body>
        <Form>
            <Form.Group controlId="trackerIdGroup">
                <Form.Label>Tracker id</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter tracker id"
                    value={ trackerId }
                    onChange={ (e) => setTrackerId(e.target.value) } />
                <Form.Text className="text-muted">
                    This identifies the device. Ask tracker id from device owner or admin if the device is not added to any user.
                </Form.Text>
            </Form.Group>
        </Form>
    </Modal.Body>

    return loading ?
        <Spinner animation="border" /> :
        <Fragment>
            { renderError() }
            { renderForm() }
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={ props.toggleModal }>Cancel</Button>
                <Button variant="outline-success" onClick={ submit }>Add device</Button>
            </Modal.Footer>
        </Fragment>
}

const renderTrackerId = trackerId =>
    trackerId.length > 5 ? `${trackerId.slice(0, 5)}...` : trackerId

const mapStateToProps = state => {
    const userState = getUserState(state)
    const devicesState = getDevicesState(state)
    const devices = getDevices(devicesState).filter(d => d.id !== "user")
    const user = getUser(userState)
    return { user, devices }
}

export default connect(mapStateToProps, { updateUserDetails, addNotification, updateDevice, addDevice })(SettingsComponent)