import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Frame from './components/frame';
import white_piece from '../public/pawn_white.png';
import black_piece from '../public/pawn_black.png';

import './drawGame.css';
import './roomPage.css';

const img_white_piece = new Image();
img_white_piece.src = white_piece;
const img_black_piece = new Image();
img_black_piece.src = black_piece;

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

const status_text_map = {
  'master': '房主',
  'waiting': '等待',
  'ready': '准备',
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

const laozi = (e, context, color, array, canvas) => {
  let x = parseInt((e.clientX - 22.5) / 25);
  let y = parseInt((e.clientY - 22.5) / 25);

  if(array[x][y] === 0) {
    drawChess(context, color, array, x, y, canvas)
  }
}

const drawChess = (context, color, array, x, y, canvas) => {
  if(color === 1) {
    context.drawImage(img_white_piece, x * 25 + 22.5 - canvas.offsetLeft , y * 25 + 17.5 - canvas.offsetTop, 25, 25);
    array[x][y] = color;
  } else {
    context.drawImage(img_black_piece, x * 25 + 22.5 - canvas.offsetLeft, y * 25 + 17.5 - canvas.offsetTop, 25, 25);
    array[x][y] = color;
  }
}

export default class ChessGame extends Component  {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    const canvas_ele = this.refs.draw_canvas;
    const context = canvas_ele.getContext('2d');
    drawChessBoard(context);

    let color = 1;

    let chess_data = [];
    for(let i = 0; i < 15; i++) {
      chess_data[i] = [];
      for(let j =0; j < 15; j++) {
        chess_data[i][j] = 0;
      }
    }

    canvas_ele.onclick =  e => {
      laozi(e, context, color, chess_data, canvas_ele);
      if(color === 1) {
        color = 2;
      } else {
        color = 1;
      }
    }

  }
  render() {
    let { timeleft } = this.state; 
    const two_player_table = <div className="player_warpper">
    {chess_player_list.map( (i, n) => <div>
        {i.player_name?
          <div className="chess_player_warppar">
            <div className="default_avatar chess_avatar">{i.player_name.substring(0,1)}</div>
            <div className="chess_player_info_wrapper">
              <div className="chess_player_name_wrapper">
                <p className="chess_player_name">{i.player_name}</p>
                <div className="custom_status_tag">{status_text_map[i.status]}</div>
              </div>
              <div className="chess_player_wins">胜场:{i.wins_round}</div>
              <div>总场数:{i.all_round}</div>
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