import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';
import { getFormatDate } from '../common/tools';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input, Modal, Radio, Form, Select  } from 'antd';
import Downhead from './Downhead'

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class Apppm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: getFormatDate(0, -1),
      endDate: getFormatDate(0),
      userInfo: {},
      isModal: false,
      date: '',
      activeBtn: 'month',
      pagination: {
        // 封装的分页
        total: 10,
        defaultPageSize: 10,
      },
      columnsHead: [{
          title: '日期',
          dataIndex: 'dt',
        }, {
          title: '推广id',
          dataIndex: 'extensionId',
          // render: text => <span>*</span>
          render: text => <span>{this.props.match.params.eid || text}</span>
        },
        // {
        //   title: '产品名',
        //   dataIndex: 'productName',
        // }, {
        //   title: '渠道名',
        //   dataIndex: 'qid',
        // },
        {
          title: '总安装用户',
          dataIndex: 'newUser',
        }, {
          title: '总注册用户',
          dataIndex: 'newRegister',
        }, {
          title: '平均注册率',
          dataIndex: 'registerRate',
        }, {
          title: '总充值次数',
          dataIndex: 'dayChargeNum',
        }, {
          title: '总充值金额/元',
          dataIndex: 'dayChargeMoney',
      }],
      columns: [{
          title: '日期',
          dataIndex: 'dt',
        }, {
          title: '推广id',
          dataIndex: 'extensionId',
        },
        // {
        //   title: '产品名',
        //   dataIndex: 'productName',
        // }, {
        //   title: '渠道名',
        //   dataIndex: 'qid',
        // },
        {
          title: '新增安装用户',
          dataIndex: 'newUser',
        }, {
          title: '新增注册用户',
          dataIndex: 'newRegister',
        }, {
          title: '注册率',
          dataIndex: 'registerRate',
        }, {
          title: '充值人数',
          dataIndex: 'dayChargeNum',
        }, {
          title: '充值金额/元',
          dataIndex: 'dayChargeMoney',
        // }, {
        //   title: '当日结算金额/元',
        //   dataIndex: 'settleAccounts',
      }],
      dataSumArr: [],
      dataArr: [
        {
          "id": 0,
          "dt": 0,
          "extensionId": 0,
          "newUser": 0,
          "newRegister": 0,
          "dayChargeNum": null,
          "dayChargeMoney": null,
          "productId": null,
          "productName": null,
          "qid": null,
          "registerRate": null
        }
      ],
    };

    if (!window.localStorage.userAdmin) {
      this.props.history.replace('/login')
    } else {
      this.state.userInfo = JSON.parse(window.localStorage.userAdmin || 'null')
    }
  }

  componentDidMount() {
    this.handleSearch()
  }

  getList = () => {
    let _token = window.localStorage.tokenAdmin
    let _pid = this.props.match.params.pid
    let _eid = this.props.match.params.eid
    let { startDate, endDate }= this.state
    let _url = CONFIG.devURL + `/extensionData/extensionData?productId=${_pid}&extensionId=${_eid}&pageNo=${1}&pageSize=${100}&token=${_token}&startDate=${startDate}&endDate=${endDate}`
    fetch(_url, {
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
                defaultPageSize: 10,
              },
            })
          } else {
            this.setState({
              dataArr: []
            })
          }
        } else if (json.code === 403) {
          // token过期
          window.localStorage.userAdmin = ''
        } else {
          alert(json.msg)
        }
      })
  }
  getSumList = () => {
    let _token = window.localStorage.tokenAdmin
    let _pid = this.props.match.params.pid
    let _eid = this.props.match.params.eid
    let _uid = this.props.match.params.uid || ''
    let { startDate, endDate } = this.state
    let _url = CONFIG.devURL + `/extensionData/extensionDataTotal?productId=${_pid}&extensionId=${_eid}&qid=${_eid}&extensionUserId=${_uid}&pageNo=${1}&pageSize=${100}&token=${_token}&startDate=${startDate}&endDate=${endDate}`
    fetch(_url, {
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
              dataSumArr: d.entityList
            })
          } else {
            this.setState({
              dataSumArr: []
            })
          }
        } else if (json.code === 403) {
          // token过期
          window.localStorage.userAdmin = ''
        } else {
          alert(json.msg)
        }
      })
  }
  updateGetList = () => {
    let d = this.state.date
    console.log(d[0])
    // console.log(d[1], d.format('YYYYMMDD'))
    this.getList('', '')
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  showModal = () => {
    this.setState({
      isModal: true,
    });
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
  handleDatepicker(dates, dateStrings) {
    // message.info('您选择的日期是: ' + dateStrings);

    this.setState({
      startDate: dateStrings[0].replace(/-/g, ''),
      endDate: dateStrings[1].replace(/-/g, '')
    }, () => {
      this.handleSearch();
    });
  }
  handleSearch() {
    this.getSumList();
    this.getList();
  }
  handleSumRange(e) {
    let month = e.target.value
    this.setState({
      activeBtn: month,
      startDate: (month === 'prevMonth') ? getFormatDate(0, -2) : getFormatDate(0, -1),
      endDate: (month === 'prevMonth') ? getFormatDate(0, -1) : getFormatDate(0)
    }, ()=> {
      this.handleSearch();
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let adminName = '普通用户'
    if (this.state.userInfo.accountType && this.state.userInfo.accountType === 1) {
      adminName = '管理员'
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 36 },
        sm: { span: 18 },
      },
    };

    // const pagination = {
    //   // 封装的分页
    //   total: 100,
    //   defaultPageSize: 1,
    // }

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <Downhead></Downhead>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/push/ad">推广管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.match.params.eid}详细数据</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
          {/*
            <RangePicker
              locale={zhCN}
              style={{margin: '0 10px 12px 0'}}
              ranges={{ '今天': [moment(), moment()], '这个月': [moment(), moment().endOf('month')] }}
              onChange={value => this.handleChange(value)}
            />
            <Button onClick={this.updateGetList}>搜索</Button>
            <Button type="primary" style={{margin: '0 0 0 12px'}}>本月汇总</Button>
            <Button style={{margin: '0 0 0 12px'}}>上月汇总</Button>
            */}

            <div style={{ marginBottom: 15 }}>
              <RangePicker
                allowClear={false}
                value={[moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')]}
                format={'YYYY-MM-DD'}
                onChange={this.handleDatepicker.bind(this)}
              />
              <Button type="primary" onClick={this.handleSearch.bind(this)} style={{ marginLeft: 15 }}>搜索</Button>

              <Radio.Group value={this.state.activeBtn} onChange={this.handleSumRange.bind(this)} style={{ marginLeft: 15 }}>
                <Radio.Button value="month">本月汇总</Radio.Button>
                <Radio.Button value="prevMonth">上月汇总</Radio.Button>
              </Radio.Group>
            </div>

            <Table rowKey="id" columns={this.state.columnsHead} dataSource={this.state.dataSumArr} pagination={false} style={{ marginBottom: 15 }}/>

            <Table rowKey="id" columns={this.state.columns} dataSource={this.state.dataArr} pagination={this.state.pagination} />
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

const ApppmW = Form.create()(Apppm);
export default ApppmW;
