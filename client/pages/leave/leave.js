// pages/notice/notice.js
var app = getApp();

//引用外部文件（需要暴露util.js里面的formatNumber()函数）
var TimeUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leaveList: [],
    page:1,
    pageSize:10,
    hasNextPage:true,
    loadMoreText:""

  },
  getLeave:function(){
    let that = this
    wx.request({
      url: app.serverUrl + 'studentLeave/list/'+that.data.page+"/"+that.data.pageSize,
      data: {
        page: that.data.page,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if(that.data.page==1){
          that.setData({
            leaveList: [],
          })
        }   
        var leaveList = that.data.leaveList
        for (var i = 0; i < res.data.list.length; i++) {
          leaveList.push(res.data.list[i])
        }
        that.setData({
          leaveList: leaveList
        });
        if (res.data.hasNextPage==true){
          that.data.page++;
          that.setData({
            hasNextPage: true,
            loadMoreText: "加载中..."
          })
        }else{
          that.setData({
            hasNextPage:false,
            loadMoreText:"我是有底线的"
          })
        }
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '请假'
    })
    this.getLeave()
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
    var that = this;
    wx.getStorage({
      key: 'refreshLeaveClassInfo',
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshLeaveClassInfo",
              data: "0",
              page:1
            });
            that.onPullDownRefresh();
          }
        }
      }
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
     this.setData({
       page:1
     })
     this.getLeave()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载更多")
    if (this.data.hasNextPage==true){
      this.getLeave()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  handleChange:function(e){
    wx.navigateTo({
      url: '../addLeave/addLeave',
    })
  }
})