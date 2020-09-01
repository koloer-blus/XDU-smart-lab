
function httpRequest(url,method,data, callBack = (res) => {
  console.log(res)
}) {
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
      console.log('ok')
    }
  })
}
module.exports = {
  httpReq: httpRequest
}