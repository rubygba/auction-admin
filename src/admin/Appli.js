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
const confirm = Modal.confirm;

class Apppm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      goodsSn: '',
      orderNo: '',
      userName: '',
      orderStatus: '',

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
      columns: [{
        title: '商品名',
        dataIndex: 'goods',
        render: (text, record) => <span>{record.goods.goodsTitle}</span>
      }, {
        title: '参与者',
        dataIndex: 'userName',
      }, {
        title: '出价',
        dataIndex: 'goodsMoney',
      }, {
        title: '订单编号',
        dataIndex: 'orderNo',
      }, {
        title: '状态',
        dataIndex: 'orderStatus',
        render: (text) => {
          let _txt = text
          switch(_txt) {
            case 0:
              _txt = '竞拍失败'
              break;
            case 1:
              _txt = '竞拍成功'
              break;
            case 2:
              _txt = '交易成功'
              break;
            case 3:
              _txt = '拍卖进行中'
              break;
          }
          return (<span>{_txt}</span>)
        }
      }, {
        title: '订单时间',
        dataIndex: 'createTime',
        render: (text) => <span>{getFormatDate3(text)}</span>
      }, {
        title: '商品编号',
        dataIndex: 'goodsSn',
      }, {
        title: '操作',
        dataIndex: 'createTime',
        render: (text, record) => {
          if (record.orderStatus == 1) {
            return (<Button onClick={this.showConfirm.bind(this, record)} type="primary" style={{margin: '0 8px 0 0'}}>发货</Button>)
          } else {
            return (<Button disabled style={{margin: '0 8px 0 0'}}>发货</Button>)
          }
        }
      }],
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
    let _token = window.localStorage.tokenAdmin
    // fetch(CONFIG.devURL + `/songhengstore/goods/getgoods?goodstitle=${'商品标题'}&goodssn=${'商品编号'}&begindate=${'竞拍开始时间'}&enddate=${'竞拍结束时间'}&before=${'未开始'}&underway=${'竞拍中'}&after=${'已结束'}&soldout=${'已下架'}`, {
    fetch(CONFIG.devURL + `/order/queryOrders?userName=${this.state.userName}&orderNo=${this.state.orderNo}&goodsSn=${this.state.goodsSn}&orderStatus=${this.state.orderStatus}`, {
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
          dataArr: d,
          pagination: {
            // 封装的分页
            total: d.length,
            defaultPageSize: 20,
          },
        })
      })
      .catch(e => {
        console.error(e)
      })
  }
  handleSearch = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      this.setState({
        goodsSn: values.goodsSn || '',
        orderNo: values.orderNo || '',
        userName: values.userName || '',
        orderStatus: values.orderStatus || '',
      }, () => {
        this.getData()
      })
    });
  }
  setPmName = (record) => {
    window.localStorage.pmname = record.productName
  }
  updateRecord = (record) => {
    let _token = window.localStorage.tokenAdmin
    let _eStatus = record.extensionStatus
    if (_eStatus === 1) {
      _eStatus = 0
    } else if (_eStatus === 0) {
      _eStatus = 1
    }
    fetch(CONFIG.devURL + `/product/update?productId=${record.productId || ''}&id=${record.id}&productName=${record.productName}&extensionStatus=${_eStatus}&token=${_token}`, {
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
            // 修改成功
            this.getData()
          }
        } else {
          alert(json.msg)
        }
      })
      .catch(e => {
        alert(e)
      })
  }
  sendPm = (record) => {
    fetch(CONFIG.devURL + `/order/deliverGoods?orderNo=${record.orderNo}&goodsSn=${record.goodsSn}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.getData()
        alert(json.message)
      })
      .catch(e => {
        alert(e)
      })
  }
  showConfirm = (record) => {
    let scope = this
    confirm({
      title: '确认发货',
      onOk() {
        scope.sendPm(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  showModModal = (record) => {
    console.log(record)
    this.props.form.setFieldsValue({
      id: record.id,
      productName: record.productName,
      extensionStatus: record.extensionStatus,
    })
    this.setState({
      isModal: true,
      modalTitle: '更新产品信息',
      isModify: true,
      modifyId: record.id,
    });
  }
  showModal = () => {
    this.setState({
      isModal: true,
      modalTitle: '新建产品',
      isModify: false,
    });
  }
  handleUpload = (ev) => {
    console.log('rewrite upload:', ev);

    // ev.onProgress({ percent: number })

    var fd = new FormData()
    fd.append('file', ev.file)

    fetch(ev.action, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: fd
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        ev.onSuccess()
      })
      .catch(e => {
        console.error(e)
        ev.onError()
      })
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
  handleDatepicker(dates, dateStrings) {
    console.log(dateStrings)
    this.setState({
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

    return (
      <div>
        <Header style={{ background: '#fff', padding: '20px', textAlign: 'left' }}>
          <Downhead></Downhead>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">商品搜索</a></Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '24px 16px 0', textAlign: 'left' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 600 }}>

            <Form onSubmit={this.handleSearch} layout="inline">
              <FormItem label="商品编号">
                {getFieldDecorator('goodsSn', {
                })(
                  <Input
                    placeholder="null"
                    style={{ width: 200, margin: '0 8px 8px 0' }}>
                  </Input>
                )}
              </FormItem>
              <FormItem label="订单编号">
                {getFieldDecorator('orderNo', {
                })(
                  <Input
                    placeholder="null"
                    style={{ width: 200, margin: '0 8px 8px 0' }}>
                  </Input>
                )}
              </FormItem>
              <FormItem label="参与者">
                {getFieldDecorator('userName', {
                })(
                  <Input
                    placeholder="null"
                    style={{ width: 200, margin: '0 8px 8px 0' }}>
                  </Input>
                )}
              </FormItem>
              <br/>
              <FormItem label="订单状态">
                {getFieldDecorator('orderStatus', {
                })(
                  <RadioGroup>
                    {/*<Radio value={'0'}>竞拍失败</Radio>*/}
                    <Radio value={'1'}>交易成交</Radio>
                    <Radio value={'2'}>已发货</Radio>
                  </RadioGroup>
                )}
              </FormItem>

              <Button onClick={this.handleSearch} type="primary" style={{ margin: '0 8px 8px 0'}}>搜索</Button>
            </Form>
          {/*
            <span>商品编号：</span>
            <Input
              placeholder="null"
              style={{ width: 150, margin: '0 8px 8px 0' }}
              onChange={value => {console.log(value)}}>
            </Input>
            <span>订单编号：</span>
            <Input placeholder="null" style={{ width: 150, margin: '0 8px 8px 0' }}></Input>
            <span>参与者：</span>
            <Input placeholder="null" style={{ width: 150, margin: '0 8px 8px 0' }}></Input>

            <br/>

            <span>状态：</span>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>未开始</Radio>
              <Radio value={2}>拍卖中</Radio>
              <Radio value={3}>已下架</Radio>
              <Radio value={4}>拍卖结束</Radio>
            </RadioGroup>

            <br/>

            <Button onClick={this.showModal} type="primary" style={{ margin: '0 8px 8px 0'}}>搜索</Button>

            <Button onClick={this.showModal} style={{ margin: '0 8px 8px 0'}}>重置</Button>
          */}

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
