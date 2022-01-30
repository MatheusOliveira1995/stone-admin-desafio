import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/router/routes'
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { hide } from 'src/app/store/slices/toast';
import { ThemeProvider } from '@mui/material/styles';
import AppToast from "./components/AppToast";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import theme from 'src/settings/theme'

import "./App.css";

function App() {
  const toast = useAppSelector((state) => state.toast)
  const backdrop = useAppSelector((state) => state.backdrop)
  const dispatch = useAppDispatch()

  const handleCloseToast = () => {
    dispatch(hide())
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes />
      </Router>
      <AppToast
        visible={toast.visible}
        color={toast.color}
        message={toast.message}
        handleClose={handleCloseToast}
      />
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
