import Taro from '@tarojs/taro';
import { View, Image, Navigator, ScrollView } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import Login from '../../components/login'
import BindPhone from '../../components/bind-phone'

import api from '../../configs/api';

import server from '../../utils/server';

export default class Index extends BaseApp {

  config = {
    navigationBarTitleText: '常去门店'
  };

  constructor(props) {
    super(props);
    this.state = {
      loginViewVisible: false,
      bindPhoneVisible: false,
      list: []
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
    that.getLocation()
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
        that.getLocation()
      }
    }, true)
  };

  getLocation() {
    const that = this;
    Taro.getLocation({
      type: 'wgs84',
      success(res) {
        that.getStores(`${res.longitude},${res.latitude}`, '')
      }
    })
  }

  getStores(location, id) {
    const that = this;
    Taro.showLoading({ title: '加载中', mask: true });
    server.get(api.store.list(location, id), data => {
      Taro.hideLoading();
      const { list } = data.res;
      var index = 0;

      list.forEach(item => {
        server.getPublicFileUrl(item.company_info.icon_pic, url => {
          index +=1;
          item.icon_pic = url;
          if (list.length === index) {
            that.setState({list})
          }
        }, () => {
          index +=1;
          item.icon_pic = '../../images/icons/online-store.png';
          if (list.length === index) {
            that.setState({list})
          }
        })
      })
    }, () => {
      Taro.hideLoading();
      Taro.showToast({ title: '加载失败', icon: 'none' })
    })
  }

  render() {
    const { list, loginViewVisible, bindPhoneVisible } = this.state;
    return (
      <View>
        <ScrollView>
          <View className='weui-panel weui-panel_access'>
            <View className='weui-panel__bd'>
              {list.map((item)=>(
                <Navigator
                  url='/pages/store/coupon-cards?id={{item.company_id}}'
                  className='weui-media-box weui-media-box_appmsg'
                  hoverClass='weui-cell_active'
                >
                  <View
                    className='weui-media-box__hd weui-media-box__hd_in-appmsg'
                    style={{width: '70Px', height:'85Px', lineHeight: '85Px'}}
                  >
                    <Image className='weui-media-box__thumb' src={item.icon_pic} />
                  </View>

                  <View className='weui-media-box__bd weui-media-box__bd_in-appmsg'>
                    <View className='flex-row-between'>
                      <View className='weui-media-box__title'>
                        {item.company_info.name || ''}
                      </View>
                      {item.distance >= 1000?
                        <View className='weui-media-box__desc font12 ml10'>
                          {(item.distance / 1000)}km
                        </View>:
                        <View className='weui-media-box__desc font12 ml10'>
                          { item.distance }m
                        </View>
                      }
                    </View>

                    <View className='weui-media-box__desc'>优惠券：{ item.coupon_item_count }张</View>
                    <View className='weui-media-box__desc'>储蓄余额：{ item.prepay_remain }元</View>

                    <View className='weui-media-box__info'>
                      <View className='weui-media-box__info__meta font12'>
                        { item.company_info.province }
                        { item.company_info.city }
                        { item.company_info.country }
                        { item.company_info.address }
                      </View>
                    </View>
                  </View>
                </Navigator>
              ))}

              {list.length < 1 &&
               <View className='flex-row-center'>
                <View className='font16 fontGray'>还没有消费过，快去门店消费吧</View>
               </View>}
            </View>
          </View>
        </ScrollView>

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
