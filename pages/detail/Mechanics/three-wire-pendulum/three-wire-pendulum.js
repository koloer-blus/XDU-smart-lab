const { threeWirePendulum} = require('../../../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputList: [{
        label: '下摆盘质量m=',
        value: '360',
        unit: 'g',
        id: 'hem-plate'
      },
      {
        label: '圆环质量m=',
        value: '400',
        unit: 'g',
        id: 'ring'
      }
    ],
    table: [
      ['待测物体', '待测量', '1', '2', '3', '4', '5','平均值'],
      ['上圆盘', '直径d/cm', 0, 0, 0, 0, 0,0],
      ['下圆盘', '绳间距R/cm', 0, 0, 0, 0, 0,0],
      ['', '周期', 0, 0, 0, 0, 0,0],
      ['上下圆盘', '绳长', 0, 0, 0, 0, 0,0],
      ['圆环', '内径d/cm', 0, 0, 0, 0, 0,0],
      ['', '外径D/cm', 0, 0, 0, 0, 0,0],
      ['上下圆盘+圆环', '周期50T/s', 0, 0, 0, 0, 0,0],
    ]
  },
  changeData (e) {
    let hemPlate = "hem-plate", ring = "ring", table = "table"
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
    let table = this.data.table, dataArr = []
    this.data.inputList.forEach(value => {
      dataArr.push(Number(value.value))
    })
    for (let i = 1; i < table.length; ++i) {
      let res = 0
      for(let j = 2; j< table[i].length -1 ; ++j) {
        res += Number(table[i][j])
      }
      res /=5
        this.setData({
          [`table[${i}][7]`]:res,
        })
        dataArr.push(res)
    }
    dataArr.push(this.data.table)
    console.log(dataArr)
    let result = threeWirePendulum(dataArr)
    this.setData({
      result: result
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