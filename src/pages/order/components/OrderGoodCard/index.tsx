import { View, Text, Image, Button, Input } from "@tarojs/components"
import Taro from "@tarojs/taro";

import './index.scss'
import { useCallback, useMemo, useEffect } from "react";
import compose, { formatDate, formatMoeny, fen2yuan } from "@/utils/base";
import { AtInput } from "taro-ui";
import { addr_border, dianp } from "@/constants/images";
import storge from "@/utils/storge";
import qs from 'query-string'
import PreImage, { XImage } from "@/components/PreImage";
import { DEVICE_NAME } from "@/constants";
import { openAppMerchantHome, openAppProdcutDetail } from "@/utils/app.sdk";
import api4094 from "@/apis/21/api4094";
import api4088 from "@/apis/21/api4088";
import { ReactNode } from "react";

interface IOrderCodeCardProps {
  orderNo: string;
  createTime: string;
  note?: string;
  isBuyer: boolean;
  // 更新备注
  ableNote?: boolean;
  merchantId?: any;
  buyerId?: any;
  payType: string;
  // iM
  onChat?: () => void;
  /**
   * 支付时间
   */
  paymentTime?: number | string;
}

export type IProduct = Optional<{
  icon: string;
  productId: string;
  name: string;
  merchantId: any;
  merchantName: string;
  marchantIcon: string;
  userIcon: string;
  userName: string;
  freightPrice: number;
  price: number;
  note?: string;
  [x: string]: any;
}>

export const OrderCodeCard = (props: IOrderCodeCardProps) => {

  // im聊天
  const goChat = async () => {
    if (props.isBuyer) {
      const result = await api4088({ userId: 111 })
      // 后续跳转带卡片，预留 type会变
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${result?.identifier}&type=1`
      })
    } else {
      const result = await api4094({ merchantId: props.merchantId })
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${result?.identifier}&type=1`
      })
    }
  }

  const handleCopy = (str) => {
    if (process.env.TARO_ENV === 'weapp' && str === 'wrap') {
      Taro.setClipboardData({
        data: props.orderNo
      })
    } else if (process.env.TARO_ENV === 'h5') {
      Taro.setClipboardData({
        data: props.orderNo,
        success: () => {
          Taro.showToast({
            title: '订单编号已复制',
            icon: 'none'
          })
        }
      })
    }
  }

  return <View className="OrderCodeCard">
    <View className="OrderCodeCard__title">订单信息</View>
    <View className="OrderCodeCard-content">
      <View>
        <View className="OrderCodeCard-content-item OrderCodeCard-content-item-1 ">
          <View className="OrderCodeCard-content-item__label ">订单编号：</View>
          <View className="OrderCodeCard-content-item--order-codewrap">
            <Text className="OrderCodeCard-content-item--order-code color666">{props.orderNo}</Text>
            <Text className="copy-btn-wrap" onClick={() => handleCopy('wrap')}>
              <Text className={`copy-btn copy-btn-${process.env.TARO_ENV}`} onClick={handleCopy}>复制</Text>
            </Text>
          </View>
        </View>
      </View>

      <View className="OrderCodeCard-content-item">
        <View className="OrderCodeCard-content-item__label">下单时间：</View>
        <View className="color666">{formatDate(props.createTime, 'YYYY-MM-DD HH:mm:ss')}</View>
      </View>

      {
        props.paymentTime &&
        <View className="OrderCodeCard-content-item">
          <View className="OrderCodeCard-content-item__label">支付时间：</View>
          <View className="color666">{formatDate(props.paymentTime, 'YYYY-MM-DD HH:mm:ss')}</View>
        </View>
      }


      {
        props.note &&
        <View className="OrderCodeCard-content-item OrderCodeCard-content-item--note">
          <View className="OrderCodeCard-content-item__label float">{props.isBuyer ? '我的' : '买家'}留言：</View>
          <View className="OrderCodeCard-content-item__text float color666">
            {props.note}
          </View>
        </View>
      }

      {
        props.payType &&
        <View className="OrderCodeCard-content-item OrderCodeCard-content-item--note">
          <View className="OrderCodeCard-content-item__label float">支付方式：</View>
          <View className="OrderCodeCard-content-item__text float color666">
            {props.payType}
          </View>
        </View>
      }


    </View>

    {/* <View className="OrderCodeCard-footer" onClick={props.onChat}>
      <Text className="myIcon">&#xe705;</Text>
      联系{props.isBuyer ? '卖家' : '买家'}
    </View> */}
  </View>
}

export default (props: {
  productItem: IProduct;
  // 数量
  productQuantity: number;
  // 商品类型
  productType?: number;
  // 总价 不含运费
  count: string | number;
  // 总价 含运费
  lastPay: string | number;

  mode?: 'genOrder' | 'orderDetail';
  // 更新备注
  ableNote?: boolean;
  // 需要输入备注时 使用
  noteValue?: {
    value: string;
    onChange: (v: string) => void;
  },
  isBuyer: boolean;

  disabledToProduct?: boolean;

  hideMerchant?: boolean;

  rightNode?: ReactNode

  onProdPreview?: (e: Event, src: string) => void;
}) => {

  const toMerchant = () => {
    if (!props.isBuyer) return
    if (DEVICE_NAME === 'androidbwh5' || DEVICE_NAME === 'iosbwh5') {
      openAppMerchantHome({
        merchantId: props.productItem.merchantId
      })
    } else {
      Taro.navigateTo({
        url: `/pages/store/index?merchantId=${props.productItem.merchantId}`
      })
    }
  }

  const toProd = () => {
    // 订单结算页 不能去商品页
    if (props.disabledToProduct) return
    if (DEVICE_NAME === 'androidbwh5' || DEVICE_NAME === 'iosbwh5') {
      openAppProdcutDetail({
        productId: props.productItem.productId,
        productType: props.productType,
      })
    } else {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${props.productItem.productId}&productType=${props.productType}`
      })
    }
  }

  const onProdPreview = (e: Event, src: string) => {
    props.onProdPreview?.(e, src)
  }

  const avaIcon = props.isBuyer ? props.productItem.marchantIcon : props.productItem.userIcon

  return (
    <View className="OrderGoodCard">
      {
        !props.hideMerchant &&
        <View className="OrderGoodCard_mallname" onClick={toMerchant}>
          {/* <Text className="myIcon mall-icon">&#xe6fe;</Text> */}
          {/* <Image src={avaIcon ? qs.stringifyUrl({ url: avaIcon, query: { 'x-oss-process': 'image/resize,w_120/quality,q_100' } }) : ''} className="OrderGoodCard_mallname-icon" /> */}
          <View className='OrderGoodCard_mallname-iconBox'>
            <XImage
              className="OrderGoodCard_mallname-icon"
              src={avaIcon || dianp}
              query={{ 'x-oss-process': 'image/resize,w_80/quality,q_100' }}
              style={{ 'borderRadius': props.isBuyer ? '0' : '50%' }}
            />
            <Text className="OrderGoodCard_mallname-text">
              {props.isBuyer ? props.productItem.merchantName : props.productItem.userName}
            </Text>
          </View>
          {props.rightNode}
        </View>
      }
      <View className="OrderGoodCard_goodwrap">
        <View className="OrderGoodCard_good flex items-center" onClick={toProd}>
          <XImage src={props.productItem?.icon}
            query={{ 'x-oss-process': 'image/resize,w_120/quality,q_100' }}
            placeholder=""
            className="OrderGoodCard_good-icon" onClick={(e) => onProdPreview(e, props.productItem?.icon)} />
          <View className="OrderGoodCard_good-d fz24">
            <View className="OrderGoodCard_good-d-name color666 fz28">{props.productItem.name}</View>
            <View className="flex justify-between">
              <Text className="color333 fz24">￥{compose(formatMoeny, fen2yuan)(props.productItem.price)}</Text>
              <Text className="fz24">x{props.productQuantity}</Text>
            </View>
          </View>
        </View>
        {/* 
        <View className="flex justify-between mg24 OrderGoodCard-2">
          <Text className="OrderGoodCard-2-l">商品总价</Text>
          <Text className="OrderGoodCard-2-r">￥{compose(formatMoeny, fen2yuan)(props.count)}</Text>
        </View> */}

        <View className="flex justify-between OrderGoodCard-2 bbl">
          <Text className="OrderGoodCard-2-l">快递运费</Text>
          <Text className="OrderGoodCard-2-r">{props.productItem.freightPrice === 0 ? '免运费' : `￥${compose(formatMoeny, fen2yuan)(props.productItem.freightPrice)}`}</Text>
        </View>
        {
          props.ableNote &&
          <View className="flex justify-between OrderGoodCard-2">
            <Text className="OrderGoodCard-2-l">备注</Text>
            <View className="OrderGoodCard-2-r">
              <Input placeholder="最多30字（选填）" className="input-note" value={props.noteValue?.value} onInput={e => props.noteValue?.onChange(e.detail.value)} maxlength={30} />
            </View>
          </View>
        }

        {/* {
          !props.ableNote && !!props.productItem.note &&
          <View className="flex justify-between mg24 OrderGoodCard-2">
            <Text className="OrderGoodCard-2-l">备注</Text>
            <Text className="OrderGoodCard-2-r">
              {props.productItem.note}
            </Text>
          </View>
        } */}

        {/* <View className="OrderGoodCard_good-count">
          {props.hideMerchant ? '合计：' : '实际支付：'}
          <Text className="color-primary ">￥</Text><Text className="color-primary ">{compose(formatMoeny, fen2yuan)(props.lastPay)}</Text>
        </View> */}

      </View>
    </View>
  )
}

// 物流最新信息展示
export const ExpressRecently = (props: {
  position?: 'buyer' | 'merchant';
  updateTime: string;
  desc: string;
  orderNo: string;
  productIcon: string;
}) => {

  const toDetail = useCallback(() => {
    storge.setItem('expressIcon', props.productIcon)
    Taro.navigateTo({
      url: `/pages/order/express/detail/index?orderNo=${props.orderNo}`
    })
  }, [props.orderNo])

  return <View className="ExpressRecently" onClick={toDetail}>
    <View className="ExpressRecently-1">
      <Text className="myIcon ExpressRecently-1-car">&#xe704;</Text>
      <View className="ExpressRecently-1-texts">
        <View className="ExpressRecently-1-texts-1">{props.desc}</View>
        <View className="ExpressRecently-1-texts-2">{formatDate(props.updateTime, 'YYYY-MM-DD HH:mm:ss')}</View>
      </View>
    </View>

    <Text className="myIcon ExpressRecently-next">&#xe726;</Text>
  </View>
}