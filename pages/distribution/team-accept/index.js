var request = require('../../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team:[],
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
    var id = 6;// e.id;
    this.getTeamLeaderInfo(id);
  },

  getTeamLeaderInfo: function (id) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    request.$get({
      url: 'agentTeam/getTeamLeaderInfo',
      data: {
        id:id
      },
      success: function (res) {
        wx.hideLoading({
          complete: (res) => {},
        })
        if (res.data) {
          that.setData({
            team: res.data
          })
        } else {
          wx.showModal({
            content: '该团队暂不支持加入',
            showCancel: false,
            success: (result) => {
              wx.switchTab({
                url: '/pages/classification/index',
              })
            },
            title: '提示',
          })
        }
      }
    })
  },

  joinTeam: function() {
    var that = this
    request.$get({
      url: 'agentTeam/joinTeam',
      data: {
        id:that.data.team.id
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '加入成功',
            complete: (res) => {
              wx.redirectTo({
                url: '/pages/distribution/index/index',
              })
            },
            duration: 200,
          })
        } else if (res.data.code == 1001) {
          wx.showModal({
            content: res.data.msg,
            fail: (res) => {},
            showCancel: false,
            success: (result) => {
              wx.redirectTo({
                url: '/pages/apply-agent/index',
              })
            },
            title: '提示',
          })
        } else if (res.data.code == 1002) {
          wx.showModal({
            content: res.data.msg,
            fail: (res) => {},
            showCancel: false,
            success: (result) => {
              wx.redirectTo({
                url: "/pages/distribution/teams/index"
              });
            },
            title: '提示',
          })
        } else {
          wx.showModal({
            content: res.data.msg,
            fail: (res) => {},
            showCancel: false,
            success: (result) => {
              wx.reLaunch({
                url: "/pages/classification/index"
              });
            },
            title: '提示',
          })
        }
      }
    })
  },

  redirectBack: function() {
    wx.reLaunch({
      url: "/pages/classification/index"
    });
  }

})
