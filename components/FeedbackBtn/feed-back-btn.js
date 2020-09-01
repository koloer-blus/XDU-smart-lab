const {httpReq} = require('../../api/http')
const {behaviorLog} = require('../../api/url')
// components/FeedbackBtn/feed-back-btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toFeedPage () {
      httpReq(behaviorLog.URL, behaviorLog.method, {
        page: this.data.info,
        control: '反馈',
        openid:wx.getStorageSync('openid') || 'false'
      })
      wx.navigateTo({
        url: '/pages/feedback/feedback?info=' + this.data.info,
      })
    }
  }
})
