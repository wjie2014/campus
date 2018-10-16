// pages/find/find.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    acticitys:[],
    url: app.domain,
    hidden: false,
    hiddenMore: true,
    loadMoreText: "加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发现'
    });
    var that = this;
    wx.request({
      url: app.serverUrl + 'activity/getAllActivity',
      data: {
        page:that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          acticitys: res.data
        });
        that.data.page++;
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          hidden: true
        })
      },
      error: function (re) {
        that.setData({
          hidden: true
        })
      }
    });
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    this.setData({
      page:1
    });
    this.setData({
      loadMoreText: "加载中..."
    });
    console.log("pullDownRefresh");
    this.setData({
      hiddenMore: true
    });
    this.onLoad();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载更多");
    var that = this;
    that.setData({
      hiddenMore: false
    });
    wx.request({
      url: app.serverUrl + 'activity/getAllActivity',
      data: {
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var list = that.data.acticitys;
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
        that.setData({
          acticitys: list
        });
        if (res.data.length == 0) {
          that.setData({
            loadMoreText: "我是有底线的"
          });
        } else {
          that.data.page++;
        }
        wx.stopPullDownRefresh() //停止下拉刷新
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goActivity:function(e){
    let sign = JSON.stringify(e.currentTarget.dataset.item);
    console.log(sign);
    wx.navigateTo({
      url: '../activity/activity?activity=' + sign
    })
  }
})