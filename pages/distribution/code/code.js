let app = getApp();
Page({

  data: {
    imgSrc:'/images/more/timg.jpg',
    showSaveTip: false,
    startTime:0,
    endTime:0
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },

  onShow: function () {
    
  },
  longTap: function (e) {
    // let imgUrl = e.currentTarget.dataset.url;
    this.setData({
      showSaveTip: true
    });
  },

  touchStart: function (e) {
    this.data.startTime = e.timeStamp;
  },

  touchEnd: function (e) {
    this.data.endTime = e.timeStamp;
  },

  bindtap: function (e){
    if (this.data.endTime - this.data.startTime < 350) {
      this.setData({
        showSaveTip: false,
        endTime: 0,
        startTime: 0
      })
    }
  },

  saveOrShare: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imgSrc,
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    });
    this.setData({
      showSaveTip: false
    });
  },

  toggleMask: function () {
    this.setData({
      showSaveTip: false
    });
  },

  onShareAppMessage: function () {
    
  }
})