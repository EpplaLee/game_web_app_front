import React, { Component } from 'react';
import { Row, Col } from 'antd';
import game_center from '../../public/game_center.png';
import personal_info from '../../public/personal_info.png'
import './navigation.css'


export default class Navigation extends Component {

  render () {
    return (
      <nav className="nav_wrapper">
        <Row>
          <Col span={12}>
            <div className="navitem_wrapper navitem_selected">
              <img className="navitem_icon" src={game_center} alt=""/>
              <p className="navitem_title">游戏大厅</p>
            </div>
          </Col>
          <Col span={12}>
            <div className="navitem_wrapper">
              <img className="navitem_icon" src={personal_info} alt=""/>
              <p className="navitem_title">个人信息</p>
            </div>
          </Col>
        </Row>
      </nav>
    )
  }
}
