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

var _ViewUtil = require("../../utils/ViewUtil.js");

var _ViewUtil2 = _interopRequireDefault(_ViewUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Detail.__proto__ || Object.getPrototypeOf(Detail)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "loopArray0", "bannerUrl", "items", "detail", "page"], _this.config = {
      navigationBarTitleText: '活动详情'
    }, _this.onCall = function (phoneNumber) {
      _index2.default.makePhoneCall({ phoneNumber: phoneNumber });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Detail, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Detail.prototype.__proto__ || Object.getPrototypeOf(Detail.prototype), "_constructor", this).call(this, props);
      this.state = {
        page: 1,
        bannerUrl: '',
        detail: {},
        items: []
      };
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var id = this.$router.params.id;
      if (!id) {
        _index2.default.showToast({ title: '活动id丢失了', icon: 'none' });
        return;
      }

      var that = this;
      _index2.default.showLoading();
      _server2.default.get(_api2.default.activity.detail(id), function (data) {
        _index2.default.hideLoading();
        var detail = data.res.detail;

        detail.pay_price = parseInt(detail.pay_price) === 0 ? '免费' : detail.pay_price;
        that.setState({ detail: detail });
        that.getBannerUrl(detail.banner_pic);
      });

      _server2.default.get(_api2.default.activity.itemList(id), function (data) {
        that.setState({ items: data.res.list });
      });
    }
  }, {
    key: "getBannerUrl",
    value: function getBannerUrl(fileKey) {
      var that = this;
      _server2.default.get(_api2.default.common.file.getPublicPicFileUrl(fileKey), function (data) {
        that.setState({ bannerUrl: data.res.url });
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          bannerUrl = _state.bannerUrl,
          detail = _state.detail,
          items = _state.items;

      var anonymousState__temp = (0, _index.internal_inline_style)({ fontSize: '18Px', color: '#000', borderLeft: '4Px solid #FFAD01', marginLeft: '3Px' });
      var anonymousState__temp2 = _ViewUtil2.default.filterTime(detail.expire_date);
      var anonymousState__temp3 = _ViewUtil2.default.filterTime(detail.mtime);
      var anonymousState__temp4 = (0, _index.internal_inline_style)({ textAlign: 'left' });

      this.anonymousFunc0 = function () {
        return _this2.onCall(detail.company_phone);
      };

      var anonymousState__temp5 = (0, _index.internal_inline_style)({ fontSize: '18Px', color: '#000', borderLeft: '4Px solid #FFAD01', marginLeft: '3Px' });
      var loopArray0 = items.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp7 = _ViewUtil2.default.filterTime(item.$original.last_consume_time);
        return {
          $loopState__temp7: $loopState__temp7,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }]);

  return Detail;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = ["anonymousFunc0"], _temp2);
exports.default = Detail;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Detail, true));