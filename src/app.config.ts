import { session } from "./utils/storge"

const mainPkg = [
  'pages/index/index',
  'pages/login/index', // 登录
  'pages/store/index',  // 店铺首页
  'pages/store/storeInfo/index', // 店铺详情

  'pages/store/storeSetting/index', // 店铺设置
  'pages/search/index', // 搜索页
  'pages/search/searchList/index', // 搜索结果页
  'pages/goods/goodsDetail/index', // 商品详情 productId activityId?
  'pages/classify/index', // 分类
  'pages/publish/productTypes/index', // 发布起始页
  'pages/webview/index', // webview 加载

  'pages/my/index/index', // 我的入口


  'pages/im/index', // 先调用信息发送 发送传值： status: 订单状态 name: 商品名 orderNo: 订单编号  logo: 商品图 productId： 商品uuid
  'pages/im/message/index',
  'pages/im/biddingInformation/index', // 参拍信息
  'pages/im/trade/index', // 物流信息
  'pages/im/officialNotice/index', // 官方通知
  // 'pages/live/index',
  'pages/scan/result/index',

]


/**
 * 由于主包体积过大，后续 作为主副包 other开头
 */
const subPkgOther = [
  'pages/other/login-mobile/index', // 手机登录
  'pages/other/address/index', // 地址列表 选择地址 chooseAble=true 
  'pages/other/address/addAddress/index', // 新增地址
  'pages/other/goodsReport/index', // 商品举报 productId
  'pages/other/sendStamps/index', // 商品举报 productId
]

const subPkgBwSchool = [
  'pages/bwSchool/list/index', //  博物商学院
  'pages/bwSchool/detail/index', //  博物商学院详情  uuid=''
]

// 用户相关 pages/user/*
const subPkgUser = [
  'pages/user/index/wallet/index', // 我的钱包
  'pages/user/index/distribution/index', // 分销销售额 商家
  'pages/user/index/pledgeMoney/index', // 保证金  isBuyer=true 买家  false 卖家
  'pages/user/index/teamManagement/index', //团队管理
  'pages/user/index/businessDetail/index', // 商家详情
  'pages/user/index/cumulativeEarnings/index', // 累计收益
  'pages/user/index/goodsCommission/index', // 商品佣金
  'pages/user/index/investmentPromotionCommission/index', // 招商佣金
  'pages/user/index/accountBalance/index', // 账户余额
  'pages/user/index/recharge/index', // 账户充值 暂时不做
  'pages/user/invites/businessDetail/index', // 商家详情 入口在 我的邀请列表项进入
  'pages/user/index/setPayPassword/index', // 设置 支付密码
  'pages/user/index/focus/index', // 我的关注页 入口 买家关注
  'pages/user/collection/index',  // 我的收藏  isCollection=true 
  'pages/user/invites/Level/index',  // 个人邀请 升级条件页
  'pages/user/withdraw/index', // 我的 提现
  'pages/user/auctHistories/index', //参拍记录
  'pages/user/paymentForGoods/index', // 我的 货款收入 iscommision 1 货款 2 佣金
  'pages/user/paymentForGoods/bill/index', // 查看账单
  'pages/user/paymentForGoods/detail/index', // 我的 货款详情
  'pages/user/certify/index', // 我的 实名认证
  'pages/user/invites/index', // 我的邀请列表
  'pages/user/tready/index',     // 协议列表页面 
  'pages/user/customerService/list/index', // 客服问题分类列表
  'pages/user/customerService/detail/index', // 客服问题详情 type=xxx
  'pages/user/feedback/index',  // 反馈页面
  'pages/user/feedback/recordList/index', //反馈列表
  'pages/user/feedback/detail/index', //反馈详情 uuid=xxx
  'pages/user/userDebug/index',
  'pages/user/couponCenter/index'
]

// 商家版本 目录结构 pages/merchant/*
const subPkgMer = [
  'pages/merchant/publish/product/index', // 发布 拍品 or 一口价 productId=关联的商品id&productType=0
  'pages/merchant/auction/list/index', // 拍品 一口价 管理 ?productType=1
  'pages/merchant/storeFitment/index',  // 店铺装修
  'pages/merchant/storeApprove/index', // 店铺认证
  'pages/merchant/earnestMoney/index', // 店铺认证 保证金页面
  'pages/merchant/openStore/index', //开店页面
  'pages/merchant/result/index', //开店成功页面
  'pages/merchant/couponsList/index'
]

// 订单流程
const subPkgOrder = [
  'pages/order/genOrder/index', // 订单结算 ?productId=productId&productQuantity=2&activityId=xx
  'pages/order/pay/index', // 收银台
  'pages/order/detail/index', // 订单详情 orderNo=xx
  'pages/order/list/index', // 订单列表 卖家 & 买家
  'pages/order/search/index', // 订单搜索
  'pages/order/payResult/index', // 支付结果页  resultType 1 : 成功 2 : 失败 &orderNo=xxxx

  'pages/order/dispatch/index', // 买家申请售后 退货 & 商家发货 ?afterSaleId=111&orderNo=xxx&companyCode=快递公司id&companyName=xxxx
  'pages/order/express/company/index', // 快递列表 companyCode=sss
  'pages/order/express/detail/index', // 物流信息 afterSaleId=sss&orderNo=
  'pages/order/afterSale/list/index', // 售后记录列表
  'pages/order/afterSale/applyReturn/index', // 申请售后 退单
  'pages/order/afterSale/detail/index', // 退单 售后详情 orderNo=sss&orderReturnNo=xxxx
  'pages/order/afterSale/discussion/index', // 退单 协商记录
  'pages/order/evaluation/index', // 订单评价 ?orderNo=xxx&orderReturnNo=xxx&sourceUrl=xxx

]

// 活动页面
const subActivity = [
  // 活动页面
  'pages/active/leakList/index', // 极速捡漏activityId=xxx
  'pages/active/highGoodsList/index', // 高货专区activityId=xxx
  'pages/active/newUserShare/index', // 新人专享 activityId=1000009
  'pages/active/template/index', //  活动模板页, activityId=xxx&type=xxx type:模板类型 0 商品 1 店铺
  'pages/active/pullNew/index', // 拉新落地页 分享邀请 旧的拉新规则已经弃用
  'pages/active/pullNew/rules/index',  // // 拉新落地页 分享邀请 旧的拉新规则已经弃用 旧的拉新落地页  已经弃用
  'pages/active/pullNewUser/index', // 拉新落地页 分享邀请
  'pages/active/pullNewUser/rules/index',  // 
  // 'pages/active/newUserShare1/index', // 新人专享改版 activityId=1000009
  //  商家端 发红包
  'pages/active/redPacket/index',
  'pages/active/redPacket/list/index',
  'pages/active/redPacket/detail/index', // uuid=xxx  支付成功返回的uuid

  //  用户端 拆红包
  'pages/active/openRedPacket/index', //redPacketId=xxx
  // 'pages/active/openRedPacket/list/index',   // 领取红包 列表 该页面下掉
  'pages/active/openRedPacket/detail/index',
  'pages/active/openRedPacket/rules/index',
  'pages/active/spread/promote/index', // 引流 落地页
  'pages/active/spread/launch/index', // 引流 投放页 channel=xxx
  'pages/active/selectGoods/index',
  process.env.TARO_ENV === 'h5' && 'pages/active/genSchema/index',

].filter(Boolean)

const live = [
  // 直播模块
  process.env.TARO_ENV === 'weapp' && 'pages/live/room/index', // 直播间 传参roomId recordId
  process.env.TARO_ENV === 'h5' && 'pages/live/entry/index', // 申请开通直播 / 审核中 / 直播中心
  process.env.TARO_ENV === 'h5' && 'pages/live/apply/index', // 直播审核 申请开通直播表单,审核中的不允许修改
  process.env.TARO_ENV === 'h5' && 'pages/live/applySuccess/index', // 申请提交成功
  process.env.TARO_ENV === 'h5' && 'pages/live/setting/index', // 直播设置  立即开播 rightNow / 开始预展 / 修改预展 editPreLive
  // 'pages/live/preSettingForm/index', // 直播预展设置 ?rightNow='立即直播'
  process.env.TARO_ENV === 'h5' && 'pages/live/preSettingResult/index', // 直播预展 展示
  process.env.TARO_ENV === 'h5' && 'pages/live/products/index', // 直播商品管理
  // 'pages/live/productPublish/index', // 直播商品创建
  process.env.TARO_ENV === 'weapp' && 'pages/live/preView/index', // 预展
].filter(Boolean)

const subSystem = [
  'pages/system/setting/index',
  'pages/system/accountInfo/index', //账户信息  系统设置 账户信息
  'pages/system/aboutBw/index', // 关于 博物有道  系统设置页 关于入口
  'pages/system/accountSecurity/index', // 账号安全  入口 系统设置 账号安全入口
]


const docs = [
  'pages/docsComponents/index',
  'pages/docsComponents/waterfalllist/index'
]

export default {
  workers: 'workers', // 配置 workers 字段，表示 worker 代码根目录
  pages: (() => {

    if (
      process.env.TARO_ENV === 'h5'
    ) {
      return [
        ...mainPkg,
        ...subPkgOther,
        ...subPkgBwSchool,
        ...subPkgMer,
        ...subPkgOrder,
        ...subPkgUser,
        ...subActivity,
        ...live,
        ...subSystem,
        'pages/active/schema/index',
        // ...(process.env.NODE_ENV === 'production' ? [] : docs)
        ...docs,
        'pages/jsbridge/index',
      ]
    }

    return [
      ...mainPkg,
      ...(process.env.NODE_ENV === 'production' ? [] : docs)
    ]
  })(),
  subPackages: (() => {
    if (process.env.TARO_ENV === 'h5') {
      return []
    }
    return [
      {
        root: 'pages/other',
        pages: subPkgOther.map(url => url.replace('pages/other/', ''))
      },
      {
        root: 'pages/bwSchool',
        pages: subPkgBwSchool.map(url => url.replace('pages/bwSchool/', ''))
      },
      {
        root: 'pages/system',
        pages: subSystem.map(url => url.replace('pages/system/', ''))
      },
      {
        root: 'pages/order',
        pages: subPkgOrder.map(url => url.replace('pages/order/', ''))
      },
      {
        root: 'pages/merchant',
        pages: subPkgMer.map(url => url.replace('pages/merchant/', ''))
      },
      {
        root: 'pages/user',
        pages: subPkgUser.map(url => url.replace('pages/user/', ''))
      },
      {
        root: 'pages/active',
        pages: subActivity.map(url => url.replace('pages/active/', ''))
      },
      {
        root: 'pages/live',
        pages: live.map(url => url.replace('pages/live/', ''))
      },
    ]
  })(),
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: (() => {
    if (process.env.TARO_ENV === 'weapp') {
      return {
        color: 'rgba(135, 135, 135, 1)',
        selectedColor: '#333333',
        backgroundColor: 'white',
        custom: true,
        list: [
          {
            pagePath: 'pages/index/index',
            text: '首页',
          },
          {
            pagePath: 'pages/classify/index',
            text: '分类',
          },
          {
            pagePath: 'pages/im/index',
            text: '消息',
          },
          {
            pagePath: 'pages/my/index/index',
            text: '我的',
          }
        ]
      }
    }
  })(),
  "usingComponents": (() => {
    if (process.env.TARO_ENV === 'weapp') {
      return {
        "customtabbar": "custom-tab-bar/index"
      }
    }
  })(),
  "lazyCodeLoading": "requiredComponents"
}
