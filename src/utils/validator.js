const validator = {
  patterns: {
    phone: /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/
  },
  text: {
    phone: '手机号格式错误'
  },
  required: {
    notNull: '必填项',
    phone: '手机号必填'
  },
  validate(val, reg) {
    if (!reg) {
      return true
    }
    return !!val && !!val.match(reg)
  },
  notNull(val) {
    return val.length > 0
  },
  isPhone(val) {
    return this.validate(val, this.patterns.phone)
  }
}

export default validator
