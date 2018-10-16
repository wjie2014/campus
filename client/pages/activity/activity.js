// pages/activity/activity.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    url: app.domain

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let activity = JSON.parse(options.activity);
    console.log(activity);
    this.setData({
      activity: activity
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  submit: function(e) {
    console.log("加入圈子")
    var id = e.target.dataset.id
    wx.request({
      url: app.serverUrl + 'activity/addActivityWxUser/' + id,
      data: {
        'openId': app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 3000
          })
          wx.setStorage({
            key: "refreshActivity",
            data: "1"
          });
        }else{
          wx.showToast({
            title: '加入失败',
            icon: 'error',
            duration: 3000
          })
        }
      }
    })
  }
})