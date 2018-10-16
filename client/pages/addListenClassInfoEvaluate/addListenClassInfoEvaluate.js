// pages/addListenClassInfoEvaluate/addListenClassInfoEvaluate.js
var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starIndex: 0,
    studentPerformance: "",
    teacherPerformance: "",
    comprehensivePerformance: "",
    advise: "",
    listenClassInfo: {}
  },
  onChange(e) {
    const index = e.detail.index;
    this.setData({
      'starIndex': index
    })
  },
  studentPerformanceInput: function(e) {
    console.log(e)
    this.setData({
      studentPerformance: e.detail.detail.value
    })
  },
  teacherPerformanceInput: function(e) {
    this.setData({
      teacherPerformance: e.detail.detail.value
    })
  },
  comprehensivePerformanceInput: function(e) {
    this.setData({
      comprehensivePerformance: e.detail.detail.value
    })
  },
  adviseInput: function(e) {
    this.setData({
      advise: e.detail.detail.value
    })
  },

  handleClick: function(e) {
    console.log(this.data.starIndex)
    console.log(this.data.studentPerformance)
    console.log(this.data.teacherPerformance)
    console.log(this.data.comprehensivePerformance)
    console.log(this.data.advise)
    let that = this
    wx.request({
      url: app.serverUrl + 'evaluationClassInfo/update',
      method: "POST",
      data: {
        level: that.data.starIndex,
        studentPerformance: that.data.studentPerformance,
        teacherPerformance: that.data.teacherPerformance,
        comprehensivePerformance: that.data.comprehensivePerformance,
        advise: that.data.advise,
        listenClassInfoId: that.data.listenClassInfo.id,
        listenTeacherId: app.teacherId 
      },
      success: function(res) {
        console.log(res.data)
        if (res.data == 1) {
          $Toast({
            content: '保存成功',
            type: 'success'
          });
          wx.setStorage({
            key: "refreshEvaluateListen",
            data: "1"
          });
          wx.navigateBack(); //返回上一个页面
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let listenClassInfo = JSON.parse(options.listenClassInfo)
    let evaluationClassInfo = JSON.parse(options.evaluationClassInfo)
    console.log(listenClassInfo)
    console.log(evaluationClassInfo)
    this.setData({
      listenClassInfo: listenClassInfo,
      starIndex: evaluationClassInfo.level,
      studentPerformance: evaluationClassInfo.studentPerformance,
      teacherPerformance: evaluationClassInfo.teacherPerformance,
      comprehensivePerformance: evaluationClassInfo.comprehensivePerformance,
      advise: evaluationClassInfo.advise,
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