"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _api = require("../../configs/api.js");

var _api2 = _interopRequireDefault(_api);

var _server = require("../../utils/server.js");

var _server2 = _interopRequireDefault(_server);

var _globalData = require("../../utils/globalData.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseApp = function (_Component) {
  _inherits(BaseApp, _Component);

  function BaseApp() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BaseApp);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BaseApp.__proto__ || Object.getPrototypeOf(BaseApp)).call.apply(_ref, [this].concat(args))), _this), _this.authLogin = function (cb) {
      _index2.default.login({
        success: function success(res) {
          if (res.code) {
            _index2.default.request({
              url: _api2.default.customer.authLogin(res.code),
              success: function success(item) {
                var data = item.data;
                var sessionId = data.res.cookies;
                // const expiredTime = +new Date() + (24 * 60 * 60 * 1000);

                // save to app instance
                (0, _globalData.set)('sessionId', sessionId);
                // setGlobalData('expiredTime', `${expiredTime}`);

                // save to storage
                _index2.default.setStorageSync('sessionId', sessionId);
                // Taro.setStorageSync('expiredTime', expiredTime);

                // that.setInterceptor(sessionId);

                if (typeof cb === 'function') {
                  cb();
                }
              }
            });
          }
        },
        fail: function fail() {
          _index2.default.showToast({ title: '微信登录失败', icon: 'none' });
        }
      });
    }, _this.updateUserInfo = function (cb) {
      var that = _this;
      _index2.default.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success: function success(res) {
          var userInfo = res.userInfo;
          var encryptedData = res.encryptedData;
          var iv = res.iv;

          var params = {
            nick_name: userInfo.nickName,
            gender: userInfo.gender,
            province: userInfo.province,
            city: userInfo.city,
            country: userInfo.country,
            avatar_url: userInfo.avatarUrl,
            encrypted_data: encryptedData,
            encrypt_iv: iv
          };
          _server2.default.post(_api2.default.customer.updateBaseInfo(), params, function () {
            that.getUserInfo(cb, true);
          });
        }
      });
    }, _this.getUserInfo = function (cb) {
      var isReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (Object.keys((0, _globalData.get)('userInfo')).length > 0 && !isReload) {
        cb && cb((0, _globalData.get)('userInfo'));
        return;
      }

      _index2.default.showLoading({ title: '加载中', mask: true });
      var that = _this;
      _server2.default.get(_api2.default.customer.getBaseInfo(), function (data) {
        _index2.default.hideLoading();
        var userInfo = data.res.customer_info;
        (0, _globalData.set)('userInfo', userInfo);
        cb && cb(userInfo);
      }, function () {
        _index2.default.hideLoading();
        that.authLogin();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * 微信登录并换取数据凭证
   * @param cb 需要登录后执行的回调函数
   */


  // isReload: 是否需要从服务端重新获取


  return BaseApp;
}(_index.Component);

exports.default = BaseApp;