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

var Consume = (_temp2 = _class = function (_BaseApp) {
  _inherits(Consume, _BaseApp);

  function Consume() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Consume);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Consume.__proto__ || Object.getPrototypeOf(Consume)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["list", "loading", "total", "loginViewVisible", "bindPhoneVisible", "page"], _this.config = {
      navigationBarTitleText: '核销列表'
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
          that.getConsumeList();
        }
      }, true);
    }, _this.getConsumeList = function () {
      var page = _this.state.page;

      var that = _this;
      _server2.default.get(_api2.default.activity.consumeList(page), function (data) {
        that.setState({ total: data.res.total, list: data.res.list });
      });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Consume, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Consume.prototype.__proto__ || Object.getPrototypeOf(Consume.prototype), "_constructor", this).call(this, props);
      this.state = {
        loginViewVisible: false,
        bindPhoneVisible: false,
        loading: false,
        page: 1,
        list: []
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;
      this.getUserInfo(function (userInfo) {
        // 1. 微信授权，获取用户信息
        if (!userInfo.avatar_url) {
          that.setState({ loginViewVisible: true });
          return false;
        }
      });

      that.getConsumeList();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          total = _state.total,
          loading = _state.loading,
          loginViewVisible = _state.loginViewVisible,
          bindPhoneVisible = _state.bindPhoneVisible;

      Object.assign(this.__state, {
        total: total
      });
      return this.__state;
    }
  }]);

  return Consume;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = ["onCancel", "onReloadUserInfo"], _temp2);
exports.default = Consume;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Consume, true));