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
    loadingStatus: false,
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
    this.joinAgent();
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
        // id:100000
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            agent: res.data
          })
        } else {
          wx.showModal({
            content: '暂不支持加入',
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

  enterShop: function() {
    wx.reLaunch({
      url: "/pages/classification/index"
    });
  },

  joinAgent: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    request.$get({
      url: 'agent/inviteMember',
      data: {
        id:that.data.id
      },
      success: function (res) {
        that.setData({
          loadingStatus: true
        })
        // wx.showModal({
        //   content: res.data.msg,
        //   fail: (res) => {},
        //   showCancel: false,
        //   success: (result) => {
        //     wx.reLaunch({
        //       url: "/pages/classification/index"
        //     });
        //   },
        //   title: '提示',
        // })
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
