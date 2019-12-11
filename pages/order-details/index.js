var request = require('../../utils/request.js');
var app = getApp();
Page({
  data: {
    orderId: 0,
    score: {}, //
    goodsList: [],
    yunPrice: 0,
    statusSteps: [
      {
        current: false,
        done: false,
        text: '待支付',
        desc: ''
      },
      {
        done: false,
        current: false,
        text: '待发货',
        desc: ''
      },
      {
        done: false,
        current: false,
        text: '待收货',
        desc: ''
      },
      {
        done: false,
        current: false,
        text: '待评价',
        desc: ''
      },
      {
        done: false,
        current: false,
        text: '已完成',
        desc: ''
      }
    ],
  },
  onLoad: function (e) {
    var orderId = 11;//e.id;
    this.data.orderId = orderId;
    this.setData({
      orderId: orderId
    });
  },
  onShow: function () {
    var that = this;
    request.$get({
      url: 'order/detail',
      data: {
        id: that.data.orderId
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        that.setData({
          orderDetail: res.data.data
        });
        that.updateStatusSteps(res.data.data)
      }
    })
    var yunPrice = parseFloat(this.data.yunPrice);
    var allprice = 0;
    var goodsList = this.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      allprice += parseFloat(goodsList[0].price) * goodsList[0].number;
    }
    this.setData({
      allGoodsPrice: allprice,
      yunPrice: yunPrice
    });
  },
  wuliuDetailsTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/wuliu/index?id=" + orderId
    })
  },
  confirmBtnTap: function (e) {
    var that = this;
    debugger
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认您已收到商品？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/delivery',
            data: {
              token: wx.getStorageSync('token'),
              orderId: orderId
            },
            success: (res) => {
              if (res.data.code == 0) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },
  submitReputation: function (e) {
    var that = this;
    var postJsonString = {};
    postJsonString.orderId = this.data.orderId;
    var reputations = [];
    var i = 0;
    while (e.detail.value["orderGoodsId" + i]) {
      var orderGoodsId = e.detail.value["orderGoodsId" + i];
      var orderGoodsName = e.detail.value["orderGoodsName" + i];
      var goodReputation = that.data.score[i];
      var goodReputationRemark = e.detail.value["goodReputationRemark" + i];
      if (!goodReputation || goodReputation <= 0) {
        wx.showModal({
          title: '评分不能为空',
          content: '请对"' + orderGoodsName + '"进行评分',
        })
        return
      }

      var reputations_json = {};
      reputations_json.id = orderGoodsId;
      reputations_json.reputation = goodReputation;
      reputations_json.remark = goodReputationRemark;

      reputations.push(reputations_json);
      i++;
    }
    postJsonString.reputations = reputations;
    wx.showLoading();
    request.$post({
      url: 'order/reputation',
      method: 'POST',
      data: {
        postJsonString: JSON.stringify(postJsonString)
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.onShow();
        }
      }
    })
  },
  setScore: function(event){
    var score = event.currentTarget.dataset.score
    var id = event.currentTarget.dataset.id
    let data = this.data.score
    data[id] = score
    this.setData({ score: data})
    console.log(this.data.score)
  },
  updateStatusSteps: function (orderDetail) {
    var that = this
    if (orderDetail.status === 0) {
      that.setData({
        statusSteps: [
          {
            current: true,
            done: false,
            text: '待支付',
            desc: '等待中...'
          },
          {
            current: false,
            done: false,
            text: '待发货',
            desc: ''
          },
          {
            current: false,
            done: false,
            text: '待收货',
            desc: ''
          },
          {
            current: false,
            done: false,
            text: '待评价',
            desc: ''
          },
          {
            current: false,
            done: false,
            text: '已完成',
            desc: ''
          }
        ]
      })
    } else if (orderDetail.status === 1) {
      that.setData({
        statusSteps: [
          {
            current: false,
            done: true,
            text: '待支付',
            desc: '成功'
          },
          {
            current: true,
            done: false,
            text: '待发货',
            desc: '等待中...'
          },
          {
            current: false,
            done: false,
            text: '待收货',
            desc: ''
          },
          {
            current: false,
            done: false,
            text: '待评价',
            desc: ''
          },
          {
            current: false,
            done: false,
            text: '已完成',
            desc: ''
          }
        ]
      })
    } else if (orderDetail.status === 2) {
      that.setData({
        statusSteps: [
          {
            current: false,
            done: true,
            text: '待支付',
            desc: '成功'
          },
          {
            current: false,
            done: true,
            text: '待发货',
            desc: '成功'
          },
          {
            current: true,
            done: false,
            text: '待收货',
            desc: '等待中...'
          },
          {
            current: false,
            done: false,
            text: '待评价',
            desc: ''
          },
          {
            current: false,
            done: false,
            text: '已完成',
            desc: ''
          }
        ]
      })
    } else if (orderDetail.status === 3) {
      that.setData({
        statusSteps: [
          {
            current: false,
            done: true,
            text: '待支付',
            desc: '成功'
          },
          {
            current: false,
            done: true,
            text: '待发货',
            desc: '成功'
          },
          {
            current: false,
            done: true,
            text: '待收货',
            desc: '成功'
          },
          {
            current: true,
            done: false,
            text: '待评价',
            desc: '等待中...'
          },
          {
            current: false,
            done: false,
            text: '已完成',
            desc: ''
          }
        ]
      })
    } else if (orderDetail.status === 4) {
      that.setData({
        statusSteps: [
          {
            current: false,
            done: true,
            text: '待支付',
            desc: '成功'
          },
          {
            current: false,
            done: true,
            text: '待发货',
            desc: '成功'
          },
          {
            current: false,
            done: true,
            text: '待收货',
            desc: '成功'
          },
          {
            current: false,
            done: true,
            text: '待评价',
            desc: '成功'
          },
          {
            current: true,
            done: true,
            text: '已完成',
            desc: orderDetail.dateUpdate
          }
        ]
      })
    }

  }

})