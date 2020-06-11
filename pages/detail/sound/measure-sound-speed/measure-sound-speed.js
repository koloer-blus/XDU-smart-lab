// pages/detail/sound/measure-sound-speed/measure-sound-speed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputList:[{
        label:'温度𝑡= ',
        value:'21',
        unit:'℃',
        id:'centigrade_t'
      },
      {
        label:'频率𝑓= ',
        value:'35.211',
        unit:'𝑘𝐻𝑧',
        id:'frequency_f'
      },
      {
        label:'温度不确定度 Δ𝑡= ',
        value:'0.02',
        unit:'℃',
        id:'delta_t'
      },
      {
        label:'频率不确定度 Δ𝑓= ',
        value:'0.185',
        unit:'𝑘𝐻𝑧',
        id:'delta_f'
      },
      {
        label:'波长不确定度 Δλ= ',
        value:'0.017',
        unit:'𝑚𝑚',
        id:'delta_lambda'
      },
      {
        label:'标准音速v_0= ',
        value:'331.45',
        unit:'𝑚/𝑠',
        id:'speed_v0'
      }
    ],
    temperature_T:273.15,
    speed_lilun:331.45,
    //table
    table:[
      ['ᵢ','𝐿ᵢ/𝑚𝑚','λᵢ/𝑚𝑚'],
      [1,151.50,'#'],
      [2,156.32,'#'],
      [3,161.20,'#'],
      [4,165.94,'#'],
      [5,171.22,'#'],
      [6,176.18,'#'],
      [7,181.02,'无数据'],
      [8,186.24,'无数据'],
      [9,191.10,'无数据'],
      [10,196.26,'无数据'],
      [11,201.04,'无数据'],
      [12,205.88,'无数据'],
    ],

    //isResult
    isResult:false,
    lambda_aver:0,
    speed_result:0,
    speed_wucha:0,
    delta_speed:0,
  },
  //函数
  changeData(e){
    let value = e.detail.value, id = e.currentTarget.id
    console.log(e.currentTarget)
    console.log('来自'+id+'的数据试图写入：')
    if(value === ''){
      console.log('\t写入失败')
      return false
    }
    //表格
    if(id == "table"){
      let row = e.currentTarget.dataset.row, col = e.currentTarget.dataset.col
      let table = this.data.table
      this.setData({
        [`table[${row}][${col}]`]:value
      })
      console.log(`\t成功在[${row}][${col}]处写入 `+value)
    }
    else if(id === "centigrade_t"){
      let tmp = 273.15+Number(value)
      this.setData({
        ['inputList[0].value']: value
      })
      this.setData({temperature_T:tmp})
      console.log(`\t成功写入 `+this.data.inputList[0].value)
      console.log('\t此时T='+this.data.temperature_T)
    }
    else if(id === "frequency_f"){
      this.setData({
        ['inputList[1].value']: value
      })
      console.log(`\t成功写入frequency_f `+this.data.inputList[1].value)
    }
    else if(id === "delta_t"){
      this.setData({
        ['inputList[2].value']: value
      })
      console.log(`\t成功写入delta_t `+this.data.inputList[2].value)
    }
    else if(id === "delta_f"){
      this.setData({
        ['inputList[3].value']: value
      })
      console.log(`\t成功写入delta_f `+this.data.inputList[3].value)
    }
    else if(id === "speed_v0"){
      this.setData({
        ['inputList[5].value']: value
      })
      console.log(`\t成功写入标准速度 `+this.data.inputList[5].value)
      if(!this.data.temperature_T)return
      let tmp = (value*Math.sqrt(this.data.temperature_T/273.15)).toFixed(4)
      this.setData({speed_lilun:tmp}) 
      console.log('\t此时v_lilun'+this.data.speed_lilun)
    }
    else if(id === "delta_lambda"){
      this.setData({
        ['inputList[4].value']: value
      })
      console.log(`\t成功写入delta_lambda `+this.data.inputList[4].value)
    }
    
  },
  calculate(){
    let temperature_T = this.data.temperature_T
    let speed_lilun = this.data.speed_lilun
    let table = this.data.table
    let frequency_f = this.data.inputList[1].value
    let delta_t = this.data.inputList[2].value
    let delta_f = this.data.inputList[3].value
    let delta_lambda = this.data.inputList[4].value
    // let delta_speed = this.data.delta_lambda

    console.log('开始计算')
        //初始数据计算
    //初始数据值在changeData函数中已完成
    // let tmp = 273.15+Number(this.data.centigrade_t)
    // this.setData({temperature_T:tmp})
    // console.log('\t物理学温度T='+this.data.temperature_T)
    
    // tmp = (this.data.speed_v0*Math.sqrt(this.data.temperature_T/273.15)).toFixed(4)
    // this.setData({speed_lilun:tmp}) 
    // console.log('\tv_lilun'+this.data.speed_lilun)

      //表格处理
    let sum_lambda=0,n_lambda=0
    for(let i=1;i<7;i++){
      // console.log(Number(table[i][1])+'000'+Number(table[i+6][1]))
      if(Number(table[i][1])&&Number(table[i+6][1])){
        let tmp = 1/3*(Math.abs(Number(table[i+6][1])-Number(table[i][1])))
        tmp = tmp.toFixed(4)
        console.log("\tlambda_"+i+":"+tmp)
        this.setData({[`table[${i}][2]`]:Number(tmp)})
        sum_lambda+=Number(tmp)
        n_lambda++
        console.log("\t\t此时sum="+sum_lambda)
      }
    }
    console.log("表格处理完毕")
    console.log(table)
    //--------
      //结果处理
    if(n_lambda===6&&temperature_T&&speed_lilun&&delta_t&&delta_f&&delta_lambda&&frequency_f){
        
      let tmp_lambda_aver=Number(sum_lambda/n_lambda)
      tmp_lambda_aver = tmp_lambda_aver.toFixed(4)
      console.log(tmp_lambda_aver+"@"+sum_lambda/n_lambda)
      this.setData({lambda_aver:tmp_lambda_aver})
      console.log("平均波长"+this.data.lambda_aver)

      let tmp_speed_result=frequency_f*tmp_lambda_aver
      console.log("测试：频率"+frequency_f+"波长"+tmp_lambda_aver)
      tmp_speed_result = tmp_speed_result.toFixed(4)
      this.setData({speed_result:tmp_speed_result})
      console.log("实验速度"+this.data.speed_result)

      let tmp_speed_wucha=Math.sqrt(Math.pow(delta_lambda/tmp_lambda_aver,2)+Math.pow(delta_f/frequency_f,2))
      tmp_speed_wucha = tmp_speed_wucha.toFixed(4)
      this.setData({speed_wucha:tmp_speed_wucha})
      console.log("声速误差"+this.data.speed_wucha)


      let  tmp_delta_speed = tmp_speed_wucha*tmp_speed_result
      tmp_delta_speed = tmp_delta_speed.toFixed(4)
      this.setData({delta_speed:tmp_delta_speed})
      console.log("声速不确定度"+this.data.delta_speed)

      //   this.setData({isResult:true})
      //   this.setData({speed_result:Number(frequency_f*lambda_aver)})
      //   let speed_wucha = this.data.speed_wucha
      //   let speed_result = this.data.speed_result
      //   this.setData({speed_wucha:Number(Math.sqrt(Math.pow(delta_lambda/lambda_aver,2)+Math.pow(delta_f/frequency_f,2)))})
      //   this.setData({delta_speed:speed_wucha*speed_result})
      //   console.log("当前lambda_aver"+this.data.lambda_aver)
      //   console.log("当前speed_result"+this.data.speed_result)
      //   console.log("当前speed_wucha"+this.data.speed_wucha)
      //   console.log("当前delta_speed"+this.data.delta_speed)
        // console.log("当前"+this.data.)

        // this.setData({isResult:true})
        // this.setData({isResult:true})
        // this.setData({isResult:true})
        this.setData({isResult:true})
        console.log("全部计算完毕")
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