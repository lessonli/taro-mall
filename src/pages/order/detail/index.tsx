import { View, Text } from "@tarojs/components"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Taro, { useDidHide, useDidShow } from "@tarojs/taro";

import OrderGoodCard, { OrderCodeCard, IProduct, ExpressRecently } from "@/pages/order/components/OrderGoodCard";
import ReceiveAdds, { IReceiver } from "@/pages/order/components/ReceiveAdds";
import api1676, { IResapi1676 } from "@/apis/21/api1676";
import { useReady } from "@tarojs/runtime";
import { tim, TIM } from '@/service/im';

import PayPassword from "@/components/PayPassword";

import './index.scss'
import { DEVICE_NAME, IMID, isAppWebview, ORDER_STATUS, PAY_TYPE, PRIMARY_COLOR, PRODUCT_TYPE, RETURN_STATUS } from "@/constants";
import dayjs from "dayjs";
import Popup from "@/components/Popup";
import { AtButton } from "taro-ui";
import PayFeePopup from "@/components/PayFeePopup";
import NavigationBar, { BackAndHomeBtn, navigationBarPageStyle } from '@/components/NavigationBar'
import paySdk from "@/components/PayFeePopup/paySdk";
import api2652 from "@/apis/21/api2652";
import api2660 from "@/apis/21/api2660";
import api2676 from "@/apis/21/api2676";
import api2004 from "@/apis/21/api2004";
import api1732 from "@/apis/21/api1732";
import compose, { countDownTimeStr, formatMoeny, fen2yuan } from "@/utils/base";
import storge, { isBuyerNow, session } from "@/utils/storge";
import api1924 from "@/apis/21/api1924";
import api3434 from "@/apis/21/api3434";
import api3686 from "@/apis/21/api3686";
import api3440 from "@/apis/21/api3440";
import api2260 from "@/apis/21/api2260";
import api2628 from "@/apis/21/api2628";
import api3734 from "@/apis/21/api3734";
import { getAddressList, getCachedOrderRule, globalConfig, getUserInfo } from "@/utils/cachedService";
import { useRequest } from "ahooks";
import { cachedWxConfig, h5GlobalShareData, setWxH5ConfigPromise, useWxShare } from "@/utils/hooks";
import { openAppProdcutDetail } from "@/utils/app.sdk";
import api4088 from "@/apis/21/api4088";
import api4094 from "@/apis/21/api4094";
import { IOrderMsgDesc } from "@/pages/im/message/customMessage";
import api4292 from "@/apis/21/api4292";
import api4718 from "@/apis/21/api4718";
import ChoosePay from "@/components/PayFeePopup/ChoosePay";
import { useRecoilState } from "recoil";
import { isImReady } from "@/store/atoms";
import { request } from "@/service/http";
import { req4082Config } from "@/apis/21/api4082";
import { useTIMAutoLogin } from "@/pages/goods/components/SubmitBottom";
import RewardModal from "../components/RewardModal";
import { addWaterMarker } from "@/components/PreImage";
import DiscountCard from "../components/DiscountCard";

const OrderStatus = (props: {
  title: string;
  desc?: string;
}) => {
  return <View className="OrderStatus-componet">
    <View className="OrderStatus-componet__title">{props.title}</View>
    {
      !!props.desc && <View className="OrderStatus-componet__desc">{props.desc}</View>
    }
  </View>
}

export default () => {

  let isBuyer = isBuyerNow()

  let timeDifferenceRef = useRef<number>()

  const page = useMemo(() => Taro.getCurrentInstance(), [])

  const [orderDetail, setOrderDetail] = useState<Required<IResapi1676>['data'] | undefined>(undefined);

  const [desc, setDesc] = useState('');

  const [noteVal, setNoteVal] = useState('');

  const [rewardVisible, setRewardVisible] = useState<boolean>(false)
  const [reward, setReward] = useState<number>()

  const { run: TIMAutoLogin } = useTIMAutoLogin()

  const [submiting, setSubmiting] = useState({
    '提醒发货': false,
    '立即支付disabled': false,
  });
  const [receiver, setReceiver] = useState<IReceiver>();
  const interRef = useRef(null)

  const [visibles, setvisibles] = useState({
    payPassword: false,
    PayFeePopup: false,
  });

  const payRef = useRef()

  const onVisiblesChange = useCallback((name, v) => {
    setvisibles({ ...visibles, [name]: v })
  }, [visibles])

  const onSubmiting = useCallback((name, v) => {
    setSubmiting({
      ...submiting,
      [name]: v,
    })
  }, [submiting])

  const getorderDetail = useCallback(async (bindAddr = false) => {
    // const addressNo = page.router?.params.addressNo
    const addressNo = session.getItem('pages/other/address/index')?.activedAddressNo
    const orderNo = page.router?.params.orderNo

    const api = isBuyerNow() ? api1676 : api1924
    const res = await api({ orderNo })
    setOrderDetail(res)

    setNoteVal(res?.note || '')

    if (res.status === ORDER_STATUS.waitPay.value) {
      // 待支付 倒计时
      const startTime = res?.operateTimeout
      // const startTime = res?.createTime
      const updateTime = async () => {
        const r = countDownTimeStr(
          dayjs(startTime).valueOf(),
          timeDifferenceRef.current,
        )
        if (r !== null) {
          setDesc(`剩余支付时间 ${r.hh}:${r.mm}:${r.ss}`)
        } else {
          // 临界时间 可能状态更新有延迟，会导致死循环
          console.log('清除')
          clearInterval(interRef.current)
          const api = isBuyerNow() ? api1676 : api1924
          const res = await api({ orderNo: page.router?.params.orderNo })
          setOrderDetail(res)
        }
      }

      interRef.current = setInterval(updateTime, 1000)
      updateTime()
    } else {
      clearInterval(interRef.current)
      setDesc(res?.returnStatusDetail || '')
    }

    // 补全地址信息 买家的流程
    if (addressNo && res?.canUpdateAddress && isBuyer && bindAddr) {
      session.setItem('pages/other/address/index', {
        activedAddressNo: ''
      })
      const res2 = await getAddressList()
      const v = res2?.find(item => item.addressNo === addressNo)
      setReceiver(v)
      if (v) {
        setSubmiting({
          ...submiting,
          '立即支付disabled': false,
        })
        // 给订单更新地址
        api2628({ orderNo, addressNo })
      }
    } else if (res?.canUpdateAddress && !res?.orderAddressVO && !addressNo && isBuyer) {
      // 设置默认
      const res = await api2260()
      const v = res?.find(item => item.isDefault)
      setReceiver(v)
      if (v) {
        setSubmiting({
          ...submiting,
          '立即支付disabled': false,
        })
        api2628({ orderNo, addressNo: v?.addressNo })
      }
    } else if (!!res?.orderAddressVO) {
      setReceiver({
        name: res?.orderAddressVO?.receiverName || '',
        province: res?.orderAddressVO?.receiverProvince,
        city: res?.orderAddressVO?.receiverCity,
        district: res?.orderAddressVO?.receiverDistrict,
        detailAddress: res?.orderAddressVO?.receiverAddress,
        mobile: res?.orderAddressVO?.receiverPhone,
      })
      setSubmiting({
        ...submiting,
        '立即支付disabled': false,
      })
    }

  }, [])

  useDidShow(async () => {

    console.log('useDidShow')
    const userCurrentPosition = await getCachedOrderRule(page.router?.params.orderNo)
    // 0用户, 1商户
    session.setItem('userCurrentPosition', userCurrentPosition)
    // storge.setItem('userCurrentPosition', userCurrentPosition)
    isBuyer = isBuyerNow()
    getorderDetail(true)
  })

  useWxShare()

  useEffect(() => {

    globalConfig().then(res => {
      timeDifferenceRef.current = res.timeDifference
    })

    return () => {
      console.log('页面卸载')
      clearInterval(interRef.current)
    };
  }, []);
  useDidHide(() => {
    console.log('useDidHide')
    clearInterval(interRef.current)
  })

  const handleYUEPayOrder = useCallback((passwords) => {
    // 余额支付
    Taro.showLoading({
      title: '正在使用余额支付'
    })
    api2660({
      orderNo: page.router?.params.orderNo,
      payType: PAY_TYPE.YE.value,
      payPassword: passwords,
    }).then((res) => {
      Taro.redirectTo({
        url: `/pages/order/payResult/index?orderNo=${page.router?.params.orderNo}&payAmount=${orderDetail?.payAmount}`
      })
    }).catch(() => {
      payRef.current?.clear?.()
    }).finally(() => {
      Taro.hideLoading()
    })

    // 跳转到支付结果页
  }, [orderDetail])

  const upDateNote = async () => {
    if (orderDetail?.canUpdateNote && orderDetail.note !== noteVal && noteVal !== '') {
      await api3734({ orderNo: page.router?.params.orderNo, note: noteVal })
    } else {
      return Promise.resolve()
    }
  }

  const productItem: IProduct = useMemo(() => {
    return {
      name: orderDetail?.orderItemVO?.productName,
      icon: orderDetail?.orderItemVO?.productPic,
      merchantName: orderDetail?.merchantName,
      merchantId: orderDetail?.merchantId,
      marchantIcon: orderDetail?.merchantIcon,
      userId: orderDetail?.userId,
      userIcon: orderDetail?.userIcon,
      userName: orderDetail?.userName,
      productId: orderDetail?.orderItemVO?.productId,
      freightPrice: orderDetail?.freightAmount || 0,
      price: orderDetail?.orderItemVO?.productPrice,
      note: orderDetail?.note,
    }
  }, [orderDetail])

  const orderTitle = useMemo(() => {
    if (orderDetail?.returnStatus === RETURN_STATUS.ing.value) {
      return RETURN_STATUS.ing.label
    }
    const key = Object.keys(ORDER_STATUS).find(key => ORDER_STATUS[key].value === orderDetail?.status)
    return ORDER_STATUS[key]?.label
  }, [orderDetail])

  const handlePay = async ({ payType, payPassword }) => {
    const orderNo = page.router?.params.orderNo
    const fn = payType === PAY_TYPE.WX.value ?
      paySdk(() => api2652({
        orderNo,
        payType,
      }), payType) :
      api2660({
        orderNo,
        payType,
        payPassword
      })
    await fn
    Taro.redirectTo({
      url: `/pages/order/payResult/index?orderNo=${orderNo}&payAmount=${orderDetail?.payAmount}`
    })

  }

  // const {} = useRequest(handleToPay, {
  //   debounceInterval: 1000,
  // })

  const handleBtnSubmit = useCallback(async (name) => {
    const orderNo = page.router?.params.orderNo
    const productId = orderDetail?.orderItemVO?.productId
    if (name === '取消订单') {
      Taro.showModal({
        title: '提示',
        content: '订单取消后，进入交易关闭状态',
        confirmColor: PRIMARY_COLOR,
        confirmText: '确定',
        cancelText: '取消',
        success: (result) => {
          if (!result.confirm) return
          api2676({
            orderNo,
          }).then(async () => {
            session.setItem('pages/order/list/index', { needReload: true })
            Taro.showLoading()
            getorderDetail().finally(() => {
              Taro.hideLoading()
            })
          })
        }
      })
    }

    if (name === '立即支付') {
      // 查看地址信息是否补全
      if (receiver === undefined) {
        return Taro.showToast({
          icon: 'none',
          title: '请先补全您的收货地址'
        })
      }
      // 备注更新过的 先更新备注信息
      // if (orderDetail?.orderAddressVO.)
      await upDateNote()
      console.log('拉起支付')
      // setvisibles({ ...visibles, PayFeePopup: true })
      Taro.navigateTo({
        url: `/pages/order/pay/index?orderNo=${orderDetail?.uuid}&payAmount=${orderDetail?.payAmount}`
      })
    }
    if (name === '删除订单') {

      Taro.showModal({
        confirmColor: PRIMARY_COLOR,
        confirmText: '删除',
        content: '你确定要删除该订单吗？',
        success: async (result) => {
          if (!result.confirm) return
          Taro.showLoading({
            title: '删除订单中'
          })
          // api3434
          api3440({ orderNo }).then(() => {
            session.setItem('pages/order/list/index', { needReload: true })
            Taro.navigateBack()
          }).finally(() => {
            Taro.hideLoading()
          })
        }
      })

    }

    if (name === '再次购买') {
      if (isAppWebview) {
        openAppProdcutDetail({
          productId,
        })
      } else {
        Taro.navigateTo({
          url: `/pages/goods/goodsDetail/index?productId=${productId}`
        })
      }
    }

    if (name === '申请售后') {
      Taro.navigateTo({
        url: `/pages/order/afterSale/applyReturn/index?orderNo=${orderNo}`
      })
    }

    if (name === '售后详情') {
      Taro.navigateTo({
        url: `/pages/order/afterSale/detail/index?orderNo=${orderNo}&orderReturnNo=${orderDetail.orderReturnNo}`
      })
    }

    if (name === '去评价') {
      Taro.navigateTo({
        url: `/pages/order/evaluation/index?orderNo=${orderNo}&productId=${productId}&sourceUrl=${encodeURIComponent(page.router?.path || '')}`
      })
    }

    if (name === '确认收货') {
      Taro.showModal({
        content: '确认收货后，视为订单完成（售后关闭），系统自动将货款结算至商家。',
        confirmColor: PRIMARY_COLOR,
        confirmText: '确认收货',
        success: (result) => {
          if (!result.confirm) return
          api2004({ orderNo }).then(() => {
            session.setItem('pages/order/list/index', { needReload: true })
            getorderDetail()
            // Taro.redirectTo({
            //   url: `/pages/order/result/index?orderNo=${orderNo}&orderStatus=${ORDER_STATUS.hasReceive}`
            // })
          }).then(async () => {
            if (DEVICE_NAME === 'weapp') {
              const rewardRes = await api4718({ orderId: page.router?.params.orderNo })
              if (rewardRes?.rewardAmount) {
                setRewardVisible(true)
                setReward(Number(rewardRes?.rewardAmount))
              }
            }
          })
        }
      })
    }

    if (name === '提醒发货') {
      api1732({ orderNo }).then(() => {
        Taro.showToast({
          icon: 'none',
          title: '已提醒商家发货'
        })
      })
    }
    // 商家流程
    if (name === '提醒支付') {
      // TODO：im
      await api3686({ orderNo })
      Taro.showToast({
        icon: 'none',
        title: '已提醒买家支付'
      })
    }

    if (name === '立即发货') {
      Taro.navigateTo({
        url: `/pages/order/dispatch/index?orderNo=${orderNo}`
      })
    }

    if (name === '修改物流') {
      Taro.navigateTo({
        url: `/pages/order/dispatch/index?orderNo=${orderNo}`
      })
    }

  }, [orderDetail, noteVal, receiver])
  // console.log('receiver', receiver)

  const getPayType = (type) => {
    let str = ''
    if (type === 0) {
      str = '未支付'
    } else if (type === 1) {
      str = '微信支付'
    } else if (type === 3) {
      str = '余额支付'
    } else if (type === 21) {
      str = '余额+微信'
    }
    return str
  }

  const toIm =
    async (e) => {
      e.stopPropagation()
      await TIMAutoLogin()
      const res = await (isBuyer ? api4094({ merchantId: productItem.merchantId }) : api4088({ userId: orderDetail?.userId }))
      const identifier = res?.identifier
      const description: IOrderMsgDesc = {
        _sender: isBuyer ? 'buyer' : 'merchant',
        _type: 'orderCard',
        porductName: orderDetail?.orderItemVO?.productName,
        productIcon: orderDetail?.orderItemVO?.productPic,
        price: orderDetail?.orderItemVO?.productPrice,
        orderNo: orderDetail?.uuid,
        orderSatus: orderDetail?.status,
        orderSatusStr: orderTitle,
        orderTitle: (() => {
          if (!isBuyer && orderDetail?.status === ORDER_STATUS.waitPay.value) return '亲，请及时支付'
          if (isBuyer && orderDetail?.status === ORDER_STATUS.waitDispatch.value) return '亲，请尽快发货'
          if (!isBuyer && orderDetail?.status === ORDER_STATUS.hasReceive.value && orderDetail.returnStatus === RETURN_STATUS.none.value) return '亲，麻烦给个好评哦'
          return ''
        })()
      }
      const immsg = {
        to: identifier,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: JSON.stringify(description),
          description: JSON.stringify(description)
        },
        offLineMsg: '向您发起了一笔订单咨询~'
      }

      // 区分app H5，并发送消息卡片
      if (isAppWebview) {
        WebViewJavascriptBridge.callHandler(
          'callAppSendIm',
          JSON.stringify(immsg),
          () => {
            // WebViewJavascriptBridge.callHandler(
            //   'openNativePage',
            //   JSON.stringify({
            //     page: '/im/chat',
            //     params: {
            //       identifier
            //     }
            //   })
            // )
          }
        )

      } else {
        const userInfo = await getUserInfo()
        const tim = TIM.create(IMID)
        await tim.sendMessage(tim.createCustomMessage(immsg), {
          // 如果接收方不在线，则消息将存入漫游，且进行离线推送（在接收方 App 退后台或者进程被 kill 的情况下）。接入侧可自定义离线推送的标题及内容
          offlinePushInfo: {
            title: userInfo?.nickName, // 离线推送标题
            description: '向您发起了一笔订单咨询~', // 离线推送内容
          }
        })
        Taro.navigateTo({
          url: `/pages/im/message/index?id=${identifier}&type=1`
        })
      }

    }
  const handleConfirm = () => {
    setRewardVisible(false)
    Taro.navigateTo({ url: '/pages/user/index/accountBalance/index' })
  }
  return <View className="OrderDetailPage">
    <NavigationBar
      background="#ffffff"
      title={isBuyer ? '订单详情' : '店铺订单详情'}
      leftBtn={<BackAndHomeBtn />}
    />
    <View>
      <OrderStatus
        title={orderTitle}
        desc={desc}
      />
    </View>

    {
      [
        ORDER_STATUS.hasDispatch.value,
        ORDER_STATUS.hasReceive.value,
        ORDER_STATUS.hasNote.value,
      ].includes(orderDetail?.status) &&
      !!orderDetail?.latestExpressRecord?.recordTime &&
      <ExpressRecently
        desc={orderDetail?.latestExpressRecord?.context || ''}
        updateTime={orderDetail?.latestExpressRecord?.recordTime || ''}
        orderNo={page.router?.params.orderNo || ''}
        productIcon={productItem.icon || ''}
      />
    }

    <ReceiveAdds disabled={!(orderDetail?.canUpdateAddress && isBuyer)} data={receiver} ableCopy={!isBuyer} />
    <OrderGoodCard
      productItem={productItem}
      productQuantity={orderDetail?.orderItemVO?.productQuantity || 1}
      count={orderDetail?.totalAmount || 0}
      lastPay={orderDetail?.payAmount || 0}
      mode="orderDetail"
      ableNote={!!orderDetail?.canUpdateNote}
      noteValue={{
        value: noteVal,
        onChange: setNoteVal,
      }}
      isBuyer={isBuyer}
      disabledToProduct={orderDetail?.bizSource === 1}
      onProdPreview={(e, src) => {
        if (orderDetail?.bizSource !== 1) return
        e?.stopPropagation?.()
        Taro.previewImage({
          current: addWaterMarker(src),
          urls: [src].map(addWaterMarker),
        })
      }}
      rightNode={<View className="orderDetail-im" onClick={(e) => { toIm(e) }}>
        <Text className="myIcon orderDetail-im-icon">&#xe705;</Text>
        联系{isBuyer ? '卖家' : '买家'}
      </View>}
    />

    <DiscountCard type='orderDetail' isBuyer={isBuyer} preView={{
      productQuantity: orderDetail?.orderItemVO.productQuantity,
      productAmount: orderDetail?.orderItemVO.productPrice,
      freightAmount: orderDetail?.freightAmount,
      couponAmount: orderDetail?.couponAmount,
      redPacketAmount: orderDetail?.redPacketAmount,
      payAmount: orderDetail?.payAmount,
      mCouponAmount: orderDetail?.mCouponAmount
    }}></DiscountCard>

    <OrderCodeCard
      orderNo={orderDetail?.orderItemVO?.orderNo || ''}
      paymentTime={orderDetail?.paymentTime || ''}
      createTime={orderDetail?.createTime || ''}
      note={orderDetail?.canUpdateNote ? '' : orderDetail?.note}
      isBuyer={isBuyer}
      payType={getPayType(orderDetail?.payType)}
    // onChat={toIm}
    />

    {
      orderDetail &&
      <View className="OrderDetailPage--footer"
      >
        <View className="OrderDetailPage--footer-l"></View>
        {/* <View className="OrderDetailPage--footer-l">实际支付：<Text className="color-primary">￥</Text><Text className="color-primary OrderDetailPage--footer-l-num">{compose(formatMoeny, fen2yuan)(orderDetail?.payAmount)}</Text></View> */}
        <View className="OrderDetailPage--footer-r">
          {
            orderDetail && (() => {
              const { status, returnStatus } = orderDetail

              return <>
                {/* 拍卖商品 不允许取消订单 */}
                {
                  isBuyer && status === ORDER_STATUS.waitPay.value && orderDetail.orderType !== PRODUCT_TYPE.PM.value &&
                  <AtButton size="small" onClick={() => handleBtnSubmit('取消订单')} >取消订单</AtButton>
                }
                {/* 付款后 收货前 都可以发起售后 */}
                {
                  isBuyer && returnStatus !== RETURN_STATUS.ing.value && [ORDER_STATUS.waitDispatch.value, ORDER_STATUS.hasDispatch.value].includes(status) && <AtButton size="small" onClick={() => handleBtnSubmit('申请售后')}>申请售后</AtButton>
                }
                {
                  isBuyer && [
                    ORDER_STATUS.closed.value,
                    // ORDER_STATUS.hasReceive.value, 
                    ORDER_STATUS.hasNote.value,
                    ORDER_STATUS.invalid.value
                  ].includes(status) && <AtButton size="small" loading={submiting['删除订单']} onClick={() => handleBtnSubmit('删除订单')}>删除订单</AtButton>
                }

                {
                  status === ORDER_STATUS.waitPay.value && (isBuyer ? <AtButton type="primary" loading={submiting['立即支付']} disabled={submiting['立即支付disabled']} size="small" onClick={() => handleBtnSubmit('立即支付')} >立即支付</AtButton> :
                    <AtButton type="primary" size="small" onClick={() => handleBtnSubmit('提醒支付')} >提醒支付</AtButton>
                  )
                }
                {
                  status === ORDER_STATUS.waitDispatch.value && orderDetail.returnStatus !== RETURN_STATUS.ing.value && (isBuyer ? <AtButton size="small" loading={submiting['提醒发货']} type="secondary" onClick={() => handleBtnSubmit('提醒发货')}>提醒发货</AtButton> : <AtButton type="primary" size="small" onClick={() => handleBtnSubmit('立即发货')}>立即发货</AtButton>)
                }
                {
                  isBuyer &&
                  status === ORDER_STATUS.hasDispatch.value &&
                  returnStatus !== RETURN_STATUS.ing.value &&
                  <AtButton size="small" loading={submiting['确认收货']} type="secondary" onClick={() => handleBtnSubmit('确认收货')}>确认收货</AtButton>
                }
                {
                  isBuyer && status === ORDER_STATUS.closed.value && orderDetail?.bizSource !== 1 && <AtButton size="small" loading={submiting['再次购买']} type="secondary" onClick={() => handleBtnSubmit('再次购买')}>再次购买</AtButton>
                }
                {
                  isBuyer && status === ORDER_STATUS.hasReceive.value && <AtButton size="small" type="secondary" onClick={() => handleBtnSubmit('去评价')}>去评价</AtButton>
                }

                {
                  [RETURN_STATUS.ing.value].includes(returnStatus) && <AtButton size="small" type="secondary" onClick={() => handleBtnSubmit('售后详情')}>售后详情</AtButton>
                }
                {
                  !isBuyer &&
                  status === ORDER_STATUS.hasDispatch.value &&
                  <AtButton size="small" type="secondary" onClick={() => handleBtnSubmit('修改物流')}>修改物流</AtButton>
                }

              </>
            })()
          }
        </View>
      </View>
    }

    <ChoosePay
      title="订单支付"
      visible={visibles.PayFeePopup}
      onClose={() => onVisiblesChange('PayFeePopup', false)}
      payAmount={orderDetail?.payAmount || 0}
      onSubmit={handlePay}
      beforeSetPayPassword={() => {
        session.setItem('pages/other/address/index', {
          activedAddressNo: receiver?.addressNo || ''
        })
      }}
    />
    <RewardModal
      visible={rewardVisible}
      title={`${compose(formatMoeny, fen2yuan)(reward)}元下单奖励金额已入账`}
      onClose={() => setRewardVisible(false)}
      onConfirm={() => handleConfirm()}

    />
  </View>
}