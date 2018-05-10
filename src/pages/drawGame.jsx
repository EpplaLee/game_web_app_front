import React, { Component } from 'react';
import { Tag } from 'antd';
import { withRouter } from 'react-router-dom';
import Frame from './components/frame';
import { api, getQueryString } from '../utils/constants'

import './drawGame.css';
import './roomPage.css';

const windowToCanvas = (canvas, x, y) => {
  return {
      x: x - canvas.offsetLeft,
      y: y - canvas.offsetTop,
  }
}

const palette = ["#ff4d4f", "#faad14", "#52c41a", "#40a9ff", "#b739ef", "#333333"];

const status_text_map = {
  0: '房主',
  1: '玩家',
}
const status_color_map = {
  0: '#108ee9',
  1: '#2db7f5',
}
class DrawGame extends Component  {
  constructor(props) {
    super(props);
    this.draw_ws = new WebSocket(`ws://${api}/ws/draw`)
    this.draw_ws.onopen = () => {
      this.draw_ws.send( JSON.stringify({
        action: 0,
        room_num: getQueryString('room_num'),
        phone_num: this.props.RootStore.User.phone_num,
        nickname: this.props.RootStore.User.nickname,
      }))
    }
    this.state = {
      timeleft: 60,
      player_list: [],
    }
  }
  componentDidMount() {
    // 绘图部分
    let { timeleft } = this.state;
    setInterval( () => {
      if(timeleft > 0) {
        timeleft = timeleft - 1;
        this.setState({ timeleft: timeleft });
      }
    }, 1000)

    const canvas_ele = this.refs.draw_canvas;
    const context = canvas_ele.getContext('2d');
    let isDrawing = false;
    //鼠标绘图捕捉
    canvas_ele.onmousedown = e => {
      isDrawing = true;
      let ele = windowToCanvas(canvas_ele, e.clientX, e.clientY);
      let { x, y } = ele;
      context.moveTo(x, y);
      canvas_ele.onmousemove = e => {
        if(isDrawing) {
          let ele = windowToCanvas(canvas_ele, e.clientX, e.clientY);
          let { x, y } = ele;
          context.lineTo(x,y);
          context.stroke();
        }
      }
    }
    canvas_ele.onmouseup = () => {
      isDrawing = false;
    }
    //触屏绘图捕捉
    canvas_ele.addEventListener('touchstart', e => {
      isDrawing = true;
      let touch = e.touches[0];
      let ele = windowToCanvas(canvas_ele, touch.clientX, touch.clientY);
      let { x, y } = ele;
      context.moveTo(x, y);
      canvas_ele.addEventListener('touchmove', e => {
        if(isDrawing) {
          let touch = e.touches[0];
          let ele = windowToCanvas(canvas_ele, touch.clientX, touch.clientY);
          let { x, y } = ele;
          context.lineTo(x,y);
          context.stroke();
        }
      })
    })
    canvas_ele.addEventListener('touchend', () => {
      isDrawing = false;
    })

    // 通信部分
    this.draw_ws.onmessage = (evt) => {
      let draw_res = JSON.stringify(evt.data);
      if(draw_res.action === 0) {

      } else if(draw_res.action === 1) {
        
      }
    }
  }
  render() {
    let { timeleft, player_list } = this.state; 
    const child =  <div>
      <div className="info_wrapper">
        <span>提示： 水果（三个字）</span>
        <span>剩余时间: {timeleft}s</span>
      </div>
      <canvas className="draw_canvas" ref="draw_canvas" width='372' height='300'></canvas>
      <div className="colorpicker_wrapper">
      {palette.map( (i, n) => {
        return <div style={{ background: {i} }} className="palette_item"></div>
      })
      }
      </div>
      <div className="linepicker_wrapper">
        <div className="line_item"><div></div></div>
        <div className="line_item"><div></div></div>
        <div className="line_item"><div></div></div>
      </div>
      <div className="player_warpper">
      {player_list.map( (i, n) => <div>
        {i.nickname?
          <div className="draw_player_warppar">
            <div className="default_avatar">{i.nickname.substring(0,1)}</div>
            <p>{i.nickname}</p>
            <Tag className="status_tag" color={status_color_map[i.status]}>{status_text_map[i.status]}</Tag>
          </div>
          :
          <div className="draw_player_warppar"></div>
        }
      </div>)}
    </div>
    </div>
    return <Frame header_title="你画我猜" child={child} />
  }
}
export default withRouter(DrawGame);