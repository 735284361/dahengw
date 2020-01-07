
const request = require('../../utils/request.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0
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
    this.getUserAmount()
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
  bindCancel: function () {
    wx.navigateBack({})
  },

  getUserAmount: function () {
    var that = this;
    request.$get({
      url: 'user/account',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
          });
        }
      }
    })

  },

  bindSave: function (e) {
    var that = this;
    var amount = e.detail.value.amount;

    if (amount == "" || amount * 1 < 50) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的提现金额',
        showCancel: false
      })
      return
    }
    request.$post({
      url: 'user/withdraw/apply',
      data: {
        apply_total: amount
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showModal({
            title: '成功',
            content: '您的提现申请已提交，等待财务打款',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.bindCancel();
              }
            }
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  }
})