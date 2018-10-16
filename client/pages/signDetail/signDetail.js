// pages/signDetail/signDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign: {},
    wxUsers: [],
    comments: [],
    url: app.domain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let sign = JSON.parse(options.sign);
    console.log(sign);
    this.setData({
      sign: sign
    });
    var that = this;
    wx.setNavigationBarTitle({
      title: ""
    });
    wx.request({
      url: app.serverUrl + '/wx/likes/getLikesUserInfo/' + sign.id,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let wxUser = res.data;
        console.log("==========" + wxUser.length)
        that.setData({
          wxUsers: wxUser
        })
      }
    });
    that.commentList();
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
    console.log("onShow");
   var that = this;
    wx.getStorage({
      key: 'refreshComment',
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshComment",
              data: "0"
            });
            that.commentList();
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

  },
  commentList: function(e) {
    var that = this;
    wx.request({
      url: app.serverUrl + 'api/comment/getCommentByCompose_id/' + that.data.sign.id,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let comments = res.data;
        console.log("==========" + comments.length)
        that.setData({
          comments: comments
        })
      }
    });
  },
  imageShow: function(e) {
    var index = e.target.dataset.id;
    var imgArr = this.data.sign.imgs;
    var tempImgArr = [];
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
        var sign = that.data.sign;
        if (res.data.code == 200) {
          sign.likes = true;
          sign.likeSCount = parseInt(sign.likeSCount) + 1;
          let openId = app.globalData.openid;
          var wxUsers = that.data.wxUsers;
          that.setData({
            sign: sign
          })
          wx.request({
            url: app.serverUrl + '/wx/likes/getLikesUserInfo/' + sign.id,
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              let wxUser = res.data;
              console.log("==========" + wxUser.length)
              that.setData({
                wxUsers: wxUser
              })
            }
          });
        } else {
          let openId = app.globalData.openid;
          var wxUsers = that.data.wxUsers;
          console.log(wxUsers);
          for (var i = 0; i < wxUsers.length; i++) {
            if (openId == wxUsers[i].openid) {
              wxUsers.splice(i, 1);
            }
          }
          that.setData({
            wxUsers: wxUsers
          });
          sign.likes = false;
          sign.likeSCount = parseInt(sign.likeSCount) - 1;
          that.setData({
            sign: sign
          })
        }
      }
    });
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
   
    let sign = JSON.stringify(this.data.sign);
    // wx.navigateTo({
    //   url: '/pages/signDetail/signDetail?sign=' + sign
    // });
    wx.navigateTo({
      url: '/pages/comment/comment?sign=' + sign+'&refresh=1'
    });
  }
})