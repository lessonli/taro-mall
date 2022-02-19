import PayFeePopup from "@/components/PayFeePopup";
import PayPassword from "@/components/PayPassword";
import { PAY_TYPE, PRIMARY_COLOR } from "@/constants";
import compose, { fen2yuan, formatMoeny } from "@/utils/base";
import { useRef } from "react";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";


import Popup, { PopUpLoading } from "../Popup";
import { getConfigSwitch, getStatus, sleep } from "@/utils/cachedService";
import { useAsync } from "@/utils/hooks";

export default (props: {
  visible: boolean;
  onClose: () => void;
  payAmount: number | string;
  onSubmit: (v: {
    payType: number;
    payPassword?: string;
  }) => Promise<any>;
  title?: string;
  /**
   * 默认支持余额支付
   */
  disableYUEPay?: Boolean;
  /**
   * 设置支付密码前钩子
   */
  beforeSetPayPassword?: () => void;
}) => {

  const [shows, setShows] = useState({
    PayFeePopup: false,
    PayPassword: false,
  })

  // const [ableYUEPay, setableYUEPay] = useState(false)

  const payRef = useRef()

  // useEffect(() => {
  //   getConfigSwitch().then(res => {
  //     setableYUEPay(Boolean(res?.enableBalancePayOrder))
  //   })
  // }, [])

  useEffect(() => {
    setShows({
      PayFeePopup: props.visible,
      PayPassword: false,
    })
  }, [props.visible])

  const handleToPay = async (payType) => {
    if (payType === PAY_TYPE.YE.value) {
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
              props.beforeSetPayPassword?.()
              // 跳转到支付
              Taro.navigateTo({
                url: `/pages/user/index/setPayPassword/index`
              })
            } else {
              // setShows({
              //   PayFeePopup: true,
              //   PayPassword: false,
              // })
            }
          }
        })
      } else {
        setShows({
          PayFeePopup: false,
          PayPassword: true,
        })
      }
    } else {
      // Taro.showLoading({
      //   title: '正在支付'
      // })
      return props.onSubmit({ payType }).then(() => {
        props.onClose()
      })
    }
  }

  const { run: handleYUEPay, pending } = useAsync(async (payPassword) => {
    // Taro.showLoading({
    //   title: '正在使用余额支付'
    // })
    return props.onSubmit({
      payType: PAY_TYPE.YE.value,
      payPassword,
    })
      .then(() => {
        props.onClose()
      })
      .finally(() => {
        payRef.current?.clear?.()
        // Taro.hideLoading()
        // props.onClose()
      })
  }, { manual: true })



  return <>
    <PayFeePopup
      disableYUEPay={props.disableYUEPay}
      visible={shows.PayFeePopup}
      onClose={() => {
        props.onClose()
      }}
      title={props.title || '确认付款'}
      feeType="buy"
      headerType="close"
      fee={props.payAmount}
      onSubmit={handleToPay}
    ></PayFeePopup>

    <Popup
      visible={shows.PayPassword}
      onClose={() => {
        setShows({
          PayFeePopup: true,
          PayPassword: false,
        })
      }}
      title={<PopUpLoading title="请输入余额密码" fetchPending={pending} />}
      headerType="close"
    >
      <PayPassword
        length={6}
        fee={compose(formatMoeny, fen2yuan)(props.payAmount)}
        ref={payRef}
        onSubmit={handleYUEPay}
      />
    </Popup>
  </>
}