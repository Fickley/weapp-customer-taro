import Taro from '@tarojs/taro';
import { View, Text, Button, Image, Navigator } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import BindPhone from '../../components/bind-phone'

import './index.less';

export default class Index extends BaseApp {

  config = {
    navigationBarTitleText: '个人中心',
    disableScroll: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      bindPhoneVisible: false,
      userInfo: {},
    };
  }

  componentDidMount() {
    const that = this;
    this.getUserInfo(userInfo => {
      that.setState({ userInfo });
    });
  }

  onGetUserInfo = () => {
    const that = this;
    this.updateUserInfo(userInfo => {
      that.setState({ userInfo });
    });
  };

  onEditPhone = () => {
    this.setState({bindPhoneVisible: true});
  };

  onCancel = () => {
    this.setState({bindPhoneVisible: false})
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
      }
    }, true)
  };

  render() {
    const { userInfo, bindPhoneVisible } = this.state;
    return (
      <View>
        <View className='head-bar'>
          <View className='avatar-wrapper'>
            {userInfo.avatar_url ?
              <Image className='user-avatar' src={userInfo.avatar_url} />
              :
              <View className='user-avatar'>
                <Text className='iconfont icon-user font32' />
              </View>
            }
          </View>

          {!userInfo.nick_name ?
            <View className='content'>
              <Button
                className='btn-login'
                openType='getUserInfo'
                onGetUserInfo={this.onGetUserInfo}
              >
                请先登录
              </Button>
            </View>
            :
            <View className='content'>
              <View>
                <Text className='text-default font18 bold'>{userInfo.nick_name}</Text>
              </View>
              <View className='text-default'>
                {!userInfo.phone ? '请绑定手机号' : userInfo.phone}
                <Text
                  className='iconfont icon-edit-square text-default ml10'
                  onClick={this.onEditPhone}
                />
              </View>
            </View>}
        </View>

        <View className='weui-grids'>
          <View className='weui-panel'>
            <View className='weui-panel__hd' />
            <View className='weui-panel__bd'>
              <View className='weui-media-box weui-media-box_small-appmsg'>
                <View className='weui-cells weui-cells_in-small-appmsg'>
                  <Navigator
                    url='/pages/me/consume'
                    className='weui-cell weui-cell_access'
                    hoverClass='weui-cell_active'
                  >
                    <View className='weui-cell__hd'>
                      <Image
                        src={require('../../images/icons/icon_money@2x.png')}
                        className='bar-icon'
                      />
                    </View>
                    <View className='weui-cell__bd weui-cell_primary'>
                      <View>核销记录</View>
                    </View>
                    <View className='weui-cell__ft weui-cell__ft_in-access' />
                  </Navigator>
                </View>
              </View>
            </View>
          </View>
        </View>

        <BindPhone
          title='输入您的联系方式'
          visible={bindPhoneVisible}
          onCancel={this.onCancel} onReloadUserInfo={this.onReloadUserInfo}
        />
      </View>
    );
  }
}
