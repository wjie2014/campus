//app.js

var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
import wxValidate from 'utils/WxValidate.js'

App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  serverUrl: "https://www.shengyiguanjia.xyz/platform/",
  // serverUrl: "http://127.0.0.1:8083/platform/"
  // serverUrl: "http://192.168.1.115:8083/platform/",
  // serverUrl:"http://192.168.0.101:8083/platform/",
  domain: "https://www.shengyiguanjia.xyz/",
  // domain: "http://192.168.1.115:8083/",

  globalData: {
    userInfo: null,
    openid: ""
  },
  onLaunch: function() {
    
  }
  ,
  teacherId: "2",
  studentId: "2",
  role:'2'
})