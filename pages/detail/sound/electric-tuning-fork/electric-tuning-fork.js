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
            label: '弧线面密度𝝆=',
            value: '0.00356',
            unit: '𝑔/𝑐𝑚',
            id: 'arc-area-density'
          },
          {
            label: '重力加速度𝑔=',
            value: '9.8',
            unit: '𝑚/𝑠²',
            id: 'acceleration-of-gravity'
          }
        ],
        table: [
          ['砝码质量𝑚/𝑔', '波腹数', '弦线长L/𝑐𝑚', '√𝑚', '波长', '波速', '频率'],
          [25, 6, 78.3, 0, 0, 0, 0],
          [75, 5, 114.8, 0, 0, 0, 0],
          [125, 4, 116.8, 0, 0, 0, 0],
          [150, 3, 97, 0, 0, 0, 0],
          [175, 2, 70.7, 0, 0, 0, 0],
        ]
      },
      changeData (e) {
        let arcSurface = "arc-area-density", gravity = "acceleration-of-gravity", table = "table"
        
        let value = e.detail.value, id = e.currentTarget.id
        if (value === '') {
          return false
        }
        if (id === table) {
          let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
          this.setData({
            [`table[${row}][${col}]`]: value
          })
        } else if(id === arcSurface) {
          this.setData({
            ['inputList[0].value']: value
          })
        } else {
          this.setData({
            ['inputList[1].value']: value
          })
        }
      },
      calculate() {
        let table = this.data.table, frequency = [],aveFrequency=0
        for (let i = 1; i < table.length; ++i) {
          let arg = {
            weight: Number(table[i][0]),
            gravity: Number(this.data.inputList[1].value) * 100, //换算成cm/s^2
            arcSurface: Number(this.data.inputList[0].value),
            antinode: Number(table[i][1]),
            chordLength: Number(table[i][2])
          }
          let res = electricTuningFork(arg)
          if (res) {
            this.setData({
              [`table[${i}][3]`]:res.weightSqrt,
              [`table[${i}][4]`]:res.waveLength,
              [`table[${i}][5]`]:res.waveSpeed,
              [`table[${i}][6]`]:res.frequency
            })
            frequency.push(res.frequency)
          }
        }
        for(let i =0 ; i< frequency.length; ++i) {
          aveFrequency = Number(frequency[i]) + aveFrequency;
        }
        console.log(aveFrequency)
        if (aveFrequency !== 0) {
          this.setData({
            // 频率平均值
            aveFrequency: (aveFrequency / frequency.length).toFixed(3)
          })
          console.log(Number(this.data.aveFrequency))
          let res = electricTuningForkSum({inherentFrequency : 99.6,frequency : Number(this.data.aveFrequency) })
          if (res) {
            console.log(res)
            this.setData({
              frequencyDiff:res.frequencyDiff,
              rate: res.rate
            })
          }
        } 
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