const baseUrl = 'https://smartlab.backend.117503445.top'
const devUrl = 'https://smartlab.backend.117503445.top'
// const devUrl = 'https://dev.117503445.top'

function httpRequest(url, method, data, callBack = (res) => {
  console.log(res)
  }) {
  // 判断小程序版本并生成url
  const accountInfo = wx.getAccountInfoSync();
  const env = accountInfo.miniProgram.envVersion;
  
  if (!env) {
    console.error("获取运行环境失败!");
  }
  if (env === "release") {
    url = baseUrl + url
  } else {
    url = devUrl + url
  }

  wx.request({
    url: url,
    method: method,
    header: {
      'content-type': 'application/json'
    },
    data: data || {},
    success(res) {
      callBack(res)
    },
    complete(res) {
      console.log('complete:', res)
    }
  })
}
module.exports = {
  httpReq: httpRequest
}