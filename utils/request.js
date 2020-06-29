var app = getApp()
const apiHttp = app.globalData.domain

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
              wx.showToast({
                title: '400 请求出错',
                duration:2000,
              })
              break
            case 401:
              // 401 清除token信息并跳转到登录页面
              // 检查用户当前是否在登录页面
              // 如果在登录页面则不跳转
              var is_login = wx.getStorageSync('is_navigate_login')
              if (is_login) {
                return;
              } else {
                wx.setStorageSync('is_navigate_login', true)
                wx.navigateTo({
                  url: '/pages/authorize/index',
                })
              }
              break
            case 403:
              wx.showToast({
                title: '403 无访问权限',
              })
              break
            case 404:
              wx.showToast({
                title: '404 地址错误',
                duration:2000,
              })
              break
            case 422:
              // wx.showModal({
              //   title: '提示',
              //   content: '422 参数错误',
              //   showCancel: false
              // })

              console.log(res)
              wx.showToast({
                title: '参数错误',
                duration: 2000,
              })
              break;
            case 408:
              console.log(res)
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
              wx.showToast({
                title: '500 服务器错误',
                duration: 2000,
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