const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistab: ["可用余额", "冻结金额", "累计消费"],
    tabs: ["资金明细", "提现记录", "押金记录"],
    curTab: 0,
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    ableBalance: 0,
    frozenAmount: 0,
    cumulatAmout: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getAssetsData();
    this.getAssectDetail();
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
  toggleTab: function (e) {
    let { tabs, stv, curTab } = this.data;
    curTab = e.currentTarget.dataset.index;
    this.setData({ curTab: curTab })
    stv.offset = stv.windowWidth * curTab;
    this.setData({ stv: this.data.stv })
  },
  getAssetsData: function () {
    this.setData({
      ableBalance: 2,
      frozenAmount: 1.00,
      cumulatAmout: 0.00
    })
  },
  // 获取资金明细
  getAssectDetail: function () {
    this.setData({
      detailsList: [
        {
          "id": "12",
          "type": "1",
          "desc": "充值赠送",
          "opTIme": "2019-12-12 12:12:12",
          "status": "+1"
        },
        {
          "id": "10",
          "type": "1",
          "desc": "充值",
          "opTIme": "2019-12-12 12:12:12",
          "status": "+1"
        },
        {
          "id": "13",
          "type": "1",
          "desc": "充值赠送",
          "opTIme": "2019-12-12 12:12:12",
          "status": "+1.01"
        }
      ]
    })
  },
  // 体现
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/distribution/withdrawal/withdrawal"
    })
  }
})