import Taro from '@tarojs/taro'
import './index.scss'
import { IResapi2124 } from '@/apis/21/api2124'
import { EARN as earn, empty } from "@/constants/images";
import { DEVICE_NAME, SERVICES_TYPE } from '@/constants'
import { useCallback, useState, useEffect, useLayoutEffect, useMemo } from 'react'
import { fen2yuan, getRealSize } from '@/utils/base';
import { parseOssImageInfo } from '../Upload/oss';
import * as image from '@/constants/images'
import { Text, View } from '@tarojs/components';
import Empty from '../Empty';
import Swiper from '../Swiper';
import storge from '@/utils/storge';
import { XImage } from '../PreImage';
import { openAppProdcutDetail } from '@/utils/app.sdk';
import { useUserTypeHook } from '@/utils/hooks'
import qs from 'query-string'
import { getUserInfo } from '@/utils/cachedService';
import { navigationBarInfo } from '../NavigationBar';
import { WxOpenLaunchWeapp } from '../WxComponents';
import WaterfallList, { DESIGN_ITEM_WIDTH } from '../WaterfallList';
import { OneRowDoubleColumnProductItem } from '../ProductItem';

const WATERFALL_ITEM_MAX_HEIGHT = 500

export type IItem = Required<Required<IResapi2124>['data']>['data'][0]
// commodityType 1: 拍卖， 2: 一口价 ， 3: 推荐商品
interface Iprops {
  data: IItem[];
}
const Commodity = (props: Iprops) => {
  const [leftList, setLeftList] = useState([])
  const [rightList, setRightList] = useState([])
  const [leftHeight, setLeftHeight] = useState<number>(0)
  const [rightHeight, setRightHeight] = useState<number>(0)
  const [productList, setProductList] = useState<any>([])
  const [loadList, setloadList] = useState<number[]>([])
  const [placeholder, setPlaceholder] = useState<any>()
  const { data, type, pageNo } = props
  const { userType } = useUserTypeHook()

  const handleClick = useCallback(
    (uuid) => {
      if (DEVICE_NAME === 'iosbwh5' || DEVICE_NAME === 'androidbwh5') {
        openAppProdcutDetail({
          productId: uuid
        })
      } else {
        console.log(Taro.getCurrentInstance());
        if (process.env.TARO_ENV === 'weapp') {
          if (Taro.getCurrentInstance().router.path.indexOf('goodsDetail') > -1) {
            console.log(1);

            Taro.redirectTo({
              url: `/pages/goods/goodsDetail/index?productId=${uuid}`
            })
          } else {
            console.log(2);

            Taro.navigateTo({
              url: `/pages/goods/goodsDetail/index?productId=${uuid}`
            })
          }
        } else {
          Taro.navigateTo({
            url: `/pages/goods/goodsDetail/index?productId=${uuid}`
          })
        }
      }
    },
    [],
  )

  // const dataSource = useMemo(() => {

  // }, [data])

  const dataSource = useMemo(() => {
    const products = data?.map((item, i) => {
      
      if (item.live !== undefined) { // 直播
        const {width, height} = parseOssImageInfo(item.live.coverImg || '')
        const cardHeight = DESIGN_ITEM_WIDTH / (width / height)
        return {
          ...item,
          width: DESIGN_ITEM_WIDTH,
          height: cardHeight > WATERFALL_ITEM_MAX_HEIGHT ? WATERFALL_ITEM_MAX_HEIGHT : cardHeight,
        }
      } else if (item.swiper) {
        return item
      } else {

        const {width, height} = parseOssImageInfo(item.icon)
        /**
         * 商品图高度
         */
        let iconHeight = DESIGN_ITEM_WIDTH / (width / height)
        /**
         * 设计稿 文案高度
         */
        const footerHeight = 130

        const iconMaxHeight = WATERFALL_ITEM_MAX_HEIGHT - footerHeight

        iconHeight = iconHeight > iconMaxHeight ? iconMaxHeight : iconHeight
        return {
          ...item,
          width: DESIGN_ITEM_WIDTH,
          height: iconHeight + footerHeight,
          iconHeight,
        }

      }
    }) || []

    return products
  }, [data])

  const getOnload = (id) => {
    let list = JSON.parse(JSON.stringify(loadList))
    list.push(id)
    setloadList(list)

  }

  const goLive = (item) => {
    Taro.navigateTo({
      url: `/pages/live/room/index?roomId=${item.roomId}&recordId=${item.recordId}`
    })
  }



  const LiveItem = useMemo(() => (item) => {
    return <div className='commodityLive' onClick={() => { goLive(item.live) }}>
      {item.live.status === 2 ? <div className='commodityLive-icon'>
        <div className='commodityLive-icon-live'>
          <span className='line1 line'></span>
          <span className='line2 line'></span>
          <span className='line3 line'></span>
          直播中
        </div>
        <div className='commodityLive-icon-see'>{item.live.viewCount}人观看</div>
      </div> :
        <div className='commodityLive-icon-yuzhan'>
          <img className='commodityLive-icon-yuzhan-img' src={image.yuzhan1} alt="" />
        </div>}

      <XImage mode='widthFix' src={qs.stringifyUrl({ url: item.live.coverImg, query: { 'x-oss-process': 'image/resize,p_50' } })} />
      <div className='commodityLive-cover'>
        <p className='commodityLive-cover-title'>{item.live.title}</p>
        <div className='commodityLive-cover-info'>
          <img className='commodityLive-cover-info-img' src={item.live.headImg} alt="" />
          <span className='commodityLive-cover-info-name'>{item.live.roomName}</span>
        </div>
      </div>
      {/* {!loadList.includes(index) && <div className='commodity-placeholder-box'>
          <img className='img' src={bowu} alt="" />
        </div>}
        <ImageBox className={loadList.includes(index) ? 'commodity-icon' : 'commodity-icon op0'} src={item.icon} mode='widthFix' onLoad={() => { getOnload(index) }} /> */}
    </div>
  }, [loadList, userType])

  return (
    <View>
      <WaterfallList<IItem>
        dataSource={dataSource}
      // uniqueKey="uuid"
      >
        {
          (item, i) => {
            if (item?.live) {
              return <WxOpenLaunchWeapp path={`pages/live/room/index?roomId=${item?.live.roomId}&recordId=${item?.live.recordId}`}>
                {LiveItem(item)}
              </WxOpenLaunchWeapp>
            } else if (item?.swiper) {
              return <View key={'swiper' + item?.uuid} className='commodity-swiper'>
                <Swiper list={item.swiper}></Swiper>
              </View>
            } else {
              return <OneRowDoubleColumnProductItem key={'product' + item.uuid} onClick={() => handleClick(item?.uuid)} data={item} mode="waterfall" userType={userType} />
            }
          }
        }
      </WaterfallList>
    </View >

  )
}

export default Commodity
