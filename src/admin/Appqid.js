import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';

import { Layout, Breadcrumb, Menu, Icon, LocaleProvider, DatePicker, message, Button, Table, Input, Modal, Radio, Form } from 'antd';
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
      userInfo: {},
      isModal: false,
      modalTitle: '新建渠道',
      modalModify: false,
      modalId: '',
      date: '',
      totalCounts: 10,
      pages: 1,
      pagination: {
        // 封装的分页
        total: 10,
        defaultPageSize: 10,
      },
      columns: [{
        title: '渠道ID',
        dataIndex: 'id',
        render: (text, record) => <a href="javascript:;" onClick={this.showModModal.bind(this, record)}>{text}</a>,
      }, {
        title: '渠道名称',
        dataIndex: 'qid',
      }, {
        title: '渠道账号',
        dataIndex: 'userName',
      }, {
        title: '渠道密码',
        dataIndex: 'password',
      }, {
        title: '联系人',
        dataIndex: 'linkMan',
      }, {
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
          "id": null,
          "userName": "",
          "password": "",
          "passwordMd5": "",
          "status": null,
          "accountType": null,
          "qid": null,
          "linkMan": null,
          "payee": null,
          "payeeAccount": null,
          "comment": null,
          "createTime": null,
          "updateTime": null
        }
      ],
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
    let _token = window.localStorage.tokenAdmin
    fetch(CONFIG.devURL + `/user/userList?pageNo=${1}&pageSize=${100}&token=${_token}`, {
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
              totalCounts: d.totalCounts,
              pages: Math.floor(d.totalCounts / 10) + 1,
              pagination: {
                // 封装的分页
                total: d.totalCounts,
                defaultPageSize: 10,
              },
            })
          }
        } else if (json.code === 403) {
          // token过期
          window.localStorage.userAdmin = ''
          this.props.history.replace('/login')
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
        let _pre = '/user/createUser?'
        if (this.state.modalModify) {
          _pre = '/user/updateUser?id=' + this.state.modalId + '&'
        }

        fetch(CONFIG.devURL + `${_pre}userName=${values.userName}&password=${values.password}&qid=${values.qid}&linkMan=${values.linkMan}&payee=${values.payee}&payeeAccount=${values.payeeAccount}&bank=${values.bank}&comment=${values.comment || ''}&token=${_token}`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            console.log(json)
            if (json.code === 200) {
              // let d = json.data
              // if (d) {
                // 创建/修改成功
                this.getData()
                this.setState({
                  isModal: false,
                });
                alert(json.msg)
              // }
            } else {
              alert(json.msg)
            }
          })
          .catch(e => {
            alert(e)
          })
      }
    });
  }
  showModModal = (record) => {
    console.log(record)
    this.props.form.setFieldsValue({
      qid: record.qid,
      userName: record.userName,
      password: record.password,
      linkMan: record.linkMan,
      payee: record.payee,
      payeeAccount: record.payeeAccount,
      bank: record.bank,
      comment: record.comment,
    })
    this.setState({
      isModal: true,
      modalTitle: '修改渠道',
      modalModify: true,
      modalId: record.id,
    });
  }
  showModal = () => {
    this.setState({
      isModal: true,
      modalTitle: '新建渠道',
      modalModify: false
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
    //   defaultPageSize: 10,
    // }

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <Downhead></Downhead>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">渠道管理</a></Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
            <Button onClick={this.showModal} type="primary" style={{ margin: '0 0 12px 0'}}>新建渠道</Button>
            <Modal
              title={this.state.modalTitle}
              visible={this.state.isModal}
              onOk={this.handleSubmit}
              onCancel={this.handleCancel}
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem label="渠道名称" {...formItemLayout}>
                  {getFieldDecorator('qid', {
                    rules: [{ required: true, message: '请输入渠道名称！' }],
                  })(
                    <Input placeholder="渠道名称" />
                  )}
                </FormItem>
                <FormItem label="渠道账号" {...formItemLayout}>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入渠道账号！' }],
                  })(
                    <Input placeholder="渠道账号" disabled={this.state.modalModify} />
                  )}
                </FormItem>
                <FormItem label="渠道密码" {...formItemLayout}>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入渠道密码！' }],
                  })(
                    <Input placeholder="渠道密码" />
                  )}
                </FormItem>
                <FormItem label="联系人" {...formItemLayout}>
                  {getFieldDecorator('linkMan', {
                    // rules: [{ required: true, message: '请输入联系人！' }],
                  })(
                    <Input placeholder="联系人" />
                  )}
                </FormItem>
                <FormItem label="收款人" {...formItemLayout}>
                  {getFieldDecorator('payee', {
                    // rules: [{ required: true, message: '请输入收款人！' }],
                  })(
                    <Input placeholder="收款人" />
                  )}
                </FormItem>
                <FormItem label="收款账号" {...formItemLayout}>
                  {getFieldDecorator('payeeAccount', {
                    // rules: [{ required: true, message: '请输入收款账号！' }],
                  })(
                    <Input placeholder="收款银行卡号" />
                  )}
                </FormItem>
                <FormItem label="开户行" {...formItemLayout}>
                  {getFieldDecorator('bank', {
                    // rules: [{ required: true, message: '请输入开户银行！' }],
                  })(
                    <Input placeholder="开户银行" />
                  )}
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                  {getFieldDecorator('comment', {})(
                    <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
                  )}
                </FormItem>
              </Form>
            </Modal>

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
