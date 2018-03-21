import React, { Component } from 'react';
import './drawGame.css';
import './mainPage.css';

const windowToCanvas = (canvas, x, y) => {
  return {
      x: x - canvas.offsetLeft,
      y: y - canvas.offsetTop,
  }
}

export default class DrawGame extends Component  {
  componentDidMount() {
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
    return <div>
      <canvas className="draw_canvas" ref="draw_canvas" width='400' height='300'></canvas>
    </div>
  }
}