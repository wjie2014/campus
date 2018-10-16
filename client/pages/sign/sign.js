// pages/sign/sign.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    signList: [],
    activityList:[],
    page: 1,
    url: app.domain,
    showAdd:false,
    hidden:false,
    hiddenMore: true,
    loadMoreText:"加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '圈子'
    });
    this.getMyActivity()
    var that = this;
    that.data.page = 1;
    wx.request({
      url: app.serverUrl + 'api/sign/list',
      data: {
        page: that.data.page,
        openId: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          signList: res.data
        });
        that.data.page++;
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          hidden:true
        })
      },
      error:function(re){
        that.setData({
          hidden:true
        })
      }
    });
  
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
            that.onLoad();
          }
        }
      }
    })
    wx.getStorage({
      key: 'refreshActivity',
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshActivity",
              data: "0"
            });
            //刷新圈子
            that.getMyActivity()
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
    this.setData({
      hiddenMore: true
    });
    this.setData({
      loadMoreText: "加载中..."
    });
    this.onLoad();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getMyActivity:function(e){
    var that = this
    wx.request({
      url: app.serverUrl + 'api/sign/getMyActivity',
      data: {
        openId: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          that.setData({
            showAdd: true
          })
        } else {
          that.setData({
            showAdd: false
          })
        }
        that.setData({
          activityList: res.data
        });
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    console.log("onReachBottom");
    that.setData({
      loadMoreText: "加载中..."
    });
    that.setData({
      hiddenMore: false
    });
    wx.request({
      url: app.serverUrl + 'api/sign/list',
      data: {
        page: that.data.page,
        openId: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        var list = that.data.signList;
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
        that.setData({
          signList: list
        });
        if (res.data.length==0){
          that.setData({
            loadMoreText: "我是有底线的"
          });
        }else{
          that.data.page++;
        }
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
    var imgArr = this.data.signList[now].imgs;
    var tempImgArr=[];
    for (var i = 0; i < imgArr.length;i++){
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
  goActivity:function(e){
    var activityTemp = e.currentTarget.dataset.item;
    console.log(activityTemp)
    activityTemp.content="";
    let activity = JSON.stringify(activityTemp);
    wx.navigateTo({
      url: '/pages/signType/signType?activity=' + activity
    })
  },
  bindPlay: function () {
    console.log("开始播放");
  },
  bindended:function(){
    console.log("播放结束");
  },
  onShareAppMessage: function (res) {
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
      imageUrl:'/pages/images/logo.jpg'
    }
  },
  comment:function(e){
    var item = e.currentTarget.dataset.item
    let sign = JSON.stringify(item);
    // wx.navigateTo({
    //   url: '/pages/signDetail/signDetail?sign=' + sign
    // });
    if (item.commentCount>0){
      wx.navigateTo({
        url: '/pages/signDetail/signDetail?sign=' + sign
      })
    }else{
      wx.navigateTo({
        url: '/pages/comment/comment?sign=' + sign
      });
    }

  },
  goCircle:function(e){
    console.log("加入圈子")
    if (this.data.showAdd){
      wx.switchTab({
        url: '../find/find'
      });
    }
  }
})