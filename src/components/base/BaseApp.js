import Taro, { Component } from '@tarojs/taro';

import api from '../../configs/api';
import server from '../../utils/server';

import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData';

export default class BaseApp extends Component {

  /**
   * 微信登录并换取数据凭证
   * @param cb 需要登录后执行的回调函数
   */
  authLogin = (cb) => {
    Taro.login({
      success(res) {
        if (res.code) {
          Taro.request({
            url: api.customer.authLogin(res.code),
            success(item) {
              const data = item.data;
              const sessionId = data.res.cookies;
             // const expiredTime = +new Date() + (24 * 60 * 60 * 1000);

              // save to app instance
              setGlobalData('sessionId', sessionId);
             // setGlobalData('expiredTime', `${expiredTime}`);

              // save to storage
              Taro.setStorageSync('sessionId', sessionId);
             // Taro.setStorageSync('expiredTime', expiredTime);

             // that.setInterceptor(sessionId);

              if (typeof cb === 'function') {
                cb();
              }
            },
          });
        }
      },
      fail() {
        Taro.showToast({ title: '微信登录失败', icon: 'none' });
      },
    });
  };

  updateUserInfo = (cb) => {
    const that = this;
    Taro.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success(res) {
        const userInfo = res.userInfo;
        const encryptedData = res.encryptedData;
        const iv = res.iv;

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
          that.getUserInfo(cb, true);
        });
      },
    });
  };

  // isReload: 是否需要从服务端重新获取
  getUserInfo = (cb, isReload = true) => {
    if (Object.keys(getGlobalData('userInfo')).length > 0 && !isReload) {
      cb && cb(getGlobalData('userInfo'));
      return;
    }

    Taro.showLoading({ title: '加载中', mask: true });
    const that = this;
    server.get(api.customer.getBaseInfo(), (data) => {
      Taro.hideLoading();
      const userInfo = data.res.customer_info;
      setGlobalData('userInfo', userInfo);
      cb && cb(userInfo);
    }, () => {
      Taro.hideLoading();
      that.authLogin();
    });
  };
}
