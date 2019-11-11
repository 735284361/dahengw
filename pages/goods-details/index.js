//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../templates/wxParse/wxParse.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,
    hasMoreSelect: false,
    selectSize: "选择：",
    selectSizePrice: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    shopDeliveryPrice: 0,
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function (e) {
    var that = this;
    that.data.kjId = e.kjId;
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })
    wx.request({
      url: app.globalData.domain + app.globalData.vDomain + '/shop/goods/detail',
      data: {
        id: e.id
      },
      success: function (res) {
        var selectSizeTemp = "";
        if (res.data.properties) {
          for (var i = 0; i < res.data.properties.length; i++) {
            selectSizeTemp = selectSizeTemp + " " + res.data.properties[i].name;
          }
          that.setData({
            hasMoreSelect: true,
            selectSize: that.data.selectSize + selectSizeTemp,
            selectSizePrice: res.data.price,
          });
        }
        that.data.goodsDetail = res.data;
        // if (res.data.basicInfo.videoId) {
        //   that.getVideoSrc(res.data.basicInfo.videoId);
        // }
        that.setData({
          goodsDetail: res.data,
          selectSizePrice: res.data.price,
          buyNumMax: res.data.stores,
          buyNumber: (res.data.stores > 0) ? 1 : 0
        });
        WxParse.wxParse('article', 'html', res.data.content.content, that, 5);
      }
    })
    // this.getDeliveryPrice();
    // this.getKanjiaInfo(e.id);
  },
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    /*    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
          this.bindGuiGeTap();
          return;
        }
        if(this.data.buyNumber < 1){
          wx.showModal({
            title: '提示',
            content: '暂时缺货哦~',
            showCancel:false
          })
          return;
        }
        this.addShopCar();
        this.goShopCar();*/
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function (e) {
    var that = this;
    /*
    console.log(e)
    console.log(e.currentTarget.dataset.propertyid)
    console.log(e.currentTarget.dataset.propertyname)
    console.log(e.currentTarget.dataset.propertychildid)
    console.log(e.currentTarget.dataset.propertychildname)
    */
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childs_cur_goods;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childs_cur_goods[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childs_cur_goods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    var propertyCheckedArr = {};
    for (var i = 0; i < that.data.goodsDetail.properties.length; i++) {
      childs = that.data.goodsDetail.properties[i].childs_cur_goods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;

          var key = that.data.goodsDetail.properties[i].name;
          propertyCheckedArr[key] = childs[j].name;

          var sku = skuArr.filter(p => {
            return p.口味 == '麻辣' && p.重量 == '180g';
          });
          var asb;
          console.log(sku);

          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":" + childs[j].id + ",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":" + childs[j].name + "  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      var skuArr = this.data.goodsDetail.sku_arr;
      // wx.request({
      //   url: app.globalData.domain + app.globalData.vDomain + '/shop/goods/price',
      //   data: {
      //     id: that.data.goodsDetail.id,
      //     attrs: propertyCheckedArr,
      //     XDEBUG_SESSION_START: 18137
      //   },
      //   success: function (res) {
      //     var sku = JSON.parse(res.data.sku)
      //     that.setData({
      //       selectSizePrice: sku.price,
      //       propertyChildIds: propertyChildIds,
      //       propertyChildNames: propertyChildNames,
      //       buyNumMax: sku.stock,
      //       buyNumber: (sku.stock > 0) ? 1 : 0
      //     });
      //   }
      // }
    }


    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })
  },
  /**
  * 加入购物车
  */
  addShopCar: function () {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    //console.log(shopCarInfo);

    //shopCarInfo = {shopNum:12,shopList:[]}
  },
	/**
	  * 立即购买
	  */
  buyNow: function () {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      wx.showModal({
        title: '提示',
        content: '请先选择规格尺寸哦~',
        showCancel: false
      })
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    if (this.data.selectSizePrice * this.data.buyNumber < this.data.shopDeliveryPrice) {
      wx.showModal({
        title: '未达到起送价',
        content: '请您再选一些吧！',
        showCancel: false,
      })
    } else {
      //组建立即购买信息
      var buyNowInfo = this.buliduBuyNowInfo();
      // 写入本地存储
      wx.setStorage({
        key: "buyNowInfo",
        data: buyNowInfo
      })
      this.closePopupTap();

      wx.navigateTo({
        url: "/pages/to-pay-order/index?orderType=buyNow"
      })
    }
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    shopCarInfo.kjId = this.data.kjId;
    return shopCarInfo;
  },
	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    /*    var hasSameGoodsIndex = -1;
        for (var i = 0; i < toBuyInfo.shopList.length; i++) {
          var tmpShopCarMap = toBuyInfo.shopList[i];
          if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
            hasSameGoodsIndex = i;
            shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
            break;
          }
        }
        toBuyInfo.shopNum = toBuyInfo.shopNum + this.data.buyNumber;
        if (hasSameGoodsIndex > -1) {
          toBuyInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
        } else {
          toBuyInfo.shopList.push(shopCarMap);
        }*/

    buyNowInfo.shopList.push(shopCarMap);
    buyNowInfo.kjId = this.data.kjId;
    return buyNowInfo;
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  getVideoSrc: function (videoId) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
      data: {
        videoId: videoId
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            videoMp4Src: res.data.fdMp4
          });
        }
      }
    })
  },
  getKanjiaInfo: function (gid) {
    var that = this;
    if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length == 0) {
      that.setData({
        curGoodsKanjia: null
      });
      return;
    }
    let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
      return ele.goodsId == gid
    });
    if (curGoodsKanjia) {
      that.setData({
        curGoodsKanjia: curGoodsKanjia
      });
    } else {
      that.setData({
        curGoodsKanjia: null
      });
    }
  },
  goKanjia: function () {
    var that = this;
    if (!that.data.curGoodsKanjia) {
      return;
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/kanjia/join',
      data: {
        kjid: that.data.curGoodsKanjia.id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          //console.log(res.data);
          wx.navigateTo({
            url: "/pages/kanjia/index?kjId=" + res.data.kjId + "&joiner=" + res.data.uid + "&id=" + res.data.goodsId
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
  },
  getDeliveryPrice: function () {
    var that = this
    //  获取关于我们Title
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/config/get-value',
      data: {
        key: 'shopDeliveryPrice'
      },
      success: function (res) {
        if (res.data.code == 0) {
          var shopDeliveryPrice = parseFloat(parseFloat(res.data.value).toFixed(2))
          that.setData({
            shopDeliveryPrice: shopDeliveryPrice
          })
          //console.log('配送起步价：', shopDeliveryPrice, res.data.value)
        }
      }
    })
  }
})