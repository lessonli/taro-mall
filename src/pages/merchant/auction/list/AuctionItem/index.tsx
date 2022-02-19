import { useState, useEffect, useMemo } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from "@tarojs/taro";

import { IResapi2124 } from "@/apis/21/api2124";

import './index.scss'
import compose, { formatDate, formatMoeny, yuan2fen, fen2yuan, getRealSize } from '@/utils/base'

import * as images from "@/constants/images";

import './index.scss'
import { useCallback } from 'react';
import { useDebounceFn } from 'ahooks';
import api2060 from '@/apis/21/api2060';
import api2068 from '@/apis/21/api2068';
import { BUYER_AUCTION_STATUS, DEVICE_NAME, MERCHANT_AUCTION_STATUS, MERCHANT_YKJ_STATUS, PRODUCT_TYPE } from '@/constants';
import { XImage } from '@/components/PreImage';
import { openAppProdcutDetail } from '@/utils/app.sdk';
import { session } from '@/utils/storge';

export type IItem = Required<Required<IResapi2124>['data']>['data'][0]

export type TBtnName = '下架' | '上架' | '店铺推荐' | '取消推荐' | '编辑' | '查看订单' | '重新上拍' | '查看详情' | '重新上架'

// 卖家拍品 一口价商品
const AuctionItem = (props: {
  data: IItem;
  productType?: 0 | 1;
  onSuccess?: (name: TBtnName, uuid: string, data: IItem) => void;
}) => {

  const { data } = props
  const autStatus = Number(data.auction?.status)

  const toDetail = () => {
    if (!data._draft) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productType=${data.productType}&productId=${data.uuid}&sourceUrl=list`
      })
    } else {
      if (DEVICE_NAME === 'iosbwh5' || DEVICE_NAME === 'androidbwh5') {
        openAppProdcutDetail({
          productType: data.productType,
          productId: data.uuid || '',
        })
      } else {
        session.setItem('pages/merchant/auction/list/index', {
          publishProductId: data.uuid,
          publishName: '编辑旧商品'
        })
        Taro.navigateTo({
          url: `/pages/merchant/publish/product/index?productType=${data.productType}&productId=${data.uuid}`
        })
      }
    }
  }

  const handBtnClick = useCallback(async (name: TBtnName) => {
    const {uuid} = props.data
    console.log(name)
    name = name.trim()
    try {
      if (name === '上架' || name === '重新上拍' || name === '重新上架') {
        // Taro.showLoading({ title: `${name}中` })
        // await api2060({ status: 1, uuid })
        // if (props.data.auction?.status === MERCHANT_AUCTION_STATUS.ing.value) {
        //   await api2060({ status: MERCHANT_YKJ_STATUS.off.value, uuid }) 
        // }
        session.setItem('pages/merchant/auction/list/index', {
          publishProductId: props.data.uuid,
          publishName: '重新发布新商品'
        })
        Taro.navigateTo({
          url: `/pages/merchant/publish/product/index?productType=${props.productType}&productId=${props.data.uuid}&rePublish=1&prevStatus=${props.data.auction?.status}&btnName=${name}`
        })
      }

      if (name === '下架') {
        Taro.showLoading({ title: `${name}中` })
        await api2060({ status: MERCHANT_YKJ_STATUS.off.value, uuid })
      }

      if (name === '店铺推荐') {
        Taro.showLoading({ title: `${name}中` })
        await api2068({uuid, status: 1})
      }

      if (name === '取消推荐') {
        Taro.showLoading({ title: `${name}中` })
        await api2068({uuid, status: 0})
      }

      if (name === '查看详情') {
        Taro.navigateTo({
          url: `/pages/goods/goodsDetail/index?productId=${props.data.uuid}`
        })
      }

      if (name === '编辑') {
        // await api2060({ status: MERCHANT_YKJ_STATUS.off.value, uuid })
        session.setItem('pages/merchant/auction/list/index', {
          publishProductId: props.data.uuid,
          publishName: '编辑旧商品'
        })
        Taro.navigateTo({
          url: `/pages/merchant/publish/product/index?productId=${props.data.uuid}&productType=${props.data.productType || props.productType}`
        })
      }

      props.onSuccess?.(name, uuid, props.data)

      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
    }
  }, []) 

  const Btn = useMemo(() => {
    return (p) => <View className="bw-btn"><AtButton size="small" {...p} onClick={() => handBtnClick(p.children)} ></AtButton></View>
  }, [])

  return <View className="AuctionItem-component">
    <View className="title justify-between items-center">
      <View className="title-time">
        {
          props.productType === PRODUCT_TYPE.YKJ.value && <>
            {
              data.publishStatus === MERCHANT_YKJ_STATUS.onSale.value && `上架时间：${ formatDate(data.publishTime) }`
            }
          </>
        }
        {
          props.productType === PRODUCT_TYPE.PM.value && <>
            {/* 0:竞拍中1:已截拍2:已流拍3:竞拍失败,com.bwyd.product.enums.ProductAuctionStatus */}
            { autStatus === 0 && `截拍时间：${ formatDate(data.auction?.endTime) }` }
            { autStatus === 1 && `截拍时间：${ formatDate(data.auction?.endTime) }` }
            { autStatus === 2 && `流拍时间：${ formatDate(data.auction?.endTime) }` }
          </>
        }
      </View>
      <View className="title-status">
        {/* 买家状态展示 */}
        {/* {
          Object.keys(BUYER_AUCTION_STATUS).map(key => BUYER_AUCTION_STATUS[key]).find(({ value }) => value === Number(data.aucUser?.auctionStatus))?.label || ''
        } */}
      </View>
    </View>
    <View className="detail flex" onClick={toDetail}>
      <View className="good-icon">
        <XImage src={props.data.icon || ''} className="good-icon-img" query={{ 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(180)) * 2}` }} />
        {
          props.data.shopRecStatus === 1 && <Text className="good-icon-status">
            <Text className="good-icon-status-text">推荐中</Text>
          </Text>
        }
      </View>
      <View className="detail-text">
        <View className="name">{data.name}</View>
        {
          props.productType === PRODUCT_TYPE.PM.value && (
            <View className="prices">
              <Text className="price">起拍价 ¥{compose(formatMoeny, fen2yuan)(data.auction?.initPrice)}</Text>
              <Text className="price">加价 ¥{compose(formatMoeny, fen2yuan)(data.auction?.markUp)}</Text>
              <Text className="price">保证金 ¥{compose(formatMoeny, fen2yuan)(data.auction?.margin)}</Text>
            </View>
          )
        }

        {
          props.productType === PRODUCT_TYPE.YKJ.value && (
            <View className="prices">
              <Text className="price">已售 {data.totalSales}</Text>
              <Text className="price">库存 {data.stock}</Text>
            </View>
          )
        }
        {
          props.productType === PRODUCT_TYPE.PM.value && <View className="get-price">
            <Text className="m-r-8">{ data.auction?.status === MERCHANT_AUCTION_STATUS.hasEnd.value ? '中拍价' : '当前价' }</Text>
            <Text className="color-primary m-r-8">¥</Text>
            <Text className="price fw600 m-r-16">{compose(formatMoeny, fen2yuan)(data.auction?.lastAucPrice)}</Text>
            {
              Boolean(data.distPercent) && <Text className="fz24 color-primary">
                {/* <Image src={images.EARN} className="get-price__earn-img"/> <Text className="get-price__earn-text">{data.distPercent}%</Text> */}
                分销 {data.distPercent}%
              </Text>
            }
          </View>
        }

        {
          props.productType === PRODUCT_TYPE.YKJ.value &&
          <View className="get-price">
            <Text className="color-primary">¥</Text>
            <Text className="price fw600 m-r-16"> {compose(formatMoeny, fen2yuan)(data.price)}</Text>
            {
              Boolean(data.distPercent) && <Text className="fz24 color-primary">
                {/* <Image src={images.EARN} className="get-price__earn-img"/> <Text className="get-price__earn-text">{data.distPercent}%</Text> */}
                分销 {data.distPercent}%
              </Text>
            }
          </View>
        }
        
      </View>
    </View>

    <View className="footer">
      {
        props.productType === PRODUCT_TYPE.PM.value && <>
          {
            (
              (data.auction?.auctionNum === 0 && autStatus === MERCHANT_AUCTION_STATUS.ing.value)
            )
            && <Btn>编辑</Btn>
          }
          {
            (data.auction?.auctionNum === 0 && autStatus === MERCHANT_AUCTION_STATUS.ing.value) && <Btn>下架</Btn>
          }
          { autStatus === 0 && Number(data?.shopRecStatus) === 0 && <Btn type="secondary">店铺推荐</Btn> }
          { autStatus === 0 && Number(data?.shopRecStatus) === 1 && 
        <Btn type="secondary">取消推荐</Btn> }
          
          { [MERCHANT_AUCTION_STATUS.closed.value, MERCHANT_AUCTION_STATUS.failed.value, MERCHANT_AUCTION_STATUS.hasEnd.value].includes(autStatus) && <Btn type="secondary">重新上拍</Btn> }
          {/* { autStatus === 1 && <Btn type="secondary">查看订单</Btn> } */}
          
        </>
      }

      {
        props.productType === PRODUCT_TYPE.YKJ.value && <>
          {data.publishStatus === MERCHANT_YKJ_STATUS.onSale.value && <Btn>编辑</Btn>}
          { data.publishStatus === MERCHANT_YKJ_STATUS.onSale.value && <Btn>下架</Btn> }
          { data.publishStatus === MERCHANT_YKJ_STATUS.onSale.value && data.shopRecStatus === 0 && <Btn type="secondary">店铺推荐</Btn> }
          { data.publishStatus === MERCHANT_YKJ_STATUS.onSale.value && data.shopRecStatus === 1 && <Btn type="secondary">取消推荐</Btn> }
          { data.publishStatus === MERCHANT_YKJ_STATUS.off.value && <Btn type="secondary">重新上架</Btn> }
        </>
      }

      {/* <Btn type="secondary">上架</Btn> */}

    </View>
  </View>
}

export default AuctionItem