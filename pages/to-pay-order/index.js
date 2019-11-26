//index.js
//获取应用实例
var app = getApp()
var request = require('../../utils/request.js')

Page({
  data: {
    goodsList: [],
    isNeedLogistics: 1, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    shipingFee:0, // 运费模板
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null // 当前选择使用的优惠券
  },
  onShow: function () {
    var that = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow" === that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      that.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    that.initShippingAddress();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType
    });
  },

  createOrder: function (e) {
    var that = this;
    // wx.showLoading();
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }
    var postData = {
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark
    };
    if (that.data.kjId) {
      postData.kjid = that.data.kjId;
    }
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      postData.province = that.data.curAddressData.province;
      postData.city = that.data.curAddressData.city;
      if (that.data.curAddressData.county) {
        postData.county = that.data.curAddressData.county;
      }
      postData.detail_info = that.data.curAddressData.detail_info;
      postData.name = that.data.curAddressData.name;
      postData.phone = that.data.curAddressData.phone;
      postData.postal_code = that.data.curAddressData.postal_code;
    }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    }
    console.log(postData)
    request.$post({
      url: 'order/create',
      method: 'POST',
      data: postData, // 设置请求的 参数
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          // if (e && "buyNow" != that.data.orderType) {
          //   // 清空购物车数据
          //   wx.removeStorageSync('shopCarInfo');
          // }
          wx.requestPayment({
            timeStamp: String(res.data.data.timeStamp),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              console.log(res)
            },
            complete: function (res) {
              if (res.errMsg == 'requestPayment:fail cancel') {
                wx.redirectTo({
                  url: "/pages/ucenter/order-list/index"
                });
              } else if (res.errMsg == 'requestPayment:ok') {
                wx.redirectTo({
                  url: "/pages/ucenter/order-list/index"
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: '支付失败',
                  showCancel: false
                })
              }
            }
          })
        } else {
          console.log(res)
          // wx.showModal({
          //   title: '错误',
          //   content: res.data.msg,
          //   showCancel: false
          // })
        }
      }
    })

  },

  pay: function () {
    var that = this;
    request.$post({
      url: 'pay/pay',
      success: function (res) {
        if (res.data.code == 0) {
          // if (e && "buyNow" != that.data.orderType) {
          //   // 清空购物车数据
          //   wx.removeStorageSync('shopCarInfo');
          // }
          wx.requestPayment({
            timeStamp: String(res.data.data.timeStamp),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              console.log(res)
            },
            complete: function (res) {
              if (res.errMsg == 'requestPayment:fail cancel') {
                wx.redirectTo({
                  url: "/pages/ucenter/order-list/index"
                });
              } else if (res.errMsg == 'requestPayment:ok') {
                wx.redirectTo({
                  url: "/pages/ucenter/order-list/index"
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: '支付失败',
                  showCancel: false
                })
              }
            }
          })
        } else {
          console.log(res)
          // wx.showModal({
          //   title: '错误',
          //   content: res.data.msg,
          //   showCancel: false
          // })
        }
      }
    })
  },

  // 获取收货地址
  initShippingAddress: function () {
    var that = this;
    request.$get({
      url: 'address/default',
      data: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 0) {
          that.setData({
            curAddressData: res.data.data
          });
        } else {
          that.setData({
            curAddressData: null
          });
        }
        that.shippingFee();
      }
    })
  },

  // 根据地址获取运费
  shippingFee:function() {
    var that = this;
    that.processFee();
    request.$get({
      url: 'shop/shipping/fee',
      data: {
        province: that.data.curAddressData.province,
        total_fee: that.data.allGoodsPrice
      },
      success: (res) => {
        if (res.data.code === 0) {
          that.setData({
            yunPrice: res.data.data,
            allGoodsAndYunPrice: that.data.allGoodsAndYunPrice + res.data.data
          });
        } else {
          that.setData({
            shipingFee: 0
          });
        }
      }
    })
  },

  // 计算金额
  processFee: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 1;
    var allGoodsPrice = 0;
    var yunPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      // if (carShopBean.logistics) {
      //   isNeedLogistics = 1;
      // }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }
      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildName":"' + carShopBean.label + '","propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0}';
      goodsJsonStr += goodsJsonStrTmp;


    }
    goodsJsonStr += "]";

    console.log(goodsJsonStr)
    that.setData({
      isNeedLogistics: 1,//isNeedLogistics,
      goodsJsonStr: goodsJsonStr,
      allGoodsPrice: allGoodsPrice,
      allGoodsAndYunPrice: allGoodsPrice + yunPrice,
    });
    // that.createOrder();
  },

  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },

//   getMyCoupons: function () {
//     var that = this;
//     wx.request({
//       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
//       data: {
//         token: wx.getStorageSync('token'),
//         status: 0
//       },
//       success: function (res) {
//         if (res.data.code === 0) {
//           var coupons = res.data.data.filter(entity => {
//             return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
//           });
//           if (coupons.length > 0) {
//             that.setData({
//               hasNoCoupons: false,
//               coupons: coupons
//             });
//           }
//         }
//       }
//     })
//   },
//   bindChangeCoupon: function (e) {
//     const selIndex = e.detail.value[0] - 1;
//     if (selIndex === -1) {
//       this.setData({
//         youhuijine: 0,
//         curCoupon: null
//       });
//       return;
//     }
//     this.setData({
//       youhuijine: this.data.coupons[selIndex].money,
//       curCoupon: this.data.coupons[selIndex]
//     });
//   },
})
