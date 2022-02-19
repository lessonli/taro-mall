
import {View, Text, Image, ScrollView} from '@tarojs/components'

import './index.scss'



function SchoolItem() {
  return (
    <View className='SchoolItem'>
      <View className='SchoolItem-text'>
        <View className='SchoolItem-text-title'>
          文章的名称最多显示一
          文章的名称最多显示一
        </View>
        <View className='SchoolItem-text-date'>2021-06-14 23:33:33</View>
      </View>
      <View className='SchoolItem-img'>
        <img className='SchoolItem-img' src='https://picsum.photos/id/382/125/75'></img>
      </View>
    </View>
  )
}

export default SchoolItem
