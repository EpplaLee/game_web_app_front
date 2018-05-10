import React, { Component } from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './roomList.css';
import Frame from './components/frame';
import two_player from '../public/two_player.png';
import five_player from '../public/five_player.png';

@inject('RootStore') @observer
class GameList extends Component {
  constructor(props) {
    super(props);
    let room_list, title, room_pic;
    if(this.props.type === 'draw') {
      room_list = this.props.RootStore.Lobby.draw_rooms;
      title = '你画我猜';
      room_pic = five_player;
    } else if ( this.props.type === 'chess') {
      room_list = this.props.RootStore.Lobby.chess_rooms;
      title = '五子棋';
      room_pic = two_player;
    } else if ( this.props.type === 'tetris') {
      room_list = this.props.RootStore.Lobby.tetris_rooms;
      title = '决战俄罗斯';
      room_pic = two_player;
    }
    this.state = {
      room_list,
      player: {
        nickname: this.props.RootStore.User.nickname,
        phone_num: this.props.RootStore.User.phone_num,
      },
      title,
      room_pic,
    }
  };
  render () {
    const { type, history } = this.props;
    const { player, room_list, title, room_pic } = this.state
    console.log( player, this.props.RootStore.User.nickname)
    const { createRoom, enterRoom  } = this.props.RootStore.Lobby;
    const child = <div>
      <div className="roomlist_wrapper">
        {Object.keys(room_list).map( (i, n) => {
          return <div onClick={ () => { enterRoom(history, type, player, i) }} key={n.toString()} to={`/roompage/${type}/${i}`}>
            <div className="roomlist_item">
              <div className="roomlist_item_id">ID：{i}</div>
              <img src={room_pic} alt="" className="roomlist_icon"/>
              <div>房间人数：{room_list[i].current_count}/{room_list[i].full_count}</div>
              <div>{room_list[i].status === 0? '等待中...' : '游戏中...' }</div>
            </div>
          </div>
        })
        }
      </div>
      <Button onClick={ () => { createRoom(history, type, player) }} className="createroom_btn" type="primary">创建房间</Button>
    </div>
    return (
      <Frame header_title={title}
        child={child}
      >
      </Frame>
    )
  }
}
export default withRouter(GameList);