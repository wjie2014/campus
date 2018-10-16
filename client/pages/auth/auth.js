// pages/auth/auth.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  getUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //更新到数据库
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e.detail.userInfo);
    console.log(app.globalData.userInfo);
    //获取用户资料
    var that = this;
    wx.request({
      url: app.serverUrl + 'wx/login/saveUserInfo',
      data: {
        openid: app.globalData.openid,
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
        console.log("==========" + res.data);
        wx.setStorage({
          key: "refreshHome",
          data: "1"
        });
        //最后，记得返回刚才的页面
        wx.navigateBack({
          delta: 1
        })
      }
    });
  
  }
})