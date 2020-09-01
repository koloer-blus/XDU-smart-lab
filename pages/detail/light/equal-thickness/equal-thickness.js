// pages/detail/sound/electric-tuning-fork/electric-tuning-fork.js
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
    title: '光的等厚干涉',
    inputList: [{
      label: '𝚫仪=',
      value: 0.004,
      unit: '𝑚𝑚',
      id: 'input1'
    }, {
      label: 'λ=',
      value: 0.004,
      unit: '',
      id: 'input2'
    }],
    table: [
      ['级数/𝑘', '左', '右', '𝐷ₘ/𝑚𝑚', '𝐷ₘ²'],
      [20, 0, 0, 0, 0, ],
      [19, 0, 0, 0, 0],
      [18, 0, 0, 0, 0],
      [17, 0, 0, 0, 0],
      [16, 0, 0, 0, 0],
      [15, 0, 0, 0, 0],
      [14, 0, 0, 0, 0],
      [13, 0, 0, 0, 0],
      [12, 0, 0, 0, 0],
      [11, 0, 0, 0, 0],
    ]
  },
  changeData(e) {
    let input1 = "input1",
      input2 = "input2",
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
    for (let i = 1; i < table.length; ++i) {
      let item = (table[i][2] - table[i][1])
      this.setData({
        [`table[${i}][3]`]: Number(item.toFixed(3)),
        [`table[${i}][4]`]: Number((item * item).toFixed(3)),
      })
    }
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