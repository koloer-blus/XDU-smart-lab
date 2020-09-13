
function httpRequest(url,method,data, callBack = (res) => {
  console.log(res)
}) {
  wx.request({
    url: url, 
    method: method,
    header: {
      'content-type': 'application/json'
    },
    data: data || {},
    success (res) {
     callBack(res)
    },
    complete (res) {
      console.log('complete:',res)
    }
  })
}
module.exports = {
  httpReq: httpRequest
}