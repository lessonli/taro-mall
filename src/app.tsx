
import '@/utils/lodash.weapp'
import React, { Component, useEffect, useMemo, useState } from 'react'
import Taro from "@tarojs/taro";
// import { Provider } from 'react-redux'
import configStore from './store'
import qs from "query-string";
import './app.scss'
import './style/common/custom-variables.scss'
import { tim } from '@/service/im';
import { getImID, getUserInfo } from "@/utils/cachedService";
import storge, { session, updateChannel } from "@/utils/storge";
import { View } from '@tarojs/components';
import '@/utils/app.sdk'
import api4076 from './apis/21/api4076';
import { createIM } from './service/im';
import api4082, { req4082Config } from './apis/21/api4082';
import { request, weappVersion } from './service/http';
import {
  RecoilRoot, useRecoilState,
} from 'recoil';
import { conversationList, noReadNumber, receivedMessage, isImReady, hasLogin, noReadNumber_notice, noReadNumber_trade, noReadNumber_bidding, noReadNumber_merchant, noReadNumber_buyer } from './store/atoms';
import Item from 'antd-mobile/lib/popover/Item';
// const store = configStore()
import appDebug from './app.debug'
import { DEVICE_NAME, PRIMARY_COLOR } from './constants';
import { cachedShareData, cachedWxConfig, useAppTitle, useUserTypeHookHome } from './utils/hooks';
import { BWYD_ICON, POSTER, poster2 } from './constants/images';
import { env } from 'config/dev';
import { deepClone, getHostProxyImg, preLoadImg } from './utils/base';
import { useDidShow } from '@tarojs/runtime';

import './sentry.repoter'
import '@/utils/uma'

// if (process.env.TARO_ENV === 'weapp') {
//   require('./alading/ald-stat')
// }

if (process.env.TARO_ENV === 'h5') {
  require('@/utils/web.history')
}

// 解析地址栏
(() => {
  appDebug()
})()

const isOV = (() => {
  const ua = navigator.userAgent.toLowerCase()
  return /vivo/.test(ua)
})()

if (process.env.TARO_ENV === 'h5' && isOV) {
  require('./style/common/hack.vivo.scss')
}

const IM = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [message, setMessage] = useRecoilState(receivedMessage)
  const [hList, setHList] = useRecoilState(conversationList)
  const [noReadNum, setNoReadNum] = useRecoilState(noReadNumber)
  const [noReadNum_notice, setNoReadNum_notice] = useRecoilState(noReadNumber_notice)
  const [noReadNum_trade, setNoReadNum_trade] = useRecoilState(noReadNumber_trade)
  const [noReadNum_bidding, setNoReadNum_bidding] = useRecoilState(noReadNumber_bidding)
  const [noReadNum_merchant, setNoReadNum_merchant] = useRecoilState(noReadNumber_merchant)
  const [noReadNum_buyer, setNoReadNum_buyer] = useRecoilState(noReadNumber_buyer)
  const [ready, setReady] = useRecoilState(isImReady)
  const [hasLogined, setHasLogined] = useRecoilState(hasLogin)
  const { userType } = useUserTypeHookHome()
  const IMchange = (data) => {

    // 存消息
    setMessage(data)

    // 设置未读
    // setNoReadNum((value) => {
    //   return value - 1
    // })

    if (data.data[0].conversationType !== 'GROUP' && data.data[0].conversationType !== '@TIM#SYSTEM') {
      if (data.data[0].from !== page.router?.params.id) {
        if (data.data[0].conversationID === 'C2C1666666661') {
          setNoReadNum_notice(value => ++value)
        }
        if (data.data[0].conversationID === 'C2C1777777771') {
          setNoReadNum_trade(value => ++value)
          setNoReadNum_buyer(value => ++value)
        }
        if (data.data[0].conversationID === 'C2C1888888881') {
          setNoReadNum_trade(value => ++value)
          setNoReadNum_merchant(value => ++value)
        }
        if (data.data[0].conversationID === 'C2C1999999991') {
          setNoReadNum_bidding(value => ++value)
        }
        // setNoReadNum(value => ++value)
      }
    }
    if (data.data[0].from === page.router?.params.id) {
      tim.setMessageRead({ conversationID: `C2C${page.router?.params.id}` })
    }

    // 设置会话列表
    setHList((value) => {
      let list = JSON.parse(JSON.stringify(value))
      list.forEach(item => {
        if (item.conversationID === data.data[0].conversationID && item.type !== '@TIM#SYSTEM') {
          // item.lastMessage.payload.text = data.data[0].payload.text
          if (data.data[0].type === 'TIMTextElem') {
            item.lastMessage.messageForShow = data.data[0].payload.text
          } else if (data.data[0].type === "TIMImageElem") {
            item.lastMessage.messageForShow = '[图片]'
          } else if (data.data[0].type === "TIMCustomElem") {
            item.lastMessage.messageForShow = '[自定义消息]'
          }
          item.userProfile.nick = data.data[0].nick
          item.userProfile.avatar = data.data[0].avatar
          // item.unreadCount++
          // for (let key in item.lastMessage) {
          //   item.lastMessage[key] = data.data[0][key]
          // }
        }
      })
      const newList = list.filter(item => (item.conversationID !== 'C2C1666666661' && item.conversationID !== 'C2C1777777771' && item.conversationID !== 'C2C1888888881' && item.conversationID !== 'C2C1999999991'))
      return newList
    })

  };


  const geImtReady = () => {

    let promise = tim.getConversationList();
    promise.then(function (imResponse) {
      const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
      // setConversationList(conversationList)
      setHList((value) => {
        const newList = conversationList.filter(item => (item.conversationID !== 'C2C1666666661' && item.conversationID !== 'C2C1777777771' && item.conversationID !== 'C2C1888888881' && item.conversationID !== 'C2C1999999991'))
        return newList
      })
      var sum = conversationList.reduce(function (prev, cur) {
        return cur.unreadCount + prev;
      }, 0);
      let tradeNum = 0
      conversationList.forEach(item => {
        if (item.conversationID === 'C2C1666666661') {
          setNoReadNum_notice(value => value += item.unreadCount)
        } else if (item.conversationID === 'C2C1777777771') {
          tradeNum += item.unreadCount
          setNoReadNum_buyer(value => value += item.unreadCount)
        } else if (item.conversationID === 'C2C1888888881') {
          tradeNum += item.unreadCount
          setNoReadNum_merchant(value => value += item.unreadCount)
        } else if (item.conversationID === 'C2C1999999991') {
          setNoReadNum_bidding(value => value += item.unreadCount)
        }
      });
      setNoReadNum_trade(value => value += tradeNum)
      setNoReadNum(value => sum)
      setReady(value => true)
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
    setReady(value => true)
  }


  const imloginOut = () => {

    setReady(value => false)
  }


  const conversationChange = (imResponse) => {
    let list = imResponse.data.filter(item => {
      return (item.type !== 'GROUP' && item.type !== '@TIM#SYSTEM')
    })
    if (imResponse.name = "onConversationListUpdated") {
      const conversationList = imResponse.data.filter(item => {
        return (item.type !== 'GROUP' && item.type !== '@TIM#SYSTEM' && item.conversationID !== 'C2C1666666661' && item.conversationID !== 'C2C1777777771' && item.conversationID !== 'C2C1888888881' && item.conversationID !== 'C2C1999999991')
      }); // 会话列表，用该列表覆盖原有的会话列表
      // setConversationList(conversationList)
      // let num
      setHList(deepClone(conversationList))
      // num && setNoReadNum(value => num)
      // var sum = conversationList.reduce(function (prev, cur) {
      //   return cur.unreadCount + prev;
      // }, 0);
      // setNoReadNum(sum)
      const num = list.reduce(function (prev, cur) {
        // if (cur.type !== '@TIM#SYSTEM' && cur.type !== 'GROUP') {
        return cur.unreadCount + prev;
        // }
      }, 0);

      setNoReadNum(num)
    }

  }

  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      if (!global.Window) {
        Object.defineProperty(global, 'Window', {
          value: window.constructor,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    // if (DEVICE_NAME === 'wxh5' || DEVICE_NAME === 'webh5') {
    // @ts-ignore
    if (userType) {
      getImID().then(async (imConfig) => {
        createIM(imConfig?.identifier, imConfig?.imSign, IMchange, geImtReady, conversationChange, imloginOut, userType)
      })
    }
    // }

  }, [userType])

  useEffect(() => {
    if (hasLogined && process.env.TARO_ENV === 'weapp') {
      getUserInfo().then(res => {
        let userType = 'buyer'
        if (res.userLevel === 3) {
          userType = 'merchant'
        }
        getImID().then(async (imConfig) => {
          createIM(imConfig?.identifier, imConfig?.imSign, IMchange, geImtReady, conversationChange, imloginOut, userType)
        })
      })
      // @ts-ignore

    }
  }, [hasLogined, userType])

  return (<></>)
}

class _App extends Component {

  taroGlobalData = {
    routeParams: {
      'pages/other/address/index': {
        addressNo: '',
      },
    }
  }

  async componentDidMount() {
    // 小程序 初始化全局参数
    if (process.env.TARO_ENV === 'weapp') {
      const { query, path } = Taro.getLaunchOptionsSync()
      session.setItem('entryFromPage', {
        path,
        query
      })
      console.log('app componentDidMount', query)
      if (query.isShare !== undefined) {
        updateChannel(query.channel)
      }
    }
    preLoadImg(getHostProxyImg(POSTER))
    preLoadImg(getHostProxyImg(poster2))
    // 初始化 获取用户信息 不做拦截
    getUserInfo.reset().then(res => {
      preLoadImg(getHostProxyImg(res.headImg || '', {}))
      if (res.userLevel === 3) {
        storge.setItem('hasMerchant', 'merchant')
      }
    })
    if (process.env.TARO_ENV === 'h5') {
      const res = await cachedShareData()
      const shareData = {
        title: useAppTitle(),
        desc: res?.subTitle,
        link: res?.shareUrl,
        imgUrl: BWYD_ICON,
      }
      const wx = await cachedWxConfig()
      wx?.updateAppMessageShareData(shareData)
      wx?.onMenuShareTimeline(shareData)
    }
  }

  componentDidShow(e) {

    console.log('小程序 app componentDidShow');

    session.setItem('scene', e.scene)

    // 检测小程序版本更新
    if (process.env.TARO_ENV !== 'weapp') return

    // 更新 channel
    const app = Taro.getCurrentInstance()
    const params = app.router?.params
    console.log('app params =>', params);
    // 从分享链路 isShare进来的
    if (params?.isShare !== undefined) {
      updateChannel(params.channel)
    }

    if (!Taro.canIUse('getUpdateManager')) return
    const updateManager = Taro.getUpdateManager()

    updateManager.onUpdateReady(() => {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        confirmText: '更新',
        confirmColor: PRIMARY_COLOR,
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(() => {
      Taro.showModal({
        title: '发现新版本',
        content: '请删除当前小程序，重新搜索打开...'
      })
    })
  }


  componentDidHide() { }

  componentDidCatchError(err) {
    console.error('componentDidCatchError', err)

  }


  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {

    return (
      <RecoilRoot>
        <IM />
        <View>
          {this.props.children}
        </View>
      </RecoilRoot>
    )
  }
}

export default _App
