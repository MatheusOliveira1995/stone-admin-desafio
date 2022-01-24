import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'src/App';
import 'src/i18n';
import { PersistGate } from 'redux-persist/lib/integration/react';
import defaultStoreConfig from './app/store';
import { Provider } from 'react-redux'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={defaultStoreConfig.store}>
      <PersistGate loading={null} persistor={defaultStoreConfig.persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
