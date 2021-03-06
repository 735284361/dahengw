var request = require('../../../utils/request.js');

const date = new Date()
const years = []
const curYear = date.getFullYear();
const curMonth = date.getMonth();
const curDate = date.getDate();
const months = []
const days = {}
const countDate = [], revs = []
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
    if(j < 10) {
      // j = "0" + j;
    }
    days[i].push(j);
  }
}

for (let i = 1; i <= date.getMonth()+1; i++) {
  countMon.push(i)
}
for (let i = 1; i <= date.getDate(); i++) {
  var d = i;
  if (i < 10) {
    // d = "0" + i;
  }
  countDate.push(d);
  revs.push(d);
}
revs.reverse();

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labels: [
      {
        name: "全部",
        id: '0',
        isSelected: true
      },
      {
        name: "购物",
        id: '1',
        isSelected: false        
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
        name: "佣金",
        id: '4',
        isSelected: false

      },
      {
        name: "分成",
        id: '5',
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
    selectedDate: '本月',
    openPicker: false,
    years: years,
    months: months,
    days: days[curMonth+1],
    startDays: [],
    endDays: [],
    startValue: [years.length-1, curMonth,revs.length-1],
    endValue: [],
    lastStart: [years.length-1, curMonth, revs.length - 1],
    lastEnd: [],
    startTime: "",
    endTime: "",
    showStartTime: true,
    showEndTime: false,
    statusMask: "hide",
    startBottom: true,
    background_color:null,
    loadingStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    this.windowWidth = res.windowWidth;
    this.data.stv.windowWidth = res.windowWidth;
    this.data.stv.width = (res.windowWidth + 40) / 4;
    this.setData({ stv: this.data.stv });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      endValue: [years.length - 1, curMonth, this.dealTimeToStr(date.getDate())-1],
      startTime: curYear + "-" + (curMonth + 1) + "-01",
      endTime: curYear + "-" + (curMonth + 1) + "-" + this.dealTimeToStr(date.getDate()),
      months: countMon,
      days: countDate,
      startDays: revs,
      endDays: countDate,
      loadingStatus: true,
      lastEnd: [years.length - 1, curMonth, this.dealTimeToStr(date.getDate()) - 1]
    });
    this.queryDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 查询资金流水明细
  queryDetail: function () {
    var labelIds = [];

    this.data.labels.map(function (item) {
      if (item.isSelected) {
        labelIds.push(item.id);
      }
    });
      var that = this;
      var params = {
        type: labelIds.join(","),
        start_at: this.data.startTime,
        end_at: this.data.endTime
      }
      request.$get({
        url: 'bill/list',
        data: params,
        success: (res) => {
          if (res.statusCode == 200) {
            this.setData({
              financialDetail: {
                spended: res.data.expand,
                income: res.data.income,
                detailData: res.data.list
              }
            });
          }
          this.setData({
            loadingStatus: false
          });
        },
        fail: (res) => {
          this.setData({
            loadingStatus: false
          });
        }
      });
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
    this.setData({
      openPicker: !this.data.openPicker,
      statusMask: 'show',
      lastStart: this.data.startValue,
      lastEnd: this.data.endValue
    });
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
    if (this.data.labels[index].id == 0) {
      this.data.labels.map(function (item) {
        item.isSelected = false;
      })
    }else {
      this.data.labels[0].isSelected = false;
    }
    this.data.labels[index].isSelected = !this.data.labels[index].isSelected;
    this.setData({
      labels:this.data.labels
    });
  },
  showStartPicker: function (e) {
    var val = e.currentTarget.dataset.start;
    if (val == "开始时间") {
      this.setData({
        startValue: [curYear, curMonth, revs.length - 1],
        startTime: curYear + "-" + (curMonth + 1) + "-01",
        endValue: [curYear, curMonth, this.dealTimeToStr(date.getDate()) - 1]
      })
    }
    this.setData({
      showStartTime: true,
      showEndTime: false,
      startBottom: true
    });
  },
  showEndPicker: function (e) {
    var val = e.currentTarget.dataset.end;
    if (val == "结束时间") {
      this.setData({
        endValue: [curYear, curMonth, this.dealTimeToStr(date.getDate()) - 1],
        endTime: curYear + "-" + (curMonth + 1) + "-" + this.dealTimeToStr(date.getDate()),
        startValue: [curYear, curMonth, revs.length - 1],
      })
    }
    this.setData({
      showStartTime: false,
      showEndTime: true,
      startBottom: false
    })
  },
  bindChange: function (e) {
    var val = e.detail.value;
    var mon = val[1] +1;
    var yearIndex = val[0];
    var monIndex = val[1]
    var monarr = [].concat(days[mon]);
    // monarr.reverse();
    var index = monarr.indexOf(this.data.startDays[val[2]]);
 
    if (this.data.years[val[0]] != curYear) {
      val[2] = index;
      this.setData({
        months: months,
        startDays: [].concat(monarr),
        startValue: val
      });
    } else {
      if (this.data.months[val[1]-1] != curMonth) {
        val[2] = index;
        this.setData({
          months: countMon,
          startDays: [].concat(monarr),
          startValue: val
        })
      }else {
        if (val[0] == curYear || val[1] == curMonth) {
          monarr = revs;
          index = monarr.indexOf(this.data.startDays[val[2]]);
        }
        this.setData({
          months: countMon,
          startDays: monarr
        })
        this.setData({
          startValue: [yearIndex, monIndex, index]
        })
      }
    }
    this.setData({
      startTime: this.data.years[val[0]] + '-' + this.dealTimeToStr(this.data.months[val[1]]) + "-" + this.dealTimeToStr(this.data.startDays[index])
    });
  },
  changeEndTime: function (e) {
    var val = e.detail.value;
    var mon = val[1] + 1;
    var dayArr = days[mon];

    if (this.data.years[val[0]] != curYear) {
      this.setData({
        months: months,
        endDays: dayArr,
        endValue: val
      });
    } else {
      if (this.data.months[val[1] - 1] != curMonth) {
        this.setData({
          months: countMon,
          endDays: days[mon],
          endValue: val
        })
      } else {
        this.setData({
          months: countMon,
          endDays: countDate,
          endValue: val
        })
      }
    }
    this.setData({
      endTime: this.data.years[val[0]] + '-' + this.dealTimeToStr(this.data.months[val[1]]) + "-" + this.dealTimeToStr(this.data.endDays[val[2]])
    });
  },
  // 重置标签
  reset: function () {
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
    this.setData({
      loadingStatus: true
    });
    var selectedLabekIds = selectedLabelArr.join(","); // 选中标签ID
    this.toggleMask();
    this.queryDetail();
  },
  // 切换蒙层
  toggleMask: function () {
    this.setData({
      isShowPanel: !this.data.isShowPanel
    });
  },
  bindMask: function(){
    var startMonth = this.data.months[this.data.lastStart[1]];
    var startDate = this.data.startDays[this.data.lastStart[2]];
    var endMonth = this.data.months[this.data.lastEnd[1]];
    var endDate = this.data.endDays[this.data.lastEnd[2]];
   
    this.setData({
      openPicker: !this.data.openPicker,
      startValue: this.data.lastStart,
      endValue: this.data.lastEnd,
      startTime: this.data.years[this.data.lastStart[0]] + '-' + this.dealTimeToStr(startMonth) + "-" + this.dealTimeToStr(startDate),
      endTime: this.data.years[this.data.lastEnd[0]] + '-' + this.dealTimeToStr(endMonth) + "-" + this.dealTimeToStr(endDate)
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
    this.setData({
      loadingStatus: true,
      lastStart: this.data.startValue,
      lastEnd: this.data.endValue
    });
    
    if (new Date(this.data.startTime).valueOf() < new Date(this.data.endTime).valueOf()) {
      this.setData({
        selectedDate: this.data.startTime + "至" + this.data.endTime
      });
    }else {
      this.setData({
        selectedDate: this.data.endTime + "至" + this.data.startTime
      });
    }
    this.queryDetail();
    this.bindMask();
  },
  clearDate: function () {
    this.setData({
      startTime: '开始时间',
      endTime: '结束时间',
      showStartTime: false,
      showEndTime: false
    })
  }


})