import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/router/routes'
import AppNavBar from "./components/home/navbar/AppNavBar";
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles';

import "./App.css";

const menuWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${menuWidth}px`,
  marginTop: '65px',
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

function App() {
  const [open, setOpen] = React.useState(false);

  const handleMenu = (state: boolean) => {
    setOpen(state);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <AppNavBar handleDrawerShowing={handleMenu} drawerWidth={menuWidth}/>
        <Main open={open}>
          <Routes />
        </Main>
      </Box>
    </Router>
  );
}

export default App;
