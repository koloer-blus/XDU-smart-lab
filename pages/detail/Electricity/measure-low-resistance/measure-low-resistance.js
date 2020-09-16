// pages/detail/Electricity/measure-low-resistance/measure-low-resistance.js
const {httpReq} = require('../../../../api/http')
const {behaviorLog} = require('../../../../api/url')
const {
  getAverage,
  getUncertainty_A,
  getUncertainty,
} = require('../../../../utils/common')
const {checkBack} = require('../../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //R1&R3
    title: '低电阻的测量',
    inputList:[{
      label:'𝑅₁= ',
      value:'1000',
      unit:' 𝛀',
      id:'resistance_1'
    },
    {  
      label:'𝑅₃= ',
      value:'100',
      unit:' 𝛀',
      id:'resistance_3'
    }],
    //table_diameter
    table_diameter:[
      ['序号','①','②','③','④','⑤','⑥'],
      ['直径 𝑑/𝑚𝑚',3.958,3.955,3.956,3.951,3.953,3.952],
    ],
    //table_length
    table_length:[
      ['序号','①','②','③','④','⑤','⑥','⑦','⑧'],
      ['长度 𝐿/𝑚𝑚',100.0,140.0,180.0,220.0,260.0,300.0,340.0,380.0],
      ['𝑅ₙ正/𝛀',0.00558,0.00775,0.01000,0.01224,0.01446,0.01670,0.01891,0.02127],
      ['𝑅ₙ反/𝛀',0.00565,0.00787,0.01150,0.01236,0.01466,0.01686,0.01916,0.02139],
      ['𝑅ₙ平均/𝛀','#','#','#','#','#','#','#','#'],
      ['𝑅ₓ/×10⁻³ 𝛀','#','#','#','#','#','#','#','#'],
      ['𝛒 /×10⁻⁸ 𝛀·𝑀','#','#','#','#','#','#','#','#']
    ],
    table_length_zero:[
      ['序号','①','②','③','④','⑤','⑥','⑦','⑧'],
      ['长度 𝐿/𝑚𝑚',0,0,0,0,0,0,0,0],
      ['𝑅ₙ正/𝛀',0,0,0,0,0,0,0,0],
      ['𝑅ₙ反/𝛀',0,0,0,0,0,0,0,0],
      ['𝑅ₙ平均/𝛀','#','#','#','#','#','#','#','#'],
      ['𝑅ₓ/×10⁻³ 𝛀','#','#','#','#','#','#','#','#'],
      ['𝛒 /×10⁻⁸ 𝛀·𝑀','#','#','#','#','#','#','#','#']
    ],
    //参数
    diameter_aver:0,  //直径平均值
    Un_d:0,           //直径误差
    Un_A_d:0,
    Un_A_Rx:0,
    rho_aver: 0,      //rho平均值
    rho_sx:0,         //rho误差
    K:0,              //K是一个中间系数,pi*d^2/4
    Num_data:0,       //表2的有效数据

    //其他控件
    isResult:false,  
  },
  //函数
  clearData(e){
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '一键清空',
      openid:wx.getStorageSync('openid') || 'false'
    })
    for(let i = 1;i<2;i++){
      for(let j = 1;j<7;j++){
        this.setData({
          [`table_diameter[${i}][${j}]`]: 0
        })
      }
    }

    for(let i = 1;i<4;i++){
      for(let j = 1;j<9;j++){
        this.setData({
          [`table_length[${i}][${j}]`]: 0
        })
      }
    }
    for(let i = 4;i<7;i++){
      for(let j = 1;j<9;j++){
        this.setData({
          [`table_length[${i}][${j}]`]: '#'
        })
      }
    }
    this.setData({isResult: false})
  },
  changeData(e){
      let value = e.detail.value, id = e.currentTarget.id
      if(value===''){
        return false
      }
      if(id == "table_diameter"){
        let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
        this.setData({
          [`table_diameter[${row}][${col}]`]:value
        })
      }
      else if(id == "table_length"){
        let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
        this.setData({
          [`table_length[${row}][${col}]`]:value
        })
      }
      else if(id === "resistance_1"){
        this.setData({
          ['inputList[0].value']: value
        })
      }
      else if(id === "resistance_3"){
        this.setData({
          ['inputList[1].value']: value
        })
      }
  },

  calculate(){
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid:wx.getStorageSync('openid') || 'false'
    })

    this.setData({isResult:false})

    //表1,直径计算
    let table = this.data.table_diameter[1],sum = 0 ,n=0
    console.log('直径数据表:'+table)
    var aver_d = Number(getAverage(table.slice(1,)))
    if(aver_d !== 0){
      this.setData({diameter_aver : aver_d})
    }else{
      return
    }

    //表2,长度计算
        //预备工作
    let r1 = this.data.inputList[0].value,r3 = this.data.inputList[1].value
    let K = this.data.K
    K = Math.PI*this.data.diameter_aver*this.data.diameter_aver/4 
    if(!r1||!r3||!K){
      return
    }else{
      console.log("K="+K)
    }//计算K 并检查r1r3是否到位
        //正式处理表格
    table = this.data.table_length
    n = 0,sum = 0
    console.log('长度表:'+table)
    // console.log(table[1][8])
    for(let i = 1;i<table[0].length;i++){
      if(Number(table[1][i])&&Number(table[2][i])&&Number(table[3][i])){
        let v1 = (Number(table[2][i])+Number(table[3][i]))/2
        let v2 = Number(v1) * r3 / r1 * 1000
        let v3 = Number(v2) * K / Number(table[1][i]) *100
        v1 = v1.toFixed(5)
        v2 = v2.toFixed(3)
        v3 = v3.toFixed(4)
        this.setData({
          [`table_length[4][${i}]`] : v1,
          [`table_length[5][${i}]`] : v2,
          [`table_length[6][${i}]`] : v3
        })
        n++
        sum += Number(v3)
        this.setData({isResult:true})
        console.log(`第${i}列数据处理完毕:`+v1,v2,v3)
      }
    }
    if(!Boolean(this.data.isResult)){
      console.log("表2中没有数据")
      return
    }

    var aver_Rx = Number(getAverage(table[5].slice(1,)))
    var aver_rho = Number(getAverage(table[6].slice(1,)))

    /* 不确定度 */
    var Un_A_d = Number(getUncertainty_A(this.data.table_diameter[1].slice(1,)))
    var Un_d = Number(getUncertainty(Un_A_d, 0.001))
    var Un_A_Rx = Number(getUncertainty_A(table[5].slice(1,)))
    var Un_rho = Math.sqrt(4*(Math.pow(Un_d/aver_d,2)) + Math.pow(Un_A_Rx/aver_Rx,2)) * aver_rho
    Un_rho = Un_rho.toFixed(6)
    console.log(aver_rho)
    // console.log(sum+'@'+n)
    this.setData({
      K : K,
      Num_data : n,
      rho_aver : aver_rho,
      rho_sx : Un_rho,
      Un_d : Un_d,
      Un_A_d: Un_A_d,
      Un_A_Rx : Un_A_Rx
    })
    // console.log("计算完毕,ρ="+this.data.rho_aver)
    // console.log('偏差='+this.data.rho_sx)
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
    checkBack()
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