
import { View, Text, Image, ScrollView } from "@tarojs/components";

import { highGoods, highGoodsBorder, highGoodsBorder1, highGoodsBorder2 } from "@/constants/images";
import { XImage } from "@/components/PreImage";
import { AtButton } from "taro-ui";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";

import Taro, { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { isAppWebview } from "@/constants";

import { useDebounceFn, useRequest } from "ahooks";
import compose, { getRealSize, formatMoeny, fen2yuan } from "@/utils/base";
import { host } from "@/service/http";


import Empty from '@/components/Empty';
import { cachedWxConfig, useWeappUrlChannelHook } from "@/utils/hooks";
import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import { empty, weixin, high_goods } from '@/constants/images';
import ActiveCanvasPhoto from "@/components/CanvasPhoto";
import FloatBtn from "../components/FloatBtn";
import api3482, { IResapi3482 } from "@/apis/21/api3482";
import api3560 from "@/apis/21/api3560";
import api3554 from "@/apis/21/api3554";
import api4268, { IResapi4268 } from "@/apis/21/api4268";

import './index.scss'
import { initNewUser } from "@/components/CanvasPhoto/components/CanvasInit";

type IshareInfo = Required<IResapi4268>['data']


const Item = ({ data, toGoodsDetail }) => {
  return <View className='bw-highGoods-list-item m-t-24' onClick={() => toGoodsDetail(data.uuid)}>
    <View className='bw-highGoods-list-item-goodsWrap'>
      <Image className='bw-highGoods-list-item-goodsWrap-imgBorder' src={highGoodsBorder2}></Image>
      <XImage className='bw-highGoods-list-item-goodsWrap-img' src={data?.icon} query={{ 'x-oss-process': 'image/resize,w_690/quality,q_100' }}></XImage>
    </View>
    <View className='bw-highGoods-list-item-goodsInfo'>
      <Text className='bw-highGoods-list-item-goodsInfo-title'>{data?.name}</Text>
      <View className='bw-highGoods-list-item-goodsInfo-price'>
        <View className='bw-highGoods-list-item-goodsInfo-price-number'>
          <Text className='bw-highGoods-list-item-goodsInfo-price-number-current'>
            <Text className='color-primary bw-highGoods-money-symbol'>￥</Text>
            <Text className='color-primary bw-highGoods-list-item-goodsInfo-price-number-current-price'>{compose(formatMoeny, fen2yuan)(data?.price)}</Text>
          </Text>
          <Text className='bw-highGoods-list-item-goodsInfo-price-number-history'>￥{compose(formatMoeny, fen2yuan)(data?.originalPrice)}</Text>
        </View>
        <AtButton size='small' type='primary' className='bw-highGoods-list-item-goodsInfo-price-buy'>立即购买</AtButton>
      </View>
    </View>
  </View>
}
function HighGoodsList() {
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [canvasVisible, setCanvasVisible] = useState<Boolean>(false)
  const [shareInfo, setShareInfo] = useState<IshareInfo>()
  const [webAppShareData, setWebShareData] = useState()
  const [shareData, setShareData] = useState()
  const params = useMemo(() => Taro.getCurrentInstance().router?.params, [])
  const sharePromise = useRef(undefined)

  const { run: toGoodsDetail } = useDebounceFn((productId) => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        "openNativePage",
        JSON.stringify({ page: '/product/detail', params: { productId: `${productId}`,activityId:params?.activityId } })
      )
    }
    if (!isAppWebview) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${productId}&activityId=${params?.activityId || ' '}`
      })
    }
  }, { wait: 200 })

  useEffect(() => {
    (async () => {

      const fn = async()=>{
        const data = await api3554({ shareType: 7, targetId: params?.activityId })
        const shareInfoRes = await api4268({ uuid: params?.activityId })
        return {
          data,
          shareInfoRes,
          title: shareInfoRes?.shareTitle,
          path: data?.shareUrl,
          imgUrl: shareInfoRes?.icon
        }
      }
      sharePromise.current = fn()

      const {data, shareInfoRes} =  await sharePromise.current
      setShareInfo(shareInfoRes)

      setShareData(Object.assign({}, { ...shareInfoRes }, { ...data }))
      const shareData = {
        title: shareInfoRes?.shareTitle,
        desc: shareInfoRes?.shareSubTitle,
        link: data?.shareUrl,
        imgUrl: shareInfoRes?.icon
      }
      setWebShareData(shareData)

      cachedWxConfig().then(wx => {
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)
      })
    })()

  }, [])

  useShareAppMessage(async () => {
    const res = await sharePromise.current
    console.log(res, 'res1');
    return {
      title: res?.title,
      path: res?.path?.replace(host, ''),
      imageUrl: res?.imgUrl,
    }
  })

  useShareTimeline(() => {

    return {
      title: shareData?.shareTitle,
      path: shareData?.shareUrl?.replace(host, ''),
      imageUrl: shareData?.icon,
    }
  })
  useWeappUrlChannelHook()
  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    // const isCollection = Taro.getCurrentInstance().router?.params.isCollect

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20

    const res = await api3482({
      pageNo,
      pageSize,
      activityId: params?.activityId
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [])
  const { data, loadMore, loading, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })

  const openCanvas = async () => {
    const data = await api3560({ shareType: 7, targetId: params.activityId || '' })
    setshareImg(data?.qrCodeUrl)
    setShareLink(data?.shareUrl)
    setCanvasVisible(true)
  }

  // const Row = useCallback(({ data, index }) => <Item toGoodsDetail={toGoodsDetail} data={data[index]} />, [data])
  // console.log(data, 'data');

  return <ScrollView onScrollToLower={loadMore} lowerThreshold={500} scrollY className='highGoodScrollview'>

    <View className='bw-highGoods'>
      <Image className='bw-highGoods-img' src={highGoods}></Image>
      <View className='bw-highGoods-listWrap'>
        <View className='bw-highGoods-list'>
          {data.list.map((item, index) => {
            return <Item key={item.uuid} toGoodsDetail={toGoodsDetail} data={item}></Item>
          })}
        </View>
        {
          listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
        }
        {/* {
        listStatus.empty && <Empty src={empty} text="暂无数据" className="m-t-60" />
      } */}

      </View>
      <View className='poster-share'>
        <Image className='poster-share-img' src={weixin} onClick={openCanvas} />
      </View>
      {params?.isShare && <FloatBtn icon={<Text className='myIcon fz50'>&#xe756;</Text>}></FloatBtn>}
      {
        shareImg && <ActiveCanvasPhoto
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
  </ScrollView>
}


export default HighGoodsList