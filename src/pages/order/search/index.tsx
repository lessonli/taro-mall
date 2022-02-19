import { session } from "@/utils/storge"
import { View, Text, Button } from "@tarojs/components"
import { useRef, useState } from "react"
import Taro, { useDidShow } from "@tarojs/taro";

import './index.scss'
import { useEffect } from "react";
import { sleep } from "@/utils/cachedService";

export default () => {

  const userCurrentPosition = session.getItem('userCurrentPosition')

  const opts = {
    orderNo: '订单编号',
    productName: '商品名称',
    receiverName: '收件人全名',
    receiverPhone: '收件人手机号',
    expressNumber: '物流单号',
  }
  const [visible, setVisible] = useState(false)
  const [currentKey, setCurrentKey] = useState<string>(session.getItem('pages/order/search/index:currentKey') as string)
  const [value, setValue] = useState('')

  const [autoFocus, setautoFocus] = useState(false)

  // useEffect(() => {
  //   sleep(1000).then(() => {
  //     setautoFocus(true)
  //   })
  // }, [])
  useDidShow(() => {
    setautoFocus(true)
  })

  const inputRef = useRef<HTMLInputElement>()

  const toggleKey = (e: Event, key: string) => {
    e?.stopPropagation()
    setCurrentKey(key)
    session.setItem('pages/order/search/index:currentKey', key)
    setVisible(false)
  }

  const resetVal = () => {
    setValue('')
  }

  const updateValue = (e: InputEvent) => {
    setValue(e.target?.value)
  }

  const onKeyDown = (e) => {
    if (e.which === 13 || e.keyCode === 13) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!value.trim()) return Taro.showToast({
      title: '请输入搜索内容',
      icon: 'none'
    })
    const data = {
      [currentKey]: value
    }
    // 订单 => 搜索 => 订单 => 搜索
    session.setItem('pages/order/search/index', data)
    Taro.redirectTo({
      url: `/pages/order/list/index`
    })
  }

  return <View className="ordersearch full-screen-page" onClick={() => setVisible(false)}>
    <View className="flex ordersearch-box">
      <View className="ordersearch-container fz26 color333">
        <View className="ordersearch-container-keys">
          <View onClick={(e) => {
            e?.stopPropagation()
            setVisible(true)
          }}>
            <Text>{opts[currentKey]}</Text>
            <Text className={`myIcon toggle-btn`}>&#xe71e;</Text>
          </View>
          <View className={`ordersearch-selector ${visible ? 'ordersearch-selector_show' : 'ordersearch-selector_hidden'}`}>
            {
              Object.keys(opts).map(key => {
                const a = key === currentKey ? 'ordersearch-selector-item_active' : ''
                return <View key={key} className={`ordersearch-selector-item ${a}`} onClick={e => toggleKey(e, key)}>{opts[key]}</View>
              })
            }
          </View>
        </View>
        <View className="ordersearch-container-value">
          <input className="ordersearch-input fz26" placeholder={`请输入${opts[currentKey]}`} value={value} onInput={updateValue} autoFocus={autoFocus} type="search" onKeyPress={onKeyDown}/>
        </View>
        <Text className={`myIcon del-icon ${value.length > 0 ? 'del-icon_visible' : ''}`} onClick={resetVal}>&#xe723;</Text>
      </View>
      <Text className="ordersearch-btn" onClick={handleSubmit}>搜索</Text>
    </View>
  </View>
}