"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("./npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _BaseApp2 = require("./components/base/BaseApp.js");

var _BaseApp3 = _interopRequireDefault(_BaseApp2);

var _globalData = require("./utils/globalData.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

var _App = function (_BaseApp) {
  _inherits(_App, _BaseApp);

  function _App(props) {
    _classCallCheck(this, _App);

    var _this = _possibleConstructorReturn(this, (_App.__proto__ || Object.getPrototypeOf(_App)).call(this, props));

    _this.config = {
      pages: ['pages/home', 'pages/me/index', 'pages/me/consume', 'pages/activity/index', 'pages/activity/detail', 'pages/attend-activity/success', 'pages/attend-activity/detail', 'pages/store/index', 'pages/store/coupon-cards', 'pages/store/coupon-card-detail'],
      window: {
        backgroundTextStyle: 'light',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: '我的活动',
        navigationBarBackgroundColor: '#FFAD01',
        backgroundColorTop: '#FFAD01',
        backgroundColorBottom: '#FFAD01'
      },
      permission: {
        'scope.userLocation': {
          desc: '您的位置信息将用于展示您附近的优惠活动'
        }
      }
    };
    return _this;
  }

  _createClass(_App, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      _index2.default.addInterceptor(function (chain) {
        var requestParams = chain.requestParams;
        if (requestParams && requestParams.header) {
          var cookie = '';
          if ((0, _globalData.get)('sessionId')) {
            cookie = (0, _globalData.get)('sessionId');
          } else if (_index2.default.getStorageSync('sessionId')) {
            cookie = _index2.default.getStorageSync('sessionId');
          }
          requestParams.header.cookie = cookie;
        }
        return chain.proceed(requestParams).then(function (res) {
          return res;
        });
      });

      this.getUserInfo();
    }
  }, {
    key: "_createData",
    value: function _createData() {}
  }]);

  return _App;
}(_BaseApp3.default);

exports.default = _App;

App(require('./npm/@tarojs/taro-weapp/index.js').default.createApp(_App));
_index2.default.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});