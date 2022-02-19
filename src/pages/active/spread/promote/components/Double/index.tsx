

import { View, Text, Image } from "@tarojs/components";
import { promote_goods_double_border, promote_baoKuan } from "@/constants/images";
import compose,{fen2yuan,yuan2fen, formatMoeny} from "@/utils/base";
import './index.scss'

function Double(props) {

  console.log(props);
  
  let [firstData, secondData] = props?.data|| []  
  
  return <View className='promote-doubleBox'>
    <View className='promote-double'>
      <View className='promote-double-baokuan'>
        <Image className='promote-double-baokuan-img' src={promote_baoKuan}></Image>
        <View className='promote-double-baokuan-text'>{props?.titleInfo?._title}</View>
      </View>
      <View className='promote-double-goodsWraper'>
        <View className='promote-double-goodsWraper-item'  onClick={()=>props.openNativeGoodDetail(firstData?.uuid, props?.titleInfo?.activityId)}>
          <Image className='promote-double-goodsWraper-item-border' src={promote_goods_double_border}></Image>
          <Image className='promote-double-goodsWraper-item-goods' src={firstData?.icon}></Image>
          <View className='promote-double-goodsWraper-item-goodsName'>{firstData?.name}</View>
          <View className='promote-double-goodsWraper-item-goodsprice'> {compose(formatMoeny,fen2yuan)(firstData?.actInfo?.actPrice || firstData?.price)}元立即抢购</View>
        </View>
        <View className='promote-double-goodsWraper-item'  onClick={()=>props.openNativeGoodDetail(secondData?.uuid,  props?.titleInfo?.activityId)} >
          <Image className='promote-double-goodsWraper-item-border' src={promote_goods_double_border}></Image>
          <Image className='promote-double-goodsWraper-item-goods' src={secondData?.icon}></Image>
          <View className='promote-double-goodsWraper-item-goodsName'>{secondData?.name}</View>
          <View className='promote-double-goodsWraper-item-goodsprice'> {compose(formatMoeny,fen2yuan)(secondData?.actInfo?.actPrice || secondData?.price ) }元立即抢购</View>
        </View>
      </View>

    </View>
  </View>
}

export default Double