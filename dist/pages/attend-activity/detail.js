"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _BaseApp2 = require("../../components/base/BaseApp.js");

var _BaseApp3 = _interopRequireDefault(_BaseApp2);

var _api = require("../../configs/api.js");

var _api2 = _interopRequireDefault(_api);

var _server = require("../../utils/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Detail = (_temp2 = _class = function (_BaseApp) {
  _inherits(Detail, _BaseApp);

  function Detail() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Detail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Detail.__proto__ || Object.getPrototypeOf(Detail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "anonymousState__temp6", "anonymousState__temp7", "anonymousState__temp10", "anonymousState__temp11", "anonymousState__temp12", "anonymousState__temp13", "anonymousState__temp14", "loopArray0", "loopArray1", "bannerImageUrl", "couponItems", "customerLimitCount", "companyFrontDoorPic", "isPreview", "loginViewVisible", "bindPhoneVisible", "detail", "countDownDay", "isAttended", "packageId", "countDownHour", "countDownMinute", "countDownSecond"], _this.config = {
      navigationBarTitleText: '活动详情'
    }, _this.contact = function () {
      _index2.default.makePhoneCall({ phoneNumber: _this.state.detail.contract_phone });
    }, _this.onPreview = function (urls) {
      _index2.default.previewImage({ urls: urls });
    }, _this.onCancel = function () {
      _this.setState({ loginViewVisible: false });
    }, _this.onReloadUserInfo = function () {
      var that = _this;
      _this.getUserInfo(function (userInfo) {
        // 2. 绑定手机号
        if (!userInfo.phone || userInfo.phone.length !== 11) {
          _index2.default.showToast({ title: '请先绑定手机号', icon: 'none' });
          that.setState({ bindPhoneVisible: true });
        } else {
          that.setState({ bindPhoneVisible: false });
          // 绑定成功后，自动调用参与活动
          _this.handleAttend();
        }
      }, true);
    }, _this.onUnload = function () {
      clearInterval(_this.timeInterval);
    }, _this.onShareAppMessage = function () {
      var _this$state = _this.state,
          detail = _this$state.detail,
          bannerImageUrl = _this$state.bannerImageUrl;

      return {
        title: detail.title,
        imageUrl: bannerImageUrl,
        path: "/pages/attend-activity/detail?activityId=" + detail._id
      };
    }, _this.handleAttend = function () {
      var _this$state2 = _this.state,
          detail = _this$state2.detail,
          customerLimitCount = _this$state2.customerLimitCount,
          packageId = _this$state2.packageId;

      var customerPackageId = Number(detail.customer_package_id);

      // 已参与，查看详情
      if (customerPackageId > 0) {
        _index2.default.navigateTo({ url: "../activity/detail?id=" + customerPackageId });
        return false;
      }

      if (customerLimitCount !== 0 && Number(detail.sell_counts) === customerLimitCount) {
        _index2.default.showToast({ title: '活动名额已满', icon: 'none' });
        return false;
      }

      var that = _this;
      _this.getUserInfo(function (userInfo) {
        // 1. 微信授权，获取用户信息
        if (!userInfo.avatar_url) {
          that.setState({ loginViewVisible: true });
          return false;
        }

        // 1. 免费参与
        if (Number(detail.sell_price) === 0) {
          _server2.default.post(_api2.default.activity.joinFree(), { package_id: packageId }, function () {
            _index2.default.navigateTo({
              url: "/pages/attend-activity/success?price=" + detail.sell_price + "&title=" + detail.title,
              success: function success() {
                that.getDetail(that.$router.params);
              }
            });
          }, function (errorMsg) {
            _index2.default.showToast({ title: "\u53C2\u4E0E\u5931\u8D25[" + errorMsg + "]", icon: 'none' });
          });
        } else {
          // 2. 付费参与
          _server2.default.get(_api2.default.activity.getPayParams(detail._id), function (data) {
            var payData = data.res.charge.credential.wx_lite;

            _index2.default.requestPayment({
              'timeStamp': payData.timeStamp,
              'nonceStr': payData.nonceStr,
              'package': payData.package,
              'signType': payData.signType,
              'paySign': payData.paySign,
              success: function success() {
                _index2.default.navigateTo({
                  url: "/pages/attend-activity/success?price=" + detail.sell_price + "&title=" + detail.title,
                  success: function success() {
                    that.getDetail(that.$router.params);
                  }
                });
              },
              fail: function fail() {
                _index2.default.showToast({ title: '支付取消', icon: 'none' });
              }
            });
          }, function (errorMsg) {
            _index2.default.showModal({
              title: '提示',
              content: errorMsg,
              showCancel: false,
              success: function success() {}
            });
          });
        }
      });
    }, _this.setTimeInterval = function (time) {
      var that = _this;

      _objectDestructuringEmpty(_this.state);

      that.timeInterval = setInterval(function () {
        var second = time;
        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length === 1) {
          dayStr = '0' + dayStr;
        } // 小时位
        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length === 1) {
          hrStr = '0' + hrStr;
        } // 分钟位
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length === 1) {
          minStr = '0' + minStr;
        } // 秒位
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length === 1) {
          secStr = '0' + secStr;
        }that.setState({
          countDownDay: dayStr,
          countDownHour: hrStr,
          countDownMinute: minStr,
          countDownSecond: secStr
        }, function () {
          time--;
          if (time < 0) {
            clearInterval(that.timeInterval);
            that.setState({
              countDownDay: '00',
              countDownHour: '00',
              countDownMinute: '00',
              countDownSecond: '00'
            });
          }
        });
      }, 1000);
    }, _this.getDetail = function (options) {
      var that = _this;
      var packageId = options.activityId;
      if (options.scene) {
        packageId = decodeURIComponent(options.scene);
      }

      that.setState({ packageId: packageId });

      _server2.default.get(_api2.default.enrollActivity.detail(packageId), function (data) {
        var detail = data.res.detail;

        that.setState({
          detail: detail,
          isAttended: Number(detail.customer_package_id) > 0,
          couponItems: JSON.parse(detail.coupon_items),
          customerLimitCount: Number(detail.customer_limit_count)
        });

        _server2.default.getPublicFileUrl(detail.banner_pic, function (url) {
          that.setState({ bannerImageUrl: url });
        });

        var storePicKeys = [];
        if (detail.company_icon_pic) {
          storePicKeys.push(detail.company_icon_pic);
        }
        if (detail.company_introduce_pics) {
          storePicKeys.push(detail.company_introduce_pics);
        }

        var pics = storePicKeys.join(',').split(',');
        if (pics.length > 0) {
          pics.forEach(function (item) {
            if (item.length > 0) {
              _server2.default.getPublicFileUrl(item, function (url) {
                that.state.companyFrontDoorPic.push(url);
              });
            }
          });
        }

        var totalSecond = Number(new Date(detail.expire_date).getTime() / 1000) - Date.parse(new Date()) / 1000;
        that.setTimeInterval(totalSecond);
      }, function (errorMsg) {
        _index2.default.showToast({ title: "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25[" + errorMsg + "]", icon: 'none' });
      });
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Detail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Detail.prototype.__proto__ || Object.getPrototypeOf(Detail.prototype), "_constructor", this).call(this, props);
      this.state = {
        isPreview: false,
        loginViewVisible: false,
        bindPhoneVisible: false,
        isAttended: false,
        detail: {},
        packageId: '',
        bannerImageUrl: '',
        customerLimitCount: '',
        companyFrontDoorPic: [],
        couponItems: [],
        countDownDay: 0,
        countDownHour: 0,
        countDownMinute: 0,
        countDownSecond: 0
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var that = this;
      var activityId = this.$router.params.activityId;
      var isPreview = this.$router.params.isPreview;

      if (!activityId) {
        _index2.default.showToast({ title: '活动参与，没有活动id', icon: 'none' });
        return;
      }

      // 预览模式，门店老板查看
      if (isPreview) {
        this.setState({ isPreview: isPreview });
      }
      this.getUserInfo(function () {
        that.getDetail(_this2.$router.params);
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          detail = _state.detail,
          bannerImageUrl = _state.bannerImageUrl,
          countDownDay = _state.countDownDay,
          countDownHour = _state.countDownHour,
          countDownMinute = _state.countDownMinute,
          countDownSecond = _state.countDownSecond,
          couponItems = _state.couponItems,
          isPreview = _state.isPreview,
          isAttended = _state.isAttended,
          customerLimitCount = _state.customerLimitCount,
          companyFrontDoorPic = _state.companyFrontDoorPic,
          loginViewVisible = _state.loginViewVisible,
          bindPhoneVisible = _state.bindPhoneVisible;

      var anonymousState__temp = (0, _index.internal_inline_style)({ position: 'relative', backgroundColor: detail.background_color });
      var anonymousState__temp2 = (0, _index.internal_inline_style)({ width: '100%' });
      var anonymousState__temp3 = "/images/icons/btn_forward@2x.png";
      var anonymousState__temp4 = "/images/icons/btn_call@2x.png";
      var anonymousState__temp5 = { countDownHour: countDownHour };
      var anonymousState__temp6 = { countDownMinute: countDownMinute };
      var anonymousState__temp7 = { countDownSecond: countDownSecond };
      var anonymousState__temp10 = (0, _index.internal_inline_style)({ display: 'flex' });
      var anonymousState__temp11 = (0, _index.internal_inline_style)({ display: 'flex' });
      var anonymousState__temp12 = (0, _index.internal_inline_style)({ display: 'flex' });
      var anonymousState__temp13 = (0, _index.internal_inline_style)({ display: 'flex' });
      var anonymousState__temp14 = Number(detail.is_show_company_info) === 0;
      var loopArray0 = couponItems.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp9 = (0, _index.internal_inline_style)({ height: '25Px', lineHeight: ' 25Px' });
        return {
          $loopState__temp9: $loopState__temp9,
          $original: item.$original
        };
      });
      var loopArray1 = companyFrontDoorPic.length !== 0 ? companyFrontDoorPic.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this3.anonymousFunc0Array[__index0] = function () {
          return _this3.onPreview(companyFrontDoorPic);
        };

        return {
          $original: item.$original
        };
      }) : [];
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        anonymousState__temp6: anonymousState__temp6,
        anonymousState__temp7: anonymousState__temp7,
        anonymousState__temp10: anonymousState__temp10,
        anonymousState__temp11: anonymousState__temp11,
        anonymousState__temp12: anonymousState__temp12,
        anonymousState__temp13: anonymousState__temp13,
        anonymousState__temp14: anonymousState__temp14,
        loopArray0: loopArray0,
        loopArray1: loopArray1
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(__index0, e) {
      ;
      this.anonymousFunc0Array[__index0] && this.anonymousFunc0Array[__index0](e);
    }
  }]);

  return Detail;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = ["contact", "anonymousFunc0", "handleAttend", "onCancel", "onReloadUserInfo"], _temp2);
exports.default = Detail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Detail, true));