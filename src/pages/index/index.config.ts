export default {
  // navigationStyle: 'custom',
  navigationBarTitleText: 'ĺçŠćé',
  enableShareAppMessage: true,
  enableShareTimeline: true,
  enablePullDownRefresh: process.env.TARO_ENV === 'weapp' && true,
  backgroundTextStyle: 'dark',
  onReachBottomDistance: 500,
  usingComponents: true,
}
