import React, { Component } from 'react';
import { Tag, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import './roomPage.css';
import './chatRoom.css'
import Frame from './components/frame';
import { observer, inject } from 'mobx-react';

import { api, getQueryString } from '../utils/constants.js'

const Search = Input.Search;

const status_text_map = {
  0: '房主',
  1: '等待',
}
const status_color_map = {
  0: '#108ee9',
  1: '#2db7f5',
}
const title_map = {
  'draw': '你画我猜',
  'chess': '五子棋',
  'tetris': '决战俄罗斯',
}
@inject('RootStore') @observer
class RoomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input_str: '',
      chat_array: [],
      player: {
        nickname: this.props.RootStore.User.nickname,
        phone_num: this.props.RootStore.User.phone_num,
      }
    }
    this.room_ws = new WebSocket(`ws://${api}/ws/gameroom`)
    this.room_ws.onopen = () => {
      this.room_ws.send(JSON.stringify({
        action: getQueryString('action'),       //0为加入房间，1为游戏开始
        type: this.props.type,
        player: this.state.player,
        room_num: getQueryString('room_num'),
      }))
    }
  };
  componentDidMount() {
    this.room_ws.onmessage = (evt) => {
      let room_res = JSON.parse(evt.data)
      if(room_res.action === 0) {
        this.props.RootStore.Lobby.refreshPlayer(room_res.player_list)
      } else if(room_res.action === 1) {
        this.props.history.push(`/${this.props.type}?room_num=${getQueryString('room_num')}`)
      } else if(room_res.action === 2) {
        let chat_array = this.state.chat_array.slice();
        chat_array.push(room_res.str)
        this.setState({ chat_array })
      }
    }
  }
  componentWillUnmount () {
    this.props.RootStore.User.clearAuthority()
  }

  render () {
    const { input_str, chat_array } = this.state
    const { type } = this.props;
    const { player_list } = this.props.RootStore.Lobby
    console.log('kkkkkkkkkk', player_list)
    const five_player_table = <div className="player_warpper">
      {player_list.map( (i, n) => <div>
        {i.nickname?
          <div className="draw_player_warppar"  style={{ display: i.nickname? 'block' : 'none'}}>
            <div className="default_avatar">{i.nickname.substring(0,1)}</div>
            <p>{i.nickname}</p>
            <Tag className="status_tag" color={status_color_map[i.status]}>{status_text_map[i.status]}</Tag>
          </div>
          :
          <div className="draw_player_warppar"></div>
        }
      </div>)}
    </div>;
    const two_player_table = <div className="player_warpper">
    {player_list.map( (i, n) => <div>
        {i.nickname?
          <div className="chess_player_warppar">
            <div className="default_avatar chess_avatar">{i.nickname.substring(0,1)}</div>
            <div className="chess_player_info_wrapper">
              <div className="chess_player_name_wrapper">
                <p className="chess_player_name">{i.nickname}</p>
                <div className="custom_status_tag">{status_text_map[i.authority]}</div>
              </div>
              <div className="chess_player_wins">胜场:0</div>
              <div>总场数:0</div>
            </div>
          </div>
          :
          <div className="chess_player_warppar"></div>
        }
      </div>)}
    </div>;
    const child = <div className="roompage">
      <div>
        { type === 'chess' || 'tetris' ? two_player_table : five_player_table}
      </div>
      <Button 
      style={{ display: this.props.RootStore.User.authority === 0? 'block' : 'none'}}
        disabled={!((type === 'chess' || 'tetris' && player_list.length === 2) || (type === 'draw' && player_list.length >= 2)) }
        onClick={ () => {
          this.room_ws.send(JSON.stringify({
            action: 1,       //0为加入房间，1为游戏开始, 2为聊天消息
            type: this.props.type,
            player: this.state.player,
            room_num: getQueryString('room_num'),
          }))
        } } 
        className="startgame_btn" type="primary"
      >游戏开始</Button>
      <div className="chatroom_wrapper">
        <div className="chatroom_content">
          <div className="chat_wrapper">{chat_array.map( (i, n) => {
            return <div key={n} className="chat_item">{i}</div>
          })
          }
          </div>
        </div>
        <div>
          <Search 
            placeholder="单击此处编辑聊天内容" 
            enterButton="发送" 
            size="default"
            value={input_str}
            onChange = { (evt) => {
              this.setState({
                input_str: evt.target.value,
              })
            }}
            onSearch = { (value) => {
              this.room_ws.send(JSON.stringify({
                action: 2,
                type: this.props.type,
                room_num: getQueryString('room_num'),
                str: value,
                phone_num: this.props.RootStore.User.phone_num,
              }))
              this.setState({
                input_str: '',
              })
            }}
          />
        </div>
      </div>
    </div>
    return (
      <Frame header_title={title_map[type]}
        child={child}
      >
      </Frame>
    )
  }
}
export default withRouter(RoomPage);
