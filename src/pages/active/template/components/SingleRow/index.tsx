import { View, Text } from "@tarojs/components"
import { XImage } from "@/components/PreImage"
import { AtButton } from "taro-ui"
import compose, { formatMoeny, fen2yuan } from "@/utils/base";

import { IResapi3482 } from "@/apis/21/api3482";
import './index.scss'

type Idata = Required<Required<IResapi3482>['data']>['data'][0]

interface IItem {
  data: Idata;
  toGoodsDetail: (uuid: string) => void;
}


function SingleRow(props: IItem) {
  const { data, toGoodsDetail } = props

  return <View className='bw-template-singleRow' onClick={() => toGoodsDetail(data.uuid as string)}>
    <View className='bw-template-singleRow-goodsImage'>
      <XImage className='bw-template-singleRow-goodsImage-img' src={data.icon} query={{
        'x-oss-process': 'image/resize,w_212/quality,q_100'
      }}></XImage>
    </View>
    <View className='bw-template-singleRow-info' >
      <View className='bw-template-singleRow-info-tit'>{data.name}</View>
      <View className='bw-template-singleRow-info-tip'>已售{data.totalSales}件</View>
      {
        !data?.actInfo?.actPrice && <View className='bw-template-singleRow-info-price m-t-44'>
          <View className='color-primary '>
            <View>
              <Text className='fz24 fw600 color-primary'>￥</Text>
              <Text className='fz36'>{compose(formatMoeny, fen2yuan)(data.price)}</Text>
              <Text className='line-throw fz24 m-l-8 color999'>￥{compose(formatMoeny, fen2yuan)(data.originalPrice)}</Text>
            </View>

          </View>
          <AtButton size='small' type='primary' className='bw-template-singleRow-info-price-btn'>立即购买</AtButton>
        </View>
      }
      {
        data?.actInfo?.actPrice && <View>
          <View className='bw-template-single-info-price-subsidy m-t-4'>已补贴{compose(formatMoeny,fen2yuan)(props?.data?.price - props?.data?.actInfo?.actPrice)|| 0}元</View>
          <View className='bw-template-singleRow-info-price '>

          <View className='color-primary '>
            <View>
              <Text className='fz24 fw600 color-primary'>￥</Text>
              <Text className='fz36'>{compose(formatMoeny, fen2yuan)(data.price)}</Text>
              <Text className='line-throw fz24 m-l-8 color999'>￥{compose(formatMoeny, fen2yuan)(data.originalPrice)}</Text>
            </View>

          </View>
          <AtButton className='fz28 m-t-12 bw-template-singleRow-info-price-btn' type='primary' size='small'>{compose(formatMoeny, fen2yuan)(props?.data?.actInfo?.actPrice)}元到手</AtButton>
        </View>
        </View>
      }
    </View>
  </View>
}

export default SingleRow