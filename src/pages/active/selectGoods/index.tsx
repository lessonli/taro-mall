
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { selectGoodsUserBanner, selectGoodsMerchantBanner, poster_product_top, jp } from "@/constants/images";
import Taro, { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { useEffect, useCallback, useMemo, useRef, useState } from "react";

import SelectGoodsUserItem from "./components/SelectGoosUserItem";
import SelectGoodsMerchantItem from "./components/SelectGoodsMerchantItem";

import { getStatus, getUserInfo } from "@/utils/cachedService";
import api2100, { IResapi2100 } from "@/apis/21/api2100";

import api3482, { IResapi3482 } from "@/apis/21/api3482";
import { useRequest, useDebounceFn } from 'ahooks'
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";

import { isAppWebview } from "@/constants";
import api2524, { IResapi2524 } from "@/apis/21/api2524";

import api3554, { IResapi3554 } from "@/apis/21/api3554";
import api4268, { IResapi4268 } from "@/apis/21/api4268";
import api3560, { IResapi3560 } from "@/apis/21/api3560";
import { cachedWxConfig } from "@/utils/hooks";
import { host } from "@/service/http";
import Poster from "@/components/Poster";
import './index.scss'
import api2612, { IResapi2612 } from "@/apis/21/api2612";
import { cacheImg, fen2yuan, loginCertify, dealName} from "@/utils/base";
import api2906, { IResapi2906 } from "@/apis/21/api2906";
import dayjs from "dayjs";

type IUserInfo = Required<IResapi2100>['data']
type Idata = Required<Required<IResapi3482>['data']>
type IDetail = Required<IResapi2524["data"]>
type IShareLinkData = Required<IResapi3554["data"]>
type IqrcodeInfo = Required<IResapi3560["data"]>
type IPosterConfigRes = Required<IResapi4268["data"]>
type IStoreInfo = Required<IResapi2612>['data']
interface ICanvasVisible {
  canvasVisible: boolean

}


type ICanvasVisibleKey = keyof ICanvasVisible
type IAuctionIngo = Required<IResapi2906>['data']
interface IShareData {
  title: string | undefined,
  desc: string | undefined,
  link: string | undefined,
  imgUrl: string | undefined,

}


function SelectGoods() {
  // 没有登录 或者 为普通用户 统一定义为  普通用户身份
  const [userInfo, setUserInfo] = useState<IUserInfo>({})
  const page = useMemo(() => Taro.getCurrentInstance().router, [])
  const [shareData, setShareData] = useState<IShareData>()
  // const [goodsDetail, setGooodsDetail] = useState<IDetail>()
  const [shareLinkData, setShareLinkData] = useState<IShareLinkData>()
  // const [qrcodeInfo, setQrcodeInfo] = useState<IqrcodeInfo>()
  // const [posterConfig, setPosterConfig] = useState<IPosterConfigRes>()
  const sharePromise = useRef(undefined)
  // const [auctionInfo, setAuctionInfo] = useState<IAuctionIngo>()
  // const [storeInfo, setStoreInfo] = useState<IStoreInfo>()
  const [visible, setVisible] = useState({
    canvasVisible: false
  })

  const goodsRef = useRef()
  const posterRef = useRef()

  // const [data, setData] = useState<Idata>()
  useEffect(() => {
    (async () => {
      try {
        const userInfoRes = await getUserInfo()
        setUserInfo(userInfoRes)
      } catch (error) {
        setUserInfo({})
      }

      sharePromise.current = api3554({ shareType: 7, targetId: page?.params?.activityId || '', })
      const linkData = await sharePromise.current
      // const linkData = await api3554({ shareType: 7, targetId: page?.params?.activityId|| '', })
      setShareLinkData(linkData)
      cachedWxConfig().then(wx => {
        const shareData = {
          title: linkData?.title, // 分享标题
          desc: linkData?.subTitle, // 分享描述
          link: linkData?.shareUrl, // 分享链接
          imgUrl: linkData?.picUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        }
        console.log(shareData, 'shareData');

        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)
      })


    })()
  }, [])
  useShareAppMessage(async () => {
    const res = await sharePromise.current
    const shareData = {
      title: res.title,
      path: res?.shareUrl?.replace(host, ''),
      imageUrl: res?.picUrl,
    }  
    console.log(shareData,'shareData');
      
    return shareData
  })
  // useShareTimeline(() => {
  //   return {
  //     title: shareLinkData?.title,
  //     path: shareLinkData?.shareUrl?.replace(host, ''),
  //     imageUrl: shareLinkData?.picUrl,
  //   }
  // })

  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 7

    const res = await api3482({
      pageNo,
      pageSize,
      activityId: page?.params?.activityId || ''
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
  })

  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })

  const getGoodsDetail = async () => {
    showCanvas('canvasVisible')
    const productId = goodsRef.current
    console.log(productId, 'productId');

    const detailRes = await api2524({ uuid: productId, activityId: page?.params?.activityId || '' })
    // setGooodsDetail(detailRes)
    const storeRes = api2612({ merchantId: detailRes?.merchantId })

    // await api3560({ targetId: page.router?.params.productId, shareType: 3, customParam: activityId ? `?activityId=${activityId}` : '' })
    const qrcoderes = api3560({ shareType: 3, targetId: productId || '', customParam: page?.params?.activityId ? `?activityId=${page?.params?.activityId}` : '' })
    sharePromise.current = qrcoderes
    // 获取拍品信息
    // const auctionForm =  api2906({ uuid:productId })

    const p = () => Promise.all([storeRes, qrcoderes])

    const res = await p()
    const [storeInfoRes, qrcodeInfoRes,] = res
    console.log(res, 'res');
    let auctionForm;

    // 拍品信息   
    if (detailRes?.productType === 1) {
      auctionForm = await api2906({ uuid: productId })

    }

    // setStoreInfo(storeInfoRes)
    // setQrcodeInfo(qrcodeInfoRes)
    // setAuctionInfo(res[2])
    let cacheImgArr = [poster_product_top, storeInfoRes?.shopLogo, detailRes?.icon, ...detailRes?.albumPics?.split(',')]
    const shareData = {
      title: qrcodeInfoRes?.title,
      desc: qrcodeInfoRes?.subTitle,
      link: qrcodeInfoRes?.shareUrl,
      imgUrl: qrcodeInfoRes?.picUrl
    }
    console.log(shareData, 'shareData');
    setShareData(shareData)

    await cacheImg(cacheImgArr)
    let json = {
      children: [
        {
          type: 'fill',
          left: 0,
          color: 'rgba(255, 255, 255, 1)',
          top: 0,
          width: 520,
          height: 924
        },
        {
          type: 'img',
          left: 0,
          radius: 0,
          top: 0,
          width: 520,
          height: 52,
          src: poster_product_top
        },

        {
          type: 'img',
          left: 32,
          radius: 8,
          top: 76,
          width: 70,
          height: 70,
          src: storeInfoRes?.shopLogo
        },

        {
          type: 'text',
          value: detailRes?.name,
          left: 118,
          top: 91,
          verticalAlign: 'middle',
          textAlign: 'left',
          font: 30,
          color: '#333'
        },
        {
          type: 'text',
          value: '当前价 ¥',
          font: 20,
          color: '#AA1612',
          verticalAlign: 'middle',
          textAlign: 'left',
          left: 118,
          top: 135,
          otherSide: detailRes?.productType === 1
        },
        {
          type: 'text',
          value: '¥',
          font: 20,
          color: '#AA1612',
          verticalAlign: 'middle',
          textAlign: 'left',
          left: 118,
          top: 135,
          otherSide: detailRes?.productType !== 1
        },
        {
          type: 'text',
          value: `${detailRes?.productType === 1 ? fen2yuan(auctionForm?.lastAucPrice) : fen2yuan(detailRes?.price)}`,
          font: 34,
          color: '#AA1612',
          verticalAlign: 'middle',
          textAlign: 'left',
          left: detailRes?.productType === 1 ? 202 : 134,
          top: 129
        },
        {
          type: 'img',
          left: 32,
          radius: 8,
          top: 162,
          width: 456,
          height: 456,
          src: detailRes?.icon
        },

        {
          type: 'img',
          left: 32,
          radius: 8,
          top: 630,
          width: 140,
          height: 140,
          src: detailRes?.albumPics?.split(',')[0]
        },
        {
          type: 'img',
          left: 190,
          radius: 8,
          top: 630,
          width: 140,
          height: 140,
          src: detailRes?.albumPics?.split(',')[1]
        },
        {
          type: 'img',
          left: 348,
          radius: 8,
          top: 630,
          width: 140,
          height: 140,
          src: detailRes?.albumPics?.split(',')[2]
        },
        {
          type: 'img',
          left: 32,
          radius: 8,
          top: 788,
          width: 112,
          height: 112,
          src: qrcodeInfoRes?.qrCodeUrl
        },
        {
          type: 'text',
          value: detailRes?.ownState === 1 ? dealName(storeInfoRes?.shopName,8) + '为你推荐' : dealName(userInfo?.nickName,8) + '为你推荐',
          left: 158,
          top: 827,
          length: 200,
          verticalAlign: 'middle',
          textAlign: 'left',
          font: 30,
          color: '#333'
        },
        {
          type: 'text',
          value: '长按识别，进入购买',
          left: 158,
          top: 864,
          length: 150,
          verticalAlign: 'middle',
          textAlign: 'left',
          font: 20,
          color: '#999'
        },
        {
          type: 'fill',
          left: 32,
          color: 'rgba(189, 136, 62, .7)',
          top: 570,
          width: 458,
          height: 50,
          otherSide: detailRes?.productType === 1
        },
        {
          type: 'text',
          value: `${dayjs(auctionForm?.endTime).format('MM-DD HH:mm:ss')}结束`,
          font: 24,
          color: '#fff',
          verticalAlign: 'middle',
          textAlign: 'left',
          left: 247,
          top: 595,
          otherSide: detailRes?.productType === 1
        },
        {
          type: 'text',
          value: `${auctionForm?.status === 0 ? '正在竞拍' : '竞拍结束'}`,
          font: 24,
          color: '#fff',
          verticalAlign: 'middle',
          textAlign: 'left',
          left: 78,
          top: 595,
          otherSide: detailRes?.productType === 1
        },
        {
          type: 'img',
          left: 44,
          top: 582,
          width: 26,
          height: 26,
          src: jp,
          otherSide: detailRes?.productType === 1
        },
      ]
    }

  
    
    
    posterRef.current.startDraw(json)
  }


  const { run: toGoodsDetail } = useDebounceFn(async (productId) => {

    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        "openNativePage",
        JSON.stringify({ page: '/product/detail', params: { productId: productId, activityId: page?.params?.activityId || '' } })
      )
    }
    if (!isAppWebview) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${productId}&activityId=${page?.params?.activityId || ''}`
      })
    }
  }, { wait: 200 })

  const showCanvas = (key: ICanvasVisibleKey) => {
    setVisible({ ...visible, [key]: true })
  }
  const closeCanvas = (key: ICanvasVisibleKey) => {
    setVisible({ ...visible, [key]: false })
  }
  const openCanvas = async () => {
    sharePromise.current = api3554({ shareType: 7, targetId: page?.params?.activityId || '', })
    try {
      const userInfoRes = await getUserInfo()
      setUserInfo(userInfoRes)
      const qrcoderes = await api3560({ shareType: 7, targetId: page?.params.activityId || '' })
      const posterConfigRes = await api4268({ uuid: page?.params.activityId || '' })
      // setQrcodeInfo(qrcoderes)
      // setPosterConfig(posterConfigRes)
      const shareData = {
        title: qrcoderes?.title,
        desc: qrcoderes?.subTitle,
        link: qrcoderes?.shareUrl,
        imgUrl: qrcoderes?.picUrl
      }
      console.log(shareData, 'shareData');
      
      setShareData(shareData)
      let json = {
        children: [
          {
            type: 'fill',
            left: 0,
            top: 0,
            color: 'rgba(255, 255, 255, 1)',
            width: 520,
            height: 924

          },
          {
            type: 'img',
            left: 0,
            top: 0,
            radius: 0,
            width: 520,
            height: 772,
            src: posterConfigRes?.sharePosters

          },
          {
            type: 'img',
            left: 32,
            radius: 8,
            top: 788,
            width: 112,
            height: 112,
            src: qrcoderes?.qrCodeUrl
          },
          {
            type: 'text',
            value: `${dealName(userInfoRes?.nickName,8)}为你推荐`,
            left: 158,
            top: 827,
            length: 150,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 26,
            color: '#333'
          },
          {
            type: 'text',
            value: '长按识别，进入购买',
            left: 158,
            top: 864,
            length: 150,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 20,
            color: '#999'
          },
        ]
      }
      console.log(json, 'json');
      
      showCanvas('canvasVisible')
      posterRef.current.startDraw(json)


    } catch (error) {
      if (error.code === 1000 || error.code === 1010) {
        loginCertify()
      }
    }


  }



  const handleShareItem = (uuid) => {
    goodsRef.current = uuid
    getGoodsDetail()
  }

  return <ScrollView
    className="selectGoods"
    scrollY
    onScrollToLower={loadMore}
  >
    <View className="selectGoods-banner"><Image className="selectGoods-banner-img" src={`${userInfo?.userLevel === 3 ? selectGoodsMerchantBanner : selectGoodsUserBanner}`}></Image></View>
    <View className="selectGoods-list">
      {
        userInfo?.userLevel === 3 && data?.list?.map((item, index) => {
          return <>
            <SelectGoodsMerchantItem toGoodsDetail={toGoodsDetail} data={item} key={index} onShare={handleShareItem}></SelectGoodsMerchantItem>
          </>
        })
      }
      {
        userInfo?.userLevel !== 3 && data?.list?.map((item, index) => {
          return <>
            <SelectGoodsUserItem toGoodsDetail={toGoodsDetail} data={item} key={index}></SelectGoodsUserItem>
          </>
        })
      }


    </View>
    <View>

      <LoadingView visible={listStatus.loading} />

    </View>
    <View className="selectGoods-sharebox">
      <View className="selectGoods-sharebox-share" onClick={() => openCanvas()}>立即分享</View>
    </View>



    {
      visible?.canvasVisible && <Poster
        ref={posterRef}
        visible={visible.canvasVisible}
        shareLink={shareLinkData?.shareUrl}
        shareData={shareData}
        onClose={() => closeCanvas('canvasVisible')}
        width={520}
        height={924}
        operationType={['friend', 'saveImg']}
      >
      </Poster>
    }




  </ScrollView>
}

export default SelectGoods



