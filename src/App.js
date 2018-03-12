import React, { Component } from 'react';
//import MainPage from './pages/mainPage';
import './App.css';
import RouterConfig from './router.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <RouterConfig />
      </div>
    );
  }
}

export default App;
