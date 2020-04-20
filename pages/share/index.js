// pages/share/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getImageInfo({
      src: 'https://cqyldh.oss-cn-chengdu.aliyuncs.com/images/2ad26007701fd8db8b48884132373e2d.jpeg',
      complete: (res) => {},
      fail: (res) => {},
      success: (result) => {
        that.createNewImg()
      },
    })
  },


  //将小程序码绘制到固定位置
  setQrcode(context) {
    let path = this.data.qtsheXcxCode //小程序码
    context.drawImage(path, 75, 450, 75, 75)
  },
  //将昵称绘制到canvas的固定位置
  setName(context) {
    if (this.data.userName.length >= 8) {
      var title = this.data.userName.substring(0, 7) + '...'
    } else {
      var title = this.data.userName
    }
    context.setFontSize(14)
    context.fillText(title, 98, 330)
  },
  //绘制用户头像
  setAvatarUrl(context) {
    let cx = 30 + 25
    let cy = 320 + 25
    context.arc(cx, cy, 25, 0, 2 * Math.PI)
    context.clip()
    let path = this.data.userHeadUrl
    context.drawImage(path, 30, 320, 52, 52)
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg() {
    let context = wx.createCanvasContext('mycanvas')
    let path = this.data.qtsheBackground
    let that = this
    context.drawImage(path, 0, 0, 375, 667) //以iPhone 6尺寸大小为标准绘制图片
    that.setQrcode(context)
    that.setName(context)
    that.setAvatarUrl(context)
    //绘制图片
    context.draw()
    context.save()
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
          wx.hideLoading()
          that.setData({
            shareImagePath: res.tempFilePath
          })
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      }, this)
    }, 2000)
  },
  savePhoto() {
    var that = this
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    setTimeout(() => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.shareImagePath,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            wx.hideLoading()
            that.setData({
              isPhotoModel: false,
              isCanvas: false
            })
          }, 300)
        },
        fail() {
          wx.showToast({
            title: '保存失败，请刷新页面重试',
            icon: 'none'
          })
          setTimeout(() => {
            wx.hideLoading()
            that.setData({
              isPhotoModel: false,
              isCanvas: false
            })
          }, 300)
        }
      })
    }, 2500)
  },
  circleImg(ctx, img, x, y, r) {
    ctx.save();
    var d =2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
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

  }
})