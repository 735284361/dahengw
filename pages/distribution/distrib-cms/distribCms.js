const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    acomunt: 203.18,
    canUseAcomunt: 203.18,
    hadUsedAcomutn: 0,
    waiting: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      globalBGColor: app.globalData.globalBGColor
    })
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 提现明细
  withdrawDetail: function () {
    wx.redirectTo({
      url: "/pages/distribution/detail/detail"
    });
  },
  // 提现
  withdrawal: function () {
    wx.navigateTo({
      url: "/pages/distribution/withdrawal/withdrawal"
    })
  }


})