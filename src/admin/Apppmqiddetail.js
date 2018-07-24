import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';

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
      columns: [{
        title: '日期',
        dataIndex: 'dt',
      // }, {
      //   title: '产品名',
      //   dataIndex: 'productName',
      //   render: text => <span>{text + ''}</span>
      }, {
        title: '渠道名',
        dataIndex: 'qid',
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
        title: '充值人数',
        dataIndex: 'dayChargeNum',
      }, {
        title: '充值金额/元',
        dataIndex: 'dayChargeMoney',
      // }, {
      //   title: '结算金额/元',
      //   dataIndex: 'settleAccounts',
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
      dataArr: [
        {
          "id": 1,
          "productId": "001",
          "productName": "猫扑小说安卓",
          "extensionStatus": 1,
          "urlPrefix": "http://www.shareinstall.com/demo.html?appkey=7FBKAE6B22FK6E&channel=Mop00001",
          "createTime": 1528182178000,
          "updateTime": null
        },
        {
          "id": 2,
          "productId": "002",
          "productName": "猫扑小说ios",
          "extensionStatus": 2,
          "urlPrefix": "http://www.shareinstall.com/demo.html?appkey=7FBKAE6B22FK6E&channel=Mop00002",
          "createTime": 1528278533000,
          "updateTime": 1528278585000
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
    let _token = window.localStorage.tokenAdmin
    let _pid = this.props.match.params.pid
    let _date = this.props.match.params.date
    let _qid = 'all'

    if (window.localStorage.pmname) {
      let _t = window.localStorage.pmname
      this.setState({
        nowPmName: _t
      })
    }

    fetch(CONFIG.devURL + `/extensionData/qidData?productId=${_pid}&startDate=${_date}&endDate=${_date}&pageNo=${1}&pageSize=${100}&qid=${_qid}&token=${_token}`, {
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

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //       let _token = window.localStorage.tokenAdmin
  //       fetch(CONFIG.devURL + `/product/add?productName=${values.productName}&extensionStatus=${values.extensionStatus}&token=${_token}`, {
  //         method: 'GET',
  //         credentials: 'include',
  //         mode: 'cors'
  //       })
  //         .then(res => res.json())
  //         .then(json => {
  //           console.log(json)
  //           if (json.code === 200) {
  //             let d = json.data
  //             console.log(json);
  //             if (d) {
  //               // 创建成功
  //               this.setState({
  //                 isModal: false,
  //               });
  //             }
  //           } else {
  //             alert(json.msg)
  //           }
  //         })
  //     }
  //   });
  // }
  // showModal = () => {
  //   this.setState({
  //     isModal: true,
  //   });
  // }
  // handleCancel = (e) => {
  //   console.log(e);
  //   this.setState({
  //     isModal: false,
  //   });
  // }
  handleChange(date) {
    message.info('您选择的日期是: ' + (date ? date.toString() : ''));
    this.setState({ date });
  }
  handleLogout() {
    window.localStorage.userAdmin = ''
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
            <Breadcrumb.Item><Link to={`/push/pmdetail/${this.props.match.params.pid}`}>{this.state.nowPmName || this.props.match.params.pid}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.match.params.date}单日数据</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
            {/*
            <Button onClick={this.showModal} type="primary" style={{ margin: '0 0 12px 0'}}>新建产品</Button>
            <Modal
              title="新建产品"
              visible={this.state.isModal}
              onOk={this.handleSubmit}
              onCancel={this.handleCancel}
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem label="产品名称">
                  {getFieldDecorator('productName', {
                    rules: [{ required: true, message: '请输入产品名！' }],
                  })(
                    <Input placeholder="产品名" />
                  )}
                </FormItem>
                <FormItem label="基本包">
                  {getFieldDecorator('upload', {
                    rules: [{ required: true, message: '请上传基本包！' }],
                  })(
                    <Upload beforeUpload={() => {return false}}>
                      <Button>
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
                  )}
                </FormItem>
                <FormItem label="推广状态">
                  {getFieldDecorator('extensionStatus', {
                    initialValue: '1'
                  })(
                    <RadioGroup>
                      <Radio value="1">开启</Radio>
                      <Radio value="2">关闭</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Form>
            </Modal>
            */}
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
