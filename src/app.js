import Taro from '@tarojs/taro';
import BaseApp from './components/base/BaseApp'

import {get as getGlobalData } from './utils/globalData';

import Home from './pages/home';

import './styles/iconfont.wxss';
import './styles/app.less';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends BaseApp {

  config = {
    pages: [
      'pages/home',
      'pages/me/index',
      'pages/me/consume',
      'pages/activity/index',
      'pages/activity/detail',
      'pages/attend-activity/success',
      'pages/attend-activity/detail',
      'pages/store/index',
      'pages/store/coupon-cards',
      'pages/store/coupon-card-detail'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '我的活动',
      navigationBarBackgroundColor: '#FFAD01',
      backgroundColorTop: '#FFAD01',
      backgroundColorBottom: '#FFAD01',
    },
    permission: {
      'scope.userLocation': {
        desc: '您的位置信息将用于展示您附近的优惠活动',
      },
    },
  };

  constructor(props){
    super(props);
  }

  componentWillMount() {
    Taro.addInterceptor((chain)=>{
      const requestParams = chain.requestParams;
      if (requestParams && requestParams.header) {
        var cookie = '';
        if (getGlobalData('sessionId')) {
          cookie = getGlobalData('sessionId');
        }else if (Taro.getStorageSync('sessionId')){
          cookie = Taro.getStorageSync('sessionId');
        }
        requestParams.header.cookie = cookie;
      }
      return chain.proceed(requestParams)
        .then(res => {
          return res
        })
    });

    this.getUserInfo()
  }

  render() {
    return (
      <Home />
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
