var wxpay = require('../../../utils/pay.js');
var request = require("../../../utils/request.js");

var app = getApp()
Page({
  data: {
    tabs: ["全部", "进行中", "已完成"],
    tabClass: ["", "", ""],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    loadingStatus: false,
  },
  onLoad: function (options) {
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }
  },
  onShow: function () {
    // 获取订单列表
    this.setData({
      loadingStatus: true
    })
    this.getOrderList()
  },
  getOrderList: function () {
    var that = this;
    request.$get({
      url: 'agent/orders',
      success: (res) => {
        if (res.data.code === 0) {
          //订单分类
          var orderList = [];
          for (let i = 0; i < that.data.tabs.length; i++) {
            var tempList = [];
            if (i === 0) {
              tempList = res.data.data;
              orderList.push({ 'status': 0, 'isnull': tempList.length === 0, 'orderList': tempList })
            } else if (i == 1) {
              for (let j = 0; j < res.data.data.length; j++) {
                if (res.data.data[j].status == 1 || res.data.data[j].status == 2) {
                  tempList.push(res.data.data[j]);
                }
              }
              orderList.push({ 'status': 1, 'isnull': tempList.length === 0, 'orderList': tempList })
            } else if (i == 2) {
              for (let j = 0; j < res.data.data.length; j++) {
                if (res.data.data[j].status == 3 || res.data.data[j].status == 4) {
                  tempList.push(res.data.data[j]);
                }
              }
              orderList.push({ 'status': 4, 'isnull': tempList.length === 0, 'orderList': tempList })
            }
          }
          this.setData({
            orderList: orderList
          });
        } else {
          console.log('orderList not exist')
          that.setData({
            orderList: 'null',
            logisticsMap: {},
            goodsMap: {}
          });
        }
        this.setData({
          loadingStatus: false
        })
      },
      fail: (res) => {
        console.log('获取orderList错误', res.data)
      }
    })
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/distribution/order-details/index?id=" + orderId
    })
  },
  handlerStart(e) {
    console.log('handlerStart')
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    console.log('handlerMove')
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    console.log('handlerEnd')
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      console.log('快速滑动')
      //判断是否左右滑动(竖直方向滑动小于50)
      if (Math.abs(this.tapStartY - clientY) < 50) {
        //Y距离小于50 所以用户是左右滑动
        console.log('竖直滑动距离小于50')
        if (this.tapStartX - clientX > 5) {
          //向左滑动超过5个单位，activeTab增加
          console.log('向左滑动')
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else if (clientX - this.tapStartX > 5) {
          //向右滑动超过5个单位，activeTab减少
          console.log('向右滑动')
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //Y距离大于50 所以用户是上下滑动
        console.log('竖直滑动距离大于50')
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: this.data.stv })
  },
  ////////
  _updateSelectedPage(page) {
    console.log('_updateSelectedPage')
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
  },
  handlerTabTap(e) {
    console.log('handlerTapTap', e.currentTarget.dataset.index)
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },
  //事件处理函数
  swiperchange: function (e) {
    //console.log('swiperCurrent',e.detail.current)
    let { tabs, stv, activeTab } = this.data;
    activeTab = e.detail.current;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/classification/index"
    });
  },
})