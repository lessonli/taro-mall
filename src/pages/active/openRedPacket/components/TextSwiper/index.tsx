import Taro from '@tarojs/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import { useMemo } from 'react'
import { View,Text,Image } from '@tarojs/components'
import compose,{formatMoeny,fen2yuan} from '@/utils/base'
import './index.scss'


function TextSwiper(props){
  const TextSwipoer = useMemo(()=>{
    return <Swiper
    className='textSwiper-box'
    vertical
    circular
    interval={3000}
    indicatorDots={false}
    autoplay>
      {
        props?.recordList.map((item,idx)=>{
          return  <SwiperItem key={idx} className='textSwiper-box-item'>
          <View className='textSwiper-box-item-box'>
            <Image className='textSwiper-box-item-box-img' src={item?.headImg} ></Image>
            <Text className='textSwiper-box-item-box-text'>
              {item?.nickName}
              {( props.type === 'action' || props.type === 'liveList') ? '领取红包':'分享红包获得'}
             
            </Text>
            <Text>{fen2yuan(item?.rewardAmount)}</Text>元
          </View>
        </SwiperItem>
        })
      }
   
  </Swiper>
  },[props?.recordList])
  
 return <View className='textSwiper'>
    {TextSwipoer}
  </View>

}

export default TextSwiper