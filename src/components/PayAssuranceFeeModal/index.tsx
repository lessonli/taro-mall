import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'

import './index.scss'
import { useState, useEffect } from 'react';

import Popup, { IProps as IPopupProps } from "@/components/Popup";
import classNames from 'classnames';
import { getMargins } from '@/utils/cachedService';
import compose, { formatMoeny, fen2yuan } from '@/utils/base';

interface IProps extends IPopupProps {
  value: number;
  onChange: (v: number) => void;
}

export default (props: IProps) => {

  const [margins, setmargins] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getMargins()
      setmargins(res || [])
    })()
  })

  return (
    <Popup
      {...props}
      title="设置保证金"
      headerType="close"
    >
      <View className="PayAssuranceFeeModal">
        <View className="bw-desc">设置保证金后，买卖双方均需缴纳，正常交易后原路全额退回，如一方违约，将赔付给对方。</View>

        <View className="PayAssuranceFeeModal-content float ">
          {
            margins.map(fee => {
              const classname = classNames(
                'PayAssuranceFeeModal-content__item',
                {
                  'PayAssuranceFeeModal-content__item-active': props.value === fee
                }
              )
              return <View key={fee.toString()} className={classname} onClick={() => props.onChange(fee)}>{compose(formatMoeny, fen2yuan)(fee)}元</View>
            })
          }
        </View>
      </View>
    </Popup>
  )
}