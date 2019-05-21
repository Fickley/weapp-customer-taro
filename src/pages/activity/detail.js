import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import api from '../../configs/api';

import server from '../../utils/server';
import util from '../../utils/ViewUtil'

import './index.less';

export default class Detail extends BaseApp {

  config = {
    navigationBarTitleText: '活动详情'
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      bannerUrl: '',
      detail: {},
      items: []
    };
  }

  componentWillMount () {
    const id = this.$router.params.id;
    if (!id) {
      Taro.showToast({ title: '活动id丢失了', icon: 'none' });
      return
    }

    const that = this;
    Taro.showLoading();
    server.get(api.activity.detail(id), data => {
      Taro.hideLoading();
      const { detail } = data.res;
      detail.pay_price = parseInt(detail.pay_price) === 0 ? '免费' : detail.pay_price;
      that.setState({detail});
      that.getBannerUrl(detail.banner_pic)
    });

    server.get(api.activity.itemList(id), data => {
      that.setState({items: data.res.list});
    })
  }

  onCall = (phoneNumber) => {
    Taro.makePhoneCall({ phoneNumber: phoneNumber })
  };

  getBannerUrl(fileKey) {
    const that = this;
    server.get(api.common.file.getPublicPicFileUrl(fileKey), data => {
      that.setState({bannerUrl: data.res.url});
    })
  }

  render() {
    const { bannerUrl, detail, items } = this.state;
    return (
      <View>
        <Image src={bannerUrl} className='banner-image' mode='widthFix' />
        <View
          className='weui-cells__title'
          style={{fontSize: '18Px', color:'#000', borderLeft: '4Px solid #FFAD01', marginLeft: '3Px'}}
        >
          基本信息
        </View>
        <View className='weui-cells weui-cells_after-title'>
          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>活动名称</View>
            </View>
            <View className='weui-cell__ft'>{detail.package_title}</View>
          </View>
          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>价格</View>
            </View>
            <View className='weui-cell__ft'>{detail.pay_price}</View>
          </View>
          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>有效期至</View>
            </View>
            <View className='weui-cell__ft'>{util.filterTime(detail.expire_date)}</View>
          </View>

          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>参与时间</View>
            </View>
            <View className='weui-cell__ft'>{util.filterTime(detail.mtime)}</View>
          </View>
          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>参与门店</View>
            </View>
            <view className='weui-cell__ft'>{detail.company_name || ''}</view>
          </View>
          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>门店地址</View>
            </View>
            <View className='weui-cell__ft' style={{textAlign: 'left'}}>{detail.company_address}</View>
          </View>
          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>门店电话</View>
            </View>
            <View className='weui-cell__ft' onClick={()=>this.onCall(detail.company_phone)}>
              {detail.company_phone || ''}
            </View>
          </View>

          <View className='cell'>
            <View className='weui-cell__hd'>
              <View className='weui-label weui-label_sm'>备注</View>
            </View>
            <View className='weui-cell__ft'>{detail.remark}</View>
          </View>
        </View>

        <View
          className='weui-cells__title'
          style={{fontSize: '18Px', color: '#000', borderLeft: '4Px solid #FFAD01', marginLeft: '3Px'}}
        >
          项目
        </View>
        <View className='weui-cells weui-cells_after-title'>
         {items.map((item)=>(
           <View taroKey={item._id} className='weui-media-box weui-media-box_appmsg'>
             <View className='weui-media-box__bd weui-media-box__bd_in-appmsg'>
               <View className='weui-media-box__title mb10'>{item.maintain_item_name}</View>
               <View className='weui-media-box__desc mb5'>
                 <Text>总计：{item.total_count}次 剩余：{item.remain_count}次</Text>
               </View>
               <View className='weui-media-box__desc'>
                 <Text>最后核销时间：</Text>
                 <Text className='pull-right'>{util.filterTime(item.last_consume_time)}</Text>
               </View>
             </View>
           </View>
         ))}
        </View>
      </View>
    );
  }
}
