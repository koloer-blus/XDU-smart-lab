// pages/detail/sound/electric-tuning-fork/electric-tuning-fork.js
const {
  electricTuningFork,
  electricTuningForkSum
} = require('../../../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputList: [{
      label: '圆心位置x1=',
      value: '0',
      unit: 'cm（需输入）',
      id: 'CircleCenter'
    }
  ],
    table: [
      ['位置/cm', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期1', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期2', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期3', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期4', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期5', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期6', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期7', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['周期8', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
      ['平均周期', 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
    ]
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
  calculG: function (t,h) {
    let _h = Number(this.data.inputList[0].value), g =  9.797,pie = 3.1415, Gi = [], countG = 0
    h.forEach((value,index) => {
      h[index] = Math.abs(_h - value)
    })
    for(let i = 0; i< 5; ++i) {
      console.log(h[i], t[i])
      Gi.push(4 * Math.pow(pie,2) * (h[i]* h[i] - h[i+5] * h[i+5]) / (h[i] * Math.pow(t[i],2) - h[i+5] * Math.pow(t[i+5],2)))
    }
    Gi.forEach(value => {
      countG += value
    })
    let _g = countG / 5
    let G = Math.abs(_g - g)
    let E = G / g
    return {
      _g: _g.toFixed(6),
      G: G.toFixed(6),
      E: E.toFixed(6)
    }
  },
  calculate() {
    let table = this.data.table,  T = [],  h= []
    for(let i = 0, row = table.length; i< row-1; ++i) {
      for(let j = 1,col = table[i].length ; j <col; ++j) {
        let item = Number(table[i][j])
        if (i === 1 ) {
          T.push(item)
        } else if(i === 0) {
          h.push(item)
        } else {
          T[j-1] += item
        }
      }
    }
    let that = this
    T.forEach((value,index) => {
      T[index] = value / 8
      that.setData({
        [`table[${table.length - 1}][${index+1}]`]:T[index]
      })
    })
    let res = this.calculG(T,h)
    this.setData({
      result: res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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