import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import CONFIG from '../common/config';

import { Menu, Dropdown, Icon, Button, Input, Modal, Form, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Downhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      isModal: false,
      date: '',
      pagination: {
        // 封装的分页
        total: 100,
        defaultPageSize: 10,
      },
      columns: [{
        title: '产品ID',
        dataIndex: 'productId',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '产品名',
        dataIndex: 'productName',
      }, {
        title: '推广状态',
        dataIndex: 'extensionStatus',
        render: (text, record) => <span>{text == 1 ? '推广中' : '暂停'}</span>,
      }, {
        title: '操作',
        dataIndex: 'extensionStatus',
        render: (text, record) => <Button>{text == 1 ? '暂停' : '推广'}</Button>,
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

    // this.state.userInfo = JSON.parse(window.localStorage.userAdmin || 'null')
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        let _token = window.localStorage.tokenAdmin
        fetch(CONFIG.devURL + `/user/updatePassword?oldPassword=${values.oldPassword}&newPassword=${values.newPassword}&token=${_token}&accountType=${this.state.userInfo.accountType}`, {
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
                // 修改成功
                this.setState({
                  isModal: false,
                });
              // }
            } else {
            }
            alert(json.msg)
          })
          .catch(e => {
            alert(e)
          })
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
  handleLogout() {
    window.localStorage.userAdmin = ''
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let adminName = '普通用户'
    // if (this.state.userInfo.accountType && this.state.userInfo.accountType === 1) {
    //   adminName = '管理员'
    // }
    const menu = (
      <Menu>
        <Menu.Item>
          <a className="ant-dropdown-link" onClick={this.showModal}>修改密码</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ float: 'right', lineHeight: '1.4' }}>
        <Dropdown overlay={menu}>
          <p>
            <span style={{ marginRight: '12px' }}>{this.state.userInfo.userName} - {adminName}</span>
            <Link to='/push' onClick={this.handleLogout}>注销 <Icon type="down" /></Link>
          </p>
        </Dropdown>
        {/*
          <span style={{ marginRight: '12px' }}>{this.state.userInfo.userName} - {adminName}</span>
          <Link to='/login' onClick={this.handleLogout}>注销</Link>
        */}

        <Modal
          title="修改密码"
          visible={this.state.isModal}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem label="旧密码">
              {getFieldDecorator('oldPassword', {
                rules: [{ required: true, message: '请输入旧密码！' }],
              })(
                <Input placeholder="旧密码" />
              )}
            </FormItem>
            <FormItem label="新密码">
              {getFieldDecorator('newPassword', {
                rules: [{ required: true, message: '请输入新密码！' }],
              })(
                <Input placeholder="新密码" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const DownheadW = Form.create()(Downhead);
export default DownheadW;
