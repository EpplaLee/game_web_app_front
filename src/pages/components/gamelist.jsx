import React, { Component } from 'react';
//import { Row, Col } from 'antd';
import { Link } from 'react-router-dom'
import pallete_icon from '../../public/pallete_icon.png';
import queen_icon from '../../public/queen_icon.png';
import './gamelist.css';

const game_list = [
  {
    name: '你画我猜',
    icon: pallete_icon,
    link: '/draw'
  },
  {
    name: '五子棋',
    icon: queen_icon,
    link: '/chess'
  }
]


export default class GameList extends Component {

  render () {
    return (
      <div>
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
    )
  }
}
