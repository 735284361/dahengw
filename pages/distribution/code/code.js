let app = getApp();
var request = require("../../../utils/request.js");

Page({

  data: {
    imgSrc:'',
    showSaveTip: false,
    startTime:0,
    endTime:0,
    loadingStatus: false
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },

  onShow: function () {
    this.setData({
      loadingStatus: true
    });
    this.getCode();
    
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
    
  },

  getCode: function () {
    var that = this;
    request.$get({
      url: 'agent/qrcode',
      success: (res) => {
        if (res.data.code == 0) {
          that.setData({
            imgSrc: res.data.data
          });
        }
        this.setData({
          loadingStatus: false
        });
      }
    })
  }

})