import api4838 from '@/apis/21/api4838'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'

import './index.scss'

const RedBagRules = () => {
  const [rulesInfo, setRulesInfo] = useState()
  useEffect(() => {

    api4838().then(data => {
      console.log(data);
      setRulesInfo(data?.useRule)
    })
  }, [])

  return (
    <View className='RedBagRules-rules'>
      <View className='RedBagRules-rules-text'>{rulesInfo}</View>
      {/* <View>2.红包无使用门槛，可与优惠券叠加使用，在提交订单时抵扣订单金额。</View>
      <View>3.未使用完的红包可在有效期内累计在下次使用，若超出有效期则无法继续使用。</View>
      <View>4.红包一经使用，不予返还，使用红包的订单提交后，若后续订单取消、发生售后退款，不返还订单中使用的红包。</View> */}
    </View>
  )
}

export default RedBagRules
