const app = getApp();

Page({
  data: {
    canCarry: 0,
    hadCarry: 0,
    carring: 0,
    amount: 0,
    commission: 0,
    distribCommission: 203.18, //分销佣金
    distribOrder: 121.75, // 分销订单
    distribDetail: 0, // 分销明细
    distribMember: 80, // 分销成员
    iconSize: 45,
    iconColor: '#999999',
    shopLogo: null
  },

  onLoad: function () {
    this.setData({
      version: app.globalData.version,
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue,
      shopLogo: app.globalData.shopLogo
    })

    let userInfo = wx.getStorageSync('userInfo')
    // if (!userInfo) {
    //   wx.navigateTo({
    //     url: "/pages/authorize/index"
    //   })
    // }
  },

  onShow: function () {
    this.getUserApiInfo();
    this.getUserDistribInfo();

    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
      })
    }
  },
  // 获取用户信息
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            userMobile: res.data.data.base.mobile
          });
        }
      }
    })

  },
  /**
   * 获取用户用户分销信息
   */
  getUserDistribInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            canCarry: 10,
            hadCarry: 12,
            carring: 13,
            amount: 1200,
            commission: 2000,
            distribCommission: 203.18,
            distribOrder: 121.75,
            distribDetail: 0,
            distribMember: 80
          });
        }
      }
    })
  },

  relogin: function () {
    wx.navigateTo({
      url: "/pages/authorize/index"
    })
    this.onLoad()
  },
  // 提现
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/distribution/withdrawal/withdrawal"
    })
  }


})