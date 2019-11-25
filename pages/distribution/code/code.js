let app = getApp();
Page({

  data: {
    imgSrc:'/images/more/timg.jpg',
    showSaveTip: false,
    maskStatus: 'hide'
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
      showSaveTip: true,
      maskStatus: 'show'
    });
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
      showSaveTip: false,
      maskStatus: 'hide'
    });
  },

  toggleMask: function () {
    this.setData({
      maskStatus: 'hide',
      showSaveTip: false
    });
  },

  onShareAppMessage: function () {
    
  }
})