import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import StoreHeader from '../components/store-header'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ListItem from '@/components/ListItem'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import './index.scss'
import api2444 from '@/apis/21/api2444'
import { fen2yuan } from '@/utils/base'
// import api2428 from '@/apis/21/api2428'
// import { getUrl2Address } from '@/utils/base'
// import { getAddressList } from '@/utils/cachedService'
import api2476, { IResapi2476 } from '@/apis/21/api2476'
import CanvasPhoto from '@/components/CanvasPhoto'
import { View } from '@tarojs/components'
import api3560 from '@/apis/21/api3560'
import api2612, { IResapi2612 } from '@/apis/21/api2612'
import { useDidShow } from '@tarojs/runtime'
import { isAppWebview } from '@/constants'
import api3554 from '@/apis/21/api3554'
import { cachedWxConfig } from '@/utils/hooks'
export type IStoreInfo = Required<IResapi2612>['data']
export type ICash = Required<IResapi2476>['data']
import { host } from '@/service/http'
import { initMerchant } from '@/components/CanvasPhoto/components/CanvasInit'

const StoreSetting = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [storeInfo, setStoreInfo] = useState<IStoreInfo>()
  const [cash, setCash] = useState<ICash>()
  const [canvasVisible, setCanvasVisible] = useState<boolean>(false)
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [shareData, setShareData] = useState<any>()
  const shareDetail = useRef(undefined)
  const itemList: {
    mlodule: () => JSX.Element;
    useListItem: boolean;
    right?: Function | undefined;
    handleClick?: Function | undefined;
    icon?: Function | undefined;
    isShow: boolean
  }[] = [
      {
        mlodule: () => {
          return (<View className="storeSetting-header" onClick={goDetail}><StoreHeader data={storeInfo} /></View>)
        },
        useListItem: true,
        isShow: true
      },
      {
        mlodule: () => {
          return (<div className='storeSetting-list'>
            <span className='storeSetting-list-title'>店铺装修</span>
          </div>)
        },
        right: () => {
          return <span className='storeSetting-list-ple' onClick={goFitment}>{'去装修'}</span>
        },
        useListItem: true,
        isShow: true
      },
      {
        mlodule: () => {
          return (<div className='storeSetting-btn'>
            <span className='storeSetting-btn-primary' onClick={goDetail}>进店逛逛</span>
            <span className='storeSetting-btn-check' onClick={openCanvas}>店铺名片</span>
          </div>)
        },
        useListItem: false,
        isShow: true
      },
      {
        mlodule: () => {
          return (<p className='storeSetting-title'>店铺资质</p>)
        },
        useListItem: false,
        isShow: true
      },
      {
        mlodule: () => {
          return (<div className='storeSetting-list'>
            <span className='storeSetting-list-title'>店铺认证</span>
            <span className='storeSetting-list-des'>认证后享6大权益</span>
          </div>)
        },
        right: () => {
          return <span className='authtic'>{storeInfo?.authStatus === 0 ? <span>去认证</span> : storeInfo?.authStatus === 1 ? <span className='bgYellow'>待审核</span> : <span className='bgGray'>已认证</span>}</span>
        },
        icon: () => {
          if (storeInfo?.authStatus === 0) {
            return <i className='myIcon '>&#xe726;</i>
          } else if (storeInfo?.authStatus === 1) {
            return <i className='myIcon op0'>&#xe726;</i>
          } else {
            return <i className='myIcon '>&#xe734;</i>
          }

        },
        handleClick: useCallback(() => {
          if (storeInfo?.authStatus === 0) {
            setOpenSheet(!openSheet)
          }
        }, [storeInfo?.authStatus, openSheet]),
        useListItem: true,
        isShow: true
      }, {
        mlodule: () => {
          return (<div className='storeSetting-list'>
            <span className='storeSetting-list-title'>店铺保证金</span>
            <span className='storeSetting-list-des'>缴纳后增加店铺曝光</span>
          </div>)
        },
        right: () => {
          return <span className='authtic'>{cash?.marginShopAmount === 0 ? '去缴纳' : <span>{fen2yuan(cash?.marginShopAmount)}元</span>}</span>
        },
        handleClick: () => {

          if (storeInfo?.authStatus !== 0) {
            Taro.navigateTo({
              url: '/pages/merchant/earnestMoney/index'
            })
          }
        },
        useListItem: true,
        isShow: storeInfo?.authStatus !== 0
      },

    ]
  // const goAddress = useCallback(() => {
  //   Taro.navigateTo({ url: `/pages/other/address/index?sourceUrl=${encodeURIComponent(page.router?.path)}` })
  // }, [])


  useEffect(() => {
    (async () => {
      if (storeInfo) {
        const shareInfo = await api3554({ targetId: storeInfo?.merchantNo, shareType: 2 })
        //@ts-ignore
        shareDetail.current = new Promise((resolve, reject) => {
          const obj = Object.assign({}, { ...storeInfo }, { ...shareInfo })
          return resolve(obj)
        })
        cachedWxConfig().then(wx => {
          const shareData1 = {
            title: storeInfo?.shopName, // 分享标题
            desc: shareInfo?.subTitle, // 分享描述
            link: shareInfo?.shareUrl, // 分享链接
            imgUrl: storeInfo?.shopLogo, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          }
          setShareData(shareData1)
          wx?.updateAppMessageShareData(shareData1)
          wx?.onMenuShareTimeline(shareData1)
        })
      }
    })()
  }, [storeInfo])

  const openCanvas = async () => {

    const data = await api3560({ targetId: storeInfo?.merchantNo, shareType: 2 })
    setshareImg(data?.qrCodeUrl)
    setShareLink(data?.shareUrl)
    // if (goodsDetail && auctionInfo && storeInfo) {
    // }
    setCanvasVisible(true)
  }

  // 前往认证
  const goApprove = useCallback(() => {
    Taro.navigateTo({ url: '/pages/merchant/storeApprove/index' })
  }, [])

  const goInfo = useCallback(() => {
    setCanvasVisible(true)
    // Taro.navigateTo({ url: `/pages/store/storeInfo/index?merchantId=${storeInfo?.merchantNo}` })
  }, [])
  // 前往装修
  const goFitment = useCallback(() => {
    Taro.navigateTo({ url: '/pages/merchant/storeFitment/index' })
  }, [])
  // 店铺详情
  const goDetail = useCallback(() => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({
          page: '/merchant/home',
          params: { merchantId: storeInfo?.merchantNo },
        })
      )
    } else {

      Taro.navigateTo({ url: `/pages/store/index?merchantId=${storeInfo?.merchantNo}`, })
    }
  }, [storeInfo])

  const onClose = useCallback(() => {
    setCanvasVisible(false)
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

  useDidShow(() => {
    (async () => {
      const data = await api2612()
      setStoreInfo(data)
      const cashData = await api2476()
      setCash(cashData)
      // if (page.router?.params.addressNo) {
      //   const result = await getAddressList()
      //   const data = result?.filter(item => item.addressNo === page.router?.params.addressNo)[0]
      //   if (data) {
      //     const result2 = await api2428(data)
      //     setAddress(`${data?.province} - ${data?.city} - ${data?.district}-${data?.detailAddress}`)
      //   }
      // }
    })()
  })

  return (
    <div className='storeSetting'>

      {
        itemList.map((item, index) => {
          return item.isShow && <div key={index} > {item.useListItem ? <ListItem handleClick={item.handleClick} left={item.mlodule()} right={item.right ? item.right() : null} icon={item.icon && item.icon()} /> : item.mlodule()}</div>

        })
      }
      <AtActionSheet isOpened={openSheet} cancelText='取消' onClose={setOpenSheet.bind(this, false)}>
        <AtActionSheetItem onClick={goApprove}>
          <span className='color333 fz32'>个人认证</span>
        </AtActionSheetItem>
        <AtActionSheetItem>
          <span className='color333 fz32'>企业认证</span>
          <span className='color999 fz32'>（敬请期待）</span>
        </AtActionSheetItem>
      </AtActionSheet>
      {/* <CanvasPhoto storeInfo={storeInfo} visible={canvasVisible} onClose={onClose}></CanvasPhoto> */}
      {canvasVisible && storeInfo && shareImg && shareData && <CanvasPhoto
        type='merchant'
        storeInfo={storeInfo}
        shareData={shareData}
        shareImg={shareImg}
        shareLink={shareLink}
        init={initMerchant}
        size={{ width: 520, height: 878 }}
        visible={canvasVisible} onClose={onClose}
      />}
    </div >
  )
}

export default StoreSetting
