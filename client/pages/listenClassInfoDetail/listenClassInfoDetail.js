// pages/listenClassInfoDetail/listenClassInfoDetail.js
let app = getApp()
const {
  $Toast
} = require('../../iView/dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listenClassInfo: {},
    teachers: [],
    current: [],
    currentIds: [],
    position: 'left',
    animal: '',
    checked: false,
    disabled: false,
    evaluationClassInfos: [],
    evaluationClassInfo:{},
    addTeacherFlag:false,
    addEvaluateFlag:false
  },
  addEvaluate: function(e) {
    let listenClassInfo = JSON.stringify(this.data.listenClassInfo);
    let evaluationClassInfo = JSON.stringify(this.data.evaluationClassInfo)
    wx.navigateTo({
      url: '../addListenClassInfoEvaluate/addListenClassInfoEvaluate?listenClassInfo=' + listenClassInfo + "&evaluationClassInfo=" + evaluationClassInfo
    })
  },
  getListenClassInfoData: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'teacher/listAll',

      success: function(res) {
        console.log(res.data)
        that.setData({
          teachers: res.data
        })
      }
    })
  },
  getListenClassInfoIds: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'evaluationClassInfo/listByListenClassInfoId/' + that.data.listenClassInfo.id,

      success: function(res) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < that.data.teachers.length; j++) {
            if (res.data[i].listenTeacherId == that.data.teachers[j].id) {
              that.data.current.push(that.data.teachers[j].name)
              that.setData({
                current: that.data.current
              });

              that.data.currentIds.push(that.data.teachers[j].id)
              that.setData({
                currentIds: that.data.currentIds
              });
            }
          }
        }
        console.log(that.data.current)
        console.log(that.data.currentIds)
      }
    })
  },
  submit: function() {
    console.log("添加听课人")
    console.log(this.data.currentIds)
    console.log(this.data.listenClassInfo.id)
    let that = this
    console.log(JSON.stringify(that.data.currentIds))
    wx.request({
      url: app.serverUrl + 'evaluationClassInfo/addBatch',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'listenClassInfoId': that.data.listenClassInfo.id,
        'listenTeacherIds': that.data.currentIds
      },
      success: function(res) {
        console.log(res.data)
        if (res.data > 1) {
          $Toast({
            content: '保存成功',
            type: 'success'
          });
        } else {
          $Toast({
            content: '保存失败',
            type: 'error'
          });
        }
      }
    })
  },
  getEvaluate: function(e) {

    let that = this
    let listenClassInfoId = that.data.listenClassInfo.id
    wx.request({
      url: app.serverUrl + 'evaluationClassInfo/listByListenClassInfoId/' + listenClassInfoId,
      method: "GET",
      success: function(res) {
        console.log(res.data)
        that.setData({
          evaluationClassInfos: res.data
        })
        
        for(var i=0;i<res.data.length;i++){
          console.log(res.data[i])

          if (res.data[i].listenTeacherId==app.teacherId){
          
             that.setData({
               evaluationClassInfo: res.data[i],
               addEvaluateFlag:true
             })
           }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let listenClassInfo = JSON.parse(options.listenClassInfo);
    console.log(listenClassInfo);
    this.setData({
      listenClassInfo: listenClassInfo
    })
    this.getListenClassInfoIds()
    if (app.role==2){
      this.setData({
        addTeacherFlag:true
      })
      this.getListenClassInfoData()
    }
    this.getEvaluate()
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
      key: 'refreshEvaluateListen',
      success: function(res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshEvaluateListen",
              data: "0"
            });
            that.getEvaluate();
          }
        }
      }
    })
  },
  handleFruitChange(e) {
    console.log(e)
    // currentIds
    let detail = e.detail
    const index = this.data.current.indexOf(detail.value)
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1)
    this.setData({
      current: this.data.current
    });

    const indexId = this.data.currentIds.indexOf(e.currentTarget.dataset.tearcherid)
    indexId === -1 ? this.data.currentIds.push(e.currentTarget.dataset.tearcherid) : this.data.currentIds.splice(index, 1)
    this.setData({
      currentIds: this.data.currentIds
    });
    console.log(this.data.currentIds)

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