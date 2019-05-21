import Taro from '@tarojs/taro';
import { View, Image, ScrollView, Input, Icon,OfficialAccount } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import Login from '../../components/login'
import BindPhone from '../../components/bind-phone'

import api from '../../configs/api';

import server from '../../utils/server';

import './index.less';

export default class Index extends BaseApp {

  config = {
    navigationBarTitleText: '我的优惠劵'
  };

  constructor(props) {
    super(props);
    this.state = {
      loginViewVisible: false,
      bindPhoneVisible: false,
      loading: false,
      isRequested: false,
      isHideOfficialAccount: false,
      key: '',
      page: 1,
      total: 0,
      list: []
    };
  }

  componentWillMount() {
    const that = this;
    setTimeout(() => {
      that.getUserInfo(userInfo => {
        that.setState({isHideOfficialAccount: userInfo.is_join_wechat_customer});
      })
    }, 1000)
  }

  componentDidShow() {
    const that = this;
    const { page, total } = this.state;
    this.getUserInfo(userInfo => {
      // 1. 微信授权，获取用户信息
      if (!userInfo.avatar_url) {
        that.setState({loginViewVisible: true});
        return false
      }
    });
    // 解决换绑手机号后，切换数据不更新的问题
    if (total === 0) {
      setTimeout(() => this.getActivities(page,''), 2000)
    }
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
        // 解决换绑手机号后，切换数据不更新的问题
        if (that.total === 0) {
          setTimeout(() => that.getActivities(that.state.page), 2000)
        }
      }
    }, true)
  };

  linkToDetail = (id) => {
    Taro.navigateTo({ url: `/pages/activity/detail?id=${id}` })
  };

  clearInput = () => {
    this.setState({key: ''});
    this.getActivities(1)
  };

  inputTyping =(e) => {
    const key = e.target.value;
    this.setState({key});
    this.getActivities(1, key)
  };

  onReachBottom = () => {
    const that = this;

    if (this.state.list.length < this.state.total) {
      that.setState({loading:true, page: that.state.page+1},()=>{
        server.get(api.activity.list(that.state.page), data => {
          const { list } = data.res;

          that.setState({list: that.list.concat(list), loading: false});

          list.forEach(item => {
            server.getPublicFileUrl(item.banner_pic, url => {
              item.banner_url = url;
            })
          });
        })
      })
    }
  };

  getActivities(page, key) {
    const that = this;
    server.get(api.activity.list(page, key), data => {
      const { list, total } = data.res;
      var index = 0;
      list.forEach(item => {
        server.getPublicFileUrl(item.banner_pic, url => {
          item.banner_url = url;
          index += 1;
          if (index === list.length) {
            that.setState({list: list, total, isRequested:true });
          }
        })
      });
    })
  }

  render() {
    const { key, list, loading, isHideOfficialAccount, loginViewVisible, bindPhoneVisible } = this.state;
    return (
      <View>
        <ScrollView>
          <View className='weui-search-bar'>
            <View className='weui-search-bar__form'>
              <View className='weui-search-bar__box'>
                <Icon className='weui-icon-search_in-box' type='search' size='14' />
                <Input
                  type='text' className='weui-search-bar__input' placeholder='搜索' value={key}
                  onInput={this.inputTyping}
                />
                {key.length > 0 &&
                <View className='weui-icon-clear' onClick={this.clearInput}>
                  <Icon type='clear' size='14' />
                </View>}
              </View>
            </View>
          </View>

          <View className='weui-panel weui-panel_access'>
            <View className='weui-panel__bd'>
              {list.map((item)=>(
                <View
                  taroKey={item._id}
                  className='weui-media-box weui-media-box_appmsg'
                  hoverClass='weui-cell_active'
                  onClick={()=>this.linkToDetail(item._id)}
                >
                  <View
                    className='weui-media-box__hd weui-media-box__hd_in-appmsg'
                    style={{width: '60Px', height: '60Px'}}
                  >
                    <Image className='weui-media-box__thumb' src={item.banner_url} />
                  </View>
                  <View className='weui-media-box__bd weui-media-box__bd_in-appmsg'>
                    <View className='weui-media-box__title'>{item.package_title}</View>
                    <View className='weui-media-box__desc'>{item.remark}</View>
                    <View className='weui-media-box__info' style={{marginTop: '5Px'}}>
                      <View className='weui-media-box__info__meta'>
                        门店名称：{item.from_type === '4' ? '水稻会员' : item.company_name  || ''}
                      </View>
                    </View>
                    <View className='weui-media-box__info' style={{marginTop: '5Px'}}>
                      <View className='weui-media-box__info__meta'>
                        有效期至：{item.expire_date === '9999-12-31' ? '永久有效' : item.expire_date}
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {loading &&
               <View className='weui-loadmore'>
                  <View className='weui-loading' />
                  <View className='weui-loadmore__tips'>正在加载</View>
               </View>}

            </View>
          </View>
        </ScrollView>
        {!isHideOfficialAccount &&
        <View className='weui-panel__bd'>
          <OfficialAccount />
        </View>}

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
