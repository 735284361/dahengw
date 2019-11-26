const date = new Date()
const years = []
const curYear = date.getFullYear();
const curMonth = date.getMonth();
const curDate = date.getDate();
const months = []
const days = {}
const countDate = []
const countMon = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
  days[i] = [];
  for (let j = 1; j <= 31; j++) {
    if ((i == 2 || i == 4 || i == 6 || i == 9 || i == 11 ) && j == 31) {
      break;
    }
    days[i].push(j);
  }
}

for (let i = 1; i <= date.getMonth()+1; i++) {
  countMon.push(i)
}
for (let i = 1; i <= date.getDate(); i++) {
  countDate.push(i)
}


let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labels: [
      {
        name: "全部",
        id: '1',
        isSelected: true
      },
      {
        name: "充值",
        id: '2',
        isSelected: false        
      },
      {
        name: "提现",
        id: '3',
        isSelected: false
      },
      {
        name: "分销",
        id: '4',
        isSelected: false

      },
      {
        name: "分销",
        id: '4',
        isSelected: false

      },
      {
        name: "分销",
        id: '4',
        isSelected: false

      }
    ],
    selectedLabels: [],
    stv: {
      windowWidth: 0,
      offset: 0,
      width:0
    },
    sortDescImg: '/images/more/sort-desc-s.png',
    sortAscImg: '/images/more/sort-asc-s.png',
    isShowPanel: false,
    date: '本月',
    openPicker: false,
    years: years,
    months: months,
    days: days[curMonth+1],
    startValue: [curYear, curMonth,0],
    endValue: [],
    startTime: "",
    endTime: "",
    showStartTime: true,
    showEndTime: false,
    statusMask: "hide"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    this.windowWidth = res.windowWidth;
    this.data.stv.windowWidth = res.windowWidth;
    this.data.stv.width = (res.windowWidth-20) / 4;
    this.setData({ stv: this.data.stv });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.queryDetail();
    // var year = new Date().getFullYear();
    // var mon = new Date().getMonth + 1;
    // var day = new Date().getDate();
    // var date = year + "-" + this.dealTimeToStr(mon) + this.dealTimeToStr(day);

    this.setData({
      endValue: [curYear, curMonth, this.dealTimeToStr(date.getDate())-1],
      startTime: curYear + "-" + (curMonth + 1) + "-01",
      endTime: curYear + "-" + (curMonth + 1) + "-" + this.dealTimeToStr(date.getDate()),
      months: countMon,
      days: countDate
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  // 查询资金流水明细
  queryDetail: function () {
    // 1574136755000 ：2019-11-19 12:12:35
     // 1574216469000 ：2019-11-20 10:21:09
      // 1574036469000 ：2019-11-18 08:21:09
    let data = {
      spended: "123412",
      income: "1234",
      DATA: [
        {
          shopName: "优优稻香",
          type: "餐饮美食",
          time: 1574136755000,
          detail: "-21"
        },
        {
          shopName: "优优稻香",
          type: "餐饮美食",
          time: 1574216469000,
          detail: "-21"
        },
        {
          shopName: "优优稻香",
          type: "餐饮美食",
          time: 1574036469000,
          detail: "-21"
        }
      ]
    };
    for (var i = 0; i<data.DATA.length; i++){
      var item = data.DATA[i];
      if (item.time) {
        item.time = this.formateTime(item.time);
      }
    }
    console.log(data)
    
    this.setData({
      financialDetail: {
        spended: data.spended,
        income: data.income,
        detailData: data.DATA
      }
    });
  },
  // 处理时间
  formateTime: function (time) {
    let str="";
    let curTime = new Date().getTime();
    let today = 8640000, yesterday = 172800000;
    let between = curTime - time;
    let years = new Date(time).getFullYear();
    let mon = this.dealTimeToStr(new Date(time).getMonth() + 1);
    let day = this.dealTimeToStr(new Date(time).getDate());
    let hours = this.dealTimeToStr(new Date(time).getHours());
    let min = this.dealTimeToStr(new Date(time).getMinutes());
    if (between < today) {
      str = "今天 " + hours + ":" + min;
    } else if (between > today && between < yesterday) {
      str = "昨天 " + hours + ":" + min;
    } else {
      str = years + "-" + mon + "-" + day + " " + hours + ":" + min;
    }
    return str;
  },
  // 统一处理时间
  dealTimeToStr: function (time) {
    if (time >= 10) {
      return time;
    } else {
      return "0" + time;
    }
  },
  // 选择时间
  checkedTime: function(){
    var curYear = new Date().getFullYear();
    var curMon = new Date().getMonth();
    var day = new Date().getDate();
    this.setData({
      openPicker: !this.data.openPicker,
      statusMask: 'show'
    })
  },
  // 筛选
  clickSearch: function () {
    this.setData({
      isShowPanel: !this.data.isShowPanel
    });
  },
  // 选择标签
  checked: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.labels[index].isSelected = !this.data.labels[index].isSelected;
    this.setData({
      labels:this.data.labels
    });
  },
  showStartPicker: function () {
    console.log("dfdfd")
    this.setData({
      showStartTime: true,
      showEndTime: false
    })
  },
  showEndPicker: function () {
    this.setData({
      showStartTime: false,
      showEndTime: true
    })
  },
  bindChange: function (e) {
    var val = e.detail.value;
    var mon = val[1] +1;
    console.log(val[0])
    if (this.data.years[val[0]] != curYear) {
      this.setData({
        months: months,
        days: days[mon]
      })
    } else {
      if (this.data.months[val[1]-1] != curMonth) {
        this.setData({
          months: countMon,
          days: days[mon]
        })
      }else {
        this.setData({
          months: countMon,
          days: countDate
        })
      }
    }
    this.setData({
      startTime: this.data.years[val[0]] + '-' + this.data.months[val[1]] + "-" + this.data.days[val[2]]
    });
  },
  changeEndTime: function (e) {
    var val = e.detail.value;
    var mon = val[1] + 1;
    console.log(val[1])
    if (this.data.years[val[0]] != curYear) {
      this.setData({
        months: months,
        days: days[mon]
      })
    } else {
      if (this.data.months[val[1] - 1] != curMonth) {
        this.setData({
          months: countMon,
          days: days[mon]
        })
      } else {
        this.setData({
          months: countMon,
          days: countDate
        })
      }
    }
    this.setData({
      endTime: this.data.years[val[0]] + '-' + this.data.months[val[1]] + "-" + this.data.days[val[2]]
    });
  },
  // 重置标签
  reset: function () {
    console.log("fdfd")
    for (var i = 0; i < this.data.labels.length; i++) {
      this.data.labels[i].isSelected = false;
    }
    this.data.labels[0].isSelected = true;
    this.setData({
      labels: this.data.labels
    });
    // this.toggleMask();
  },
  // 标签筛选
  confirm: function () {
    var selectedLabelArr = [];
    for(var i=0; i<this.data.labels.length;i++) {
      var item = this.data.labels[i];
      if(item.isSelected) {
        selectedLabelArr.push(item.id);
      }
    }
    var selectedLabekIds = selectedLabelArr.join(","); // 选中标签ID
    this.toggleMask();
  },
  // 切换蒙层
  toggleMask: function () {
    this.setData({
      isShowPanel: !this.data.isShowPanel
    });
  },
  bindMask: function(){
    this.setData({
      openPicker: !this.data.openPicker,
    });
    if(this.data.openPicker) {
      this.setData({
        statusMask: 'show'
      })
    } else {
      this.setData({
        statusMask: 'hide'
      })
    }
  },
  // 刷选好时间
  dateConfirm: function (){
    console.log(this.data.startValue)
    console.log(this.data.endValue)
    this.bindMask();
  }


})