import React from 'react'
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
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
})

const MenuComponent = props => {
  const classes = useStyles()

  const handleToggleMenu = () => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
      return
    props.toggleMenu()
  }

  const navItems = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={ handleToggleMenu }
      onKeyDown={ handleToggleMenu } >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
