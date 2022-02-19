import api2116 from "@/apis/21/api2116"
import api4800 from "@/apis/21/api4800"
import api4802 from "@/apis/21/api4802"
import api4804 from "@/apis/21/api4804"
import api4806 from "@/apis/21/api4806"
import { IResapi4808 } from "@/apis/21/api4808"
import paySdk from "@/components/PayFeePopup/paySdk"
import PayPassword from "@/components/PayPassword"
import Popup, { PopUpLoading } from "@/components/Popup"
import Taro from "@tarojs/taro"
import { XImage } from "@/components/PreImage"
import RadioList from "@/components/RadioList"
import { COMBINE_PAY_TYPE, PAY_TYPE_2, PRIMARY_COLOR } from "@/constants"
import compose, { fen2yuan, formatMoeny } from "@/utils/base"
import { getStatus, getSupportedOrderPays, sleep } from "@/utils/cachedService"
import { useAsync } from "@/utils/hooks"
import { View, Text, RadioGroup, Label, Radio, Image } from "@tarojs/components"
import { history } from '@tarojs/router'
import { useRouter } from "@tarojs/taro"
import { useMemo } from "react"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { AtButton } from "taro-ui"

import './index.scss'
import NavigationBar, { SingleBackBtn } from "@/components/NavigationBar"

type IPayItem = typeof PAY_TYPE_2['WX']

const COMBINE_WX_YUE = 21
const COMBINE_ALI_YUE = 23
// 上次支付过余额状态
const PREV_HAS_PAY_YUE_STATUS = 6

/**
 * 支付组合
 * 1. 三方 独立
 * 2. 余额 独立
 * 3. 三方 & 余额 ， 余额 + 三方 组合
 * 4. 三方 & 余额
 */

/**
 * 收银台
 */
export default () => {

  const { params } = useRouter()
  const orderNo = params.orderNo
  const [supportedOrderPays, setSupportedOrderPays] = useState<IResapi4808['data']>([])
  const [payType1, setpayType1] = useState()
  const [payType2, setpayType2] = useState()

  const [availableAmount, setavailableAmount] = useState(0)
  const [combinePopup, setCombinePopup] = useState(false)
  const [payPasswordVisible, setpayPasswordVisible] = useState(false)
  const [payAmount, setPayAmount] = useState(Number(params.payAmount || 0))
  const payRef = useRef()

  const payType = useMemo(() => {
    if (payType1 === PAY_TYPE_2.YE.value) return payType2
    return payType1
  }, [payType1, payType2])

  // 是否包含了余额支付
  const includeYuEPay = (v) => {
    return v === PAY_TYPE_2.YE.value || v > 20
  }

  const prevPage = useMemo(() => {
    const pages = Taro.getCurrentPages()
    console.log('pages', pages);

    return pages[pages.length - 1]
  }, [])

  const toOrderDetail = () => {

    const formOrder = (prevPage?.$taroPath?.indexOf?.('pages/order/detail/index') > -1) ||
      (prevPage?.$taroPath?.indexOf?.('pages/order/list/index') > -1)
    console.log('prevPage.$taroPath', prevPage?.$taroPath, formOrder);

    if (formOrder) {
      Taro.navigateBack()
    } else {
      console.log('去订单详情');

      Taro.redirectTo({
        url: `/pages/order/detail/index?orderNo=${params.orderNo}`
      })
    }
  }

  useEffect(() => {
    (async () => {
      const res = await getSupportedOrderPays()

      setSupportedOrderPays(res?.filter(ele => ele.enablePay > 0))

      // 获取可使用余额
      const res2 = await api2116()
      const res3 = await api4800({ orderNo })
      setPayAmount(res3?.tradeAmount || 0)
      let b = res2.availableAmount || 0
      if (res3?.payStatus === PREV_HAS_PAY_YUE_STATUS) {
        b = b + res3.availablePayAmount
      }
      // 订单余额已支付，需要用订单余额 + 可用余额 = 真实余额
      setavailableAmount(b)
    })()
  }, [])

  const supportedOrderPays1 = useMemo(() => {
    const arrs = Object.values(PAY_TYPE_2)

    return supportedOrderPays
      ?.filter((ele, i) => {
        return ele.payType < 20
      })
      .map((item, i) => {
        return arrs.find(ele => ele.value === item.payType)
      })
  }, [supportedOrderPays])

  const supportedOrderPays2 = useMemo(() => {
    const arrs = Object.values(COMBINE_PAY_TYPE)
    return supportedOrderPays?.filter(ele => ele.payType >= 20).map(item => {
      return arrs.find(ele => ele.value === item.payType)
    })
  }, [supportedOrderPays])

  // 余额充足
  const YuEEough = useMemo(() => {
    // 余额不足
    return (payAmount <= availableAmount)
  }, [availableAmount, payAmount])

  /**
   * 使用余额独立的支付
   */
  const ableUseYuE = useMemo(() => {
    return !!supportedOrderPays?.find(ele => ele.payType === PAY_TYPE_2.YE.value) && YuEEough
  }, [supportedOrderPays, YuEEough])

  /**
   * 是否满足 组合支付
   */
  const ableCombinePay = useMemo(() => {
    const a = !!supportedOrderPays?.find(ele => ele.payType > 20)
    return a && !YuEEough && availableAmount > 0
  }, [YuEEough, supportedOrderPays, availableAmount])

  /**
   * 是否组合支付
   */
  const useingCombinePay = useMemo(() => {
    return !YuEEough && payType1 === PAY_TYPE_2.YE.value
  }, [payType1, YuEEough])

  useEffect(() => {
    // 默认使用第一项支付
    const a = supportedOrderPays1?.[0]?.value
    // 第一项余额，余额不足
    if (!ableUseYuE && a === PAY_TYPE_2.YE.value) {
      setpayType1(supportedOrderPays1?.[1]?.value)
    } else {
      setpayType1(a)
    }
  }, [supportedOrderPays1, ableCombinePay, ableUseYuE])

  const payBtnText = useMemo(() => {
    if (
      [PAY_TYPE_2.WX.value, PAY_TYPE_2.ALI.value].includes(payType1)
    ) {
      return Object.values(PAY_TYPE_2).find(item => item.value === payType1)?.label
    } else if (YuEEough && payType1 === PAY_TYPE_2.YE.value) {
      return PAY_TYPE_2.YE.label
    } else {
      return '组合支付'
    }

  }, [payType1, YuEEough])

  /**
   * 组合支付场景需要的余额 分
   */
  const combineYuEAmount = useMemo(() => {
    return YuEEough ? payAmount : availableAmount
  }, [YuEEough, availableAmount, payAmount]) as number

  const combineText = useMemo(() => {
    if (payType2 === COMBINE_WX_YUE) {
      return '余额 + 微信支付'
    }
    if (payType2 === COMBINE_ALI_YUE) {
      return '余额 + 支付宝支付'
    }
    return '立即支付'
  }, [payType2, YuEEough])

  const radioChange = async (e) => {
    const v = e.detail.value
    setpayType1(Number(v))
  }

  const combineRadioChange = (e) => {
    setpayType2(Number(e.detail.value))
  }

  const openYuePay = async () => {
    // 判断有没有设置支付密码
    const { payPasswordStatus } = await getStatus()
    if (payPasswordStatus === 0) {
      Taro.showModal({
        title: '提示',
        content: '您还未设置支付密码，是否去设置',
        confirmColor: PRIMARY_COLOR,
        confirmText: '去设置',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            // 跳转到支付
            Taro.navigateTo({
              url: `/pages/user/index/setPayPassword/index`
            })
          } else {

          }
        }
      })
    } else {
      setpayPasswordVisible(true)
    }

  }

  const { run: handlePay, pending } = useAsync(async () => {

    if (useingCombinePay && !combinePopup) {
      setCombinePopup(true)
      // 选用第一种组合支付
      setpayType2(supportedOrderPays2?.[0]?.value)
      return
    }
    if (payType1 === PAY_TYPE_2.YE.value) {
      openYuePay()
      return
    }

    try {
      const s = () => paySdk(() => api4804({
        orderNo,
      }))

      await s()

      Taro.redirectTo({
        url: `/pages/order/payResult/index?orderNo=${orderNo}&payAmount=${payAmount}`
      })
    } catch (e) {
      console.log('三方支付fail', e);
      if (e?.err?.errMsg.indexOf('cancel') > -1 || e?.err?.errMsg.indexOf('fail') > -1) {
        toOrderDetail()
      }
    }

  }, { manual: true })


  const { run: handleYUEPay, pending: yuePending } = useAsync(async (payPassword) => {
    // Taro.showLoading({
    //   title: '正在使用余额支付'
    // })
    const service = (payType1 === PAY_TYPE_2.YE.value && ableUseYuE) ?
      () => api4802({
        payPassword,
        orderNo,
      })
        .then(() => {
          setpayPasswordVisible(false)
        })
        .finally(() => {
          payRef.current?.clear?.()
        }) :
      () => paySdk(() => api4806({

        payPassword,
        availablePayAmount: combineYuEAmount,
        orderNo,
      })
        .then(async (res) => {
          setpayPasswordVisible(false)
          await sleep(333)
          return res
        }).finally(() => {
          payRef.current?.clear?.()
        })
      )

    try {
      await service()
      Taro.redirectTo({
        url: `/pages/order/payResult/index?orderNo=${orderNo}&payAmount=${payAmount}`
      })
    } catch (e) {
      console.log('支付失败', e);
      if (e?.err?.errMsg.indexOf('cancel') > -1 || e?.err?.errMsg.indexOf('fail') > -1) {
        toOrderDetail()
      }
    }
  }, { manual: true })

  const handleBack = () => {
    Taro.showModal({
      title: '确定离开收银台？',
      content: `您的订单超时未支付将被取消，请尽快完成支付。`,
      confirmColor: PRIMARY_COLOR,
      confirmText: '我再想想',
      cancelText: '残忍拒绝',
      cancelColor: '',
      success: (res) => {
        if (!res.confirm) {
          toOrderDetail()
        }
      }
    })
  }

  return <View className="orderpaypage">
    <NavigationBar
      title="博物收银台"
      leftBtn={<SingleBackBtn onClick={handleBack} />}
      background="#ffffff"
    />
    <View className="text-center orderpaypage-header">
      <View className="fz26 color999 m-b-24">支付金额</View>
      <View className="fz32 color333">
        <Text className="fz22 m-r-8">￥</Text><Text className="fz42">{compose(formatMoeny, fen2yuan)(payAmount)}</Text>
      </View>
    </View>

    <View className="orderpaypage-content">
      <View className="color999 fz28 p-t-32">选择付款方式</View>
      <View>
        <RadioGroup name="a" onChange={radioChange} className="orderpaypage-radios">
          {
            supportedOrderPays1.map((item) => {
              const id = `pay_type_${item?.value}`

              const disabled = item?.value === PAY_TYPE_2.YE.value && !ableUseYuE && !ableCombinePay

              return <View className="orderpaypage-radio-item" key={id}>
                <Label for={id} className="orderpaypage-radio-item-label">
                  <View className="orderpaypage-radio-item__label">
                    <Image src={item?.icon} className="orderpaypage-radio-item-icon m-r-24" />
                    <View>
                      <Text className="color333 fz32">{item?.label}</Text>
                      {
                        includeYuEPay(item?.value) && <View className="color999 fz28">可用余额￥{compose(formatMoeny, fen2yuan)(availableAmount)}</View>
                      }
                    </View>
                  </View>
                </Label>
                <View>
                  {
                    includeYuEPay(item?.value) && ableCombinePay &&
                    <Text className="fz28 zhzf m-r-8">组合支付</Text>
                  }
                  <Radio
                    id={id}
                    value={item?.value}
                    color={PRIMARY_COLOR}
                    checked={payType1 === item?.value}
                    disabled={disabled}
                  ></Radio>
                </View>
              </View>
            })
          }
        </RadioGroup>
      </View>
    </View>

    <View className="orderpaypage-footer">
      <AtButton type="primary" onClick={handlePay} disabled={pending} loading={pending}>{payBtnText}</AtButton>
    </View>

    <Popup
      title="组合支付"
      headerType="close"
      visible={combinePopup}
      onVisibleChange={setCombinePopup}
    >
      <View className="orderpaypagecombinepay">
        <RadioGroup onChange={combineRadioChange} className="orderpaypage-radios" name="b">
          <View className="orderpaypage-radio-item orderpaypage-radio-item_yue">
            <View className="orderpaypage-radio-item__label">
              <Image src={PAY_TYPE_2.YE.icon} className="orderpaypage-radio-item-icon m-r-24" />
              <View>
                <Text className="color333 fz32">{PAY_TYPE_2.YE.label}</Text>
              </View>
            </View>
            <View className="fz32 color333">
              <Text className="fz24">￥</Text>{compose(formatMoeny, fen2yuan)(availableAmount)}
            </View>
          </View>
          <View className="orderpaypagecombinepay-desc">还需支付<Text className="color-primary">{compose(formatMoeny, fen2yuan)(Number(payAmount) - availableAmount)}</Text>元，请选择支付方式</View>
          {
            supportedOrderPays2.map((item) => {
              const id = `combinepay_type_${item?.value}`
              const val = `${item?.value}`
              return <View className="orderpaypage-radio-item" key={id}>
                <Label for={id} className="orderpaypage-radio-item-label">
                  <View className="orderpaypage-radio-item__label">
                    <Image src={item?.icon} className="orderpaypage-radio-item-icon m-r-24" />
                    <View>
                      <Text className="color333 fz32">{item?.label}</Text>
                      {
                        item?.value === PAY_TYPE_2.YE.value && <View className="color999 fz28">可用余额￥{compose(formatMoeny, fen2yuan)(availableAmount)}</View>
                      }
                    </View>
                  </View>
                </Label>
                <View>
                  {
                    !YuEEough && item?.value === PAY_TYPE_2.YE.value &&
                    <Text className="fz28 zhzf">组合支付</Text>
                  }
                  <Radio id={id} value={val} color={PRIMARY_COLOR} checked={Number(val) === payType2}></Radio>
                </View>
              </View>
            })
          }
        </RadioGroup>
        <View className="m-l-32 m-r-32 m-t-32 m-b-32">
          <AtButton type="primary" onClick={openYuePay}>{combineText}</AtButton>
        </View>
      </View>
    </Popup>

    <Popup
      visible={payPasswordVisible}
      onClose={() => {
        payRef.current?.clear?.()
        setpayPasswordVisible(false)
      }}
      title={<PopUpLoading title="请输入余额密码" fetchPending={yuePending} />}
      headerType="close"
    >
      <PayPassword
        length={6}
        fee={compose(formatMoeny, fen2yuan)(combineYuEAmount)}
        ref={payRef}
        onSubmit={handleYUEPay}
      />
    </Popup>

  </View>
}