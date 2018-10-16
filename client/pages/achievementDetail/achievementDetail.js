import * as echarts from '../ec-canvas/echarts';
const app = getApp();
Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    name:'',
    dataSubject: [],
    achievement:{},
    page: 1,
    url: app.domain
  },
  onLoad:function(options) {
    let achievement = JSON.parse(options.achievement);
    wx.setNavigationBarTitle({
      title: options.name
    });
    console.log(achievement);
    this.setData({
      achievement: achievement,
      name:options.name
    });

    this.pieComponent = this.selectComponent('#mychart-dom-pie');
    this.init_pie();
  },
  init_pie: function () {
    this.pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getPieOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getPieOption: function () {
    let that = this;
    let achievement = that.data.achievement;
  
    var color = ["#3EA3D8", "#6CE0E2", "#FF6666", "#99CC66", "#C15896", "#009966", "#E99278", "#CC99CC", "#FCD896", , "#FF9F7F", "#FD686A", , "#fdcf43", "#8a93f7"];
    var data = [
      { value: achievement.chinese, name: '语文 ' + achievement.chinese},
      { value: achievement.mathematics, name: '数学 ' + achievement.mathematics },
      { value: achievement.english, name: '英语 ' + achievement.english },
      { value: achievement.physics, name: '物理 ' + achievement.physics },
      { value: achievement.chemistry, name: '化学 ' +achievement.chemistry },
      { value: achievement.biology, name: '生物 ' + achievement.biology },
      { value: achievement.politics, name: '政治 ' + achievement.politics },
      { value: achievement.history, name: '历史 ' + achievement.history },
      { value: achievement.geography, name: '地理 ' + achievement.geography },
      { value: achievement.sports, name: '体育 ' + achievement.sports },
    ]

    var dataSubject=[]
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].value == 0)
      if (data[i].value==0){
        data.splice(i, 1);
      }else{
        dataSubject.push(data[i])
      }
    }

    that.setData({
      dataSubject: dataSubject
    })
    //return 请求数据
    return {
      color: color,
      title: {
        text: that.data.name,
        subtext: achievement.name,
        left: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: '35%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: that.data.dataSubject
        }
      ]
    };
  },
  onReady() {
  }
});
