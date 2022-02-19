
import {View, Text, Image, ScrollView} from '@tarojs/components'
import dayjs from 'dayjs'
import Taro from '@tarojs/taro'
import './index.scss'

import api2868, { IResapi2868} from '@/apis/21/api2868'
export type Iprop = Required<Required<IResapi2868>['data']>['data']

function SchoolItem(props:any) {
  return (
    <View className='SchoolItem' onClick={props.handle}>
      <View className='SchoolItem-text'>
        <View className='SchoolItem-text-title'>
         {props.data.title}
        </View>
        <View className='SchoolItem-text-date'>
          <Text className='m-r-20'>{dayjs(props.data.gmtCreate).format('YYYY-MM-DD')}</Text>
          <Text>{dayjs(props.data.gmtCreate).format('HH:mm:ss')}</Text>
        </View>
      </View>
      <View className='SchoolItem-img'>
        <img className='SchoolItem-img' src={props.data.icon}></img>
      </View>
    </View>
  )
}

export default SchoolItem
