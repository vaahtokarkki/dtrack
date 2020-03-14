import React, { useState } from 'react'
import { connect } from 'react-redux'

import { toggleMenu } from '../store/actions'
import { getSettingsState, getMenuState } from '../store/selectors'

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

  const [open, setOpen] = useState(false);

  const handleClick = () =>
    setOpen(!open)

  const handleToggleMenu = () => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
      return
    props.toggleMenu()
  }

  const navItems = () => (
    <div
      className={ classes.list }
      role="presentation"
      onClick={ handleToggleMenu }
      onKeyDown={ handleToggleMenu } >
      <div className="nav-header">
        <img src={ logo } />
        <h2>Track the Helka dog</h2>
      </div>
      <Divider />
      <List className="nav-list">
        <ListItem button key={ 1 } onClick={ handleClick }>
          <ListItemIcon><ArchiveIcon /></ListItemIcon>
          <ListItemText primary={ 'View recent tracks' } />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={ open } timeout="auto" unmountOnExit>
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
      </List>
      <Divider />
      <List>
        <ListItem button key={ 1 }>
          <ListItemText primary={ 'Logged in as Roni' } secondary={ 'Log out' } />
        </ListItem>
      </List>
    </div>
  )

  return <Drawer open={ props.menuState } onClose={ () => props.toggleMenu() }>
    { navItems() }
  </Drawer>
}

const mapStateToProps = state => {
  const settingsState = getSettingsState(state)
  const menuState = getMenuState(settingsState)
  return { menuState }
}

export default connect(mapStateToProps, { toggleMenu })(MenuComponent)
