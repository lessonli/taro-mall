import { Component } from 'react'
import { View, Button, Text, Image } from '@tarojs/components'
import Taro from "@tarojs/taro";
import TabBar from "@/components/Tab-bar";

import { yikoujia_icon, fapaimai_icon, new_icon, kaizhibo_icon } from '@/constants/images'

import './index.scss'
import NavigationBar, { SingleBackBtn, BackAndHomeBtn } from '@/components/NavigationBar';
import { PLEASE_USE_APP_MSG, PRODUCT_TYPE } from '@/constants';
import { useWxShare } from '@/utils/hooks';
import { useState } from 'react';
import { useEffect } from 'react';
import api4508 from '@/apis/21/api4508';
import { useMemo } from 'react';
import STATUS from "@/pages/live/entry/status";
import { checkCanLive } from '@/utils/cachedService';


const Huodongs = [
  {
    icon: yikoujia_icon,
    name: '限时秒杀',
    disabled: true,
  },
  {
    icon: yikoujia_icon,
    name: '阶梯拼团',
    disabled: true,
  },
]

export default function () {

  const [ableLive, setAbleLive] = useState(false)

  const topage = ({ value: url, disabled, message }) => {
    if (!url) return
    if (message) {
      return Taro.showToast({
        title: message,
        icon: 'none',
      })
    }
    Taro.navigateTo({
      url,
    })
  }

  useWxShare()

  useEffect(() => {
    (async () => {
      // TODO:  
      // const res = await checkCanLive()
      // // setAbleLive(res)
      // setAbleLive(res !== STATUS['直播间已禁播'])
    })()
  }, [])

  const Goods = useMemo(() => [
    {
      icon: yikoujia_icon,
      name: '一口价',
      value: `/pages/merchant/publish/product/index?productType=${PRODUCT_TYPE.YKJ.value}`
    },
    {
      icon: fapaimai_icon,
      name: '发拍卖',
      isNew: true,
      value: `/pages/merchant/publish/product/index?productType=${PRODUCT_TYPE.PM.value}`
    },
    {
      icon: kaizhibo_icon,
      name: '开直播',
      isNew: true,
      value: `/pages/live/entry/index`,
      disabled: !ableLive,
      message: PLEASE_USE_APP_MSG
    },
  ], [ableLive])

  return <View className='publishProductTypes'>
    <TabBar value={2} />
    <NavigationBar
      background='#ffffff'
      title='发布'
    />
    <View className='publishProductTypes-card publishProductTypes-1'>
      <View className='publishProductTypes-card--header'>发布商品</View>
      <View className='publishProductTypes-card--items'>
        {
          Goods.map(item => {
            return <View key={item.name} className={
              `publishProductTypes-card--item ${item.disabled ? 'publishProductTypes-card--item__disabled' : ''}`
            }
            >
              <View onClick={() => topage(item)}>
                {
                  item.isNew && <Image src={new_icon} className='publishProductTypes-card--item__new' />
                }
                <Image src={item.icon} className='publishProductTypes-card--item-icon' />
                <View>{item.name}</View>
              </View>
            </View>
          })
        }
      </View>
    </View>

    <View className='publishProductTypes-card publishProductTypes-2'>
      <View className='publishProductTypes-card--header'>运营活动</View>
      <View className='publishProductTypes-card--items'>
        {
          Huodongs.map(item => {
            return <View key={item.name} className={
              `publishProductTypes-card--item ${item.disabled ? 'publishProductTypes-card--item__disabled' : ''}`
            }
            >
              <View>
                <Image src={item.icon} className='publishProductTypes-card--item-icon' />
                <View>{item.name}</View>
              </View>
            </View>
          })
        }
      </View>
    </View>
  </View>
}

