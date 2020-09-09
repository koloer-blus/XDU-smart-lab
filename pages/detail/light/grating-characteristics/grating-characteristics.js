const {
  httpReq
} = require('../../../../api/http')
const {
  behaviorLog
} = require('../../../../api/url')
const {
  getAverage,
  getUncertainty_A,
  getUncertainty,
} = require('../../../../utils/common')
// pages/detail/Light/grating-characteristics/grating-characteristics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '光栅光谱的测量',
    inputList:[{
      label:'绿色谱线波长 𝜆= ',
      value:546.1,
      unit:"𝑛𝑚",
      id:'lambda_0'
    },
    {
      label:'仪器不确定度= ',
      value:1,
      unit:"分",
      id:'Un_YQ'
    }],
    //记录表
    // table:[
    //   ['',"𝜽𝘈","𝜽𝘉","𝜽𝘈'","𝜽𝘉'","𝜑"],
    //   ['黄1光',0,0,0,0,'#'],
    //   ['黄2光',0,0,0,0,'#'],
    //   ["绿光1",0,0,0,0,'#'],
    //   ["绿光2",0,0,0,0,'#'],
    //   ['绿光3',0,0,0,0,'#'],
    // ],
    table:[
      ['',"𝜽𝘈","𝜽𝘉","𝜽𝘈'","𝜽𝘉'","𝜑"],
      ['黄₁光',260.35,80.35,240.42,60.39,'#'],
      ['黄₂光',260.31,80.31,240.45,60.41,'#'],
      ["绿光1",260.0,80,241.18,61.14,'#'],
      ["绿光2",260.01,80.02,241.19,61.16,'#'],
      ['绿光3',259.55,79.54,240.22,62.19,'#'],
    ],
    //下表以秒为单位
    sec_table:[
      ['',"𝜽𝘈","𝜽𝘉","𝜽𝘈'","𝜽𝘉'","𝜑"],
      ['黄₁光',0,0,0,0,'#'],
      ['黄₂光',0,0,0,0,'#'],
      ["绿光1",0,0,0,0,'#'],
      ["绿光2",0,0,0,0,'#'],
      ['绿光3',0,0,0,0,'#'],
    ],

    //中间数据
    phi_aver:0,  //绿光的平均phi
    d1:0,       //绿光的d(lambda/sinphi)
    d2:0,       //绿光的d(lambda/sinphi)
    d3:0,       //绿光的d(lambda/sinphi)
    d_aver:0,   //绿光的d平均
    Un_d_relative:0, //相对不确定度
    Un_d:0,  // 绿光的d误差
    
    //黄光
    lambda_yellow_1:0,   //黄光1 波长
    lambda_yellow_2:0,   //黄光2 波长

  },

  /**
   * 数据监听
   */
  changeData(e){
    let value = e.detail.value, id = e.currentTarget.id
    
    console.log('来自'+id+'的数据试图写入：')
    if(value === ''){
      console.log('\t写入失败')
      return false
    }

    if(id == "table")
    {
      let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
      var sec_value = this.data2sec(value)
      this.setData({
        [`table[${row}][${col}]`]:value,
        [`sec_table[${row}][${col}]`]:sec_value
      })
      console.log(`\t成功在表[${row}][${col}]处写入 `+value)
      console.log(`\t成功在里表[${row}][${col}]处写入 `+sec_value)
    }
    else if(id === "lambda_0"){
      this.setData({
        ['inputList[0].value']: value
      })
      
      console.log(`\t成功写入lambda_0 `+this.data.inputList[0].value)
    }
    else if(id === "Un_YQ"){
      this.setData({
        ['inputList[1].value']: value
      })
      console.log(`\t成功写入Un_YQ `+this.data.inputList[1].value)
    }
},

   /**
   * 计算
   */
    calculate(){
      httpReq(behaviorLog.URL, behaviorLog.method, {
        page: this.data.title,
        control: '点击计算',
        openid:wx.getStorageSync('openid') || 'false'
      })
        console.log("开始计算!")

        let lambda_0 = this.data.inputList[0].value //nm
        let Un_YQ = this.data.inputList[1].value //nm

        let table = this.data.table
        let sec_table = this.data.sec_table

        let phi_aver = 0
        let d1 = 0, d2 = 0, d3 = 0
        let d_aver = 0
        let Un_d = 0
        let Un_d_relative = 0

        let isOver360 = false
        let isResult=false
 
        //处理表格
        this.refreshTable()
        for(var i=1;i<6;i++){
          if (Number(sec_table[i][1])&&Number(sec_table[i][2])&&Number(sec_table[i][3])&&Number(sec_table[i][4])) {
            let alphaA = Math.abs(sec_table[i][1]-sec_table[i][3])
            let alphaB = Math.abs(sec_table[i][2]-sec_table[i][4])
            //检测是否过360
            if(alphaA>10800){
              alphaA = 21600 - alphaA
              isOver360 = true
            }
            if(alphaB>10800){
              alphaB = 21600 - alphaB
              isOver360 = true
            }
            let alphai = (alphaA+alphaB)/4
            console.log("正在处理第"+i+"行,ΔθA="+alphaA+",ΔθB="+alphaB+"\talpha_"+i+":"+alphai+"是否过360:"+isOver360)
            this.setData({[`sec_table[${i}][5]`]:Number(alphai)})
            this.setData({[`table[${i}][5]`]:Number(this.sec2data(alphai))})
            this.setData({['isOver360']:isOver360})
          
            //计算光栅常数d
            if (i>2) {
              phi_aver = Number(alphai.toFixed(4)) + Number(phi_aver)
              if (i===3){
                d1 = Number(lambda_0/Math.sin(alphai/60*Math.PI/180))
                d_aver += Number(d1)
                console.log("d1"+d1)
              }
              if (i===4){
                d2 = Number(lambda_0/Math.sin(alphai/60*Math.PI/180))
                d_aver += Number(d2)
                console.log("d2"+d2)
              }
              if (i===5){
                d3 = Number(lambda_0/Math.sin(alphai/60*Math.PI/180))
                d_aver += Number(d3)
                console.log("d3"+d3)
              }
            }
          }
          else{
            this.setData({['isResult']:false})
            return
          }
        }
        //一般数据处理
        phi_aver = (Number(phi_aver/3))    //sec

        // lambda的处理
        var data = new Array()
        console.log(sec_table)
        for (let index = 3; index < 6; index++) {
          data[index-3] = sec_table[index][5];
        }
        console.log(data)
        var Un_phi_A = getUncertainty_A(data)
        var Un_phi = getUncertainty(Un_phi_A,Un_YQ)
        console.log("un_phi"+Un_phi)
        // console.log("phi_aver"+phi_aver)

        // 绿光d的处理
        d_aver = Number((d1+d2+d3)/3)  //nm
        Un_d_relative = Number(Number(Un_phi*0.000291) / Math.tan(phi_aver/60*Math.PI/180))
        console.log(Un_d_relative)
        Un_d = Un_d_relative * Number(d_aver)
        
        //黄光
        var phi_yellow_1 = sec_table[1][5]
        var phi_yellow_2 = sec_table[2][5]
        var sin1 = Math.sin(phi_yellow_1/60*Math.PI/180)
        var sin2 = Math.sin(phi_yellow_2/60*Math.PI/180)
        var lambda_yellow_1 = d_aver * sin1
        var lambda_yellow_2 = d_aver * sin2
        
        // 装载
        var phi_aver_str = this.data2str(this.sec2data(phi_aver))   //mm
        this.setData({["phi_aver"]:phi_aver_str})
        console.log("phi_aver 已更新:"+this.data.phi_aver)
        var d1_str = (Number(d1/1000)).toFixed(2)   //mm
        this.setData({["d1"]:d1_str})
        console.log("d1 已更新(mm):"+this.data.d1)
        var d2_str = (Number(d2/1000)).toFixed(2)   //mm
        this.setData({["d2"]:d2_str})
        console.log("d2 已更新:"+this.data.d2)
        var d3_str = (Number(d3/1000)).toFixed(2)   //mm
        this.setData({["d3"]:d3_str})
        console.log("d3 已更新:"+this.data.d3)
        var d_aver_str = (Number(d_aver/1000)).toFixed(2)   //mm
        this.setData({["d_aver"]:d_aver_str})
        console.log("d_aver 已更新:"+this.data.d_aver)
        var Un_d_str = (Number(Un_d)).toFixed(1)   //mm
        this.setData({["Un_d"]:Un_d_str})
        console.log("Un_d 已更新:"+this.data.Un_d)
        var Un_d_relative_str = (Un_d_relative*100).toFixed(2)+' %'
        this.setData({["Un_d_relative"]:Un_d_relative_str})
        console.log("Un_d_relative 已更新:"+this.data.Un_d_relative)
        //黄光波长
        var lambda_yellow_1_str = lambda_yellow_1.toFixed(2)
        this.setData({["lambda_yellow_1"]:lambda_yellow_1_str})   
        console.log("lambda_yellow_1 已更新:"+this.data.lambda_yellow_1)  //nm

        var lambda_yellow_2_str = lambda_yellow_2.toFixed(2)
        this.setData({["lambda_yellow_2"]:lambda_yellow_2_str})
        console.log("lambda_yellow_2 已更新:"+this.data.lambda_yellow_2)  //nm

        this.setData({["isResult"]:true})
        console.log("计算完毕!")
  },

  //刷新真值表
  refreshTable(){
    for (var i = 1;i<6;i++){
      for(var j = 1;j<5;j++){
        var table = this.data.table
        var sec_value = Number(this.data2sec(table[i][j]))
        this.setData({
          [`sec_table[${i}][${j}]`]:sec_value
        })
      }
      // console.log("表格初始化完成")
    }
    console.log(this.data.sec_table)

  },

   /**
   * 角度转换
   */
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

//    data2rad(n){
//       n = Number(n)
//       var z = n.toFixed(0)
//       var x =0+ n-z
//       if(x<0){
//         z -= 1
//         x += 1
//       }
//       // console.log('z'+z+'x'+x)
//       var re = Number(Number(z) + x / 0.6)
//       re = re.toFixed(4)
//       console.log("\t已将伪度数:"+n+" 转换为rad:"+re)
//       return re 
//    },

//    rad2data(n){
//     n = Number(n)
//     var z = n.toFixed(0)
//     var x = n-z
//     if(x<0){
//       z -= 1
//       x += 1
//     }
//     // console.log(z+'@'+x)
//     var re = Number(Number(z) +x* 0.6)
//     re = re.toFixed(4)
//     console.log("\t已将rad:"+n+" 转换为伪度数:"+re)
//     return re 
//  },

//  rad2str(n){
//   n = Number(n)
//   console.log(n)
//   // n = n.toFixed(2)
//   var z = n.toFixed(0)
//   var x = (n-z)
//   if(x<0){
//     z -= 1
//     x += 1
//   }
//   z = Number(z).toFixed(0)
//   x = Number(x*100).toFixed(0)
//   var re = z +'°'+x+"'"
//   return re
//  },


//  Sx(){
//   var n = arguments.length
//   //算数平均数
//   var total = 0;
//   for (var i = 0; i < n; i = i + 1) {
//       total = total + arguments[i];
//   }
//   var avernum = total/arguments.length
//   console.log("\t\t正在标准差计算:平均数计算完毕:"+avernum)
//   //标准偏差
//   var s = 0
//   for(var i=0;i<n;i++)
//   {
//     s += (arguments[i]-avernum)*(arguments[i]-avernum);
//   }
//   s = Math.sqrt(s/(n-1))
//   console.log("\t\t正在标准差计算:标准偏差计算完毕:"+s)
//   //A类不确定度
//   var sx = s/Math.sqrt(n)
//   console.log("\t\t正在标准差计算:A类不确定度:"+sx)
//   return sx
// },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    httpReq(behaviorLog.URL, behaviorLog.method, {
      page: '首页',
      control: this.data.title,
      openid:wx.getStorageSync('openid') || 'false'
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