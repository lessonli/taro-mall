import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'

import './index.scss'

const CityPicker = () => {
  const state = {
    province: '',
    city: '',
    area: '',
    pickerShow: false,
    value: [0, 0, 0],
    provinces: '北京',
    citys: '北京',
    areas: '北京',
    ranges: [['北京', '啊说'], ['天津'], ['第三方']],
  }
  const handlePickerShow = () => {
    console.log(1);

  }
  const columnChange = () => {
    console.log(2);

  }
  return (
    <div>
      <Picker mode='multiSelector' range={state.ranges} onChange={handlePickerShow} onColumnChange={columnChange}>
        <View>
          {state.province && <View>{state.province} {state.city} {state.area}</View>}
          {!state.province && <View>请选择地区</View>}
        </View>
      </Picker>
    </div>
  )
}

export default CityPicker