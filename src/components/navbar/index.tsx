import * as React from 'react';
import { styled } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import './styles.css'

import {
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    MenuItem,
    Menu,

} from '@mui/material'

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import { Menu as SideMenu } from 'src/components/Menu'

import { useTranslation } from 'react-i18next'
let drawerWidth = 240;

type Props = {
    handleDrawerShowing: Function
    drawerWidth: number
}
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

/**
 */
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    color:'#ffff',
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    drawerWidth = props.drawerWidth

    const { t } = useTranslation();

    const handleDrawerOpen = () => {
        setOpen(true);
        props.handleDrawerShowing(true)
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

    return (
        <div>
            <CssBaseline />
            <AppBar className="navbar-header" position="fixed" open={open}>
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
                        {t('home.name')}
                    </Typography>
                    <div className='avatar'>
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
                            <MenuItem onClick={handleFloatMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleFloatMenuClose}>My account</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>

            <SideMenu open={open} drawerWidth={drawerWidth} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
        </div>
    );
}
