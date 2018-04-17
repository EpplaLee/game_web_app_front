import React, { Component } from 'react';
import { Tag } from 'antd';
import Frame from './components/frame';

import './drawGame.css';
import './roomPage.css';

const windowToCanvas = (canvas, x, y) => {
  return {
      x: x - canvas.offsetLeft,
      y: y - canvas.offsetTop,
  }
}

const palette = ["#ff4d4f", "#faad14", "#52c41a", "#40a9ff", "#b739ef", "#333333"];

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

export default class DrawGame extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      timeleft: 60,
    }
  }
  componentDidMount() {
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
  }
  render() {
    let { timeleft } = this.state; 
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
      {draw_player_list.map( (i, n) => <div>
        {i.player_name?
          <div className="draw_player_warppar">
            <div className="default_avatar">{i.player_name.substring(0,1)}</div>
            <p>{i.player_name}</p>
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