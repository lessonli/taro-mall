import Taro, { useDidShow, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { RichText, ScrollView, Text, Image, View } from '@tarojs/components'
import { cachedWxConfig, getWxConfig, useWeappUrlChannelHook, useUserTypeHook } from '@/utils/hooks'
import Label from '@/components/Label'
import Auction from '@/components/Auction'
import Evaluate from '@/components/Evaluate'
import Commodity from '@/components/CommodityModule'
import StoreHeader from '@/pages/store/components/store-header'
import StoreDetail from '@/pages/store/components/stroe-detail'
import StickBox, { useStick } from '@/components/StickBox'
import EarnestRules from '../components/EarnestRules'
import AuctionRules from '../components/AuctionRules'
import AuctionRecordList, { AuctionList } from '../components/AuctionList'
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import Popup from '@/components/Popup'
import PayFeePopup from '@/components/PayFeePopup'
import ListItem from '@/components/ListItem'
import BwSwiper from '@/components/Swiper'
import SubmitButton from '../components/SubmitBottom'
import Bidding from '../components/Bidding'
import api2604 from '@/apis/21/api2604'
import { siliao, dianp, next, chujia, shoucang1, shoucang0, success, storeHeader, shangp, zhif, lingx, paimai, fenxiang, back, EARN, vip1, VIP, share, weixin, rz, empty, wenhao, jp, poster2, poster_product_top, report } from '@/constants/images'
import './index.scss'
import api2612, { IResapi2612 } from '@/apis/21/api2612'
import api2524, { IResapi2524 } from '@/apis/21/api2524'
import api2348, { IResapi2348 } from '@/apis/21/api2348'
import api2316 from '@/apis/21/api2316'
import api2324 from '@/apis/21/api2324'
import api2906, { IResapi2906 } from '@/apis/21/api2906'
import { escape2Html, numCount, selectorQueryClientRect, fen2yuan, preLoadImg, getHostProxyImg, deepClone, dealName, cacheImg, getCacheImg, loginCertify, TaroNavigateTo, BwTaro } from '@/utils/base'
import api3128, { IResapi3128 } from '@/apis/21/api3128'
import ShoppingCar from '../components/shoppingCar'
import Poster from '@/components/Poster'
import api2380 from '@/apis/21/api2380'
import api3560 from '@/apis/21/api3560'
import api3554 from '@/apis/21/api3554'
import { getServices, getStatus, getUserInfo } from '@/utils/cachedService'
import { parseOssImageInfo } from '@/components/Upload/oss'
import api1892, { IResapi1892 } from '@/apis/21/api1892'
import paySdk from '@/components/PayFeePopup/paySdk'
import api2978 from '@/apis/21/api2978'
import PreLoadingBOx from '@/components/PreLoading'
import PreImage from '@/components/PreImage'
import storge, { foorPrints } from '@/utils/storge'
import NavigationBar, { BackAndHomeBtn } from '@/components/NavigationBar'
import Empty from '@/components/Empty'
import { isAppWebview } from '@/constants'
import BwModal from '@/components/Modal'
import { host, request } from '@/service/http'
import { initCommodity } from '@/components/CanvasPhoto/components/CanvasInit'
import { IHandleCaptureException, Sentry } from '@/sentry.repoter'
import dayjs from 'dayjs'
import api2100, { IResapi2100 } from '@/apis/21/api2100'
import { getUserAvatar } from '@/utils/poster'
import LoginWrapperBtn from '@/components/WxComponents/LoginWrapperBtn'
import CouponList from '../components/CouponList'

export type IDetail = Required<IResapi2524["data"]>
export type IStoreInfo = Required<IResapi2612>['data']
export type IUserInfo = Required<IResapi2100>['data']
export type IEvaluate = Required<Required<IResapi2348>['data']>['data'][0]
export type IAuctionIngo = Required<IResapi2906>['data']
export type IRecord = Required<IResapi3128>['data']
export type IServiceConfig = Required<IResapi1892>['data']
const GoodsDetail = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const params = useRouter()
  const paramsRef = useRef(Taro.getCurrentInstance())
  const swiperRef = useRef()
  const auctionRef = useRef()
  const [goodsDetail, setGooodsDetail] = useState<IDetail>()
  const [storeInfo, setStoreInfo] = useState<IStoreInfo>()
  const [auctionInfo, setAuctionInfo] = useState<IAuctionIngo>()
  const [evalusteData, setEvalusteData] = useState<IEvaluate>()
  const [hasCollect, setHasCollect] = useState<number | undefined>(0)
  const [serviceConfig, setServiceConfig] = useState<IServiceConfig>()
  const [rulesVisible, setRulesVisible] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)
  const [auctionRecordList, setAuctionRecordList] = useState<IRecord>()
  const [detail, useDetail] = useState<any>()
  const [canvasVisible, setCanvasVisible] = useState<boolean>(false)
  const [popUpInfo, setPopUpInfo] = useState<{ title: string, type: number }>({ title: '', type: 5 })
  const [merchantId, setMerchantId] = useState<string | ''>()
  const [position, setPosition] = useState<'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'>('static')
  const [pageNo, setPageNo] = useState<number>(0)
  const [recordUdate, setRecordUdate] = useState<boolean>(false)
  const [payVisible, setPayVisible] = useState<boolean>(false)
  const [commodityData, setCommodityData] = useState<[]>()
  const [compelete, setCompelete] = useState<boolean>(false)
  const [priceUpdate, setPriceUpdate] = useState<boolean>(false)
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [shareInfo, setShareInfo] = useState<any>()
  const [showMoadl, setShowMoadl] = useState<boolean>(false)
  const [detailImgList, setDetailImgList] = useState<any[]>()
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const [showReport, setShowReport] = useState<boolean>(false)
  const { userType } = useUserTypeHook()
  const shareDetail = useRef(undefined)
  const preImgBox = useRef({})
  const canvasContext = useRef()
  /**
   * ???????????? ??????????????????
   */
  const activityId = useMemo(() => page.router?.params?.activityId || '', [])

  const dataInit = async () => {
    // ????????????
    process.env.TARO_ENV !== 'weapp' && PreLoadingBOx.open()

    const uuid = page.router?.params?.productId
    // const productServices = await getServices()
    // console.log(productServices);
    // ????????????
    const form = await api2524({ uuid, activityId })
    let currentPage = Taro.getCurrentPages()
    if (currentPage.length > 1) {
      let routePage = currentPage[currentPage.length - 2]
      if (routePage.$taroPath.indexOf('pages/store/index') > -1 && routePage.$taroParams.merchantId !== form?.merchantId) {
        Sentry?.captureMessage(`???????????????????????????merchantId?????????`)
        Sentry?.captureException({
          exceptionName: 'product_merchantId_err',
          errs: '',
          value: `??????merchantId${routePage.options.merchantId}??????merchantId???${form?.merchantId}`,
        } as IHandleCaptureException)
      }
    }
    setGooodsDetail(form)

    // ?????????app????????????
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({
          page: '/product/detail',
          params: { productId: form?.uuid, activityId },
        })
      )
    }
    // ????????????
    foorPrints.addItem(form)

    // ????????????label
    const serviceConfigs = await getServices()
    let labelList = form?.serviceIds ? form?.serviceIds?.split(',').map(item => {
      return serviceConfigs?.filter(item2 => Number(item) === item2.id)[0]
    }) : []
    if (form?.freightPrice === 0) {
      labelList?.unshift({
        id: 4,
        desc: '??????',
        name: '????????????'
      })
    }
    setServiceConfig(labelList)

    // ????????????
    setHasCollect(form?.collectState)

    // ??????Id
    setMerchantId(form?.merchantId)

    // ????????????-????????????
    useDetail(escape2Html(form?.mobileHtml || ''))

    // ????????????
    // const auctionForm = await api2906({ uuid })
    // setAuctionInfo(auctionForm)
    form?.productType === 1 && getAuctionInfo(uuid)

    // ????????????
    setCompelete(true)

    process.env.TARO_ENV !== 'weapp' && PreLoadingBOx.close()

    //????????????
    api2348({ merchantId: form?.merchantId }).then(plList => {

      setEvalusteData(plList?.data[0])
    })

    //????????????
    api2612({ merchantId: form?.merchantId }).then(storeInfo => {
      setStoreInfo(storeInfo)
      cacheImg(storeInfo?.shopLogo)
      // downloader.download(storeInfo?.shopLogo, true).then(path => {
      //   preImgBox.current['shopLogo'] = path
      // })
      // cacheImg('shopLogo', storeInfo?.shopLogo)
    })

    //????????????

    form?.productType === 1 && getRecordList()
    // api2100().then(userInfo => {
    //   setUserInfo(userInfo)
    // })
    // const userInfo = await getUserInfo()
    // if(userInfo) {

    // } 

    // const result = await getStatus()
    // if (result) {
    const data = await api3554({ shareType: form?.productType === 1 ? 4 : 3, targetId: form?.uuid, customParam: activityId ? `?activityId=${activityId}` : '' })
    setShareInfo(data)
    cachedWxConfig().then(wx => {
      const shareData = {
        title: form?.name, // ????????????
        desc: data?.subTitle, // ????????????
        link: data?.shareUrl, // ????????????
        imgUrl: form?.icon, // ????????????
        type: '', // ????????????,music???video???link??????????????????link
        dataUrl: '', // ??????type???music???video??????????????????????????????????????????
      }
      wx?.updateAppMessageShareData(shareData)
      wx?.onMenuShareTimeline(shareData)
    })

    // }
    // shareDetail = new Promise((resolve, reject) => {
    //   const obj = Object.assign({}, { ...form }, { ...data })
    //   return resolve(obj)
    // })

    //@ts-ignore
    shareDetail.current = new Promise((resolve, reject) => {
      const obj = Object.assign({}, { ...form }, { ...data })
      return resolve(obj)
    })
    cacheImg([form?.icon, poster_product_top, jp])

    let list = form?.albumPics?.split(',').map((item, index) => {
      return { img: item, height: 0 }
    })
    list?.forEach((val, i) => {
      if (i <= 2) {
        cacheImg(val.img)
      }
      // Taro.getImageInfo({
      //   src: getUserAvatar(getHostProxyImg(val.img), 4),
      //   success: (res) => {
      //     val.height = 375 / res.width * res.height
      //   }
      // })
    })
    setDetailImgList(list)
    if (page.router?.params.sourceUrl === 'publish') {
      openCanvas()
    }
  }

  // ??????????????????


  //weapp???????????????
  useShareAppMessage(async () => {
    const res = await shareDetail.current

    // const data = await cacheShareData()
    // console.log(data, 123123);
    const data = {
      title: res?.name,
      path: res?.shareUrl.replace(host, ''),
      imageUrl: res?.icon
    }
    console.log('???????????????', data)
    return data
  })

  // weapp??????????????????
  useShareTimeline(() => {
    return {
      title: goodsDetail?.name,
      path: shareInfo?.shareUrl.replace(host, ''),
      imageUrl: goodsDetail?.icon
    }
  })

  useWeappUrlChannelHook()


  // ??????????????????
  const getRecordList = useCallback(
    async () => {
      setRecordUdate(true)
      const actionRecord = await api3128({ pageNo: 1, pageSize: 2, productId: page.router?.params?.productId })
      setAuctionRecordList(actionRecord)
      setTimeout(() => {
        setRecordUdate(false)
      }, 1000);
    },
    [],
  )


  const updateRecord = useCallback(
    // ??????????????????
    async () => {
      setPriceUpdate(false)
      setRecordUdate(true)
      const actionRecord = await api3128({ pageNo: 1, pageSize: 2, productId: page.router?.params?.productId })
      setAuctionRecordList(actionRecord)
      setPriceUpdate(true)
      setTimeout(() => {
        setRecordUdate(false)
      }, 1000);
    },
    [],
  )

  const updateAuction = useCallback(() => {
    // ?????????????????????
    updateRecord()
    getAuctionInfo(page.router?.params.productId)
  }, [])

  const onScroll = (e: any) => {
    if (height) {
      const { scrollTop } = e.mpEvent ? e.mpEvent.detail : e.detail
      useStick(scrollTop, height, position, setPosition)
    }

  }

  // ??????canvas
  const onCloseCanvas = () => {
    setCanvasVisible(false)
  }

  useEffect(() => {
    merchantId && run()
  }, [merchantId])

  // ??????????????????
  const service = useCallback(async (
    // ????????????????????????
    result?: { pageNo: number, pageSize: number, totalNum?: number | undefined }
  ) => {
    if (merchantId) {
      const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
      const pageSize = result?.pageSize || 20
      const res = await api2604({
        productType: goodsDetail?.productType,
        pageNo,
        pageSize,
        merchantId: merchantId || ''
      })
      const totalNum = result?.totalNum ? result?.totalNum + res.data.length : res.data.length
      return {
        list: res?.data,
        total: res?.total,
        totalNum: totalNum,
        pageNo,
        pageSize,
      }
    }
  }, [merchantId])

  const { loading, data, run, loadMore: loadMore2, reset } = useRequest(service, {
    loadMore: true,
    debounceInterval: 200,
    manual: true
    // isNoMore: (d) => (d ? d.list.length >= d.total : false)
  })

  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore: (data?.totalNum >= data?.total) && !loading
  })

  const loadMore = useCallback(() => {
    !listStatus.noMore && loadMore2()
  }, [listStatus])

  const { params: useRouterParams } = useRouter()
  const routerRef = useRef(Taro.getCurrentInstance())

  useEffect(() => {
    const a = page.router?.params?.productId
    const b = useRouterParams?.productId
    const c = routerRef.current.router?.params?.productId
    if (
      !(a === b && b === c && a !== undefined && a !== 'undefined')
    ) {
      Sentry?.captureException({
        exceptionName: '?????????productId??????',
        errs: '',
        value: JSON.stringify({ a, b, c }),
      } as IHandleCaptureException)
    }

  }, [useRouterParams])

  useDidShow(() => {
    dataInit()
  })

  // ??????????????????

  const getAuctionInfo = async (uuid) => {
    const auctionForm = await api2906({ uuid })
    setAuctionInfo(auctionForm)
  }

  // ??????????????????
  useLayoutEffect(() => {
    Taro.nextTick(async () => {
      // ??????swiper??????????????????????????????
      if (process.env.TARO_ENV === 'weapp' && goodsDetail?.productType === 1) {
        const dom = await selectorQueryClientRect('#swiper')
        const dom2 = await selectorQueryClientRect('#auction')
        const currentHeight = dom.height - dom2.height
        setHeight(currentHeight)
      } else {
        auctionRef.current && setHeight(swiperRef.current.clientHeight - auctionRef.current.clientHeight)
      }
      // h5?????????????????????
    })

  }, [])
  const onCollect = async () => {
    // ??????
    if (hasCollect === 1) {
      const result = await api2324({ productId: goodsDetail?.uuid || '' })
      result && setHasCollect(0)
      Taro.showToast({ title: '?????????', icon: 'none' })
    } else {
      const result = await api2316({ productId: goodsDetail?.uuid || '' })
      result && setHasCollect(1)
      Taro.showToast({ title: '?????????', icon: 'none' })
    }

  }
  //????????????????????????
  const btnClick = useCallback(
    (data) => {
      if (data.type === 6) {
        setPayVisible(true)
      } else {
        setPopUpInfo({
          title: data.title,
          type: data.type
        })
        setRulesVisible(true)
      }
    },
    [],
  )

  // ????????????
  const closePopUp = () => {
    // ??????popup
    setRulesVisible(false)
    // setTimeout(() => {
    // ????????????

  }

  useEffect(() => {
    if (rulesVisible === false) {
      setTimeout(() => {
        setPopUpInfo({
          title: '',
          type: 0
        })
        // }, 1000);
        document.documentElement.style.overflow = 'auto';
      }, 301);
    }
  }, [rulesVisible])
  const goStore = () => {

    Taro.navigateTo({
      url: `/pages/store/index?merchantId=${goodsDetail?.merchantId}`
    })
  }

  //??????
  const biddingPrice = useCallback(async (value) => {
    setPriceUpdate(false)
    const result = await api2380({
      auctionPrice: value,
      productId: goodsDetail?.uuid
    })


    closePopUp()
    Taro.showToast({ title: '?????????', icon: 'none' })
    getRecordList()
    const auctionForm = await api2906({ uuid: goodsDetail?.uuid })
    setAuctionInfo(auctionForm)
    setPriceUpdate(true)

  }, [goodsDetail])


  // ??????????????????f
  const seeMore = useCallback((type) => {

    switch (type) {
      case 1:
        setPopUpInfo({
          title: '????????????',
          type: 1
        })
        setTimeout(() => {
          setRulesVisible(true)
        }, 500);
        break;
      case 2:
        setPopUpInfo({
          title: '????????????',
          type: 2
        })
        setRulesVisible(true)
        break;

      case 3:
        setPopUpInfo({
          title: '????????????',
          type: 3
        })
        setRulesVisible(true)
        break;
      default:
        break;
    }


  }, [])

  // const dealName = (name: string) => {
  //   if (name && name.length > 5) {
  //     return name.toString().substring(0, 5) + '...'
  //   } else {
  //     return name
  //   }
  // }


  const canvasJson = useMemo(
    () => {
      console.log(goodsDetail, storeInfo, userInfo, auctionInfo, shareImg, 1111);

      return {
        width: 520,
        height: 924,
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
            src: storeInfo?.shopLogo
          },
          {
            type: 'text',
            value: dealName(goodsDetail?.name, 10),
            left: 118,
            top: 91,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 30,
            color: '#333'
          },
          {
            type: 'text',
            value: '????????? ??',
            font: 20,
            color: '#AA1612',
            verticalAlign: 'middle',
            textAlign: 'left',
            left: 118,
            top: 135,
            otherSide: goodsDetail?.productType === 1
          },
          {
            type: 'text',
            value: '??',
            font: 20,
            color: '#AA1612',
            verticalAlign: 'middle',
            textAlign: 'left',
            left: 118,
            top: 135,
            otherSide: goodsDetail?.productType !== 1
          },
          {
            type: 'text',
            value: `${goodsDetail?.productType === 1 ? fen2yuan(auctionInfo?.lastAucPrice) : fen2yuan(goodsDetail?.price)}`,
            font: 34,
            color: '#AA1612',
            verticalAlign: 'middle',
            textAlign: 'left',
            left: goodsDetail?.productType === 1 ? 202 : 134,
            top: 129
          },
          {
            type: 'img',
            left: 32,
            radius: 8,
            top: 162,
            width: 456,
            height: 456,
            src: goodsDetail?.icon
            // src: goodsDetail?.icon
          },
          {
            type: 'img',
            left: 32,
            radius: 8,
            top: 630,
            width: 140,
            height: 140,
            src: goodsDetail?.albumPics?.split(',')[0]
          },
          {
            type: 'img',
            left: 190,
            radius: 8,
            top: 630,
            width: 140,
            height: 140,
            src: goodsDetail?.albumPics?.split(',')[1]
          },
          {
            type: 'img',
            left: 348,
            radius: 8,
            top: 630,
            width: 140,
            height: 140,
            src: goodsDetail?.albumPics?.split(',')[2]
          },
          {
            type: 'img',
            left: 32,
            radius: 8,
            top: 788,
            width: 112,
            height: 112,
            src: shareImg
          },
          {
            type: 'text',
            value: dealName(storeInfo?.shopName, 5) + '????????????',
            left: 158,
            top: 827,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 30,
            color: '#333',
            otherSide: goodsDetail?.ownState === 1
          },
          {
            type: 'text',
            value: dealName(userInfo?.nickName, 5) + '????????????',
            left: 158,
            top: 827,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 30,
            color: '#333',
            otherSide: goodsDetail?.ownState !== 1
          },
          {
            type: 'text',
            value: '???????????????????????????',
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
            otherSide: goodsDetail?.productType === 1
          },
          {
            type: 'text',
            value: `${dayjs(auctionInfo?.endTime).format('MM-DD HH:mm:ss')}??????`,
            font: 24,
            color: '#fff',
            verticalAlign: 'middle',
            textAlign: 'left',
            left: 247,
            top: 595,
            otherSide: goodsDetail?.productType === 1
          },
          {
            type: 'text',
            value: `${auctionInfo?.status === 0 ? '????????????' : '????????????'}`,
            font: 24,
            color: '#fff',
            verticalAlign: 'middle',
            textAlign: 'left',
            left: 78,
            top: 595,
            otherSide: goodsDetail?.productType === 1
          },
          {
            type: 'img',
            left: 44,
            top: 582,
            width: 26,
            height: 26,
            src: jp,
            otherSide: goodsDetail?.productType === 1
          },
        ]
      }
    },
    [goodsDetail, storeInfo, userInfo, auctionInfo, shareImg],
  )

  //???????????????
  //????????????
  const openCanvas = useCallback(async () => {
    getUserInfo().then(async (userInfo) => {
      setCanvasVisible(true)
      setUserInfo(userInfo)
      const data = await api3560({ targetId: page.router?.params.productId, shareType: 3, customParam: activityId ? `?activityId=${activityId}` : '' })
      setshareImg(data?.qrCodeUrl)
      cacheImg(data?.qrCodeUrl)
      setShareLink(data?.shareUrl)
      canvasContext.current.startDraw()
    }).catch(err => {
      if (err.code === 1000 || err.code === 1010) {
        loginCertify()
      }
    })
  }, [goodsDetail, storeInfo, userInfo, auctionInfo, shareImg])



  // ????????????
  const onUpdate = () => {
    dataInit()
  }

  // ??????
  const back = useCallback(() => {
    Taro.navigateBack()
  }, [])

  // ?????????
  const goHome = useCallback(() => {
    BwTaro.navigateTo({
      url: '/pages/index/index'
    })
  }, [])

  // ???????????????
  const goEvaluate = () => {
    Taro.navigateTo({
      url: `/pages/store/storeInfo/index?merchantId=${goodsDetail?.merchantId}&tabValue=2`
    })
  }

  const payFee = (payType) => {
    const service = () => api2978({
      productId: goodsDetail?.uuid,
      payType
    })
    return paySdk(service, payType).then(res => {
      setPayVisible(false)
      Taro.showToast({ title: '??????????????????' })
      btnClick({ type: 4, title: '?????????' })
    })
  }

  const goReport = () => {
    Taro.navigateTo({
      url: `/pages/other/goodsReport/index?productId=${goodsDetail?.uuid}`
    })
  }

  //????????????
  const Swiper = useMemo(() => {
    return <div id='swiper' ref={swiperRef}><BwSwiper mode='aspectFill' goodsType={goodsDetail?.productType} type='goodsDetail' videoLink={goodsDetail?.videoLinks} list={goodsDetail?.albumPics ? goodsDetail?.albumPics?.split(',') : []}></BwSwiper></div>
  }, [goodsDetail])

  const ReportBtn = LoginWrapperBtn((aProps) => <View className='GoodsDetail-banner-report' onClick={aProps.onClick}>
    <Image className='GoodsDetail-banner-report-img' src={report}></Image>
    <Text className='GoodsDetail-banner-report-text'>??????</Text>
  </View>)

  return (
    <ScrollView
      className='goods-scrollview'
      scrollY
      scrollWithAnimation
      lowerThreshold={50}
      onScroll={onScroll}
      onScrollToLower={loadMore}
    >
      {!compelete && process.env.TARO_ENV === 'weapp' && <PreLoadingBOx />}
      {/* <PreLoading visible={true}></PreLoading> */}
      <NavigationBar
        title={goodsDetail?.name}
        background={'#ffffff'}
        leftBtn={<BackAndHomeBtn />}
      />
      <div className='GoodsDetail' style={{ opacity: !compelete && 0 }}>
        <Popup visible={rulesVisible} title={popUpInfo.title} onVisibleChange={closePopUp} className={popUpInfo.type === 4 ? 'goodsPop' : ''} headerType='close'>
          {popUpInfo.type === 1 && <AuctionRecordList onClose={closePopUp} />}
          {popUpInfo.type === 2 && <AuctionRules onClose={closePopUp} />}
          {popUpInfo.type === 3 && <EarnestRules onClose={closePopUp} />}
          {popUpInfo.type === 4 && <Bidding uuid={goodsDetail?.uuid} onPay={biddingPrice} />}
          {popUpInfo.type === 5 && <ShoppingCar onClose={closePopUp} {...goodsDetail} activityId={activityId} />}
        </Popup>
        <PayFeePopup disableYUEPay feeType='deposit' headerType='close' visible={payVisible} onVisibleChange={() => { setPayVisible(false) }} onSubmit={payFee}
          fee={auctionInfo?.margin} />
        {/* <img src={back} onClick={back} alt="" /> */}
        {process.env.TARO_ENV !== 'weapp' && <div className='GoodsDetail-back'>
          <span onClick={back}>
            <i className='myIcon'>&#xe707;</i>
          </span>
          <span>???</span>
          <span onClick={goHome}>
            <i className='myIcon'>&#xe756;</i>
          </span>
        </div>}
        <div className='GoodsDetail-banner'>
          {Swiper}
          <ReportBtn onClick={goReport} />
        </div>
        {goodsDetail?.productType === 1 && <StickBox position={position} id={'auction'}>
          <div className='GoodsDetail-auction' id='auction' ref={auctionRef}>
            {auctionInfo?.endTime ? <Auction onUpdate={() => { getAuctionInfo(goodsDetail?.uuid) }} position={position} endTime={auctionInfo?.endTime} delayState={auctionInfo?.delayState} status={auctionInfo?.status}></Auction> : null}
          </div>
        </StickBox>}
        <div className='GoodsDetail-header'>
          <div className='GoodsDetail-header-price'>
            <div>
              <span className='fz24'>{!!goodsDetail?.productType && (auctionInfo?.status === 0 ? '?????????' : '?????????')}</span><span className='fz24 fw600 ml16'>??</span><span className='fw600'>{goodsDetail?.productType === 1 ? fen2yuan(auctionInfo?.lastAucPrice) : fen2yuan(goodsDetail?.price)}</span>
              {!goodsDetail?.productType && !goodsDetail?.actInfo?.actPrice && <span className='GoodsDetail-header-price-originalPrice'>?? {fen2yuan(goodsDetail?.originalPrice)}</span>}
              {goodsDetail?.actInfo?.actPrice && <View className='GoodsDetail-header-price-actPrice'><Text className='content'><Text className='small'>????????? ??</Text> <Text className='big'>{fen2yuan(goodsDetail?.actInfo?.actPrice)}</Text></Text></View>}
              {goodsDetail?.sDistPercent && goodsDetail?.ownState !== 1 && userType !== 'buyer' && goodsDetail?.sDistPercent !== 0 && goodsDetail?.sDistPercent && <div className='GoodsDetail-header-price-earn'>
                <img className='GoodsDetail-header-price-earn-img' src={EARN} alt="" />
                {goodsDetail.productType === 1 ? <span className='GoodsDetail-header-price-earn-num'>{goodsDetail?.sDistPercent}%</span> :
                  <span className='GoodsDetail-header-price-earn-num'>{fen2yuan(goodsDetail?.sDistPercent * goodsDetail.price / 100)}</span>}
              </div>}
            </div>
            {(goodsDetail?.productType !== 1 && goodsDetail?.totalSales > 0) ? <span className='GoodsDetail-header-price-xl'>?????? {numCount(goodsDetail?.totalSales)}</span> : <div className='GoodsDetail-header-info-sc pt16' onClick={onCollect}>
              <img src={hasCollect === 0 ? shoucang0 : shoucang1} alt="" />
              <p>{hasCollect === 0 ? '??????' : '?????????'}</p>
            </div>}

          </div>
          <div className='GoodsDetail-header-info'>
            <span className='GoodsDetail-header-info-name'>{goodsDetail?.name}</span>
            {(goodsDetail?.productType !== 1 && goodsDetail?.totalSales > 0) && <div className='GoodsDetail-header-info-sc' onClick={onCollect}>
              <img src={hasCollect === 0 ? shoucang0 : shoucang1} alt="" />
              <p>{hasCollect === 0 ? '??????' : '?????????'}</p>
            </div>}
          </div>

          <CouponList className='mb12'></CouponList>

          {(goodsDetail?.serviceIds || goodsDetail?.freightPrice === 0) && <div>
            <div className='GoodsDetail-header-line'></div>
            <div className='GoodsDetail-header-labels'>
              {
                serviceConfig && serviceConfig.length > 0 && serviceConfig.map(item => {
                  return <Label background='#fff' key={item.id} label={item.name} src={rz} />
                })
              }
            </div></div>}
        </div>
        {goodsDetail?.productType === 1 && <div className='GoodsDetail-auctionIntroduce'>
          <ListItem type={1} left={<span className='GoodsDetail-title'>????????????</span>} right={<span className='goodsTips' onClick={seeMore.bind(this, 2)}>??????</span>} style={{ border: 'none' }}></ListItem>
          <div className='GoodsDetail-auctionIntroduce-item'>
            <p className='GoodsDetail-auctionIntroduce-item-p w390'>
              <span className='GoodsDetail-auctionIntroduce-item-p-w'>?????????</span>
              <span className='GoodsDetail-auctionIntroduce-item-p-q'> ?? {fen2yuan(auctionInfo?.initPrice)}</span>
            </p>
            <p className='GoodsDetail-auctionIntroduce-item-p'>
              <span className='GoodsDetail-auctionIntroduce-item-p-w'>????????????</span>
              <span className='GoodsDetail-auctionIntroduce-item-p-q'> ?? {fen2yuan(auctionInfo?.markUp)}</span>
            </p>
            <p className='GoodsDetail-auctionIntroduce-item-p w390'>
              <span className='GoodsDetail-auctionIntroduce-item-p-w'>?????????</span>
              <span className='GoodsDetail-auctionIntroduce-item-p-q'> ?? {fen2yuan(auctionInfo?.margin)}</span>
            </p>
            <p className='GoodsDetail-auctionIntroduce-item-p'>
              <span className='GoodsDetail-auctionIntroduce-item-p-w'>????????????</span>
              <span className='GoodsDetail-auctionIntroduce-item-p-q'>{auctionInfo?.delayState === 1 ? '5??????/???' : '?????????'}</span>
              <img src={wenhao} className='GoodsDetail-auctionIntroduce-item-p-img' onClick={() => { setShowMoadl(true) }} alt="" />
            </p>
          </div>
          {/* <div className='GoodsDetail-auctionIntroduce-list'>
            <div className='GoodsDetail-auctionIntroduce-list-item'>
              <img src={chujia} alt="" />
              <p>????????????</p>
            </div>
            <img src={next} className='GoodsDetail-auctionIntroduce-list-next' alt="" />
            <div className='GoodsDetail-auctionIntroduce-list-item'>
              <img src={lingx} alt="" />
              <p>????????????</p>
            </div>
            <img src={next} className='GoodsDetail-auctionIntroduce-list-next' alt="" />
            <div className='GoodsDetail-auctionIntroduce-list-item'>
              <img src={zhif} alt="" />
              <p>????????????</p>
            </div>
            <img src={next} className='GoodsDetail-auctionIntroduce-list-next' alt="" />
            <div className='GoodsDetail-auctionIntroduce-list-item'>
              <img src={shangp} alt="" />
              <p>????????????</p>
            </div>
          </div> */}
        </div>}
        {goodsDetail?.productType === 1 && <div className='GoodsDetail-auctionList'>
          <ListItem type={1} left={<span className='GoodsDetail-title'>????????????({auctionRecordList?.total})</span>} right={<div className='GoodsDetail-auctionList-btn' onClick={updateAuction}><i className={recordUdate ? 'myIcon rotate' : 'myIcon'}>&#xe700;</i><span>????????????</span></div>} icon={null} style={{ border: 'none' }}></ListItem>
          {auctionRecordList?.data && auctionRecordList?.data.length > 0 ? <div className='GoodsDetail-auctionList-content'>
            {
              auctionRecordList?.data.map((item, index) => {
                return <AuctionList key={`auction${index}`} {...item}></AuctionList>
              })
            }
            <div className='GoodsDetail-auctionList-more' onClick={seeMore.bind(this, 1)}>?????????????????? &gt;</div>
          </div> : <div className='GoodsDetail-auctionList-empty'>??????????????????</div>}
        </div>}
        <div className='GoodsDetail-signboard' onClick={goStore.bind(this, storeInfo?.merchantNo)}>
          <StoreHeader data={storeInfo} type={1}>
            <p className='GoodsDetail-signboard-btn'>????????????</p>
          </StoreHeader>
          <div className='padding32'>
            <StoreDetail productNum={storeInfo?.productNum} fansNum={storeInfo?.fansNum} marginShopAmount={storeInfo?.marginShopAmount}></StoreDetail>
          </div>
        </div>
        {storeInfo?.comments?.totalNum && storeInfo?.comments?.totalNum > 0 && <div className='GoodsDetail-evaluate' onClick={goEvaluate}>
          <ListItem left={<div className='GoodsDetail-evaluate-title'>
            <span className='GoodsDetail-evaluate-title-left'>????????????({storeInfo?.comments?.totalNum})</span>
          </div>} right={<div><Text className='GoodsDetail-evaluate-title-right'>{storeInfo?.comments?.goodRate}%</Text><Text className='goodsTips'>?????????</Text></div>} />
          <Evaluate data={evalusteData}></Evaluate>
        </div>}
        <div className='GoodsDetail-detail'>
          <ListItem type={1} className='GoodsDetail-detail-title' left={<span className='GoodsDetail-title'>{goodsDetail?.productType === 1 ? '????????????' : '????????????'}</span>} icon={null}></ListItem>
          <div className='GoodsDetail-detail-content'>
            <div className='GoodsDetail-detail-content-text'>
              <RichText className='copy' nodes={detail}></RichText>
            </div>
            {
              goodsDetail?.productType === 0 && goodsDetail?.albumPics && detailImgList?.map((item, index) => {
                return <PreImage className='preImg' mode='widthFix' style={{ height: item.height + 'px' || '100%' }} key={`detail${index}`} src={item.img} />
              })
            }
          </div>
        </div>
        <div className='GoodsDetail-stores'>
          <p className='GoodsDetail-stores-title'>????????????</p>
          <Commodity data={data?.list}></Commodity>
          {
            listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
          }
        </div>
        {
          canvasVisible && <Poster
            width={520}
            height={924}
            ref={canvasContext}
            shareImg={shareImg}
            shareLink={shareLink}
            json={canvasJson}
            visible={canvasVisible} onClose={onCloseCanvas} />
        }
        <SubmitButton
          onClick={btnClick}
          onUpdate={onUpdate}
          updateAuction={updateAuction}
          priceUpdate={priceUpdate}
          goodsDetail={goodsDetail}
          productType={goodsDetail?.productType}
          ownState={goodsDetail?.ownState}
          sDistPercent={goodsDetail?.sDistPercent}
          stock={goodsDetail?.stock}
          auctionInfo={auctionInfo}
          publishStatus={goodsDetail?.publishStatus}
          openShare={openCanvas} />
      </div >
      <div className='poster-share' onClick={openCanvas}>
        <img className='poster-share-img' src={weixin} alt="" />
      </div>

      <BwModal type='alert' title='??????????????????' visible={showMoadl} alertText='?????????' content={<span>????????????5????????????????????????????????????????????????5?????????</span>} onClose={() => { setShowMoadl(false) }} ></BwModal>
    </ScrollView >


  );
}

export default GoodsDetail

