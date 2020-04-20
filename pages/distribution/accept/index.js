var app = getApp();
var request = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    agent:[],
    code:0,
    id: '',
    msg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      id: e.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    this.getAgentInfo();
  },

  getAgentInfo: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    request.$get({
      url: 'agent/getAgentUserInfo',
      data: {
        id:that.data.id
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            agent: res.data
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
      },
      error: function(res) {
        wx.showModal({
          cancelColor: 'cancelColor',
          cancelText: 'cancelText',
          complete: (res) => {},
          confirmColor: 'confirmColor',
          confirmText: 'confirmText',
          content: res,
          fail: (res) => {},
          showCancel: true,
          success: (result) => {},
          title: 'title',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  joinAgent: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    request.$get({
      url: 'agent/inviteMember',
      data: {
        id:that.data.agent.user_id
      },
      success: function (res) {
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
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  redirectBack: function() {
    wx.reLaunch({
      url: "/pages/classification/index"
    });
  }

})
