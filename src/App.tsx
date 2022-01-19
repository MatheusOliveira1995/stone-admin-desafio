import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/router/routes'
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { hide } from 'src/app/store/slices/toast';
import { ThemeProvider } from '@mui/material/styles';
import AppToast from "./components/AppToast/indes";

import  theme  from 'src/settings/theme'

import "./App.css";

function App() {
  const toast = useAppSelector((state) => state.toast)
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
    </ThemeProvider>
  );
}

export default App;
