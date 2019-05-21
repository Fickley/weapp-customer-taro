import Taro from '@tarojs/taro';
import {
  View,
  Text,
  Button,
  ScrollView,
  Image,
  Swiper,
  SwiperItem,
} from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import Login from '../../components/login'
import BindPhone from '../../components/bind-phone'

import api from '../../configs/api';

import server from '../../utils/server';

import './detail.less';

export default class Detail extends BaseApp {

  config = {
    navigationBarTitleText: '活动详情',
  };

  constructor(props) {
    super(props);
    this.state = {
      isPreview: false,
      loginViewVisible: false,
      bindPhoneVisible: false,
      isAttended: false,
      detail: {},
      packageId: '',
      bannerImageUrl: '',
      customerLimitCount: '',
      companyFrontDoorPic: [],
      couponItems: [],
      countDownDay: 0,
      countDownHour: 0,
      countDownMinute: 0,
      countDownSecond: 0,
    };
  }

  componentDidMount() {
    let that = this;
    const activityId = this.$router.params.activityId;
    const isPreview = this.$router.params.isPreview;

    if (!activityId) {
      Taro.showToast({ title: '活动参与，没有活动id', icon: 'none' });
      return;
    }

    // 预览模式，门店老板查看
    if (isPreview) {
      this.setState({ isPreview });
    }
    this.getUserInfo(() => {
      that.getDetail(this.$router.params);
    });
  }

  contact = () => {
    Taro.makePhoneCall({ phoneNumber: this.state.detail.contract_phone });
  };

  onPreview = (urls) => {
    Taro.previewImage({ urls });
  };

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
        // 绑定成功后，自动调用参与活动
        this.handleAttend()
      }
    }, true)
  };

  onUnload = () => {
    clearInterval(this.timeInterval);
  };

  onShareAppMessage = () => {
    const { detail, bannerImageUrl } = this.state;
    return {
      title: detail.title,
      imageUrl: bannerImageUrl,
      path: `/pages/attend-activity/detail?activityId=${detail._id}`,
    };
  };

  handleAttend = () => {
    const { detail, customerLimitCount, packageId } = this.state;
    const customerPackageId = Number(detail.customer_package_id);

    // 已参与，查看详情
    if (customerPackageId > 0) {
      Taro.navigateTo({ url: `../activity/detail?id=${customerPackageId}` });
      return false;
    }

    if (customerLimitCount !== 0 && Number(detail.sell_counts) === customerLimitCount) {
      Taro.showToast({ title: '活动名额已满', icon: 'none' });
      return false;
    }

    const that = this;
    this.getUserInfo(userInfo => {
      // 1. 微信授权，获取用户信息
      if (!userInfo.avatar_url) {
        that.setState({ loginViewVisible: true });
        return false;
      }

      // 1. 免费参与
      if (Number(detail.sell_price) === 0) {
        server.post(api.activity.joinFree(), { package_id: packageId }, () => {
          Taro.navigateTo({
            url: `/pages/attend-activity/success?price=${detail.sell_price}&title=${detail.title}`,
            success() {
              that.getDetail(that.$router.params);
            },
          });
        }, (errorMsg) => {
          Taro.showToast({ title: `参与失败[${errorMsg}]`, icon: 'none' });
        });
      } else {
        // 2. 付费参与
        server.get(api.activity.getPayParams(detail._id), data => {
          const payData = data.res.charge.credential.wx_lite;

          Taro.requestPayment({
            'timeStamp': payData.timeStamp,
            'nonceStr': payData.nonceStr,
            'package': payData.package,
            'signType': payData.signType,
            'paySign': payData.paySign,
            success() {
              Taro.navigateTo({
                url: `/pages/attend-activity/success?price=${detail.sell_price}&title=${detail.title}`,
                success() {
                  that.getDetail(that.$router.params);
                },
              });
            },
            fail() {
              Taro.showToast({ title: '支付取消', icon: 'none' });
            },
          });
        }, (errorMsg) => {
          Taro.showModal({
            title: '提示',
            content: errorMsg,
            showCancel: false,
            success: function() {
            },
          });
        });
      }
    });
  };

  setTimeInterval = (time) => {
    const that = this;
    const {} = this.state;
    that.timeInterval = setInterval(() => {
      const second = time;
      // 天数位
      const day = Math.floor(second / 3600 / 24);
      let dayStr = day.toString();
      if (dayStr.length === 1) dayStr = '0' + dayStr;

      // 小时位
      const hr = Math.floor((second - day * 3600 * 24) / 3600);
      let hrStr = hr.toString();
      if (hrStr.length === 1) hrStr = '0' + hrStr;

      // 分钟位
      const min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      let minStr = min.toString();
      if (minStr.length === 1) minStr = '0' + minStr;

      // 秒位
      const sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      let secStr = sec.toString();
      if (secStr.length === 1) secStr = '0' + secStr;

      that.setState({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      }, () => {
        time--;
        if (time < 0) {
          clearInterval(that.timeInterval);
          that.setState({
            countDownDay: '00',
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          });
        }
      });
    }, 1000);
  };

  getDetail = (options) => {
    const that = this;
    let packageId = options.activityId;
    if (options.scene) {
      packageId = decodeURIComponent(options.scene);
    }

    that.setState({ packageId });

    server.get(api.enrollActivity.detail(packageId), data => {
      const { detail } = data.res;
      that.setState({
        detail,
        isAttended: Number(detail.customer_package_id) > 0,
        couponItems: JSON.parse(detail.coupon_items),
        customerLimitCount: Number(detail.customer_limit_count),
      });

      server.getPublicFileUrl(detail.banner_pic, url => {
        that.setState({ bannerImageUrl: url });
      });

      const storePicKeys = [];
      if (detail.company_icon_pic) {
        storePicKeys.push(detail.company_icon_pic);
      }
      if (detail.company_introduce_pics) {
        storePicKeys.push(detail.company_introduce_pics);
      }

      const pics = storePicKeys.join(',').split(',');
      if (pics.length > 0) {
        pics.forEach((item) => {
          if (item.length > 0) {
            server.getPublicFileUrl(item, url => {
              that.state.companyFrontDoorPic.push(url);
            });
          }
        });
      }

      const totalSecond = Number(new Date(detail.expire_date).getTime() / 1000) -
        Date.parse(new Date()) / 1000;
      that.setTimeInterval(totalSecond);
    }, (errorMsg) => {
      Taro.showToast({ title: `获取详情失败[${errorMsg}]`, icon: 'none' });
    });
  };

  render() {
    const {
      detail, bannerImageUrl, countDownDay, countDownHour,
      countDownMinute, countDownSecond , couponItems,
      isPreview, isAttended, customerLimitCount, companyFrontDoorPic,
      loginViewVisible, bindPhoneVisible
    } = this.state;
    return (
      <View>
        <ScrollView style={{position: 'relative', backgroundColor: detail.background_color}}>
          <Image src={bannerImageUrl} mode='widthFix' style={{width: '100%'}}>
            <View className='share-wrapper'>
              <Button className='btn-share' openType='share'>
                <Image className='img' src={require('../../images/icons/btn_forward@2x.png')} />
              </Button>
              <View className='btn-share mt10' onClick={this.contact}>
                 <Image className='img' src={require('../../images/icons/btn_call@2x.png')} />
              </View>
            </View>
          </Image>

          <View className='activity-title'>
            <Text className='text-white font20'>{detail.title}</Text>
          </View>

          <View className='time'>
            <Text className='font-default'>距离结束</Text>
            <Text className='font-default timeNum'>{ countDownDay }</Text>
            <Text className='font-default'>天</Text>
            <Text className='font-default timeNum'>{{ countDownHour }}</Text>
            <Text className='font-default'>时</Text>
            <Text className='font-default timeNum'>{{ countDownMinute }}</Text>
            <Text className='font-default'>分</Text>
            <Text className='font-default timeNum'>{{ countDownSecond }}</Text>
            <Text className='font-default'>秒</Text>
          </View>

          <View className='card'>
            <View className='flex-row-between mb10'>
              <Text className='font-default bold'>产品名称</Text>
              <Text className='font-default bold'>数量</Text>
            </View>

            {couponItems.map((item)=>(
              <View className='flex-row-between mb10' style={{height: '25Px', lineHeight: ' 25Px'}}>
                <Text className='font-default'>{ item.item_name }</Text>
                <Text className='font-default'>{ item.total_count }</Text>
              </View>
            ))}

            <View className='flex-row-between feeDetail mt10 mb10'>
              <View className='font-default'>
                已报名{ detail.sell_count }
                {customerLimitCount !== 0 && <Text>{ customerLimitCount }</Text>}
              </View>
              <Text className='font-default'>活动费用￥{ detail.sell_price }</Text>
            </View>
          </View>

          <View className='card mt30'>
            <View className='card-title'>
              <Text className='font-bold'>活动介绍</Text>
            </View>
            <View className='mt20 font-default'>{ detail.description }</View>
          </View>

          {Number(detail.is_show_company_info) === 0 ? null :
            <View className='card mt30 mb60'>
              <View className='card-title'>
                <Text className='font-bold'>门店信息</Text>
              </View>
              <View className='mt20'>
                {companyFrontDoorPic.length !== 0 &&
                <Swiper
                  className='store-image-swiper'
                  indicatorDots='true'
                  autoplay='true'
                  interval='5000'
                  duration='500'
                >
                  {companyFrontDoorPic.map((item)=>(
                    <SwiperItem onClick={()=>this.onPreview(companyFrontDoorPic)}>
                      <Image src={item} mode='widthFix' className='img' />
                    </SwiperItem>
                  ))}
                </Swiper>
                }
                <View className='padding5' style={{display: 'flex'}}>
                  <Text className='font-default mr10 justify'>门店名称:</Text>
                  <Text className='font-default'>{ detail.company_name }</Text>
                </View>
                <View className='padding5' style={{display: 'flex'}}>
                  <Text className='font-default mr10 justify'>地址:</Text>
                  <Text className='font-default'>{ detail.company_address }</Text>
                </View>
                <View className='padding5' style={{display: 'flex'}}>
                  <Text className='font-default mr10 justify'>联系人:</Text>
                  <Text className='font-default'>{ detail.company_admin_name }</Text>
                </View>
                <View className='padding5' style={{display: 'flex'}}>
                  <Text className='font-default mr10 justify'>电话:</Text>
                  <Text className='font-default'>{ detail.company_admin_phone }</Text>
                </View>
              </View>
            </View>
          }

        {isPreview ?
        <View className='btn-block-bottom'>
          <Button openType='share' className='btn-share-block'>分享给客户</Button>
        </View>:
        <View className='btn-block-bottom' onClick={this.handleAttend}>
          <Text className='font-bold'>{ isAttended ? '我的参与记录' : '我要参加' }</Text>
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
      </ScrollView>
    </View>
    )
  }
}
