import Taro from '@tarojs/taro';
import { View, Navigator, ScrollView } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import util from '../../utils/ViewUtil'

import api from '../../configs/api';

import server from '../../utils/server';

const noData = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box'
};

export default class couponCards extends BaseApp {

  config = {
    navigationBarTitleText: '套餐卡列表'
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      companyId: ''
    };
  }

  componentDidMount() {
    const companyId = this.$router.params.id;
    this.setState({companyId});
    this.getCoupons(companyId)
  }

  getCoupons(companyId) {
    const that = this;
    Taro.showLoading({ title: '加载中', mask: true });
    server.get(api.store.couponList(companyId), data => {
      Taro.hideLoading();
      that.setState({list: data.res.list})
    }, (errorMsg) => {
      Taro.hideLoading();
      Taro.showToast({ title: `加载失败[${errorMsg}]`, icon: 'none' })
    })
  }

  render() {
    const { list } = this.state;
    return (
      <ScrollView>
        <View className='weui-panel weui-panel_access'>
          <View className='weui-panel__bd'>
            {list.map((item)=>(
              <Navigator
                url='/pages/store/coupon-card-detail?companyId={{companyId}}&cardId={{item._id}}'
                className='weui-media-box weui-media-box_appmsg'
                hoverClass='weui-cell_active'
              >
                <View className='weui-media-box__bd weui-media-box__bd_in-appmsg'>
                  <View className='weui-media-box__title'>{ item.title }</View>
                  <View className='weui-media-box__desc'>售价：{ item.sell_price }</View>

                  <View className='weui-media-box__desc'>
                    {
                      util.validTime(item.valid_type, item.start_date, item.expire_date, item.valid_day)
                    }
                  </View>
                </View>

                <View className='weui-cell__ft weui-cell__ft_in-access' />
              </Navigator>
            ))}
            {list.length < 1 &&
            <View className='flex-row-center' style={noData}>
              <View className='font16 fontGray'>暂无套餐卡</View>
            </View>}
          </View>
        </View>
      </ScrollView>
    );
  }
}
