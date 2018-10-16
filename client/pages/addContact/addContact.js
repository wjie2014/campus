var app = getApp()
Page({
  data: {
    focus: false,
    name: '',
    mobile: '',
    address: '',
    detail: ''
  },
  //获取用户输入的用户名
  detailInput: function (e) {
    this.setData({
      detail: e.detail.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.detail.value
    })
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '添加联系人'
    });
    //校验表单
    this.WxValidate = app.wxValidate({
      name: {
        required: true
      }
    }, {
      name: {
        required: '请填写客户姓名'
      }
    })
  },
  submit: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/contact/add', //仅为示例，并非真实的接口地址
      data: {
        name: that.data.name,
        mobile: that.data.mobile,
        address: that.data.address,
        detail: that.data.detail,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data);
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 3000
        })
        wx.setStorage({
          key: "refreshContect",
          data: "1"
        });
        wx.navigateBack(); //返回上一个页面
      }
    })
  }
})