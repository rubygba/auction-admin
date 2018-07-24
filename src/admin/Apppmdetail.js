import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';
import { getFormatDate } from '../common/tools';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input, Modal, Radio, Form, Upload } from 'antd';
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

class Apppm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: getFormatDate(0, -1),
      endDate: getFormatDate(0),
      userInfo: {},
      nowPmName: '',
      isModal: false,
      date: '',
      uploading: false,
      pagination: {
        // 封装的分页
        total: 10,
        defaultPageSize: 10,
      },
      columnsHead: [{
        title: '日期',
        dataIndex: 'dt',
        render: text => <span>汇总</span>
      }, {
        title: '产品名',
        dataIndex: 'productName',
      }, {
        title: '总安装数',
        dataIndex: 'newUser',
      }, {
        title: '总注册数',
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
      }, {
      //   title: '总结算金额/元',
      //   dataIndex: 'settleAccounts',
      }],
      columns: [{
        title: '日期',
        dataIndex: 'dt',
      }, {
        title: '产品名',
        dataIndex: 'productName',
        render: text => <span>{text + ''}</span>
      }, {
        title: '安装数',
        dataIndex: 'newUser',
      }, {
        title: '注册数',
        dataIndex: 'newRegister',
      }, {
        title: '注册率',
        dataIndex: 'registerRate',
      }, {
        title: '充值次数',
        dataIndex: 'dayChargeNum',
      }, {
        title: '充值金额/元',
        dataIndex: 'dayChargeMoney',
      },
      // {
      //   title: '当日结算金额/元',
      //   dataIndex: 'settleAccounts',
      //},
      {
        title: '操作',
        dataIndex: 'createTime',
        render: (text, record) => <div><Link to={`/push/pmdetail/${record.productId}/${record.dt}`}><Button>渠道数据</Button></Link></div>,
      // }, {
      //   title: '注册率',
      //   dataIndex: 'regrate',
      //   key: 'regrate',
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
      dataSumArr: [
        // {
        //   "id": 0,
        //   "dt": null,
        //   "extensionId": null,
        //   "newUser": 0,
        //   "newRegister": 0,
        //   "dayChargeNum": 0,
        //   "dayChargeMoney": 0,
        //   "productId": null,
        //   "productName": "",
        //   "qid": null,
        //   "registerRate": ""
        // }
      ],
      dataArr: [
        // {
        //   "id": 0,
        //   "dt": null,
        //   "extensionId": null,
        //   "newUser": null,
        //   "newRegister": null,
        //   "dayChargeNum": null,
        //   "dayChargeMoney": null,
        //   "productId": null,
        //   "productName": "",
        //   "qid": null,
        //   "registerRate": ""
        // }
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
    if (window.localStorage.pmname) {
      let _t = window.localStorage.pmname
      this.setState({
        nowPmName: _t
      })
    }
  }


  getSumDetail = () => {
    let _token = window.localStorage.tokenAdmin
    let _pid = this.props.match.params.pid
    let { startDate, endDate }= this.state
    let _url = CONFIG.devURL + `/extensionData/productTotal?pageNo=${1}&pageSize=${100}&productId=${_pid}&token=${_token}&startDate=${startDate}&endDate=${endDate}`;
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
              dataSumArr: d.entityList,
              // nowPmName: d.entityList[0] ? d.entityList[0].productName : ''
            })
          }
        } else if (json.code === 403) {
          // token过期
          window.localStorage.userAdmin = ''
          this.props.history.push('/');
        } else {
          alert(json.msg)
        }
      })
  }
  getPmDetail = () => {
    let _token = window.localStorage.tokenAdmin
    let _pid = this.props.match.params.pid
    let { startDate, endDate }= this.state
    let _url = CONFIG.devURL + `/extensionData/productData?pageNo=${1}&pageSize=${100}&productId=${_pid}&token=${_token}&startDate=${startDate}&endDate=${endDate}`;
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
          }
        } else if (json.code === 403) {
          // token过期
          window.localStorage.userAdmin = ''
          this.props.history.push('/');
        } else {
          alert(json.msg)
        }
      })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let _token = window.localStorage.tokenAdmin
        fetch(CONFIG.devURL + `/product/add?productName=${values.productName}&extensionStatus=${values.extensionStatus}&token=${_token}`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            console.log(json)
            if (json.code === 200) {
              let d = json.data
              console.log(json);
              if (d) {
                // 创建成功
                this.setState({
                  isModal: false,
                });
              }
            } else {
              alert(json.msg)
            }
          })

        // var fd = new FormData()
        // fd.append('uploadFile', values.upload.fileList[0])
        // fd.append('person_id', id)

        // fd.append('name', name)
        // fd.append('face', JSON.stringify(this.facesList[num].slice(0, 15)))
        // // 保存用户头像
        // fetch('/api/upload', {
        //   method: 'POST',
        //   body: fd,
        //   mode: 'cors',
        //   credentials: 'include'
        // })

        // const { fileList } = this.state;
        // const formData = new FormData();
        // fileList.forEach((file) => {
        //   formData.append('files[]', file);
        // });
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
    this.setState({
      startDate: dateStrings[0].replace(/-/g, ''),
      endDate: dateStrings[1].replace(/-/g, '')
    }, ()=> {
      this.handleSearch();
    });
  }
  handleSearch() {
    this.getSumDetail();
    this.getPmDetail();
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
          <Downhead></Downhead>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/push/pm">产品管理</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.nowPmName || this.props.match.params.pid}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
            <div style={{ marginBottom: 15 }}>
              <RangePicker
                defaultValue = {[moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')]}
                format = {'YYYY-MM-DD'}
                onChange={this.handleDatepicker.bind(this)}
              />
              <Button type="primary" style={{ marginLeft: 15 }} onClick={this.handleSearch.bind(this)}>搜索</Button>
            </div>

            <Table rowKey="productId" columns={this.state.columnsHead} dataSource={this.state.dataSumArr} pagination={false} style={{ marginBottom: 15 }}/>

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

const ApppmW = Form.create()(Apppm);
export default ApppmW;
