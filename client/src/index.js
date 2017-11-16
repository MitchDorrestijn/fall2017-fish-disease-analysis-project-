import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import { TranslateProvider } from 'translate-components'
import translations from './translations.json'

ReactDOM.render(
  <TranslateProvider translations={translations} defaultLanguage={'en'}>
    <App />
  </TranslateProvider>,
  document.getElementById('root')
);
