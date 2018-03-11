import React, { Component } from 'react';
import default_avatar from '../../public/default_avatar.png';
import './header.css';


export default class Header extends Component {

  render () {
    const { header_title } = this.props
    return (
      <nav className="header_area">
        <div className="header_title">
          {header_title}
        </div>
        <img className="header_avatar" src={default_avatar} alt=""/>
      </nav>
    )
  }
}
