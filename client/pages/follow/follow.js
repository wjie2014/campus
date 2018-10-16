// pages/follow/follow.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'homepage',
    followUpList: [],
    page: 1,
    count:'',
    hidden: false,
    hiddenMore: true,
    loadMoreText: "加载中..."
  },

  add: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e.detail.userInfo);
    console.log(app.globalData.userInfo);

    //获取用户资料
    var that = this
    wx.request({
      url: app.serverUrl + 'wx/login/saveUserInfo',
      data: {
        openId: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        language: app.globalData.userInfo.language,
        city: app.globalData.userInfo.city,
        province: app.globalData.userInfo.province,
        avatarUrl: app.globalData.userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("==========" + res.data)
      }
    });
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: "../addFollow/addFollow"
    })
  },
  handleChange({ detail }) {
    wx.navigateTo({
      url: '../addFollow/addFollow',
    })
  },
  getData:function(e){
    var that=this
    console.log(that.data.page)
    wx.request({
      url: app.serverUrl + 'followUp/list/' + that.data.page,
      data: {
        openId: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(that.data.page==1){
          that.setData({
          followUpList: []
          })
        }
        var list = that.data.followUpList;
        console.log(list);
        for (var i = 0; i < res.data.list.length; i++) {
          list.push(res.data.list[i]);
        }
        that.setData({
          followUpList: list,
          count: res.data.total
        });
        if (res.data.list.length == 0) {
          that.setData({
            loadMoreText: "我是有底线的"
          });
        } else {
          that.data.page++;
        }
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
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      wx.setNavigationBarTitle({
        title: '随笔',
      })
      this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'refreshFollow',
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshFollow",
              data: "2"
            });
            that.setData({
              page:1
            })
            that.onLoad();
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      hiddenMore: true,
      loadMoreText: "加载中...",
      page: 1
    });
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    console.log("onReachBottom");
    that.setData({
      loadMoreText: "加载中..."
    });
    that.setData({
      hiddenMore: false
    });
     this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})