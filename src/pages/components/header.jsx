import React, { Component } from 'react';
import { Modal, Input, Button, Radio } from 'antd';
import { observer, inject } from 'mobx-react';
import default_avatar from '../../public/default_avatar.png';
import './header.css';

const RadioGroup = Radio.Group;

@inject('RootStore') @observer
export default class Header extends Component {
  state = {
    form_type: 'login',
    phone_num: '',
    password: '',
    confirm_psw: '',
    nickname: '',
    error_label: '',
  }
  changeFormType = (e) => {
    this.setState({
      form_type: e.target.value,
    })
  }
  changeInput = (e, value_name) => {
    this.setState({
      [value_name]: e.target.value,
    })
  }
  render () {
    const { header_title } = this.props
    const {
      form_type, 
      phone_num,
      password,
      confirm_psw,
      nickname, 
    } = this.state
    const { islogin, signup, login } = this.props.RootStore.User;
    const login_form = <div>
      <Input onChange={(e) => { this.changeInput(e, 'phone_num') }} 
      value={phone_num}
      placeholder="请输入您的手机号" />
      <Input type="password" onChange={(e) => { this.changeInput(e, 'password') }} 
      value={password}
      placeholder="请输入密码" />
      <Button onClick={ () => { login(phone_num, password) }}>登录</Button>
    </div>
    const signup_form = <div>
      <Input onChange={(e) => { this.changeInput(e, 'phone_num') }} 
      value={phone_num}
      placeholder="请输入您的手机号" />
      <Input onChange={(e) => { this.changeInput(e, 'nickname') }} 
      value={nickname}
      placeholder="请输入昵称" />
      <Input type="password" onChange={(e) => { this.changeInput(e, 'password') }} 
      value={password}
      placeholder="请输入密码" />
      <Input type="password" onChange={(e) => { this.changeInput(e, 'confirm_psw') }} 
      value={confirm_psw}
      placeholder="请确认密码" />
      <Button onClick={ () => { signup(password, phone_num, nickname) }}>注册</Button>
    </div>
    return (
      <nav className="header_area">
        <div className="header_title">
          {header_title}
        </div>
        <Modal
          visible={!islogin}
          footer={null}
          closable={false}
        >
        <RadioGroup onChange={this.changeFormType} value={this.state.form_type}>
          <Radio value={'login'}>登录</Radio>
          <Radio value={'signup'}>注册</Radio>
        </RadioGroup>
          {form_type === 'login' ?  login_form : signup_form }
        </Modal>
        <img className="header_avatar" src={default_avatar} alt=""/>
      </nav>
    )
  }
}
