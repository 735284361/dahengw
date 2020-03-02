var request = require('../../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:0,
    msg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    request.$post({
      url: 'agent/invite',
      data: {
        // id: e.id
        id:9
      },
      success: function (res) {
        if (res.statusCode != 401) {
          wx.reLaunch({
            url: "/pages/classification/index"
          });
        }
      }
    })
  },
})