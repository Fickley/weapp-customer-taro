'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
var globalData = {
  sessionId: '',
  expiredTime: '',
  userInfo: {}
};

function set(key, val) {
  globalData[key] = val;
}

function get(key) {
  return globalData[key];
}