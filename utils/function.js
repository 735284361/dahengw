function phone(e) {
  var myreg = /^((1[0-9]{2})+\d{8})$/;
  if (e == '') {
    wx.showToast({
      title: '手机号不能为空！',
      icon: 'none',
      duration: 1500
    })
    return false
  } else if (e.length != 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'none',
      duration: 1500
    })
    return false
  } else if (!myreg.test(e)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'none',
      duration: 1500
    })
    return false
  }
  return true
}
module.exports = {
  phone: phone
}