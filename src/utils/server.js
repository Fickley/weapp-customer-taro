import Taro from '@tarojs/taro'
import api from '../configs/api'

const server = {
  get(url, successCallback, failCallback) {
    Taro.request({
      url: url,
      header: {
        'cookie': ''
      },
      success: response => {
        if (response.data.code === 1001) {
          // 在app启动时检查登录态
        }

        if (response.data.code === 0) {
          if (typeof successCallback === 'function') {
            successCallback(response.data)
          }
        } else if (typeof failCallback === 'function') {
          // 所有的错误回调函数，直接传递错误消息，用于提示
          failCallback(response.data.msg)
        }
      },
      fail: response => {
        // todo 添加超时配置，及相应的失败处理
        if (typeof failCallback === 'function') {
          failCallback(response.data.msg)
        }
      }
    })
  },

  post(url, data, successCallback, failCallback) {
    Taro.request({
      url,
      method: 'POST',
      header: {
        'cookie': '',
        'content-type': 'application/x-www-form-urlencoded'
      },
      data,
      success: response => {
        if (response.data.code === 1001) {
          // 在app启动时检查登录态
        }
        if (response.data.code === 0) {
          if (typeof successCallback === 'function') {
            successCallback(response.data)
          }
        } else {
          if (typeof failCallback === 'function') {
            failCallback(response.data.msg)
          }
        }
      },
      fail: response => {
        if (typeof failCallback === 'function') {
          failCallback(response)
        }
      }
    })
  },

  /**
   * 获取公共文件下载地址
   * 需要传递thumbType的，可以直接调用接口获取
   * @param fileKey
   * @param cb
   */
  getPublicFileUrl(fileKey, cb) {
    this.get(api.common.file.getPublicPicFileUrl(fileKey), data => {
      cb && cb(data.res.url)
    })
  }
}

export default server
