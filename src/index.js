import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import RootStore from './store/root'
import { Provider } from 'mobx-react';


const stores = { RootStore };

ReactDOM.render(<Provider {...stores}>
  <App />
</Provider>
, document.getElementById('root'));
registerServiceWorker();
