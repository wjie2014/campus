// pages/addRepair/addRepair.js
var app = getApp();
const {
  $Toast
} = require('../../iView/dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '',
    hideAlert: true,
    applicantName: "",
    address: "",
    description: "",
    remarks: "",
    typeId: "1",
    typeName: "设备报修",
    types: [{
      "id": "1",
      "name": "设备报修"
    }, {
      "id": "2",
      "name": "总务报修"
    }]
  },

  getRemarks: function(e) {
    var val = e.detail.detail.value
    this.setData({
      remarks: val,
      hideAlert: true

    });

  },
  getDescription: function(e) {
    var val = e.detail.detail.value
    this.setData({
      description: val,
      hideAlert: true

    });

  },
  getApplicantName: function(e) {
    var val = e.detail.detail.value
    this.setData({
      applicantName: val,
      hideAlert: true
    });

  },
  getAddress: function(e) {
    var val = e.detail.detail.value
    console.log(val)
    this.setData({
      address: val,
      hideAlert: true

    });
  },
  handleClick: function(e) {
  
    if (this.data.applicantName == '') {
      this.setData({
        hideAlert: false,
        message: "请输入申请人姓名"
      })
      return
    }
    if (this.data.address == '') {
      this.setData({
        hideAlert: false,
        message: "请输入故障班级"
      })
      return
    }
    if (this.data.description == '') {
      this.setData({
        hideAlert: false,
        message: "请输入故障现象"
      })
      return
    }

    let that = this
    wx.request({
      url: app.serverUrl + 'repairServiceSheet/add',
      method: "POST",
      data: {
        "address": that.data.address,
        "description": that.data.description,
        "applicantName": that.data.applicantName,
        "remarks": that.data.remarks,
        "type": that.data.typeId
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          $Toast({
            content: '保存成功',
            type: 'success'
          });
          that.setData({
            address: "",
            description: ""
          })
          wx.setStorage({
            key: "refreshRepair",
            data: "1"
          });
        } else {
          $Toast({
            content: '保存失败',
            type: 'error'
          });
        }

      },
      error: function () {
        $Toast({
          content: '保存失败',
          type: 'error'
        });
      }
    })
  },
  bindTypePickerChange: function(e) {
    this.setData({
      typeName: this.data.types[e.detail.value].name,
      typeId: this.data.types[e.detail.value].id,
      hideAlert: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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