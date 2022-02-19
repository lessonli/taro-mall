
import Taro, { useShareTimeline, useShareAppMessage } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { leak } from "@/constants/images";

import { AtButton } from "taro-ui";
import { empty, weixin, pick_canvas } from '@/constants/images';
import { useCallback, useState, useEffect, useRef } from "react";
import { cachedWxConfig, useWeappUrlChannelHook } from '@/utils/hooks'
import { countDownTimeStr } from "@/utils/base";
import api3392, { IResapi3392 } from "@/apis/21/api3392"; //查询列表
import Popup from "@/components/Popup";
import api3560 from "@/apis/21/api3560";
import { globalConfig } from "@/utils/cachedService";
import PayFeePopup from "@/components/PayFeePopup";
import paySdk from "@/components/PayFeePopup/paySdk";
import Empty from "@/components/Empty";
import { isAppWebview } from "@/constants";
import ActiveCanvasPhoto from "@/components/CanvasPhoto";
import { useDebounceFn } from "ahooks";
import FloatBtn from "../components/FloatBtn";
import { host } from "@/service/http";

import dayjs from "dayjs";
import ListItem from "./components/ListItem";
import Bidding from "@/pages/goods/components/Bidding";
import api2380 from "@/apis/21/api2380";
import api3554 from "@/apis/21/api3554";
import api3122 from "@/apis/21/api3122";
import api2906 from "@/apis/21/api2906";
import api2978 from "@/apis/21/api2978";
import api4268, { IResapi4268 } from "@/apis/21/api4268";

import './index.scss'
import { initNewUser } from "@/components/CanvasPhoto/components/CanvasInit";

type IItem = Required<Required<IResapi3392>['data']>['data'][0]
type IshareInfo = Required<IResapi4268>['data']
export type IData = Required<IResapi3392>['data']['data']
function LeakList() {
  const params = Taro.getCurrentInstance().router?.params
  const [data, setData] = useState<IData>()
  const [list, setList] = useState([])  // data 副本 用来处理数据
  const [currentItem, setCurrentItem] = useState<IItem>({});
  const [fee, setFee] = useState<number>()
  // const [idx, setIdx] = useState()
  const [shareImg, setshareImg] = useState()
  const [shareLink, setShareLink] = useState()
  const [canvasVisible, setCanvasVisible] = useState<boolean>()
  const [shareInfo, setShareInfo] = useState()
  const [webAppshareData, setShareData] = useState()
  const [mpToTop, setMpToTop] = useState<string>('')
  const timerRef = useRef()
  const shareInfoPromise = useRef(undefined)
  let timeDifference;

  const [visibles, setVisibles] = useState({
    binding: false,
    pay: false
  });
  // 离开页面 再返回 

  useEffect(() => {
    (async () => {

      const res = await api3392()
      setData(res?.data)
      // targetId 捡漏页面 活动id 写死100002
      
      const fn =async()=>{
        const shareInfoRes = await api4268({ uuid: '100002' })
        const shareDataRes = await api3554({ shareType: 7, targetId: '100002' })
        return {
          shareInfoRes,
          shareDataRes,
          title:shareInfoRes?.shareTitle,
          imgUrl: shareInfoRes?.icon,
          path: shareDataRes?.shareUrl
         
          
        }
      }
      shareInfoPromise.current = fn()
      const { shareInfoRes, shareDataRes} = await shareInfoPromise.current
      setShareInfo(Object.assign({}, { ...shareInfoRes }, { ...shareDataRes }))
     

      const shareData = {
        title: shareInfoRes?.shareTitle,
        desc: shareInfoRes?.shareSubTitle,
        link: shareDataRes?.shareUrl,
        imgUrl: shareInfoRes?.icon,
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      }
      setShareData(shareData)
      cachedWxConfig().then(wx => {
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)
      })
    })()

  }, [])

  useShareAppMessage(async () => {
    const res = await shareInfoPromise.current
    console.log(res, 'res');
    return {
      title: res?.title,
      path: res?.path?.replace(host, ''),
      imageUrl: res?.imgUrl,
    }
  })

  useShareTimeline(() => {
    const shareData = {
      title: shareInfo?.shareTitle,
      imageUrl: shareInfo?.icon,
      path: shareInfo?.shareUrl?.replace(host, ''),
    }
    return shareData
  })

  useEffect(() => {
    const upDate = () => {
      let aList = data?.map((item, index) => {
        const a = countDownTimeStr(new Date(item?.auction?.endTime || '').getTime(), timeDifference)
        let desc = ''
        if (a === null) {
          desc = (`截拍时间${dayjs(item.auction?.endTime).format('MM月DD HH:mm:ss')}`)
          item.auction.status = 1
        } else {
          // setDesc(`距离截拍${a.mm}分${a.ss}秒${Math.floor(Math.random() * (50 - 1 + 1) + 1)}`)
          desc = (`距离截拍${a.hh}时${a.mm}分${a.ss}秒`)
        }
        return {
          ...item,
          desc
        }
      })
      setList(aList)
    }

    clearInterval(timerRef.current)
    timerRef.current = setInterval(upDate, 1000);
    upDate()

  }, [data, timeDifference])

  useEffect(() => {

    globalConfig()
      .then(res => {
        timeDifference = res.timeDifference
      })
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])
  useWeappUrlChannelHook()
  const topay = useCallback(async (price: number) => {
    // 保存用户竞拍记录
    await api2380({
      auctionPrice: price,
      productId: currentItem.uuid,
    })
    setVisibles({
      ...visibles,
      binding: false
    })
    Taro.showToast({ title: '已出价', icon: 'none' })
    const res = await api2906({ uuid: currentItem.uuid })
    const item = {
      status: res?.status,
      lastAucPrice: res?.lastAucPrice,
      auctionNum: res?.auctionNum,
      endTime: res?.endTime,
      ahead: true,
    }
    const idx = data.findIndex((item, index) => {
      return item.uuid === currentItem.uuid
    })
    const newAuction = { ...data[idx].auction, ...item }
    data[idx].auction = newAuction
    setData([...data])


  }, [currentItem, data, visibles])
  const openPay = useCallback((item, index) => {
    setCurrentItem(item)
    api3122({ productId: item.uuid }).then(res => {
      if (res?.needMargin) {
        setFee(item.auction?.margin)
        setVisibles({
          ...visibles,
          pay: true
        })
      } else {
        setVisibles({
          ...visibles,
          binding: true
        })
      }
    }).catch(err => {
      Taro.showToast({ icon: 'none', title: err.message })
    })
  }, [currentItem, visibles])

  const seeMore = () => {
    if (mpToTop) {
      setMpToTop('')
      Taro.nextTick(() => {
        setMpToTop('topImage')
      })
    } else {
      setMpToTop('topImage')
    }
    api3392().then(res => setData(res.data))
  }

  const submit = (type) => {
    // 支付成功之后刷新当前 商品 的保证金信息
    const service = () => api2978({
      productId: currentItem?.uuid,
      payType: type
    })
    return paySdk(service).then(res => {
      setVisibles({
        ...visibles,
        pay: false
      })
    }).catch(() => {

    })
  }

  const { run: toGoodsDetail } = useDebounceFn((productId) => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        "openNativePage",
        JSON.stringify({ page: '/product/detail', params: { productId: productId,activityId:params?.activityId|| ' ' } })
      )
    }
    if (!isAppWebview) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${productId}&activityId=${params?.activityId || ' '}`
      })
    }
  }, { wait: 200 })

  const openCanvas = async () => {
    // await api2100()
    const data = await api3560({ shareType: 7, targetId: '100002' })
    setshareImg(data?.qrCodeUrl)
    setShareLink(data?.shareUrl)
    setCanvasVisible(true)
  }

  return <>
    <ScrollView scrollY className='bw-leak-scrollView' scrollIntoView={mpToTop} scrollWithAnimation>
      <View className='bw-leak' >
        <Image id='topImage' className='bw-leak-img' src={leak}></Image>
        <View className='bw-leak-list'  >
          {list?.map((item, index) => {
            return (
              <ListItem toGoodsDetail={toGoodsDetail} data={item} key={index} openPay={() => openPay(item, index)} />
            )
          })}
        </View>
        {
          data?.length === 0 && <Empty text='' src={empty}></Empty>
        }
        {
          data?.length > 0 && <AtButton className='bw-leak-more' onClick={() => { seeMore() }} >换一批</AtButton>
        }
        <Popup
          visible={visibles.binding}
          onVisibleChange={(binding) => setVisibles({ ...visibles, binding })}
          title="当前价"
          headerType="close"
        >
          {
            visibles.binding && <Bidding uuid={currentItem.uuid} onPay={topay}></Bidding>
          }
        </Popup>
        <View className='poster-share'>
          <Image className='poster-share-img' src={weixin} onClick={openCanvas} />
        </View>
        {params?.isShare && <FloatBtn icon={<Text className='myIcon fz50'>&#xe756;</Text>}></FloatBtn>}
        <PayFeePopup
          disableYUEPay
          onVisibleChange={(pay) => setVisibles({ ...visibles, pay })}
          headerType='close'
          fee={fee as number}
          feeType='deposit'
          visible={visibles.pay}
          onSubmit={submit}
        />

        {
          shareImg && <ActiveCanvasPhoto
            shareImg={shareImg}
            shareData={webAppshareData}
            shareLink={shareLink}
            headImg={pick_canvas}
            visible={canvasVisible as boolean}
            init={initNewUser}
            onClose={() => setCanvasVisible(false)}
          />
        }
      </View>
    </ScrollView>
  </>

}

export default LeakList