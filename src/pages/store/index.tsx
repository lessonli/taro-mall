import Taro, { useReady, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { ScrollView, View, Image } from '@tarojs/components'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { dealName, deepClone, fen2yuan, getCacheImg, cacheImg, loginCertify, selectorQueryClientRect } from '@/utils/base'
import Tabs from '@/components/Tabs'
import StoreDetail from './components/stroe-detail'
import Commodity from '@/components/CommodityModule'
import CanvasPhoto from '@/components/CanvasPhoto'
import StickBox, { useStick } from '@/components/StickBox'
import Attention from '@/components/Attention'
import Label from '@/components/Label'
import * as images from '@/constants/images'
import { useRequest } from 'ahooks'
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView"
import api3404, { IResapi3404 } from '@/apis/21/api3404'
import api2604 from '@/apis/21/api2604'
import api2612, { IResapi2612 } from '@/apis/21/api2612'
import { cachedWxConfig, getWxConfig, useUserTypeHook, useWeappUrlChannelHook } from '@/utils/hooks'
import SortTab from '@/components/SortTab'
import './index.scss'
import { getStatus, getUserInfo } from '@/utils/cachedService'
import TabBar from '@/components/Tab-bar'
import api2884 from '@/apis/21/api2884'
import api2892 from '@/apis/21/api2892'
import Empty from '@/components/Empty'
import api2348 from '@/apis/21/api2348'
import api3560 from '@/apis/21/api3560'
import api3554 from '@/apis/21/api3554'
import NavigationBar from '@/components/NavigationBar'
import { isAppWebview } from '@/constants'
import { host } from '@/service/http'
import { initMerchant } from '@/components/CanvasPhoto/components/CanvasInit'
import StoreLive from './components/storeLive'
import api4618, { IResapi4618 } from '@/apis/21/api4618'
import { WxOpenLaunchWeapp } from '@/components/WxComponents'
import { IHandleCaptureException, Sentry } from '@/sentry.repoter'
import Poster from '@/components/Poster'

import PageScrollView from '@/components/PageScrollView'
import { OneRowDoubleColumnProductItem } from '@/components/ProductItem'
import { useRouter } from '@tarojs/runtime'
import { addImage1, getUserAvatar, preImg } from '@/utils/poster'
import list from '../order/list'
import CouponList from '../goods/components/CouponList'

export type IStoreInfo = Required<IResapi2612>['data']
export type ILiveInfo = Required<IResapi4618>['data']

type IProductItem = Required<Required<IResapi3404>['data']>

const Store = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [position, setPosition] = useState<'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'>('static')
  const [height, setHeight] = useState<number>(0)
  const [canvasVisible, setCanvasVisible] = useState<boolean>(false)
  const [storeInfo, setStoreInfo] = useState<IStoreInfo>()
  const [tabValue, setTabValue] = useState<number>(2)
  const [attention, setAttention] = useState<boolean>(false)
  const [update, setUpdate] = useState<boolean>(true)
  const [plList, setPlList] = useState<any[]>([])
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [shareData, setShareData] = useState<any>()
  const [liveInfo, setLiveInfo] = useState<ILiveInfo>()

  const {userType} = useUserTypeHook()

  const [userInfo, setUserInfo] = useState<any>()
  const [posterList, setPosterList] = useState([])
  const [canShowPoster, setCanShowPoster] = useState<boolean>(true)
  const preImgBox = useRef({})
  const canvasContext = useRef()
  const [sortOption, setSortOption] = useState<{
    label: string;
    value: string;
    asc: boolean;
  }[]>([{
    label: '综合排序',
    value: 'composite',
    asc: false
  }, {
    label: '最新上架',
    value: 'newest',
    asc: false
  }, {
    label: '价格',
    value: 'price',
    asc: true
  }, {
    label: '销量',
    value: 'sales',
    asc: true
  }])
  const [orderItems, setOrderItems] = useState<{
    column?: string | undefined;
    asc?: boolean | undefined;
  }[] | undefined>()
  const shareDetail = useRef(undefined)

  const currentRouter = useRouter()

  useWeappUrlChannelHook()
  // tab 组件传递的数据
  // let wx
  if (process.env.TARO_ENV === 'h5') {
    // wx = require('weixin-js-sdk');
  }
  const { STORE_HEADER, VIP } = images
  const tabOption = {
    options: [
      {
        label: '店铺推荐',
        value: 2
      },
      {
        label: '拍卖',
        value: 1
      },
      {
        label: '一口价',
        value: 0
      }
    ],
    onChange: useCallback((value: number): void => {
      //tab切换之后调用获取商品接口 todo
      setTabValue(value)
      if (value === 0) {
        setSortOption([{
          label: '综合排序',
          value: 'composite',
          asc: false
        }, {
          label: '最新上架',
          value: 'newest',
          asc: false
        }, {
          label: '价格',
          value: 'price',
          asc: true
        }, {
          label: '销量',
          value: 'sales',
          asc: true
        }])
      } else {
        setSortOption([
          {
            label: '综合排序',
            value: 'composite',
            asc: false
          },
          {
            label: '即将截拍',
            value: 'deadline',
            asc: false
          },
          {
            label: '最新上拍',
            value: 'newest',
            asc: false
          },
          {
            label: '0元起拍',
            value: 'zero',
            asc: false
          }
        ])
      }

    }, []),
    value: tabValue,
    style: {
      background: '#f8f8f8',
      'justify-content': 'flex-start'
    }
  }


  const service = useCallback(async (
    result?: { pageNo: number, totalNum: number | undefined, list: IProductItem[] }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = 30

    const merchantId = currentRouter?.params?.merchantId || ''

    let res
    if (tabValue === 2) {
      res = await api2604({
        pageNo,
        pageSize,
        merchantId,
      })
      let list = deepClone(res.data)
      if (res.data.length > 2) {
        setPosterList(list)
      } else if (res.data.length === 2) {
        list.push(res.data[0])
        setPosterList(list)
      } else if (res.data.length === 1) {
        setPosterList([res.data[0], res.data[0], res.data[0]])
      } else if (res.data.length < 1) {
        setCanShowPoster(false)
      }
      list.forEach((item, i) => {
        if (i <= 2) {
          cacheImg(item.icon)
        }
      })
    } else {
      res = await api3404({
        productType: tabValue,
        pageNo,
        pageSize,
        orderItems: orderItems,
        merchantId
      })
    }
    const totalNum = tabValue === 2 ? undefined : res.total

    const currentList = (res.data || []) as IProductItem[]

    return {
      list: (pageNo === 1 ? currentList : result?.list.concat(currentList)),
      currentList,
      total: res?.total,
      totalNum,
      pageNo,
      pageSize,
    }

  }, [tabValue, orderItems])

  const { loading, data, run, reset } = useRequest(service, {
    // loadMore: true,
    debounceInterval: 200,
    manual: true,
    throwOnError: true,
    // isNoMore: d => tabValue === 2 ?
    //   d?.list.length === 0 :
    //   d?.totalNum
  })

  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore: (tabValue === 2 ? data?.currentList?.length === 0 : data?.list?.length >= data?.totalNum) && !loading
  })


  const canvasJson = useMemo(

    () => {
      console.log(storeInfo, userInfo, shareImg, posterList, 111);
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
            top: 0,
            width: 520,
            height: 216,
            radius: 16,
            topRadius: 0,
            src: storeInfo?.backgroundImg
          },
          {
            type: 'fillRadius',
            left: 200,
            color: 'rgba(255, 255, 255, 1)',
            top: 150,
            width: 120,
            radius: 8,
            height: 120
          },
          {
            type: 'img',
            left: 215,
            top: 165,
            width: 90,
            height: 90,
            radius: 8,
            src: storeInfo?.shopLogo
          },
          {
            type: 'text',
            value: dealName(storeInfo?.shopName, 8),
            cut: true,
            font: 30,
            color: '#000',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 260,
            top: 292
          },
          {
            type: 'text',
            value: storeInfo?.productNum,
            font: 28,
            color: '#333',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 100,
            top: 343
          },
          {
            type: 'text',
            value: '上架宝贝',
            font: 20,
            color: '#999',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 100,
            top: 378
          },
          {
            type: 'text',
            value: storeInfo?.fansNum,
            font: 28,
            color: '#333',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 425,
            top: 343
          },
          {
            type: 'text',
            value: '关注粉丝',
            font: 20,
            color: '#999',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 425,
            top: 378
          },
          {
            type: 'text',
            value: fen2yuan(storeInfo?.marginShopAmount),
            font: 28,
            color: '#333',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 260,
            top: 343
          },
          {
            type: 'text',
            value: '店铺保证金',
            font: 20,
            color: '#999',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 260,
            top: 378
          },
          {
            type: 'img',
            left: 32,
            top: 420,
            width: 300,
            radius: 8,
            height: 300,
            src: posterList[0]?.icon
          },
          {
            type: 'text',
            value: posterList[0]?.productType === 1 ? `¥ ${fen2yuan(posterList[0]?.auction?.lastAucPrice)} ` : `¥ ${fen2yuan(posterList[0]?.price)} `,
            font: 20,
            color: '#fff',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 291,
            top: 698
          },
          {
            type: 'img',
            left: 344,
            top: 420,
            width: 144,
            height: 144,
            radius: 8,
            src: posterList[1]?.icon
          },
          {
            type: 'text',
            value: posterList[1]?.productType === 1 ? `¥ ${fen2yuan(posterList[1]?.auction?.lastAucPrice)} ` : `¥ ${fen2yuan(posterList[1]?.price)} `,
            font: 20,
            color: '#fff',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 451,
            top: 542
          },
          {
            type: 'img',
            left: 344,
            top: 576,
            width: 144,
            radius: 8,
            height: 144,
            src: posterList[2]?.icon
          },
          {
            type: 'text',
            value: posterList[2]?.productType === 1 ? `¥ ${fen2yuan(posterList[2]?.auction?.lastAucPrice)} ` : `¥ ${fen2yuan(posterList[2]?.price)} `,
            font: 20,
            color: '#fff',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 451,
            top: 698
          },
          {
            type: 'img',
            left: 32,
            radius: 8,
            top: 744,
            width: 112,
            height: 112,
            src: shareImg
          },
          {
            type: 'text',
            value: dealName(userInfo?.nickName, 5) + '为你推荐',
            left: 160,
            top: 780,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 28,
            color: '#333'
          },
          {
            type: 'text',
            value: '扫码进入购买',
            left: 160,
            top: 820,
            length: 150,
            verticalAlign: 'middle',
            textAlign: 'left',
            font: 24,
            color: '#BD883E'
          },
          {
            type: 'fill',
            left: 0,
            color: 'rgba(249, 249, 249, 1)',
            top: 872,
            width: 520,
            height: 52
          },
          {
            type: 'text',
            value: '博物有道提供技术支持',
            font: 20,
            color: '#999',
            verticalAlign: 'middle',
            textAlign: 'center',
            left: 260,
            top: 898
          },
        ]
      }
    },
    [storeInfo, userInfo, shareImg, posterList],
  )


  useLayoutEffect(() => {
    const merchantId = page?.router?.params?.merchantId
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({
          page: '/merchant/home',
          params: { merchantId: merchantId },
        })
      )
    }


    Taro.nextTick(async () => {
      // 根据id获取店铺详情
      const data = await api2612({ merchantId: merchantId })
      setStoreInfo(data)
      setAttention(data?.followStatus === 1 ? true : false)
      const plList = await api2348({ pageNo: 1, pageSize: 10, merchantId: merchantId })
      setPlList(plList?.data?.filter((item, index) => index < 3))
      setTimeout(async () => {
        const dom = await selectorQueryClientRect('#header')
        setHeight(dom.height)
      }, 10);
      // const result = await getStatus()

      const shareInfo = await api3554({ targetId: merchantId, shareType: 2 })
      //@ts-ignore
      shareDetail.current = new Promise((resolve, reject) => {
        const obj = Object.assign({}, { ...data }, { ...shareInfo })
        return resolve(obj)
      })
      cachedWxConfig().then(wx => {
        const shareData1 = {
          title: data?.shopName, // 分享标题
          desc: shareInfo?.subTitle, // 分享描述
          link: shareInfo?.shareUrl, // 分享链接
          imgUrl: data?.shopLogo, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        }
        setShareData(shareData1)
        wx?.updateAppMessageShareData(shareData1)
        wx?.onMenuShareTimeline(shareData1)
      })
      const liveInfo = await api4618({ merchantId: merchantId })
      setLiveInfo(liveInfo)
      cacheImg([data?.backgroundImg, data?.shopLogo])
      // cacheImg('backgroundImg', data?.backgroundImg, 520)
      // cacheImg('shopLogo', data?.shopLogo, 90)
    })

  }, [])

  useShareAppMessage(async () => {
    const res = await shareDetail.current
    // const data = await cacheShareData()
    // console.log(data, 123123);

    return {
      title: res?.shopName,
      path: res?.shareUrl.replace(host, ''),
      imageUrl: res?.shopLogo
    }
  })

  // weapp分享到朋友圈
  useShareTimeline(() => {
    return {
      title: storeInfo?.shopName,
      path: shareData?.link.replace(host, ''),
      imageUrl: storeInfo?.shopLogo
    }
  })
  const onScroll = (e: Taro.PageScrollObject) => {
    const { scrollTop } = e
    useStick(scrollTop, height, position, setPosition)

    // if (scrollTop > height && position === 'static') {
    //   setPosition('fixed')
    // }
    // if (position === 'fixed' && scrollTop < height) {
    //   setPosition('static')
    // }

  }

  const showPoster = useCallback(async () => {

    if (!canShowPoster) {
      Taro.showToast({
        title: '请先去上架商品',
        icon: 'none'
      })
      return
    }
    getUserInfo().then(async (userInfo) => {
      setCanvasVisible(true)
      setUserInfo(userInfo)
      const data = await api3560({ targetId: storeInfo?.merchantNo, shareType: 2 })
      setshareImg(data?.qrCodeUrl)
      setShareLink(data?.shareUrl)
      cacheImg(data?.qrCodeUrl)
      canvasContext.current.startDraw()
    }).catch(err => {
      if (err.code === 1000 || err.code === 1010) {
        loginCertify()
      }
    })

  }, [storeInfo, userInfo, canShowPoster])


  // 关闭海报
  const onClose = useCallback(() => {
    setshareImg('')
    setShareLink('')
    setCanvasVisible(false)
  }, [])

  const onSortChange = useCallback((value) => {
    setOrderItems(value)
  }, [])

  // 关注
  const getAttention = useCallback(async () => {
    getStatus.reset()
    if (attention) {
      await api2892({ merchantNo: currentRouter?.params.merchantId })
      setAttention(!attention)
    } else {
      await api2884({ merchantNo: currentRouter?.params.merchantId })
      setAttention(!attention)
    }

  }, [attention])

  const goStoreInfo = useCallback((value) => {
    Taro.navigateTo({
      url: `/pages/store/storeInfo/index?merchantId=${currentRouter?.params.merchantId}&tabValue=${value}`
    })
  }, [])

  const back = () => {
    Taro.navigateBack()
  }

  const loadMore = useCallback(() => {
    (!listStatus.empty && !listStatus.noMore) && run(data)
  }, [data, listStatus, tabValue])

  useEffect(() => {
    setUpdate(false)
    const requestData = { ...data, pageNo: 0, totalNum: 0 }
    reset()
    run(requestData).then(res => {
      setUpdate(true)
    })

  }, [tabValue, orderItems])


  return (
    <PageScrollView
      onScrollToLower={loadMore}
      onScroll={onScroll}
    >

      <div>
        <div id='header' className='store-headerBox'>
          {process.env.TARO_ENV === 'h5' && <i className='myIcon back' onClick={back}>&#xe707;</i>}
          {storeInfo?.isOwnShop !== 1 && < Attention className='store-attention' hasAttention={attention} onChange={getAttention} />}
          <img className='store-header' src={STORE_HEADER} />
          <div className='store-info'>
            <img className="store-info-logo" onClick={() => { goStoreInfo(1) }} src={storeInfo?.shopLogo} alt="" />
            <p className='store-info-name'>{storeInfo?.shopName}</p>
            <div className='store-info-tag'>
              <Label src={storeInfo?.authStatus !== 0 ? VIP : images.vip0} label={storeInfo?.authStatus === 0 ? '未认证' : '实名认证'}></Label>
              {/* {storeInfo?.shopAuthTags?.map(item => {
                return <Label src={VIP} key={item} label={SHOP_AUTH_TAGS.get(item).label}></Label>
              })} */}
            </div>
            <StoreDetail
              productNum={storeInfo?.productNum}
              fansNum={storeInfo?.fansNum}
              marginShopAmount={storeInfo?.marginShopAmount}
            />
            {storeInfo?.comments && storeInfo?.comments?.totalNum > 0 && <div className='store-info-pl' onClick={() => { goStoreInfo(2) }}>
              <div className='store-info-pl-left'>
                {
                  plList.map((item, index) => {
                    return <Image className='store-info-pl-left-img' key={index} src={item?.userInfo?.headImg || images.mrtx} />
                  })
                }
              </div>
              <div className='store-info-pl-right'>
                <span className='span1'>{storeInfo?.comments?.totalNum}</span>
                <span className='span2'> 条评价</span>
                <span className='middle'>|</span>
                <span className='span1'>{storeInfo?.comments?.goodRate}%</span>
                <span className='span2'> 好评率</span>
              </div>
            </div>}

            <CouponList className='store-CouponList'></CouponList>
          </div>
          {
            liveInfo && liveInfo.roomId && [1, 2].includes(liveInfo.status) &&
            <WxOpenLaunchWeapp path={`pages/live/room/index?roomId=${liveInfo.roomId}&recordId=${liveInfo.recordId}`}>
              <StoreLive liveInfo={liveInfo}></StoreLive>
            </WxOpenLaunchWeapp>
          }
        </div>
        <StickBox position={position} type='top' id={'stick'}>
          <div id='stick' className='store-sort'>
            <div className='store-sort-tab'>
              <Tabs {...tabOption} composition={2} itemClassName='storeTabs'></Tabs>
            </div>
            {tabValue !== 2 && <SortTab options={sortOption} onChange={onSortChange} />}
          </div>
        </StickBox>
        <div className='store-list p-l-24 p-r-24 p-b-100'>
          {
            data?.list?.map(item => <OneRowDoubleColumnProductItem userType={userType} data={item} key={item.uuid} />)
          }
          {
            listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
          }
          {
            listStatus?.empty && data?.totalNum < 1 && <div className='bw-searchList-empty'><Empty src={images.empty} text={'暂无数据'}></Empty></div>
          }
        </div>
        <div className='poster-share'>
          <img className='poster-share-img' src={images.weixin} onClick={showPoster} alt="" />
        </div>

        {storeInfo && shareImg && <Poster
          ref={canvasContext}
          width={520}
          height={924}
          shareLink={shareLink}
          json={canvasJson}
          visible={canvasVisible} onClose={onClose}
        />}

      </div>
      <TabBar type='store' isOwnShop={storeInfo?.isOwnShop} value={2} />
    </PageScrollView >

  )
}

export default Store
