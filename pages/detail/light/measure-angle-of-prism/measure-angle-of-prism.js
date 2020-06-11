// pages/detail/Light/measure-angle-of-prism/measure-angle-of-prism.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputList:[{
      label:'仪器不确定度ΔB= ',
      value:1,
      unit:"分",
      id:'uncertainty_B'
    }
    ],
    //下表为了方便输入而设立
    table:[
      ['序号',"θA","θB","θA'","θB'",'α_i'],
      ['①',226.44,46.45,105.36,285.37,'#'],
      ['②',224.46,44.44,103.53,283.52,'#'],
      ['③',225.22,45.20,105.07,285.07,'#'],
      ['④',218.30,38.30,40.00,278.30,'#'],
    ],
    //备份空白表格
    // table:[
    //   ['序号',"θA","θB","θA'","θB'",'α_i'],
    //   ['①',0,0,0,0,'#'],
    //   ['②',0,0,0,0,'#'],
    //   ['③',0,0,0,0,'#'],
    //   ['④',0,0,0,0,'#'],
    // ],
    //下表以秒为单位
    sec_table:[
      ['序号','θA','θB','θA`','θB`','α_i'],
      ['①',0,0,0,0,'#'],
      ['②',0,0,0,0,'#'],
      ['③',0,0,0,0,'#'],
      ['④',0,0,0,0,'#'],
    ],

    //结果
    alpha_aver:0,
    uncertainty_A:0,
    uncertainty_all:0,

    alpha_aver_str:'',
    uncertainty_A_str:'@',
    uncertainty_all_str:'@',

    e_relative:0,   //相对误差

    //判断标志
    isOver360:false,
    isResult:false,

  },

  //函数
  //改变数字
  changeData(e){
    let value = e.detail.value, id = e.currentTarget.id
    // console.log(e.currentTarget)
    console.log('来自'+id+'的数据试图写入：')
    if(value === ''){
      console.log('\t写入失败')
      return false
    }

    if(id == "table"){
      let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
      let table = this.data.table
      let sec_table = this.data.sec_table
      var sec_value = this.data2sec(value)
      this.setData({
        [`table[${row}][${col}]`]:value,
        [`sec_table[${row}][${col}]`]:sec_value
      })
      console.log(`\t成功在表[${row}][${col}]处写入 `+value)
      console.log(`\t成功在里表[${row}][${col}]处写入 `+sec_value)
    }
    else if(id === "uncertainty_B"){
      this.setData({
        ['inputList[0].value']: value
      })
      console.log(`\t成功写入uncertainty_B `+this.data.inputList[0].value)
    }
  },

  //计算
  calculate(){
    let uncertainty_A 
    let uncertainty_B = this.data.inputList[0].value
    let uncertainty_all

    let table = this.data.table
    let sec_table = this.data.sec_table
    let isOver360 = false
    let alpha_aver = 0
    console.log("开始计算")

    //计算表格数据
    this.refreshTable()
    for(var i=1;i<5;i++){
      if(Number(sec_table[i][1]&&sec_table[i][2]&&sec_table[i][3]&&sec_table[i][4])){
        let alphaA = Math.abs(sec_table[i][1]-sec_table[i][3])
        let alphaB = Math.abs(sec_table[i][2]-sec_table[i][4])
        //todo:检测是否过360
        if(alphaA>10800){
          alphaA = 21600 - alphaA
          isOver360 = true
        }
        if(alphaB>10800){
          alphaB = 21600 - alphaB
          isOver360 = true
        }
        let alphai = (alphaA+alphaB)/4
        alpha_aver += alphai
        console.log("正在处理第"+i+"行,ΔθA="+alphaA+",ΔθB="+alphaB+"\talpha_"+i+":"+alphai+"是否过360:"+isOver360)
        this.setData({[`sec_table[${i}][5]`]:Number(alphai)})
        this.setData({[`table[${i}][5]`]:Number(this.sec2data(alphai))})
        this.setData({['isOver360']:isOver360})
      }
      else{
        console.log("Error: 表格第"+i+"行出错退出")
        return 
      }
    }
    alpha_aver = this.sec2data(alpha_aver/4)
    let alpha_aver_str = this.data2str(alpha_aver)
    this.setData({['alpha_aver']:Number(alpha_aver)})
    this.setData({['alpha_aver_str']:alpha_aver_str})
    
    console.log("表中数据均已处理,alpha_aver:"+this.data.alpha_aver)

    //计算不确定度
    uncertainty_A = this.Sx(sec_table[1][5],sec_table[2][5],sec_table[3][5],sec_table[4][5])
    uncertainty_A = uncertainty_A.toFixed(0)
    // console.log(uncertainty_B)
    let ua2 = uncertainty_A*uncertainty_A
    let ub2 = uncertainty_B*uncertainty_B
    // console.log(ua2+"@"+ub2)
    uncertainty_all = Math.sqrt(ua2+ub2)
    uncertainty_all = uncertainty_all.toFixed(0)
    // console.log("总误差:"+uncertainty_all)
    let e_relative = (uncertainty_all/(this.data2sec(alpha_aver))*100).toFixed(2)
    let ua_str = this.data2str(this.sec2data(uncertainty_A))
    let ull_str = this.data2str(this.sec2data(uncertainty_all))
    this.setData({
      ['uncertainty_A']:uncertainty_A
    })
    this.setData({
      ['uncertainty_all']:uncertainty_all
    })
    this.setData({
      ['uncertainty_A_str']:ua_str
    })
    this.setData({
      ['uncertainty_all_str']:ull_str
    })
    this.setData({
      ['e_relative']:e_relative
    })
    
    console.log("A类不确定度:"+this.data.uncertainty_A)
    console.log("相对误差:"+this.data.e_relative)
    this.setData({isResult:true})
    console.log("计算完毕")
  },
  
  //刷新真值表
  refreshTable(){
    for (var i = 1;i<5;i++){
      for(var j = 1;j<5;j++){
        var table = this.data.table
        var sec_value = Number(this.data2sec(table[i][j]))
        this.setData({
          [`sec_table[${i}][${j}]`]:sec_value
        })
      }
      console.log("表格初始化完成")
      console.log(this.data.sec_table)
    }



  },
  //真伪度数转换
  data2sec(n){
    n = Number(n)
    var z = Math.floor(n)
    var x = n-z
    if(x<0){
      z -= 1
      x += 1
    }
    var re = 60*z + 100*x
    re = re.toFixed(0)
    console.log("\t已将伪度数:"+n+" 转换为秒数:"+re)
    return re
  },
  sec2data(n){
    n = Number(n)
    var x = (n%60)
    var z = (n-x)/60
    if(x<0){
      z -= 1
      x += 1
    }
    var re = z + x/100
    re = re.toFixed(2)
    console.log("\t已将秒数:"+n+" 转换为伪度数:"+re)
    return re
  },
  data2str(n){
    n = Number(n)
    var z = Math.floor(n)
    var x =((n-z)*100).toFixed(0)
    if(x<0){
      z -= 1
      x += 1
    }
    var re = ''+ z + '°' + x + "'"
    console.log("\t已将伪度数:"+n+" 转换为str:"+re)
    return re
  },

  //计算不确定度
  Sx(){
    var n = arguments.length
    //算数平均数
    var total = 0;
    for (var i = 0; i < n; i = i + 1) {
        total = total + arguments[i];
    }
    var avernum = total/arguments.length
    //标准偏差
    var s = 0
    for(var i=0;i<n;i++)
    {
      s += (arguments[i]-avernum)*(arguments[i]-avernum);
    }
    s = Math.sqrt(s/(n-1))
    //A类不确定度
    var sx = s/Math.sqrt(n)
    console.log("\tSx:平均数:"+avernum+"\tA类不确定度:"+sx)
    return sx
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
    this.data2sec(61.25)
    this.sec2data(3671)
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