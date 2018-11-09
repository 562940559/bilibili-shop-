import ajax from '../../utils/request';
var WxParse = require('../../assets/wxParse/wxParse.js');
const app = getApp();
Page({
  data: {
    detailInfo: [],
    piaoCount: 1
  },
  onLoad: function (options) {
    ajax.get(`/api/ticket/project/get?version=133&id=${options.id}`)
    .then(resp => {
      this.setData({
        detailInfo: resp.data.data
      });
      var article = resp.data.data.performance_desc;
      WxParse.wxParse('article', 'html', article, this, 0);
    })
    .catch(error => {
      console.log(error)
    });
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  reduceCount: function() {
    if (this.data.piaoCount <= 1) {
      return;
    } else {
      this.setData({
        piaoCount: this.data.piaoCount - 1
      })
    }
  },
  addCount: function() {
    this.setData({
      piaoCount: this.data.piaoCount + 1
    })
  },
  addToCart: function() {
    this.data.detailInfo.piaoCount = this.data.piaoCount;
    this.data.detailInfo.show = "";
    this.data.detailInfo.ispayment = false;
    app.addToCart(this.data.detailInfo);
    wx.showToast({
      title: '已提交至订单',
      icon: 'success',
      duration: 2000
    });
    this.hideModal();
    this.setData({
      piaoCount: 1
    })
  }
})