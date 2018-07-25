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
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Apppm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        dataIndex: 'goodstitle',
      }, {
        title: '起拍价',
        dataIndex: 'floorprice',
      }, {
        title: '商品编号',
        dataIndex: 'goodssn',
      }, {
        title: '状态',
        dataIndex: 'goodstatus',
      }, {
      }, {
        title: '开始时间',
        dataIndex: 'begindate',
      }, {
      }, {
        title: '结束时间',
        dataIndex: 'enddate',
      }, {
        title: '操作',
        dataIndex: 'createTime',
        render: (text, record) => (
          <div>
            <Button onClick={this.updateRecord.bind(this, record)} type="primary" style={{margin: '0 8px 0 0'}}>编辑</Button>
            <Link to={`/push/pmdetail/${record.id}`}><Button onClick={this.setPmName.bind(this, record)} style={{margin: '0 8px 0 0'}}>查看商品</Button></Link>
            <Button onClick={this.updateApk.bind(this, record)} style={{margin: '0 8px 0 0'}}>查看订单</Button>
            <Button onClick={this.updateApk.bind(this, record)}>强制下架</Button>
          </div>),
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
        // {
        //   "id": 1,
        //   "productId": "001",
        //   "productName": "猫扑小说安卓",
        //   "extensionStatus": 1,
        //   "urlPrefix": "http://www.shareinstall.com/demo.html?appkey=7FBKAE6B22FK6E&channel=Mop00001",
        //   "createTime": 1528182178000,
        //   "updateTime": null
        // },
        // {
        //   "id": 2,
        //   "productId": "002",
        //   "productName": "猫扑小说ios",
        //   "extensionStatus": 2,
        //   "urlPrefix": "http://www.shareinstall.com/demo.html?appkey=7FBKAE6B22FK6E&channel=Mop00002",
        //   "createTime": 1528278533000,
        //   "updateTime": 1528278585000
        // }
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
    // fetch(CONFIG.devURL + `/songhengstore/goods/getgoods?goodstitle=${'商品标题'}&goodssn=${'商品编号'}&begindate=${'竞拍开始时间'}&enddate=${'竞拍结束时间'}&before=${'未开始'}&underway=${'竞拍中'}&after=${'已结束'}&soldout=${'已下架'}`, {
    fetch(CONFIG.devURL + `/csonghengstore/goods/getgoods`, {
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

    if (this.state.uploading) {
      return
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          okText: 'Loading...',
          uploading: true,
        })

        console.log('Received values of form: ', values);
        let _token = window.localStorage.tokenAdmin
        let _pre = '/product/add?'
        if (this.state.isModify) {
          _pre = '/product/update?id=' + this.state.modifyId + '&'
        }

        var fd = new FormData()
        fd.append('file', values.imgs[0].originFileObj)

        fetch(CONFIG.devURL + `/csonghengstore/images`, {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          body: fd
        })
          .then(res => res.json())
          .then(json => {
            console.log(json)
          })
          .catch(e => {
            console.error(e)
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
  handleUpload = (e) => {
    console.log('rewrite upload:', e);

    // e.onProgress({ percent: number })

    var fd = new FormData()
    fd.append('file', e.file)

    fetch(e.action, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: fd
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        e.onSuccess()
      })
      .catch(e => {
        console.error(e)
        e.onError()
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
  handleDatepicker(dates, dateStrings) {
    this.setState({
      startDate: dateStrings[0].replace(/-/g, ''),
      endDate: dateStrings[1].replace(/-/g, '')
    }, ()=> {
      // this.handleSearch();
    });
  }
  normFile = (e) => {
    console.log('Upload event:', e);
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
            <span>商品名：</span><Input placeholder="input search text" style={{ width: 200, margin: '0 8px 8px 0' }}></Input>
            <span>商品编号：</span><Input placeholder="input search text" style={{ width: 200, margin: '0 8px 8px 0' }}></Input>

            <span>状态：</span>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>未开始</Radio>
              <Radio value={2}>拍卖中</Radio>
              <Radio value={3}>已下架</Radio>
              <Radio value={4}>拍卖结束</Radio>
            </RadioGroup>

            <br/>

            <RangePicker
              defaultValue = {[moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')]}
              format = {'YYYY-MM-DD'}
              onChange={this.handleDatepicker.bind(this)}
              style={{ margin: '0 8px 8px 0' }}
            />

            <Button onClick={this.showModal} type="primary" style={{ margin: '0 8px 8px 0'}}>搜索</Button>

            <Button onClick={this.showModal} style={{ margin: '0 8px 8px 0'}}>重置</Button>

            <br/>

            <Button onClick={this.showModal} type="primary" style={{ margin: '0 0 12px 0'}}>添加商品</Button>

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
                    <Input placeholder="起拍价" />
                  )}
                </FormItem>
                <FormItem label="拍卖时间" {...formItemLayout}>
                  {getFieldDecorator('alldate', {
                    initialValue: [moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')],
                    rules: [{ required: true, message: '请输入拍卖时间！' }],
                  })(
                    <RangePicker
                      format = {'YYYY-MM-DD'}
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
                    <Input placeholder="加价金额" />
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
                      action={CONFIG.devURL + `/csonghengstore/images`}
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
