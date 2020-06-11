// pages/detail/sound/electric-tuning-fork/electric-tuning-fork.js
const {

} = require('../../../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputList: [{
      label: '△仪=',
      value: 0.004,
      unit: 'mm',
      id: 'input1'
    }, {
      label: 'λ=',
      value: 589.3,
      unit: 'nm',
      id: 'input2'
    }],
    table: [
      ['级数/k', '左', '右', 'Dm/mm', 'Dm^2'],
      [20, 19.987, 27.138, 0, 0, ],
      [19, 20.069, 27.061, 0, 0],
      [18, 20.153, 26.971, 0, 0],
      [17, 20.251, 26.866, 0, 0],
      [16, 20.348, 26.783, 0, 0],
      [15, 20.421, 26.685, 0, 0],
      [14, 20.523, 26.595, 0, 0],
      [13, 20.625, 26.487, 0, 0],
      [12, 20.728, 26.379, 0, 0],
      [11, 20.831, 26.268, 0, 0],
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
  onLoad: function (options) {},

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