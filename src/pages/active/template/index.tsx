

import { View, Text, Image, ScrollView } from "@tarojs/components";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import api4268, { IResapi4268 } from '@/apis/21/api4268'; //  配置信息
import api3554 from "@/apis/21/api3554";
import api3482, { IResapi3482 } from "@/apis/21/api3482";
import api3560 from "@/apis/21/api3560";
import api4798, { IResapi4798, req4798Config } from "@/apis/21/api4798";
import api4864, { IResapi4864 } from "@/apis/21/api4864";
import { XImage } from "@/components/PreImage";
import compose, { formatMoeny, fen2yuan, yuan2fen, deepClone, dealName, loginCertify } from "@/utils/base";
import { useRequest, useDebounceFn } from 'ahooks'
import { useAsync } from "@/utils/hooks";
import { weixin } from '@/constants/images';
import ActiveCanvasPhoto from "@/components/CanvasPhoto";
import FloatBtn from "../components/FloatBtn";
import SingleRow from "./components/SingleRow";
import DoubleRow from "./components/DoubleRow";
import { active_bottom } from "@/constants/images";
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import NavigationBar, { SingleBackBtn, BackAndHomeBtn } from "@/components/NavigationBar"
import { cachedWxConfig, useWeappUrlChannelHook } from "@/utils/hooks";
import { parseOssImageInfo } from "@/components/Upload/oss";
import { DEVICE_NAME, isAppWebview, MINI_PROGRAM_TYPE, ACTIVITY_COUPONS_STATUS } from "@/constants";
import { host } from "@/service/http";
import LiveListItem from './components/LiveListItem';
import api2100, { IResapi2100 } from "@/apis/21/api2100";
import api4882 from "@/apis/21/api4882";
import Big from "big.js";


import WeappLogin from "@/components/WxComponents/WeappLogin";
import Item from "./components/StoreItem";
import api4880, { IResapi4880 } from "@/apis/21/api4880";
import { getUserInfo } from "@/utils/cachedService";
import Poster from "@/components/Poster";
import Coupons from "../components/Coupons";
import './index.scss'

import api4654 from "@/apis/21/api4654";
import { sendCustomEvent } from "@/utils/uma";
type ICouponsData = Required<IResapi4880>['data']
type ICouponsDataItem = Required<IResapi4880>['data'][0]
type IUserInfo = Required<IResapi2100>['data']
type IActiveDetail = Required<IResapi4268>['data']
type IData = Required<IResapi3482>['data']['data']
type IItem = Required<Required<IResapi4798>['data']>['data'][0]

interface IPageSchema {
  backgroundColor: string;
  _themeImage: string;
  _layout: 1 | 2,

}
interface IShareData {
  title: string | undefined,
  desc: string | undefined,
  link: string | undefined,
  imgUrl: string | undefined,

}



function Template() {
  /**
   * activityId :活动ID
   * isShare?: true|false 是否是分享
   * type?: 0=goods商品模板| 1=store 店铺专题  2 直播间列表 模板类型 默认 0 
   * 
   */
  const { activityId = '', isShare = false, _type = "0" } = useMemo(() => Taro.getCurrentInstance().router?.params, [])
  const [pageSchema, setPageSchema] = useState<IPageSchema>()
  const [couponsData, setCouponsData] = useState<ICouponsData>([])
  const [canvasVisible, setCanvasVisible] = useState<Boolean>(false)
  const [shareData, setShareData] = useState<IShareData>()
  const [activeDetail, setActiveDetail] = useState<IActiveDetail>()
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  // const [headImageHight, setHeadImageHight] = useState<number | undefined>()
  const [shareInfo, setShareInfo] = useState()
  const posterRef = useRef()
  const sharePromise = useRef(undefined)
  const couponsRef = useRef(undefined)
  const runAuthRef = useRef(undefined)
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const timerRef = useRef(undefined)
  const [scrollTop, setScrollTop] = useState<number>(0)
  useEffect(() => {
    (async () => {
      getCouponsList()
      const fn = async () => {
        const configRes = await api4268({ uuid: activityId })
        const shareRes = await api3554({ shareType: 7, targetId: activityId, customParam: `?_type=${_type}` })
        return {
          configRes,
          shareRes,
          title: configRes?.shareTitle,
          desc: configRes?.shareSubTitle,
          link: shareRes?.shareUrl,
          imgUrl: configRes?.icon
        }
      }

      sharePromise.current = fn()
      const { shareRes, configRes } = await sharePromise.current
      setShareInfo(Object.assign({}, { ...shareRes }, { ...configRes },))

      setActiveDetail(configRes)
      console.log(JSON.parse(configRes?.templateStr, 'JSON.parse(configRes?.templateStr'))

      setPageSchema(JSON.parse(configRes?.templateStr as string))
      const shareDataObj = {
        title: configRes?.shareTitle,
        desc: configRes?.shareSubTitle,
        link: shareRes?.shareUrl,
        imgUrl: configRes?.icon
      }
      setShareData(shareDataObj)
      console.log('shareDataObj', shareDataObj);

      cachedWxConfig().then(wx => {
        wx?.updateAppMessageShareData(shareDataObj)
        wx?.onMenuShareTimeline(shareDataObj)
      })

    })()
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])
  const getCouponsList = async () => {
    const couponsRes = await api4880({ activityId: activityId })
    setCouponsData(couponsRes)
  }
  useShareAppMessage(async () => {
    const res = await sharePromise.current
    console.log(res, 'res');
    return {
      title: res?.title,
      path: res?.link?.replace(host, ''),
      imageUrl: res?.imgUrl,
    }
  })

  useShareTimeline(() => {
    return {
      title: shareInfo?.shareTitle,
      path: shareInfo?.shareUrl?.replace(host, ''),
      imageUrl: shareInfo?.icon,
    }
  })

  const headImageHight = useMemo(() => {
    if (pageSchema) {
      const SystemInfo = Taro.getSystemInfoSync()
      const { windowWidth } = SystemInfo
      const { height, width } = parseOssImageInfo(pageSchema?._themeImage)
      const proportion = (windowWidth / width).toFixed(2)
      return height * Number(proportion)
    }
  }, [pageSchema])

  useWeappUrlChannelHook()

  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    //  后端担心 并发过大 限制分页数量最大10 
    const pageSizeObj = {
      '0': 20,
      '1': 8,
      '2': 10,
    }
    const pageSize = pageSizeObj[_type]
    // const fn = _type === '0' ? api3482 : api4798
    const fn = {
      '0': api3482,
      '1': api4798,
      '2': api4864
    }

    const res = await fn[_type]({
      pageNo,
      pageSize,
      activityId: activityId
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

  const { run: toGoodsDetail } = useDebounceFn((productId) => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        "openNativePage",
        JSON.stringify({ page: '/product/detail', params: { productId: productId, activityId: activityId } })
      )
    }
    if (!isAppWebview) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${productId}&activityId=${activityId}`
      })
    }
  }, { wait: 200 })

  const openCanvas = async () => {


    getUserInfo().then(async (res) => {
      const dataRes = await api3560({ shareType: 7, targetId: activityId, customParam: `?_type=${_type}` })
      setshareImg(dataRes?.qrCodeUrl)
      setShareLink(dataRes?.shareUrl)
      setUserInfo(res)
      setCanvasVisible(true)
      console.log(posterRef, 'posterRef');

      posterRef.current.startDraw()
    }).catch(err => {
      if (err.code === 1000 || err.code === 1010) {
        loginCertify()
      }
    })
  }


  const canvasJsonStore = useMemo(
    () => {
      return {
        width: 520,
        height: 924,
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
            src: activeDetail?.sharePosters

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
            value: `${userInfo?.nickName}为你推荐`,
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
    }, [shareInfo, userInfo, activeDetail, shareImg])

  const canvasJsonGoods = useMemo(() => {
    return {
      width: 522,
      height: 775,
      children: [
        {
          type: 'img',
          left: 0,
          top: 0,
          radius: 0,
          width: 522,
          height: 632,
          src: activeDetail?.sharePosters

        },
        {
          type: 'img',
          left: 0,
          top: 632,
          radius: 0,
          width: 522,
          height: 143,
          src: active_bottom,
        },
        {
          type: 'img',
          left: 430,
          top: 657,
          radius: 0,
          width: 70,
          height: 70,
          src: shareImg,
        },
        {
          type: 'circleImg',
          left: 24,
          top: 655,
          radius: 24,
          src: userInfo?.headImg,
        },
        {
          type: 'text',
          value: `${dealName(userInfo?.nickName, 8)}`,
          left: 85,
          top: 665,
          length: 150,
          verticalAlign: 'middle',
          textAlign: 'left',
          font: 22,
          color: '#8B572A'
        },
        {
          type: 'text',
          value: '分享给你',
          left: 80,
          top: 700,
          length: 150,
          verticalAlign: 'middle',
          textAlign: 'left',
          font: 22,
          color: '#8B572A'
        },
      ]
    }
  }, [activeDetail, userInfo, shareImg])


  const radiusClass = useMemo(() => {
    if (_type === '0' || _type === '2') {
      return 'bw-active-template-headImg'
    }
    if (_type === '1') {
      return 'bw-active-template-headImgRadius'
    }
  }, [_type])

  const { run: toRoomDetail } = useDebounceFn((roomId, recordId) => {
    // 需要直接打开 小程序的看 播端  
    if (isAppWebview) {
      const params = {
        userName: WEAPP_GH_ID,
        path: `/pages/live/room/index?roomId=${roomId}`,
        miniprogramType: API_ENV === 'prod' ? MINI_PROGRAM_TYPE.WXMiniProgramTypeRelease : MINI_PROGRAM_TYPE.WXMiniProgramTypePreview,
      }
      console.log(params);

      WebViewJavascriptBridge.callHandler(
        'callAppOpenMp',
        JSON.stringify(params),
        () => {
          clearTimeout(timerRef.current)
        }
      )

      // 兼容app
      timerRef.current = setTimeout(() => {
        Taro.showToast({
          title: '当前页面暂不支持打开小程序看直播',
          icon: 'none'
        })
      }, 1000)
    }

    if (DEVICE_NAME === 'weapp') {
      Taro.navigateTo({
        url: `/pages/live/room/index?roomId=${roomId}`
      })
    }
    if (DEVICE_NAME === 'webh5') {
      api4654({
        path: 'pages/live/room/index',
        query: `roomId=${roomId}`
      }).then((res) => {
        console.log(res, 'res');
        window.location.href = res
      })
    }

  }, { wait: 200 })

  const { run: onClick, pending } = useAsync(async (uuid) => {
    const newData = deepClone(couponsData)
    const current = newData?.find((item=> item.uuid === uuid))
    const currentIndex = newData?.findIndex((item=>item.uuid === uuid))
   
    console.log(current, 'current');
    
    if (pending) return;
    try {
      await getUserInfo()
      if (current?.takeState === ACTIVITY_COUPONS_STATUS.notReceive.value) {

        api4882({ couponId: current?.uuid }).then(() => {
          // let current = newData[index]
          // 0 未领取 1 已领取 2 已领完
          
          current.takeState = 1
          newData?.splice(currentIndex, 1, current)
          console.log(newData, 'newData');
          setCouponsData(newData)
          Taro.showToast({title:'领取成功', icon: 'none'})
          couponsRef?.current?.getHeight().then((res => {
            console.log(res?.height, 'height');
            setScrollTop(res?.height + headImageHight + Math.random()*5)

          }))
          // 领用优惠券埋点
          sendCustomEvent('get_coupons', {})

        }).catch(error=>{
                //  优惠券 已领完 修改状态
          if(error?.code === 10000005){
            // 0 未领取 1 已领取 2 已领完
            current.takeState = 2
            newData?.splice(currentIndex, 1, current)
            console.log(newData, 'newData');
            setCouponsData(newData)
          }
        })
      }
      if (current?.takeState === ACTIVITY_COUPONS_STATUS.received.value) {
        console.log(couponsRef, 'couponsRef');
        
        couponsRef?.current?.getHeight().then((res => {
          console.log(res, 'height');
          setScrollTop(res?.height + headImageHight + Math.random()*5)

        }))
           // 使用优惠券埋点
        sendCustomEvent('use_coupons', {})
      }
      if (data?.takeState === ACTIVITY_COUPONS_STATUS.noCoupons.value) {
        Taro.showToast({
          title: '该优惠券已领完',
          icon: 'none'
        })
      }


    } catch (error) {
      if (error?.code === 1000 || error?.code === 1010) {
        if (DEVICE_NAME !== 'weapp') {
          loginCertify()
        } else {
          await runAuthRef.current()
          //  登录成功之后要刷新一下接口
        }
      }
    

    }
  }, { manual: true })
  return (
    <View style={{ backgroundColor: pageSchema?.backgroundColor }}>
      <NavigationBar leftBtn={<BackAndHomeBtn />} background='#ffffff' title={activeDetail?.showName} />
      <ScrollView
        onScrollToLower={loadMore}
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        className={`${DEVICE_NAME === 'weapp' ? 'templateScrollviewWeapp' : 'templateScrollview'}`}
      >
        <View className='bw-active-template' style={{ backgroundColor: pageSchema?.backgroundColor }}>
          <View>
            <Image style={{ height: `${headImageHight}px` }} className={`${radiusClass}`} src={pageSchema?._themeImage as string}></Image>
          </View>
          
          <View className="bw-active-template-coupons">
           {
             couponsData?.length >0 &&  <WeappLogin loginDesc="授权登录后可以领取优惠券" authType="silence" onSuccess={getCouponsList}>
             {
               (userinfo, runAuth, userInfoFething) => {
                 runAuthRef.current = runAuth
                 return <Coupons ref={couponsRef} onClick={onClick} data={couponsData}></Coupons>
               }
             }
           </WeappLogin>
           }

          </View>
          
          
          {_type === '0' &&
            <View className='bw-active-template-list'>
              {
                pageSchema?._layout === 1 && data?.list.map(item => {
                  return <SingleRow key={item.uuid} data={item} toGoodsDetail={toGoodsDetail} />
                })
              }
              {
                pageSchema?._layout === 2 && data?.list.map(item => {
                  return <DoubleRow toGoodsDetail={toGoodsDetail} data={item} key={item.uuid} />
                })
              }
            </View>
          }
          {
            _type === '1' && <View className='selectGoodsShop-store'>
              {
                data?.list?.map((item, index) => {
                  return <Item toGoodsDetail={toGoodsDetail} key={index} data={item}></Item>
                })
              }


            </View>
          }
          {
            _type === '2' && <View className='templateLiveListBox'>
              {
                data?.list?.map((item, index) => {
                  return <LiveListItem key={index} toRoomDetail={toRoomDetail} data={item}></LiveListItem>
                })
              }


            </View>
          }
          <View className={`${(_type === '0' || _type === '2') ? '' : 'template-noMore'}`}>
            {
              listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
            }
          </View>

          <View className='poster-share'>
            <Image className='poster-share-img' src={weixin} onClick={openCanvas} />
          </View>

          {isShare && <FloatBtn icon={<Text className='myIcon fz50'>&#xe756;</Text>} />}
          {
            canvasVisible && <Poster
              ref={posterRef}
              visible={canvasVisible}
              onClose={() => setCanvasVisible(false)}
              shareLink={shareLink}
              json={_type === '0' ? canvasJsonGoods : canvasJsonStore}
              shareData={shareData}
              width={520}
              height={_type === '0' ? 775 : 924}
            >
            </Poster>
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default Template