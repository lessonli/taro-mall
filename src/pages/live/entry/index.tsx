import { WxOpenLaunchWeapp } from "@/components/WxComponents"
import { DEVICE_NAME } from "@/constants"
import { cachedShareData } from "@/utils/hooks"
import { View } from "@tarojs/components"
import { useState } from "react"
import { useEffect } from "react"
import NoAuthed from './NoAuthed'
import AuthedStatus from './AuthedStatus'
import CheckingStatus from './CheckingStatus'
import Taro from '@tarojs/taro'

import './index.scss'
import api4508 from "@/apis/21/api4508"
import STATUS from "./status";
import { checkCanLive } from "@/utils/cachedService"

/**
 * 直播入口
 */
export default () => {

  const params = Taro.getCurrentInstance().router?.params

  const status = params?.status
  
  const [liveStatus, setliveStatus] = useState(status ? Number(status) : undefined)

  useEffect(() => {
    // 获取商家直播资质
    if (!liveStatus) {
      checkCanLive().then(res => {
        setliveStatus(res)
      })
    }
  }, [])

  return <View id="live-entry-page">
    {/* <View>直播</View>
    <WxOpenLaunchWeapp path="pages/pages/classify/index">
      <AtButton type="primary">来吧 展示</AtButton>
    </WxOpenLaunchWeapp> */}
    {
      STATUS['未开通直播间'] === liveStatus &&
      <NoAuthed />
    }
    
    {
      STATUS['直播间正在审批中'] === liveStatus && <CheckingStatus status="waiting" />
    }

    {
      STATUS['直播间正在直播中'] === liveStatus && <AuthedStatus />
    }
    {/* <AuthedStatus /> */}
  </View>
}
