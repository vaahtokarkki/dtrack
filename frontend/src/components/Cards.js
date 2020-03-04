import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import geodist from 'geodist'
import moment from 'moment'

import { getLocationState, getDevicesState, getUserLocation, getDevices, getLocationByDeviceId } from '../store/selectors'

import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faBatteryFull } from '@fortawesome/free-solid-svg-icons'

const LocationCardsComponent = props => {
  const userLocation = getUserLocation(props.locationState)
  return getDevices(props.devicesState)
    .map(device => {
      const location = getLocationByDeviceId(props.locationState, device.id)
      return <LocationCard { ...location }
        name={ device.name }
        userLocation={ userLocation ? userLocation.position : [] }
        key={ device.id }  />
    })
}

const LocationCard = ({ name, position = [], speed, timestamp, userLocation }) => {
  const resolveTimeStamp = () => {
    if (!timestamp)
      return null

    const deviceTime = moment(timestamp)
    const diff = moment().diff(deviceTime, 'seconds')
    if (diff > 60)
      return `${Math.round(diff/60)}min`
    return `${diff}s`
  }

  const [time, setTime] = useState("")
  useEffect(() => {
    setTime(resolveTimeStamp())
    const time = setInterval(() => setTime(resolveTimeStamp()), 1000)
    return () => clearInterval(time)
  }, [resolveTimeStamp, setTime])


  const renderDistance = () => {
    if (!position.length || !userLocation.length)
      return "N/A"

      const distance = geodist(position, userLocation, { unit: 'meters' })
    if (distance > 1000)
      return `${Math.round((distance/1000 + Number.EPSILON) * 100) / 100}km`
    return `${distance}m`
  }

  const renderStatus = () =>
    <Col>
      { isOnline() ? 'Online' : 'Offline' } <FontAwesomeIcon icon={ faCircle } style={{ color: isOnline() ? 'green' : 'red' }}/>
    </Col>

  const isOnline = () =>
    Boolean(position.length)

  return <Card className='card-small'>
    <Card.Body>
      <Row>
        <Col xs={8}>
          <Card.Title>{ name }</Card.Title>
        </Col>
        { renderStatus() }
      </Row>
      { isOnline() ?
        <div className='card-text'>
          <Row>
            <Col xs={8}>
              { time } ago, { renderDistance() } {speed}km/h
            </Col>
            <Col>
              Battery <FontAwesomeIcon icon={ faBatteryFull } style={{ color: 'green' }}/><br/>
            </Col>
          </Row>
        </div> : null
    }
    </Card.Body>
  </Card>
}

const mapStateToProps = state => {
  const devicesState = getDevicesState(state)
  const locationState = getLocationState(state)
  return { locationState, devicesState }
}

export const LocationCards = connect(mapStateToProps, {})(LocationCardsComponent)
