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

var Index = (_temp2 = _class = function (_BaseApp) {
  _inherits(Index, _BaseApp);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "list", "loginViewVisible", "bindPhoneVisible"], _this.config = {
      navigationBarTitleText: '常去门店'
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
          that.getLocation();
        }
      }, true);
    }, _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Index.prototype.__proto__ || Object.getPrototypeOf(Index.prototype), "_constructor", this).call(this, props);
      this.state = {
        loginViewVisible: false,
        bindPhoneVisible: false,
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
      that.getLocation();
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      var that = this;
      _index2.default.getLocation({
        type: 'wgs84',
        success: function success(res) {
          that.getStores(res.longitude + "," + res.latitude, '');
        }
      });
    }
  }, {
    key: "getStores",
    value: function getStores(location, id) {
      var that = this;
      _index2.default.showLoading({ title: '加载中', mask: true });
      _server2.default.get(_api2.default.store.list(location, id), function (data) {
        _index2.default.hideLoading();
        var list = data.res.list;

        var index = 0;

        list.forEach(function (item) {
          _server2.default.getPublicFileUrl(item.company_info.icon_pic, function (url) {
            index += 1;
            item.icon_pic = url;
            if (list.length === index) {
              that.setState({ list: list });
            }
          }, function () {
            index += 1;
            item.icon_pic = '../../images/icons/online-store.png';
            if (list.length === index) {
              that.setState({ list: list });
            }
          });
        });
      }, function () {
        _index2.default.hideLoading();
        _index2.default.showToast({ title: '加载失败', icon: 'none' });
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
          list = _state.list,
          loginViewVisible = _state.loginViewVisible,
          bindPhoneVisible = _state.bindPhoneVisible;

      var loopArray0 = list.map(function (item) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = (0, _index.internal_inline_style)({ width: '70Px', height: '85Px', lineHeight: '85Px' });
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0
      });
      return this.__state;
    }
  }]);

  return Index;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = ["onCancel", "onReloadUserInfo"], _temp2);
exports.default = Index;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Index, true));