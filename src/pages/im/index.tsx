
import React from 'react';
import Taro, { getUserInfo } from '@tarojs/taro'
import { useEffect, useState } from 'react';
// import { tim } from '@/service/im';
import { useRecoilState } from 'recoil';
// import TIM from 'tim-js-sdk';
import { conversationList, hasLogin, isImReady, noReadNumber, noReadNumber_bidding, noReadNumber_notice, noReadNumber_trade, selectTabIndex } from '@/store/atoms';
import { deepClone, getRealSize, unitChatTime } from '@/utils/base';
import PreImage from '@/components/PreImage';
import Empty from '@/components/Empty';
import { cpxx, empty, gftz, jywl } from '@/constants/images';
import api2108 from '@/apis/21/api2108';
import qs from 'query-string'
import './index.scss'
import { IMID } from '@/constants';
import { tim } from '@/service/im';
import { SwipeAction, List } from 'antd-mobile';
import { useUserTypeHook, useUserTypeHookHome, useWxShare } from '@/utils/hooks';
import NavigationBar, { navigationBarInfo } from '@/components/NavigationBar';
import api4082, { req4082Config } from '@/apis/21/api4082';
import { request, withErrToast, withResponseIntercept } from '@/service/http';
import { getImID, getStatus } from '@/utils/cachedService';
import { View, Image } from '@tarojs/components';
import { session } from '@/utils/storge';
import { AtList, AtListItem, AtSwipeAction } from 'taro-ui';
import SwiperAuctionList from './compones/SwiperAuctionList';
import TabBar from '@/components/Tab-bar';
import { useDidShow } from '@tarojs/runtime';
// import TabBar from '@/custom-tab-bar';
const IM = () => {
  // const tim = TIM.create(IMID); // SDK 实例通常用 tim 表示
  const [isReady, setReady] = useRecoilState(isImReady)
  const [list, setList] = useRecoilState(conversationList)
  const [noReadNum_notice, setNoReadNum_notice] = useRecoilState(noReadNumber_notice)
  const [noReadNum_trade, setNoReadNum_trade] = useRecoilState(noReadNumber_trade)
  const [noReadNum_bidding, setNoReadNum_bidding] = useRecoilState(noReadNumber_bidding)
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [selected, setSelected] = useRecoilState(selectTabIndex)
  const { userType } = useUserTypeHookHome()
  useEffect(() => {
    // 非登陆或者用户\
    if (!isReady && userType === 'buyer') {
      api4082().then(async (imConfig) => {
        tim.login({ userID: imConfig?.identifier, userSig: imConfig?.imSign })
      })
    }

    // tim.logout().finally(res => {
    //   api4082().then(async (imConfig) => {
    //     tim.login({ userID: imConfig?.identifier, userSig: imConfig?.imSign })
    //   })
    // })
  }, [userType])

  useDidShow(() => {
    setSelected(2)
  })

  useEffect(() => {
    if (!isReady) {
      if (!session.getItem('token')) {
        api2108()
      }
    } else {
      tim.getConversationList().then(res => {
        console.log(res, 111);

      })
    }
  }, [isReady])
  useWxShare()

  const onDelete = (id) => {
    // 删除
    // e.stopPropagation()
    tim.deleteConversation(id).then(res => {
      Taro.showToast({
        title: '删除成功'
      })
    })
  }


  function swapArray(arr, index1, index2) {
    let item = arr.splice(index2, 1)
    arr.splice(index1, 0, item[0])

  }

  const onTop = (id, isPinned) => {
    tim.pinConversation({ conversationID: id, isPinned: !isPinned }).then(res => {
      setList(val => {
        let list = deepClone(val)
        let index = 0
        let num = 0
        list.forEach((item, i) => {
          if (item.conversationID === res.data.conversationID) {
            item.isPinned = !isPinned
            index = i
          }
          if (item.isPinned) {
            num++
          }
        })
        if (!isPinned) {
          swapArray(list, 0, index)
        } else {
          swapArray(list, num, index)
        }

        return list
      })
      Taro.showToast({
        title: isPinned ? '已取消置顶' : '已置顶'
      })
    })
    // tim.pinConversation({ conversationID: id, isPinned: true }).then(res => {
    //   Taro.showToast({
    //     title: '已置顶'
    //   })
    // })
  }


  const swiperOpen = () => {
    console.log(111);

  }

  const goMessage = (id) => {
    if (isReady) {
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${id}`
      })
    }
  }

  const goNotice = () => {

    Taro.navigateTo({
      url: '/pages/im/officialNotice/index'
    })
  }

  const goTrade = () => {
    Taro.navigateTo({
      url: '/pages/im/trade/index'
    })
  }

  const goBidding = () => {
    Taro.navigateTo({
      url: '/pages/im/biddingInformation/index'
    })
  }
  return (
    <div className='message-list'>
      <NavigationBar
        title={'消息列表'}
        background={'#ffffff'}
      />
      <View className='message-list-tabs'>
        <View className='message-list-tabs-item' onClick={goNotice}>
          <Image className='message-list-tabs-item-img' src={gftz}></Image>
          <View className='message-list-tabs-item-text'>官方通知</View>
          {noReadNum_notice > 0 && <View className='message-list-tabs-item-noRead'>{noReadNum_notice}</View>}
        </View>
        <View className='message-list-tabs-item' onClick={goTrade}>
          <Image className='message-list-tabs-item-img' src={jywl}></Image>
          <View className='message-list-tabs-item-text'>交易物流</View>
          {noReadNum_trade > 0 && <View className='message-list-tabs-item-noRead'>{noReadNum_trade}</View>}
        </View>
        <View className='message-list-tabs-item' onClick={goBidding}>
          <Image className='message-list-tabs-item-img' src={cpxx}></Image>
          <View className='message-list-tabs-item-text'>参拍信息</View>
          {noReadNum_bidding > 0 && <View className='message-list-tabs-item-noRead'>{noReadNum_bidding}</View>}
        </View>
      </View>
      {list && list.length > 0 ? <SwiperAuctionList onTop={onTop} onDelete={onDelete} goMessage={goMessage} list={list} /> : <div className='message-list-empty'>
        < Empty text='暂无消息' src={empty} />
      </div>
      }
      {process.env.TARO_ENV !== 'weapp' && <TabBar value={3} />}
    </div >
  )
}

export default IM
