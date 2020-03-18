import React, { useEffect, useState, Fragment } from 'react'
import { connect, useDispatch } from 'react-redux'

import geodist from 'geodist'
import moment from 'moment'

import { setPosition } from '../store/actions'
import { getDevicesState, getDevices, getLatestLocationByDevice, getUserLocation } from '../store/selectors'

import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faBatteryFull } from '@fortawesome/free-solid-svg-icons'

const LocationCardsComponent = props => {
  const userLocation = getUserLocation(props.devicesState)
  return getDevices(props.devicesState)
    .filter(device => device.id !== "user")
    .map(device => {
      const location = getLatestLocationByDevice(props.devicesState, device.id)
      return <LocationCard { ...location }
        name={ device.name }
        lastSeen={ device.last_seen }
        userLocation={ userLocation ? userLocation.position : [] }
        key={ device.id }  />
    })
}

const LocationCard = ({ name, position = [], speed, timestamp, lastSeen, userLocation }) => {
  const dispatch = useDispatch()

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

  const handleOnClick = () =>
    position.length && dispatch(setPosition(position))

  const renderDistance = () => {
    if (!position.length || !userLocation.length)
      return "N/A"

      const distance = geodist(position, userLocation, { unit: 'meters' })
    if (distance > 1000)
      return `${Math.round((distance/1000 + Number.EPSILON) * 100) / 100}km`
    return `${distance}m`
  }

  const statusIcon = ()  =>
    <FontAwesomeIcon icon={ faCircle } style={{ color: isOnline() ? 'green' : 'red', marginLeft: '5px' }}/>

  const getLastSeen = () => {
    const lastSeenDate = moment(lastSeen)
    const diff = moment().diff(lastSeenDate, 'seconds')
    if (diff >= 86400)
      return `${Math.floor(diff/86400)} days ago`
    else if(diff >= 3600)
      return `${Math.floor(diff/3600)} hours ago`
    else if(diff >= 60)
      return `${Math.floor(diff/60)} minutes ago`
    return `${diff} seconds ago`
  }

  const renderStatus = () =>
    <Col className={ !isOnline() && 'col-offline' }>
      <Fragment>
      { isOnline() ?
        <span>Online{ statusIcon() }</span> :
        <Fragment><span className="last-seen">Seen { getLastSeen() }</span><span>Offline { statusIcon() }</span></Fragment>
      }
      </Fragment>
    </Col>

  const renderTitle = () =>
    <Row>
      <Col xs={ isOnline() ? 8 : 4 }>
        <Card.Title>{ name }</Card.Title>
      </Col>
      { renderStatus() }
    </Row>

  const getSpeed = () =>
    Math.round(speed)

  const isOnline = () =>
    Boolean(position.length)

  return <Card className='card-small' onClick={ handleOnClick }>
    <Card.Body>
      { renderTitle() }
      { isOnline() ?
        <div className='card-text'>
          <Row>
            <Col xs={8}>
              { time } ago, { renderDistance() } { getSpeed() }km/h
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
  return { devicesState }
}

export const LocationCards = connect(mapStateToProps, {})(LocationCardsComponent)
