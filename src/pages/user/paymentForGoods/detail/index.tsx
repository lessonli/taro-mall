import { View,Text, Image} from "@tarojs/components";
import { useEffect, useState, useMemo } from "react";
import ListItem from "@/components/ListItem";
import './index.scss'
import Taro from "@tarojs/taro";
import compose, {formatMoeny, fen2yuan} from "@/utils/base";
import dayjs from "dayjs";
function Detail(){
  const [params] = useState(Taro.getCurrentInstance().router?.params)
  console.log(params, 'params');
  const copy = (str)=>{
    Taro.setClipboardData({
      data: str,
      success: ()=>{
        Taro.showToast({
          icon: 'none',
          title: '复制成功'
        })
      }
    })
  }
  // 
  const toDetail=()=>{
    Taro.navigateTo({
      url: `/pages/order/detail/index?orderNo=${params?.orderNo}`
    })
  }
  const getText = useMemo(()=>{
   if(params?.billStatus === '3') return '已退款'
   if(params?.billStatus === '2') return '已入账'
   if(params?.billStatus === '1') return '待入账'
  }, [params])
  return (
     <>
      <View className='bill-detail'>
      <ListItem 
        type={1}
        style={{height: '58px', padding: '16px '}}
        left={
          <View>
            <View className='color999 fz26'>收入金额</View>
            <View className='fz48'>+{compose(formatMoeny, fen2yuan)(params?.actualAmount)}</View>
          </View>
        }
        right={
          <Text>
            {getText}
          </Text>
        }
        handleClick={()=>toDetail()}
        ></ListItem>
     </View>
     <View className='bill-detail-content'> 
        <View className='bill-detail-content-box'>
            <View className='fz32 color333'>交易信息</View>
            <View className='bill-detail-content-item'>
              <Text className='bill-detail-content-item-label'>交易金额</Text> <Text className='bill-detail-content-item-value'>￥{compose(formatMoeny, fen2yuan)(params?.userPayAmount)}</Text>
            </View>
            <View className='bill-detail-content-item'>
              <Text className='bill-detail-content-item-label'>交易类型</Text> <Text className='bill-detail-content-item-value'>交易货款</Text>
            </View>
            <View className='bill-detail-content-item'>
              <Text className='bill-detail-content-item-label'>订单编号</Text> 
              <Text className='bill-detail-content-item-value'>
                <Text>{params?.orderNo}</Text><Text className='bill-detail-content-item-copy' onClick={()=>copy(params?.orderNo)} >复制</Text>
              </Text>
            </View>
          
            <View className='bill-detail-content-item'>
              <Text className='bill-detail-content-item-label'>交易时间</Text> 
              <Text className='bill-detail-content-item-value'>{dayjs(Number(params?.gmtCreate)).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </View>
            {params?.commissionAmount > 0 && <View className='bill-detail-content-item'>
              <Text className='bill-detail-content-item-label'>分销金额</Text>
              <Text className='bill-detail-content-item-value'>
                  <Text > {((params?.commissionRate)/100)}%</Text>
                  <Text >{`(${compose(formatMoeny, fen2yuan)(params?.commissionAmount)}元)`}</Text>
              </Text>
            </View>}
            <View className='bill-detail-content-item'>
              <Text className='bill-detail-content-item-label'>交易手续费</Text> 
              <Text className='bill-detail-content-item-value'>{(params?.serviceFeeRate)/100}%</Text>
              <Text className='bill-detail-content-item-value'>{`(${compose(formatMoeny, fen2yuan)(params?.serviceFee)}元)`}</Text>
            </View>
           
        
        </View>
    </View>
     </>
  )
}

export default Detail