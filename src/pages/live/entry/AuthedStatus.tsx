import { bw_icon, yuzhan, zbgl, zbspgl, zhibogongnengjieshao } from '@/constants/images'
import {View, Image} from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { useEffect } from 'react'
import api4542, {IResapi4542} from '@/apis/21/api4542'
import api4614 from '@/apis/21/api4614'
import api4616, { IResapi4616 } from '@/apis/21/api4616'
import { fen2yuan } from '@/utils/base'
import api4604 from '@/apis/21/api4604'
import { isAppWebview, PRIMARY_COLOR } from '@/constants'
import { useAsync } from '@/utils/hooks'
import PreLoadingBOx from '@/components/PreLoading'
import NavigationBar, { SingleBackBtn } from '@/components/NavigationBar'
import { session } from '@/utils/storge'
import { addAppEventlistener, removeAppEventlistener } from '@/utils/app.sdk'

/**
 * 审核已通过 直播中心
 */
export default () => {

  const items = [
    {
      icon: yuzhan,
      text: '直播预展',
    },
    {
      icon: zbspgl,
      text: '商品管理',
    },
    {
      icon: zbgl,
      text: '直播管理'
    },
  ]

  const [detail, setDetail] = useState<IResapi4616['data']>({})


  const {run: getMyLiving, pending, value: recordDetail1} = useAsync<Required<IResapi4542['data']>>(api4542, {manual: true})

  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)

  useEffect(() => {
    session.setItem('api4542', typeof recordDetail1 === 'object' ? recordDetail1 : null)
  }, [recordDetail1])

  const getDetail = async () => {
    
    const res2 = await api4616()
    setDetail(res2)
    // 获取直播预展
    const res3 = await getMyLiving()
    if (res3?.status === 2) {
      // 异常 继续直播？
      Taro.showModal({
        title: '提示',
        content: `检测到您有正在直播中的场次，是否继续？`,
        confirmText: '继续直播',
        cancelText: '关播',
        confirmColor: PRIMARY_COLOR,
        success: async (res) => {
          if (res.confirm) {
            WebViewJavascriptBridge.callHandler(
              'openNativePage',
              JSON.stringify({
                page: '/liveRoom/pusher',
                params: {},
              })
            )
          } else {
            await api4604({recordId: res3.recordId})
            Taro.showToast({
              icon: 'none',
              title: '已关播'
            })
          }
        }
      })
    }
  }

  // useEffect(() => {
  //   console.log('useEffect-----');
    
  //   getDetail()
  // }, [])

  useEffect(() => {
    isAppWebview && addAppEventlistener('webviewShow', getDetail)

    return () => {
      isAppWebview && removeAppEventlistener('webviewShow')
    }
  }, [])

  useDidShow(() => {
    console.log('useDidShow-----');
    getDetail()
  })

  const openPage = async (name: string) => {
    if (loading2) return
    setLoading2(true)
    try {
      const recordDetail = await getMyLiving()
      if (name === '直播预展') {
        const url = recordDetail?.recordId ?
          `/pages/live/preSettingResult/index?recordId=${recordDetail?.recordId || ''}&roomId=${recordDetail?.roomId || ''}` :
          `/pages/live/setting/index`
        Taro.navigateTo({
          url,
          complete: () => {
            setLoading2(false)
          }
        })
      } else if (name === '商品管理') {
        WebViewJavascriptBridge.callHandler(
          'openNativePage',
          JSON.stringify({
            page: '/liveProducts',
            params: {
              recordId: recordDetail?.recordId || '',
              roomId: detail?.roomId,
            }
          }),
          () => {
            setLoading2(false)   
          }
        )
      } else if (name === '直播管理') {
        Taro.navigateTo({
          url: `/pages/live/apply/index?recordId=${recordDetail?.recordId || ''}&roomId=${recordDetail?.roomId || ''}`,
          complete: () => {
            setLoading2(false)
          }
        })
      }
    } catch (e) {
      setLoading2(false)
    }
  }

  return <View className="liveAuthedStatus">
    <NavigationBar
      title={'直播中心'}
      leftBtn={<SingleBackBtn />}
    />
    <View className="liveAuthedStatus-header p-t-64 p-b-48">
      <View className="liveAuthedStatus-header-datas flex ">
        <View className="liveAuthedStatus-header-datas-item">
          <View className="fz60 color333">{Math.floor((detail?.duration || 0) / 60)}</View>
          <View className="fz26 color999">今日开播时长（分钟）</View>
        </View>
        <View className="liveAuthedStatus-header-datas-item">
          <View className="fz60 color333">{fen2yuan(detail?.tradeAmount)}</View>
          <View className="fz26 color999">今日成交金额（元）</View>
        </View>
      </View>
    
      <View className="m-t-68">
        <AtButton type="primary" onClick={async () => {
          setLoading(true)
          const res = await getMyLiving()
          const url = res?.recordId ?
            `/pages/live/preSettingResult/index` :
            `/pages/live/setting/index?rightNow=1&roomid=${detail?.roomId}`
          Taro.navigateTo({
            url,
            complete: () => {
              setLoading(false)
            }
          })
        }} disabled={loading}>立即直播</AtButton>
      </View>
    </View>
  
    <View className="liveAuthedStatus-banner">
      <Image src={zhibogongnengjieshao} className="liveAuthedStatus-banner-image"/>
    </View>

    <View className="liveAuthedStatus-tools m-24">
      <View className="color333 fz32 m-b-32">直播工具</View>
      <View className="liveAuthedStatus-tools-content">
        {
          items.map((item, i) => <View key={i} className="liveAuthedStatus-tools-content-item" onClick={() => openPage(item.text)}>
            <Image src={item.icon} className="liveAuthedStatus-tools-content-item-image" />
            <View className="liveAuthedStatus-tools-content-item-text fz26 color666">{item.text}</View>
          </View>)
        }
      </View>
    </View>
  </View>
}