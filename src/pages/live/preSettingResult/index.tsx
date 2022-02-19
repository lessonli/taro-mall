import api4500 from "@/apis/21/api4500"
import api4542, { IResapi4542 } from "@/apis/21/api4542"
import { isAppWebview, PRIMARY_COLOR } from "@/constants"
import { bw_icon, lijizhibo, quxiaoyuzhan } from "@/constants/images"
import { countDownTimeStr } from "@/utils/base"
import { checkCanLive, getUserInfo, globalConfig } from "@/utils/cachedService"
import { View, Image, Text } from "@tarojs/components"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { AtButton } from "taro-ui"
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'


import './index.scss'
import { XImage } from "@/components/PreImage"
import dayjs from "dayjs"
import KnownModal, { ModelContentBeforeStartLive } from "../components/KnownModal"
import api3560 from "@/apis/21/api3560"
import { host } from "@/service/http"
import api3554 from "@/apis/21/api3554"
import { autoAddImageHost } from "@/components/PreImage/transformImageSrc"
import { session } from "@/utils/storge"
import CanvasPhoto from "@/components/CanvasPhoto"
import { initLive } from "@/components/CanvasPhoto/components/CanvasInit"
import { useMemo } from "react"

/**
 * 直播预展
 */
export default () => {

  const [detail, setDetail] = useState<IResapi4542['data']>({})

  const [canvasVisible, setCanvasVisible] = useState(false)

  const [shareImg, setshareImg] = useState<string | undefined>('')

  const [shareLink, setShareLink] = useState<string | undefined>('')

  const [shareData, setShareData] = useState<any>()

  const shareDetail = useRef()

  const [t, setT] = useState({
    hh: 0,
    mm: 0,
    ss: 0
  })

  const [liveTStatus, setLiveTStatus] = useState<'wait' | 'timeout'>('wait')

  const timer = useRef()

  const [bools, setBools] = useState({
    knownModal: false,
  })

  const runTimer = (endTime: number, timeDifference = 0,) => {
    const current = new Date().valueOf()
    const a = current - endTime - timeDifference
    console.log(a, current, endTime, timeDifference);
    setLiveTStatus(a < 0 ? 'wait' : 'timeout')

    const t2 = countDownTimeStr(
      endTime,
      timeDifference,
      current
    )

    setT(t2)

  }
  // //weapp分享到好友
  // useShareAppMessage(async () => {
  //   const res = await shareDetail.current

  //   // const data = await cacheShareData()
  //   // console.log(data, 123123);
  //   const data = {
  //     title: res?.roomName,
  //     path: res?.shareUrl.replace(host, ''),
  //     imageUrl: autoAddImageHost(res?.posterImg)
  //   }
  //   console.log('小程序分享', data)
  //   return data
  // })

  // weapp分享到朋友圈
  const openCanvas = async () => {
    const data = await api3560({ targetId: detail?.roomId, shareType: 10 })
    setshareImg(data?.qrCodeUrl)
    setShareLink(data?.shareUrl)
    setCanvasVisible(true)
  }

  // 关闭canvas
  const onCloseCanvas = () => {
    setCanvasVisible(false)
  }

  useEffect(() => {
    (async () => {
      const res = session.getItem('api4542')
      // const res = await api4542()
      setDetail(res)
      const { timeDifference } = await globalConfig()
      const startTime = res?.startTime
      runTimer(startTime, timeDifference)
      timer.current = setInterval(() => runTimer(startTime, timeDifference), 1000)
      const data = await api3554({ shareType: 10, targetId: res?.roomId })
      setShareData(Object.assign({}, { ...res }, { ...data }, { userName: WEAPP_GH_ID }))
      // shareDetail.current = new Promise((resolve, reject) => {
      //   const obj = Object.assign({}, { ...res }, { ...data })
      //   return resolve(obj)
      // })
    })()

    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const handleCancel = () => {
    Taro.showModal({
      content: '确认取消预展?',
      cancelText: '返回',
      confirmColor: PRIMARY_COLOR,
      confirmText: '确认',
      success: async (res) => {
        if (!res.confirm) return
        await api4500({
          recordId: detail?.recordId
        })
        checkCanLive.reset()
        Taro.showToast({
          icon: 'none',
          title: '取消成功'
        })
        Taro.navigateBack()
      }
    })
  }

  const handleStart = () => {

    if (!isAppWebview) return Taro.showToast({
      icon: 'none',
      title: '请到app体验完整功能'
    })

    WebViewJavascriptBridge.callHandler(
      'openNativePage',
      JSON.stringify({
        page: '/liveRoom/pusher',
        params: {},
      }),
      (data) => {
        Taro.navigateBack()
      }
    )

  }

  const TimerComponnet = useMemo(() => {
    return liveTStatus === 'wait' && <>
      <Text className="preSettingResult-countDown-t">{t.hh}</Text>
      <Text className="preSettingResult-countDown-unit">时</Text>
      <Text className="preSettingResult-countDown-t">{t.mm}</Text>
      <Text className="preSettingResult-countDown-unit">分</Text>
      <Text className="preSettingResult-countDown-t">{t.ss}</Text>
      <Text className="preSettingResult-countDown-unit">秒</Text>
    </>
  }, [liveTStatus, t])

  const style = useMemo(() => {
    return {
      backgroundImage: `url(${autoAddImageHost(detail?.coverImg)})`,
      backgroundSize: `100% 100%`,
    }
  }, [detail?.coverImg])

  return <View className="preSettingResult full-screen-page" style={style}>
    {/* <Image
      src={detail?.coverImg}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        // filter: `blur(5px)`,
      }}
    /> */}
    <View className="preSettingResult-content">
      <XImage src={detail?.headImg} className="preSettingResult-avatar" />
      <View className="fz28 bgGray m-t-14 m-b-87">{detail?.roomName}</View>
      <View className="fz36 preSettingResult-title">{detail?.title}</View>
      <View className="fz26 bgGray">{
        liveTStatus === 'wait' ? '开播倒计时' : '即将开播'
      }</View>
      <View className="preSettingResult-countDown fz30 bgGray">
        {
          TimerComponnet
        }
      </View>


    </View>

    <View className="preSettingResult-footer">
      <View className="preSettingResult-footer-1">
        <View className="preSettingResult-footer-1-item preSettingResult-footer-1-cancel" onClick={handleCancel}>
          <Image src={quxiaoyuzhan} className="preSettingResult-footer-1-item-icon" />
          <View className="fz24 bgGray">取消预展</View>
        </View>

        <View className="preSettingResult-footer-1-item preSettingResult-footer-1-cancel" onClick={() => setBools({ ...bools, knownModal: true })}>
          <Image src={lijizhibo} className="preSettingResult-footer-1-item-icon" />
          <View className="fz24 bgGray">立即直播</View>
        </View>
      </View>

      <View className="preSettingResult-footer-2">
        <AtButton type="secondary" className="preSettingResult-footer-2-btn preSettingResult-footer-2-btn_edit" onClick={() => {
          Taro.redirectTo({ url: `/pages/live/setting/index?editPreLive=1&recordId=${detail?.recordId}&roomId=${detail?.roomId}` })
        }}>修改设置</AtButton>
        <AtButton type="primary" className="preSettingResult-footer-2-btn preSettingResult-footer-2-btn_share" onClick={openCanvas}>分享直播</AtButton>
      </View>

    </View>
    {
      detail && shareImg && <CanvasPhoto storeInfo={detail}
        shareImg={shareImg}
        shareLink={shareLink}
        type={'commodity'}
        init={initLive}
        operationType={['friend']}
        shareData={shareData}
        size={
          {
            width: 522,
            height: 860
          }
        }
        visible={canvasVisible} onClose={onCloseCanvas} />
    }
    <KnownModal
      title="开播须知"
      visible={bools.knownModal}
      onClose={() => setBools({ ...bools, knownModal: false })}
      content={<ModelContentBeforeStartLive />}
      onOk={handleStart}
    ></KnownModal>
  </View>
}