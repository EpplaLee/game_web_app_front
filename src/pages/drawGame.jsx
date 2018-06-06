import React, { Component } from 'react';
import { Tag, message } from 'antd';
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
    this.track = [];
    this.state = {
      player_list: [],
      is_drawer: false,
      answer: '',
      timeleft: 90,
    }
  }

  componentDidMount() {
    //定义节流函数
    const throttle = function(method, context) {
      clearTimeout(method.tId);
      method.tId = setTimeout(function(){
        method.call(context);
      }, 200)
    }
    const send_track = () => {
      this.draw_ws.send(JSON.stringify({
        action: 1,
        track: this.track,
      }))
      this.track = [];
    }
    const send_answer = () => {
      this.draw_ws.send(JSON.stringify({
        action: 2,
        answer: this.state.answer,
      }))
    }
    // 绘图部分
    const canvas_ele = this.refs.draw_canvas;
    const context = canvas_ele.getContext('2d');
    let isDrawing = false;
    //鼠标绘图捕捉
    canvas_ele.onmousedown = e => {
      if(this.state.is_drawer) {
        isDrawing = true;
      }
      let ele = windowToCanvas(canvas_ele, e.clientX, e.clientY);
      let { x, y } = ele;
      this.track.push([x,y]);
      //context.moveTo(x, y);
      canvas_ele.onmousemove = e => {
        if(isDrawing) {
          let ele = windowToCanvas(canvas_ele, e.clientX, e.clientY);
          let { x, y } = ele;
          this.track.push([x,y]);
          throttle(send_track);
          // context.lineTo(x,y);
          // context.stroke();
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
      this.track.push([x,y]);
      context.moveTo(x, y);
      canvas_ele.addEventListener('touchmove', e => {
        if(isDrawing) {
          let touch = e.touches[0];
          let ele = windowToCanvas(canvas_ele, touch.clientX, touch.clientY);
          let { x, y } = ele;
          this.track.push([x,y]);
          throttle(send_track);
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
        //处理游戏开始逻辑
      } else if(draw_res.action === 1) {
        //处理绘画逻辑,若本人为画手则不处理
        let start_point = draw_res.track.pop();
        context.moveTo(start_point[0], start_point[1]);
        while(draw_res.track.length > 0) {
          let coordinate = draw_res.track.pop();
          let [x, y] = coordinate;
          context.lineTo(x,y);
          context.stroke();
        }
      } else if(draw_res.action === 2) {
        //处理计时逻辑
        this.setState({
          timeleft: draw_res.timeleft,
        })
      } else if(draw_res.action === 3) {
        //处理结果返回
        if(draw_res.answer_result === true) {
          message.success('猜对了！')
        } else {
          message.error('猜错了！')
        }
        this.setState({
          palyer_list: draw_res.palyer_list,
        })
      } else if(draw_res.action === 4) {
        //处理轮换逻辑
        
      } else if(draw_res.action === 5) {
        //游戏结束
        
      }
    }
  }
  render() {
    let { player_list, timeleft } = this.state; 
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