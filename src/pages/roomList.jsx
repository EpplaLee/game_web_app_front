import React, { Component } from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
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
@inject('RootStore') @observer
class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {
        nickname: this.props.RootStore.User.nickname,
        phone_num: this.props.RootStore.User.phone_num,
      }
    }
  };
  render () {
    let room_list = chess_room;
    const { type, history } = this.props;
    const { player } = this.state 
    const { createRoom, enterRoom } = this.props.RootStore.Lobby;
    const child = <div>
      <div className="roomlist_wrapper">
        {room_list.map( (i, n) => {
          return <div onClick={ () => { enterRoom(history, type, player) }} key={n.toString()} to={`/roompage/${type}/${i.room_id}`}>
            <div className="roomlist_item">
              <div className="roomlist_item_id">ID：{i.room_id}</div>
              <img src={type === 'chess' ? two_player : five_player } alt="" className="roomlist_icon"/>
              <div>房间人数：{i.player_num}/2</div>
              <div>{i.status === 'waiting'? '等待中...' : '游戏中...' }</div>
            </div>
          </div>
        })
        }
      </div>
      <Button onClick={ () => { createRoom(history, type, player) }} className="createroom_btn" type="primary">创建房间</Button>
    </div>
    return (
      <Frame header_title={type === 'chess' ? "五子棋" : '你画我猜'}
        child={child}
      >
      </Frame>
    )
  }
}
export default withRouter(GameList);