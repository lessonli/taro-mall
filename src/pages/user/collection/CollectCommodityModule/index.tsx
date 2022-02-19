import Taro from '@tarojs/taro'
import './index.scss'
import { IResapi2124 } from '@/apis/21/api2124'
import { EARN as earn, empty } from "@/constants/images";
import { DEVICE_NAME, SERVICES_TYPE } from '@/constants'
import { useCallback, useState, useEffect, useLayoutEffect, useMemo } from 'react'
import { fen2yuan, getRealSize } from '@/utils/base';
import { parseOssImageInfo } from '../../../../components/Upload/oss';
import * as image from '@/constants/images'
import { bowu } from '@/constants/images';
import { View, Image as ImageBox, Text } from '@tarojs/components';
import Swiper from '../../../../components/Swiper';
import storge from '@/utils/storge';
import PreImage from '@/components/PreImage';
import { openAppProdcutDetail } from '@/utils/app.sdk';
import qs from 'query-string'
import { getUserInfo } from '@/utils/cachedService';
import { useUserTypeHook } from '@/utils/hooks'
import { navigationBarInfo } from '@/components/NavigationBar';
export type IItem = Required<Required<IResapi2124>['data']>['data']

// commodityType 1: 拍卖， 2: 一口价 ， 3: 推荐商品
interface Iprops {
  data?: IItem
  pageNo?: number | undefined
  swiperList?: any[] | undefined
  type?: number | undefined
}
const Commodity = (props: Iprops) => {
  const [leftList, setLeftList] = useState([])
  const [rightList, setRightList] = useState([])
  const [leftHeight, setLeftHeight] = useState<number>(0)
  const [rightHeight, setRightHeight] = useState<number>(0)
  const [loadList, setloadList] = useState<number[]>([])
  const [placeholder, setPlaceholder] = useState<any>()
  const { data, swiperList, type, pageNo } = props
  const { userType } = useUserTypeHook()
  const handleClick = useCallback(
    (uuid) => {
      if (DEVICE_NAME === 'iosbwh5' || DEVICE_NAME === 'androidbwh5') {
        openAppProdcutDetail({
          productId: uuid
        })
      } else {
        {
          Taro.navigateTo({
            url: `/pages/goods/goodsDetail/index?productId=${uuid}`
          })
        }
      }
    },
    [],
  )
  // const addImage = (src) => {

  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.crossOrigin = "anonymous";
  //     img.src = src;
  //     img.onload = () => {
  //       resolve(img);
  //     };
  //     img.onerror = () => {
  //       reject();
  //     };

  //     if (img.complete) {
  //       resolve(img);
  //     }
  //   });
  // }


  useLayoutEffect(() => {
    (async () => {
      // const img = await addImage(bowu)
      // setPlaceholder(img)
      const swiperHeight = type ? 532 : 0
      let formLeftList = pageNo === 1 ? [] : [...leftList]
      let formRightList = pageNo === 1 ? [] : [...rightList]
      let left = pageNo === 1 ? swiperHeight : leftHeight
      let right = pageNo === 1 ? 0 : rightHeight
      data && data.forEach(item => {
        let height = parseFloat(parseOssImageInfo(item.icon).height / (parseOssImageInfo(item.icon).width / 343))
        if (left <= right) {
          formLeftList.push(item)
          item.height = (parseOssImageInfo(item.icon).height / (parseOssImageInfo(item.icon).width / 343)) > 500 ? 500 : (parseOssImageInfo(item.icon).height / (parseOssImageInfo(item.icon).width / 343))
          if (height > 500) height = 500
          left += (height + 150)
        } else {
          formRightList.push(item)
          item.height = (parseOssImageInfo(item.icon).height / (parseOssImageInfo(item.icon).width / 343)) > 500 ? 500 : (parseOssImageInfo(item.icon).height / (parseOssImageInfo(item.icon).width / 343))
          if (height > 500) height = 500
          right += (height + 150)
        }

      });
      setLeftHeight(left)
      setRightHeight(right)
      setLeftList(formLeftList)
      setRightList(formRightList)
    })()

  }, [data, pageNo])

  const getOnload = (id) => {
    let list = JSON.parse(JSON.stringify(loadList))
    list.push(id)
    setloadList(list)

  }
  const swiper = useMemo(() => {

    return <Swiper list={swiperList}></Swiper>
  }, [swiperList])
  const Item = useMemo(() => (item, index) => {
    return <div className='commodity' key={`left${item.uuid}${index}`} onClick={handleClick.bind(this, item.uuid)}>
      <div className='commodity-placeholder' style={{ width: '100%', height: `${item.height / 2}px` }} >
        <PreImage mode='widthFix' src={qs.stringifyUrl({ url: item.icon, query: { 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 375) * 2)},m_lfit` } })} />
        {/* {!loadList.includes(index) && <div className='commodity-placeholder-box'>
          <img className='img' src={bowu} alt="" />
        </div>}
        <ImageBox className={loadList.includes(index) ? 'commodity-icon' : 'commodity-icon op0'} src={item.icon} mode='widthFix' onLoad={() => { getOnload(index) }} /> */}
      </div>
      <div className='commodity-info'>
        {/* <div className='commodity-info-tags'>
      {item.serviceIds?.split(';')?.map(child => {
        return <Text key={child} className={child === 'LQ' ? 'commodity-info-tags-account' : 'commodity-info-tags-postage'}>包邮</Text>
      })}
    </div> */}
        <div className='commodity-info-des'>
          {item.name}
        </div>
        <div className='commodity-info-price'>
          <Text className='commodity-info-price-num'><Text className='commodity-info-price-danwei'>¥</Text>{item.productType === 0 ? fen2yuan(item.price) : fen2yuan(item.auction?.lastAucPrice)}<Text className='fz24'>{item.productType === 1 && item.auction?.auctionNum < 1 && ' 起'}</Text> </Text>
          {item.productType === 0 ? <Text className='commodity-info-price-original'>¥{fen2yuan(item.originalPrice)}</Text>
            :
            <>
              {/* {item.auction?.auctionNum > 0 && <div className='numBox'>
                <Text className='earnBox-tips'>已出价<Text className='earnBox-times'>{item.auction?.auctionNum}</Text>次</Text>
              </div>} */}
            </>
          }
          {userType !== 'buyer' && item?.sDistPercent !== 0 && item?.sDistPercent && <div className='earnBox'>
            <img className='commodity-info-price-img' src={earn} alt="" />
            {item.productType === 1 ? <Text className='commodity-info-price-earn'>{item?.sDistPercent}%</Text> :
              <Text className='commodity-info-price-earn'>{fen2yuan(item?.sDistPercent * item.price / 100)}</Text>}
          </div>}
        </div>
      </div>
    </div >
  }, [loadList, userType])

  return (
    <div className='commodityBox'>
      <div className='commodityBox-left'>
        {type && <div className='commodity-swiper'>
          {swiper}
        </div>}
        {
          leftList?.map((item, index) => {
            return Item(item, index)
          })
        }
      </div>
      <div className='commodityBox-right'>
        {
          rightList?.map((item, index) => {
            return Item(item, index)
          })
        }
      </div>

    </div >

  )
}

export default Commodity
