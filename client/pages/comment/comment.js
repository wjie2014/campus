// pages/comment/comment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign:{},
    content:"",
    refresh:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发表评论'
    });
    let sign = JSON.parse(options.sign);
    let refresh = options.refresh;
    console.log(sign);
    this.setData({
      sign: sign
    });
    this.setData({
      refresh: refresh
    });
    var that = this;
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
  //获取用户输入的用户名
  contentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit:function(e){
    var that =this;
    wx.request({
      url: app.serverUrl + 'api/comment/add',
      data: {
        'content': that.data.content,
        'signId': that.data.sign.id,
        'openId': app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 3000
        })
        if (that.data.refresh==1){
          wx.setStorage({
            key: "refreshComment",
            data: "1"
          });
        }
        wx.navigateBack(); //返回上一个页面
      }
    })
  }
})