const globalData = {
  sessionId: '',
  expiredTime: '',
  userInfo: {}
};

export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
