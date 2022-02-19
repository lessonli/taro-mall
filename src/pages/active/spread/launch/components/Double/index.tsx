

import { View, Text, Image } from "@tarojs/components";
import { promote_goods_double_border, promote_baoKuan } from "@/constants/images";
import './index.scss'
import compose, { fen2yuan, formatMoeny } from "@/utils/base";


function Double(props) {
  let [firstData, secondData] = props?.data||[]
  return <View className='Launch-doubleBox'>
    <View className='Launch-double'>
      <View className='Launch-double-baokuan'>
        <Image className='Launch-double-baokuan-img' src={promote_baoKuan}></Image>
        <View className='Launch-double-baokuan-text'>{props?.titleInfo?._title}</View>
      </View>
      <View className='Launch-double-goodsWraper'>
        <View className='Launch-double-goodsWraper-item'>
          <Image className='Launch-double-goodsWraper-item-border'  onClick={()=>props.toGoodsDetail(firstData.uuid as string)} src={promote_goods_double_border}></Image>
          <Image className='Launch-double-goodsWraper-item-goods' src={firstData?.icon}></Image>
          <View className='Launch-double-goodsWraper-item-goodsName'>{firstData?.name}</View>
          <View className='Launch-double-goodsWraper-item-goodsprice' onClick={props.downApp} > {compose(formatMoeny,fen2yuan)(firstData?.actInfo?.actPrice)}元立即抢购</View>
          <View className='Launch-double-goodsWraper-item-retail' onClick={()=>{props.toGoodsDetail(firstData?.uuid)}}  >零售价￥{compose(formatMoeny,fen2yuan)(firstData?.price)} </View>
        </View>
        <View className='Launch-double-goodsWraper-item'>
          <Image className='Launch-double-goodsWraper-item-border' src={promote_goods_double_border}   onClick={()=>props.toGoodsDetail(secondData.uuid)} ></Image>
          <Image className='Launch-double-goodsWraper-item-goods' src={secondData?.icon}></Image>
          <View className='Launch-double-goodsWraper-item-goodsName'>{secondData?.name}</View>
          <View className='Launch-double-goodsWraper-item-goodsprice' onClick={props.downApp}> {compose(formatMoeny,fen2yuan)(secondData?.actInfo?.actPrice)}元立即抢购</View>
          <View className='Launch-double-goodsWraper-item-retail' onClick={()=>{props.toGoodsDetail(secondData?.uuid)}} >零售价￥{compose(formatMoeny,fen2yuan)(secondData?.price)} </View>
        </View>
      </View>

    </View>
  </View>
}

export default Double