import React, { Component } from 'react';
import {} from 'antd';
import Navigation from './components/navigation';
import Header from './components/header';
import './mainPage.css'

export default class MainPage extends Component{
  render () {
    return (
      <div className="main_page">
        <Header header_title='用户信息' />
        <div>
          用户信息
        </div>
        <Navigation />
      </div>
    )
  }
}