//index.js
//获取应用实例
var starscore = require("../../templates/starscore/starscore.js");
var request = require('../../utils/request.js');
var app = getApp();
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3500,
    duration: 1500,
    loadingMore: false, // loading中
    isEnd: false, //到底啦
    userInfo: {},
    swiperCurrent: 0,
    recommendTitlePicStr: '',
    categories: [],
    activeCategoryId: 0,
    goodsList: [], //按类别的商品
    recommendGoods: [], //推荐商品
    recommendGoodsShow: [], //显示的推荐商品，为了缓解网络加载压力设置每次加载15个推荐商品
    banners: [],
    icons:[],
    showNoBanners: false,
    loadingMoreHidden: true,
    page: [],  //加载商品时的页数默认为1开始,在app页面加载
    pageSize: [],  //每页商品数设置为5000确保能全部加载商品，在app页面加载
    stv: {
      windowWidth: 0,
      windowHeight: 0,
    },
    height: []
  },
  onLoad: function () {
    var that = this
    that.setData({
      pageSize: app.globalData.pageSize,
      page: app.globalData.page,
      recommendGoodsShow: [],
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue
    })
    wx.setNavigationBarTitle({
      title: '原卤大亨',
    })
    that.getBanners();
    that.getIcons();
    that.getCurrentGoodsList()
  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/finder/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReachBottom: function(){
    var that = this
    // that.getRGshow()
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  getCurrentGoodsList: function () {
    var that = this;
    request.$get({
      url: 'shop/goods/list',
      data: {
        page: that.data.page,
        per_page: that.data.pageSize,
        recommend: true
      },
      success: function (res) {
        var goods = [];
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        // 计算评分
        for (let i = 0; i < goods.length; i++) {
          goods[i].starscore = (goods[i].number_score / goods[i].number_reputation)
          goods[i].starscore = Math.ceil(goods[i].starscore / 0.5) * 0.5
          goods[i].starpic = starscore.picStr(goods[i].starscore)
        }
        that.setData({
          recommendGoodsShow: goods,
        })
      },
      complete: function(res) {
        that.setData({
          loadingMore: false,
        })
      }
    })
  },

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  
  toClassifyTap: function (e) {
    app.globalData.globalCategoryId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: "/pages/classification/index"
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  getBanners: function () {
    var that = this
    request.$get({
      url: 'banner/list',
      success: function (res) {
        console.log("请求banners返回代码", res.data.code)
        if (res.data.code === 0) {
          that.setData({
            banners: res.data.data
          });
        } else if ((res.data.code === 404) || (res.data.code === 700) || (res.data.code === 701)) {
          that.setData({
            showNoBanners: true
          })

        } else {
          that.setData({
            showNoBanners: true
          })
          that.showPopup('.banners_warn_Popup')
        }
      }
    })
  },
  getIcons: function () {
    var that = this
    request.$get({
      url: 'icon/list',
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            icons: res.data.data
          });
        }
      }
    })
  }
})
