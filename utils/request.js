export default {
  get: (url) => {
    wx.showLoading({
      title: '正在玩命加载中…',
    });
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://show.bilibili.com${url}`,
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
        complete: function (res) {
          wx.hideLoading();
        },
      })
    })
  }
}
