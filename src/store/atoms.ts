import { session } from '@/utils/storge'
import { atom } from 'recoil'
import Taro from '@tarojs/taro'
const isLogin = session.getItem('hasLogin')
// 会话准备完毕？ 
export const isImReady = atom<boolean>({
  key: 'isImReady',
  default: false
})


// 会话列表 
export const conversationList = atom<any[]>({
  key: 'conversationList',
  default: []
})

// 未读数
export const noReadNumber = atom<number>({
  key: 'noReadNumber',
  default: 0
})

// 官方通知数量
export const noReadNumber_notice = atom<number>({
  key: 'noReadNumber_notice',
  default: 0
})

// 官方通知数量
export const noReadNumber_trade = atom<number>({
  key: 'noReadNumber_trade',
  default: 0
})

// 参拍数量
export const noReadNumber_bidding = atom<number>({
  key: 'noReadNumber_bidding',
  default: 0
})

// 买家未读数量
export const noReadNumber_buyer = atom<number>({
  key: 'noReadNumber_buyer',
  default: 0
})

// 卖家未读数量
export const noReadNumber_merchant = atom<number>({
  key: 'noReadNumber_merchant',
  default: 0
})

// 收到的消息
export const receivedMessage = atom<any>({
  key: 'receivedMessage',
  default: {}
})

// 直播间弹窗
export const liveModal = atom<any>({
  key: 'liveModal',
  default: { type: 'none', payload: {} }
})

// webWork
export const worker = atom<any>({
  key: 'worker',
  default: process.env.TARO_ENV === 'weapp' ? Taro.createWorker('workers/request/index.js') : null
})

// 是否登录了 
export const hasLogin = atom<any>({
  key: 'hasLogin',
  default: isLogin
})

// 购物车单个出价信息 
export const shoppingCarListInfo = atom<any>({
  key: 'shoppingCarListInfo',
  default: isLogin
})

export const liveUserInfo = atom<any>({
  key: 'liveUserInfo',
  default: {
    nick: '',
    headImg: '',
    identifier: '',
    img: ''
  }
})

// 首页数据
export const HomeData = atom<any>({
  key: 'HomeData',
  default: {
    bannerList: null,
    searchList: null
  }
})

// 直播间历史消息缓存间隔 
export const liveHistoryIn = atom<boolean>({
  key: 'liveHistoryIn',
  default: false
})

// 选中的当前tab index 
export const selectTabIndex = atom<number | undefined>({
  key: 'selectTabIndex',
  default: 0
})