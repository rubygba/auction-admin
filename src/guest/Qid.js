import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';
import { getFormatDate } from '../common/tools';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input, Select } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;
const Option = Select.Option;

class Qid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      date: '',
      downUrl: '#',
      startDate: getFormatDate(0, -1),
      endDate: getFormatDate(0),
      nowPid: 33,
      nowEid: '',
      nowPmName: '猫扑小说',
      pagination: {
        // 封装的分页
        total: 10,
        defaultPageSize: 20,
        onChange: (page, pageSize) => {console.log(page, pageSize)}
      },
      columnsHead: [{
        title: '日期',
        dataIndex: 'dt',
        render: text => <span>汇总</span>
      }, {
        title: '推广ID',
        dataIndex: 'extensionId',
        render: text => <span>{this.state.nowEid || text}</span>
      }, {
        title: '总安装数',
        dataIndex: 'newUser',
      }, {
        title: '总注册数',
        dataIndex: 'newRegister',
      }, {
        title: '平均注册率',
        dataIndex: 'registerRate',
      }],
      columns: [{
          title: '日期',
          dataIndex: 'dt',
        }, {
          title: '推广ID',
          dataIndex: 'extensionId',
        }, {
          title: '产品名',
          dataIndex: 'productName',
          render: text => <span>猫扑小说</span>
        }, {
          title: '渠道名',
          dataIndex: 'qid',
          render: text => <span>{this.state.userInfo.qid}</span>
        }, {
          title: '安装数',
          dataIndex: 'newUser',
        }, {
          title: '注册数',
          dataIndex: 'newRegister',
        }, {
          title: '注册率',
          dataIndex: 'registerRate',
      }],
      dataArr: [],
      dataTotalArr: [],
      pnameArr: [],
      adArr: [],
    };

    if (!window.localStorage.user) {
      this.props.history.replace('/login')
    } else {
      this.state.userInfo = JSON.parse(window.localStorage.user || 'null')
      console.log(this.state.userInfo)
    }
  }

  componentDidMount() {
    this.getPreList()
  }

  getPreList = () => {
    let _token = window.localStorage.token;

    fetch(CONFIG.devURL + `/extension/getProductNameList?token=${_token}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          let d = json.data
          if (d) {
            let _pid = d[0] ? d[0].id : '' // 33 TODO:
            this.setState({
              pnameArr: d,
              nowPid: _pid,
            }, () => {
              // 根据产品
              this.getData() // 默认产品 猫扑小说安卓
              this.getAdlist()
              this.getDataTotal()
            })
          }
        } else {
          alert(json.msg)
        }
      })
  }
  getAdlist = () => {
    let _token = window.localStorage.token;

    fetch(CONFIG.devURL + `/extensionData/getExtensionDownList?productId=${this.state.nowPid}&token=${_token}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          let d = json.data
          if (d) {
            this.setState({
              adArr: d
            })
          } else {
            alert(json.msg)
            this.setState({
              adArr: []
            })
          }
        }
      })
  }
  getData = () => {
    let _token = window.localStorage.token
    let { startDate, endDate, nowEid, nowPid }= this.state
    fetch(CONFIG.devURL + `/extensionData/extensionData?pageNo=${1}&pageSize=${500}&productId=${nowPid}&extensionId=${nowEid}&token=${_token}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          let d = json.data
          if (d.entityList) {
            this.setState({
              dataArr: d.entityList,
              pagination: {
                // 封装的分页
                total: d.entityList.length,
              },
            })
          }
        } else {
          alert(json.msg)
        }
      })
  }
  getDataPaging = (pageNo, pageSize) => {
    let _token = window.localStorage.token
    let { startDate, endDate, nowEid, nowPid }= this.state
    fetch(CONFIG.devURL + `/extensionData/extensionData?pageNo=${pageNo}&pageSize=${pageSize}&productId=${nowPid}&extensionId=${nowEid}&token=${_token}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          let d = json.data
          if (d.entityList) {
            // this.setState({
            //   dataArr: d.entityList,
            //   pagination: {
            //     // 封装的分页
            //     total: d.entityList.length,
            //     defaultPageSize: 10,
            //   },
            // })
          }
        } else {
          alert(json.msg)
        }
      })
  }
  getDataTotal = () => {
    let _token = window.localStorage.token
    let _uid = this.state.userInfo.id
    let { startDate, endDate, nowPid, nowEid }= this.state
    fetch(CONFIG.devURL + `/extensionData/extensionDataTotal?pageNo=${1}&pageSize=${100}&productId=${nowPid}&extensionId=${nowEid}&qid=${nowEid}&extensionUserId=${_uid}&token=${_token}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          let d = json.data
          if (d.entityList) {
            this.setState({
              dataTotalArr: d.entityList
            })
          } else {
            this.setState({
              dataTotalArr: [],
            })
          }
        } else {
          alert(json.msg)
        }
      })
  }
  // handleChange(date) {
  //   message.info('您选择的日期是: ' + (date ? date.toString() : ''));
  //   this.setState({ date });
  // }
  handleLogout() {
    window.localStorage.user = ''
  }
  handleChange = (value) => {
    console.log(`selected ${value}`);
    if (value === 'null') {
      return
    }
    this.setState({
      downUrl: '#',
      nowPid: value
    })
    this.getAdlist();
    this.getData();
    this.getDataTotal();
  }
  handleChange2 = (value) => {
    console.log(`selected2 ${value}`);
    if (value === 'null') {
      return
    }

    let _url = '#'
    let _eid = ''
    for (let i = 0; i < this.state.adArr.length; i++) {
      if (this.state.adArr[i].id === value) {
        _url = this.state.adArr[i].url
        _eid = this.state.adArr[i].extensionId
      }
    }
    this.setState({
      downUrl: _url,
      nowEid: _eid,
    }, () => {
      this.getData();
    });
  }
  handleDatepicker(dates, dateStrings) {
    this.setState({
      startDate: dateStrings[0].replace(/-/g, ''),
      endDate: dateStrings[1].replace(/-/g, '')
    }, () => {
      this.handleSearch();
    });
  }
  handleSearch() {
    this.getDataTotal();
    this.getData();
  }
  render() {
    let adminName = '普通用户'
    if (this.state.userInfo.accountType && this.state.userInfo.accountType === 1) {
      adminName = '管理员'
    }

    const optionsPname = this.state.pnameArr.map(d => <Option key={d.id} value={d.id}>{d.productName}</Option>);
    const optionsAd = this.state.adArr.map(d => <Option key={d.id} value={d.id}>{d.extensionId}</Option>);

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <p style={{ float: 'right', lineHeight: '1.4' }}>
            <span style={{ marginRight: '12px' }}>{this.state.userInfo.userName} - {adminName}</span>
            <Link to='/qd' onClick={this.handleLogout}>注销</Link>
          </p>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a>渠道信息</a></Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
            <RangePicker
            locale={zhCN}
            style={{margin: '0 20px 12px 0'}}
            allowClear={false}
            value={[moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')]}
            format={'YYYY-MM-DD'}
            ranges={{ '今天': [moment(), moment()], '这个月': [moment(), moment().endOf('month')] }}
            onChange={this.handleDatepicker.bind(this)}
            />
            <Button type="primary" onClick={this.handleSearch.bind(this)} style={{ marginRight: 15 }}>搜索</Button>

            <Select style={{ width: 120, margin: '0 12px 12px 0' }} defaultValue={33} onChange={this.handleChange}>
              <Option value={'null'}>选择产品</Option>
              {optionsPname}
            </Select>
            <Select style={{ width: 120, margin: '0 12px 12px 0' }} defaultValue={'all'} onChange={this.handleChange2}>
              <Option value={'all'}>选择推广ID</Option>
              {optionsAd}
            </Select>
          {/*
            <Search
              placeholder="输入产品名"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          */}
            <p style={{margin: '0 12px 12px 0'}}>渠道下载地址：<a href={this.state.downUrl === '#' ? 'javascript:;' : this.state.downUrl}>{this.state.downUrl === '#' ? '暂无' : this.state.downUrl}</a></p>

            <Table rowKey="productId" columns={this.state.columnsHead} dataSource={this.state.dataTotalArr} />

            <Table rowKey="createTime" columns={this.state.columns} dataSource={this.state.dataArr} pagination={this.state.pagination} />

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

export default Qid;
