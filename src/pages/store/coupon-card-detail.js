import Taro from '@tarojs/taro';
import { View, ScrollView, Text, OfficialAccount } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import util from '../../utils/ViewUtil';

import api from '../../configs/api';

import server from '../../utils/server';

const card = {
  height: '160Px',
  width: '100%',
  boxSizing: 'border-box',
  background: 'url(\'https://shuidao-public-pic.qn.shuidao.com/icon_sd_weapp_customer_coupon_card_bg_2x.png\')',
  backgroundSize: '100%',
};

export default class CouponCardDetail extends BaseApp {

  config = {
    navigationBarTitleText: '套餐卡详情',
  };

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      list: [],
    };
  }

  componentDidMount() {
    const option = this.$router.params;
    this.getDetail(option.companyId, option.cardId);
  }

  getDetail(companyId, cardId) {
    const that = this;
    Taro.showLoading({ title: '加载中', mask: true });
    server.get(api.store.couponDetail(companyId, cardId), data => {
      Taro.hideLoading();

      const couponDetail = data.res.card_detail;
      const list = JSON.parse(couponDetail.coupon_items);

      list.forEach(item => {
        if (item.coupon_type === '1') {
          item.couponText = `特价：${item.coupon_price}元`;
        } else if (item.coupon_type === '2') {
          item.couponText = `${item.discount_rate}折`;
        } else if (item.coupon_type === '3') {
          item.couponText = `直减：${item.discount_amount}元`;
        }
      });
      that.setState({ list, detail: couponDetail });
    }, (errorMsg) => {
      Taro.hideLoading();
      Taro.showToast({ title: `加载失败[${errorMsg}]`, icon: 'none' });
    });
  }

  render() {
    const { list, detail } = this.state;
    return (
      <ScrollView>
        <View className='weui-panel weui-panel_access'>
          <View className='weui-panel__bd'>
            <View
              className='weui-media-box weui-media-box_appmsg card'
              style={card}
              hoverClass='weui-cell_active'
            >
              <View
                className='weui-media-box__bd weui-media-box__bd_in-appmsg'
                style={{ marginLeft: ' 30Px', marginRight: '30Px' }}
              >
                <View className='weui-media-box__title font16' style={{ marginBottom: '40Px' }}>
                  <Text className='fl'>{detail.title}</Text>
                  <Text className='fr'>{detail.sell_price}元</Text>
                </View>
                <View className='weui-media-box__title font14'>
                  {util.validTime(detail.valid_type, detail.start_date, detail.expire_date, detail.valid_day)}
                </View>
              </View>
            </View>

            <View className={list.length === 0 ? 'mt10 mb10 hidden' : 'mt10 mb10 show'}>
              <Text className='fl ml10 font12'>卡内项目</Text>
              <Text className='fr mr10 font12'>总量</Text>
            </View>

            {list.map((item) => (
              <View
                className='weui-media-box weui-media-box_appmsg flex-row-between'
                hoverClass='weui-cell_active'
              >
                <View className='weui-media-box__bd weui-media-box__bd_in-appmsg'>
                  <View
                    className='weui-media-box__title font14'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                      <Text className='fl'>{item.item_name || '--'}</Text>
                      <Text className='fl'>{item.coupon_price
                        ? item.coupon_price + '元'
                        : '0.00元'}
                      </Text>
                    </View>
                    <View>
                      <Text className='fr'>{item.total_count}次</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='weui-panel__bd show'>
          <OfficialAccount />
        </View>
      </ScrollView>
    );
  }
}
