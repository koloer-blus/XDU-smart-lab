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
      value: '3.2',
      unit: 'cm（需输入）',
      id: 'CircleCenter'
    }
  ],
    table: [
      ['位置/cm', 17.5, 15.5, 13.5, 11.5, 9.5, 7.5, 5.5, 3.5, 1.5],
      ['周期1', 11.812, 11.712, 11.689, 11.741, 11.925, 12.267, 12.931, 14.063, 16.057],
      ['周期2', 11.820,11.723, 11.683, 11.732, 11.906, 12.259, 12.925, 14.034, 16.049],
      ['周期3', 11.821, 11.725, 11.677, 11.734, 11.893, 12.254, 12.919, 14.051, 16.046],
      ['周期4', 11.823, 11.726, 11.674, 11.727, 11.882, 12.250, 12.915, 14.044, 16.044],
      ['周期5', 11.821, 11.727, 11.671, 11.725, 11.866, 12.246, 12.914, 14.039, 16.041],
      ['周期6', 11.823, 11.726, 11.670, 11.724, 11.850, 12.240, 12.911, 14.052, 16.028],
      ['周期7', 11.820, 11.725, 11.665, 11.717, 11.833, 12.238, 12.909, 14.021, 16.035],
      ['周期8', 11.823, 11.726, 11.665, 11.714, 11.829, 12.233, 12.910, 14.008, 16.036],
      ['平均周期', 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    let _h = Number(this.data.inputList[0].value), g =  9.797,pie = 3.1415, Gi = 0
    h.forEach((value,index) => {
      h[index] = Math.abs(_h + value)
    })
    Gi = (4 * Math.pow(pie,2) * (h[0]* h[0] - h[8] * h[8]) / (h[0] * Math.pow(t[0],2) - h[8] * Math.pow(t[8],2)))
    let _g = Gi
    let G = Math.abs(_g - g)
    let E = G / g
    return {
      _g: _g.toFixed(3),
      G: G.toFixed(3),
      E: E.toFixed(5)
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
      T[index] = (value / 8).toFixed(3)
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