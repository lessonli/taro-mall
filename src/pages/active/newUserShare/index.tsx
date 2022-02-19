
import Taro, { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { XImage } from "@/components/PreImage";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import compose, { fen2yuan, formatMoeny, loginCertify } from "@/utils/base";
import { useRequest, useDebounceFn, useThrottleFn } from 'ahooks'
import { isAppWebview } from "@/constants";
import { hotSale, hotSaleTop1, hotSaleTop2, hotSaleTop3, empty, weixin } from "@/constants/images";
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import FloatBtn from "../components/FloatBtn";
import HotSale from "./components/HotSale";
import DoubleRow from "./components/DoubleRow";
import { useWeappUrlChannelHook, cachedWxConfig } from "@/utils/hooks";
import './index.scss'
import { host } from "@/service/http";
import Empty from "@/components/Empty";
import CanvasPhoto from "@/components/CanvasPhoto";
import api3482, { IResapi3482 } from "@/apis/21/api3482";


// 分享相关接口
import api4268 from "@/apis/21/api4268"; // 活动相关
import api3554 from "@/apis/21/api3554"; // link
import api3560 from "@/apis/21/api3560"; // qrcode
import { initNewUser } from "@/components/CanvasPhoto/components/CanvasInit";

type IData = Required<Required<IResapi3482>['data']>['data'][0]
function NewUserShare() {
  const titleArray = [
    { title: '5元包邮', id: "1000005" },
    { title: '9.9特卖', id: "1000006" },
    { title: '19.9优选', id: "803309396975104" },
    { title: '29.9封顶', id: "1000007" },
    { title: '39.9心选', id: "825606839226880" },
    { title: '49.9专区', id: "1000008" },
  ]
  const hotSaleArr = [
    { _title: '销量冠军', hotTopImg: hotSaleTop1 },
    { _title: '品质首选', hotTopImg: hotSaleTop2 },
    { _title: '好评如潮', hotTopImg: hotSaleTop3 },
  ]
  const HOTSALEID = "100001";
  const HEADTOP = 402;

  const params = useMemo(() => Taro.getCurrentInstance().router?.params, [])
  const [current, setCurrent] = useState("1000005")
  const [hotSaleData, setHotSaleData] = useState<IData>()
  const [styleObj, setStyleObj] = useState({})
  const refIndex = useRef(0)
  const sharePromise = useRef(undefined)
  const [scrollTop, setScrollTop] = useState<number>(0 + Math.random())

  //  分享相关
  const [webAppShareData, setWebShareData] = useState()
  const [shareData, setShareData] = useState()
  const [canvasVisible, setCanvasVisible] = useState<boolean>(false)
  const [shareImg, setShareImg] = useState<string>('')
  const [shareLink, setShareLink] = useState<string>('')
  const [shareInfo, setShareInfo] = useState()
  useEffect(() => {
    Taro.showLoading()
    refIndex.current = 0;
    (async () => {
      const { data = [] } = await api3482({ activityId: HOTSALEID, pageNo: 1, pageSize: 6 })
      Taro.hideLoading()
      // 改造初始数据 _title 防止 覆盖
      const dataArr = data.map((element, index) => {
        return hotSaleArr[index] ? { ...element, ...hotSaleArr[index] } : element
      });
      setHotSaleData(dataArr)
    })()
    Taro.hideLoading()
  }, [])

  // 仅分享相关
  useEffect(() => {
    (async () => {
      const fn = async () => {
        const shareInfoRes = await api4268({ uuid: params?.activityId })
        const dataRes = await api3554({ shareType: 7, targetId: params?.activityId })
        return {
          shareInfoRes,
          dataRes,
          title: shareInfoRes?.shareTitle,
          path: dataRes?.shareUrl,
          imgUrl: shareInfoRes?.icon
        }
      }
      sharePromise.current = fn()
      const { shareInfoRes, dataRes } = await sharePromise.current

      setShareInfo(shareInfoRes)


      setShareData(Object.assign({}, { ...shareInfoRes }, { ...data }))

      const shareData = {
        title: shareInfoRes?.shareTitle,
        desc: shareInfoRes?.shareSubTitle,
        link: dataRes?.shareUrl,
        imgUrl: shareInfoRes?.icon
      }
      setWebShareData(shareData)
      cachedWxConfig().then(wx => {
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)
      })
    })()
  }, [])
  // useEffect(() => {
  //   reload()
  // }, [current])
  useShareAppMessage(async () => {
    const res = await sharePromise.current
    const shareData = {
      title: res?.title,
      path: res?.path?.replace(host, ''),
      imageUrl: res?.imgUrl,
    }
    console.log(shareData, 'shareData');
    return shareData


  })

  useShareTimeline(() => {
    return {
      title: shareData?.shareTitle,
      path: shareData?.shareUrl?.replace(host, ''),
      imageUrl: shareData?.icon,
    }
  })
  useWeappUrlChannelHook()


  const { run: toGoodsDetail } = useDebounceFn((productId) => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        "openNativePage",
        JSON.stringify({ page: '/product/detail', params: { productId: productId, activityId: current } })
      )
    }
    if (!isAppWebview) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${productId}&activityId=${current}`
      })
    }
  }, { wait: 200 })

  const { run: scroll } = useThrottleFn((e) => {
    // console.log(e.detail, 'detail');
    if (e.detail.scrollTop >= HEADTOP) {
      setStyleObj({
        position: 'fixed',
        top: '0',
        zIndex: 110
      })
    } else {
      setStyleObj({
      })
    }

  }, { wait: 200 })

  const scrollx = (e) => {
    // console.log(e.detail);
    e.stopPropagation?.()
  }
  const handleChange = useCallback((index, id) => {
    refIndex.current = index;
    setCurrent(id)
    setScrollTop((HEADTOP + Math.random()))

  }, [])

  const scrollLeft = useMemo(() => {
    if (refIndex.current >= 3) {
      return (165 + Math.random())
    } else {
      return (0 + Math.random())
    }

  }, [refIndex.current])


  const openCanvas = async () => {
    const dataRes = await api3560({ shareType: 7, targetId: params?.activityId })
    setShareImg(dataRes?.qrCodeUrl)
    setShareLink(dataRes?.shareUrl)
    setCanvasVisible(true)
  }
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20

    const res = await api3482({
      pageNo,
      pageSize,
      activityId: current
    })
    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [current])
  const { data, noMore, loadMore, loading } = useRequest(service, {
    loadMore: true,
    manual: false,
    debounceInterval: 200,
    refreshDeps: [current],
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })
  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore: (data?.list || []).length >= data?.total && !loading
  })
  console.log(hotSaleData, 'hotSaleData');

  return <View>
    <ScrollView
      className='newUserShare-scrolly'
      // scrollWithAnimation
      onScroll={scroll}
      scrollTop={scrollTop}
      onScrollToLower={loadMore}
      scrollY

    >
      <View className='newUserShare-hotSale'>
        <Image className='newUserShare-hotSale-img' src={hotSale}></Image>
        <View className='newUserShare-hotSale-list'>
          {hotSaleData?.map((item, index) => {
            return <HotSale toGoodsDetail={toGoodsDetail} data={item} key={item.uuid}></HotSale>
          })}
        </View>
      </View>
      {/* tab 暂位 */}
      <View className='newUserShare-scrollx'>
        <View className='newUserShare-tabsWrapper' >
          <View className='newUserShare-tabs' style={styleObj}>
            <ScrollView
              onScroll={scrollx}
              scrollWithAnimation
              scrollX
              scrollLeft={scrollLeft}
              className='newUserShare-scroll-x'
            >
              {titleArray.map((item, idx) => {
                return (
                  <View onClick={() => handleChange(idx, item.id)} className={`newUserShare-tabs-item  ${refIndex.current === idx ? 'newUserShare-tabs-itemActive' : ''}`} key={item.id}>
                    {item.title}
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </View>

      <View className={`newUserShare-goodsList newUserSharHasCon`}>
        {data?.list.length > 0 && data?.list.map((ite, index) => {
          return <DoubleRow toGoodsDetail={toGoodsDetail} data={ite} key={ite.uuid}></DoubleRow>
        })}

        <View className='newUserShare-goodsList-status'>
          {
            listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
          }
        </View>
      </View>





    </ScrollView>
    <View className='poster-share' onClick={() => openCanvas()}>
      <Image className='poster-share-img' src={weixin} />
    </View>
    {params?.isShare && <FloatBtn icon={<Text className='myIcon fz50'>&#xe756;</Text>} />}
    {
      canvasVisible && shareImg && <CanvasPhoto
        shareImg={shareImg}
        shareLink={shareLink}
        headImg={shareInfo?.sharePosters}
        visible={canvasVisible as boolean}
        shareData={webAppShareData}
        init={initNewUser}
        onClose={() => setCanvasVisible(false)}
      />
    }
  </View>
}

export default NewUserShare