// pages/sign/sign.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    signList: [],
    activityList: [],
    page: 1,
    activity: {},
    hidden: false,
    url: app.domain,
    hiddenMore: true,
    clear: false,
    loadMoreText: "加载中...",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options.activity);
    let activity = JSON.parse(options.activity);

    that.setData({
      activity: activity
    });
    wx.setNavigationBarTitle({
      title: activity.title
    });
    that.data.page = 1;
    this.loadSignData();

    // wx.request({
    //   url: app.serverUrl + 'api/sign/list',
    //   data: {
    //     page: that.data.page,
    //     openId: app.globalData.openid,
    //     type:that.data.activity.id
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       signList: res.data
    //     });
    //     that.data.page++;
    //     wx.stopPullDownRefresh() //停止下拉刷新
    //     that.setData({
    //       hidden: true
    //     })
    //   }
    // });

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
    console.log("onShow")
    var that = this;
    wx.getStorage({
      key: 'refreshSign',
      success: function(res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshSign",
              data: "0"
            });
            that.setData({
              clear: true
            })
            that.data.page = 1;
            that.loadSignData()
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
    console.log("onPullDownRefresh")
    this.setData({
      hiddenMore: true
    });
    this.setData({
      loadMoreText: "加载中..."
    });
    this.setData({
      clear: true
    })
    this.data.page = 1;
    this.loadSignData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that=this
    console.log("onReachBottom");
    that.setData({
      loadMoreText: "加载中..."
    });
    that.setData({
      hiddenMore: false
    });
    this.loadSignData();
  },
  loadSignData: function(e) {
    var that = this;
    console.log(that.data.page)
    wx.request({
      url: app.serverUrl + 'api/sign/list',
      data: {
        page: that.data.page,
        openId: app.globalData.openid,
        type: that.data.activity.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (that.data.clear) {
          that.setData({
            signList: []
          })
          that.setData({
            clear: false
          })
        }
        console.log(that.data.signList)
        var list = that.data.signList;
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
        console.log(that.data.clear)
        console.log(that.data.clear)
        console.log(that.data.clear)
        console.log(that.data.clear)
        console.log(that.data.clear)
        console.log(that.data.clear)

      
        console.log(list)

        that.setData({
          signList: list
        });
        console.log(that.data.signList)

        if (res.data.length == 0) {
          that.setData({
            loadMoreText: "我是有底线的"
          });
          that.setData({
            hiddenMore: false
          });
        } else {
          that.data.page++;
        }
        that.setData({
          hidden: true
        })
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  add: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e.detail.userInfo);
    console.log(app.globalData.userInfo);

    //获取用户资料
    var that = this
    wx.request({
      url: app.serverUrl + 'wx/login/saveUserInfo',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        language: app.globalData.userInfo.language,
        city: app.globalData.userInfo.city,
        province: app.globalData.userInfo.province,
        avatarUrl: app.globalData.userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("==========" + res.data)
      }
    });
    console.log(e);
    let type = e.currentTarget.dataset.id;
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/addSign/addSign?type=" + type
    })
  },
  imageShow: function(e) {
    var index = e.target.dataset.id;
    var now = e.target.dataset.now;
    console.log(now);
    console.log(index);
    var tempImgArr = [];
    var imgArr = this.data.signList[now].imgs;
    for (var i = 0; i < imgArr.length; i++) {
      var urlPrex = imgArr[i];
      tempImgArr.push(app.domain + urlPrex);
    }

    console.log(tempImgArr);
    wx.previewImage({
      current: tempImgArr[index], //当前图片地址
      urls: tempImgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  likes: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.serverUrl + 'wx/likes/add',
      data: {
        openId: app.globalData.openid,
        signId: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        var signList = that.data.signList;
        if (res.data.code == 200) {
          for (var i in signList) {
            if (signList[i].id == id) {
              signList[i].likes = true;
              signList[i].likeSCount = parseInt(signList[i].likeSCount) + 1
            }
          }
          that.setData({
            signList: signList
          })
        } else {
          for (var i in signList) {
            if (signList[i].id == id) {
              signList[i].likes = false;
              var likesCount = parseInt(signList[i].likeSCount);
              if (likesCount > 0) {
                signList[i].likeSCount = signList[i].likeSCount - 1;
              }
            }
          }
          that.setData({
            signList: signList
          })
          // console.log(that.data.signList);

        }
      }
    });
  },
  goDetail: function(e) {
    let sign = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/signDetail/signDetail?sign=' + sign
    })
  },
  goActivity: function(e) {
    console.log(e.currentTarget.dataset.item);
    let activity = JSON.stringify(e.currentTarget.dataset.item);
    console.log(activity);
    // wx.navigateTo({
    //   url: '/pages/sign/signActivityList?type=' + id
    // })
  },
  bindPlay: function() {
    console.log("开始播放");
  },
  bindended: function() {
    console.log("播放结束");
  },
  onShareAppMessage: function(res) {
    console.log(res);
    let sign = JSON.stringify(res.target.dataset.item);
    console.log(res.target.dataset.item.content);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: res.target.dataset.item.content,
      path: '/pages/signDetail/signDetail?sign=' + sign,
      imageUrl: '/pages/images/logo.jpg'
    }
  },
  comment: function(e) {
    var item = e.currentTarget.dataset.item
    let sign = JSON.stringify(item);
    if (item.commentCount > 0) {
      wx.navigateTo({
        url: '/pages/signDetail/signDetail?sign=' + sign
      })
    } else {
      wx.navigateTo({
        url: '/pages/comment/comment?sign=' + sign
      });
    }
  },
  delete: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log("取消圈子")
    wx.showModal({
      title: '提示',
      content: '确定取消加入此圈子吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('确定')
          wx.request({
            url: app.serverUrl + 'activity/deleteActivityWxUser/' + id,
            data: {
              // id: id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              console.log("==========" + res.data)
              if (res.data.code == 200) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 3000
                })
                wx.setStorage({
                  key: "refreshActivity",
                  data: "1"
                });
              } else {
                wx.showToast({
                  title: '取消失败',
                  icon: 'error',
                  duration: 3000
                })
              }

            }
          });
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  }
})