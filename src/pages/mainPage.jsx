import React, { Component } from 'react';
// import { Button } from 'antd';
import Frame from './components/frame';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx'
import './mainPage.css';

import pallete_icon from '../public/pallete_icon.png';
import queen_icon from '../public/queen_icon.png';
import tetris_icon from '../public/tetris.png';
import refresh_icon from '../public/refresh.png'

@inject('RootStore') @observer
export default class MainPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render () {
    let { 
      chess_rooms, 
      draw_rooms,
      tetris_rooms,
      chess_players,
      draw_players,
      tetris_players,
      enterLobby,
      getLobby
    } = this.props.RootStore.Lobby
    chess_rooms = toJS(chess_rooms);
    draw_rooms = toJS(draw_rooms);
    tetris_rooms = toJS(tetris_rooms);
    chess_players = toJS(chess_players);
    draw_players = toJS(draw_players);
    tetris_players = toJS(tetris_players);
    const game_list = [
      {
        name: '你画我猜',
        type: 'draw',
        icon: pallete_icon,
        link: '/roomlist/draw',
        room_num: Object.keys(draw_rooms).length,
        player_num: Object.keys(draw_players).length,
      },
      {
        name: '五子棋',
        icon: queen_icon,
        type: 'chess',
        link: '/roomlist/chess',
        room_num: Object.keys(chess_rooms).length,
        player_num: Object.keys(chess_players).length,
      },
      {
        name: '决战俄罗斯',
        type: 'tetris',
        icon: tetris_icon,
        link: '/roomlist/tetris',
        room_num: Object.keys(tetris_rooms).length,
        player_num: Object.keys(tetris_players).length,
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
      <div onClick={ () => { getLobby() }} className="refresh_button">
        <img  className="refresh_img"  src={refresh_icon} alt=""/>
      </div>
    </div>
    return (
      <Frame child={child} header_title='游戏大厅'/>
    )
  }
}