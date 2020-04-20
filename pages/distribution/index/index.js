const app = getApp();
var request = require('../../../utils/request.js');

Page({
  data: {
    amount: 0,
    commission: 0,
    distribCommission: 203.18, //分销佣金
    distribOrder: 121.75, // 分销订单
    distribDetail: 0, // 分销明细
    distribMember: 80, // 分销成员
    iconSize: 45,
    iconColor: '#999999',
    shopLogo: null,
    isLeader: true,
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
    this.getAgentInfo();
    this.getStatisticsInfo();

    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      })
    }
  },
  
  relogin: function () {
    wx.navigateTo({
      url: "/pages/authorize/index"
    })
    this.onLoad()
  },
  // 获取代理商信息
  getAgentInfo: function () {
    var that = this;
    request.$get({
      url: 'agent/detail',
      success: function (res) {
        console.log(res)
        if (res.data.code == 0 && res.data.data.status == 1) {
          that.getStatisticsInfo();
        } else {
          wx.redirectTo({
            url: "/pages/apply-agent/index"
          });
        }
      }
    });
  },
  getStatisticsInfo: function () {
    var that = this;
    request.$get({
      url: 'agent/statistics',
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            amount: res.data.data.amount,
            commission: res.data.data.divide
          });
        }
      }
    })
  }

})