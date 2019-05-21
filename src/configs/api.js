const env = 'dev' // 环境 dev || prod

let baseHost = 'https://api.dev1.shuidao.yunbed.com'
if (env === 'prod') {
  baseHost = 'https://api.shuidao.com'
}

const API_COMMON = `${baseHost}/common`
const API_HOST = `${baseHost}/weapp_customer`

const Page = {
  skip: 0,
  limit: 10
}

const API = {
  common: {
    file: {
      /**
       * 0：不压缩
       * 1：74*74
       * 2：200*200
       * 3：容量压缩50%
       * @param fileName
       * @param thumbType
       * @returns {string}
       */
      getPublicPicFileUrl(fileName, thumbType = 0) {
        return `${API_COMMON}/file/get-public-pic-url?file_name=${fileName}&thumb_type=${thumbType}`
      }
    }
  },
  customer: {
    authLogin(code) {
      return `${API_HOST}/customer/auth-login?code=${code}&invite_id`
    },
    getBaseInfo() {
      return `${API_HOST}/customer/get-base-info`
    },
    updateBaseInfo() {
      return `${API_HOST}/customer/update-base-info`
    },

    getVerifyCode() {
      return `${API_HOST}/customer/get-code`
    },
    // 绑定手机号，完善信息
    bindPhoneNumber() {
      return `${API_HOST}/customer/band-phone`
    },
    bindWXPhoneNumber() {
      return `${API_HOST}/customer/band-phone-by-encrypted-data`
    }
  },

  enrollActivity: {
    detail(id) {
      return `${API_HOST}/coupon-package/coupon-package-detail?package_id=${id}`
    }
  },

  activity: {
    // 活动列表
    list(page, key = '') {
      return `${API_HOST}/coupon-package/customer-package-list?keyword=${key}&skip=${(page - 1) *
      Page.limit}&limit=${Page.limit}`
    },
    // 活动详情
    detail(id) {
      return `${API_HOST}/coupon-package/customer-package-detail?customer_package_id=${id}`
    },
    // 免费参加活动 todo move to top
    joinFree() {
      return `${API_HOST}/coupon-package/join-free-coupon-package`
    },
    // 项目列表
    itemList(id) {
      return `${API_HOST}/coupon-package/customer-package-item-list?customer_package_id=${id}`
    },
    // 核销列表
    consumeList(page) {
      return `${API_HOST}/coupon-package/customer-coupon-item-consume-list?skip=${(page - 1) *
      Page.limit}&limit=${Page.limit}`
    },
    // 获取活动购买参数
    getPayParams(id) {
      return `${API_HOST}/coupon-package/get-coupon-package-pay-params?package_id=${id}`
    }
  },

  store: {
    list(location, id = '') {
      return `${API_HOST}/customer/my-company-list?location=${location}&company_id=${id}`
    },
    couponList(id = '') {
      return `${API_HOST}/customer/coupon-card-list?company_id=${id}`
    },
    couponDetail(companyId, cardId) {
      return `${API_HOST}/customer/coupon-card-detail?company_id=${companyId}&card_id=${cardId}`
    }
  }
}

export default API
