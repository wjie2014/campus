// pages/sign/sign.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: [],
    content: "",
    imgUrls: [],
    thumbnailsImgs: [],
    videoUrlShow: "",
    videoUrl: "",
    uhide: false,
    uVideohide:true,
    uVideoHideView: false,
    type:""
  },
  //获取用户输入的用户名
  contentInput: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.type);
    let type = options.type;
    this.setData({
      type:type
    });
    wx.setNavigationBarTitle({
      title: '发表日志'
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
  onShow: function() {},

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
  addVideo: function() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        wx.uploadFile({
          url: app.serverUrl + 'api/sign/uploadSubmit',
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
          },
          success: (e) => {
            var data = JSON.parse(e.data);
            console.log(data.url);
            that.setData({
              // uVideohide:false,
              uVideoHideView: true,
              videoUrlShow: res.tempFilePath,
              videoUrl: data.url
            });
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 3000
            })
          },
          fail: (res) => {
            wx.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 3000
            })
          },
        })
      }
    })

  },
  addRecord: function() {
    this.setData({
      uhide: true
    });
    // var that = this;
    // that.setData({
    //   isuploaderror: 0
    // });
    // var nowLen = that.data.src.length;
    // var remain = 9 - nowLen;
    // wx.startRecord({
    //   success: function (res) {
    //     var tempFilePath = res.tempFilePath;
    //     console.log(tempFilePath);
    //   },
    //   fail: function (res) {
    //     //录音失败
    //   }
    // })
    // setTimeout(function () {
    //   //结束录音  
    //   wx.stopRecord()
    // }, 10000)
  },
  addImage: function() {
    var that = this;
    that.setData({
      isuploaderror: 0
    });
    var nowLen = that.data.src.length;
    var remain = 9 - nowLen;
    wx.chooseImage({
      count: remain,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var i = 0; //第几个
        var length = res.tempFilePaths.length;
        that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      }
    });
  },
  submit: function(e) {
    var that = this;
    var imgUrlsArr = that.data.imgUrls;
    var imgUrls = "";
    //     'content': 
    for (var i = 0; i < imgUrlsArr.length; i++) {
      imgUrls += "," + imgUrlsArr[i];
    }
    console.log(that.data.content);
    console.log(imgUrls);
    var thumbnailsImgsArr = that.data.thumbnailsImgs;
    var thumbnailsImgs = "";
    //     'content': 
    for (var i = 0; i < thumbnailsImgsArr.length; i++) {
      thumbnailsImgs += "," + thumbnailsImgsArr[i];
    }
    wx.request({
      url: app.serverUrl + 'api/sign/addSign',
      data: {
        'content': that.data.content,
        'imgUrls': imgUrls,
        'thumbnails': thumbnailsImgs,
        'openId': app.globalData.openid,
        'videoUrl': that.data.videoUrl,
        'type': that.data.type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 3000
        })
        wx.setStorage({
          key: "refreshSign",
          data: "1"
        });
        wx.navigateBack(); //返回上一个页面
      }
    })
  },
  /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述： 
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   * length是文件路径数组的长度
   */
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.showToast({
      title: '上传中...',
      icon: 'loading',
      duration: 2000000
    })
    wx.uploadFile({
      url: app.serverUrl + 'api/sign/uploadSubmit',
      filePath: filePaths[i],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: (res) => {
        successUp++;
        var srcArr = that.data.src;
        srcArr.push(filePaths[i]),
          that.setData({
            src: srcArr
          });
        var data = JSON.parse(res.data);

        console.log(data.url);
        var newpicKeys = that.data.imgUrls;
        newpicKeys.push(data.url);
        that.setData({
          imgUrls: newpicKeys
        });

        var newpicKeysT = that.data.thumbnailsImgs;
        newpicKeysT.push(data.thumbnails);
        that.setData({
          thumbnailsImgs: newpicKeysT
        });
        
      },
      fail: (res) => {
        that.setData({
          isuploaderror: 1
        });
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          wx.hideToast();
          var txt = '总共' + successUp + '张上传成功,' + failUp + '张上传失败！';
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
          // app.toastShow(0, txt, 2000, 1);
          // wx.hideLoading();

        } else { //递归调用uploadDIY函数
          if (that.data.isuploaderror) {
            // app.toastShow(0, '图片上传失败，请重新选择上传', 2000, 1);
            wx.showToast({
              title: '上传失败，请重新选择上传',
              icon: 'success',
              duration: 1000
            })
          } else {
            this.uploadDIY(filePaths, successUp, failUp, i, length);
          }
        }
      }
    });
  },
  deleteImage: function(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    console.log(index);
    var srcArr = this.data.src;
    srcArr.splice(index, 1);
    this.setData({
      src: srcArr
    })
  }
})