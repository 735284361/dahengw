//index.js
var request = require('../../utils/request.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    request.$post({
      url: 'address/setDefault',
      data: {
        id:id
      },
      success: (res) =>{
        wx.navigateBack({})
      }
    })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },
  
  onLoad: function () {
    console.log('onLoad')
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    request.$get({
      url: 'address/list',
      complete: (res) =>{
        if (res.data.code == 0) {
          that.setData({
            addressList:res.data.data
          });
        } else if (res.data.code == 700){
          that.setData({
            addressList: null
          });
        }
      }
    })
  }

})
