//获取应用实例
const request = require('../../utils/request.js');
const fun = require('../../utils/function.js');

var app = getApp()
Page({
  data: {
    isUpdate:false,
    id:'',
    addressData:{},
    region: ['请选择', '请选择', '请选择'],
  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindSave: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var detailInfo = e.detail.value.detailInfo;
    var phone = e.detail.value.phone;
    var postalCode = e.detail.value.postalCode;

    if (name == "") {
      wx.showToast({
        title: '请填写联系人',
        duration: 2000
      })
      return
    }
    if (!fun.phone(phone)) {
      return
    }
    if (that.data.region[0] == "请选择" || that.data.region[0] == "") {
      wx.showToast({
        title: '请选择地址',
        duration: 2000
      })
      return
    }
    if (detailInfo == "") {
      wx.showToast({
        title: '请填写详细地址',
        duration: 2000
      })
      return
    }
    request.$post({
      url: 'address/saveAddress',
      data: {
        id: that.data.id,
        name: name,
        detailInfo: detailInfo,
        phone: phone,
        region: that.data.region,
        postalCode: postalCode,
        isDefault: 1
      },
      complete: function (res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },

  // 地址选择
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad: function (e) {
    var that = this;
    // var id = 4;//e.id;
    var id = e.id;
    if (id) {
      // 初始化原数据
      wx.showLoading();
      request.$get({
        url: 'address/detail',
        data: {
          id: id
        },
        complete: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            let addressData = res.data.data
            let region = [addressData['province'], addressData['city'], addressData['county']]
            that.setData({
              id: id,
              isUpdate:true,
              addressData: addressData,
              region:region
            });
            return;
          } else {
            wx.showModal({
              title: '提示',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          }
        },
      })
    }
  },

  // 删除地址
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          request.$get({
            url: 'address/delete',
            data: {
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 从微信读取地址
  readFromWx: function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        let region=[];
        let addressData = {};
        region[0] = res.provinceName
        region[1] = res.cityName
        region[2] = res.countyName
        addressData['name'] = res.userName
        addressData['phone'] = res.telNumber
        addressData['detailInfo'] = res.detailInfo
        addressData['postalCode'] = res.postalCode
        that.setData({
          region: region,
          addressData: addressData,
        });
      }
    })
  }
})
