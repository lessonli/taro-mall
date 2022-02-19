import { View, Text, Image } from "@tarojs/components"
import { XImage } from "@/components/PreImage"
import { AtButton } from "taro-ui"
import compose, {formatMoeny, fen2yuan} from "@/utils/base";
import {IResapi3482} from "@/apis/21/api3482";

import './index.scss'

type Idata = Required<Required<IResapi3482>['data']>['data'][0]

interface IItem {
  data: Idata;
  toGoodsDetail: (uuid:string)=> void;
}


function DoubleRow(props: IItem) {
  const {data, toGoodsDetail} = props
  return <>
    <View className='bw-template-doubleRow' onClick={()=>toGoodsDetail(data.uuid as string)}>
      <View className='bw-template-doubleRow-headImg'>
        <XImage  className='bw-template-doubleRow-headImg-img' src={data?.icon as string} query={{ 'x-oss-process': 'image/resize,w_340/quality,q_100' }}></XImage>
      </View>
      <View className='bw-template-doubleRow-info'>
        <View className='bw-template-doubleRow-info-title'>{data.name}</View>
        {
          data?.actInfo?.actPrice && <> <View className='bw-template-doubleRow-info-price'>
          <View className='bw-template-doubleRow-info-price-num'>
            <Text className='color-primary fz28 fw600'>￥</Text>
            <Text className='color-primary fz36'>{compose(formatMoeny, fen2yuan)(data?.price)}</Text>
            <Text className='line-throw fz24'>￥{compose(formatMoeny, fen2yuan)(data?.originalPrice)}</Text>
          </View>
          <View className='bw-template-doubleRow-info-price-subsidy'>已补贴{compose(formatMoeny,fen2yuan)(props?.data?.price - props?.data?.actInfo?.actPrice)|| 0}元</View>
        </View>
        <AtButton className='fz28 m-t-12' type='primary' size='small'>{compose(formatMoeny, fen2yuan)(props?.data?.actInfo?.actPrice)}元到手</AtButton></>
        }
       
        {
          !data?.actInfo?.actPrice &&  <>
                    <View>
          <Text className='color-primary fz28 fw600'>￥</Text>
          <Text className='color-primary fz36'>{compose(formatMoeny, fen2yuan)(data?.price)}</Text>
          <Text className='line-throw fz24 m-l-16'>￥{compose(formatMoeny, fen2yuan)(data?.originalPrice)}</Text>
        </View>
        <AtButton className='fz28 m-t-12' type='primary' size='small'>立即购买</AtButton>
          </>
        }
        
       
      </View>
    </View>
  </>
}

export default DoubleRow