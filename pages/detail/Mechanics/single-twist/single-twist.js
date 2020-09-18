const {
  httpReq
} = require('../../../../api/http')
const {
  behaviorLog,
  dataLog
} = require('../../../../api/url')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '单线扭摆实验',
    inputList: [{
        label: '长度：𝑙=',
        value: 543.2,
        unit: ' 𝑚𝑚',
        id: 'length'
      },
      {
        label: '圆环质量:𝑚=',
        value: 475,
        unit: ' 𝑔',
        id: 'mass'
      },
      {
        label: '𝑅₁=',
        value: 9.96,
        unit: ' 𝑚𝑚',
        id: 'R1'
      },
      {
        label: '𝑅₂=',
        value: 11.98,
        unit: ' 𝑚𝑚',
        id: 'R2'
      }
    ],
    table_cycle: [
      ['振动时间(20次)', '①','②','③','④','⑤','平均值','单次周期'],
      ['摆盘', 48.65,48.93,49.87,48.75,48.84,'#','#'],
      ['摆盘+圆环', 80.31,79.72,79.59,80.06,80.08,'#','#'],
    ],
    table_diameter: [
      ['', '上部', '中部', '下部','平均值'],
      ['横向', 0.81,0.785,0.795,'#'],
      ['纵向', 0.778,0.786,0.796,'#'],
    ],
    table_cycle_zero: [
      ['振动时间(20次)', '①','②','③','④','⑤','平均值','单次周期'],
      ['摆盘', 0,0,0,0,0,'#','#'],
      ['摆盘+圆环',  0,0,0,0,0,'#','#'],
    ],
    zero_table_diameter: [
      ['', '上部', '中部', '下部','平均值'],
      ['横向', 0,0,0,'#'],
      ['纵向', 0,0,0,'#'],
    ],
    d_average:0,
    G : 7.9,  //此处不带10^10,后面在公式中约去了
    J_0:0,
    J:0,
    J_result:0,
    J_lilun:0,
    F:0,
    Un_J1_relative:0,
    isResult:false

  },
  changeData(e) {
    let value = e.detail.value,
      id = e.currentTarget.id
    if (value === '') {
      return false
    }
    console.log(id, value)

    if (id === "table-cycle") {
      let row = e.currentTarget.dataset.row,
        col = e.currentTarget.dataset.col
      this.setData({
        [`table_cycle[${row}][${col}]`]: value
      })
    } else if (id === "table-diameter") {
      let row = e.currentTarget.dataset.row,
        col = e.currentTarget.dataset.col
      this.setData({
        [`table_diameter[${row}][${col}]`]: value
      })
    } else if (id === 'length') {
      this.setData({
        ['inputList[0].value']: value
      })
    } else if (id === 'mass') {
      this.setData({
        ['inputList[1].value']: value
      })
    } else if (id === 'R1') {
      this.setData({
        ['inputList[2].value']: value
      })
    } else if (id === 'R2') {
      this.setData({
        ['inputList[3].value']: value
      })
    }
    // console.log(this.data.zero_table_diameter)
    console.log(this.data.inputList)


  },

  clearData(e){
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '一键清空',
      openid:wx.getStorageSync('openid') || 'false'
    })
    for(let i = 1;i<3;i++){
      for(let j = 1;j<4;j++){
        this.setData({
          [`table_diameter[${i}][${j}]`]: 0
        })
      }
    }
    for(let i = 1;i<3;i++){
      for(let j = 4;j<5;j++){
        this.setData({
          [`table_diameter[${i}][${j}]`]: '#'
        })
      }
    }
    for(let i = 1;i<3;i++){
      for(let j = 1;j<6;j++){
        this.setData({
          [`table_cycle[${i}][${j}]`]: 0
        })
      }
    }
    for(let i = 1;i<3;i++){
      for(let j = 6;j<8;j++){
        this.setData({
          [`table_cycle[${i}][${j}]`]: '#'
        })
      }
    }
    this.setData({isResult: false})

  },
  calculate() {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: this.data.title,
      control: '点击计算',
      openid: wx.getStorageSync('openid') || 'false'
    })  
    console.log(this.data.table_diameter)

    var table_cycle = this.data.table_cycle
    var table_diameter = this.data.table_diameter
    
    // 处理周期表格
    for(let i = 1;i<3;i++){
      var sum_cyc = 0
      for(let j = 1;j<6;j++){
        sum_cyc += Number(table_cycle[i][j])
      }
      table_cycle[i][6] = sum_cyc/5
      table_cycle[i][7] = table_cycle[i][6]/20
      let ave_cyc_tmp = table_cycle[i][6].toFixed(2)
      this.setData({[`table_cycle[${i}][6]`]:ave_cyc_tmp})
      ave_cyc_tmp = table_cycle[i][7].toFixed(2)
      this.setData({[`table_cycle[${i}][7]`]:ave_cyc_tmp})
    }
    // 处理钢丝表格
    for(let i = 1;i<3;i++){
      var sum_dia = 0
      for(let j = 1;j<4;j++){
        sum_dia += Number(table_diameter[i][j])
      }
      table_diameter[i][4] = sum_dia/3
      let ave_dia_tmp = Number(table_diameter[i][4].toFixed(3))
      this.setData({[`table_diameter[${i}][4]`]:ave_dia_tmp})
    }
    var d_average = (table_diameter[1][4]+table_diameter[2][4])/2
    
    // 其他计算
    var T_0 = table_cycle[1][7]
    var T_1 = table_cycle[2][7]
    var length = this.data.inputList[0].value
    var mass = this.data.inputList[1].value
    var R1 = this.data.inputList[2].value
    var R2 = this.data.inputList[3].value
    var G = this.data.G
    var pi = 3.1415926

    var F = G * pi * Math.pow(d_average,4) / (32*length)
    var J_0 = (F * Math.pow(T_0,2))/(4*pi*pi)
    var J = (F * Math.pow(T_1,2))/(4*pi*pi)
    var J_result = J-J_0
    var J_lilun = 0.5 * mass * (Math.pow(R1,2)+Math.pow(R2,2)) * 1e-9
    var Un_J1_relative = (Math.abs(J_result-J_lilun)/J_lilun*100).toFixed(2)+" %"
    console.log(d_average)
    d_average = d_average.toFixed(3)
    this.setData({d_average:d_average})
    F = (F*10000).toFixed(4)
    this.setData({F:F})
    J_0 = (J_0*10000).toFixed(4)
    this.setData({J_0:J_0})
    J = (J*10000).toFixed(4)
    this.setData({J:J})
    J_result = (J_result*10000).toFixed(4)
    this.setData({J_result:J_result})
    J_lilun = (J_lilun*10000).toFixed(4)
    this.setData({J_lilun:J_lilun})
    this.setData({Un_J1_relative:Un_J1_relative})
    this.setData({isResult:true})
    
    this.dataLog()
  },
  dataLog(){
    const str = this.dataLog2str()
    httpReq(dataLog.URL, dataLog.method, {
      page: this.data.title,
      content: str,
      openid:wx.getStorageSync('openid') || 'false'
    })
  },
  dataLog2str(){
    var str = ""
    var inputList = this.data.inputList
    for (let index = 0; index < inputList.length; index++) {
      const element = inputList[index];
      for (const key in element) {
        str += element[key]
        str += (key=='id'?';':',')
      }
      str+='\n'
    }
    var table = this.data.table_cycle
    for(let i = 0;i<table.length;i++){
      for (let j = 0; j < table[0].length; j++) {
        const element = table[i][j];
        str += element
        str += (j==table[0].length-1)?';':','
      }
      str+='\n'
    }
    var table = this.data.table_diameter
    for(let i = 0;i<table.length;i++){
      for (let j = 0; j < table[0].length; j++) {
        const element = table[i][j];
        str += element
        str += (j==table[0].length-1)?';':','
      }
      str+='\n'
    }
    console.log(str)
    return str
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: '首页',
      control: this.data.title,
      openid: wx.getStorageSync('openid') || 'false'
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