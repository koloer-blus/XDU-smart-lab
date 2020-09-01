const {
  threeWirePendulum
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
    title: '三线摆测量刚体的转动惯量',
    inputList: [{
        label: '下摆盘质量𝑚=',
        value: '360',
        unit: '𝑔',
        id: 'hem-plate'
      },
      {
        label: '圆环质量𝑚=',
        value: '400',
        unit: '𝑔',
        id: 'ring'
      }
    ],
    table: [
      ['待测物体', '待测量', '1', '2', '3', '4', '5', '平均值'],
      ['上圆盘', '直径𝑑/𝑐𝑚', 10.00, 9.90, 10.00, 10.10, 10.00, 0],
      ['下圆盘', '绳间距𝑅/𝑐𝑚', 17.20, 17.15, 17.16, 17.15, 17.16, 0],
      ['', '周期', 76.03, 76.43, 76.25, 75.90, 76.20, 0],
      ['上下圆盘', '绳长', 50.00, 50.00, 50.00, 50.00, 50.00, 0],
      ['圆环', '内径𝑑/𝑐𝑚', 16.75, 16.78, 16.80, 16.81, 16.75, 0],
      ['', '外径𝐷/𝑐𝑚', 18.90, 18.92, 19.01, 19.05, 19.00, 0],
      ['上下圆盘+圆环', '周期50𝑇/𝑠', 84.18, 83.82, 84.02, 84.51, 83.90, 0],
    ]
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
    } else if (id === arcSurface) {
      this.setData({
        ['inputList[0].value']: value
      })
    } else {
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
    let table = this.data.table,
      dataArr = []
    this.data.inputList.forEach(value => {
      dataArr.push(Number(value.value))
    })
    for (let i = 1; i < table.length; ++i) {
      let res = 0
      for (let j = 2; j < table[i].length - 1; ++j) {
        res += Number(table[i][j])
      }
      res /= 5
      this.setData({
        [`table[${i}][7]`]: res.toFixed(2),
      })
      dataArr.push(Number(res.toFixed(2)))
    }
    dataArr.push(this.data.table)
    console.log(dataArr)
    let result = threeWirePendulum(dataArr)
    this.setData({
      result: result
    })
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