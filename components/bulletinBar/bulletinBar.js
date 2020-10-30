// components/bulletinBar/bulletinBar.js
const {
  httpReq
} = require('../../api/http')
const {
  getBulletinAll
} = require('../../api/url')

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    msgList: [],
    interval: 2000,
    duration: 500,
    tmp:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMsgList: function () {
      // 获取所有的公告列表
      httpReq(getBulletinAll.URL, getBulletinAll.method,{},(res)=>{
        this.setData({
          msgList:res.data
        })
      })
    },

    toBulletinInfo: function (e) {
      var id = e.target.dataset.id;
      var msgList = this.data.msgList;
      
      var index = msgList.findIndex(function(msg){
        return msg.id===id;
      })

      var targetMsg = msgList[index];
      var bulletinInfoUrl = '/pages/bulletinInfo/bulletinInfo?options=' 
        + encodeURIComponent(JSON.stringify(targetMsg));
      console.log("跳转至"+bulletinInfoUrl);
      
      wx.navigateTo({
        url: bulletinInfoUrl,
      })
    }

  },
  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.getMsgList();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})