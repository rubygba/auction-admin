import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom'
import '../styles/App.css';
import Apppm from './Apppm';
import Appli from './Appli';
import Appad from './Appad';
import Appaddetail from './Appaddetail';
import AppPmDetail from './Apppmdetail';
import AppPmQidDetail from './Apppmqiddetail';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;

class Admin extends Component {
  constructor(props) {
    super(props);
    document.title = '嵩恒内部拍卖';
    this.state = {
      userInfo: {},
      date: '',
    };

    // if (!window.localStorage.userAdmin) {
    //   this.props.history.replace('/push')
    // } else {
    //   this.state.userInfo = JSON.parse(window.localStorage.userAdmin || 'null')
      this.props.history.replace('/push/pm')
    // }
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
            <div className="logo">嵩恒内部拍卖</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/push/pm">
                  <Icon type="cloud" />
                  <span className="nav-text">商品列表</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/push/li">
                  <Icon type="man" />
                  <span className="nav-text">订单列表</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Switch>
              <Route exact path="/push/pm" component={Apppm}/>
              <Route exact path="/push/li" component={Appli}/>
              <Route exact path="/push/ad" component={Appad}/>
              <Route path="/push/addetail/:pid/:eid/:uid" component={Appaddetail}/>
              <Route exact path="/push/pmdetail/:pid" component={AppPmDetail}/>
              <Route exact path="/push/pmqiddetail/:pid" component={AppPmQidDetail}/>
            </Switch>
            <Footer style={{ textAlign: 'center', color: '#ddd' }}>
              @GBA ©2018 Ant Design ©2016
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

export default Admin;
