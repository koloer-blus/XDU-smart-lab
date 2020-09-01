const baseUrl = 'https://smartlab.backend.117503445.top/api'
const feedBack = '/feedback'
const behaviorLog = '/BehaviorLog'
const getOpenId = 'https://smartlab.backend.117503445.top/wechat/openid'
module.exports = {
  feedBack: {
    URL: baseUrl + feedBack,
    method: 'POST'
  },
  behaviorLog: {
    URL: baseUrl + behaviorLog,
    method: 'POST'
  },
  getId: {
    URL: getOpenId,
    method: 'GET'
  }
}