var app = getApp();

//引用外部文件（需要暴露util.js里面的formatNumber()函数）
var TimeUtil = require('../../utils/util.js');
Page({
  data: {
    bannerList: [],
    newsList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    page:1,
    url: app.domain,
    menus: [
        {
        "name": "请假",
        "class": "circle-1",
        "url": '../images/alarmclock.png'
      },
      {
        "name": "听课",
        "class":"circle-2",
        "url": '../images/briefcase.png'
      },
      {
        "name": "成绩",
        "class": "circle-3",
        "url": '../images/grid.png'
      },
      {
        "name": "通讯录",
        "class": "circle-4",
        "url": '../images/notebook.png'
      },
      {
        "name": "随笔",
        "class": "circle-5",
        "url": '../images/homework.png'
      },
      {
        "name": "报修",
        "class": "circle-6",
        "url": '../images/tools.png'
      },
      {
        "name": "作业",
        "class": "circle-7",
        "url": '../images/pencil.png'
      }
      ,
      {
        "name": "工资",
        "class": "circle-8",
        "url": '../images/genius.png'
      }
    ]
  },
  onShow:function(){
    var that = this;
    var that = this;
    wx.getStorage({
      key: 'refreshFollow',
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 2) {
            wx.setStorage({
              key: "refreshFollow",
              data: "0"
            });
            that.onLoad();
          }
        }
      }
    })
    // wx.getStorage({
    //   key: 'refreshHome',
    //   success: function (res) {
    //     console.log(res.data);
    //     var data = res.data;
    //     if (data) {
    //       if (data == 1) {
    //         wx.setStorage({
    //           key: "refreshHome",
    //           data: "0"
    //         });
    //         that.onLoad();
    //       }
    //     }
    //   }
    // })
  },
  onLoad:function(){
    var that = this;
    that.getBannerData()
    that.getNewsData()

    that.data.page = 1;  
    console.log("微信登录");
    wx.setNavigationBarTitle({
      title: '首页',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.serverUrl + 'wx/login/login',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data.session_key);
              console.log(res.data.openid);
              app.globalData.openid = res.data.openid;
              wx.request({
                url: app.serverUrl + 'wx/login/saveUserInfo',
                data: {
                      openid: app.globalData.openid
                  // openid: app.globalData.openid,
                  // nickName: app.globalData.userInfo.nickName,
                  // gender: app.globalData.userInfo.gender,
                  // language: app.globalData.userInfo.language,
                  // city: app.globalData.userInfo.city,
                  // province: app.globalData.userInfo.province,
                  // avatarUrl: app.globalData.userInfo.avatarUrl
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res.data)
                }
              });
              //根据openId获取用户相信信息
              wx.request({
                url: app.serverUrl + 'wx/login/getUserInfo', //仅为示例，并非真实的接口地址
                data: {
                  openid: app.globalData.openid
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log("*********************");
                  console.log(res.data);
                  console.log("*********************");
                  if(res.data.nickName==null){
                    wx.showModal({
                      title: '警告',
                      content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定');
                          wx.navigateTo({
                            url: '../auth/auth',
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    
     
  },
  getBannerData:function(){
    let that = this
    wx.request({
      url: app.serverUrl + 'api/banner/getAllArticle',
      data: {
        page: that.data.page,
        type: 19
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          bannerList: res.data
        });
      }
    })
  },
  getNewsData: function () {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/banner/getAllArticle',
      data: {
        page: that.data.page,
        type: 20
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        console.log(that.data.page)
        if (that.data.page == 1) {
          that.setData({
            newsList: []
          })
        }
        var newsList = that.data.newsList
        for (var i = 0; i < res.data.length; i++) {
          newsList.push(res.data[i])
        }
       
        if (res.data.length>0){
          that.setData({
            newsList: newsList
          });
          that.data.page++
        }
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  swipclick: function (event) {
    var postid = event.target.dataset.postid;
    var title = event.target.dataset.title;
      wx.navigateTo({
        url: "../homeSwiperDetail/homeSwiperDetail?id=" + postid + "&title=" + title
      })
  },
  calling: function (e) {
    var phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    console.log("下拉刷新");
    this.setData({
      page:1
    })
    this.getNewsData();
  },
  onReachBottom: function () {
    console.log("加载更多");
    var that = this;
    that.getNewsData()
  },
  goNewsDetail:function(e){
    console.log(e)
    let id = e.target.dataset.item.id
    let title = e.target.dataset.item.title
    wx.navigateTo({
      url: '../newsDetail/newsDetail?id=' + id +"&title="+title,
    })

  },
  goItem: function (e) {

    let index = e.currentTarget.dataset.item;
    console.log(index);
    if (index == 0) {
      wx.navigateTo({
        url: '../leave/leave',
      })
    }else if (index == 1) {
      wx.navigateTo({
        url: '../listenClassInfo/listenClassInfo',
      })
    }else if(index==2){
      wx.navigateTo({
        url: '../achievementList/achievementList',
      })
    } else if (index == 3) {
      wx.navigateTo({
        url: '../contact/contact',
      })
    } else if (index==4){
      wx.navigateTo({
        url: '../follow/follow',
      })
    }
    else if (index == 5) {
      wx.navigateTo({
        url: '../repair/repair',
      })
    }
  }
})

