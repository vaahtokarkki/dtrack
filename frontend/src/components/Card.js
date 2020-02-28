import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faBatteryFull } from '@fortawesome/free-solid-svg-icons'


export const SmallCard = () =>
  <Card className='card-small'>
    <Card.Body>
      <Row>
        <Col xs={8}>
          <Card.Title>Helka the hunter</Card.Title>
        </Col>
        <Col>
          Online <FontAwesomeIcon icon={ faCircle } style={{ color: 'green' }}/>
        </Col>
      </Row>
      <Card.Text>
      <Row>
        <Col xs={8}>
          13min  ago 850m S 15km/h
        </Col>
        <Col>
          Battery <FontAwesomeIcon icon={ faBatteryFull } style={{ color: 'green' }}/><br/>
        </Col>
      </Row>
      </Card.Text>
    </Card.Body>
  </Card>
