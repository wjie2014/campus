var app = getApp();

Page({

  data: {
    contactList: [],
    countryIndex: 0,
    focus: false,
    inputValue: '',
    orderName: '',
    orderContent: ''
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }

    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    //或者直接返回字符串,光标在最后边
    //return value.replace(/11/g,'2'),
  }, onLoad: function () {
    var that = this;
    wx.setNavigationBarTitle({ title: '学生申请' });
    //校验表单
    this.WxValidate = app.wxValidate(
      {
        orderName: {
          required: true
        },
        orderContent: {
          required: true
        }

      }
      , {
        // orderName: {
        //   required: '请填写任务名称'
        // },
        orderContent: {
          required: '请输入请假原因'
        }

      }
    )
    wx.request({
      url: app.serverUrl + 'api/contact/allSelect', //仅为示例，并非真实的接口地址
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          contactList: res.data
        });
      }
    })
  }, submit: function (e) {
    var that = this;
    console.log("提交任务数据");
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        duration: 2000
      })
      return false
    }
    var customerId = that.data.contactList[that.data.countryIndex].id;
    wx.request({
      url: app.serverUrl + 'api/order/add',
      data: {
        orderName: e.detail.value.orderName,
        orderContent: e.detail.value.orderContent
        , orderDate: e.detail.value.date + " " + e.detail.value.time
        , customerId: customerId + ''
        , openid: app.globalData.openid

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          orderName: '',
          orderContent: ''
        })
      }
    })
  }
})