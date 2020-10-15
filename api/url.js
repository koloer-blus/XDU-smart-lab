const baseUrl = 'https://smartlab.backend.117503445.top'
const feedBack = '/api/feedback'
const behaviorLog = '/api/BehaviorLog'
const dataLog = '/api/DataLog'
const getOpenId = '/api/wechat/openid'
module.exports = {
  feedBack: {
    URL: feedBack,
    method: 'POST'
  },
  behaviorLog: {
    URL: behaviorLog,
    method: 'POST'
  },
  dataLog: {
    URL: dataLog,
    method: 'POST'
  },
  getId: {
    URL: getOpenId,
    method: 'GET'
  }
}