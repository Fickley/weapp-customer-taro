import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import Login from '../../components/login';
import BindPhone from '../../components/bind-phone'

import api from '../../configs/api'
import server from '../../utils/server'

export default class Consume extends BaseApp {

  config = {
    navigationBarTitleText: '核销列表',
  };

  constructor(props) {
    super(props);
    this.state = {
      loginViewVisible: false,
      bindPhoneVisible: false,
      loading: false,
      page: 1,
      list: [],
    };
  }

  componentDidMount() {
    const that = this;
    this.getUserInfo(userInfo => {
      // 1. 微信授权，获取用户信息
      if (!userInfo.avatar_url) {
        that.setState({loginViewVisible: true});
        return false
      }
    });

    that.getConsumeList()
  }

  onCancel = () => {
    this.setState({loginViewVisible: false})
  };

  onReloadUserInfo = () => {
    const that = this;
    this.getUserInfo((userInfo) => {
      // 2. 绑定手机号
      if (!userInfo.phone || userInfo.phone.length !== 11) {
        Taro.showToast({ title: '请先绑定手机号', icon: 'none' });
        that.setState({bindPhoneVisible: true});
      } else {
        that.setState({bindPhoneVisible: false});
        that.getConsumeList()
      }
    }, true)
  };

  getConsumeList = () => {
    const {page} = this.state;
    const that = this;
    server.get(api.activity.consumeList(page), data => {
      that.setState({total: data.res.total, list: data.res.list});
    })
  };

  render() {

    const { list, total, loading, loginViewVisible, bindPhoneVisible } = this.state;
    return (
      <View>
        {list.length === 0 ?
          <View className='weui-loadmore weui-loadmore_line'>
            <View className='weui-loadmore__tips weui-loadmore__tips_in-line'>没有数据</View>
          </View>
          :
          <View className='weui-panel weui-panel_access'>
            <View className='weui-panel__bd'>
              {list.map((item) => (
                <View taroKey={item._id} className='weui-media-box weui-media-box_appmsg'>
                  <View className='weui-media-box__bd weui-media-box__bd_in-appmsg'>
                    <View className='weui-media-box__title'>
                      <Text className='fl'> { item.title }</Text>
                      <Text className='fr'> { item.company_name || '' }</Text>
                    </View>
                    <View className='weui-media-box__desc'>
                      <Text>{ item.maintain_item_name } x { item.consume_count }</Text>
                      <Text className='pull-right'>{ item.consume_time }</Text>
                    </View>
                  </View>
                </View>
                )
              )}
              {loading &&
                <View className='weui-loadmore'>
                  <View className='weui-loading' />
                  <View className='weui-loadmore__tips'>正在加载</View>
                </View>
              }
              {list.length > 0 && list.length === total &&
               <View className='weui-loadmore weui-loadmore_line'>
                 <View className='weui-loadmore__tips weui-loadmore__tips_in-line'>已经到底了啦</View>
               </View>
              }
            </View>
          </View>
        }


        <Login
          visible={loginViewVisible}
          onCancel={this.onCancel} onReloadUserInfo={this.onReloadUserInfo}
        />
        <BindPhone
          title='输入您的联系方式'
          visible={bindPhoneVisible}
          onCancel={this.onCancel} onReloadUserInfo={this.onReloadUserInfo}
        />
      </View>
    );
  }
}
