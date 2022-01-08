import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/router/routes'

import { ThemeProvider } from '@mui/material/styles';

import  theme  from 'src/settings/theme'

import "./App.css";

function App() {
  

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
