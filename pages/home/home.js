import ajax from '../../utils/request';
//获取应用实例
const app = getApp()
//下面这三个函数，就是初始化状态的。
function sort_display() {
  return ['sort_hide', 'sort_hide'];
}
function item_nav_set_list_light() {
  return ['', ''];
}

Page({
  data: {
    piaoInfo: [],
    cityInfo: [{
      id: "-1",
      name: "全国",
    },{
      id: "310100",
      name: "上海",
    }, {
      id: "110100",
      name: "北京",
    }, {
      id: "510100",
      name: "成都",
    }, {
      id: "440100",
      name: "广州",
    }, {
      id: "440300",
      name: "深圳",
    }, {
      id: "420100",
      name: "武汉",
    }, {
      id: "330100",
      name: "杭州",
      dataIndex: "0_7"
    }, {
      id: "320500",
      name: "苏州",
    }, {
      id: "320100",
      name: "南京",
    }],
    typeInfo: [{
      id: 1,
      name: "全部类型"
    }, {
      id: 2,
      name: "动漫嘉年华"
    }, {
      id: 3,
      name: "音乐会"
    }, {
      id: 4,
      name: "其他展览"
    }, {
      id: 5,
      name: "演唱会"
    }, {
      id: 6,
      name: "其他演出"
    }, {
      id: 7,
      name: "舞台剧"
    }, {
      id: 8,
      name: "主题漫展"
    }, {
      id: 9,
      name: "电子游戏展"
    }],
    currentCity: "-1",
    currentCityName: "全国",
    currentType: "全部类型",
    page: 2,
    scrollTop: 0,
    floorstatus: false,
    //这里是存储数据的地方，把改变过的东西放在这里。
    //主菜单高亮
    item_nav_set_list_light: item_nav_set_list_light(),
    //储存子菜单显示与否
    sort_status: sort_display(),
    // 图片
    hdimg: [
      '//i1.hdslb.com/bfs/openplatform/201811/10901541125765095.jpeg',
      '//i1.hdslb.com/bfs/openplatform/201811/10901541125405883.jpeg', 
      '//i1.hdslb.com/bfs/openplatform/201811/10901541124894073.jpeg',
      '//i1.hdslb.com/bfs/openplatform/201811/B%E7%AB%991090x3901541127159849.jpeg',
    ],
    // 是否采用衔接滑动
    circular: true,
    // 是否显示画板指示点
    indicatorDots: false,
    // 选中点的颜色
    indicatorcolor: "#dedede",
    indicatoractivecolor: "#FF5687",
    // 是否竖直
    vertical: false,
    // 是否自动切换
    autoplay: true,
    // 滑动动画时长毫秒
    duration: 500,
    // 所有图片的高度
    imgheights: [],
    // 图片宽度
    imgwidth: 700,
    // 默认
    current: 0,
    previousMargin: "25rpx",
    nextMargin: "25rpx"
  },
  item_nav_set_list_display: function (e) {
    //  首先获取一下，点击的信息，下面这行就是得出点击的哪个主菜单
    var index = parseInt(e.currentTarget.dataset.index);
    //   将初始化的状态获取到。   
    //因为思路是点击一个主菜单，然后将所有子菜单隐藏，然后在对点击的主菜单
    //下的子菜单进行显示处理 。所以获取初始化状态就是隐藏所有子菜单的动作。
    //因为最后是将这个值赋值给data中的数据
    //页面根据data这种的数据做出改变。
    var new_sort_display = sort_display();
    var new_item_nav_set_list_light = item_nav_set_list_light();
    //if判断状态，然后做出响应动作
    if (this.data.sort_status[index] == 'sort_hide') {
      new_sort_display[index] = 'sort_show';
      new_item_nav_set_list_light[index] = 'item_nav_set_list_light';
    } else {
      new_sort_display[index] = 'sort_hide';
      new_item_nav_set_list_light[index] = '';
    }
    //最后将值赋给data
    this.setData({
      sort_status: new_sort_display,
      item_nav_set_list_light: new_item_nav_set_list_light
    });
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  imageLoad: function (e) {
    // 获取图片真实宽度
    var imgwidth = e.detail.width,
        imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    // 计算的高度值
    var viewHeight = 700 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    // 把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  // 更改当前城市
  changeUrlCity(e) {
    // 隐藏列表
    this.setData({sort_status: ['sort_hide', 'sort_hide']});
    ajax.get(`/api/ticket/project/listV2?version=133&page=1&pagesize=20&platform=web&area=${e.currentTarget.dataset.id.id}&p_type=${this.data.currentType}`)
      .then(resp => {
        this.setData({
          // 更改信息并将页数初始化
          piaoInfo: resp.data.data.result,
          currentCity: e.currentTarget.dataset.id.id,
          currentCityName: e.currentTarget.dataset.id.name,
          page: 2
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 更改类型
  changeUrlType(e) {
    this.setData({ sort_status: ['sort_hide', 'sort_hide'] });
    ajax.get(`/api/ticket/project/listV2?version=133&page=1&pagesize=20&platform=web&area=${this.data.currentCity}&p_type=${e.currentTarget.dataset.id}`)
      .then(resp => {
        this.setData({
          // 更改信息并将页数初始化
          piaoInfo: resp.data.data.result,
          currentType: e.currentTarget.dataset.id,
          page: 2
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 加载更多
  getMore() {
    ajax.get(`/api/ticket/project/listV2?version=133&page=${this.data.page}&pagesize=20&platform=web&area=${this.data.currentCity}&p_type=${this.data.currentType}`)
      .then(resp => {
        this.setData({
          piaoInfo: this.data.piaoInfo.concat(resp.data.data.result)
        })
      })
      .catch(error => {
        console.log(error)
      }),
      this.data.page += 1
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  // 初次加载默认为访问全国,全部类型
  onLoad: function (options) {
    ajax.get('/api/ticket/project/listV2?version=133&page=1&pagesize=20&platform=web&area=-1&p_type=%E5%85%A8%E9%83%A8%E7%B1%BB%E5%9E%8B')
    .then(resp => {
      this.setData({
        piaoInfo: resp.data.data.result
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
})
