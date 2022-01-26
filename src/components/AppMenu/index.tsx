import React, {ReactNode} from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import MuiDrawer from '@mui/material/Drawer';
import {
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,

} from '@mui/material'

import './styles.css'

export type MenuItemsType = {
  label: string,
  icon: ReactNode,
  navigateTo: string, 
}
type Props = {
  open: boolean,
  drawerWidth: number,
  handleDrawerClose: React.MouseEventHandler,
  handleListItemClick: (navigate: string) => void,
  menuItems: MenuItemsType[]
}

let menuDrawerWidth = 240

/**
 */
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

/**
 * @param theme 
 */
const openedMixin = (theme: Theme): CSSObject => ({
  width: menuDrawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

/**
 * @param theme 
 */
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

/**
 * @param prop
 */
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: menuDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

/**
 * @param props 
 */

export function Menu({open, drawerWidth, handleDrawerClose, handleListItemClick, menuItems}: Props) {
  const [openMenu, setOpenMenu] = React.useState(open)
  const theme = useTheme()
  menuDrawerWidth = drawerWidth

  React.useEffect(() => {
    setOpenMenu(open)
  }, [open])

  return (
    <Drawer variant="permanent" open={openMenu}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List className='menu-list'>
        {menuItems.map((menuItem) => (
          <ListItem className='menu-list-item' onClick={ () => handleListItemClick(menuItem.navigateTo)} button key={menuItem.label}>
            <ListItemIcon className='menu-list-icon'>
              { menuItem.icon }
            </ListItemIcon>
            <ListItemText primary={menuItem.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}