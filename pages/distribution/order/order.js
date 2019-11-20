// pages/distribution/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', "已付款", "已完成"],
    curTab: '0',
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    totalList: [],
    payList: [],
    finishList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { tabs } = this.data;
    var res = wx.getSystemInfoSync()
    this.windowWidth = res.windowWidth;
    this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
    this.data.stv.windowWidth = res.windowWidth;
    this.setData({ stv: this.data.stv })
    this.tabsCount = tabs.length;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取订单列表
    this.setData({
      loadingStatus: true
    });
    this.getOrderList();
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
  // 切换tab
  toggleTab: function (e) {
    let { tabs, stv, curTab } = this.data;
    curTab = e.currentTarget.dataset.index;
    this.setData({ curTab: curTab })
    stv.offset = stv.windowWidth * curTab;
    this.setData({ stv: this.data.stv })
  },
  /**
   * 获取分销订单
   * status: 1：已付款；2：已完成
   */
  getOrderList: function () {
    this.setData({
      totalList: [
        {
          "status": 1,
          "id": "12",
          "orderNumber": "1901111906672341",
          "dateAdd": "2019-11-21 12:02:45",
          "pic": "/images/more/timg.jpg",
          "aumot": "15:00"
        },
        {
          "status": 2,
          "id": "13",
          "orderNumber": "1901111906672341",
          "dateAdd": "2019-11-21 12:02:45",
          "pic": "/images/more/timg.jpg",
          "aumot": "15:00"
        },
        {
          "status": 1,
          "id": "14",
          "orderNumber": "1901111906672341",
          "dateAdd": "2019-11-21 12:02:45",
          "pic": "/images/more/timg.jpg",
          "aumot": "15:00"
        },
        {
          "status": 2,
          "id": "15",
          "orderNumber": "1901111906672341",
          "dateAdd": "2019-11-21 12:02:45",
          "pic": "/images/more/timg.jpg",
          "aumot": "15:00"
        }
      ]
    });
  }

})