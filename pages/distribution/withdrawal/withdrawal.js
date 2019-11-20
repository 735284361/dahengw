const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remainAmout: 123,
    iconSize: 45,
    iconColor: '#999999',
    amoutNumber: "",
    numberTip: false,
    minValTip: true,
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    this.setData({
      globalBGColor: app.globalData.globalBGColor
    })
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

  },
  onInput(e) {
    let type = e.target.dataset.type;
    let number = e.detail.value;

    this.setData({
      [type + 'Number']: number
    });
    this.validateNumber(number);
  },
  onBlur(e) {
    let type = e.target.dataset.type;
    let number = e.detail.value;
    this.validateNumber(number);
  },
  validateNumber: function (number){
    console.log(number)
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]{1,2}$)/;
    let flag1 = false;
    if (number < 1 || number == '') {
      this.setData({
        minValTip: true,
        numberTip: false
      });
      flag1 = true;
    }

    if (number != '' && !reg.test(number)) {
      this.setData({
        minValTip: false,
        numberTip: true,
      });
      flag1 = true;

    }
    if (flag1) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }

  }
 
})