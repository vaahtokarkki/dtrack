import React, { useState, Fragment, useEffect } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import groupBy from 'lodash/groupBy'

import { LoginModal } from './LoginModal'
import SettingsModal from './SettingsModal'
import ManageTracksModal from './TracksModal'
import CreateTrackModal from './CreateTrackModal'
import SignUpModal from './SignUpModal'
import { toggleMenu, logOut, toggleTrack, fitMap } from '../store/actions'
import { getSettingsState, getMenuState, getUserState, isLoggedIn, getTracks, getTracksState, getTracksOnMap, getDevicesState, getDevices } from '../store/selectors'

import { makeStyles } from '@material-ui/core/styles'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ListSubheader from '@material-ui/core/ListSubheader'

import SettingsIcon from '@material-ui/icons/Settings'
import ArchiveIcon from '@material-ui/icons/Archive'
import StorageIcon from '@material-ui/icons/Storage'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import PetsIcon from '@material-ui/icons/Pets'
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import logo from '../assets/dog.png'

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  item: {
    padding: 0
  },
}))

const MenuComponent = props => {
  const classes = useStyles()

  const [recentTracksOpen, setRecentTracksOpen] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const [signUpModal, setSignUpModal] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [tracksModal, setTracksModal] = useState(false)
  const [createTrack, setCreateTrack] = useState(false) // Id of device

  const handleClick = () =>
    setRecentTracksOpen(!recentTracksOpen)

  const handleToggleMenu = () => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
      return
    props.toggleMenu()
  }

  const toggleModal = (modal, toggleMenu = true, payload = null) => {
    if (toggleMenu)
      props.toggleMenu()
    switch (modal) {
      case setLoginModal:
        return setLoginModal(!loginModal)
      case setSettingsModal:
        return setSettingsModal(!settingsModal)
      case setTracksModal:
        return setTracksModal(!tracksModal)
      case setCreateTrack:
        return setCreateTrack(payload)
      case setSignUpModal:
        return setSignUpModal(!signUpModal)
      default:
        return
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has("token") && params.has("user") && window.location.pathname === '/signup/')
      toggleModal(setSignUpModal, false)
  }, [])

  const modalComponents = () =>
    <Fragment>
      <LoginModal visible={ loginModal } toggleModal={ () => toggleModal(setLoginModal, false) } />
      <SignUpModal
        visible={ signUpModal }
        toggleModal={ () => toggleModal(setSignUpModal, false) }
        closeModal={ () => toggleModal(setSignUpModal, false) } />
      <SettingsModal
        visible={ settingsModal }
        toggleModal={ () => toggleModal(setSettingsModal) }
        closeModal={ () => toggleModal(setSettingsModal, false) } />
      <ManageTracksModal
        visible={ tracksModal }
        toggleModal={ () => toggleModal(setTracksModal) }
        closeModal={ () => toggleModal(setTracksModal, false) } />
      <CreateTrackModal
        visible={ Boolean(createTrack) }
        device={ createTrack }
        toggleModal={ () => toggleModal(setCreateTrack) }
        closeModal={ () => toggleModal(setCreateTrack, false) } />
    </Fragment>

  const renderLoggedInItems = () => <Fragment>
    <ListItem button key={ 1 } onClick={ handleClick }>
      <ListItemIcon><ArchiveIcon /></ListItemIcon>
      <ListItemText primary={ 'View recent tracks' } />
      {recentTracksOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={ recentTracksOpen } timeout="auto" unmountOnExit>
      <List component="div" disablePadding dense>
        { renderTrackItems() }
      </List>
    </Collapse>
    <ListItem button key={ 2 } onClick={ () => toggleModal(setSettingsModal) }>
      <ListItemIcon><SettingsIcon /></ListItemIcon>
      <ListItemText primary={ 'Open settings' } />
    </ListItem>
    <ListItem button key={ 3 } onClick={ () => toggleModal(setTracksModal) }>
      <ListItemIcon><StorageIcon /></ListItemIcon>
      <ListItemText primary={ 'Manage saved tracks' } />
    </ListItem>
  </Fragment>

  const handleTrackToggle = track => {
    props.toggleTrack(track.id)
    if (!track.displayOnMap)
      props.fitMap(track.id)
  }

  const renderTrackItems = () => {
    const sortedTracks = props.tracks
      .sort((a, b) => moment(b.start) - moment(a.start))
    const groupedTracks = groupBy(sortedTracks, getTrackMonth)

    return Object.keys(groupedTracks).map(key => {
      return <Fragment key={ key }>
          <ListSubheader>{ key }</ListSubheader>
          { groupedTracks[key].map(track => {
          const { id, device } = track
          const start = moment(track.start)
          const end = moment(track.end)
          const length = Math.round((track.length + Number.EPSILON) * 100) / 100
          return <ListItem button className={ classes.nested } key={ id } onClick={ () => handleTrackToggle(track) }>
            <ListItemIcon>
              { props.visibleTracksOnMap.some(t => t.id === id) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />  }
            </ListItemIcon>
            <ListItemText
              primary={ `${device.name} ${start.format("D.M.YYYY")}` }
              secondary={`${start.format("hh:mm")}-${end.format("hh:mm")} (${length}km)`} />
          </ListItem>
          }) }
      </Fragment>
    })
  }

  const renderDevices = () => {
    const devicesOnline = props.devices
      .filter(device => device.id !== "user")
      .filter(device => device.locations.length)

    if (!devicesOnline.length)
      return null

    return <Fragment>
        <List
          className="nav-list"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Create track for devices
            </ListSubheader>
          } >
          { devicesOnline.map(device => {
            return <ListItem button key={ device.id } onClick={ () => toggleModal(setCreateTrack, true, device) }>
              <ListItemIcon><PetsIcon /></ListItemIcon>
              <ListItemText primary={ device.name } secondary={ `Create track for ${device.name}` } />
            </ListItem>
          }) }
      </List>
      <Divider />
    </Fragment>
  }

  const notLoggedInItems = () => <Fragment>
    <ListItem button key='login' onClick={ () => toggleModal(setLoginModal) }>
      <ListItemIcon><LockOpenIcon /></ListItemIcon>
      <ListItemText primary={ 'Log in' } secondary={ 'Log in to track dogs and view saved tracks '} />
    </ListItem>
    <Divider />
    <ListItem button key='signup' onClick={ () => toggleModal(setSignUpModal) }>
      <ListItemIcon><PersonAddIcon /></ListItemIcon>
      <ListItemText primary={ 'Sign up' } secondary={ 'If you don\'t have an account sign up here  '} />
    </ListItem>
  </Fragment>

  const renderNavigationListItems = () =>
    isLoggedIn(props.userState) ? renderLoggedInItems() : notLoggedInItems()

  const renderCreateTrackItems = () =>
    isLoggedIn(props.userState) && renderDevices()

  const handleLogOut = () => {
    props.logOut()
    props.toggleMenu()
  }

  const getUserItem = () => {
    return isLoggedIn(props.userState) &&
      <ListItem button key={ 1 }>
        <ListItemText primary={ `Logged in as ${props.userState.firstName}` } secondary={ 'Log out' } onClick={ handleLogOut } />
      </ListItem>
  }

  const navItems = () => (
    <div className={ classes.list }
      role="presentation"
      onClick={ handleToggleMenu }
      onKeyDown={ handleToggleMenu } >
      <div className="nav-header">
        <img src={ logo } alt="logo" />
        <h2>Track Helka the dog</h2>
      </div>
      <Divider />
      <List className="nav-list">
        { renderNavigationListItems() }
      </List>
      { renderCreateTrackItems() }
      <List>
        { getUserItem() }
      </List>
    </div>
  )

  return <Fragment>
    { modalComponents() }
    <Drawer open={ props.menuState } onClose={ () => props.toggleMenu() }>
      { navItems() }
    </Drawer>
  </Fragment>
}

const getTrackMonth = track =>
  moment(track.start).format("MMMM YYYY")

const mapStateToProps = state => {
  const settingsState = getSettingsState(state)
  const devicesState = getDevicesState(state)
  const userState = getUserState(state)
  const menuState = getMenuState(settingsState)
  const tracksState = getTracksState(state)
  const tracks = getTracks(tracksState)
  const devices = getDevices(devicesState)
  const visibleTracksOnMap = getTracksOnMap(tracksState)
  return { menuState, userState, tracks, visibleTracksOnMap, devices }
}

export default connect(mapStateToProps, { toggleMenu, logOut, toggleTrack, fitMap })(MenuComponent)
