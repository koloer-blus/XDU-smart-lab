
function httpRequest(url,method,data, callBack) {
  wx.request({
    url: url, 
    method: method,
    header: {
      'content-type': 'application/json'
    },
    data: data,
    success (res) {
     callBack(res)
    },
    complete (res) {
      console.log(res, 'ok')
    }
  })
}
module.exports = {
  httpReq: httpRequest
}