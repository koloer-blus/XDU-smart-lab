// pages/detail/sound/electric-tuning-fork/electric-tuning-fork.js
const {
  electricTuningFork,
  electricTuningForkSum
} = require('../../../../utils/util')
const {
  httpReq
} = require('../../../../api/http')
const {
  behaviorLog
} = require('../../../../api/url')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '重力加速度的测量',
    // 复摆测量重力加速度
    inputList: [{
      label: '质心位置=',
      value: '7.06',
      unit: ' 𝑐𝑚(填入绝对值即可)',
      id: 'CircleCenter'
    }
  ],
    table: [
      ['序号', '①','②','③','④','⑤','⑥','⑦','⑧','⑨'],
      ['支点位置/𝑐𝑚', 18.00,15.98,13.97,12.00,10.02,7.98,5.99,4.00,2.03],
      ['10周期1',13.09,12.66,12.9,12.94,12.97,12.91,13.64,14.10,15.13],
      ['10周期2', 12.82,12.94,12.85,12.90,13.03,13.23,13.60,14.09,15.47],
      ['10周期3', 13.04,12.83,12.62,12.97,13.03,13.00,13.47,13.81,15.34],
      ['10周期4', 13.09,12.88,12.87,13.15,13.00,13.03,13.62,14.07,15.54],
      ['10周期5', 12.97,12.37,12.91,13.00,13.04,13.00,13.59,14.01,15.44],
      ['10周期6', 13.07,12.56,13.00,12.97,13.06,13.04,13.79,14.16,15.28],
      ['10周期7', 13.07,12.76,12.80,12.85,13.00,13.06,13.50,14.01,15.03],
      ['10周期8', 13.03,12.67,12.94,12.75,13.03,13.00,13.53,14.22,15.20],
      ['单周期平均', '#','#','#','#','#','#','#','#'],
      ['𝘩/𝑐𝑚', '#','#','#','#','#','#','#','#'],
    ],
    g_lilun:9.797,
    g_result:0,
    Un_g:0,         //绝对误差
    Un_g_relative:0,
    isResult : false
  },
  changeData(e) {
    let table = "table", CircleCenter = "CircleCenter"

    let value = e.detail.value,
      id = e.currentTarget.id
    if (value === '') {
      return false
    }
    if (id === table) {
      let row = e.currentTarget.dataset.row,
        col = e.currentTarget.dataset.col
      this.setData({
        [`table[${row}][${col}]`]: value
      })
    }else if(id === CircleCenter) {
      this.setData({
        ['inputList[0].value']: value
      })
    }
  },

  // calculG: function (t,h) {
  //   let _h = Number(this.data.inputList[0].value), g =  9.797,pie = 3.1415, Gi = 0
  //   h.forEach((value,index) => {
  //     h[index] = Math.abs(_h + value)
  //   })
  //   Gi = (4 * Math.pow(pie,2) * (h[0]* h[0] - h[8] * h[8]) / (h[0] * Math.pow(t[0],2) - h[8] * Math.pow(t[8],2)))
  //   let _g = Gi
  //   let G = Math.abs(_g - g)
  //   let E = G / g
  //   return {
  //     _g: _g.toFixed(3),
  //     G: G.toFixed(3),
  //     E: E.toFixed(5)
  //   }
  // },
  calculate() {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid:wx.getStorageSync('openid') || 'false'
    })

    var zhixinPos = this.data.inputList[0].value
    var table = this.data.table
    var g_lilun = this.data.g_lilun
    var g_result = 0
    var Un_g = 0
    var Un_g_relative = ''


    // 表格处理
    for (let i = 1; i < 10; i++) {
      //h
      table[11][i] = Number(zhixinPos) + Number(table[1][i])
      let h_tmp_str = table[11][i].toFixed(3)
      this.setData({ [`table[11][${i}]`]:h_tmp_str})
      table[11][i] /= 100
      // console.log(table)
      // console.log(zhixinPos)
      //周期
      let sum_zhouqi = 0
      for(let j = 2;j<10;j++){
        sum_zhouqi+=Number(table[j][i])
      }
      table[10][i] = sum_zhouqi/80
      let single_zhouqi_str = table[10][i].toFixed(3)
      console.log(single_zhouqi_str)
      this.setData({[`table[10][${i}]`]:single_zhouqi_str})
    }

    // 其他计算
    var h9 = Number(table[11][9])
    var h1 = Number(table[11][1])
    var T9 = Number(table[10][9])
    var T1 = Number(table[10][1])
    console.log(h1,h9,T1,T9)
    g_result = 4 * Math.pow(3.1415926,2) * (h1*h1 - h9*h9) / (h1*T1*T1 - h9*T9*T9)
    Un_g = Math.abs(g_result-g_lilun)
    Un_g_relative = ((Un_g/g_lilun) * 100).toFixed(2) + ' %'

    // 装载
    this.setData({g_lilun:g_lilun})
    g_result = g_result.toFixed(3)
    this.setData({g_result:g_result})
    Un_g = Un_g.toFixed(3)
    this.setData({Un_g:Un_g})
    this.setData({Un_g_relative:Un_g_relative})
    this.setData({isResult:true})
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