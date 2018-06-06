import React, { Component } from 'react';
// import { Button } from 'antd';
import Frame from './components/frame';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './mainPage.css';

import pallete_icon from '../public/pallete_icon.png';
import queen_icon from '../public/queen_icon.png';
import tetris_icon from '../public/tetris.png'

@inject('RootStore') @observer
export default class MainPage extends Component{
  render () {
    const { 
      chess_rooms, 
      draw_rooms,
      chess_players,
      draw_players,
      enterLobby,
    } = this.props.RootStore.Lobby
    const game_list = [
      {
        name: '你画我猜',
        type: 'draw',
        icon: pallete_icon,
        link: '/roomlist/draw',
        room_num: 3 || draw_rooms.length,
        player_num: 8 || draw_players.length,
      },
      {
        name: '五子棋',
        icon: queen_icon,
        type: 'chess',
        link: '/roomlist/chess',
        room_num: 2 || chess_rooms.length,
        player_num: 9 || chess_players.length,
      },
      {
        name: '决战俄罗斯',
        type: 'tetris',
        icon: tetris_icon,
        link: '/roomlist/tetris',
        room_num: 4,
        player_num: 7,
      }
    ]
    const child = <div>
      {game_list.map( (i, n) => {
        return <Link onClick={ () => { enterLobby(i.type) } } key={n.toString()} to={i.link}>
          <div className="gameitem_wrapper">
            <div className="gameitem_pic_wrapper">
              <img className="gameitem_pic" src={i.icon} alt=""/>
            </div>
            <div>
              <div className="gameitem_title">{i.name}</div>
              <div className="gameitem_info">
                <span>{i.room_num}个房间</span>
                <span>{i.player_num}人在线</span>
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