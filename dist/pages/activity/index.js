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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "key", "list", "loading", "isHideOfficialAccount", "loginViewVisible", "bindPhoneVisible", "isRequested", "page", "total"], _this.config = {
      navigationBarTitleText: '我的优惠劵'
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
          // 解决换绑手机号后，切换数据不更新的问题
          if (that.total === 0) {
            setTimeout(function () {
              return that.getActivities(that.state.page);
            }, 2000);
          }
        }
      }, true);
    }, _this.linkToDetail = function (id) {
      _index2.default.navigateTo({ url: "/pages/activity/detail?id=" + id });
    }, _this.clearInput = function () {
      _this.setState({ key: '' });
      _this.getActivities(1);
    }, _this.inputTyping = function (e) {
      var key = e.target.value;
      _this.setState({ key: key });
      _this.getActivities(1, key);
    }, _this.onReachBottom = function () {
      var that = _this;

      if (_this.state.list.length < _this.state.total) {
        that.setState({ loading: true, page: that.state.page + 1 }, function () {
          _server2.default.get(_api2.default.activity.list(that.state.page), function (data) {
            var list = data.res.list;


            that.setState({ list: that.list.concat(list), loading: false });

            list.forEach(function (item) {
              _server2.default.getPublicFileUrl(item.banner_pic, function (url) {
                item.banner_url = url;
              });
            });
          });
        });
      }
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Index.prototype.__proto__ || Object.getPrototypeOf(Index.prototype), "_constructor", this).call(this, props);
      this.state = {
        loginViewVisible: false,
        bindPhoneVisible: false,
        loading: false,
        isRequested: false,
        isHideOfficialAccount: false,
        key: '',
        page: 1,
        total: 0,
        list: []
      };
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var that = this;
      setTimeout(function () {
        that.getUserInfo(function (userInfo) {
          that.setState({ isHideOfficialAccount: userInfo.is_join_wechat_customer });
        });
      }, 1000);
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      var _this2 = this;

      var that = this;
      var _state = this.state,
          page = _state.page,
          total = _state.total;

      this.getUserInfo(function (userInfo) {
        // 1. 微信授权，获取用户信息
        if (!userInfo.avatar_url) {
          that.setState({ loginViewVisible: true });
          return false;
        }
      });
      // 解决换绑手机号后，切换数据不更新的问题
      if (total === 0) {
        setTimeout(function () {
          return _this2.getActivities(page, '');
        }, 2000);
      }
    }
  }, {
    key: "getActivities",
    value: function getActivities(page, key) {
      var that = this;
      _server2.default.get(_api2.default.activity.list(page, key), function (data) {
        var _data$res = data.res,
            list = _data$res.list,
            total = _data$res.total;

        var index = 0;
        list.forEach(function (item) {
          _server2.default.getPublicFileUrl(item.banner_pic, function (url) {
            item.banner_url = url;
            index += 1;
            if (index === list.length) {
              that.setState({ list: list, total: total, isRequested: true });
            }
          });
        });
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

      var _state2 = this.__state,
          key = _state2.key,
          list = _state2.list,
          loading = _state2.loading,
          isHideOfficialAccount = _state2.isHideOfficialAccount,
          loginViewVisible = _state2.loginViewVisible,
          bindPhoneVisible = _state2.bindPhoneVisible;

      var loopArray0 = list.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this3.anonymousFunc0Array[__index0] = function () {
          return _this3.linkToDetail(item.$original._id);
        };

        var $loopState__temp2 = (0, _index.internal_inline_style)({ width: '60Px', height: '60Px' });
        var $loopState__temp4 = (0, _index.internal_inline_style)({ marginTop: '5Px' });
        var $loopState__temp6 = (0, _index.internal_inline_style)({ marginTop: '5Px' });
        return {
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4,
          $loopState__temp6: $loopState__temp6,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0
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

  return Index;
}(_BaseApp3.default), _class.properties = {}, _class.$$events = ["inputTyping", "clearInput", "anonymousFunc0", "onCancel", "onReloadUserInfo"], _temp2);
exports.default = Index;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Index, true));