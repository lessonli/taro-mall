
import { View, Text,Image } from "@tarojs/components";
import { promote_goods_border,promote_baoKuan } from "@/constants/images";
import compose,{fen2yuan,yuan2fen,formatMoeny} from "@/utils/base";
import './index.scss'


function Single(props){  
  return <View className='promote-singleBox' onClick={()=>props.openNativeGoodDetail(props?.data?.uuid, props?.titleInfo?.activityId)}>
    <View className='promote-single'>
    <View className='promote-single-baokuan'>
       <Image className='promote-single-baokuan-img' src={promote_baoKuan}></Image>
      <View className='promote-single-baokuan-text'>{props?.titleInfo?._title}</View>
      </View>
    <View className='promote-single-goodsWraper'>
      <Image className='promote-single-goodsWraper-border' src={promote_goods_border}></Image>
      <Image className='promote-single-goodsWraper-goods' src={props?.data?.icon}></Image>
    </View>
    <View className='promote-single-goodsName'>{props?.data?.name}</View>
    <View className='promote-single-goodsprice'> {compose(fen2yuan)(props?.data?.actInfo?.actPrice || props?.data?.price)}元立即抢购</View>
  </View>
  </View>
}

export default Single