
function httpRequest(url,method,data, callBack) {
  console.log(url , method, data)
  wx.request({
    url: url, 
    method: method,
    header: {
      'content-type': 'application/json'
    },
    data: data,
    success (res) {
      let result = callBack(res)
      console.log(result)
    },
    complete (res) {
      console.log(res, 'ok')
    }
  })
}
module.exports = {
  httpReq: httpRequest
}