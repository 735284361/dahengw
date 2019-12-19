var request = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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

  },
  appliAgent: function () {
    request.$post({
      url: 'agent/apply',
      success: function (res) {
        if (res.data.code == 0 && res.data.msg == '成功') {
          console.log(res)
          wx.reLaunch({
            url: "/pages/distribution/index/index"
          });
        }
      }
    });
  }
})