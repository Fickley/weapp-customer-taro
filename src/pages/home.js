import Taro, { Component } from '@tarojs/taro'
import {Swiper, SwiperItem, Navigator, View, Image, Text} from '@tarojs/components'

import './home.less'

export default class Home extends Component{

  config = {
    navigationBarTitleText: '水稻汽车'
  };

  constructor(props){
    super(props);
    this.state={}
  }

  render() {
    return(
      <View>
        <Swiper style={{marginBottom: '20Px'}}>
          <SwiperItem>
            <Image src={require('../images/icons/home_backdrop.jpeg')} style={{width: '100%', height: '100%'}} />
          </SwiperItem>
        </Swiper>

        <Navigator url='./store/index'>
          <View className='title-line'>
            <Image src={require('../images/icons/store.png')} mode='widthFix' className='centerIcon' />
            <Text className='font-default'>常去门店</Text>
          </View>
        </Navigator>

        <Navigator url='./activity/index'>
          <View className='title-line'>
            <Image src={require('../images/icons/activity.png')} mode='widthFix' className='centerIcon' />
            <Text className='font-default'>我的优惠券</Text>
          </View>
        </Navigator>

        <Navigator url='./me/consume'>
          <View className='title-line'>
            <Image src={require('../images/icons/consume.png')} mode='widthFix' className='centerIcon' />
            <Text className='font-default'>核销记录</Text>
          </View>
        </Navigator>

        <Navigator url='./me/index'>
          <View className='title-line'>
            <Image src={require('../images/icons/me.png')} mode='widthFix' className='centerIcon' />
            <Text className='font-default'>个人中心</Text>
          </View>
        </Navigator>
      </View>
    )
  }
}
