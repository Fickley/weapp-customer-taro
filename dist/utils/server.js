"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _api = require("../configs/api.js");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = {
  get: function get(url, successCallback, failCallback) {
    _index2.default.request({
      url: url,
      header: {
        'cookie': ''
      },
      success: function success(response) {
        if (response.data.code === 1001) {
          // 在app启动时检查登录态
        }

        if (response.data.code === 0) {
          if (typeof successCallback === 'function') {
            successCallback(response.data);
          }
        } else if (typeof failCallback === 'function') {
          // 所有的错误回调函数，直接传递错误消息，用于提示
          failCallback(response.data.msg);
        }
      },
      fail: function fail(response) {
        // todo 添加超时配置，及相应的失败处理
        if (typeof failCallback === 'function') {
          failCallback(response.data.msg);
        }
      }
    });
  },
  post: function post(url, data, successCallback, failCallback) {
    _index2.default.request({
      url: url,
      method: 'POST',
      header: {
        'cookie': '',
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: function success(response) {
        if (response.data.code === 1001) {
          // 在app启动时检查登录态
        }
        if (response.data.code === 0) {
          if (typeof successCallback === 'function') {
            successCallback(response.data);
          }
        } else {
          if (typeof failCallback === 'function') {
            failCallback(response.data.msg);
          }
        }
      },
      fail: function fail(response) {
        if (typeof failCallback === 'function') {
          failCallback(response);
        }
      }
    });
  },


  /**
   * 获取公共文件下载地址
   * 需要传递thumbType的，可以直接调用接口获取
   * @param fileKey
   * @param cb
   */
  getPublicFileUrl: function getPublicFileUrl(fileKey, cb) {
    this.get(_api2.default.common.file.getPublicPicFileUrl(fileKey), function (data) {
      cb && cb(data.res.url);
    });
  }
};

exports.default = server;