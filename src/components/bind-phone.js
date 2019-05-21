import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Input } from '@tarojs/components';

import api from '../configs/api'

import server from '../utils/server'
import validator from '../utils/validator'

import './bind-phone.less';
import '../styles/app.less'

export default class BindPhone extends Component {
  static defaultProps = {
    title: '绑定手机号码',
    visible: false,
    maskClosable: 'true',
  };

  constructor(props) {
    super(props);
    this.state = {
      isFetchingCode: false,
      isSubmitting: false,
      phone: '',
      code: '',
      codeId: '',
      time: 60,
    };
  }

  onWrapperClick() {
    if (this.maskClosable === 'true') {
      this.props.onCancel()
    }
  }

  onModalContentClick = () => {
    return false
  };

  onPhoneChange = (e) => {
    this.setState({ phone: e.target.value })
  };

  onCodeChange = (e) => {
    this.setState({ code: e.target.value })
  };

  handleGetCode = () => {
    const { phone, codeId, isFetchingCode } = this.state;
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return
    }
    if (!validator.isPhone(phone)) {
      Taro.showToast({ title: '手机号码格式错误', icon: 'none' });
      return
    }

    if (!isFetchingCode && !codeId) {
      this.setState({isFetchingCode: true},()=>{
        this.codeInterval = setInterval(() => this.tick(), 1000);

        const that = this;
        Taro.showLoading({ title: '加载中', mask: true });
        server.post(api.customer.getVerifyCode(), { phone: phone }, (data) => {
          Taro.hideLoading();
          Taro.showToast({ title: '验证码已发送', icon: 'none' });
          that.setState({codeId: data.res.sms._id});
        }, (errorMsg) => {
          Taro.hideLoading();
          Taro.showToast({ title: `验证码获取失败[${errorMsg}]`, icon: 'none' })
        })
      });
    }
  };

  handleBindWXPhoneNumber = (e) => {
    const { onReloadUserInfo } = this.props;
    // 同意授权绑定微信手机号
    const { iv, encryptedData } = e.detail;
    if (iv && encryptedData) {
      this.setState({isSubmitting: true});

      const that = this;
      Taro.showLoading({ title: '加载中', mask: true });
      server.post(api.customer.bindWXPhoneNumber(), {
        encrypted_data: encryptedData,
        encrypt_iv: iv
      }, () => {
        Taro.hideLoading();
        that.setState({isSubmitting: false});
        Taro.showToast({ title: '绑定成功' });
        onReloadUserInfo()
      }, (errorMsg) => {
        Taro.hideLoading();
        that.setState({isSubmitting: false});
        Taro.showModal({
          title: '绑定微信手机号失败',
          content: errorMsg,
          showCancel: false
        })
      })
    }
  };

  handleSubmit = () => {
    const { phone, codeId, code } = this.state;
    const { onReloadUserInfo } = this.props;
    if (!phone && !validator.isPhone(phone)) {
      Taro.showToast({ title: '手机号码错误', icon: 'none' });
      return
    }
    if (!codeId) {
      Taro.showToast({ title: '请获取验证码', icon: 'none' });
      return
    }

    Taro.showLoading({ title: '加载中', mask: true });
    server.post(api.customer.bindPhoneNumber(), {
      phone: phone,
      code: code,
      code_id: codeId
    }, () => {
      Taro.hideLoading();
      this.resetTick();
      onReloadUserInfo()
    }, (errorMsg) => {
      this.resetTick();
      Taro.hideLoading();
      Taro.showModal({
        title: '绑定失败',
        content: errorMsg,
        showCancel: false
      })
    })
  };

  tick = () => {
    var {time} = this.state;
    if (time > 0) {
      time -= 1;
      this.setState({time});
    } else {
      this.resetTick()
    }
  };

  resetTick = () => {
    clearInterval(this.codeInterval);
    this.setState({time: 60, isFetchingCode: false});
  };

  render() {

    const { title, visible } = this.props;

    const { time, isFetchingCode } = this.state;

    return (
      visible &&
      <View className='modal-wrapper' onClick={this.onWrapperClick}>
        <View className='modal-content' onClick={this.onModalContentClick}>
          <View className='modal-title'>{ title }</View>
          <View className='modal-body'>
            <Input
              type='number'
              maxLength='11'
              className='input-line mt10'
              placeholderClass='input-placeholder'
              placeholder='请输入手机号'
              onInput={this.onPhoneChange}
            />

            <View className='code-wrapper'>
              <Input
                type='number'
                maxLength='6'
                className='input-line'
                placeholderClass='input-placeholder'
                placeholder='请输入验证码'
                onInput={this.onCodeChange}
              />
              {isFetchingCode ?
                <View
                  className='btn-code-text disabled'
                  onClick={this.handleGetCode}
                >
                  重新获取({ time }s)
                </View>:
                <View
                  className='btn-code-text'
                  onClick={this.handleGetCode}
                >
                  获取验证码
                </View>
              }
            </View>

            <Button
              className='btn btn-wx'
              openType='getPhoneNumber'
              onGetPhoneNumber={this.handleBindWXPhoneNumber}
            >
              <Text className='iconfont icon-wechat-fill'> 绑定微信手机号</Text>
            </Button>
          </View>

          <View className='modal-footer'>
            <Button className='btn btn-confirm' onClick={this.handleSubmit}>确定</Button>
          </View>
        </View>
      </View>
    );
  }
}

