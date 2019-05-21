import Taro from '@tarojs/taro';
import { View, Icon, Text, Button } from '@tarojs/components';

import BaseApp from '../../components/base/BaseApp';

import api from '../../configs/api';

import server from '../../utils/server';

import './success.less';

export default class Success extends BaseApp {

  config = {
    navigationBarTitleText: '参与成功'
  };

  constructor(props) {
    super(props);
    this.state = {
      cookies: '',
      price: '',
      title: '',
      customerName: '',
      customerPhone: ''
    };
  }

  componentDidMount() {
    let that = this;
    const price = this.$router.params.price;
    const title = this.$router.params.title;
    this.setState({price, title});
    server.get(api.customer.getBaseInfo(), data => {
      const customerName = data.res.customer_info.nick_name;
      const customerPhone = data.res.customer_info.phone;
      that.setState({customerName, customerPhone});
    })
  }

  linkAttendList = () => {
    Taro.navigateTo({ url: '/pages/activity/index' })
  };

  render() {
    const { title, price, customerName, customerPhone } = this.state;
    return (
      <View>
        <View style={{textAlign: 'center', margin: '30Px 0Px'}}>
          <View className='center'>
            <Icon type='success' size='70' />
          </View>
          <Text>付款成功</Text>
        </View>
        <View>
          <View className='list clear'>
            <Text className='font-default fl'>活动名称</Text>
            <Text className='small-font fr inaLine' style={{width: '200Px', textAlign: 'right'}}>{title}</Text>
          </View>

          <View className='list clear'>
            <Text className='font-default fl'>付款金额</Text>
            <Text className='small-font fr'>￥{price}</Text>
          </View>

          <View className='list clear'>
            <Text className='font-default fl'>参与姓名</Text>
            <Text className='small-font fr'>{customerName}</Text>
          </View>

          <View className='list clear'>
            <Text className='font-default fl'>参与号码</Text>
            <Text className='small-font fr'>{customerPhone}</Text>
          </View>
          <View className='ml10'>
            <Text className='small-font'>
              注：到店后出示您的手机号码即可进行礼包消费
            </Text>
          </View>
        </View>
        <Button className='littleYellow' onClick={this.linkAttendList}>查询参与活动</Button>
      </View>
    )
  }
}
