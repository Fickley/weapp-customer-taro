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

var _ViewUtil = require("../../utils/ViewUtil.js");

var _ViewUtil2 = _interopRequireDefault(_ViewUtil);

var _api = require("../../configs/api.js");

var _api2 = _interopRequireDefault(_api);

var _server = require("../../utils/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noData = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box'
};

var couponCards = (_temp2 = _class = function (_BaseApp) {
  _inherits(couponCards, _BaseApp);

  function couponCards() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, couponCards);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = couponCards.__proto__ || Object.getPrototypeOf(couponCards)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp3", "loopArray0", "list", "companyId"], _this.config = {
      navigationBarTitleText: '套餐卡列表'
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(couponCards, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(couponCards.prototype.__proto__ || Object.getPrototypeOf(couponCards.prototype), "_constructor", this).call(this, props);
      this.state = {
        list: [],
        companyId: ''
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var companyId = this.$router.params.id;
      this.setState({ companyId: companyId });
      this.getCoupons(companyId);
    }
  }, {
    key: "getCoupons",
    value: function getCoupons(companyId) {
      var that = this;
      _index2.default.showLoading({ title: '加载中', mask: true });
      _server2.default.get(_api2.default.store.couponList(companyId), function (data) {
        _index2.default.hideLoading();
        that.setState({ list: data.res.list });
      }, function (errorMsg) {
        _index2.default.hideLoading();
        _index2.default.showToast({ title: "\u52A0\u8F7D\u5931\u8D25[" + errorMsg + "]", icon: 'none' });
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var list = this.__state.list;

      var anonymousState__temp3 = list.length < 1 ? (0, _index.internal_inline_style)(noData) : null;
      var loopArray0 = list.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = _ViewUtil2.default.validTime(item.$original.valid_type, item.$original.start_date, item.$original.expire_date, item.$original.valid_day);
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }]);

  return couponCards;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = [], _temp2);
exports.default = couponCards;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(couponCards, true));