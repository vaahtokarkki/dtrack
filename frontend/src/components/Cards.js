import React, { useEffect, useState } from 'react'
import geodist from 'geodist'
import moment from 'moment'

import { getUserLocation } from '../store/selectors'


import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faBatteryFull } from '@fortawesome/free-solid-svg-icons'

export const LocationCards = ({ locationState }) => {
  const userLocation = getUserLocation(locationState)
  return locationState.locations ? locationState.locations
    .filter(device => device.name !== "user")
    .map(device => <LocationCard { ...device } userLocation={ userLocation.position || [] } key={ device.id }  />) :
    null
}

const LocationCard = ({ name, position, speed, timestamp, userLocation }) => {

  const resolveTimeStamp = () => {
    const deviceTime = moment(timestamp)
    const diff = moment().diff(deviceTime, 'seconds')
    if (diff > 60)
      return `${Math.round(diff/60)}min`
    return `${diff}s`
  }

  const [time, setTime] = useState(resolveTimeStamp())
  useEffect(() => {
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

  return <Card className='card-small'>
    <Card.Body>
      <Row>
        <Col xs={8}>
          <Card.Title>{ name }</Card.Title>
        </Col>
        <Col>
          Online <FontAwesomeIcon icon={ faCircle } style={{ color: 'green' }}/>
        </Col>
      </Row>
      <div className='card-text'>
        <Row>
          <Col xs={8}>
            { time } ago, { renderDistance() } {speed}km/h
          </Col>
          <Col>
            Battery <FontAwesomeIcon icon={ faBatteryFull } style={{ color: 'green' }}/><br/>
          </Col>
        </Row>
      </div>
    </Card.Body>
  </Card>
}
