import { IResapi3404 } from "@/apis/21/api3404";
import { PRODUCT_TYPE } from "@/constants";
import { EARN } from "@/constants/images";
import compose, { fen2yuan, getRealSize } from "@/utils/base";
import { View, Text, Image } from "@tarojs/components";
import { useMemo } from "react";
import { navigationBarInfo } from "../NavigationBar";
import { XImage } from "../PreImage";
import Taro from '@tarojs/taro'

import './index.scss'
import { useCallback } from "react";

/**
 * 单行双列商品 支持 普通 与 瀑布流布局
 */
export function OneRowDoubleColumnProductItem (props: {
  data: Required<Required<IResapi3404>['data']> & {
    /**
     * 使用瀑布流时需要该字段
     */
     iconHeight?: number;

  };
  mode?: 'sample' | 'waterfall';

  userType: 'merchant' | 'buyer';

  onClick?: () => void;
}) {

  const mode = props.mode || 'sample'

  const iconStyle = useMemo(() => {
    return props.mode === 'waterfall' ? {
      height: getRealSize(props.data.iconHeight || 343) + 'px'
    } : {}
  }, [props])

  const handleClick = useCallback(() => {
    if (props.onClick) {
      props.onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${props.data.uuid}`
      })
    }
  }, [props.onClick])

  return <View className={`OneRowDoubleColumnProductItem OneRowDoubleColumnProductItem_${mode}`} onClick={handleClick}>
    <View className="OneRowDoubleColumnProductItem-icon-wrapper" style={iconStyle}>
      <XImage
        className="OneRowDoubleColumnProductItem-icon"
        src={props.data.icon}
        mode={props.mode === 'waterfall' ? 'aspectFill' : 'aspectFill'}
        query={{
          'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 375) * 2)},m_lfit`,
          // 'image_process': 'format,webp',
        }}
      />
      {/* 赚 */}
      {
        props.userType !== 'buyer' && props.data.sDistPercent > 0 &&
        <View className="OneRowDoubleColumnProductItem-earns">
          <View className="OneRowDoubleColumnProductItem-earns-content">
            <Image src={EARN} className="OneRowDoubleColumnProductItem-earns-icon" />
            <Text className="p-l-12 p-r-12 OneRowDoubleColumnProductItem-earns-text">{
              props.data.productType === PRODUCT_TYPE.PM.value ? `${props.data.sDistPercent}%` : `${fen2yuan(props.data.sDistPercent * props.data.price / 100)}`
            }</Text>
          </View>
        </View>
      }
    </View>

    <View className="OneRowDoubleColumnProductItem-footer">
      <View className="OneRowDoubleColumnProductItem-footer-title fz28">{props.data.name}</View>
      <View className="OneRowDoubleColumnProductItem-footer-desc">
        <Text className="color-primary fz24 OneRowDoubleColumnProductItem-footer-desc-price">
          {
            props.data.productType === PRODUCT_TYPE.YKJ.value &&
            <>￥<Text className="fz32 m-l-2 m-r-4">{compose(fen2yuan)(props.data.price)}</Text></>
          }
          {
            props.data.productType === PRODUCT_TYPE.YKJ.value && props.data.originalPrice !== undefined &&
            <><Text className="line-throw fz24 bgGray m-l-12">￥{compose(fen2yuan)(props.data.originalPrice)}</Text></>
          }
          {
            props.data.productType === PRODUCT_TYPE.PM.value &&
            <>￥<Text className="fz32 m-l-2 m-r-4">{compose(fen2yuan)(props.data.auction.lastAucPrice)}</Text></>
          }
          {
            props.data.productType === PRODUCT_TYPE.PM.value && props.data.auction?.auctionNum < 1 && '起'
          }
        </Text>
        {
          props.data.productType === PRODUCT_TYPE.PM.value && props.data.auction?.auctionNum > 0 &&
          <Text className="fz24 color999">已出价<Text className="color-primary m-l-4 m-r-4">{props.data.auction.auctionNum}</Text>次</Text>
        }
      </View>
    </View>
  </View>

}