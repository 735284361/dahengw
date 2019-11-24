// const apiHttp = 'http://dh.raohouhai.com/api/v1/'
const apiHttp = 'http://daheng.test/api/v1/'
const header = {
  'content-type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
}

function request(url, method, data, complete, success, fail) {
  if (wx.getStorageSync('token')) {
    Object.assign(header, { 'Authorization': 'Bearer ' + wx.getStorageSync('token')})
  }
  url = apiHttp + url
  let promise = new Promise(function(resolve, reject) {
      wx.request({
        url,
        header,
        data,
        method,
        success: res => {
          resolve(res)
          success(res)
        },
        fail: res => {
          fail(res)
        },
        complete: res => {
          switch (res.statusCode) {
            case 400:
              wx.showModal({
                title: '提示',
                content: '请求错误',
                showCancel: false
              })
              break
            case 401:
              // 401 清除token信息并跳转到登录页面
              wx.navigateTo({
                url: '../authorize/index',
              })
              break
            case 403:
              wx.showModal({
                title: '提示',
                content: '403 无访问权限',
                showCancel: false
              })
              break
            case 404:
              wx.showModal({
                title: '提示',
                content: '404 请求地址出错',
                showCancel: false
              })
              break
            case 422:
              // wx.showModal({
              //   title: '提示',
              //   content: '422 参数错误',
              //   showCancel: false
              // })

              wx.showToast({
                title: '请求超时',
                duration: 2000,
              })
              break;
            case 408:
              wx.showToast({
                title: '请求超时',
                duration:2000,
              })
              break
            case 429:
              wx.showToast({
                title: '请求过于频繁，请稍后再试',
              })
              break
            case 500:
              wx.showModal({
                title: '提示',
                content: '500 服务器内部错误',
                showCancel: false
              })
              break
            case 501:
              wx.showToast({
                title: '服务未实现',
              })
              break
            case 502:
              wx.showToast({
                title: '网关错误',
              })
              break
            case 503:
              wx.showToast({
                title: '服务不可用',
              })
              break
            case 504:
              wx.showToast({
                title: '网关超时',
              })
              break
            case 505:
              wx.showToast({
                title: 'HTTP版本不受支持',
              })
              break
            default:
          }
          wx.hideNavigationBarLoading()
          complete(res)
        }
      })
  })
  return promise
}
let fn = function () { }
module.exports = {
    $get: function ({
      url,
      data = {},
      complete = fn,
      success = fn,
      fail = fn
    }) {
      return request(url, 'GET', data, complete, success, fail)
    },
    $post: function ({
      url,
      data = {},
      complete = fn,
      success = fn,
      fail = fn
    }) {
      return request(url, 'POST', data, complete, success, fail)
    },
    $$get: function ({
      url,
      data = {},
      complete = fn,
      success = fn,
      fail = fn
    }) {
      wx.showNavigationBarLoading()
      return request(url, 'GET', data, complete, success, fail)
    },
    $$post: function ({
      url,
      data = {},
      complete = fn,
      success = fn,
      fail = fn
    }) {
      wx.showNavigationBarLoading()
      return request(url, 'POST', data, complete, success, fail)
    },
}