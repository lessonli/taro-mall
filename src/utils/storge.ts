import { genUuid } from '@/components/Upload/oss'
import { isAppWebview } from '@/constants'
import Taro from '@tarojs/taro'

const getType = (value: any): string => Object.prototype.toString.call(value).slice(8, -1)

class Cache<T> {

  private storge: Storage

  private nameSpace: string = 'NAMESPACE'

  private state: T = {}

  private acceptValueTypes = [
    'Object', 'Array', 'Number', 'String', 'Boolean'
  ]

  private _initalValue: T = {}
  constructor(
    state: T,
    nameSpace: string = '',

    // storge: Storage = window.localStorage
  ) {
    this._initalValue = JSON.parse(JSON.stringify(state)) as T
    // 自动初始化
    this.storge = {
      getItem: (key: string): any => {
        return Taro.getStorageSync(key)
      },
      setItem: (key: string, data: string) => {
        Taro.setStorageSync(key, data,)
      },
      removeItem: (key: string) => {
        Taro.setStorageSync(key, '')
      },
    }
    this.state = state
    this.nameSpace = nameSpace
    this.init()
  }

  private init() {
    const keys = Object.keys(this.state)
    let localState = this.storge.getItem(`${this.nameSpace}_u-cache`) || '{}'
    localState = JSON.parse(localState) || {}
    keys.forEach((key) => {
      if (localState[key] !== undefined) {
        const valueType = getType(localState[key])
        if (this.acceptValueTypes.includes(valueType)) {
          this.state[key] = localState[key]
        } else {
          console.error(`不支持 ${key} 初始化 为 ${valueType}类型`)
        }
      } else {
        this.setItem(key, this.state[key])
      }
    })

    console.log('storge 初始化', this.state)
  }
  /**
   *
   * @param key 缓存key
   * @param value 缓存值
   */
  public setItem<K extends keyof T>(key: K, value: T[K]) {
    if (!this.acceptValueTypes.includes(getType(value))) {
      return console.error(`不支持 ${key} 为 ${getType(value)}类型`)
    }
    this.state[key] = value
    this.storge.setItem(
      `${this.nameSpace}_u-cache`,
      JSON.stringify(this.state)
    )
  }
  public resetItem<K extends keyof T>(key: K) {
    this.setItem(key, this._initalValue[key])
  }
  /**
   * 获取缓存值
   * @param key
   */
  public getItem<K extends keyof T>(key: K): T[K] {
    const value = this.state[key]
    if (value === undefined) {
      console.error(`构造函数中没有初始化${key}字段`)
    }
    return value
  }

  /**
   * 不要使用这个api 用resetItem
   * 并不是真正的删除该字段 只是置空
   * @param key
   */
  public removeItem<K extends keyof T>(key: K) {
    this.setItem(key, '')
  }
  /**
   * 并不是真正的清空所有字段 只是置空
   * @param key
   */
  public clearAll() {
    Object.keys(this.state).forEach(item => {
      if (!item.startsWith('_')) {
        this.resetItem(item)
      }
    })
  }
}

const defaultStorge = {
  token: '',
  publishProductInfo: {
    productId: undefined,
    productType: undefined,
  },
  // 广告位时间间隔列表
  inrTimeList: '',
  // 发布商品 草稿箱 _draft
  publishProductDrafts: [],

  // 当前用户身份 buyer | merchant
  userCurrentPosition: 'buyer',

  //是否有商家身份
  hasMerchant: 'buyer',

  // 搜索历史记录
  searchHistory: [],

  // 店铺认证弹窗 每天谈一次
  lastOpenDateWhenMerchantNotAuthed: '',
  // 足迹
  foorPrints: [],
  // 物流信息页面需要使用的 icon
  expressIcon: '',
  today: '', // 首页一天弹一次的操作
  accumulativeShareReward: 0, // 累计分享奖励 增加时弹窗
  //点赞间隔
  spotTime: '',
}

const storge = new Cache<typeof defaultStorge>(
  defaultStorge,
  'BW',
)

/**
 * 足迹👣
 */
export const foorPrints = {
  getList: function (result: {
    pageNo: number;
    pageSize: number;
  }) {
    const { pageNo, pageSize } = result
    const fullList = storge.getItem('foorPrints') || []
    const list = fullList.filter((_, i) => (i >= (pageNo - 1) * pageSize) && i < pageNo * pageSize)
    return Promise.resolve({
      list,
      total: fullList.length,
      pageNo,
      pageSize,
    })
  },
  addItem: function (data) {
    // 最多存50条
    const maxl = 50
    const list = storge.getItem('foorPrints') || []
    // 去重
    let xList = [{ ...data, _time: new Date().getTime() }].concat(list.filter(item => item.uuid !== data.uuid))

    if (xList.length > maxl) {
      xList = xList.slice(0, maxl)
    }

    storge.setItem('foorPrints', xList)
  }
}

export default storge

class SessionStorge<T> {


  private state: T

  private acceptValueTypes = [
    'Object', 'Array', 'Number', 'String', 'Boolean'
  ]

  private _key = `BW_session`

  private _initalValue: T

  constructor(initalState: T) {

    this._initalValue = JSON.parse(JSON.stringify(initalState))

    if (process.env.TARO_ENV === 'h5') {
      const x = window.sessionStorage.getItem(this._key)
      if (x) {
        const a = JSON.parse(x)
        this.state = a
      } else {
        window.sessionStorage.setItem(this._key, JSON.stringify(initalState))
        this.state = initalState
      }

    } else {
      this.state = initalState
    }
  }

  public setItem<K extends keyof T>(key: K, value: T[K]) {
    if (process.env.TARO_ENV === 'h5') {
      const b = {
        ...this.state,
        [key]: value
      }
      window.sessionStorage.setItem(this._key, JSON.stringify(b))
      this.state[key] = value
    } else {
      // 小程序 不带刷新能力 其实就是变量
      this.state[key] = value
    }
  }

  public getItem<K extends keyof T>(key: K): T[K] {
    return this.state[key]
  }

  // 恢复初始值
  public resetItem(key: keyof T) {
    this.setItem(key, this._initalValue[key])
  }

  public clearAll() {
    // this.setItem(key, this._initalValue[key])
    Object.keys(this.state).forEach(item => {
      if (!item.startsWith('_')) {
        this.resetItem(item)
      }
    })
  }
}


const defaultSession = {
  scene: '',
  _userInfo: {
    userId: '',
    nickName: '',
    userLevel: '',
  },
  /**
   * 获取本商户的直播中的直播间 跨页面通信用
   * http://yapi.bwyd.com/project/21/interface/api/4542
   */
  'api4542': {
    recordId: '',
  },

  'pages/order/express/company/index': {
    companyCode: '',
    companyName: '',
  },
  'pages/other/address/index': {
    // 上次选中的 地址
    activedAddressNo: '',
  },
  'pages/other/address/addAddress/index': {

  },
  // 认证
  'pages/storeApprove/index': {
    merchantNo: '',
    shopName: '',
    shopLogo: '',
    shopIntro: '',
    idCardFront: '',
    idCardBack: '',
    idCardHand: '',
    province: '',
    city: '',
    district: ''

  },
  'pages/user/withdraw/index': {
    withdrawLimitMin: 0,
    withdrawLimitMax: 0,
    bankCardNo: '',
    productAvailableAmount: 0,
    type: ''

  },
  // 订单列表 => 买家 确认收货 / 评价 / 删除订单 / 
  // 订单列表 => 卖家 发货 / 
  'pages/order/list/index': {
    needReload: false,
  },
  // 订单查询项
  'pages/order/search/index': {
    orderNo: '',
    productName: '',
    receiverName: '',
    receiverPhone: '',
    expressNumber: '',
  },

  'pages/order/search/index:currentKey': 'orderNo',

  'pages/merchant/auction/list/index': {
    // 列表 => 发布新商品 => 商品详情 => 后退到列表
    // 列表 => 编辑旧商品 => 商品详情 => 后退到列表
    // 列表 => 重新发布新商品 => 商品详情 => 后退到列表
    publishProductId: '', // 记录发布商品的id
    publishName: '', // 发布新商品 | 编辑旧商品 | 重新发布新商品
    publishSuccess: false, // 发布完成?
  },
  // 登录完成后要跳转的页面
  redirect: '',
  channel: '',
  activeInfo: '', //全局活动状态 activityId inviteUserId
  // 商家可以从首页 进入购买流程
  userCurrentPosition: 'buyer',
  tim: '',
  messageNum: 0,
  // 微信sdk debug
  debug: false,
  vconsole: false,
  // 只在app环境使用
  token: '',
  // 自定义后退 上一页地址
  navigatorPrevPagePath: '',
  // 是否登录了
  hasLogin: false,
  // 商家发布自己的商品
  sourceUrl: '',

  // 用户进入程序入口页面
  entryFromPage: {
    path: '',
    query: {},
  },
}

/**
 * 兼容 小程序 H5的 sessionstorge
 */
export const session = new SessionStorge<typeof defaultSession>(defaultSession)

/**
 * 判断当前用户买家身份, 更新身份的入口 genOrder, user/index
 * 只有在 user/index 需要以storge展示，其他页面要以 session 为准
 * @returns 
 */
export const isBuyerNow = () => {
  return session.getItem('userCurrentPosition') === 'buyer'
}

export const updateToken = (token: string | undefined) => {
  if (isAppWebview) {
    session.setItem('token', token || '')
  } else {
    storge.setItem('token', token || '')
  }
}

export const getToken = () => {
  return isAppWebview ? session.getItem('token') : storge.getItem('token')
}

/**
 * 更新channo规则
 */
export const updateChannel = (channel) => {
  session.setItem('channel', ['', undefined, null, 'undefined', 'null'].includes(channel) ? '' : channel)
}

/**
 * 前端标记用户
 * @returns 
 */
export const userUuid = (() => {
  let localval = Taro.getStorageSync('_userUuid')
  if (!localval) {
    localval = `${process.env.TARO_ENV}_${genUuid()}`
    Taro.setStorageSync('_userUuid', localval)
  }
  return localval
})()