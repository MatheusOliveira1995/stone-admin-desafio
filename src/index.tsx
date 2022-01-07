import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'src/App';
import reportWebVitals from './reportWebVitals';
import 'src/i18n';
import store from 'src/app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
