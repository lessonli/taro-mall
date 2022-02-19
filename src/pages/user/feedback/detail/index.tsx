import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text,Image } from "@tarojs/components";
import dayjs from "dayjs";
import Taro from "@tarojs/taro";
import { getUserInfo } from "@/utils/cachedService";
import { FEEDBACK_TYPE } from "@/constants";
import './index.scss'

import api4442, {IResapi4442} from "@/apis/21/api4442";


type Idata = Required<IResapi4442>['data']
function Detail(){
  const {uuid} = Taro.getCurrentInstance().router?.params
  const [data, setData] = useState<Idata>()
  const [userInfo, setUserInfo] = useState()

  
  useEffect(()=>{
    (async()=>{
      const dataRes = await api4442({uuid})
      const userRes = await getUserInfo()
      console.log(userRes, 'userRes');
      
      setData(dataRes)
      setUserInfo(userRes)

    })()
  },[uuid])
  console.log(data?.images?.split(','));
  
 return(<>
    <View className='bw-feedback-detail'>
      <View className='bw-feedback-detail-user'>
        <Image className='bw-feedback-detail-user-img' src={userInfo?.headImg}></Image>
        <View className='bw-feedback-detail-user-info'>
          <View className='bw-feedback-detail-user-info-name'> {userInfo?.nickName}</View>
          <View className='bw-feedback-detail-user-info-date'>{dayjs(data?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</View>
        </View>
      </View>
      <View className='bw-feedback-detail-content'>
        <View>反馈类型: {FEEDBACK_TYPE[data?.type]}</View>
        <View className='m-t-16'>{data?.content}</View>
        {data?.images &&
           <View className='bw-feedback-detail-content-imgWrapper'>
           {data?.images?.split(',').map(item=>{
             return  <Image key={item} className='bw-feedback-detail-content-imgWrapper-img'  src={item}></Image>
           })}
         </View>
        }
       
      </View>
      {data?.resultStr && <View className='bw-feedback-detail-reply'>
        <Text className='bw-feedback-detail-reply-tit'>博物官方回复:</Text>
        <Text>{data?.resultStr}</Text>
      </View>}
      
      <View>
      </View>
    </View>
 
  </>
 )
}

export default Detail