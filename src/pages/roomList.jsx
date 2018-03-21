import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './roomList.css';
import Frame from './components/frame';
import two_player from '../public/two_player.png';
import five_player from '../public/five_player.png';

const chess_room = [
  {
    room_id: 1,
    player_num: 1,
    status: 'waiting',
  },
  {
    room_id: 2,
    player_num: 2,
    status: 'waiting',
  },
  {
    room_id: 3,
    player_num: 2,
    status: 'playing',
  }
]

export default class GameList extends Component {
  // constructor(props) {
  //   super(props);
  // };

  render () {
    let room_list = chess_room
    console.log(this.props);
    const { type } = this.props;
    const child = <div>
      <div className="roomlist_wrapper">
        {room_list.map( (i, n) => {
          return <Link key={n.toString()} to={`/roompage/${type}/${i.room_id}`}>
            <div className="roomlist_item">
              <div className="roomlist_item_id">ID：{i.room_id}</div>
              <img src={type === 'chess' ? two_player : five_player } alt="" className="roomlist_icon"/>
              <div>房间人数：{i.player_num}/2</div>
              <div>{i.status === 'waiting'? '等待中...' : '游戏中...' }</div>
            </div>
          </Link>
        })
        }
      </div>
      <Button className="createroom_btn" type="primary">创建房间</Button>
    </div>
    return (
      <Frame header_title={type === 'chess' ? "五子棋" : '你画我猜'}
        child={child}
      >
      </Frame>
    )
  }
}
