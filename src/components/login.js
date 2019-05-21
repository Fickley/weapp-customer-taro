import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

import api from '../configs/api';

import server from '../utils/server';

import '../styles/app.less';

export default class Login extends Component {
  static defaultProps = {
    visible: false,
  };

  constructor(props) {
    super(props);

  }

  onGetUserInfo = (e) => {
    const {onCancel, onReloadUserInfo} = this.props;
    const detail = e.detail;
    const userInfo = detail.userInfo;
    const encryptedData = detail.encryptedData;
    const iv = detail.iv;

    const params = {
      nick_name: userInfo.nickName,
      gender: userInfo.gender,
      province: userInfo.province,
      city: userInfo.city,
      country: userInfo.country,
      avatar_url: userInfo.avatarUrl,
      encrypted_data: encryptedData,
      encrypt_iv: iv,
    };

    server.post(api.customer.updateBaseInfo(), params, () => {
      onCancel();
      onReloadUserInfo();
    });
  };

  render() {

    const { visible } = this.props;

    return (
      visible &&
      <View className='modal-wrapper'>
        <View className='modal-content'>
          <View className='modal-title'>微信登录</View>
          <View className='modal-body'>
            <Button
              className='weui-btn'
              type='primary'
              openType='getUserInfo'
              lang='zh_CN'
              onGetUserInfo={this.onGetUserInfo}
            >
              <Text className='iconfont icon-wechat-fill text-green font20'> 微信授权登录</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
