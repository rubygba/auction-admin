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
      begindate: getFormatDate2(0, -1),
      enddate: getFormatDate2(0),

      searchTitle: '',
      searchSsn: '',
      searchStartD: '',
      searchEndD: '',
      before: 0,
      underway: 0,
      after: 0,
      soldout: 0,

      startDate: getFormatDate(0, -1),
      endDate: getFormatDate(0),

      filesTable: {},
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
        title: '开始时间',
        dataIndex: 'begindate',
        render: (text) => <span>{getFormatDate3(text)}</span>
      }, {
        title: '结束时间',
        dataIndex: 'enddate',
        render: (text) => <span>{getFormatDate3(text)}</span>
      }, {
        title: '操作',
        dataIndex: 'createTime',
        render: (text, record) => {
          if (record.goodstatus === '未开始') {
            return (<div>
              <Button onClick={this.showModModal.bind(this, record)} type="primary" style={{margin: '0 8px 0 0'}}>编辑</Button>
              <Link to={`/push/pmdetail/${record.goodssn}`}><Button onClick={this.setPmName.bind(this, record)} style={{margin: '0 8px 0 0'}}>查看商品</Button></Link>
              <Link to={`/push/pmqiddetail/${record.goodssn}`}><Button style={{margin: '0 8px 0 0'}}>查看订单</Button></Link>
              <Button onClick={this.showConfirm.bind(this, record)}>强制下架</Button>
            </div>)
          } else {
            return (<div>
              <Button onClick={this.showModModal.bind(this, record)} type="primary" style={{margin: '0 8px 0 0'}}>编辑</Button>
              <Link to={`/push/pmdetail/${record.goodssn}`}><Button onClick={this.setPmName.bind(this, record)} style={{margin: '0 8px 0 0'}}>查看商品</Button></Link>
              <Link to={`/push/pmqiddetail/${record.goodssn}`}><Button style={{margin: '0 8px 0 0'}}>查看订单</Button></Link>
            </div>)
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
    fetch(CONFIG.devURL + `/goods/getgoods?goodstitle=${this.state.searchTitle}&goodssn=${this.state.searchSsn}&begindate=${this.state.searchStartD}&enddate=${this.state.searchEndD}&before=${this.state.before}&underway=${this.state.underway}&after=${this.state.after}&soldout=${this.state.soldout}`, {
    // fetch(CONFIG.devURL + `/goods/getgoods`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => {
        if (res.json) {
          return res.json()
        } else {
          this.props.history.replace('/login') // cookie过期，跳转登录
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
        searchTitle: values.top_name || '',
        searchSsn: values.top_ssn || '',
        before: values.top_radio === 'before' ? 1 : 0,
        underway: values.top_radio === 'underway' ? 1 : 0,
        after: values.top_radio === 'after' ? 1 : 0,
        soldout: values.top_radio === 'soldout' ? 1 : 0
      }, () => {
        this.getData()
      })
    });
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
        let _pre = '/goods/addgoods?'
        if (this.state.isModify) {
          _pre = '/goods/editGoods?goodsSn=' + this.state.modifyId + '&'
        }

        // 处理图片上传
        let imgStr = []
        if (values.imgs) {
          for (let i = 0; i < values.imgs.length && i < 5; i++) {
            if (values.imgs[i]) {
              imgStr.push(this.state.filesTable[values.imgs[i].uid])
            }
          }
        }
        imgStr = imgStr.join(',')

        // 处理加价金额
        let addStr = []
        addStr.push(values.addmoney)
        if (values.addmoney2) addStr.push(values.addmoney2)
        if (values.addmoney3) addStr.push(values.addmoney3)
        if (values.addmoney4) addStr.push(values.addmoney4)
        if (values.addmoney5) addStr.push(values.addmoney5)
        addStr = addStr.join(',')

        fetch(CONFIG.devURL + _pre + `goodstitle=${values.goodstitle}&goodsdesc=${values.goodsdesc}&floorprice=${values.floorprice}&begindate=${this.state.begindate}&enddate=${this.state.enddate}&imgs=${imgStr}&addmoney=${addStr}`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        })
          .then(res => res.json())
          .then(json => {
            console.log(json)
            alert(json.message);
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
  deletePm = (record) => {
    console.log(record)
    fetch(CONFIG.devURL + `/goods/delGoods?goodsSn=${record.goodssn}`, {
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
    confirm({
      title: '确认要下架商品？',
      onOk() {
        this.deletePm(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
    let _imgs = []

    for (let i = 0; i < record.imgs.length; i++) {
      if (record.imgs[i]) {
        let temp = {
          uid: -(i + 1),
          name: 'img',
          status: 'done',
          url: record.imgs[i],
          thumbUrl: record.imgs[i]
        }
        _imgs.push(temp)
        // 处理图片上传
        this.state.filesTable[-(i + 1)] = record.imgs[i]
      }
    }

    this.props.form.setFieldsValue({
      goodstitle: record.goodstitle,
      floorprice: record.floorprice,
      // alldate: '',
      // 处理加价金额
      addmoney: record.addmoney[0] || '',
      addmoney2: record.addmoney[1] || '',
      addmoney3: record.addmoney[2] || '',
      addmoney4: record.addmoney[3] || '',
      addmoney5: record.addmoney[4] || '',
      goodsdesc: record.goodsdesc,
      imgs: _imgs
    })
    this.setState({
      isModal: true,
      modalTitle: '更新商品信息',
      isModify: true,
      modifyId: record.goodssn,
      // 处理日期
      begindate: record.begindate,
      enddate: record.enddate,
    });
  }
  showModal = () => {
    this.setState({
      isModal: true,
      modalTitle: '新建产品',
      isModify: false,
    });
  }
  handleRemove = (ev) => {
    console.log('remove upload:', ev);
    delete this.state.filesTable[ev.uid];
    console.log(this.state.filesTable);
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
        this.state.filesTable[ev.file.uid] = json.data[0]
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
      // startDate: dateStrings[0].replace(/-/g, ''),
      // endDate: dateStrings[1].replace(/-/g, ''),
      searchStartD: new Date(dateStrings[0]).getTime(),
      searchEndD: new Date(dateStrings[1]).getTime(),
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
            <FormItem label="商品名">
              {getFieldDecorator('top_name', {
                rules: [{}],
              })(
                <Input
                  placeholder="null"
                  style={{ width: 200, margin: '0 8px 8px 0' }}>
                </Input>
              )}
            </FormItem>
            <FormItem label="商品编号">
              {getFieldDecorator('top_ssn', {
                rules: [{}],
              })(
                <Input
                  placeholder="null"
                  style={{ width: 200, margin: '0 8px 8px 0' }}>
                </Input>
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('top_radio', {
                rules: [{}],
              })(
                <RadioGroup>
                  <Radio value={'before'}>未开始</Radio>
                  <Radio value={'underway'}>竞拍中</Radio>
                  <Radio value={'soldout'}>已下架</Radio>
                  <Radio value={'after'}>已结束</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <br/>
            <FormItem label="拍卖时间">
              {getFieldDecorator('top_date', {
                initialValue: [moment(this.state.startDate, 'YYYY-MM-DD'), moment(this.state.endDate, 'YYYY-MM-DD')],
              })(
                <RangePicker
                  showTime={true}
                  format={'YYYY/MM/DD HH:mm:ss'}
                  onChange={this.handleDatepicker2.bind(this)}
                  style={{ margin: '0 8px 8px 0' }}
                />
              )}
            </FormItem>

            <Button onClick={this.handleSearch} type="primary" style={{ margin: '0 8px 8px 0'}}>搜索</Button>

            {/*<Button onClick={this.showModal} style={{ margin: '0 8px 8px 0'}}>重置</Button>*/}
          </Form>

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
                <FormItem label="加价金额" {...formItemLayout}>
                  {getFieldDecorator('addmoney2', {
                    rules: [{
                      pattern: /^(-)?\d+(\.\d+)?$/,
                      message: '请输入正确的加价金额！'
                    }],
                  })(
                    <InputNumber min={1} max={99999} />
                  )}
                </FormItem>
                <FormItem label="加价金额" {...formItemLayout}>
                  {getFieldDecorator('addmoney3', {
                    rules: [{
                      pattern: /^(-)?\d+(\.\d+)?$/,
                      message: '请输入正确的加价金额！'
                    }],
                  })(
                    <InputNumber min={1} max={99999} />
                  )}
                </FormItem>
                <FormItem label="加价金额" {...formItemLayout}>
                  {getFieldDecorator('addmoney4', {
                    rules: [{
                      pattern: /^(-)?\d+(\.\d+)?$/,
                      message: '请输入正确的加价金额！'
                    }],
                  })(
                    <InputNumber min={1} max={99999} />
                  )}
                </FormItem>
                <FormItem label="加价金额" {...formItemLayout}>
                  {getFieldDecorator('addmoney5', {
                    rules: [{
                      pattern: /^(-)?\d+(\.\d+)?$/,
                      message: '请输入正确的加价金额！'
                    }],
                  })(
                    <InputNumber min={1} max={99999} />
                  )}
                </FormItem>
                <FormItem label="上传图片" {...formItemLayout}>
                  {getFieldDecorator('imgs', {
                    required: true,
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(
                      // <input type="file"/>
                    <Upload
                      listType="picture"
                      action={CONFIG.devURL + `/images`}
                      customRequest={this.handleUpload}
                      onRemove={this.handleRemove}
                      beforeUpload={(file, fileList) => {
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
