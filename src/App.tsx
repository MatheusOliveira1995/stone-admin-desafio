import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/router/routes'
import { useAppSelector } from "./app/hooks";
import { ThemeProvider } from '@mui/material/styles';
import AppToast from "./components/AppToast";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import theme from 'src/settings/theme'

import "./App.css";

function App() {
  const backdrop = useAppSelector((state) => state.backdrop)

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes />
      </Router>

      <AppToast/>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop.open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
