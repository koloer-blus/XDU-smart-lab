/**
 * @function 处理电动音叉产生的弦振动的测量表格数据
 * @param {Number}  weight 砝码重量
 * @param {Number} gravity 重力加速度
 * @param {Number} arcSurface 弧线面密度
 * @param {Number} antinode 波腹数
 * @param {Number} chordLength 弦线长 
 * @returns {Number} waveLength 波长
 * @returns {Number} freaquency 频率
 * @returns {Number} waveSpeeed 波速
 */
function electricTuningFork({
  weight = 0,
  gravity = 980, //换算成cm
  arcSurface = 0,
  antinode = 0,
  chordLength = 0
}) {
  if (weight === 0 || gravity === 0 || arcSurface === 0 || antinode === 0 || chordLength === 0) {
    return false
  }
  let waveLength = 2 * chordLength / antinode;
  let frequency = (1 / waveLength) * (Math.sqrt((weight * gravity / arcSurface)));
  console.log((0.5 * antinode / chordLength))
  let waveSpeed = waveLength * frequency / 100;
  return {
    weightSqrt: Math.sqrt(weight).toFixed(1),
    waveLength: waveLength.toFixed(1),
    waveSpeed: waveSpeed.toFixed(1),
    frequency: frequency.toFixed(2)
  }
}
/**
 * @function 处理电动音叉产生的弦振动的实验结果
 * @param {Number} inherentFrequency 音叉固有频率
 * @param {Number} frequency 平均频率
 */
function electricTuningForkSum({
  inherentFrequency = 99.6,
  frequency = 0
}) {
  if (inherentFrequency === 0 || frequency === 0) {
    return false
  }
  console.log(arguments)
  let frequencyDiff = Math.abs(inherentFrequency - frequency);
  let rate = frequencyDiff / inherentFrequency * 100;
  return {
    frequencyDiff: frequencyDiff.toFixed(2),
    rate: rate.toFixed(2)
  }
}
/**
 * @function 计算圆盘转动惯量
 * @param {*} arr 数组数据
 */
function threeWirePendulum(arr) {
  console.log(arr)
  let m0 = arr[0],
    m = arr[1],
    r = Math.sqrt(3) * arr[2] / 3,
    R = Math.sqrt(3) * arr[3] / 3,
    H = arr[5],
    T0 = arr[4] / 50,
    d = arr[6],
    D = arr[7],
    g = 980,
    pie = 3.1416,
    T = arr[8] / 50,
    table = arr[9],
    _arr = [];
  let res = {
    plateI0: 0,
    _plateI0: 0,
    ringI: 0,
    _ringI: 0
  }
  for (let i = 1; i < table.length; ++i) {
    let resNum = 0
    for (let j = 2; j < table[i].length - 1; ++j) {
      let item = Number(table[i][j])
      item = Math.pow(item - Number(table[i][table[i].length - 1]), 2)
      if (i < 3) {
        item = item / 3
      }
      resNum += item
    }
    _arr.push(Number((resNum / 20).toFixed(6)))
  }
  console.log(_arr)
  res.plateI0 = Number((m0 * g * R * r * T0 * T0 / (4 * pie * pie * H)).toFixed(2))
  // res.ringI = (g * R * r * ((m0 + m) * T * T - m0 * T0 * T0) / (4 * pie * pie * H)).toFixed(2)
  res.ringI = Number((g * R  * r * (m * T * T) / (4 * pie * pie * H)).toFixed(2))
  res._ringI = Math.abs(res.ringI - 0.125 * m* (d*d + D*D)).toFixed(2)
  res._plateI0 = (Math.sqrt(100 / (m * m) + (_arr[0] + 0.01 / 3) / (r * r) + (_arr[1] + 0.01 / 3) / (R * R) + (_arr[3] + 25 / 3) / (H * H) + 2 * _arr[6] / (T * T)) * res.plateI0).toFixed(2)
  console.log(res.ringI,0.125 * (m * (d*d + D*D)))
  return res
}
/**
 * @function 计算单线摆
 * @param {*} arr 
 */
function singlePendulum(arr) {
  let T0 = arr[0] / 20,
    T = arr[1] / 20,
    pie = 3.1416,
    l = arr[4],
    d = arr[5],
    _G = 7.9E10,
    m = 475,
    R1 = arr[6],
    R2 = arr[7]
  let res = {
    var0: arr[0],
    var: arr[1],
    row: arr[2],
    col: arr[3],
    J1: 0,
    J0: 0,
    _J1: 0,
    F: 0,
    E: 0,
    T0: T0,
    T: T,
    J: 0
  }
  res._J1 = 0.5 * m * (R1 * R1 + R2 * R2)
  res.F = Number(4 * pie * pie * res._J1 / (T * T - T0 * T0)).toFixed(2)
  res.J0 = Number(res.F * T0 * T0 / (4 * pie * pie)).toFixed(2)
  res.J = Number(res.F * T * T / (4 * pie * pie)).toFixed(2)
  res.J1 = Number(res.J - res.J0).toFixed(2)
  res.E = Number(Math.abs(res.J1 - res._J1) / res._J1).toFixed(2)
  return res
}
module.exports = {
  electricTuningFork,
  electricTuningForkSum,
  threeWirePendulum,
  singlePendulum
}