// pages/find/find.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    id:'',
    name:'',
    achievements: [],
    url: app.domain,
    hidden: false,
    hiddenMore: true,
    loadMoreText: "加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name:options.name
    })
    wx.setNavigationBarTitle({
      title: options.name
    });
    this.getData();
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.setData({
      loadMoreText: "加载中..."
    });
    console.log("pullDownRefresh");
    this.setData({
      hiddenMore: true
    });
    this.getData()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载更多");
    this.getData()
  },
  getData:function(){
    var that = this;
    if (that.data.page > 1) {
      that.setData({
        hiddenMore: false
      });
    }
  
    wx.request({
      url: app.serverUrl + 'achievement/getAchievementServiceByPage/'+that.data.id,
      data: {
        'page': that.data.page,
        'openId': app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(that.data.page==1){
          that.setData({
            page: 1,
            achievements: []
          });
        }
        var list = that.data.achievements;
        for (var i = 0; i < res.data.list.length; i++) {
          list.push(res.data.list[i]);
        }
        that.setData({
          achievements: list
        });
        if (res.data.list.length == 0) {
          that.setData({
            loadMoreText: "我是有底线的"
          });
        } else {
          that.data.page++;
        }
        that.setData({
          hidden: true
        })
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
  goMyAchievement: function (e) {
    let achievement = JSON.stringify(e.currentTarget.dataset.item);
    console.log(achievement);
    wx.navigateTo({
      url: '../achievementDetail/achievementDetail?achievement=' + achievement + '&name=' + this.data.name
    })
  }
})