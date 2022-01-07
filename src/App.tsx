import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/router/routes'

import "./App.css";

function App() {
  return (
    <Router>
      <Routes/>
    </Router>
  );
}

export default App;
