// pages/detail/sound/electric-tuning-fork/electric-tuning-fork.js
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
    title: '平凸透镜曲率半径的测量',
    // 光的等厚干涉
    inputList: [{
      label: '𝚫仪=',
      value: 0.004,
      unit: '𝑚𝑚',
      id: 'input1'
    }, {
      label: 'λ=',
      value: 589.3,
      unit: ' nm',
      id: 'input2'
    }],
    table: [
      ['级数/𝑘', '左', '右', '𝐷ₘ/𝑚𝑚', '𝐷²ₘ','𝐷²ₘ-𝐷²ₘ₋₅'],
      [20, 19.987,27.138,'#','#','#'],
      [19, 20.069,27.061,'#','#','#'],
      [18, 20.153,26.971,'#','#','#'],
      [17, 20.251,26.866,'#','#','#'],
      [16, 20.348,26.783,'#','#','#'],
      [15, 20.421,26.685,'#','#','无数据'],
      [14, 20.523,26.595,'#','#','无数据'],
      [13, 20.625,26.487,'#','#','无数据'],
      [12, 20.728,26.379,'#','#','无数据'],
      [11, 20.831,26.268,'#','#','无数据']
    ],
    table_zero: [
      ['级数/𝑘', '左', '右', '𝐷ₘ/𝑚𝑚', '𝐷ₘ²'],
      [20, 0,0,'#','#','#'],
      [19, 0,0,'#','#','#'],
      [18, 0,0,'#','#','#'],
      [17, 0,0,'#','#','#'],
      [16, 0,0,'#','#','#'],
      [15, 0,0,'#','#','无数据'],
      [14, 0,0,'#','#','无数据'],
      [13, 0,0,'#','#','无数据'],
      [12, 0,0,'#','#','无数据'],
      [11, 0,0,'#','#','无数据']
    ],
    DD_2_ave:0,
    R:0,
    Un_R:0,

    isResult:false
  },
  changeData(e) {
    let input1 = "input1",
      input2 = "input2",
      table = "table"

    let value = e.detail.value,
      id = e.currentTarget.id
    console.log(value)
    if (value === '') {
      return false
    }
    value = Number(value)
    console.log(value)
    if (id === table) {
      let row = e.currentTarget.dataset.row,
        col = e.currentTarget.dataset.col
      this.setData({
        [`table[${row}][${col}]`]: value
      })
    } else if (id === input1) {
      this.setData({
        ['inputList[0].value']: value
      })
    } else if (id === input2) {
      this.setData({
        ['inputList[1].value']: value
      })
    }
    
  },
  calculate() {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid:wx.getStorageSync('openid') || 'false'
    })
    let table = this.data.table,
      aveFrequency = 0
    var DD_2_cha_sum = 0;     //就是最后一列那玩意
    for (let i = 1; i < table.length; ++i) {
      let item = (table[i][2] - table[i][1])
      table[i][3] = item
      table[i][3] = Math.pow(item,2)
      this.setData({
        [`table[${i}][3]`]: Number(item.toFixed(3)),
        [`table[${i}][4]`]: Number((item * item).toFixed(3)),
      })
    }
    for (let i = 1;i<6;++i){
      let item = Number(table[i][4] - table[i+5][4])
      DD_2_cha_sum += item
      // console.log(DD_2_cha_sum)
      this.setData({
        [`table[${i}][5]`]: Number(item.toFixed(3))
      })
    }


    // 其他计算
    var lambda = this.data.inputList[1].value
    var DD_2_ave = DD_2_cha_sum/5
    // console.log(DD_2_ave)
    var R = DD_2_ave/(4 * 5 * Number(lambda * 0.001)) //乘0.001是单位换算
    // TODO: 不确定度的计算...
    var Un_YQ = this.data.inputList[0].value * Math.sqrt(3)
    // 这里的X表示最后一列,但计算的公式很奇怪
    var Un_x_A = 0
    for(let i = 1;i<6;i++){
      Un_x_A += Math.pow(table[i][5]-DD_2_ave,2)
      console.log(Un_x_A)
    }
    Un_x_A = Math.sqrt(Un_x_A/5)
    var Un_x = Math.sqrt(Math.pow(Un_x_A,2)+Math.pow(Un_YQ,2))
    // console.log(Un_x)
    var Un_R = Un_x / (4*5*lambda) * 1000000  // lambda是nm 转为毫米
    // console.log(Un_R)
    

    // 装载
    var DD_2_ave_str = DD_2_ave.toFixed(3)
    this.setData({DD_2_ave:DD_2_ave_str})
    var R_str = R.toFixed(3)
    this.setData({R:R_str})
    var Un_x_A_str = Un_x_A.toFixed(3)
    this.setData({Un_x_A:Un_x_A_str})
    var Un_R_str = Un_R.toFixed(3)
    this.setData({Un_R:Un_R_str})
    this.setData({isResult:true})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toNextPage() {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '下一页',
      openid:wx.getStorageSync('openid') || 'false'
    })
    let data = {
      arr:[],
      input1 : this.data.inputList[0].value,
      input2 : this.data.inputList[1].value
    }
    for(let i = this.data.table.length-1 ;i > 0; --i) {
      data.arr.push([this.data.table[i][3],this.data.table[i][4]])
    }
    wx.navigateTo({
      url: '/pages/detail/light/equal-thickness/last/last?data=' + JSON.stringify(data),
    })
  },
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