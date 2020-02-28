import React from 'react'
import { connect } from "react-redux";

import { zoomIn, zoomOut } from '../store/actions'

import Menu from '@material-ui/icons/Menu'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'

import FollowDropdown from './FollowDropdown'


const MapControls = props =>
    <div className="map-controls">
        <FollowDropdown />
        <div>
            <Remove className='map-control' onClick={ props.zoomOut } />
            <Add className='map-control' onClick={ props.zoomIn }  style={{ marginLeft: 10 }} />
        </div>
        <Menu className='map-control' />
    </div>

export default connect(null, { zoomIn, zoomOut })(MapControls)