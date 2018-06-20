import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Frame from './components/frame';
import white_piece from '../public/pawn_white.png';
import black_piece from '../public/pawn_black.png';
import { api, getQueryString } from '../utils/constants'

import './drawGame.css';
import './roomPage.css';


const img_white_piece = new Image();
img_white_piece.src = white_piece;
const img_black_piece = new Image();
img_black_piece.src = black_piece;

const status_text_map = {
  0: '房主',
  1: '玩家',
}

const drawChessBoard = (context) => {
  for(let i = 10; i <= 360; i = i + 25) {
    context.beginPath();
    context.moveTo(10, i);
    context.lineTo(360, i);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(i, 10);
    context.lineTo(i, 360);
    context.closePath();
    context.stroke();
  }
}

const laozi = (e, context, color, array, canvas, ws) => {
  let x = parseInt( (e.clientX - 22.5) / 25);
  let y = parseInt( (e.clientY - 22.5) / 25);

  if(array[x][y] === 0) {
    ws.send(JSON.stringify({
      action: 1,
      room_num: getQueryString('room_num'),
      color,
      x,
      y,
    }))
  }
}

const drawChess = (context, color, x, y, canvas) => {
  if(color === 1) {
    context.drawImage(img_white_piece, x * 25 + 22.5 - canvas.offsetLeft , y * 25 + 17.5 - canvas.offsetTop, 25, 25);
  } else {
    context.drawImage(img_black_piece, x * 25 + 22.5 - canvas.offsetLeft, y * 25 + 17.5 - canvas.offsetTop, 25, 25);
  }
};
@inject('RootStore') @observer
class ChessGame extends Component {
  constructor(props) {
    super(props);
    this.chess_ws = new WebSocket(`ws://${api}/ws/chess`)
    this.chess_ws.onopen = () => {
      this.chess_ws.send( JSON.stringify({
        action: 0,    //0为建立连接，1为落子
        room_num: getQueryString('room_num'),
        phone_num: this.props.RootStore.User.phone_num,
        nickname: this.props.RootStore.User.nickname,
      }) )
    }
    this.state = {
      color: null,
      chess_list: null,
      is_playing: false,
      kkk: this.props.history,
    }
  };
  componentDidMount() {
    const self = this;
    const canvas_ele = this.refs.draw_canvas;
    const context = canvas_ele.getContext('2d');
    drawChessBoard(context);
    this.chess_ws.onmessage = (evt) => {
      let chess_res = JSON.parse(evt.data);
      if(chess_res.action === 0) {
        this.setState({
          color: chess_res.second_to_play === this.props.RootStore.User.phone_num ? 2 : 1,
          is_playing: chess_res.second_to_play !== this.props.RootStore.User.phone_num,
          chess_list: chess_res.chess_list,
        })
      } else if(chess_res.action === 1) {
        drawChess(context, chess_res.color, chess_res.x, chess_res.y, canvas_ele)
        this.setState({
          is_playing: chess_res.color === this.state.color,
          chess_list: chess_res.chess_list,
        })
      } else if(chess_res.action === 2) {
        drawChess(context, this.state.color, chess_res.x, chess_res.y, canvas_ele)
        Modal.info({
          title: `${chess_res.color === 1? '白棋' : '黑棋'}获胜`,
          onOk() {
            self.props.history.push('/')
          },
        });
      }
    }
    canvas_ele.onclick =  e => {
      if(this.state.is_playing) {
        laozi(e, context, this.state.color, this.state.chess_list, canvas_ele, this.chess_ws);
      }
    }
  }
  render() {
    const { player_list } = this.props.RootStore.Lobby;
    let { timeleft, is_playing, color } = this.state; 
    const two_player_table = <div className="player_warpper">
    {player_list.map( (i, n) => <div>
        {i.nickname?
          <div className="chess_player_warppar">
            <div className="default_avatar chess_avatar">{i.nickname.substring(0,1)}</div>
            <div className="chess_player_info_wrapper">
              <div className="chess_player_name_wrapper">
                <p className="chess_player_name">{i.nickname}</p>
              </div>
              <div className="chess_player_wins">胜场: 0</div>
              <div>总场数: 0</div>
            </div>
          </div>
          :
          <div className="chess_player_warppar"></div>
        }
        <Row>
          <Col>执子:</Col>
          <Col><img src={ n === 0? white_piece : black_piece} alt=""/></Col>
        </Row>
        <Row>
          <Col>局时: 02:30</Col>
          <Col>步时: 00:08</Col>
        </Row>
      </div>)}
    </div>;
    const child =  <div>
      <canvas className="draw_canvas" ref="draw_canvas" width='372' height='372'></canvas>
      {two_player_table}
    </div>
    return <Frame header_title="五子棋" child={child} />
  }
}
export default withRouter(ChessGame);