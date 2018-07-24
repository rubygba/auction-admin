import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';

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
      userInfo: {},
      isModal: false,
      isModify: false,
      modalTitle: '新建推广',
      modifyId: '',
      date: '',
      pagination: {
        // 封装的分页
        total: 10,
        defaultPageSize: 10,
      },
      columns: [{
        title: '推广ID',
        dataIndex: 'extensionId',
        render: (text, record) => <a href="javascript:;" onClick={this.showModModal.bind(this, record)}>{text}</a>,
      }, {
        title: '产品名',
        dataIndex: 'productName',
      }, {
        title: '渠道名',
        dataIndex: 'qid',
      }, {
        title: '下载地址',
        dataIndex: 'url',
        render: text => <a href={text} target="_blank"><Button type="primary">下载</Button></a>,
      }, {
        title: '计费模式',
        dataIndex: 'chargeType',
        render: text => <span>{text === 2 ? 'CPS' : 'CPA'}</span>
      }, {
        title: '产品单价/元',
        dataIndex: 'unitPrice',
        render: text => <span>{parseFloat(text / 100).toFixed(2)}</span>
      }, {
        title: '状态',
        dataIndex: 'auditStatus',
        render: (text, record) => <span>{`${text == 1 ? '审核' : '未审核'}`}</span>,
      }, {
        title: '操作',
        dataIndex: 'chargeStatus',
        render: (text, record) => <Link to={`/push/addetail/${record.productId}/${record.extensionId}/${record.extensionUserId}`}><Button>详细数据</Button></Link>,
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
      dataArr: [
        {
          "id": 1,
          "productId": 1,
          "extensionUserId": 3,
          "extensionId": "1003",
          "chargeType": 2,
          "unitPrice": 260,
          "auditStatus": 2,
          "chargeStatus": 1,
          "createTime": 1528186775000,
          "updateTime": 1528276584000
        },
        {
          "id": 2,
          "productId": 2,
          "extensionUserId": 3,
          "extensionId": "1004",
          "chargeType": 6,
          "unitPrice": 330,
          "auditStatus": 2,
          "chargeStatus": 2,
          "createTime": 1528277603000,
          "updateTime": null
        },
        {
          "id": 3,
          "productId": 2,
          "extensionUserId": 3,
          "extensionId": "1004",
          "chargeType": 6,
          "unitPrice": 330,
          "auditStatus": 2,
          "chargeStatus": 2,
          "createTime": 1528277616000,
          "updateTime": null
        }
      ],
      qidArr: [
        {
          "id": 1,
          "qid": "ccc"
        },
        {
          "id": 3,
          "qid": "cch"
        },
      ],
      pnameArr: [
        {
          "id": 1,
          "productName": "猫扑小说安卓"
        },
        {
          "id": 2,
          "productName": "猫扑小说ios"
        },
      ],
      chargeArr: [
        {
          "id": 1,
          "chargeName": "CPA计费模式"
        },
        {
          "id": 2,
          "chargeName": "CPS计费模式"
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
    this.getData();
    this.getPreList();
  }

  getData = () => {
    let _token = window.localStorage.tokenAdmin;
    fetch(CONFIG.devURL + `/extension/extensionList?pageNo=${1}&pageSize=${100}&token=${_token}`, {
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
                total: d.totalCounts,
                defaultPageSize: 10,
              },
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
  getPreList = () => {
    let _token = window.localStorage.tokenAdmin;
    fetch(CONFIG.devURL + `/extension/getQidList?token=${_token}`, {
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
              qidArr: d
            })
          }
        } else {
          alert(json.msg)
        }
      })

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
            this.setState({
              pnameArr: d
            })
          }
        } else {
          alert(json.msg)
        }
      })

    fetch(CONFIG.devURL + `/extension/getChargeType?token=${_token}`, {
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
              chargeArr: d
            })
          }
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
        let _price = Math.floor(parseFloat(values.unitPrice) * 100)

        let _token = window.localStorage.tokenAdmin
        let _pre = '/extension/createExtensionInfo?'
        if (this.state.isModify) {
          _pre = '/extension/updateExtensionInfo?id=' + this.state.modifyId + '&'
        }

        fetch(CONFIG.devURL + `${_pre}productId=${values.productId}&extensionUserId=${values.extensionUserId}&chargeType=${values.chargeType}&unitPrice=${_price}&auditStatus=${values.auditStatus}&chargeStatus=${values.chargeStatus}&token=${_token}`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            console.log(json)
            if (json.code === 200) {
              let d = json.data
              // if (d) {
                // 创建/修改成功
                this.getData()
                this.setState({
                  isModal: false,
                });
              // } else {
                alert('操作' + json.msg)
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
      productId: record.productId,
      extensionUserId: record.extensionUserId,
      chargeType: record.chargeType,
      unitPrice: parseFloat(record.unitPrice / 100).toFixed(2),
      auditStatus: record.auditStatus,
      chargeStatus: record.chargeStatus,
    })
    this.setState({
      isModal: true,
      modalTitle: '更新推广信息',
      isModify: true,
      modifyId: record.id,
    });
  }
  showModal = () => {
    this.setState({
      isModal: true,
      modalTitle: '新建推广',
      isModify: false,
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
    //   defaultPageSize: 1,
    // }

    const optionsQid = this.state.qidArr.map(d => <Option value={d.id}>{d.qid}</Option>);
    const optionsPname = this.state.pnameArr.map(d => <Option value={d.id}>{d.productName}</Option>);
    const optionsCharge = this.state.chargeArr.map(d => <Option value={d.id}>{d.chargeName}</Option>);

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <Downhead></Downhead>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>推广管理</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>
            <Button onClick={this.showModal} type="primary" style={{ margin: '0 0 12px 0'}}>新建推广</Button>
            <Modal
              title={this.state.modalTitle}
              visible={this.state.isModal}
              onOk={this.handleSubmit}
              onCancel={this.handleCancel}
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem label="产品名称" {...formItemLayout}>
                  {getFieldDecorator('productId', {
                    rules: [{ required: true, message: '请选择产品名称!' }],
                  })(
                    <Select>
                      {optionsPname}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="渠道名称" {...formItemLayout}>
                  {getFieldDecorator('extensionUserId', {
                    rules: [{ required: true, message: '请选择渠道名称！' }],
                  })(
                    <Select>
                      {optionsQid}
                    </Select>
                  )}
                </FormItem>
                {/*
                <FormItem label="推广ID" {...formItemLayout}>
                  {getFieldDecorator('qid', {})(
                    <span className="ant-form-text" style={{color: '#bbb'}}>mop00001</span>
                  )}
                </FormItem>*/}
                <FormItem label="计费模式" {...formItemLayout}>
                  {getFieldDecorator('chargeType', {
                    rules: [{ required: true, message: '请选择计费模式！' }],
                  })(
                    <Select>
                      {optionsCharge}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="产品单价（元）" {...formItemLayout}>
                  {getFieldDecorator('unitPrice', {
                    rules: [{
                      required: true,
                      pattern: /^(-)?\d+(\.\d+)?$/,
                      message: '请输入正确的产品单价！'
                    }],
                  })(
                    <Input placeholder="产品单价（元）" />
                  )}
                </FormItem>
                <FormItem label="审核状态" {...formItemLayout}>
                  {getFieldDecorator('auditStatus', {
                    initialValue: '1'
                  })(
                    <RadioGroup>
                      <Radio value={'1'}>审核</Radio>
                      <Radio value={'0'}>未审核</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="计费状态" {...formItemLayout}>
                  {getFieldDecorator('chargeStatus', {
                    initialValue: '1'
                  })(
                    <RadioGroup>
                      <Radio value={'1'}>正常</Radio>
                      <Radio value={'0'}>暂停</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Form>
            </Modal>

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
