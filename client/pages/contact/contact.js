var app = getApp();
const {
  $Message
} = require('../../iView/dist/base/index');

Page({
  addContact: function() {
    wx.navigateTo({
      url: "../addContact/addContact"
    })
  },
  clickMe: function() {
    this.setData({
      msg: "Hello World"
    })
  },
  data: {
    contactList: [],
    page: 1,
    id: '',
    phone: '',
    scrollHeight:'',
    parentIndex:'',
    toView: '1',
    scrollTop: 100,
    myIndex:'',
    visible1: false,
    actions1: [{
        name: '拨打电话',
      },
      {
        name: '修改',
      },
      {
        name: '删除'
      }
    ]
  },
  handleOpen1(e) {
    console.log(e.target.dataset.phone)
    console.log(e)
    this.setData({
      visible1: true,
      id: e.target.dataset.id,
      phone: e.target.dataset.phone,
      parentIndex: e.target.dataset.parentindex,
      myIndex: e.target.dataset.myindex
    });
  },
  handleCancel1() {
    this.setData({
      visible1: false,
      id: '',
      phone: ''
    });
  },
  handleClickItem1({
    detail
  }) {
    const index = detail.index;
    console.log(index)
    if (index == 0) {
      this.calling()
    } else if (index == 1) {
      wx.navigateTo({
        url: '../editContact/editContact?id='+this.data.id
      })

    } else {
      this.delete()
    }
  },
  delete: function (e) {
    var that = this;
    wx.showModal({
      title: '提醒',
      content: '确定要删除此联系人吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.request({
            url: app.serverUrl + 'api/contact/delete',
            data: {
              id: that.data.id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              that.handleCancel1()
              that.onPullDownRefresh()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    },
  onLoad: function(e) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
         that.setData({
           scrollHeight:res.windowHeight
         })
      },
    })
    that.data.page = 1;
    wx.setNavigationBarTitle({
      title: '通讯录'
    });
    wx.request({
      url: app.serverUrl + 'api/contact/all', //仅为示例，并非真实的接口地址
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          contactList: res.data
        });
        that.data.page++;
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  calling: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    console.log("下拉刷新");
    this.onLoad();
  },
  onReachBottom: function() {

  },
  onShow: function() {
    var that = this;
    wx.getStorage({
        key: 'refreshContect',
        success: function(res) {
          console.log(res.data);
          var data = res.data;
          if (data) {
            if (data == 1) {
              wx.setStorage({
                key: "refreshContect",
                data: "0"
              });
              that.handleCancel1()
              that.onPullDownRefresh()
            }
          }

        }
      }),
      wx.getStorage({
        key: 'refreshItem',
        success: function(res) {
          console.log(res.data);
          var data = res.data;
          if (data) {
            console.log("修改数据");
            wx.setStorage({
              key: "refreshItem",
              data: ""
            });
            var name = "contactList[" + data.index + "].name";
            var mobile = "contactList[" + data.index + "].mobile";
            var address = "contactList[" + data.index + "].address";
            var detail = "contactList[" + data.index + "].detail";
            that.setData({
              [name]: data.name,
              [mobile]: data.mobile,
              [address]: data.address,
              [detail]: data.detail
            })
          }
        }
      }),
      wx.getStorage({
        key: 'deleteItem',
        success: function(res) {
          console.log("deleteItem" + res.data);
          var data = res.data;
          if (data) {
            console.log("删除数据");
            wx.setStorage({
              key: "deleteItem",
              data: ""
            });
            var index = data;
            //通过`index`识别要删除第几条数据，第二个数据为要删除的项目数量，通常为1
            that.data.contactList.splice(index, 1);
            //渲染数据
            that.setData({
              contactList: that.data.contactList
            });
          }
        }
      });
  },

  onChange(event) {
    console.log(event.detail.index, 'click right menu callback data')
    // this.setData({
    //   toview: event.detail.index
    // })
  }
})