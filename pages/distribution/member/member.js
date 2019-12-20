const app = getApp();
var request = require("../../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    distribMemberList: [],
    loadingStatus: false
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
    this.setData({
      loadingStatus: true
    });
    this.getMembersData();
  },
  /**
   * 获取分销成员
   */
  getMembersData: function () {
    var that = this;
    request.$get({
      url: 'agent/members',
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            distribMemberList: res.data.data
          });
          console.log(that.data.distribMemberList)
        }
        that.setData({
          loadingStatus: false
        });
      }
    });
  }
})