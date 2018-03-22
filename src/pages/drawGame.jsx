import React, { Component } from 'react';
import Frame from './components/frame';

import './drawGame.css';

const windowToCanvas = (canvas, x, y) => {
  return {
      x: x - canvas.offsetLeft,
      y: y - canvas.offsetTop,
  }
}

const palette = [];

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

      </div>
    </div>
    return <Frame header_title="你画我猜" child={child} />
  }
}