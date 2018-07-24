import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom'
import '../styles/App.css';
import Qid from './Qid';
import Qlist from './Qlist';
import Qbill from './Qbill';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;

class Guest extends Component {
  constructor(props) {
    super(props);
    document.title = 'Mop渠道数据后台';
    this.state = {
      userInfo: {},
      date: '',
      columns: [{
        title: '日期',
        dataIndex: 'time',
        key: 'time',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '产品名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '安装数',
        dataIndex: 'install',
        key: 'install',
      }, {
        title: '注册数',
        dataIndex: 'reg',
        key: 'reg',
      }, {
        title: '注册率',
        dataIndex: 'regrate',
        key: 'regrate',
      // }, {
      //   title: 'Action',
      //   key: 'action',
      //   render: (text, record) => (
      //     <span>
      //       <a href="javascript:;">Action 一 {record.name}</a>
      //       <a href="javascript:;" className="ant-dropdown-link">
      //         More actions <Icon type="down" />
      //       </a>
      //     </span>
      //   ),
      }],
      dataArr: [{
        key: '1',
        time: '2018-06-06',
        name: 'X123',
        install: '100',
        reg: '29',
        regrate: '29%',
      }, {
        key: '2',
        time: '2018-06-06',
        name: 'X123',
        install: '100',
        reg: '29',
        regrate: '29%',
      }, {
        key: '3',
        time: '2018-06-06',
        name: 'X123',
        install: '100',
        reg: '29',
        regrate: '29%',
      }, {
        key: '4',
        time: '2018-06-06',
        name: 'X123',
        install: '100',
        reg: '29',
        regrate: '29%',
      }, {
        key: '5',
        time: '2018-06-06',
        name: 'X123',
        install: '100',
        reg: '29',
        regrate: '29%',
      }],
    };

    if (!window.localStorage.user) {
      this.props.history.replace('/qd')
    } else {
      this.state.userInfo = JSON.parse(window.localStorage.user || 'null')
      this.props.history.replace('/qd/data')
    }
  }

  componentDidMount() {
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
    if (this.state.userInfo.accountType && this.state.userInfo.accountType === 2) {
      adminName = '管理员'
    }
    return (
      <div className="App">
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          >
            <div className="logo">Mop渠道数据后台</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/qd/data">
                  <Icon type="upload" />
                  <span className="nav-text">渠道信息</span>
                </Link>
              </Menu.Item>
              {/*
              <Menu.Item key="2">
                <Link to="/qd/pm">
                  <Icon type="video-camera" />
                  <span className="nav-text">产品信息</span>
                </Link>
              </Menu.Item>*/}
              <Menu.Item key="2">
                <Link to="/qd/bill">
                  <Icon type="user" />
                  <span className="nav-text">财务信息</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Switch>
              <Route exact path="/qd/data" component={Qid}/>
              <Route exact path="/qd/bill" component={Qbill}/>
            </Switch>
            <Footer style={{ textAlign: 'center', color: '#ddd' }}>
              Mop@GBA ©2018 Ant Design ©2016
            </Footer>
          </Layout>
        </Layout>
        {/*
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>*/}
      </div>
    );
  }
}

export default Guest;
