import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'

import './index.scss'
import { useState, useEffect } from 'react';

import Popup, { IProps as IPopupProps } from "@/components/Popup";
import classNames from 'classnames';

const fees = [0,1,20,30,40,100, 200, 3000, 5000, 8000,]

interface IProps extends IPopupProps {
  value: number;
  onChange: (v: number) => void;
}

export default (props: IProps) => {

  return (
    <Popup
      {...props}
      title="设置保证金"
      headerType="close"
    >
      <View className="PickAssuranceFee">
        <View className="bw-desc">设置保证金后，买卖双方均需缴纳，正常交易后原路全额退回，如一方违约，将赔付给对方。</View>

        <View className="PickAssuranceFee-content float ">
          {
            fees.map(fee => {
              const classname = classNames(
                'PickAssuranceFee-content__item',
                {
                  'PickAssuranceFee-content__item-active': props.value === fee
                }
              )
              return <View key={fee.toString()} className={classname} onClick={() => props.onChange(fee)}>{fee}元</View>
            })
          }
        </View>
      </View>
    </Popup>
  )
}