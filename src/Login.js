import React, { Component } from 'react';
import './styles/App.css';
import CONFIG from './common/config';

import { Form, Icon, Input, Button, Checkbox, Radio } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Login extends Component {
  constructor(props) {
    super(props);
    document.title = '钉钉登录拍卖';
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        fetch(CONFIG.devURL + `/common/login?userName=${values.userName}&password=${values.password}&accountType=2`, {
          method: 'GET',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            if (json.code === 200) {
              let _user = json.data;
              window.localStorage.user = JSON.stringify(_user);
              window.localStorage.token = json.data.token;
              if (_user.accountType === 1) {
                // 管理员
                this.props.history.push('/push/pm');
              } else {
                this.props.history.push('/qd/data');
              }
            } else {
              alert(json.msg)
            }
          })

        // window.history.pushState({}, '渠道页', '/');

        // if (values.password === 'guest') {
        //   window.localStorage.user = values.userName
        //   this.props.history.push('/');
        // } else {
        //   alert('密码错误')
        // }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ margin: '0 auto', width: '360px', paddingTop: '200px' }}>
        <Form onSubmit={this.handleSubmit} className="login-form">
        {/*
          <FormItem>
            {getFieldDecorator('accountType', {
              initialValue: '1',
              rules: [{ required: true, message: '请输入账号ID！' }],
            })(
              <RadioGroup>
                <RadioButton value="2">渠道账号</RadioButton>
                <RadioButton value="1">管理</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('userName', {
              initialValue: '',
              rules: [{ required: true, message: '请输入账号ID！' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [{ required: true, message: '请输入密码！' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          */}
          <FormItem>
            {/*getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )*/}
            {/*<a className="login-form-forgot" href="">Forgot password</a>*/}
            <a href="http://gxoa.021.com/">
            <Button type="primary" className="login-form-button">
              钉钉登录
            </Button></a>
            {/*Or <a href="">register now!</a>*/}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedLogin = Form.create()(Login);

export default WrappedLogin;
