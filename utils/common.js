/* 
求平均数
*/
function getAverage(arg) {
  console.log("common_arg"+arg)

  var n = arg.length
  //算数平均数
  var total = 0;
  for (var i = 0; i < n; i = i + 1) {
      total = total + Number(arg[i]);
  }
  var avernum = total/n
  console.log("common_pingjun"+avernum)
  return avernum.toFixed(6)
}

/* 求A类不确定度 */
function getUncertainty_A(arg) {
  // 平均数与n
  var avernum = getAverage(arg)
  var n = arg.length
  // t因子
  var t_factor = new Array(0,0,1.84,1.32,1.20,1.14)
  var t = 1
  if(n<6) t = t_factor[n]

  var s = 0   //残差平方之和
  for(var i=0;i<n;i++)
  {
    s += Math.pow(Number(arg[i])-avernum, 2)
  }

  var sx = Math.sqrt(s/((n-1)*n)) * t
  console.log("\tA类不确定度:"+sx)
  return sx.toFixed(6)
}

/* 求整体不确定度 */
function getUncertainty(Uncertainty_A, Uncertainty_YQ) {
  var sum = Math.pow(Uncertainty_A,2) + Math.pow(Uncertainty_YQ,2)/3
  var re = Math.sqrt(sum)
  return re.toFixed(6)
}

/* ---------------------------- */
module.exports = {
  getAverage,
  getUncertainty_A,
  getUncertainty,
}

/* 复制到JS文件头部
const {
  getAverage,
  getUncertainty_A,
  getUncertainty,
} = require('../../../../utils/common')


*/