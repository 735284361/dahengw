const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    distribMemberList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMembersData();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取分销成员
   */
  getMembersData: function () {
    this.setData({
      distribMemberList: [
        {
          "id": "1212",
          "name": "绕后海",
          "imgSrc": "/images/more/timg.jpg",
          "registerTime": "2019-12-12",
          "expense": "232",
          "orderNum": "3"
        },
        {
          "id": "1213",
          "name": "张三",
          "imgSrc": "/images/more/timg.jpg",
          "registerTime": "2019-12-12",
          "expense": "232",
          "orderNum": "3"
        },
        {
          "id": "1214",
          "name": "李四",
          "imgSrc": "/images/more/timg.jpg",
          "registerTime": "2019-12-12",
          "expense": "232",
          "orderNum": "3"
        },
        {
          "id": "1215",
          "name": "王二",
          "imgSrc": "/images/more/timg.jpg",
          "registerTime": "2019-12-12",
          "expense": "232",
          "orderNum": "3"
        },
        {
          "id": "1216",
          "name": "赵六",
          "imgSrc": "/images/more/timg.jpg",
          "registerTime": "2019-12-12",
          "expense": "232",
          "orderNum": "3"
        }
      ]
    })
  }
})