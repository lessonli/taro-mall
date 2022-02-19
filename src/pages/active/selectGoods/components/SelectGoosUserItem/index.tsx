import { View, Text, Image } from "@tarojs/components"
import api3482,{IResapi3482} from "@/apis/21/api3482"
import compose, {formatMoeny,fen2yuan} from "@/utils/base"
import './index.scss'


type IdataItem = Required<Required<IResapi3482>['data']>['data'][0]
interface IProps {
  data: IdataItem;
  toGoodsDetail:Function
}


function SelectGoodsUserItem(props:IProps) {
  return <View className="selectGoodsUserItem">
    <View className="selectGoodsUserItem-left">
      <Image className="selectGoodsUserItem-left-img" src={props?.data?.icon}></Image>
    </View>
    <View className="selectGoodsUserItem-right">
      <View className="selectGoodsUserItem-right-name">
       {props.data.name}

      </View>
      <View className="selectGoodsUserItem-right-tag m-t-8">
        爆品直降 限时抢购
      </View>

      <View className="selectGoodsUserItem-right-price">
        <View className="selectGoodsUserItem-right-price-info">
          <View className="selectGoodsUserItem-right-price-info-num">
            <View className="selectGoodsUserItem-right-price-info-num-price">
              <Text className="selectGoodsUserItem-right-price-info-num-price-icon">￥</Text>
              <Text className="selectGoodsUserItem-right-price-info-num-price-num">{compose(formatMoeny,fen2yuan)(props.data?.price)}</Text>
              <Text className="selectGoodsUserItem-right-price-info-num-price-originPrice">{compose(formatMoeny,fen2yuan)(props.data?.originalPrice)}</Text>
            </View>

          </View>
          <View className="selectGoodsUserItem-right-price-info-history">
            <Text className="myIcon selectGoodsUserItem-right-price-info-history-icon fz26">&#xe758;</Text>
            <Text className="m-l-8">30天历史最低价</Text>

          </View>
        </View>

        <View className="selectGoodsUserItem-right-price-buy"  onClick={()=>props.toGoodsDetail(props?.data?.uuid)}>
          去抢购
        </View>
      </View>
    </View>
  </View>
}

export default SelectGoodsUserItem