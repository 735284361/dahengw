//app.js
var starscore = require("./templates/starscore/starscore.js");
App({
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    wx.request({
      url: that.globalData.domain + 'config/value',
      data: {
        key: 'mallName'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
        }
      }
    })
    //  获取商城LOGO
    wx.request({
      url: that.globalData.domain + 'config/value',
      data: {
        key: 'shopLogo'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.shopLogo = res.data.data.value
        }
      }
    })
  },
  
  globalData:{
    page: 1, //初始加载商品时的页面号
    pageSize:10000,
    categories: [],
    goods: [],
    hotGoods: ['鸡爪', '糯米蛋', '鸭脖', '鸡尖', '牛肉'], //自定义热门搜索商品
    goodsName: [],
    onLoadStatus: true,
    globalCategoryId: null,
    shopLogo: null,
    globalBGColor: '#f7cb46',
    globalBGColor1: '#f7e2a2',
    globalGrayFont: '#666666',
    bgRed: 247,
    bgGreen: 203,
    bgBlue: 70,
    userInfo: null,
    // domain: "https://daheng.raohouhai.com/api/v1/",// 正式商城后台域名
    // domain: "http://daheng.test/api/v1/",// 本地商城后台域名
    domain: "https://dh.raohouhai.com/api/v1/",// 测试商城后台域名
    picDomain: "https://yuanludaheng.oss-cn-beijing.aliyuncs.com/",
    // subDomain: "raohouhai",// 商城后台个性域名tgg
    // vDomain: "api/v1",// 商城后台个性域名tgg
    version: "1.0.0",
    shareProfile: '重庆地道美味，麻辣鲜香' // 首页转发的时候术语
  }
  // 根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒
})
