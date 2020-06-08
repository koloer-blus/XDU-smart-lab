// pages/detail/Mechanics/single-twist/result/result.js
const {singlePendulum}= require('../../../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    table1: [
      ['振动时间20次','平均值','周期'],
      ['摆盘', 0,0],
      ['摆盘+圆环',0,0]
    ],
    table2: [
      ['','平均值/mm'],
      ['横向',0],
      ['纵向',0]
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      arr: options.arr
    })
    let res = singlePendulum(JSON.parse(options.arr))
    this.setData({
      res: res,
      [`table1[1][1]`]: res.var0,
      [`table1[1][2]`]: res.T0,
      [`table1[2][1]`]: res.var,
      [`table1[2][2]`]: res.T,
      [`table2[1][1]`]: res.row,
      [`table2[2][1]`]: res.col,
    })
  },
  backUrl () {
    wx.navigateBack({
      complete: (res) => {},
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