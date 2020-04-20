const app = getApp();
var request = require("../../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: [],
    users: [],
    loadingStatus: false,
    isTeamLeader:true,
    sales_total:[]
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
    this.getTeamInfo();
  },

  applyTeam: function () {
    var that = this
    request.$post({
      url: 'agentTeam/applyTeam',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '申请成功',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
        that.onShow()
      }
    });
  },
  
  /**
   * 获取分销成员
   */
  getTeamInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中'
    })
    request.$get({
      url: 'agentTeam/teamInfo',
      success: function (res) {
        that.setData({
          team: res.data.team,
          users: res.data.users,
          isTeamLeader: res.data.isTeamLeader,
          sales_total: res.data.sales_total,
        });
        that.setData({
          loadingStatus: false
        });
      },
      complete: function (res) {
        wx.hideLoading({})
      }
    });
  }
})