import React, { Component } from 'react';
import {  Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Frame from './components/frame';
import { api, getQueryString } from '../utils/constants';
import {   TETRIS_FRAME, TETRIS_BOARD_WIDTH, TETRIS_BOARD_HEIGHT, I,J,L,O,S,T,Z,} from '../utils/constants';
import key from 'keymaster';
import './tetrisGame.css';
import arrow_icon from '../public/arrow.png'

const getRanDomShape = () => {
  const types = [I, J, L, O, S, T, Z];
  return  types[Math.floor(Math.random() * types.length)]
}

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
    this.block = {
      block_obj: getRanDomShape(),
      position: {
        x: TETRIS_BOARD_WIDTH / 2,
        y: 0,
      },
      rotation: 0,
    }
  }
  buildTetrisRow() {
    return new Array(TETRIS_BOARD_WIDTH).fill(false);
  }
  // 


  // move 移动
  moveLeft() {
    this.clearBoard();
    const position_x = this.block.position.x - 1;
    const position_y = this.block.position.y;
    if(this.isEmptyPosition(position_x, position_y, null)) {
      this.block.position = {
        x: position_x,
        y: position_y,
      };
      console.log(this.board);
    }
    this.setPiece(null);
  }
  moveRight() {
    this.clearBoard();
    const position_x = this.block.position.x + 1;
    const position_y = this.block.position.y;
    if(this.isEmptyPosition(position_x, position_y, null)) {
      this.block.position = {
        x: position_x,
        y: position_y,
      };
      console.log(this.board);
    }
    this.setPiece(null);
  }
  // fall 下落
  moveDown(score) {
    this.clearBoard();
    const position_x = this.block.position.x;
    const position_y = this.block.position.y + 1;
    if(this.isEmptyPosition(position_x, position_y, null)) {
      this.block.position = {
        x: position_x,
        y: position_y,
      };
      console.log(this.board);
    } else {
      this.setPiece('shape-grey');
      score = this.removeLines(score);
      this.setUpNewPiece();
      return score;
    }
    this.setPiece(null);
    return score;
  }
  setPiece(className) {
    const block = this.block.block_obj.blocks[this.block.rotation];
    for (let x = 0; x < block[0].length; x++) {
      for (let y = 0; y < block[0].length; y++) {
        if (block[y][x]) {
            const boardX = this.block.position.x + x;
            const boardY = this.block.position.y + y;
            this.board[boardY][boardX] = className || this.block.block_obj.className;
        }
      }
    }
  }
  clearBoard() {
    for(let x = 0; x < TETRIS_BOARD_WIDTH; x++) {
      for(let y = 0; y < TETRIS_BOARD_HEIGHT; y++) {
        if(this.board[y][x] !== false && this.board[y][x] !== 'shape-grey')  {
          this.board[y][x] = false;
        }
      }
    }
  }
  isEmptyPosition(position_x, position_y, rotation) {
    const block = this.block.block_obj.blocks[ rotation || this.block.rotation];
    for(let x = 0; x < block[0].length; x++) {
      for(let y = 0; y < block[0].length; y++) {
        const boardX = position_x + x;
        const boardY = position_y + y;
        if(block[y][x]) {
          if(boardX >=0 && boardX < TETRIS_BOARD_WIDTH && boardY < TETRIS_BOARD_HEIGHT) {
            if(this.board[boardY][boardX]) {
              console.log('有障碍', x, y)
              return false;
            }
          } else {
            console.log('出界', x,y)
            return false;
          }
        }
      }
    }
    return true;
  }
  rotateBlock() {
    this.clearBoard();
    const new_rotation = (this.block.rotation + 1) % this.block.block_obj.blocks.length;
    if(this.isEmptyPosition(this.block.position.x, this.block.position.y, new_rotation)) {
      this.block.rotation = new_rotation;
    }
    this.setPiece(null);
  }
  setUpNewPiece() {
    const shape = getRanDomShape();
    const position = {
      x: (TETRIS_BOARD_WIDTH / 2) - shape.blocks.length / 2,
      y: 0
    };
    const new_piece = {
      block_obj: shape,
      position,
      rotation: 0,
    }
    this.block = new_piece;
    if(!this.isEmptyPosition()) {
      // player lost
    }
  }
  removeLines(score) {
    for(let y = 0; y < this.board.length; y++) {
      if(this.board[y].every(a => a)) {
        this.board.splice(y, 1);
        this.board.unshift(this.buildTetrisRow());
        score += 100;
      }
    }
    return score;
  }
  // remove and settle 消除和固定

}
@inject('RootStore') @observer
class TetrisGame extends Component {
  constructor(props) {
    super(props);
    this.tetris_ws = new WebSocket(`ws://${api}/ws/tetris`)
    this.tetris_ws.onopen = () => {
      this.tetris_ws.send( JSON.stringify({
        action: 0,    //0为建立连接，1为传输data，2为+1层,3为游戏结束
        room_num: getQueryString('room_num'),
        phone_num: this.props.RootStore.User.phone_num,
        nickname: this.props.RootStore.User.nickname,
      }) )
    }
    this.data = new TetrisData();
    this.opponent_data = new TetrisData();

    this.state = {
      my_score: 0,
      opponent_score: 0,
      my_data: this.data,
      my_board: this.data.board,
      opponent_board: this.opponent_data.board,
    }
  }
  _interval = () => {
    setInterval( () => {
        let score = this.data.moveDown(this.state.my_score);
        // this.data.setPiece(null);
        this.setState({
          my_board: this.data.board.map( a => Object.assign([], a)),
          my_score: score,
        })
        this.tetris_ws.send(JSON.stringify({
          action: 1,
          room_num: getQueryString('room_num'),
          phone_num: this.props.RootStore.User.phone_num,
          nickname: this.props.RootStore.User.nickname,
          board: this.data.board.map( a => Object.assign([], a)),
          score: score,
        }))
    }, TETRIS_FRAME)
  }
  componentDidMount() {
    const self = this
    this.tetris_ws.onmessage = (evt) => {
      let tetris_res = JSON.parse(evt.data);
      if(tetris_res.action === 0) {
        this.setState({
        })
        this._interval();
        this.bindKeyboardEvents();
      } else if(tetris_res.action === 1) {
        this.setState({
          opponent_board: tetris_res.board.map( a => Object.assign([], a)),
          opponent_score: tetris_res.score
        })
      } else if(tetris_res.action === 2) {
        Modal.info({
          title: `${tetris_res.winner}取得胜利`,
          onOk() {
            self.props.history.push('/')
          },
        });
      }
    }
    
  }
  render() {
    var browser={  
      versions:function(){   
        var u = navigator.userAgent, app = navigator.appVersion;   
        return {//移动终端浏览器版本信息   
            trident: u.indexOf('Trident') > -1, //IE内核  
            presto: u.indexOf('Presto') > -1, //opera内核  
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器  
            iPad: u.indexOf('iPad') > -1, //是否iPad    
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
            qq: u.match(/\sQQ/i) == " qq" //是否QQ  
        };  
      }(),  
      language:(navigator.browserLanguage || navigator.language).toLowerCase()  
    }
    const {opponent_board, my_board, my_score} = this.state;
    const my_rows = my_board.map((row, i) => {
      const row_string = row.map( (block, j) => {
        const class_string = 'tetris_block ' + ( block || 'empty_block');
        return <td key={j} className={class_string}></td>
      })
      return (
        <tr key={i}>{row_string}</tr>
      )
    })
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
              <div className="tetris_player_wins">积分:{my_score}</div>

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
      {browser.versions.mobile || browser.versions.ios || browser.versions.android?  
      <div>
        <div className="arrow-up arrow-circle" onClick={ () => { this.data.rotateBlock() }}>
          <img className="arrow-up-img arrow-img" src={arrow_icon} alt=""/>
        </div>
        <div className="arrow-down arrow-circle" onClick={ () => { this.data.moveDown() }}>
          <img className="arrow-down-img arrow-img" src={arrow_icon} alt=""/>
        </div>
        <div className="arrow-left arrow-circle" onClick={ () => { this.data.moveLeft() }}>
          <img className="arrow-left-img arrow-img" src={arrow_icon} alt=""/>
        </div>
        <div className="arrow-right arrow-circle" onClick={ () => { this.data.moveRight() }}>
          <img className="arrow-right-img arrow-img" src={arrow_icon} alt=""/>
        </div>
      </div>
      : 
      null
      }
    </div>
    return <Frame header_title="决战俄罗斯" child={child} />
  }
  bindKeyboardEvents() {
    key('down', ()=>{
      this.data.moveDown();
      this.setState({
        my_board: this.data.board.map( a => Object.assign([], a))
      })
    });
    key('up', ()=>{ 
      this.data.rotateBlock();
      this.setState({
        my_board: this.data.board.map( a => Object.assign([], a))
      })
    });
    key('left', ()=>{
      this.data.moveLeft();
      this.setState({
        my_board: this.data.board.map( a => Object.assign([], a))
      })
    });
    key('right', ()=>{ 
      this.data.moveRight();
      this.setState({
        my_board: this.data.board.map( a => Object.assign([], a))
      })
    });
  }
}
export default withRouter(TetrisGame);