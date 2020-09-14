// pages/detail/Light/measure-length-of-laser/measure-length-of-laser.js
const {
  httpReq
} = require('../../../../api/http')
const {
  behaviorLog
} = require('../../../../api/url')
const {
  getAverage,
  getUncertainty_A,
  getUncertainty,
} = require('../../../../utils/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '激光波长的测量',
    inputList:[{
      label:'仪器不确定度Δ仪= ',
      value:0.0001,
      unit:"𝑚𝑚",
      id:'uncertainty_yi'
    },
    {
      label:'干涉条纹数 𝑁= ',
      value:50,
      unit:"条",
      id:'theN'
    },
    {
      label:'标准值 λ₀= ',
      value:632.8,
      unit:"𝑛𝑚",
      id:'lambda_0'
    }],
    //记录表
    // table:[
    //   ['序号',"𝑙₁/𝑚𝑚","𝑙₂/𝑚𝑚","𝑑=|𝑙₁-𝑙₂|/𝑚𝑚","λ_𝑖/𝑛𝑚"],
    //   ['①',0,0,'#','#'],
    //   ['②',0,0,'#','#'],
    //   ['③',0,0,'#','#'],
    //   ['④',0,0,'#','#'],
    //   ['⑤',0,0,'#','#'],
    //   ['⑥',0,0,'#','#'],
    //   ['⑦',0,0,'#','#'],
    //   ['⑧',0,0,'#','#'],
    // ],
    //下面的数据可用于调试时测试
    table:[
      ['序号',"𝑙₁/𝑚𝑚","𝑙₂/𝑚𝑚","𝑑=|𝑙₁-𝑙₂|/𝑚𝑚","λ𝑖/𝑛𝑚"],
      ['①',48.79866,48.81410,'#','#'],
      ['②',48.81455,48.83089,'#','#'],
      ['③',48.83125,48.84668,'#','#'],
      ['④',48.84721,48.86200,'#','#'],
      ['⑤',48.86272,48.87792,'#','#'],
      ['⑥',48.87865,48.89401,'#','#'],
      ['⑦',48.89500,48.91075,'#','#'],
      ['⑧',48.91145,48.92630,'#','#'],
    ],
    
    //结果
    lambda_aver:0,    //λ平均
    d_A:0,  //B类不确定度
    d_d:0,  //总不确定度(▲d)
    d_lambda:0, //lambda不确定度
    uncertainty_absolute:0,
    uncertainty_relative:0,

    //标识符
    isResult:false,

  },



//函数
clearData(e){
  httpReq(behaviorLog.URL, behaviorLog.method, {
    page: this.data.title,
    control: '一键清空',
    openid:wx.getStorageSync('openid') || 'false'
  })
  for(let i = 1;i<9;i++){
    for(let j = 1;j<3;j++){
      this.setData({
        [`table[${i}][${j}]`]: 0
      })
    }
  }
  for(let i = 1;i<9;i++){
    for(let j = 3;j<5;j++){
      this.setData({
        [`table[${i}][${j}]`]: '#'
      })
    }
  }
  
  this.setData({isResult: false})
},
  //改变数据
  changeData(e){
      let value = e.detail.value, id = e.currentTarget.id
      // console.log(e.currentTarget)
      console.log('来自'+id+'的数据试图写入：')
      if(value === ''){
        console.log('\t写入失败')
        return false
      }

      if(id == "table")
      {
        let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
        let table = this.data.table
        this.setData({
          [`table[${row}][${col}]`]:value,
        })
        console.log(`\t成功在表[${row}][${col}]处写入 `+value)
      }
      else if(id === "uncertainty_yi"){
        this.setData({
          ['inputList[0].value']: value
        })
        console.log(`\t成功写入theN `+this.data.inputList[1].value)
      }
      else if(id === "theN"){
        this.setData({
          ['inputList[1].value']: value
        })
        console.log(`\t成功写入theN `+this.data.inputList[1].value)
      }
      else if(id === "lambda_0"){
        this.setData({
          ['inputList[2].value']: value
        })
        console.log(`\t成功写入lambda_0 `+this.data.inputList[2].value)
      }
  },

  //计算
  calculate(){
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid:wx.getStorageSync('openid') || 'false'
    })
    console.log("开始计算!") 
    let d_yi = this.data.inputList[0].value
    let N = this.data.inputList[1].value
    let lambda_0 = this.data.inputList[2].value
    
    let table = this.data.table
    let lambda_aver = 0
    let d_A = 0,d_d = 0,d_lambda = 0
    let u_a = 0,u_r = 0
    let isResult=false

    //处理表格
    for(var i=1;i<9;i++){
      if (Number(table[i][1])&&Number(table[i][2])) {
        table[i][3] = Math.abs(Number(table[i][1])-Number(table[i][2])).toFixed(5)
        table[i][4] = (2*table[i][3]/N * 1000000).toFixed(1)
        this.setData({[`table[${i}][3]`]:table[i][3]})
        this.setData({[`table[${i}][4]`]:table[i][4]})
        console.log("\t表格第"+i+"行d已更新"+this.data.table[i][3])
        console.log("\t表格第"+i+"行λ已更新"+this.data.table[i][4])
        lambda_aver += Number(table[i][4])
      }
      else{
        this.setData({['isResult']:isResult})
        return
      }
    }
    console.log("表格处理完毕:"+table)
    //一般数据处理
    var data = new Array()
    for (let index = 1; index < 9; index++) {
      data[index-1] = table[index][4];
    }
    lambda_aver = Number(getAverage(data))
    data = new Array()
    for (let index = 1; index < 9; index++) {
      data[index-1] = table[index][3];
    }
    d_A = Number(getUncertainty_A(data))
    d_d = Number(getUncertainty(d_A,d_yi))
    d_lambda = 2* d_d *1000000 / N
    u_a = Math.abs(lambda_aver-lambda_0).toFixed(3)
    u_r = (u_a / lambda_0 * 100).toFixed(2)

    //更新数据
    this.setData({["lambda_aver"]:lambda_aver})
    this.setData({["d_A"]:d_A})
    this.setData({["d_d"]:d_d})
    this.setData({["d_lambda"]:d_lambda})
    this.setData({["uncertainty_absolute"]:u_a})
    this.setData({["uncertainty_relative"]:u_r})
    this.setData({["isResult"]:true})
    console.log("计算完毕!")
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    httpReq(behaviorLog.URL, behaviorLog.method, {
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