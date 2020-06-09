// pages/detail/Electricity/measure-low-resistance/measure-low-resistance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //R1&R3
    inputList:[{
      label:'R1= ',
      value:'1000',
      unit:'Ω',
      id:'resistance_1'
    },
    {  
      label:'R3= ',
      value:'100',
      unit:'Ω',
      id:'resistance_3'
    }],
    //table_diameter
    table_diameter:[
      ['序号','①','②','③','④','⑤','⑥'],
      ['直径 d/mm',3.958,3.955,3.956,3.951,3.953,3.952],
    ],
    //table_length
    table_length:[
      ['序号','①','②','③','④','⑤','⑥','⑦','⑧'],
      ['长度L/mm',100.0,140.0,180.0,220.0,260.0,300.0,340.0,380.0],
      ['RN正/Ω',0.00558,0.00775,0.01000,0.01224,0.01446,0.01670,0.01891,0.02127],
      ['RN反/Ω',0.00565,0.00787,0.01150,0.01236,0.01466,0.01686,0.01916,0.02139],
      ['RN平均/Ω','#','#','#','#','#','#','#','#'],
      ['Rx/×10^-3 Ω','#','#','#','#','#','#','#','#'],
      ['ρ /×10^-9 Ω·M','#','#','#','#','#','#','#','#']
    ],
    //参数
    diameter_aver:0,
    rho_aver: 0,
    K:0, //K是一个中间系数
    Num_data:0,   //表2的有效数据

    //其他控件
    isResult:false,  
  },
  //函数
  changeData(e){

      let value = e.detail.value, id = e.currentTarget.id
      console.log('来自'+id+'的数据试图写入：')
      if(value === ''){
        return false
      }
      if(id == "table_diameter"){
        let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
        let table_diameter = this.data.table_diameter
        this.setData({
          [`table_diameter[${row}][${col}]`]:value
        })
        console.log(`\t成功在[${row}][${col}]处写入 `+value)
      }
      else if(id == "table_length"){
        let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
        this.setData({
          [`table_length[${row}][${col}]`]:value
        })
        console.log(`\t成功在[${row}][${col}]处写入 `+value)
      }
      else if(id === "resistance_1"){
        this.setData({
          ['inputList[0].value']: value
        })
        console.log(`\t成功写入 `+value)
      }
      else if(id === "resistance_3"){
        this.setData({
          ['inputList[1].value']: value
        })
        console.log(`\t成功写入 `+value)
      }
      else{
        console.log('\t写入失败')
      }
  },
  calculate(){
    //表1,直径计算
    console.log('开始计算')
    let table = this.data.table_diameter[1],sum = 0 ,n=0
    console.log(table)
    for(let i = 1;i < table.length;i++){
      let tmp = Number(table[i])
      
      if(tmp!==0){
        sum += tmp
        n++
      }
      
    }
    if(sum !== 0){
      this.setData({diameter_aver : sum/n})
      console.log('直径计算完毕：'+this.data.diameter_aver)
    }else{
      console.log('直径计算失败')
      return
    }
    //表2,长度计算
        //预备工作
    let r1 = this.data.inputList[0].value,r3 = this.data.inputList[1].value
    let K = this.data.K
    K = Math.PI*this.data.diameter_aver*this.data.diameter_aver/4 
    if(!r1||!r3||!K){
      console.log("R1 R3或直径无效.")
      return
    }else{
      console.log("K="+K)
    }//计算K 并检查r1r3是否到位
    this.setData({isResult:false})
        //正式处理表格
    table = this.data.table_length
    n = 0,sum = 0
    console.log(table)
    console.log(table[1][8])
    for(let i = 1;i<table[0].length;i++){
      
      if(Number(table[1][i])&&Number(table[2][i])&&Number(table[3][i])){
        let v1 = (Number(table[2][i])+Number(table[3][i]))/2
        let v2 = Number(v1) * r1 / r3 * 1000
        let v3 = Number(v2) * K * 0.000001 / Number(table[1][i]) *1000 * 1000000
        v1 = v1.toFixed(4)
        v2 = v2.toFixed(4)
        v3 = v3.toFixed(4)
        console.log(v1,v2,v3)
        this.setData({
          [`table_length[4][${i}]`] : v1,
          [`table_length[5][${i}]`] : v2,
          [`table_length[6][${i}]`] : v3
        })
        n++
        sum += Number(v3)
        this.setData({isResult:true})
        console.log(`第${i}列数据处理完毕`)
      }
    }
    if(!Boolean(this.data.isResult)){
      console.log("表2中没有数据")
      return
    }
    console.log(sum+'@'+n)
    this.setData({
      K : K,
      Num_data : n,
      rho_aver : (sum/n).toFixed(4)
    })
    console.log("计算完毕,ρ="+this.data.rho_aver)
    console.log(this.data.isResult)
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