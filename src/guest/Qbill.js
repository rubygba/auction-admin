import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input, Form } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;
const FormItem = Form.Item;

class QBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      payInfo: {
        "payee": "xxx",
        "payeeAccount": "yyy"
      },
      date: '',
      columns: [{
        title: '产品ID',
        dataIndex: 'id',
        key: 'id',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '产品名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '推广状态',
        dataIndex: 'status',
        key: 'status',
      }, {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
      }],
      dataArr: [{
        key: '1',
        id: '001',
        name: '小说xxx',
        status: '推广中',
        opt: '暂停',
      }, {
        key: '2',
        id: '001',
        name: '小说xxx',
        status: '推广中',
        opt: '暂停',
      }, {
        key: '3',
        id: '001',
        name: '小说xxx',
        status: '推广中',
        opt: '暂停',
      }, {
        key: '4',
        id: '001',
        name: '小说xxx',
        status: '推广中',
        opt: '暂停',
      }, {
        key: '5',
        id: '001',
        name: '小说xxx',
        status: '推广中',
        opt: '暂停',
      }],
    };

    if (!window.localStorage.user) {
      this.props.history.replace('/login')
    } else {
      this.state.userInfo = JSON.parse(window.localStorage.user || 'null')
    }
  }

  componentDidMount() {
    let _token = window.localStorage.token
    fetch(CONFIG.devURL + `/user/getFinancialInfo?token=${_token}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          this.setState({payInfo: json.data})

          this.props.form.setFieldsValue({
            payee: this.state.payInfo.payee,
            payeeAccount: this.state.payInfo.payeeAccount,
            bank: this.state.payInfo.bank,
          })
        }
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log('user id ', this.state.userInfo.id);

        let _token = window.localStorage.token
        fetch(CONFIG.devURL + `/user/update/BankByPrimaryKey?id=${ this.state.userInfo.id}&payee=${values.payee}&payeeAccount=${values.payeeAccount}&bank=${values.bank}&token=${_token}`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            if (json.code === 200) {
              // this.props.form.setFieldsValue({
              //   payee: values.payee,
              //   payeeAccount: values.payeeAccount,
              //   bank: values.bank,
              // })
            } else {
            }
            alert(json.msg)
          })

      // window.history.pushState({}, '渠道页', '/');

      // if (values.password === 'guest') {
      //   window.localStorage.user = values.userName
      //   this.props.history.push('/');
      // } else {
      //   alert('密码错误')
      }
    });
  }
  handleChange(date) {
    message.info('您选择的日期是: ' + (date ? date.toString() : ''));
    this.setState({ date });
  }
  handleLogout() {
    window.localStorage.user = ''
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    let adminName = '普通用户'
    if (this.state.userInfo.accountType && this.state.userInfo.accountType === 1) {
      adminName = '管理员'
    }

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <p style={{ float: 'right', lineHeight: '1.4' }}>
            <span style={{ marginRight: '12px' }}>{this.state.userInfo.userName} - {adminName}</span>
            <Link to='/qd' onClick={this.handleLogout}>注销</Link>
          </p>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a>财务信息</a></Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
          {/*
            <p>收款人：<span>{this.state.payInfo.payee || '无'}</span></p>
            <p>收款账号：<span>{this.state.payInfo.payeeAccount || '无'}</span></p>
            <p>开户行：<span>{this.state.payInfo.bank || '无'}</span></p>
          */}

            <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: 400}}>
              <FormItem label="收款人：">
                {getFieldDecorator('payee', {
                  // rules: [{ required: true, message: '请输入收款人！' }],
                })(
                  <Input placeholder="收款人" />
                )}
              </FormItem>
              <FormItem label="收款账号：">
                {getFieldDecorator('payeeAccount', {
                  // rules: [{ required: !this.state.isModify, message: '请输入收款账号！' }],
                })(
                  <Input placeholder="收款账号" />
                )}
              </FormItem>
              <FormItem label="开户行：">
                {getFieldDecorator('bank', {
                  // rules: [{ required: !this.state.isModify, message: '请输入开户行！' }],
                })(
                  <Input placeholder="开户行：" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  修改
                </Button>
              </FormItem>
            </Form>
          </div>
        </Content>
      </div>
    );
  }
}

const QBillW = Form.create()(QBill);
export default QBillW;
