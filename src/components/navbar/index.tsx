import * as React from 'react';
import { styled } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import AddCardIcon from '@mui/icons-material/AddCard';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import PeopleIcon from '@mui/icons-material/People';
import { MenuItemsType } from 'src/components/Menu';

import { useNavigate } from 'react-router-dom';

import './styles.css'

import {
    CssBaseline,
    Box,
    Toolbar,
    Typography,
    IconButton,
    MenuItem,
    Menu,

} from '@mui/material'

import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { logoutAnalyst } from 'src/app/store/slices/analyst';
import { Menu as SideMenu } from 'src/components/Menu'
import { useTranslation } from 'react-i18next'

type Props = {
    handleDrawerShowing: Function
    drawerWidth: number
}
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

let drawerWidth = 240;

/**
 */
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    color: '#ffff',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

/**
 * @param props 
 */
export default function AppNavBar(props: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [open, setOpen] = React.useState(false)
    const { t } = useTranslation();
    drawerWidth = props.drawerWidth
    const navigate = useNavigate()

    const analyst = useAppSelector((state) => state.analyst)
    const dispatch = useAppDispatch()
    const adminRole = analyst.roles.find((role) => role === 'n2')

    const menuItems: MenuItemsType[] = [
        {
            label: t('main.menu.cards'),
            icon: <AddCardIcon />,
            navigateTo: '/cards'
        },
        {
            label: t('main.menu.users'),
            icon: <PeopleIcon />,
            navigateTo: '/users'
        }

    ]

    if(adminRole){
        menuItems.push(
            {
                label: t('main.menu.audits'),
                icon: <EditNotificationsIcon />,
                navigateTo: '/audits'
            },
        )
    }

    const handleDrawerOpen = () => {
        setOpen(true);
        props.handleDrawerShowing(true)
    };

    const handleListItemClick = (clicked: string) => {
        handleDrawerOpen()
        navigate(clicked)
    };

    const handleDrawerClose = () => {
        setOpen(false)
        props.handleDrawerShowing(false)
    }
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFloatMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleFloatMenuClose()
        dispatch(logoutAnalyst())
    }

    return (
        <div>
            <CssBaseline />
            <AppBar sx={{ backgroundColor: "primary", display: 'flex' }} position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {t('main.name')}
                    </Typography>
                    <Box component="div" sx={{ marginLeft: 'auto' }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleFloatMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <SideMenu open={open} drawerWidth={drawerWidth} handleListItemClick={handleListItemClick} handleDrawerClose={handleDrawerClose} menuItems={menuItems} />
        </div>
    );
}
