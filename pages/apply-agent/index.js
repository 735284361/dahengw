var request = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:0,
    msg:'加载中...',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAgentInfo()
  },

  // 获取代理商信息
  getAgentInfo: function () {
    var that = this;
    request.$get({
      url: 'agent/detail',
      success: function (res) {
        if (res.data.msg) {
          that.setData({
            code: res.data.code,
            msg: res.data.msg
          })
        }
      }
    });
  },

  // 返回首页
  goBack: function () {
    wx.reLaunch({
      url: "/pages/classification/index"
    });
  },

  applyAgent: function () {
    var that = this
    request.$post({
      url: 'agent/apply',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '申请成功',
          })
        } else {
          wx.showToast({
            title: '申请失败',
          })
        }
        that.onShow()
      }
    });
  }
})