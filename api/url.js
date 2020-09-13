const baseUrl = 'https://smartlab.backend.117503445.top'
const feedBack = '/api/feedback'
const behaviorLog = '/api/BehaviorLog'
const getOpenId = '/wechat/openid'
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
    URL: baseUrl+getOpenId,
    method: 'GET'
  }
}