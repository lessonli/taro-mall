export default {
  // navigationStyle: 'custom',
  navigationBarTitleText: '博物有道',
  enableShareAppMessage: true,
  enableShareTimeline: true,
  enablePullDownRefresh: process.env.TARO_ENV === 'weapp' && true,
  backgroundTextStyle: 'dark',
  onReachBottomDistance: 500,
  usingComponents: true,
}
