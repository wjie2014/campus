// pages/addFollow/addFollow.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ""
  },
  //获取用户输入的用户名
  contentInput: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  submit: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'followUp/add',
      data: {
        'content': that.data.content,
        'openId': app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data == 1) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 3000
          })
          wx.setStorage({
            key: "refreshFollow",
            data: "1"
          });
          wx.navigateBack(); //返回上一个页面
        } else {
          wx.showToast({
            title: '发布失败，请重试！',
            icon: 'error',
            duration: 3000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '现在写',
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

  }
})