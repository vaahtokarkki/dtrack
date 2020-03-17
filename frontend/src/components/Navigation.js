import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'

import { LoginModal } from './LoginModal'
import { toggleMenu, logOut } from '../store/actions'
import { getSettingsState, getMenuState, getUserState, isLoggedIn } from '../store/selectors'

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

import ScheduleIcon from '@material-ui/icons/Schedule'
import SettingsIcon from '@material-ui/icons/Settings'
import ArchiveIcon from '@material-ui/icons/Archive'
import StorageIcon from '@material-ui/icons/Storage'
import LockOpenIcon from '@material-ui/icons/LockOpen'

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
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () =>
    setRecentTracksOpen(!recentTracksOpen)

  const handleToggleMenu = () => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
      return
    props.toggleMenu()
  }

  const openLoginForm = () => {
    props.toggleMenu()
    toggleModal()
  }

  const toggleModal = () =>
    setModalOpen(!modalOpen)

  const modalComponent = () =>
    <LoginModal visible={ modalOpen } toggleModal={ toggleModal } />

  const loggedInItems = () => <Fragment>
    <ListItem button key={ 1 } onClick={ handleClick }>
      <ListItemIcon><ArchiveIcon /></ListItemIcon>
      <ListItemText primary={ 'View recent tracks' } />
      {recentTracksOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={ recentTracksOpen } timeout="auto" unmountOnExit>
      <List component="div" disablePadding dense>
        <ListSubheader>{`April 2020`}</ListSubheader>
        <ListItem button className={ classes.nested } dense>
          <ListItemIcon><ScheduleIcon /></ListItemIcon>
          <ListItemText primary="2.4.2020" secondary="16:44-22:01 (25.2km)" />
        </ListItem>
        <ListSubheader>{`March 2020`}</ListSubheader>
        <ListItem button className={ classes.nested }>
          <ListItemIcon><ScheduleIcon /></ListItemIcon>
          <ListItemText primary="13.3.2020" secondary="15:44-20:01 (15km)" />
        </ListItem>
        <ListItem button className={ classes.nested }>
          <ListItemIcon><ScheduleIcon /></ListItemIcon>
          <ListItemText primary="15.3.2020" secondary="08:44-10:01 (7.5km)" />
        </ListItem>
      </List>
    </Collapse>
    <ListItem button key={ 2 }>
      <ListItemIcon><SettingsIcon /></ListItemIcon>
      <ListItemText primary={ 'Open settings' } />
    </ListItem>
    <ListItem button key={ 3 }>
      <ListItemIcon><StorageIcon /></ListItemIcon>
      <ListItemText primary={ 'Manage saved tracks' } />
    </ListItem>
  </Fragment>

  const logInItem = () => <ListItem button key='login' onClick={ openLoginForm }>
    <ListItemIcon><LockOpenIcon /></ListItemIcon>
    <ListItemText primary={ 'Log in' } secondary={ 'Log in to track dogs and view saved tracks '} />
  </ListItem>

  const getNavigationListItems = () =>
    isLoggedIn(props.userState) ? loggedInItems() : logInItem()

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
        { getNavigationListItems() }
      </List>
      <Divider />
      <List>
        { getUserItem() }
      </List>
    </div>
  )

  return <Fragment>
    { modalComponent() }
    <Drawer open={ props.menuState } onClose={ () => props.toggleMenu() }>
      { navItems() }
    </Drawer>
  </Fragment>
}

const mapStateToProps = state => {
  const settingsState = getSettingsState(state)
  const userState = getUserState(state)
  const menuState = getMenuState(settingsState)
  return { menuState, userState }
}

export default connect(mapStateToProps, { toggleMenu, logOut })(MenuComponent)
