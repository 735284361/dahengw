// pages/authorize/index.js
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
    wx.setStorageSync('is_navigate_login', true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('is_navigate_login')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('is_navigate_login')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  rejectLogin: function (e){
    wx.navigateBack({
      
    })
  },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo){
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.login();
  },
  login: function () {
    let that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: app.globalData.domain + 'wechat/login',
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res.data.code)
            if (res.data.code == 10000) {
              // 去注册
              that.registerUser();
              return;
            }
            else if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('uid', res.data.data.id)
            // 回到原来的页面
            wx.navigateBack();
          }
        })
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: app.globalData.domain + 'wechat/register',
              data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  }
})