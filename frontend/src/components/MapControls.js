import React from 'react'
import { connect } from "react-redux";

import { zoomIn, zoomOut, fitMap, toggleMenu } from '../store/actions'

import Menu from '@material-ui/icons/Menu'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'

import FollowDropdown from './FollowDropdown'


const MapControls = props =>
    <div className="map-controls">
        <div className="map-controls-row">
            <ZoomOutMapIcon className='map-control align-right' onClick={ props.fitMap } />
        </div>
        <div className="map-controls-row">
            <FollowDropdown />
            <div>
                <Remove className='map-control zoom-control' onClick={ props.zoomOut } />
                <Add className='map-control zoom-control' onClick={ props.zoomIn }  style={{ marginLeft: 10 }} />
            </div>
            <Menu className='map-control' onClick={ props.toggleMenu } />
        </div>
    </div>

export default connect(null, { zoomIn, zoomOut, fitMap, toggleMenu })(MapControls)