
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";

import compose, {formatMoeny, fen2yuan, countDownTimeStr} from "@/utils/base";
import { XImage } from "@/components/PreImage";
import api3392, {IResapi3392} from "@/apis/21/api3392";

import './index.scss'


type IItem = Required<Required<IResapi3392>['data']>['data'][0]
interface Iprop  {
  data: IItem & {desc:string};

  openPay: (data: IItem) => void;
  toGoodsDetail: ()=>void;
}

function ListItem(props: Iprop){
  const  {data , openPay, toGoodsDetail} = props
  return <>
    <View className='bw-leak-list-listItem' onClick={()=>toGoodsDetail(data?.uuid)}>
     <View className='bw-leak-list-listItem-imgWrap'>
        <XImage className='bw-leak-list-listItem-img'  src={data?.icon as string} query={{ 'x-oss-process': 'image/resize,w_340/quality,q_100' }} />
        <View className='bw-leak-list-listItem-imgWrap-djs'>
          <Text className='bw-leak-list-listItem-imgWrap-djs-text'>{data?.desc}</Text>
        </View>
     </View>

      <View className='bw-leak-list-listItem-content'>
        <Text className='bw-leak-list-listItem-content-title'>{data?.name}</Text>
        <View className='bw-leak-list-listItem-content-priceInfo'>
          
          { 
            data?.auction?.auctionNum > 0 && <View className='bw-leak-list-listItem-content-priceInfo-price fw600'> 
            <Text className='bw-leak-money'>￥</Text> 
            {compose(formatMoeny, fen2yuan)(data?.auction?.lastAucPrice)}元</View>
          }

          {
            data?.auction?.auctionNum === 0 && <View className='bw-leak-list-listItem-content-priceInfo-price'> <Text className='fz24 fw600'>￥</Text>{compose(formatMoeny, fen2yuan)(data?.auction?.initPrice)}<Text className='fz24 fw600'>起</Text> </View>
          }
          {
            data?.auction?.auctionNum > 0 &&  <View className='bw-leak-list-listItem-content-priceInfo-number'>已出价<Text className='tipText'>{data?.auction.auctionNum}</Text>次</View>
          }
        </View>
        {data?.auction?.status === 1 && <AtButton className='bw-leak-list-listItem-content-add bw-leak-list-listItem-content-overBtn' type='primary'>拍卖已结束</AtButton>}
        {data?.auction?.status !==1 &&  (!data?.auction?.ahead) &&   <AtButton className='bw-leak-list-listItem-content-add' onClick={(e)=>{openPay(); e.stopPropagation()}} type='primary' >加{compose(fen2yuan)(data?.auction?.markUp)}元出价</AtButton>}
        {(data?.auction?.ahead ) && ( data?.auction?.status !==1) &&  <AtButton className='bw-leak-list-listItem-content-add' type='primary'>您已领先</AtButton> }
        
      </View>
      
    </View>
  </>
}

export default ListItem