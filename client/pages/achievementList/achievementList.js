// pages/achievementList/achievementList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examTimes:[]
  
  },

  getData:function(){
    let that= this
    wx.request({
      url: app.serverUrl + 'achievement/getExamTimes',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
       
        var list = that.data.examTimes;
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
        console.log(list)
        that.setData({
          examTimes: list
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '成绩',
    })
  this.getData()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goAchievement:function(e){
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;

    // console.log(achievement);
    wx.navigateTo({
      url: '../achievement/achievement?id='+id+'&name='+name
    })
  }
})