

import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Taro, { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import PayFeePopup from "@/components/PayFeePopup";
import paySdk from "@/components/PayFeePopup/paySdk";
import api3386 from "@/apis/21/api3386";
import api3554 from "@/apis/21/api3554";
import api2912, { IResapi2912 } from "@/apis/21/api2912"; // 系统全局配置
import { openStore2 } from "@/constants/images";
import { openStore1, kd_kefu } from "@/constants/images";
import NavigationBar, { SingleBackBtn, BackAndHomeBtn } from "@/components/NavigationBar";
import api2100, { IResapi2100 } from "@/apis/21/api2100";

import { getUserInfo, globalConfig, sleep } from "@/utils/cachedService";
import { cachedWxConfig, setWxH5Config, useWxShare } from "@/utils/hooks";
import { XImage } from "@/components/PreImage";

import { isAppWebview } from "@/constants";
import FloatBtn from "@/pages/active/components/FloatBtn";
import './index.scss'
import { host } from "@/service/http";
import CanvasPhoto from "@/components/CanvasPhoto";
import api3560 from "@/apis/21/api3560";
import { initOpenStore } from "@/components/CanvasPhoto/components/CanvasInit";
import api4424 from "@/apis/21/api4424";

interface IshareData {
  title?: string,
  desc?: string,
  link?: string,
  imgUrl?: string
}

type Iconfig = Required<IResapi2912>['data']
type IuserInfo = Required<IResapi2100>['data']


interface Istatus {
  isLogin: Boolean;
  userLevel: number | undefined
}

function OpenStore() {
  const [profile, setProfile] = useState(undefined)
  const [payVisible, setPaysible] = useState<boolean>(false)
  const [canvasVisible, setCanvasVisible] = useState<boolean>(false)
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [config, setConfig] = useState<Iconfig | undefined>(undefined)
  const [status, setStatus] = useState<Istatus>({ isLogin: false, userLevel: 0 })
  const [appShareDate, setAppShareDate] = useState<IshareData>()
  const [shareInfo, setShareInfo] = useState()
  const sharePromise = useRef(undefined)
  // 调用支付的时候 需要要先执行usewxShare 获取签名
  cachedWxConfig()
  useEffect(() => {
    (async () => {
      const config = await globalConfig()
      setConfig(config)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const res = await getUserInfo()
      setProfile(res)
      setStatus({ userLevel: res?.userLevel, isLogin: true })
      const shareType = res?.userLevel !== 3 ? 1 : 8
      const data = await api3554({ shareType })

      const isMerchant = res?.userLevel === 3

      const shareData = {
        title: isMerchant ? `${res?.nickName}@你:来博物有道开店,分享成交不扣点` : '博物有道',
        desc: data?.subTitle,
        link: data?.shareUrl,
        imgUrl: isMerchant ? 'https://bwyd-test.oss-cn-hangzhou.aliyuncs.com/bwyd-test/test/h5/68E1D2D6230E5732_w300_h300_s91301.png' : 'https://tsla.bowuyoudao.com/weapp/img/bw_icon.jpg',
      }
      const shareInfo = {
        title: shareData.title,
        path: shareData.link.replace(host, ''),
        imageUrl: shareData.imgUrl
      }
      setShareInfo(shareInfo)

      sharePromise.current = new Promise((resolve, reject) => {
        resolve(shareInfo)
      })


      setAppShareDate(shareData)
      cachedWxConfig().then(wx => {
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)
      })

    })()
  }, [])


  useShareAppMessage(async () => {
    const res = await sharePromise.current
    return res
  })

  useShareTimeline(() => {
    return shareInfo
  })

  //生成海报
  const openCanvas = async () => {
    const data = await api3560({ shareType: 8 })
    setshareImg(data?.qrCodeUrl)
    setShareLink(data?.shareUrl)
    setCanvasVisible(true)
  }


  const onCloseCanvas = () => {
    setCanvasVisible(false)
  }

  const handleSubmit = () => {
    // 个人中心取得缓存 用户身份更新
    return paySdk(api3386).then(async() => {
      await sleep(1000) // 后端 用户信息 异步 防止数据未更新
      getUserInfo.reset()
      Taro.redirectTo({
        url: '/pages/merchant/result/index'
      })

      setPaysible(false)
    }).catch(err => {
      setPaysible(false)
    })

  }
  const handleStore = async () => {
    if (!status.isLogin) {
      api2100().then(res => {
        setStatus({ userLevel: res?.userLevel, isLogin: true })
      })
    } else {
      // app 没有拦截 会 拉起支付
      setPaysible(true)
    }


  }
  const goChart = async () => {
    const res = await api4424()
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({
          page: '/im/chat',
          params: {
            identifier: res?.identifier,
          }
        })
      )
    } else {
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${res?.identifier}&type=1`
      })
    }
  }
  return (
    <View>
      <NavigationBar background='#fff' leftBtn={<BackAndHomeBtn />} title={profile?.userLevel === 3 ? '邀请开店' : '我要开店'}></NavigationBar>
      <View className='bw-open-image'> <Image className='bw-open-image-ele' src={openStore2}></Image></View>
      <View className='bw-open-store'>
        {(status?.userLevel === 3) && <AtButton className='bw-open-store-btn' onClick={openCanvas} >邀请开店 瓜分百万</AtButton>}
        {status?.userLevel !== 3 && <AtButton onClick={handleStore} className='bw-open-store-btn' >立即开店</AtButton>}
      </View>
      <PayFeePopup
        disableYUEPay
        headerType={'close'}
        // desc='开店认证有效期为365天，认证费用缴纳后，无论是否认证通过，均不予退还，资料审核不通过可修改后再次提交。'
        feeType='yearVip'
        fee={config?.openShopRechargeAmount as number}
        visible={payVisible}
        onSubmit={handleSubmit}
        onVisibleChange={() => { setPaysible(false) }}
      >

      </PayFeePopup>
      {
        shareImg && <CanvasPhoto
          userInfo={profile}
          shareImg={shareImg}
          shareLink={shareLink}
          shareData={appShareDate}
          type={'openStore'}
          visible={canvasVisible} onClose={onCloseCanvas}
          init={initOpenStore} />
      }
      <View className="bw-openStore-kefu">
        <FloatBtn src={kd_kefu} handleClick={goChart}></FloatBtn>
      </View>
    </View>
  )

}

export default OpenStore