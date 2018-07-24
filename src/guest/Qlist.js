import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;

class Qlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
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
      console.log(this.state.userInfo)
    }
  }

  componentDidMount() {
    // let _token = window.localStorage.token
    // fetch(`//promotion.mop.com/user/userList?pageNo=${1}&pageSize=${20}&token=${_token}`, {
    //   method: 'GET',
    //   credentials: 'include',
    //   mode: 'cors'
    // })
    //   .then(res => res.json())
    //   .then(json => {
    //     console.log(json)
    //     if (json.code === 200) {
    //       // entityList
    //     }
    //     // this.setState({})
    //   })
  }

  handleChange(date) {
    message.info('您选择的日期是: ' + (date ? date.toString() : ''));
    this.setState({ date });
  }
  handleLogout() {
    window.localStorage.user = ''
  }
  render() {
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
            <Breadcrumb.Item><a>产品信息</a></Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
          {/*
            <RangePicker
              locale={zhCN}
              style={{margin: '0 20px 12px 0'}}
              ranges={{ '今天': [moment(), moment()], '这个月': [moment(), moment().endOf('month')] }}
            />

            <Search
              placeholder="输入产品名"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          */}
            <Table columns={this.state.columns} dataSource={this.state.dataArr} />
            {/*
            <LocaleProvider locale={zhCN}>
              <div style={{ width: 400, margin: '100px auto' }}>
                <DatePicker onChange={value => this.handleChange(value)} />
                <div style={{ marginTop: 20 }}>当前日期：{this.state.date && this.state.date.toString()}</div>
              </div>
            </LocaleProvider>
            <Button type="primary">Button</Button>
            */}
          </div>
        </Content>
      </div>
    );
  }
}

export default Qlist;
