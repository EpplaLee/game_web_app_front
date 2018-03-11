import React, { Component } from 'react';
import {} from 'antd';
import Navigation from './components/navigation';
import GameList from './components/gamelist';
import Header from './components/header';
import './mainPage.css'

export default class MainPage extends Component{
  render () {
    return (
      <div className="main_page">
        <Header header_title='游戏大厅' />
        <GameList />
        <Navigation />
      </div>
    )
  }
}