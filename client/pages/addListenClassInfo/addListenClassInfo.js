// pages/addListenClassInfo/addListenClassInfo.js
var app = getApp();
const { $Toast } = require('../../iView/dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:"",
    hideAlert:true,
    classInfos: [],
    className: "",
    classId: "",
    teachers: [],
    teacherName: "",
    teacherId: "",
    courses: [],
    courseName: "",
    courseId: "",
    courseTypes: [{
      "id": "1",
      name: "精品课程"
    }, {
      "id": "2",
      name: "普通课程"
    }],
    typeName: "",
    typeId: "",
    date: '',
    time: '',
    content:''
  },
  //获取用户输入的用户名
  contentInput: function (e) {
    this.setData({
      content: e.detail.detail.value,
      hideAlert:true
    })
  },
  bindClassPickerChange: function(e) {
    this.setData({
      className: this.data.classInfos[e.detail.value].name,
      classId: this.data.classInfos[e.detail.value].id,
      courseName:"",
      courseId:"",
      teacherId:"",
      teacherName:"",
      hideAlert: true
    })
    this.getTeacherData()
  },
  bindTeacherPickerChange: function(e) {
    this.setData({
      teacherName: this.data.teachers[e.detail.value].name,
      teacherId: this.data.teachers[e.detail.value].id,
      courseId:"",
      courseName:""
    })
    this.getCourseData()
    this.setData({
      hideAlert: true
    })
  },
  bindCoursePickerChange: function(e) {
    this.setData({
      courseName: this.data.courses[e.detail.value].name,
      courseId: this.data.courses[e.detail.value].id
    })
    this.setData({
      hideAlert: true
    })
  },
  bindCourseTypePickerChange: function(e) {
    this.setData({
      typeName: this.data.courseTypes[e.detail.value].name,
      typeId: this.data.courseTypes[e.detail.value].id
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
  bindContentChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  getClassInfoData: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'classInfo/list/1/100',
      success: function (res) {
        console.log( res.data)
        that.setData({
          classInfos:res.data.list
        })
      }
    })
  },
  getTeacherData: function (e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'teacher/getTeacherByClassId/'+that.data.classId,
      success: function (res) {
        console.log(res.data)
        that.setData({
          teachers: res.data
        })
      }
    })
  },
  getCourseData: function (e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'courseInfo/getCourseByTeacher/' + that.data.teacherId,
      success: function (res) {
        console.log(res.data)
        that.setData({
          courses: res.data
        })
      }
    })
  },
  
  handleClick:function(e){
    console.log(this.data.classId)
    console.log(this.data.content)

     if(this.data.classId==''){
       this.setData({
         hideAlert:false,
         message:"请选择班级"
       })
       return
     }
    if (this.data.teacherId == '') {
      this.setData({
        hideAlert: false,
        message: "请选择教师"
      })
      return
    }
    if (this.data.courseId == '') {
      this.setData({
        hideAlert: false,
        message: "请选择科目"
      })
      return
    }
    if (this.data.typeId == '') {
      this.setData({
        hideAlert: false,
        message: "请选择类型"
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
        message: "请填写章节课题"
      })
      return
    }
    console.log("提交")
    let that = this
    wx.request({
      url: app.serverUrl + 'listenClassInfo/add',
      method:"POST",
      data:{
        "classId":that.data.classId,
        "subjectId": that.data.courseId,
        "teacherId":that.data.teacherId,
        "type":that.data.typeId,
        "content":that.data.content,
        "listenDate":that.data.date+" "+that.data.time
      },
      success: function (res) {
        console.log(res.data)
        if (res.data==1){
          $Toast({
            content: '保存成功',
            type: 'success'
          });
          that.setData({
            className: "",
            classId: "",
            teacherName: "",
            teacherId: "",
            courseName: "",
            courseId: "",
            date: '',
            time: '',
            content: ''
          })
          wx.setStorage({
            key: "refreshListenClassInfo",
            data: "1"
          });
        }else{
          $Toast({
            content: '保存失败',
            type: 'error'
          });
        }
        
      },
      error:function(){
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