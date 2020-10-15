const {
  httpReq
} = require('../../../../api/http')
const {
  behaviorLog,
  dataLog
} = require('../../../../api/url')
const {
  getAverage,
  getUncertainty_A,
  getUncertainty,
} = require('../../../../utils/common')
// pages/detail/sound/measure-sound-speed/measure-sound-speed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '空气中声速的测量',
    imgArr:[],
    inputList:[{
        label:'室温𝑡= ',
        value:'21',
        unit:'℃',
        id:'centigrade_t'
      },
      {
        label:'频率𝑓= ',
        value:'35.211',
        unit:'𝑘𝐻𝑧',
        id:'frequency_f'
      },
      {
        label:'频率不确定度(仪器) Δ𝑓= ',
        value:'0.185',
        unit:'𝑘𝐻𝑧',
        id:'Un_f_YQ'
      },
      {
        label:'距离不确定度(仪器) ΔL= ',
        value:'0.017',
        unit:'𝑚𝑚',
        id:'Un_L_YQ'
      },
    ],
    //table
    table:[
      ['𝑖','𝐿ᵢ/𝑚𝑚','λᵢ/𝑚𝑚'],
      [1,151.50,'#'],
      [2,156.32,'#'],
      [3,161.20,'#'],
      [4,165.94,'#'],
      [5,171.22,'#'],
      [6,176.18,'#'],
      [7,181.02,'无数据'],
      [8,186.24,'无数据'],
      [9,191.10,'无数据'],
      [10,196.26,'无数据'],
      [11,201.04,'无数据'],
      [12,205.88,'无数据'],
    ],

    temperature_T:273.15,
    speed_lilun:331.45,
    //Result
    isResult:false,
    lambda_aver:0,
    // Un_L_A:0,
    // Un_L:0,
    Un_lambda:0,
    speed_result:0,
    Un_v:0,
    Un_v_relative:0,

    speed_wucha:0,
    speed_wucha_relative : '',
  },
  //函数
  changeData(e){
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '一键清空',
      openid:wx.getStorageSync('openid') || 'false'
    })
    let value = e.detail.value, id = e.currentTarget.id
    console.log(e.currentTarget)
    console.log('来自'+id+'的数据试图写入：')
    if(value === ''){
      console.log('\t写入失败')
      return false
    }
    //表格
    if(id == "table"){
      let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
      let table = this.data.table
      this.setData({
        [`table[${row}][${col}]`]:value
      })
      console.log(`\t成功在[${row}][${col}]处写入 `+value)
    }
    else if(id === "centigrade_t"){
      this.setData({
        ['inputList[0].value']: value
      })
      console.log(`\t成功写入 `+this.data.inputList[0].value)
    }
    else if(id === "frequency_f"){
      this.setData({
        ['inputList[1].value']: value
      })
      console.log(`\t成功写入frequency_f `+this.data.inputList[1].value)
    }
    else if(id === "Un_f_YQ"){
      this.setData({
        ['inputList[2].value']: value
      })
      console.log(`\t成功写入Un_f_YQ `+this.data.inputList[2].value)
    }
    else if(id === "Un_L_YQ"){
      this.setData({
        ['inputList[3].value']: value
      })
      console.log(`\t成功写入Un_L `+this.data.inputList[3].value)
    }
  },
  
  clearData(e){
    for(let i = 1;i<13;i++){
        this.setData({
          [`table[${i}][1]`]: 0
        })
    }
    for(let i = 1;i<6;i++){
        this.setData({
          [`table[${i}][2]`]: '#'
        })
    }
    
    this.setData({isResult: false})
  },
  calculate(){
    httpReq(behaviorLog.URL , behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid:wx.getStorageSync('openid') || 'false'
    })
    let temperature_T = this.data.temperature_T
    let speed_lilun = this.data.speed_lilun
    let table = this.data.table
    let frequency_f = this.data.inputList[1].value
    let Un_f_YQ = this.data.inputList[2].value
    let Un_L_YQ = this.data.inputList[3].value

    console.log('开始计算')

    //开尔文温度与理论温度
    temperature_T = 273.15+Number(this.data.inputList[0].value)
    this.setData({temperature_T:temperature_T})
    console.log('\t开尔文温度T='+this.data.temperature_T)

    speed_lilun = (331.45*Math.sqrt(this.data.temperature_T/273.15)).toFixed(2)
    this.setData({speed_lilun:speed_lilun}) 
    console.log('\t室温理论速度'+this.data.speed_lilun)

    //表格处理
    for(let i=1;i<7;i++){
      if(Number(table[i][1])&&Number(table[i+6][1])){
        let tmp = 1/3*(Math.abs(Number(table[i+6][1])-Number(table[i][1])))
        tmp = tmp.toFixed(4)
        console.log("\tlambda_"+i+":"+tmp)
        this.setData({[`table[${i}][2]`]:Number(tmp)})
      }
    }
    console.log("表格处理完毕")
    console.log(table)
    //--------结果处理
    //lambda_aver
    var data = new Array()
    for (let index = 1; index < 7; index++) {
      data[index-1] = table[index][2];
    }
    var lambda_aver=Number(getAverage(data))
    var Un_lambda = Number(getUncertainty_A(data))
    var speed_result = lambda_aver * frequency_f;
    // L 不确定度
    // data = new Array()
    // for (let index = 1; index < 13; index++) {
    //   data[index-1] = table[index][1];
    // }
    // var Un_L_A = Number(getUncertainty_A(data))
    // var Un_L = Number(getUncertainty(Un_L_A,Un_L_YQ))
    // var Un_lambda = Math.sqrt(2) * Un_L / 3;

    // speed的相对不确定度,误差
    var Un_v_relative = Math.sqrt(Math.pow((Un_f_YQ/frequency_f),2)+Math.pow((Un_lambda/lambda_aver),2))
    var Un_v = Un_v_relative * speed_result

    // 相对误差
    var speed_wucha = Math.abs(speed_result - speed_lilun)
    var speed_wucha_relative = (speed_wucha / speed_lilun * 100).toFixed(2) + " %"
    
    // 装载数据
    // console.log(tmp_lambda_aver+"@"+sum_L/n_L)
    lambda_aver = lambda_aver.toFixed(4)
    this.setData({lambda_aver:lambda_aver})
    // this.setData({Un_L_A:Un_L_A})
    // this.setData({Un_L:Un_L})
    Un_lambda = Un_lambda.toFixed(4)
    this.setData({Un_lambda:Un_lambda})
    console.log("平均波长"+this.data.lambda_aver)

    // let tmp_speed_result=frequency_f*tmp_lambda_aver
    // console.log("测试：频率"+frequency_f+"波长"+tmp_lambda_aver)
    // tmp_speed_result = tmp_speed_result.toFixed(4)
    speed_result = speed_result.toFixed(4)
    Un_v_relative = Un_v_relative.toFixed(4)
    Un_v = Un_v.toFixed(4)
    this.setData({speed_result:speed_result})
    this.setData({Un_v_relative:Un_v_relative})
    this.setData({Un_v:Un_v})
    console.log("实验速度"+this.data.speed_result)

    // let tmp_speed_wucha=Math.sqrt(Math.pow(Un_L_YQ/tmp_lambda_aver,2)+Math.pow(Un_f_YQ/frequency_f,2))
    // tmp_speed_wucha = tmp_speed_wucha.toFixed(4)
    speed_wucha = speed_wucha.toFixed(4)
    // speed_wucha_relative = speed_wucha_relative.toFixed(4)
    this.setData({speed_wucha:speed_wucha})
    this.setData({speed_wucha_relative:speed_wucha_relative})
    console.log("相对误差"+this.data.speed_wucha)


      this.setData({isResult:true})
      console.log("全部计算完毕")
      
      this.dataLog()
    },
  dataLog(){
    const str = this.dataLog2str()
    httpReq(dataLog.URL, dataLog.method, {
      page: this.data.title,
      content: str,
      openid:wx.getStorageSync('openid') || 'false'
    })
  },
  dataLog2str(){
    var str = ""
    var inputList = this.data.inputList
    for (let index = 0; index < inputList.length; index++) {
      const element = inputList[index];
      for (const key in element) {
        str += element[key]
        str += (key=='id'?';':',')
      }
      str+='\n'
    }
    var table = this.data.table
    for(let i = 0;i<table.length;i++){
      for (let j = 0; j < table[0].length; j++) {
        const element = table[i][j];
        str += element
        str += (j==table[0].length-1)?';':','
      }
      str+='\n'
    }
    console.log(str)
    return str
  },

  /* 预览图片 */
  previewImg:function(e){
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    httpReq(behaviorLog.URL , behaviorLog.method, {
      page: '首页',
      control: this.data.title,
      openid:wx.getStorageSync('openid') || 'false'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})