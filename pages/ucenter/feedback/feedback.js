//var util = require('../../../utils/util.js');
//var api = require('../../../config/api.js');

const request = require('../../../utils/request.js');
const fun = require('../../../utils/function.js');

var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
    inputTxt: '',
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  clearMobileNumber: function(){
    this.setData({
      //更新页面input框显示
      inputTxt: ''
    })
  },

  bindSave: function (e) {
    var that = this;
    var type = e.detail.value.type;
    var content = e.detail.value.content;
    var phone = e.detail.value.phone;

    if (type == 0) {
      wx.showToast({
        title: '请选择反馈类型',
        duration: 2000
      })
      return
    } else {
      type = that.data.array[type]
    }
    if (content == "") {
      wx.showToast({
        title: '请填写反馈内容',
        duration: 2000
      })
      return
    }
    if (!fun.phone(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        duration: 2000
      })
      return
    }
    wx.showLoading()
    request.$post({
      url: 'user/feedback',
      data: {
        type: type,
        content: content,
        phone: phone,
      },
      complete: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },

  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})