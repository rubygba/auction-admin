import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';
import { getFormatDate, getFormatDate2, getFormatDate3 } from '../common/tools';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input, InputNumber, Modal, Radio, Form, Upload } from 'antd';
import Downhead from './Downhead'

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Apppm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      begindate: getFormatDate2(0, -1),
      enddate: getFormatDate2(0),

      goodDetail: {
        auctionTime: 0,
        beginDate: 'xxx',
        endDate: 'xxx',
        floorPrice: 0,
        goodsDesc: 'xxx',
        goodsTitle: 'xxx',
        imgs: [],
        nowPrice: 0,
        status: 0,
      },

      startDate: getFormatDate(0, -1),
      endDate: getFormatDate(0),
      userInfo: {},
      isModal: false,
      isModify: false,
      modifyId: '',
      date: '',
      uploading: false,
      okText: 'OK',
      pagination: {
        // 封装的分页
        total: 10,
        defaultPageSize: 10,
      },
      dataArr: [],
    };

    // if (!window.localStorage.userAdmin) {
    //   this.props.history.replace('/login')
    // } else {
    //   this.state.userInfo = JSON.parse(window.localStorage.userAdmin || 'null')
    // }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    fetch(CONFIG.devURL + `/goods/goodsDetail?goodsSn=${this.props.match.params.pid}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => {
        if (res.json) {
          return res.json()
        } else {
          return {}
        }
      })
      .then(json => {
        console.log(json)
        let d = json.data
        this.setState({
          goodDetail: d
        })
      })
      .catch(e => {
        console.error(e)
      })
  }
  setPmName = (record) => {
    window.localStorage.pmname = record.productName
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      isModal: false,
    });
  }
  handleChange(date) {
    message.info('您选择的日期是: ' + (date ? date.toString() : ''));
    this.setState({ date });
  }
  handleLogout() {
    window.localStorage.userAdmin = ''
  }
  handleDatepicker2(dates, dateStrings) {
    console.log(dateStrings)
    this.setState({
      startDate: dateStrings[0].replace(/-/g, ''),
      endDate: dateStrings[1].replace(/-/g, ''),
      begindate: new Date(dateStrings[0]).getTime(),
      enddate: new Date(dateStrings[1]).getTime(),
    }, ()=> {
      // this.handleSearch();
    });
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    let adminName = '普通用户'
    if (this.state.userInfo.accountType && this.state.userInfo.accountType === 1) {
      adminName = '管理员'
    }

    let _status = this.state.goodDetail.status
    switch(_status) {
      case 0:
        _status = '已下架'
        break;
      case 1:
        _status = '拍卖进行中'
        break;
      case 2:
        _status = '拍卖已结束'
        break;
      case 3:
        _status = '拍卖未开始'
        break;
      default:
    }

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <Downhead></Downhead>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/push/pm">商品搜索</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.match.params.pid}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
            <p>商品编号：<span>{this.props.match.params.pid}</span></p>
            <p>拍卖状态：<span>{_status}</span></p>
            <p>当前参与拍卖人数：<span>{this.state.goodDetail.auctionTime}人</span></p>
            <p>当前价格：<span>{this.state.goodDetail.nowPrice}元</span></p>
            <p>商品名：<span>{this.state.goodDetail.goodsTitle}</span></p>
            <p>起拍价：<span>{this.state.goodDetail.floorPrice}元</span></p>
            <p>开始时间：<span>{getFormatDate3(this.state.goodDetail.beginDate)}</span></p>
            <p>结束时间：<span>{getFormatDate3(this.state.goodDetail.endDate)}</span></p>
            <p>商品描述</p>
            <TextArea value={this.state.goodDetail.goodsDesc} rows={4}></TextArea>
          </div>
        </Content>
      </div>
    );
  }
}

const ApppmW = Form.create()(Apppm);
export default ApppmW;
