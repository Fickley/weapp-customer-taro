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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Success = (_temp2 = _class = function (_BaseApp) {
  _inherits(Success, _BaseApp);

  function Success() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Success);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Success.__proto__ || Object.getPrototypeOf(Success)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "title", "price", "customerName", "customerPhone", "cookies"], _this.config = {
      navigationBarTitleText: '参与成功'
    }, _this.linkAttendList = function () {
      _index2.default.navigateTo({ url: '/pages/activity/index' });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Success, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Success.prototype.__proto__ || Object.getPrototypeOf(Success.prototype), "_constructor", this).call(this, props);
      this.state = {
        cookies: '',
        price: '',
        title: '',
        customerName: '',
        customerPhone: ''
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;
      var price = this.$router.params.price;
      var title = this.$router.params.title;
      this.setState({ price: price, title: title });
      _server2.default.get(_api2.default.customer.getBaseInfo(), function (data) {
        var customerName = data.res.customer_info.nick_name;
        var customerPhone = data.res.customer_info.phone;
        that.setState({ customerName: customerName, customerPhone: customerPhone });
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          title = _state.title,
          price = _state.price,
          customerName = _state.customerName,
          customerPhone = _state.customerPhone;

      var anonymousState__temp = (0, _index.internal_inline_style)({ textAlign: 'center', margin: '30Px 0Px' });
      var anonymousState__temp2 = (0, _index.internal_inline_style)({ width: '200Px', textAlign: 'right' });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2
      });
      return this.__state;
    }
  }]);

  return Success;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = ["linkAttendList"], _temp2);
exports.default = Success;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Success, true));