const {
  threeWirePendulum
} = require('../../../../utils/util')
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
    title: '刚体转动惯量的测量',
    inputList: [{
        label: '下盘质量𝑚₀=',
        value: '360',
        unit: ' 𝑔',
        id: 'hem-plate'
      },
      {
        label: '圆环质量𝑚=',
        value: '400',
        unit: ' 𝑔',
        id: 'ring'
      }
    ],
    table: [
      ['待测物体', '待测量', '1', '2', '3', '4', '5', '平均值'],
      ['上圆盘', '半径𝑟/𝑐𝑚', 5.00, 4.95, 5.00, 5.05, 5.00, '#'],
      ['下圆盘', '两悬点间距𝐿/𝑐𝑚', 17.20, 17.15, 17.16, 17.15, 17.16, '#'],
      ['下圆盘', '有效半径𝑅/𝑐𝑚', '#', '#', '#', '#', '#', '#'],
      ['下圆盘', '振动总时间𝑡₀/𝑠',76.03,76.43,76.25,75.90,76.20 , '#'],
      ['下圆盘', '单次振动周期𝑇₀/𝑠', '#', '#', '#', '#', '#', '#'],
      ['上下圆盘', '绳长𝑙/𝑐𝑚', 50.00, 50.00, 50.00, 50.00, 50.00, '#'],
      ['上下圆盘', '垂直距离𝐻/𝑐𝑚', '#', '#', '#', '#', '#', '#'],
      ['圆环', '内径𝑑/𝑐𝑚', 16.75, 16.78, 16.80, 16.81, 16.75, '#'],
      ['圆环', '外径𝐷/𝑐𝑚', 18.9,18.92,19.01,19.05,19.00, '#'],
      ['下盘+圆环', '振动总时间𝑡/𝑠', 84.18, 83.82, 84.02, 84.51, 83.90, '#'],
      ['下盘+圆环', '单次振动周期𝑇/𝑠', '#', '#', '#', '#', '#', '#'],
    ],
    
    I_0_result:0,
    Un_I_0_relative:0,
    Un_I_0:0,
    I_result:0,
    I_lilun:0,
    I_wucha:0,
    isResult:false
  },
  changeData(e) {
    let hemPlate = "hem-plate",
      ring = "ring",
      table = "table"
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
    } else if (id === hemPlate) {
      this.setData({
        ['inputList[0].value']: value
      })
    } else if (id === ring) {
      this.setData({
        ['inputList[1].value']: value
      })
    }


  },
  calculate() {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid: wx.getStorageSync('openid') || 'false'
    })

    var table = this.data.table
    var m_0_below_plate = Number(this.data.inputList[0].value)
    var m_ring = Number(this.data.inputList[1].value)

    // 补全表格
    for(let j = 2;j<7;j++){
      /* 有效半径R = L / √3 */
      table[3][j] = table[2][j] / Math.sqrt(3)
      var str_tmp = table[3][j].toFixed(4)
      this.setData({[`table[3][${j}]`]:str_tmp})
      /* 单次振动周期T0 = t₀/50 */
      table[5][j] = table[4][j] / 50
      str_tmp = table[5][j].toFixed(4)
      this.setData({[`table[5][${j}]`]:str_tmp})
      /* 垂直距离H = √(l^2 - (R - r)^2) */
      table[7][j] = Math.sqrt(Math.pow(table[6][j],2)-Math.pow(table[3][j]-table[1][j],2))
      str_tmp = table[7][j].toFixed(2)
      this.setData({[`table[7][${j}]`]:str_tmp})
      /* 单次振动周期T = t / 50 */
      table[11][j] = table[10][j] / 50
      str_tmp = table[11][j].toFixed(4)
      this.setData({[`table[11][${j}]`]:str_tmp})
    }

    // 求平均值
    for(let i = 1;i<12;i++){
      var data = new Array()
      data = table[i].slice(2,7)
      console.log(data)
      table[i][7] = Number(getAverage(data))
      str_tmp = table[i][7].toFixed(2)
      if(i===3||i===5||i===11)
        str_tmp = table[i][7].toFixed(4)
      this.setData({[`table[${i}][7]`]:str_tmp})
      // 顺便求一下不确定度
      if(i===1){
        var Un_A_r = Number(getUncertainty_A(data))
      }
      else if(i===3){
        var Un_A_R = Number(getUncertainty_A(data))
      }
      else if(i===7){
        var Un_A_H = Number(getUncertainty_A(data))
      }
      else if(i===5){
        var Un_A_T_0 = Number(getUncertainty_A(data))
      }
      
    }

    // 获取数据
    /* 参数与常量 */
    var r_above_palte = Number(table[1][7])
    var R_below_palte = Number(table[3][7])
    var T_0 = Number(table[5][7])
    var H = Number(table[7][7])
    var d_ring = Number(table[8][7])
    var D_ring = Number(table[9][7])
    var T = Number(table[11][7])
    var g = 980    //cm/s2

    
    var pi = 3.1415926
    /* 结果 */
    console.log(d_ring)
    console.log(D_ring)
    console.log(m_ring)
    var I_lilun = 0
    var I_0_result = 0
    var I_result = 0
    I_lilun = (Math.pow(d_ring,2)+Math.pow(D_ring,2)) * m_ring / 8
    console.log(Math.pow(d_ring,2)+Math.pow(D_ring,2))
    console.log(I_lilun)
    I_0_result = ((m_0_below_plate * g * R_below_palte * r_above_palte)/(4 * Math.pow(pi,2) * H)) * Math.pow(T_0,2)
    I_result = ((g * R_below_palte * r_above_palte)/(4 * Math.pow(pi,2) * H)) * (((m_0_below_plate+m_ring) * Math.pow(T,2)) - (m_0_below_plate * Math.pow(T_0,2)))

    
    /* 不确定度 */
    var Un_m = 0.5 * 9.8
    var Un_r = Number(getUncertainty(Un_A_r,1))
    var Un_R = Number(getUncertainty(Un_A_R,1))
    var Un_H = Number(getUncertainty(Un_A_H,1))
    var Un_T_0 = Un_A_T_0

    var Un_I_0_relative = Math.sqrt(Math.pow((Un_m/m_0_below_plate),2)+Math.pow((Un_r/r_above_palte),2)+Math.pow((Un_R/R_below_palte),2)+Math.pow((Un_H/H),2)+2*Math.pow((Un_T_0/T_0),2))
    var Un_I_0 = Un_I_0_relative * I_0_result

    var I_wucha = Math.abs(I_result-I_lilun)

    I_0_result = I_0_result.toFixed(4)
    this.setData({I_0_result:I_0_result})
    Un_I_0_relative = (Un_I_0_relative * 100).toFixed(2) + ' %'
    this.setData({Un_I_0_relative:Un_I_0_relative})
    Un_I_0 = Un_I_0.toFixed(4)
    this.setData({Un_I_0:Un_I_0})
    I_result = I_result.toFixed(4)
    this.setData({I_result:I_result})
    I_lilun = I_lilun.toFixed(4)
    this.setData({I_lilun:I_lilun})
    I_wucha = I_wucha.toFixed(4)
    this.setData({I_wucha:I_wucha})
    this.setData({isResult:true})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: '首页',
      control: this.data.title,
      openid: wx.getStorageSync('openid') || 'false'
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