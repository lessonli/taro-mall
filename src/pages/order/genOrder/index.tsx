import { View, Text } from "@tarojs/components"

import { useCallback, useEffect, useMemo, useRef, useState, createRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";

import OrderGoodCard, { OrderCodeCard, IProduct } from "@/pages/order/components/OrderGoodCard";
import ReceiveAdds, { IReceiver } from "@/pages/order/components/ReceiveAdds";
import api1676 from "@/apis/21/api1676";
import { useReady } from "@tarojs/runtime";
import api2164 from "@/apis/21/api2164";
import api2524 from "@/apis/21/api2524";
import { DEVICE_NAME, PAY_TYPE, PRIMARY_COLOR, PRODUCT_TYPE } from "@/constants";
import api2260 from "@/apis/21/api2260";
import RadioList from "@/components/RadioList";
import api2116 from "@/apis/21/api2116";
import Big from "big.js";
import compose, { formatMoeny, fen2yuan } from "@/utils/base";

import './index.scss'
import { AtButton } from "taro-ui";
import { useDebounceFn } from "ahooks";
import { setWxH5Config, getWxConfig, useAsync } from "@/utils/hooks";
import paySdk from "@/components/PayFeePopup/paySdk";
import { isBuyerNow, session } from "@/utils/storge";
import api2636 from "@/apis/21/api2636";
import { getAddressList, getConfigSwitch, getStatus } from "@/utils/cachedService";
import Popup from "@/components/Popup";
import PayPassword from "@/components/PayPassword";
import api2644 from "@/apis/21/api2644";
import api2140 from "@/apis/21/api2140";
import api4812 from "@/apis/21/api4812";
import DiscountCard, { IPreView } from "../components/DiscountCard";
import Coupons from "../components/Coupons";
import { sendCustomEvent } from "@/utils/uma";

// genOrder 订单结算
export default () => {

  const page = useMemo(() => Taro.getCurrentInstance(), [])

  const activityId = useMemo(() => page.router?.params.activityId, [])
  const productQuantity = useMemo(() => Number(page.router?.params.productQuantity || 1), [])

  const [receiver, setReceiver] = useState<IReceiver | undefined>(undefined);

  const [product, setproduct] = useState<IProduct>({});

  const [payTypes, setpayTypes] = useState([PAY_TYPE.WX]);
  const [payType, setpayType] = useState(PAY_TYPE.WX.value);

  const [submiting, setSubmiting] = useState(false);

  const [noteVal, setNoteVal] = useState('');

  const [weappYUEPayVisible, setWeappYUEPayVisible] = useState(false)

  const payRef = useRef()

  const [availableAmount, setavailableAmount] = useState(0)

  const [preView, setPreView] = useState<IPreView>()

  const [redBagDetail, setRedBagDetail] = useState<any>()


  // 获取商品信息
  const getProduct = useCallback(async (couponId = 0, checkedUseRedBag) => {
    const res = await api2140({
      productId: page.router?.params.productId, activityId, productQuantity, couponId: couponId, redPacketAmount: checkedUseRedBag
    })

    if (res?.maxRedPacketAmount) {
      setRedBagDetail({
        maxRedPacketAmount: res.maxRedPacketAmount,
        userRedPacketAmount: res.userRedPacketAmount
      })
    }

    setPreView(res)
    setproduct({
      ...res?.productInfo,
      merchantName: res?.merchantName,
    })
    const a = res?.userAmount || 0
    getAvailableAmount(a)
  }, [])

  const getDefaultAddr = useCallback(async () => {
    const res = await getAddressList()
    // TODO: 没有地址 直接去添加地址
    const addressNo = session.getItem('pages/other/address/index')?.activedAddressNo
    console.log('addressNo =>', addressNo)
    session.setItem('pages/other/address/index', {
      activedAddressNo: ''
    })
    if (addressNo) {
      const v = res?.find(item => item.addressNo === addressNo)
      setReceiver(v)
    } else {
      const v = res?.find(item => Boolean(item.isDefault))
      setReceiver(v)
      // TODO: 可能没有默认地址
    }
  }, [])

  const getAvailableAmount = useCallback(async (availableAmount: number) => {
    const res1 = await getConfigSwitch()
    if (!res1?.enableBalancePayOrder) {
      setpayTypes([
        PAY_TYPE.WX,
      ])
    } else {
      setavailableAmount(availableAmount)
      const a = [
        PAY_TYPE.WX,
        PAY_TYPE.YE,
      ]
      setpayTypes(a.map((item) => {
        if (item.value === PAY_TYPE.YE.value) {
          return {
            ...item,
            desc: `可用余额${compose(formatMoeny, fen2yuan)(availableAmount)}元`
          }
        }
        return item
      }))
    }

  }, [])

  useEffect(() => {
    session.setItem('userCurrentPosition', 'buyer')
    getProduct()
    // getWxConfig(['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay'])
  }, []);

  useDidShow(() => {
    getDefaultAddr()
  })

  const ablePay = useMemo(() => {
    return Boolean(receiver?.addressNo)
  }, [receiver])

  const realPrice = useMemo(() => {
    if (Number(page.router?.params.productType) === PRODUCT_TYPE.PM.value) {
      return product.auction?.lastAucPrice || 0
    }
    return product.price || 0
  }, [product])

  const count = useMemo(() => {
    const x = new Big(realPrice as number)
    return x.mul(productQuantity).toFixed(2)
  }, [realPrice, productQuantity])

  const lastPay = useMemo(() => {
    const x = new Big(count)
    const y = x.add(product.freightPrice || 0).toFixed(2)
    return preView?.payAmount
  }, [count, preView?.payAmount])

  const { run: handleSubmit } = useDebounceFn(async (payPassword: string | undefined = '') => {

    const service = () => payType === PAY_TYPE.YE.value ?
      api2644({
        productQuantity: Number(page.router?.params.productQuantity || 1),
        productId: page.router?.params.productId,
        addressNo: receiver?.id?.toString() || receiver?.addressNo || '',
        payType,
        note: noteVal,
        payPassword,
        activityId,
      })
      : api2636({
        productQuantity: Number(page.router?.params.productQuantity || 1),
        productId: page.router?.params.productId,
        addressNo: receiver?.id?.toString() || receiver?.addressNo || '',
        payType,
        note: noteVal,
        activityId,
      })
    setSubmiting(true)
    if (payType === PAY_TYPE.YE.value) {
      Taro.showLoading({
        title: '正在使用余额支付',
        mask: true,
      })
    }
    const pages = Taro.getCurrentPages()
    console.log('pages', pages);

    const prevPage = pages[pages.length - 1]

    paySdk(service, payType).then((res) => {
      if (process.env.TARO_ENV === 'weapp') {
        // 直播间 小窗 不能使用reLaunch， 会导致小窗消失
        const isFromLiveRoom = prevPage.route.indexOf('pages/live/room/index') > -1
        // session.setItem('navigatorPrevPagePath', page.page?.$taroPath)
        Taro[isFromLiveRoom ? 'navigateTo' : 'redirectTo']({
          url: `/pages/order/payResult/index?orderNo=${res?.orderNo}&payAmount=${lastPay}`
        })
      } else {
        Taro.redirectTo({
          url: `/pages/order/payResult/index?orderNo=${res?.orderNo}&payAmount=${lastPay}`
        })
      }
    }).catch(error => {
      if (error && error.res && error.res.orderNo) {

        if (process.env.TARO_ENV === 'weapp') {
          const isFromLiveRoom = prevPage.route.indexOf('pages/live/room/index') > -1
          // session.setItem('navigatorPrevPagePath', page.page?.$taroPath)
          Taro[isFromLiveRoom ? 'navigateTo' : 'redirectTo']({
            url: `/pages/order/detail/index?orderNo=${error.res.orderNo}`
          })
        } else {
          Taro.redirectTo({
            url: `/pages/order/detail/index?orderNo=${error.res.orderNo}`
          })
        }
      }

      if (payType === PAY_TYPE.YE.value) {
        payRef.current?.clear?.()
      }
    }).finally(() => {
      setSubmiting(false)
    })

  }, {
    wait: 500,
  })

  const { run: createOrder, pending } = useAsync(async () => {
    const productQuantity = Number(page.router?.params.productQuantity || 1)
    let redPacketAmount = 0
    if (preView?.discountList && preView?.discountList.length > 0) {
      redPacketAmount = preView?.discountList.filter(item => item.objType === 3)[0]?.discountAmount
    }
    sendCustomEvent(`create_order`, {
      pay_amount: lastPay,
      product_quantity: productQuantity,
      product_id: String(page.router?.params.productId),
    })

    const orderNo = await api4812({
      productQuantity,
      productId: page.router?.params.productId,
      addressNo: receiver?.id?.toString() || receiver?.addressNo || '',
      note: noteVal,
      activityId,
      redPacketAmount: redPacketAmount,
      couponId: preView?.couponId
    })

    return new Promise((resolve, reject) => {
      Taro.redirectTo({
        url: `/pages/order/pay/index?orderNo=${orderNo}&payAmount=${lastPay}`,
        success: resolve,
        fail: reject,
      })
    })
  }, { manual: true })

  // const chooseCoupon = (value) => {
  //   setCouponId(value)
  //   Taro.nextTick(() => {

  //     getProduct()
  //   })
  // }

  // const chooseRedBag = (value) => {
  //   setCheckedUseRedBag(value)
  //   Taro.nextTick(() => {

  //     getProduct()
  //   })
  // }

  const chooseDiscounts = (couponId, useRedBagNum) => {

    getProduct(couponId, useRedBagNum)

  }


  return <View className='genOrderPage'>
    <ReceiveAdds disabled={false} data={receiver} />
    <OrderGoodCard
      productItem={{
        icon: product.icon,
        productId: product.uuid,
        name: product.name,
        merchantName: product.merchantName,
        merchantId: product.merchantId,
        freightPrice: product.freightPrice,
        price: realPrice,
      }}
      productType={Number(page.router?.params.productId || PRODUCT_TYPE.PM.value)}
      productQuantity={productQuantity}
      count={count}
      lastPay={lastPay}
      ableNote={true}
      noteValue={{
        value: noteVal,
        onChange: setNoteVal,
      }}
      isBuyer={true}
      disabledToProduct
    />
    <DiscountCard chooseDiscounts={chooseDiscounts} redBagDetail={redBagDetail} preView={preView}></DiscountCard>
    {/* <View className='genOrderPage-pays'>
      <View className='genOrderPage-pays--header'>选择付款方式</View>
      <RadioList radioListOption={payTypes} defaultValue={payType} onChange={setpayType}></RadioList>
    </View> */}


    <View className='genOrderPage--footer'>
      <View className='genOrderPage--footer-text'>
        支付：
        <Text className="genOrderPage--footer-text-1 color-primary">￥</Text>
        <Text className="genOrderPage--footer-text-2 color-primary">{compose(formatMoeny, fen2yuan)(lastPay)}</Text>
      </View>
      <View><AtButton type='primary' onClick={createOrder} disabled={!ablePay || pending} loading={pending}>提交订单</AtButton></View>
    </View>
    {/* <OrderCodeCard orderNo={'233'} createTime={'2020/08/09 12:33:33'} note={'备注备注备注备注备注备注'} /> */}
  </View>
}
