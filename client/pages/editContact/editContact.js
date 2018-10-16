var app = getApp();
Page({
  data: {
    focus: false,
    name: '',
    mobile: '',
    address: '',
    detail: '',
    id: '',
    index:'',
    item:''
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
  }, onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '编辑联系人信息' });
    this.setData({
      id: options.id,
      index: options.index,
      item:options.item
    })   
    var that = this;
    wx.request({
      url: app.serverUrl +'api/contact/findById', 
      data: {
        id: options.id
        },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          name: res.data.name
        }) ;
        that.setData({
          mobile: res.data.mobile
        });
        that.setData({
          address: res.data.address
        });
        that.setData({
          detail: res.data.detail
        }); 
      }
    })
  },
  submit:function(e){
    var that = this;
    wx.request({
      url: app.serverUrl +'api/contact/edit', 
      data: {
        id: that.data.id,
        name: that.data.name,
        mobile: that.data.mobile,
        address: that.data.address,
        detail: that.data.detail,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: '修改成功',
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