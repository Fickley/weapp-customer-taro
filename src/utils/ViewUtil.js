module.exports = {
  filterTime: function(dateString) {
    if (!dateString || dateString.indexOf('0000-00-00') > -1) {
      return '--'
    }
    if (dateString === '9999-12-31') {
      return '永久有效'
    }

    return dateString
  },

  validTime: function(type, start, end, day) {
    if (type === '1') {
      return '永久有效'
    }
    if (type === '2') {
      return '有效期：' + start + '至' + end
    }

    if (type === '3') {
      return '有效期：' + day + '天'
    }
    return "有效期："
   }
};
