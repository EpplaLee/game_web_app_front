import React, { Component } from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import Frame from './components/frame';
import { observer, inject } from 'mobx-react';

import { api } from '../utils/constants.js'

const Search = Input.Search;

@inject('RootStore') @observer
export default class ChatRoom extends Component {
  constructor(props) {
    super(props)
    this.chat_ws = new WebSocket(`ws://${api}:5000/ws/chatroom`);
  }
  componentDidMount() {
    this.chat_ws.onmessage = (evt) => {
      console.log(evt)
    }
  }
  componentWillUnmount() {

  }
  render() {
    
    const child = <div>
      <div></div>
      <Search 
      placeholder="单击此处编辑聊天内容" 
      enterButton="发送" 
      size="default"
      onSearch = { (value) => {
        this.chat_ws.send(value)
      }} 
      />
    </div>
    return <Frame child={child} header_title="公共聊天" />
  }
}