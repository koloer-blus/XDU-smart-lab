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
    title: '单线扭摆实验',
    inputList1: [{
        label: '长度：𝑙=',
        value: 9.8,
        unit: '𝑚𝑚',
        id: 'length'
      },
      {
        label: '直径：𝑑=',
        value: 9.8,
        unit: '𝑚𝑚',
        id: 'radious'
      }
    ],
    inputList2: [{
        label: '𝑅₁=',
        value: 10,
        unit: '𝑚𝑚',
        id: 'R1'
      },
      {
        label: '𝑅₂=',
        value: 10,
        unit: '𝑚𝑚',
        id: 'R2'
      }
    ],
    table1: [
      ['振动时间20次', 1, 2, 3, 4, 5],
      ['摆盘', 0, 0, 0, 0, 0],
      ['摆盘+圆环', 0, 0, 0, 0, 0],
    ],
    table2: [
      ['', '上部', '中部', '下部'],
      ['横向', 0, 0, 0],
      ['纵向', 0, 0, 0],
    ]
  },
  changeData(e) {
    let length = "length",
      radious = "radious",
      table1 = "table1",
      table2 = "table2",
      R1 = "R1",
      R2 = "R2"

    let value = e.detail.value,
      id = e.currentTarget.id
    if (value === '') {
      return false
    }
    console.log(id, value)
    if (id === table1) {
      let row = e.currentTarget.dataset.row,
        col = e.currentTarget.dataset.col
      this.setData({
        [`table1[${row}][${col}]`]: value
      })
    } else if (id === table2) {
      let row = e.currentTarget.dataset.row,
        col = e.currentTarget.dataset.col
      this.setData({
        [`table2[${row}][${col}]`]: value
      })
    } else if (id === length) {
      this.setData({
        ['inputList1[0].value']: value
      })
    } else if (id === radious) {
      this.setData({
        ['inputList1[1].value']: value
      })
    } else if (id === R1) {
      this.setData({
        ['inputList2[0].value']: value
      })
    } else if (id === R2) {
      this.setData({
        ['inputList2[1].value']: value
      })
    }
  },
  calculate() {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid: wx.getStorageSync('openid') || 'false'
    })
    let table1 = this.data.table1,
      table2 = this.data.table2,
      frequency = [],
      aveFrequency = 0
    let arr = []
    for (let i = 1; i < 3; ++i) {
      let count = 0
      for (let j = 1; j < 6; ++j) {
        count += Number(table1[i][j])
      }
      arr.push(count / 5)
    }
    for (let i = 1; i < 3; ++i) {
      let count = 0
      for (let j = 1; j < 4; ++j) {
        count += Number(table2[i][j])
      }
      arr.push(count / 3)
    }
    arr.push(this.data.inputList1[0].value, this.data.inputList1[1].value, this.data.inputList2[0].value, this.data.inputList2[1].value)
    wx.navigateTo({
      url: '/pages/detail/Mechanics/single-twist/result/result?arr=' + JSON.stringify(arr),
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