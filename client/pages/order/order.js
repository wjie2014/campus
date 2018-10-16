var app = getApp();
Page({
  data: {
    orderList: [],
    page: 1
  },
  onLoad: function () {
    var that = this;
    that.data.page = 1;
    wx.setNavigationBarTitle({ title: '全部任务' });
    wx.request({
      url: app.serverUrl +'api/order/list', 
      data: {
        page: that.data.page,
                 openid: app.globalData.openid

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          orderList: res.data
        });
        that.data.page++;
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  calling: function (e) {
    var phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    console.log("下拉刷新");
    this.onLoad();
  },
  onReachBottom: function () {
    console.log("加载更多");
    var that = this;
    wx.request({
      url: app.serverUrl +'api/order/list', 
      data: {
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var list = that.data.orderList;
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
        that.setData({
          orderList: list
        });
        that.data.page++;
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onShow: function () {
    var that = this;
  
  },
  delete: function (e) {
    var that = this;
    var index =  e.currentTarget.index;
    wx.showModal({
      title: '提醒',
      content: '确定要删除此订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.serverUrl +'api/order/delete',
            data: {
              id: e.currentTarget.id            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              //通过`index`识别要删除第几条数据，第二个数据为要删除的项目数量，通常为1
              that.data.orderList.splice(index, 1);
              //渲染数据
              that.setData({
                orderList: that.data.orderList
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  confirm: function (e) {
    var that = this;
    var index = e.currentTarget.index;
          wx.request({
            url: app.serverUrl +'api/order/confirm',
            data: {
              id: e.currentTarget.id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data); 
              that.onLoad();
            }
          })
  }
})