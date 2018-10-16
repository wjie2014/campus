// pages/listenClassInfo/listenClassInfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'homepage',
    listenClassInfos: [],
    page: 1,
    idAdd: false
  },

  handleChange({
    detail
  }) {
    wx.navigateTo({
      url: '../addListenClassInfo/addListenClassInfo',
    })
  },

  getListenClassInfoData: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'listenClassInfo/list/' + that.data.page + '/10',
      success: function(res) {
        console.log(res.data)
        var listenClassInfos = that.data.listenClassInfos
        for (var i = 0; i < res.data.list.length; i++) {
          listenClassInfos.push(res.data.list[i])
        }
        console.log(listenClassInfos)
        that.setData({
          listenClassInfos: listenClassInfos
        })
        that.data.page++
        wx.stopPullDownRefresh() //停止下拉刷新

      }
    })
  },
  goDetail: function(e) {
    let listenClassInfo = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/listenClassInfoDetail/listenClassInfoDetail?listenClassInfo=' + listenClassInfo
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getListenClassInfoData()

    //测试使用，需要在加入账号绑定和模块权限后删除
    if (app.globalData.openid == 'orswI491BLGfPkecPfKq1Uq4ScPo') {
      app.role = '2'
    }
    //测试使用，需要在加入账号绑定和模块权限后删除
    if (app.role == '2') {
      this.setData({
        idAdd: true
      })
    }
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
      key: 'refreshListenClassInfo',
      success: function(res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshListenClassInfo",
              data: "0"
            });

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
    console.log('onPullDownRefresh')
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('onReachBottom')
    this.getListenClassInfoData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})