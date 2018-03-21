import React, { Component } from 'react';
import { Tag, Input } from 'antd';
import {  } from 'react-router-dom';
import './roomPage.css';
import Frame from './components/frame';

const Search = Input.Search;

const chess_player_list = [
  {
    player_name: "沙滩男孩",
    wins_round: 4,
    all_round: 7,
    status: 'master',
  },
  {
    player_name: "瓜皮男孩",
    wins_round: 21,
    all_round: 50,
    status: 'waiting',
  }
];
const draw_player_list = [
  {
    player_name: "马里奥",
    status: 'master',
  },
  {
    player_name: "路易吉",
    status: 'ready',
  },
  {
    player_name: "皮卡丘",
    status: 'waiting',
  },
  {

  },
  {

  }
];
const status_text_map = {
  'master': '房主',
  'waiting': '等待',
  'ready': '准备',
}
const status_color_map = {
  'master': '#108ee9',
  'waiting': '#2db7f5',
  'ready': '#87d068',
}
export default class RoomPage extends Component {
  // constructor(props) {
  //   super(props);
  // };

  render () {
    const { type } = this.props;

    const five_player_table = <div className="player_warpper">
      {draw_player_list.map( (i, n) => <div>
        {i.player_name?
          <div className="draw_player_warppar"  style={{ display: i.player_name? 'block' : 'none'}}>
            <div className="default_avatar">{i.player_name.substring(0,1)}</div>
            <p>{i.player_name}</p>
            <Tag className="status_tag" color={status_color_map[i.status]}>{status_text_map[i.status]}</Tag>
          </div>
          :
          <div className="draw_player_warppar"></div>
        }
      </div>)}
    </div>;
    const two_player_table = <div>
    {chess_player_list.map( (i, n) => <div>
        {i.player_name?
          <div  style={{ display: i.player_name? 'block' : 'none'}}>
            <div>{i.player_name.substring(0,1)}</div>
            <p>{i.player_name}</p>
            <Tag className="status_tag" color={status_color_map[i.status]}>{status_text_map[i.status]}</Tag>
          </div>
          :
          <div></div>
        }
      </div>)}
    </div>;
    const child = <div className="roompage">
      <div>
        { type === 'chess' ? two_player_table : five_player_table}
      </div>

      <div className="chatroom_wrapper">
        <div className="chatroom_content"></div>
        <div>
          <Search placeholder="单击此处编辑聊天内容" enterButton="发送" size="default" />
        </div>
      </div>
    </div>
    return (
      <Frame header_title={type === 'chess' ? "五子棋" : '你画我猜'}
        child={child}
      >
      </Frame>
    )
  }
}
