"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _api = require("../configs/api.js");

var _api2 = _interopRequireDefault(_api);

var _server = require("../utils/server.js");

var _server2 = _interopRequireDefault(_server);

var _validator = require("../utils/validator.js");

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BindPhone = (_temp2 = _class = function (_BaseComponent) {
  _inherits(BindPhone, _BaseComponent);

  function BindPhone() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BindPhone);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BindPhone.__proto__ || Object.getPrototypeOf(BindPhone)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["visible", "isFetchingCode", "title", "time", "isSubmitting", "phone", "code", "codeId", "__fn_onCancel"], _this.onModalContentClick = function () {
      return false;
    }, _this.onPhoneChange = function (e) {
      _this.setState({ phone: e.target.value });
    }, _this.onCodeChange = function (e) {
      _this.setState({ code: e.target.value });
    }, _this.handleGetCode = function () {
      var _this$state = _this.state,
          phone = _this$state.phone,
          codeId = _this$state.codeId,
          isFetchingCode = _this$state.isFetchingCode;

      if (!phone) {
        _index2.default.showToast({ title: '请输入手机号', icon: 'none' });
        return;
      }
      if (!_validator2.default.isPhone(phone)) {
        _index2.default.showToast({ title: '手机号码格式错误', icon: 'none' });
        return;
      }

      if (!isFetchingCode && !codeId) {
        _this.setState({ isFetchingCode: true }, function () {
          _this.codeInterval = setInterval(function () {
            return _this.tick();
          }, 1000);

          var that = _this;
          _index2.default.showLoading({ title: '加载中', mask: true });
          _server2.default.post(_api2.default.customer.getVerifyCode(), { phone: phone }, function (data) {
            _index2.default.hideLoading();
            _index2.default.showToast({ title: '验证码已发送', icon: 'none' });
            that.setState({ codeId: data.res.sms._id });
          }, function (errorMsg) {
            _index2.default.hideLoading();
            _index2.default.showToast({ title: "\u9A8C\u8BC1\u7801\u83B7\u53D6\u5931\u8D25[" + errorMsg + "]", icon: 'none' });
          });
        });
      }
    }, _this.handleBindWXPhoneNumber = function (e) {
      var onReloadUserInfo = _this.props.onReloadUserInfo;
      // 同意授权绑定微信手机号

      var _e$detail = e.detail,
          iv = _e$detail.iv,
          encryptedData = _e$detail.encryptedData;

      if (iv && encryptedData) {
        _this.setState({ isSubmitting: true });

        var that = _this;
        _index2.default.showLoading({ title: '加载中', mask: true });
        _server2.default.post(_api2.default.customer.bindWXPhoneNumber(), {
          encrypted_data: encryptedData,
          encrypt_iv: iv
        }, function () {
          _index2.default.hideLoading();
          that.setState({ isSubmitting: false });
          _index2.default.showToast({ title: '绑定成功' });
          _this.__triggerPropsFn("onReloadUserInfo", [null].concat([]));
        }, function (errorMsg) {
          _index2.default.hideLoading();
          that.setState({ isSubmitting: false });
          _index2.default.showModal({
            title: '绑定微信手机号失败',
            content: errorMsg,
            showCancel: false
          });
        });
      }
    }, _this.handleSubmit = function () {
      var _this$state2 = _this.state,
          phone = _this$state2.phone,
          codeId = _this$state2.codeId,
          code = _this$state2.code;
      var onReloadUserInfo = _this.props.onReloadUserInfo;

      if (!phone && !_validator2.default.isPhone(phone)) {
        _index2.default.showToast({ title: '手机号码错误', icon: 'none' });
        return;
      }
      if (!codeId) {
        _index2.default.showToast({ title: '请获取验证码', icon: 'none' });
        return;
      }

      _index2.default.showLoading({ title: '加载中', mask: true });
      _server2.default.post(_api2.default.customer.bindPhoneNumber(), {
        phone: phone,
        code: code,
        code_id: codeId
      }, function () {
        _index2.default.hideLoading();
        _this.resetTick();
        _this.__triggerPropsFn("onReloadUserInfo", [null].concat([]));
      }, function (errorMsg) {
        _this.resetTick();
        _index2.default.hideLoading();
        _index2.default.showModal({
          title: '绑定失败',
          content: errorMsg,
          showCancel: false
        });
      });
    }, _this.tick = function () {
      var time = _this.state.time;

      if (time > 0) {
        time -= 1;
        _this.setState({ time: time });
      } else {
        _this.resetTick();
      }
    }, _this.resetTick = function () {
      clearInterval(_this.codeInterval);
      _this.setState({ time: 60, isFetchingCode: false });
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BindPhone, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(BindPhone.prototype.__proto__ || Object.getPrototypeOf(BindPhone.prototype), "_constructor", this).call(this, props);
      this.state = {
        isFetchingCode: false,
        isSubmitting: false,
        phone: '',
        code: '',
        codeId: '',
        time: 60
      };
    }
  }, {
    key: "onWrapperClick",
    value: function onWrapperClick() {
      if (this.maskClosable === 'true') {
        this.__triggerPropsFn("onCancel", [null].concat([]));
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      ;

      var _props = this.__props,
          title = _props.title,
          visible = _props.visible;
      var _state = this.__state,
          time = _state.time,
          isFetchingCode = _state.isFetchingCode;


      Object.assign(this.__state, {
        visible: visible,
        title: title
      });
      return this.__state;
    }
  }]);

  return BindPhone;
}(_index.Component), _class.properties = {
  "__fn_onCancel": {
    "type": null,
    "value": null
  },
  "onReloadUserInfo": {
    "type": null,
    "value": null
  },
  "__fn_onReloadUserInfo": {
    "type": null,
    "value": null
  },
  "title": {
    "type": null,
    "value": null
  },
  "visible": {
    "type": null,
    "value": null
  }
}, _class.$$events = ["onWrapperClick", "onModalContentClick", "onPhoneChange", "onCodeChange", "handleGetCode", "handleBindWXPhoneNumber", "handleSubmit"], _class.defaultProps = {
  title: '绑定手机号码',
  visible: false,
  maskClosable: 'true'
}, _temp2);
exports.default = BindPhone;

Component(require('../npm/@tarojs/taro-weapp/index.js').default.createComponent(BindPhone));