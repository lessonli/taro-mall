
import { View, Text,Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { promote_goods_border,promote_baoKuan } from "@/constants/images";
import compose,{fen2yuan,yuan2fen,formatMoeny} from "@/utils/base";
import './index.scss'

function Single(props){

  
  
  // const hanleTest = ()=>{
  //   Taro.setClipboardData({
  //     data: '##4lRYAbhPW##',
  //     success:()=>{
  //       Taro.showToast({title: '复制成功', icon:'none'})
  //     }
  //   })
  // }
  return <View className='Launch-singleBox'>
    <View className='Launch-single'>
    <View className='Launch-single-baokuan'>
       <Image className='Launch-single-baokuan-img' src={promote_baoKuan}></Image>
      <View className='Launch-single-baokuan-text'>{props?.titleInfo?._title}</View>
      </View>
    <View className='Launch-single-goodsWraper'>
      <Image className='Launch-single-goodsWraper-border'  onClick={()=>{props.toGoodsDetail(props?.data?.uuid)}} src={promote_goods_border}></Image>
      <Image className='Launch-single-goodsWraper-goods'  src={props?.data?.icon}></Image>
    </View>
    <View className='Launch-single-goodsName'>{props?.data?.name}</View>
    <View className='Launch-single-goodsprice'> 
      <View className='Launch-single-goodsprice-retail' onClick={()=>{props.toGoodsDetail(props?.data?.uuid)}} >零售价￥{compose(formatMoeny,fen2yuan)(props?.data?.price)} </View>
      <View className='Launch-single-goodsprice-snap' onClick={props.downApp} >{compose(formatMoeny,fen2yuan)(props?.data?.actInfo?.actPrice)}元抢购</View>
    </View>
    <View className='Launch-single-down' onClick={props.downApp}>
      前往博物有道App更多优惠等着你~
    </View>
  </View>
  </View>
}

export default Single