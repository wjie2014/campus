// pages/addLeave/addLeave.js
var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "",
    hideAlert: true,
    classInfos: [],
    className: "",
    classId: "",
    studentName: "",
    studentId: "",
    date: '',
    time: '',
    content: ''
  },
  //获取用户输入的用户名
  contentInput: function(e) {
    this.setData({
      content: e.detail.detail.value,
      hideAlert: true
    })
  },
  bindClassPickerChange: function(e) {
    this.setData({
      className: this.data.classInfos[e.detail.value].name,
      classId: this.data.classInfos[e.detail.value].id,
      hideAlert: true
    })
    this.getStudentData()
  },
  bindStudentPickerChange: function(e) {
    this.setData({
      studentName: this.data.students[e.detail.value].name,
      studentId: this.data.students[e.detail.value].id
    })
    this.setData({
      hideAlert: true
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.setData({
      hideAlert: true
    })
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
    this.setData({
      hideAlert: true
    })
  },
  bindContentChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  getClassInfoData: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'classInfo/list/1/100',
      success: function(res) {
        console.log(res.data)
        that.setData({
          classInfos: res.data.list
        })
      }
    })
  },
  getStudentData: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'student/getStudentByParams/' + that.data.classId,
      success: function(res) {
        console.log(res.data)
        that.setData({
          students: res.data
        })
      }
    })
  },
  handleClick: function(e) {
    console.log(this.data.classId)
    console.log(this.data.content)

    if (this.data.classId == '') {
      this.setData({
        hideAlert: false,
        message: "请选择班级"
      })
      return
    }
    if (this.data.teacherId == '') {
      this.setData({
        hideAlert: false,
        message: "请选择学生"
      })
      return
    }

    if (this.data.date == '') {
      this.setData({
        hideAlert: false,
        message: "请选择日期"
      })
      return
    }
    if (this.data.time == '') {
      this.setData({
        hideAlert: false,
        message: "请选择时间"
      })
      return
    }
    if (this.data.content == '') {
      this.setData({
        hideAlert: false,
        message: "请填写请假原因"
      })
      return
    }
    let that = this
    console.log("className" + that.data.className)
    console.log("classId" + that.data.classId)
    console.log("studentName" + that.data.studentName)
    console.log("studentId" + that.data.studentId)
    console.log("date" + that.data.date)
    console.log("time" + that.data.time)
    console.log("content" + that.data.content)

    wx.request({
      url: app.serverUrl + 'studentLeave/add',
      method: "POST",
      data: {
        "classInfoId": that.data.classId,
        "studentId": that.data.studentId,
        "reason": that.data.content,
        "createId": app.teacherId,
        "startDate": that.data.date + " " + that.data.time
      },
      success: function(res) {
        console.log(res.data)
        if (res.data == 1) {
          $Toast({
            content: '保存成功',
            type: 'success'
          });
          that.setData({
            className: "",
            classId: "",
            studentName: "",
            studentId: "",
            date: '',
            time: '',
            content: ''
          })
          wx.setStorage({
            key: "refreshLeaveClassInfo",
            data: "1"
          });
        } else {
          $Toast({
            content: '保存失败',
            type: 'error'
          });
        }

      },
      error: function() {
        $Toast({
          content: '保存失败',
          type: 'error'
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '学生请假',
    })
    this.getClassInfoData()
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