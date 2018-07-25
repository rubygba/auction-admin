import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import CONFIG from '../common/config';
import { getFormatDate, getFormatDate2 } from '../common/tools';

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
      }, {
        title: '订单时间',
        dataIndex: 'createTime',
      }, {
        title: '商品编号',
        dataIndex: 'goodsSn',
      }, {
        title: '操作',
        dataIndex: 'createTime',
        render: (text, record) => (
          <div>
            <Button onClick={this.showModModal.bind(this, record)} type="primary" style={{margin: '0 8px 0 0'}}>出价记录</Button>
            <Link to={`/push/pmdetail/${record.goodssn}`}><Button onClick={this.setPmName.bind(this, record)} style={{margin: '0 8px 0 0'}}>发货</Button></Link>
          </div>),
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
    fetch(CONFIG.devURL + `/order/queryOrders?userName=&orderNo=&goodsSn=&orderStatus=`, {
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
  handleSubmit = (e) => {
    e.preventDefault();

    // if (this.state.uploading) {
    //   return
    // }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          okText: 'Loading...',
          uploading: true,
        })

        console.log('Received values of form: ', values);
        // let _token = window.localStorage.tokenAdmin
        // let _pre = '/product/add?'
        // if (this.state.isModify) {
        //   _pre = '/product/update?id=' + this.state.modifyId + '&'
        // }

        fetch(CONFIG.devURL + `/goods/addgoods?goodstitle=${values.goodstitle}&goodstitle=${values.goodstitle}&goodsdesc=${values.goodsdesc}&floorprice=${values.floorprice}&begindate=${this.state.begindate}&enddate=${this.state.enddate}&imgs=${values.imgs}&addmoney=${values.addmoney}`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            console.log(json)
            this.getData()
            this.setState({
              okText: 'OK',
              uploading: false,
              isModal: false,
            })
          })
          .catch(e => {
            alert(e)
          })

        // 创建新产品
        // fetch(CONFIG.devURL + `${_pre}productName=${values.productName}&extensionStatus=${values.extensionStatus}&token=${_token}`, {
        //   method: 'GET',
        //   credentials: 'include',
        //   mode: 'cors'
        // })
        //   .then(res => res.json())
        //   .then(json => {
        //     console.log(json)
        //     if (json.code === 200) {
        //       // TODO:
        //       let d = json.data // json.data为id返回
        //       if (d) {
        //         // 创建/修改成功，开始上传apk
        //         if (this.state.isModify) {
        //           if (!values.upload || values.upload.length < 1) {
        //             // 停止后续修改
        //             this.getData()
        //             this.setState({
        //               okText: 'OK',
        //               uploading: false,
        //               isModal: false,
        //             })
        //             return
        //           }
        //           d = this.state.modifyId
        //         }

        //         var fd = new FormData()
        //         fd.append('productId', d)
        //         fd.append('uploadFile', values.upload[0].originFileObj)

        //         // 上传apk
        //         fetch(CONFIG.devURL + `/api/upload?token=${_token}`, {
        //           method: 'POST',
        //           body: fd,
        //           mode: 'cors',
        //           credentials: 'include'
        //         })
        //           .then(res => res.json())
        //           .then(json => {
        //             console.log(json)
        //             if (json.code === '200') {
        //               // 上传成功，更新上传包
        //               fetch(CONFIG.devURL + `/api/applyChannelPkg?productId=${d}&token=${_token}`, {
        //                 method: 'GET',
        //                 credentials: 'include',
        //                 mode: 'cors'
        //               })
        //                 .then(res => res.json())
        //                 .then(json => {
        //                   console.log(json)
        //                   if (json.code === 200) {
        //                     // let d = json.data
        //                     // if (d) {
        //                       // 修改成功
        //                     // }
        //                   } else {
        //                   }
        //                   alert(json.msg)
        //                   this.getData()
        //                 })
        //                 .catch(e => {
        //                   alert(e)
        //                   this.getData()
        //                 })
        //             }
        //             // alert(json.msg)

        //             this.setState({
        //               okText: 'OK',
        //               uploading: false,
        //               isModal: false,
        //             })
        //           })
        //           .catch(e => {
        //             alert(e)
        //           })
        //       }
        //     } else {
        //       this.setState({
        //         okText: 'OK',
        //         uploading: false,
        //       })
        //       alert(json.msg)
        //     }
        //   })
        //   .catch(e => {
        //     this.setState({
        //       okText: 'OK',
        //       uploading: false,
        //     })
        //     alert(e)
        //   })
      }
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
  updateApk = (record) => {
    fetch(CONFIG.devURL + `/songhengstore/images`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.code === 200) {
          alert(json.msg)
        } else {
          alert(json.msg)
        }
      })
      .catch(e => {
        alert(e)
      })
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

            <br/>

            <Modal
              title={this.state.modalTitle}
              visible={this.state.isModal}
              onOk={this.handleSubmit}
              onCancel={this.handleCancel}
              okText={this.state.okText}
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem label="商品名" {...formItemLayout}>
                  {getFieldDecorator('goodstitle', {
                    rules: [{ required: true, message: '请输入商品名！' }],
                  })(
                    <Input placeholder="商品名" />
                  )}
                </FormItem>
                <FormItem label="起拍价" {...formItemLayout}>
                  {getFieldDecorator('floorprice', {
                    rules: [{ required: true, message: '请输入起拍价！' }],
                  })(
                    <InputNumber min={0} max={99999} />
                  )}
                </FormItem>
                <FormItem label="拍卖时间" {...formItemLayout}>
                  {getFieldDecorator('alldate', {
                    initialValue: [moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')],
                    rules: [{ required: true, message: '请输入拍卖时间！' }],
                  })(
                    <RangePicker
                      showTime={true}
                      format={'YYYY/MM/DD HH:mm:ss'}
                      onChange={this.handleDatepicker.bind(this)}
                      style={{ margin: '0 8px 8px 0' }}
                    />
                  )}
                </FormItem>
                <FormItem label="描述" {...formItemLayout}>
                  {getFieldDecorator('goodsdesc', {
                    initialValue: '品牌：\r型号：\rCPU：\r显卡：\r内存：\r分辨率：\r操作系统：\r新旧程度：'
                  })(
                    <TextArea placeholder="" autosize={{ minRows: 6, maxRows: 12 }} />
                  )}
                </FormItem>
                <FormItem label="加价金额" {...formItemLayout}>
                  {getFieldDecorator('addmoney', {
                    rules: [{
                      required: true,
                      pattern: /^(-)?\d+(\.\d+)?$/,
                      message: '请输入正确的加价金额！'
                    }],
                  })(
                    <InputNumber min={1} max={99999} />
                  )}
                </FormItem>
                <FormItem label="上传图片" {...formItemLayout}>
                  {getFieldDecorator('imgs', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(
                      // <input type="file"/>
                    <Upload
                      listType="picture"
                      action={CONFIG.devURL + `/images`}
                      customRequest={this.handleUpload}
                      beforeUpload={(file, fileList) => {
                        console.log(fileList)
                      }}>
                      <Button>
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
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