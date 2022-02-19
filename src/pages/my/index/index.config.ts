
export default {
  // navigationStyle: 'custom',
  navigationBarTitleText: '我的',
  enableShareAppMessage: true,
  enableShareTimeline: true,
  enablePullDownRefresh: process.env.TARO_ENV === 'weapp' && true,
  backgroundTextStyle: 'dark',
  onReachBottomDistance: 700,
  // usingComponents: true,
}
