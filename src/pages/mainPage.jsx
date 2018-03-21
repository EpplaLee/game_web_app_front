import React, { Component } from 'react';
import {} from 'antd';
import Frame from './components/frame';
import { Link } from 'react-router-dom'
import './mainPage.css';

import pallete_icon from '../public/pallete_icon.png';
import queen_icon from '../public/queen_icon.png';

const game_list = [
  {
    name: '你画我猜',
    icon: pallete_icon,
    link: '/roomlist/draw'
  },
  {
    name: '五子棋',
    icon: queen_icon,
    link: '/roomlist/chess'
  }
]

export default class MainPage extends Component{
  render () {
    const child = <div>
      {game_list.map( (i, n) => {
        return <Link key={n.toString()} to={i.link}>
          <div className="gameitem_wrapper">
            <div className="gameitem_pic_wrapper">
              <img className="gameitem_pic" src={i.icon} alt=""/>
            </div>
            <div>
              <div className="gameitem_title">{i.name}</div>
              <div className="gameitem_info">
                <span>3个房间</span>
                <span>7人在线</span>
              </div>
            </div>
          </div>
        </Link>
      })}
    </div>
    return (
      <Frame child={child} header_title='游戏大厅'/>
    )
  }
}