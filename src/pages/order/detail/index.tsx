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
    '????????????': false,
    '????????????disabled': false,
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
      // ????????? ?????????
      const startTime = res?.operateTimeout
      // const startTime = res?.createTime
      const updateTime = async () => {
        const r = countDownTimeStr(
          dayjs(startTime).valueOf(),
          timeDifferenceRef.current,
        )
        if (r !== null) {
          setDesc(`?????????????????? ${r.hh}:${r.mm}:${r.ss}`)
        } else {
          // ???????????? ????????????????????????????????????????????????
          console.log('??????')
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

    // ?????????????????? ???????????????
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
          '????????????disabled': false,
        })
        // ?????????????????????
        api2628({ orderNo, addressNo })
      }
    } else if (res?.canUpdateAddress && !res?.orderAddressVO && !addressNo && isBuyer) {
      // ????????????
      const res = await api2260()
      const v = res?.find(item => item.isDefault)
      setReceiver(v)
      if (v) {
        setSubmiting({
          ...submiting,
          '????????????disabled': false,
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
        '????????????disabled': false,
      })
    }

  }, [])

  useDidShow(async () => {

    console.log('useDidShow')
    const userCurrentPosition = await getCachedOrderRule(page.router?.params.orderNo)
    // 0??????, 1??????
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
      console.log('????????????')
      clearInterval(interRef.current)
    };
  }, []);
  useDidHide(() => {
    console.log('useDidHide')
    clearInterval(interRef.current)
  })

  const handleYUEPayOrder = useCallback((passwords) => {
    // ????????????
    Taro.showLoading({
      title: '????????????????????????'
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

    // ????????????????????????
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
    if (name === '????????????') {
      Taro.showModal({
        title: '??????',
        content: '??????????????????????????????????????????',
        confirmColor: PRIMARY_COLOR,
        confirmText: '??????',
        cancelText: '??????',
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

    if (name === '????????????') {
      // ??????????????????????????????
      if (receiver === undefined) {
        return Taro.showToast({
          icon: 'none',
          title: '??????????????????????????????'
        })
      }
      // ?????????????????? ?????????????????????
      // if (orderDetail?.orderAddressVO.)
      await upDateNote()
      console.log('????????????')
      // setvisibles({ ...visibles, PayFeePopup: true })
      Taro.navigateTo({
        url: `/pages/order/pay/index?orderNo=${orderDetail?.uuid}&payAmount=${orderDetail?.payAmount}`
      })
    }
    if (name === '????????????') {

      Taro.showModal({
        confirmColor: PRIMARY_COLOR,
        confirmText: '??????',
        content: '?????????????????????????????????',
        success: async (result) => {
          if (!result.confirm) return
          Taro.showLoading({
            title: '???????????????'
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

    if (name === '????????????') {
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

    if (name === '????????????') {
      Taro.navigateTo({
        url: `/pages/order/afterSale/applyReturn/index?orderNo=${orderNo}`
      })
    }

    if (name === '????????????') {
      Taro.navigateTo({
        url: `/pages/order/afterSale/detail/index?orderNo=${orderNo}&orderReturnNo=${orderDetail.orderReturnNo}`
      })
    }

    if (name === '?????????') {
      Taro.navigateTo({
        url: `/pages/order/evaluation/index?orderNo=${orderNo}&productId=${productId}&sourceUrl=${encodeURIComponent(page.router?.path || '')}`
      })
    }

    if (name === '????????????') {
      Taro.showModal({
        content: '????????????????????????????????????????????????????????????????????????????????????????????????',
        confirmColor: PRIMARY_COLOR,
        confirmText: '????????????',
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

    if (name === '????????????') {
      api1732({ orderNo }).then(() => {
        Taro.showToast({
          icon: 'none',
          title: '?????????????????????'
        })
      })
    }
    // ????????????
    if (name === '????????????') {
      // TODO???im
      await api3686({ orderNo })
      Taro.showToast({
        icon: 'none',
        title: '?????????????????????'
      })
    }

    if (name === '????????????') {
      Taro.navigateTo({
        url: `/pages/order/dispatch/index?orderNo=${orderNo}`
      })
    }

    if (name === '????????????') {
      Taro.navigateTo({
        url: `/pages/order/dispatch/index?orderNo=${orderNo}`
      })
    }

  }, [orderDetail, noteVal, receiver])
  // console.log('receiver', receiver)

  const getPayType = (type) => {
    let str = ''
    if (type === 0) {
      str = '?????????'
    } else if (type === 1) {
      str = '????????????'
    } else if (type === 3) {
      str = '????????????'
    } else if (type === 21) {
      str = '??????+??????'
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
          if (!isBuyer && orderDetail?.status === ORDER_STATUS.waitPay.value) return '?????????????????????'
          if (isBuyer && orderDetail?.status === ORDER_STATUS.waitDispatch.value) return '?????????????????????'
          if (!isBuyer && orderDetail?.status === ORDER_STATUS.hasReceive.value && orderDetail.returnStatus === RETURN_STATUS.none.value) return '???????????????????????????'
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
        offLineMsg: '?????????????????????????????????~'
      }

      // ??????app H5????????????????????????
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
          // ?????????????????????????????????????????????????????????????????????????????????????????? App ???????????????????????? kill ?????????????????????????????????????????????????????????????????????
          offlinePushInfo: {
            title: userInfo?.nickName, // ??????????????????
            description: '?????????????????????????????????~', // ??????????????????
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
      title={isBuyer ? '????????????' : '??????????????????'}
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
        ??????{isBuyer ? '??????' : '??????'}
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
        {/* <View className="OrderDetailPage--footer-l">???????????????<Text className="color-primary">???</Text><Text className="color-primary OrderDetailPage--footer-l-num">{compose(formatMoeny, fen2yuan)(orderDetail?.payAmount)}</Text></View> */}
        <View className="OrderDetailPage--footer-r">
          {
            orderDetail && (() => {
              const { status, returnStatus } = orderDetail

              return <>
                {/* ???????????? ????????????????????? */}
                {
                  isBuyer && status === ORDER_STATUS.waitPay.value && orderDetail.orderType !== PRODUCT_TYPE.PM.value &&
                  <AtButton size="small" onClick={() => handleBtnSubmit('????????????')} >????????????</AtButton>
                }
                {/* ????????? ????????? ????????????????????? */}
                {
                  isBuyer && returnStatus !== RETURN_STATUS.ing.value && [ORDER_STATUS.waitDispatch.value, ORDER_STATUS.hasDispatch.value].includes(status) && <AtButton size="small" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>
                }
                {
                  isBuyer && [
                    ORDER_STATUS.closed.value,
                    // ORDER_STATUS.hasReceive.value, 
                    ORDER_STATUS.hasNote.value,
                    ORDER_STATUS.invalid.value
                  ].includes(status) && <AtButton size="small" loading={submiting['????????????']} onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>
                }

                {
                  status === ORDER_STATUS.waitPay.value && (isBuyer ? <AtButton type="primary" loading={submiting['????????????']} disabled={submiting['????????????disabled']} size="small" onClick={() => handleBtnSubmit('????????????')} >????????????</AtButton> :
                    <AtButton type="primary" size="small" onClick={() => handleBtnSubmit('????????????')} >????????????</AtButton>
                  )
                }
                {
                  status === ORDER_STATUS.waitDispatch.value && orderDetail.returnStatus !== RETURN_STATUS.ing.value && (isBuyer ? <AtButton size="small" loading={submiting['????????????']} type="secondary" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton> : <AtButton type="primary" size="small" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>)
                }
                {
                  isBuyer &&
                  status === ORDER_STATUS.hasDispatch.value &&
                  returnStatus !== RETURN_STATUS.ing.value &&
                  <AtButton size="small" loading={submiting['????????????']} type="secondary" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>
                }
                {
                  isBuyer && status === ORDER_STATUS.closed.value && orderDetail?.bizSource !== 1 && <AtButton size="small" loading={submiting['????????????']} type="secondary" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>
                }
                {
                  isBuyer && status === ORDER_STATUS.hasReceive.value && <AtButton size="small" type="secondary" onClick={() => handleBtnSubmit('?????????')}>?????????</AtButton>
                }

                {
                  [RETURN_STATUS.ing.value].includes(returnStatus) && <AtButton size="small" type="secondary" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>
                }
                {
                  !isBuyer &&
                  status === ORDER_STATUS.hasDispatch.value &&
                  <AtButton size="small" type="secondary" onClick={() => handleBtnSubmit('????????????')}>????????????</AtButton>
                }

              </>
            })()
          }
        </View>
      </View>
    }

    <ChoosePay
      title="????????????"
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
      title={`${compose(formatMoeny, fen2yuan)(reward)}??????????????????????????????`}
      onClose={() => setRewardVisible(false)}
      onConfirm={() => handleConfirm()}

    />
  </View>
}