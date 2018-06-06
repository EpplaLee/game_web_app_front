import React, { Component } from 'react';
// import { Row, Col, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import Frame from './components/frame';
import { api, getQueryString } from '../utils/constants';
import {  TETRIS_FRAME, TETRIS_BOARD_WIDTH, TETRIS_BOARD_HEIGHT, I,J,L,O,S,T,Z,} from '../utils/constants';
import key from 'keymaster';
import './tetrisGame.css';

const player_list  = [
  {
    nickname: '伊布',
  },
  {
    nickname: '路易吉',
  },
]

class TetrisData {
  // initial 初始化
  constructor() {
    this.board = new Array(TETRIS_BOARD_HEIGHT).fill(null).map(a => this.buildTetrisRow());
  }
  buildTetrisRow() {
    return new Array(TETRIS_BOARD_WIDTH).fill(false);
  }
  // 


  // move 移动

  // fall 下落

  // remove and settle 消除和固定

}

export default class TetrisGame extends Component {
  componentDidMount() {
    this.bindKeyboardEvents();
  }
  render() {
    const data = new TetrisData();
    const opponent_data = new TetrisData();
    const my_board = data.board;
    const my_rows = my_board.map((row, i) => {
      const row_string = row.map( (block, j) => {
        const class_string = 'tetris_block ' + ( block || 'empty_block');
        return <td key={j} className={class_string}></td>
      })
      return (
        <tr key={i}>{row_string}</tr>
      )
    })
    const opponent_board = opponent_data.board;
    const opponent_rows = opponent_board.map((row, i) => {
      const row_string = row.map( (block, j) => {
        const class_string = 'tetris_block ' + ( block || 'empty_block');
        return <td key={j} className={class_string}></td>
      })
      return (
        <tr key={i}>{row_string}</tr>
      )
    })

    const two_player_table = <div className="tetris_player_warpper">
    {player_list.map( (i, n) => <div>
        {i.nickname?
          <div className="tetris_player_warppar">
            <div className="default_avatar tetris_avatar">{i.nickname.substring(0,1)}</div>
            <div className="tetris_player_info_wrapper">
              <div className="tetris_player_name_wrapper">
                <p className="tetris_player_name">{i.nickname}</p>
              </div>
              <div className="tetris_player_wins">积分:*</div>

            </div>
          </div>
          :
          <div className="tetris_player_warppar"></div>
        }
      </div>)}
    </div>;

    const child = <div>
      <div className="opponent_area">
        <div className="palyer_info">
          {two_player_table}
        </div>
        <div>
          <table className="opponent_board">
            <tbody>
              {opponent_rows}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tetris_area">
        <table className="tetris_board">
          <tbody>
            {my_rows}
          </tbody>
        </table>
      </div>
    </div>
    return <Frame header_title="决战俄罗斯" child={child} />
  }
  bindKeyboardEvents() {
    key('down', ()=>{ console.log('down')});
    key('up', ()=>{ console.log('up')});
    key('left', ()=>{ console.log('left')});
    key('right', ()=>{ console.log('right')});
  }
}