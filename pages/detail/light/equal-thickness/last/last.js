// pages/detail/sound/electric-tuning-fork/electric-tuning-fork.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    table: [
      ['𝑚', '𝐷ₘ+5²-𝐷ₘ²', '不确定度\n𝑅m/𝑚𝑚'],
      [1, 0, 0],
      [2, 0, 0],
      [3, 0, 0],
      [4, 0, 0],
      [5, 0, 0],
    ],
    result: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toLastPage() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  sysFuc: function (arr) {
    console.log(arr)
    let count = 0,
      res = 0
    for (var i = arr.length - 1; i >= 0; i--) {
      count += arr[i][1]
    }
    count /= 5;
    for (var i = arr.length - 1; i >= 0; i--) {
      res += Math.pow((arr[i][1] - count), 2)
    }
    res = Math.sqrt(res / arr.length)
    let sx = res / Math.sqrt(arr.length)
    return sx
  },
  onLoad: function (options) {
    let info = JSON.parse(options.data)
    let res = [],
      countm = 0,
      countR = 0
    for (let i = 0; i < 5 ; ++i) {
      let m = info.arr[i+5][0] * info.arr[i+5][0] - info.arr[i][0] * info.arr[i][0]
      let R = 100000 *m / (20 * info.input2)
      this.setData({
        [`table[${i+1}][1]`]: Number(m.toFixed(3)),
        [`table[${i+1}][2]`]: Number(R.toFixed(3))
      })
      res.push([m, R])
      countm += m
      countR += R
    }
    this.setData({
      [`result.avrDm`]: (countm / 5).toFixed(3),
      [`result.avrR`]: (countR / 5).toFixed(3),
      [`result._Ra`]: this.sysFuc(res).toFixed(3),
      [`result._Rb`]: (info.input1 * Math.sqrt(3) / 3).toFixed(3)
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