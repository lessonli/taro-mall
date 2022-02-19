import { IResapi4618 } from '@/apis/21/api4618'
import LiveIcon from '@/components/LIveIcon'
import { XImage } from '@/components/PreImage'
import { yuzhan1 } from '@/constants/images'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
export type ILiveInfo = Required<IResapi4618>['data']
import './index.scss'
interface Iprops {
  liveInfo: ILiveInfo
}
const StoreLive = (props: Iprops) => {
  const { liveInfo } = props

  const goLive = (item) => {
    Taro.navigateTo({
      url: `/pages/live/room/index?roomId=${item.roomId}&recordId=${item.recordId}`
    })
  }

  return (
    <View className='store-live' onClick={() => { goLive(liveInfo) }}>
      <XImage className='store-live-img' src={liveInfo?.coverImg}></XImage>
      <View className='store-live-operation'>
        <View className='store-live-operation-info'>
          {liveInfo.status === 2 ? <View className='store-live-operation-info-live'>
            <Text className='line1 line'></Text>
            <Text className='line2 line'></Text>
            <Text className='line3 line'></Text>
            直播中
          </View> :
            <View className='store-live-operation-info-yuzhan'>
              <Image className='store-live-operation-info-yuzhan-img' src={yuzhan1} />
            </View>}
          {/* <LiveIcon status={liveInfo.status} ></LiveIcon> */}
          <Text className='store-live-operation-info-title'>{liveInfo?.roomName}</Text>
        </View>
        <View className='store-live-operation-see'>
          {liveInfo.status === 2 ? <Text className='store-live-operation-see-num'>{liveInfo?.viewCount}人观看</Text> : <Text className='store-live-operation-see-yz'>{dayjs(liveInfo.startTime).format('MM月DD日 HH:mm')}开播</Text>}
          {liveInfo.status === 2 && <Text className='store-live-operation-see-btn'>去观看</Text>}
        </View>
      </View>
    </View>
  )
}

export default StoreLive
