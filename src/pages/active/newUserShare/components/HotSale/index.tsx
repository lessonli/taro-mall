import { View, Text, Image } from "@tarojs/components";
import { XImage } from "@/components/PreImage";
import compose, { fen2yuan, formatMoeny } from "@/utils/base";
import { hostSaleFire, hotSaleTop1 } from "@/constants/images";
import './index.scss'
import api3482, { IResapi3482 } from "@/apis/21/api3482";

type IData = Required<Required<IResapi3482>['data']>['data'][0]
interface Iprops {
  data: IData & { _title: string | undefined, hotTopImg: string | undefined },
  toGoodsDetail: (id) => void
}

function HotSale(props: Iprops) {
  // console.log(props, 'props');

  return <View className='hotSale' onClick={() => props.toGoodsDetail(props.data.uuid as string)}>
    <View className='hotSale-img'>
      <XImage className='hotSale-img-ele' src={props.data.icon} />
      {props.data.hotTopImg && <Image className='hotSale-img-ele-top' src={props.data?.hotTopImg}></Image>}

    </View>
    <View className='hotSale-text'>
      {props.data._title && <View className='hotSale-text-label'>
        <View className='hotSale-text-label-con'>
          <Image className='hotSale-text-label-con-img' src={hostSaleFire}></Image>
          <Text className='hotSale-text-label-con-name'>{props.data._title}</Text>
        </View>
      </View>}

      <View className='hotSale-text-name'>{props.data.name}</View>
      <View className='hotSale-text-price'>￥{compose(formatMoeny, fen2yuan)(props.data.price)}</View>
    </View>
  </View>
}

export default HotSale