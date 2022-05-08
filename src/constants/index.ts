import * as images from './images'
import Taro from "@tarojs/taro";

export const ADD = 'ADD'
export const MINUS = 'MINUS'

export const PRIMARY_COLOR = '#AA1612'

export const PLEASE_USE_APP_MSG = '请到app端体验完整功能'

export const UMA_APP_KEY = API_ENV === 'prod' ? '61bf405de0f9bb492b9f1134' : '61bc00f5e014255fcbbaa1f7'

// 判断运行时终端
export const DEVICE_NAME = (() => {
  if (process.env.TARO_ENV === 'h5') {
    const ua = navigator.userAgent.toLowerCase()
    // 微信浏览器 or 其他游览器
    return /micromessenger/.test(ua) ? 'wxh5' : (
      /iosbw/.test(ua) ? 'iosbwh5' : (
        /androidbw/.test(ua) ? 'androidbwh5' : 'webh5'
      )
    )
  }
  return process.env.TARO_ENV
})()

/**
 * bw app 的webview环境
 */
export const isAppWebview = DEVICE_NAME === 'androidbwh5' || DEVICE_NAME === 'iosbwh5'

export const DEVICE_SYSTEM = (() => {
  var u = navigator.userAgent;
  let system = 'ios'
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isAndroid) {
    system = 'android';
  }
  if (isIOS) {
    system = 'ios';
  }
  return system
})()

// 获取设备信息
export const systemInfo = Taro.getSystemInfoSync()

/**
 * 获取枚举对应值的实体
 * @param obj 
 * @param value 
 * @returns 
 */
export const findObjectValue = <T>(obj, value: T): { label: string, value: T } | undefined => Object.keys(obj).map(key => obj[key]).find(e => e.value === value)


export const GOOD_PUBLISH_STATUS = new Map([
  [0, {
    label: '竞拍中', value: 0,
    // sallerDateText: '截拍时间', sallerDateKey: ''
  }],
  [1, {
    label: '已截拍', value: 1,
  }],
  [2, {
    label: '已流拍', value: 2,
  }],
  [3, {
    label: '已失败', value: 3,
  }],
  // [4, {
  //   label: '草稿箱', value: 4,
  // }],
])

export const SHOP_AUTH_TAGS = new Map([
  [1, {
    label: '店铺认证', value: 1,
    // sallerDateText: '截拍时间', sallerDateKey: ''
  }]
])


export const MALL_SERVICES = new Map([
  [1, {
    label: '7天包退',
    desc: '买家可在七日内无理由退货',
    value: 1,
  }],
  [2, {
    label: '权威鉴定',
    desc: '有国检地检证书',
    value: 2,
  }],
  [3, {
    label: '假一赔三',
    desc: '承诺鉴定保真假一赔三',
    value: 3,
  }],
])

export const EXPRESS_DELIVERY = new Map([
  [
    0, {
      label: '全国包邮', value: 0,
    }
  ],
  [
    600, {
      label: '全国6元', value: 600,
    }
  ],
  [
    1200, {
      label: '全国12元', value: 1200,
    }
  ],
])

export const PRODUCT_TYPE = Object.freeze({
  YKJ: {
    label: '一口价', value: 0,
  },
  PM: {
    label: '拍卖', value: 1,
  },
  // TJ: {
  //   label: '店铺推荐', value: 3,
  // }
})

export const PAY_TYPE = Object.freeze({
  WX: {
    label: '微信支付', value: 1, icon: images.WX_PAY_ICON,
  },
  ALI: {
    label: '支付宝支付', value: 2, icon: images.ALI_PAY_ICON,
  },
  YE: {
    label: '余额支付', value: 3, icon: images.YE_PAY_ICON,
  },
})

export const PAY_TYPE_2 = Object.freeze({
  WX: {
    label: '微信支付', value: 1, icon: images.WX_PAY_ICON,
  },
  ALI: {
    label: '支付宝支付', value: 3, icon: images.ALI_PAY_ICON,
  },
  YE: {
    label: '余额支付', value: 2, icon: images.YE_PAY_ICON,
  },
})

/**
 * 组合支付
 */
export const COMBINE_PAY_TYPE = Object.freeze({
  WX: {
    label: '微信支付', value: 21, icon: images.WX_PAY_ICON,
  },
})

// 0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
export const ORDER_STATUS = Object.freeze({
  waitPay: { label: '待付款', value: 0, },
  waitDispatch: { label: '待发货', value: 1, },
  hasDispatch: { label: '已发货', value: 2, },
  hasReceive: { label: '已收货', value: 3, },
  hasNote: { label: '交易成功', value: 4, }, // 已评价
  closed: { label: '已关闭', value: 5, },
  invalid: { label: '无效订单', value: 6, },
})

export const RETURN_STATUS = Object.freeze({
  none: { label: '无售后', value: 0 },
  ing: {
    label: '售后中', value: 1,
    children: {
      wait: { label: '待处理', value: 0, desc: '等待卖家处理' },
      ing: { label: '处理中', value: 1, desc: '待用户发货' },
      onTheWay: { label: '商家收货中', value: 2, desc: '商家收货中' },
      end: { label: '已完成', value: 3, desc: '已完成' },
      refuse: { label: '已拒绝', value: 4 },
      revoke: { label: '已撤销', value: 5 },
    }
  },
  end: { label: '售后结束', value: 2 },
})
export const SERVICES_TYPE = Object.freeze({
  LQ: {
    label: '领券', value: 1,
  },
  BY: {
    label: '包邮', value: 2,
  },
  BT: {
    label: '包退', value: 3,
  }
})


export const REGS = Object.freeze({
  price: {
    pattern: /^[0-9]+(.[0-9]{1,2})?$/,
    message: '金额最多精确到2位小数',
  },
  integer: {
    pattern: /^\d+$/,
    message: '必须是整数',
  },
  phone: {
    pattern: /^[1][0-9]{10}$/,
    message: '手机号格式有误',
  },
})

// 买家 拍卖商品的状态
export const BUYER_AUCTION_STATUS = Object.freeze({
  out: {
    label: '出局', value: 0,
  },
  first: {
    label: '领先', value: 1,
  },
  waitPay: { // 中拍
    label: '待支付', value: 2,
  },
  hasPay: { // 中拍
    label: '已支付', value: 3,
  },
})

// 卖家 拍卖商品的状态
export const MERCHANT_AUCTION_STATUS = Object.freeze({
  ing: {
    label: '竞拍中', value: 0,
  },
  hasEnd: { // 有中拍的
    label: '已截拍', value: 1,
  },
  closed: {
    label: '已流拍', value: 2,
  },
  failed: {
    label: '竞拍失败', value: 3,
  }
})

// 商家一口价商品状态
export const MERCHANT_YKJ_STATUS = Object.freeze({
  onSale: {
    label: '上架中', value: 1,
  },
  off: {
    label: '已下架', value: 0,
  }
})

export const BUYER_AUCT_STATUS = Object.freeze({
  got: {
    label: '已中拍', value: 2,
  },
  pking: {
    label: '竞拍中', value: 1,
  },
  all: {
    label: '全部', value: 0
  },
})

export const PLEDGE_MONEY_STATUS = Object.freeze({
  // 全部 冻结中 已退回 已扣除
  all: {
    label: '全部', value: [],
  },
  freezing: {
    label: '冻结中', value: [1],
  },
  returned: {
    label: '已退回', value: [2, 3]
  },
  deducted: {
    label: '已扣除', value: [4, 5]
  },
})

// 博物 商学院

export const BW_SCHOOL_STATUS = Object.freeze({
  // 新手开店 平台公告 平台活动 运营技巧
  shop: {
    label: '新手开店', value: 0,
  },
  announcement: {
    label: '平台公告', value: 1
  },
  activity: {
    label: '平台活动', value: 2
  },
  skills: {
    label: '运营技巧', value: 3
  }
})


export const BUSINESS_DETAIL_STATUS = {
  // 专属粉丝 邀请商家
  fans: {
    label: '专属粉丝', value: 2,
  },
  inviteBusiness: {
    label: '邀请商家', value: 3
  },
}

// 商品佣金
export const GOODS_COMMISSION_STATUS = {
  // 全部 待收货 已完成
  all: {
    label: '全部', value: '',
  },
  willGains: {
    label: '待收货', value: 1
  },
  finish: {
    label: '已完成', value: 2
  }
}


export const RETURN_APPLY_TYPE = Object.freeze({
  onlyMoney: {
    label: '仅退款', value: 0,
  },
  moneyAndProduct: {
    label: '退货退款', value: 1,
  },
})

export const RETURN_REASONS = Object.freeze({
  '7天无理由': {
    label: '7天无理由', value: '7天无理由'
  },
  '订单信息错误': {
    label: '订单信息错误', value: '订单信息错误'
  },
  '不想买了': {
    label: '不想买了', value: '不想买了'
  },
  '重复购买': {
    label: '重复购买', value: '重复购买'
  },
  '商品无货': {
    label: '商品无货', value: '商品无货'
  },
  '质量问题': {
    label: '质量问题', value: '质量问题'
  },
  '其他原因': {
    label: '其他原因', value: '其他原因'
  },
})

export const REPORT_REASONS = Object.freeze({
  '售假': {
    label: '售假', value: '售假'
  },
  '类目错放': {
    label: '类目错放', value: '类目错放'
  },
  '涉嫌侵权': {
    label: '涉嫌侵权', value: '涉嫌侵权'
  },
  '描述不符': {
    label: '描述不符', value: '描述不符'
  },
  '出售违禁品': {
    label: '出售违禁品', value: '出售违禁品'
  },
})

//  账户余额

export const ACCOUNT_BALANCE_STATUS = {
  // 全部 消费 充值
  all: {
    label: '全部', value: '',
  },
  const: {
    label: '消费', value: 2
  },
  add: {
    label: '充值', value: 1
  }
}
//  查看账单

export const BILL_STATUS = {
  out: {
    label: '收入', value: 1,
  },
  income: {
    label: '提现', value: 2
  },
  returned: {
    label: '退款', value: 3
  }
}
// 我的邀请

export const INVITE_STATUS = {
  business: {
    label: '商家', value: 3
  },
  exclusiveFans: {
    label: '专属粉丝', value: 2
  },
  fans: {
    label: '普通粉丝', value: 1
  }
}
//  商户等级
export const MERCHANT_LEVEL = new Map([
  [1, {
    label: '黄金商家', value: 1,
  }],
  [2, {
    label: '钻石商家', value: 2,
  }],
  [3, {
    label: '服务商', value: 3,
  }],
])


// TODO: 活动页的配置 具体 通过 url 还是接口 还是 前端自己配置 待定
//  label 活动名称, img 头图 bgColor, posters: 海报 
export const ACTIVE_BG_COLOR_STATUS = new Map([
  [1, {
    label: '极速捡漏', value: 1, img: '', bgColor: '', posters: '', icon: '', qrCode: ''
  }],
  [2, {
    label: '高货专区', value: 2, img: '', bgColor: '', posters: '', icon: '', qrCode: ''
  }],
  [3, {
    label: '新人分享', value: 3, img: '', bgColor: '', posters: '', icon: '', qrCode: ''
  }],
])

export const IMID = {
  SDKAppID: 1400568433 // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
}


export const FEEDBACK_RECORD_SRATUS = {
  willReply: {
    label: '待回复', value: 0,
  },
  handled: {
    label: '已处理', value: 1
  }
}
export const FEEDBACK_TYPE = {
  0: '软件问题',
  1: '退货退款',
  2: '投诉建议'
}

// 优惠券使用类型

export const COUPON_TYPE = {
  0: '全场通用',
  1: '指定商品',
  2: '指定店铺',
  3: '指定活动',
  4: '指定分类',
}

/**
 * 小程序的类型，默认正式版，1.8.1及以上版本开发者工具包支持分享开发版和体验版小程序
 * https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Share_and_Favorites/iOS.html
 */
export const MINI_PROGRAM_TYPE = {
  /**
   * 正式版
   */
  WXMiniProgramTypeRelease: 0,
  /**
   * 测试版
   */
  WXMiniProgramTypeTest: 1,
  /**
   * 体验版
   */
  WXMiniProgramTypePreview: 2,
}

// 活动卡券领取状态
/**
  * 0 未领取
  * 1 已领取
  * 2 已领完
  */
export const ACTIVITY_COUPONS_STATUS = Object.freeze({
  'notReceive': { name: '未领取', value: 0 },
  'received': { name: '已领取', value: 1 },
  'noCoupons': { name: '已领完', value: 2 }
})



// 红包领取记录状态
/**
  * 1-待使用
  * 2-已全部核销已提现
  * 3-过期退回
  * 4-部分核销
  * 5-过期失效（不退回）
  * 6-提现中
  */
export const RED_PACKET_STATUS = Object.freeze({
  'pending': { name: '待使用', value: 1 },
  'usedALL': { name: '已全部核销已提现', value: 2 },
  'overTimeBack': { name: '过期退回', value: 3 },
  '1': { name: '部分核销', value: 4 },
  '2': { name: '过期失效（不退回）', value: 5 },
  '3': { name: '提现中', value: 6 },
})
//优惠券使用有效期

export const SENDSTAMPS_USETIME_LIST = Object.freeze(
  {
    0: {
      label: '与领取时间一致', value: 0,
      // sallerDateText: '截拍时间', sallerDateKey: ''
    },
    1440: {
      label: '领取后1天内有效', value: 24 * 60,
    },
    4320: {
      label: '领取后3天内有效', value: 24 * 60 * 3,
    },
    10080: {
      label: '领取后7天内有效', value: 24 * 60 * 7,
    },
    21600: {
      label: '领取后15天内有效', value: 24 * 60 * 15,
    },
    43200: {
      label: '领取后30天内有效', value: 24 * 60 * 30,
    },
    129600: {
      label: '领取后3个月内有效', value: 24 * 60 * 90,
    }
  }
)

// 优惠券领取状态
export const TAKESTATUS_TYPE = {
  0: '立即领取',
  1: '已领取',
  2: '已领完',
}


export const GRANT_FROM = Object.freeze(
  {
    '': {
      label: '', value: '',
      // sallerDateText: '截拍时间', sallerDateKey: ''
    },
    1: {
      label: '平台优惠券', value: 1,
    },
    2: {
      label: '店铺优惠券', value: 2,
    }
  }
)

// 测试123