import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import api from '../utils/api'

import { removeTrack, setTrackVisibility } from '../store/actions'
import { getTracksState, getTracks } from '../store/selectors'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import DeleteIcon from '@material-ui/icons/Delete'


const ManageTracks = props => {
    const getInitialValue = () =>
        props.tracks.length ? props.tracks.map(track => ({ [track.id]: track.displayOnMap }))[0] : {}

    const [checkedTracks, setCheckedTracks] = useState(getInitialValue())

    const resetCheckBoxValues = useCallback(() => {
        setCheckedTracks(getInitialValue())
    }, [setCheckedTracks])

    useEffect(() => {
        resetCheckBoxValues()
    }, [props.tracks, resetCheckBoxValues])

    const handleChange = id =>
        setCheckedTracks({...checkedTracks, [id] : !checkedTracks[id] })

    const addTracks = () => {
        props.closeModal()
        for (let key in checkedTracks) {
            props.setTrackVisibility(key, checkedTracks[key])
        }
    }

    const deleteTrack = async id => {
        const resp = await api.delete(`/tracks/${id}/`)
        if (!resp.ok)
            return
        props.removeTrack(id)
        return
    }

    const renderTracks = () => <Table>
        <thead>
            <tr>
                <td>Add</td><td>Device</td><td>Time</td><td>Delete</td>
            </tr>
        </thead>
        <tbody>
            { props.tracks.map(track => {
                const start = moment(track.start)
                const end = moment(track.end)
                const diff = end.diff(start, 'hours')
                return <tr key={ track.id }>
                    <td><input type="checkbox" checked={ checkedTracks[track.id] || false } onChange={ () => handleChange(track.id) } /></td>
                    <td>{ track.device.name }</td>
                    <td>{ `${start.format("D.M.YYYY")}, ${diff}h (${Math.round(track.length)}km)`}</td>
                    <td><Button variant="danger" size="sm" onClick={ () => deleteTrack(track.id) }><DeleteIcon /></Button></td>
                </tr>
            }) }
        </tbody>
    </Table>

    return <Modal show={ props.visible } onHide={ props.toggleModal } >
        <Modal.Header>
            <Modal.Title>Manage saved tracks</Modal.Title>
        </Modal.Header>
        <Modal.Title className="modal-subtitle">Delete tracks or add old tracks to the map.</Modal.Title>
        <Modal.Body>
            { renderTracks() }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={ props.toggleModal }>Cancel</Button>
            <Button variant="outline-success" onClick={ addTracks } >Add selected to map</Button>
        </Modal.Footer>
    </Modal>
}

const mapStateToProps = state => {
    const tracksState = getTracksState(state)
    const tracks = getTracks(tracksState)
    return { tracks }
}

export default connect(mapStateToProps, { removeTrack, setTrackVisibility })(ManageTracks)