import { View, Text } from "@tarojs/components";
import Popup, { IProps as IPopupProps } from "../Popup"
import RadioList from "../RadioList";
import Taro from '@tarojs/taro'
import { PAY_TYPE } from "@/constants";
import Big from "big.js";
import compose, { formatMoeny, fen2yuan } from "@/utils/base";

import './index.scss'
import { AtButton } from "taro-ui";
import { useState, useEffect, useCallback } from "react";
import api2116 from "@/apis/21/api2116";
import paySdk from "./paySdk";
import { useDebounceFn } from "ahooks";
import { getConfigSwitch } from "@/utils/cachedService";
type IProps = IPopupProps & {
  onSubmit?: (v: number) => Promise<any>;
  onSubmitSuccess?: (res: any) => void;
  feeType: 'deposit' | 'buy' | 'yearVip',
  fee: string | number;
  /**
   * 描述内容
   */
  desc?: React.ReactNode;
  feeName?: React.ReactNode;
  // 使用余额支付
  disableYUEPay?: boolean;
}


export default (props: IProps) => {

  const [way, setWay] = useState(PAY_TYPE.WX.value)
  const [payTypes, setpayTypes] = useState([PAY_TYPE.WX]);

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    getConfigSwitch().then(res => {
      setpayTypes(
        (Boolean(res?.enableBalancePayOrder) && !props.disableYUEPay) ?
        [PAY_TYPE.WX, PAY_TYPE.YE] :
        [PAY_TYPE.WX]
      )
    })
  }, [])

  useEffect(() => {
    if (!props.visible) return
    api2116().then((res) => {
      setpayTypes(payTypes.map(item => {
        if (item.value === PAY_TYPE.YE.value) {
          
          return {
            ...item,
            desc: `可用余额${compose(formatMoeny, fen2yuan)(res?.availableAmount || 0)}元`,
            availableAmount: res?.availableAmount,
          }
        }
        return item
      }))
    })
  }, [props.visible]);

  const {run: handlesubmit} = useDebounceFn(()=>{
    // 判断余额
    if (way === PAY_TYPE.YE.value) {
      const { availableAmount } = payTypes.find(item => item.value === PAY_TYPE.YE.value)
      if (availableAmount < Number(props.fee)) {
        Taro.showToast({
          title: '余额不足',
          icon: 'none',
        })
        return
      }
    }

    if (props.onSubmit) {
      setDisabled(true)
      props.onSubmit?.(way).finally(() => {
        setDisabled(false)
      })
    } else {
      // paySdk()
    }
  })

  return <Popup
    {...props}
  >
    <View className="payFee-component">
      {
        !props.desc && props.feeType === 'deposit' && <View className="payFee-component-header">
        商家设置了保证金，本次出价需支付保证金，如违约违规，将按照<Text className="payFee-component-header__text" onClick={() => {
          Taro.navigateTo({
            url: `/pages/webview/index?name=${encodeURIComponent('保证金规则')}`
          })
        }}>保证金规则</Text>进行赔付和处理
        </View>
      }
      {/* 开店的协议 */}
      {
        !props.desc && props.feeType === 'yearVip' && <View className="payFee-component-header">
        支付即同意<Text className="payFee-component-header__text" onClick={() => {
          Taro.navigateTo({
            url: `/pages/webview/index?name=${encodeURIComponent('博物有道卖家入驻协议')}`
          })
        }}>《卖家入驻协议》</Text>开店认证有效期为365天，认证费用缴纳后。开店成功，认证费用不予退还。
        </View>
      }

      {
        props.desc && <View className="payFee-component-header">{props.desc}</View>
      }

      <View className="payFee-component-content">
        <View className="payFee-component-content__1">
          { props.feeType === 'deposit' && '保证金' }
          { props.feeType === 'buy' && '支付金额' }
          {
            props.feeType === 'deposit' && <Text className="payFee-component-content__1-tag">全额退</Text>
          }
          {
            props.feeName
          }
        </View>
        <View className="payFee-component-content__2">
          <Text className='payFee-component-content__2_money'>
            ￥ <Text className="payFee-component-content__2-num">{compose(formatMoeny, fen2yuan
            )(props.fee)}</Text>
          {props.feeType ==='yearVip' && <Text className="payFee-component-content__2_money_icon">限时价</Text>}
          </Text>
        {/* tag: 限时价 */}
        </View>

        <View className="payFee-component-content__3">选择付款方式</View>
        <RadioList radioListOption={payTypes} defaultValue={way} onChange={setWay}></RadioList>

        <AtButton type="primary" className="payFee-component-content__submit" onClick={handlesubmit} disabled={disabled}>安全支付</AtButton>
      </View>

    </View>
  </Popup>
}