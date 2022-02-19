import { View, Text, Image } from "@tarojs/components"

import api3482, { IResapi3482 } from "@/apis/21/api3482"
import compose, { fen2yuan, formatMoeny } from "@/utils/base"

import './index.scss'

type IdataItem = Required<Required<IResapi3482>['data']>['data'][0]
interface IProps {
  data: IdataItem;
  toGoodsDetail: Function
  onShare: (uuid: string) => any;
}


function SelectGoodsMerchantItem(props: IProps) {

  return <View className="selectGoodsMerchantItem" >
    <View className="selectGoodsMerchantItem-left" onClick={() => props.toGoodsDetail(props.data.uuid)}>
      <Image className="selectGoodsMerchantItem-left-img" src={props.data.icon}></Image>
    </View>
    <View className="selectGoodsMerchantItem-right">
      <View className="selectGoodsMerchantItem-right-name">
        {props.data.name}

      </View>
      {
        props.data.sDistPercent && <View className="selectGoodsMerchantItem-right-tag">
          {props.data.sDistPercent}%佣金

        </View>
      }


      <View className="selectGoodsMerchantItem-right-price">
        <View className="selectGoodsMerchantItem-right-price-info">
          <View className="selectGoodsMerchantItem-right-price-info-price">
            <Text className="selectGoodsMerchantItem-right-price-info-price-icon">￥</Text>
            <Text className="selectGoodsMerchantItem-right-price-info-price-num">{compose(formatMoeny, fen2yuan)(props.data?.price)}</Text>
          </View>
          <View className="selectGoodsMerchantItem-right-price-info-share">
            <View className="selectGoodsMerchantItem-right-price-info-share-money">
              <Text className="fz22">赚</Text><Text className="fz22">￥</Text>{compose(formatMoeny, fen2yuan)(props.data.price * (props.data.sDistPercent / 100))}
            </View>
            <View className="selectGoodsMerchantItem-right-price-info-share-text" onClick={() => props.onShare(props.data.uuid)}>去分享</View>
          </View>
        </View>


      </View>
    </View>
  </View>
}

export default SelectGoodsMerchantItem