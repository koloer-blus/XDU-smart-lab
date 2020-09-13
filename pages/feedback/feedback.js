// pages/feedback/feedback.js
const {
  httpReq
} = require('../../api/http')
const {
  feedBack
} = require('../../api/url')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    situation: [{
        errType: 1,
        detail: '数据计算错误'
      },
      {
        errType: 2,
        detail: '输入表格错误'
      },
      {
        errType: 3,
        detail: '其他问题错误'
      },
      {
        errType: 4,
        detail: '建议'
      }
    ],
    infoMsg: '提交成功',
    suggestion: {
      placeholeder: '描述一下您的问题或是宝贵意见',
      value: ''
    },
    suggestionContent: '',
    type: '',
    tiggleInfo: false,
    connection: ''
  },
  update(e) {
    this.setData({
      [`suggestion.value`]: e.detail.value
    })
  },
  radioChange(e) {
    this.setData({
      type: e.detail.value
    })
  },
  change(res) {
    if (res.statusCode === 200) {
      this.setData({
        res: res,
        tiggleInfo: true,
        infoMsg: '提交成功'
      })
      setTimeout(async () => {
        await this.setData({
          tiggleInfo: false,
        })
        wx.navigateBack({
          complete: (res) => {
            console.log('resback', res)
          },
        })
      }, 2000)
    } else {
      this.setData({
        res: res,
        tiggleInfo: true,
        infoMsg: '服务器开了会小差'
      })
    }
  },
  async toSubmit() {
    const that = this
    await this.setData({
      [`suggestion.value`]: this.data.suggestionContent
    },function() {
      let data = {
        type: that.data.type,
        content: that.data.suggestionContent || that.data.suggestion.value,
        contactInfo: that.data.connection || 'null',
        openid: wx.getStorageSync('openid') || 'null',
        page: that.data.info
      }
      console.log(data, that.data)
      for (let item in data) {
         if (data[item] === '') {
          console.log(data[item])
          that.setData({
            tiggleInfo: true,
            infoMsg: '信息未补全'
          })
          setTimeout(() => {
            that.setData({
              tiggleInfo: false,
            })
          }, 2000)
          return false
        }
      }
      httpReq(feedBack.URL, feedBack.method, data, that.change)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      info: options.info
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