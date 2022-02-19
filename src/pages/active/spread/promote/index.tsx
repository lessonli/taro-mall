
import { View,Text, Image } from "@tarojs/components";

import { promote_banner1 } from "@/constants/images";
import { useState, useEffect, useMemo } from "react";

import Single from "./components/Single";
import Double from "./components/Double";
import api3482 from "@/apis/21/api3482";

import './index.scss'
import { useDebounceFn } from "ahooks";
import { isAppWebview } from "@/constants";

// 落地页


function Promote(){
  const titleArr = [
    {
      _title: '爆款推荐',activityId: '1000010',pageSize:5
    },
    {
      _title: '超值好货',activityId: '1000010',pageSize:5
    },
    {
      _title: '疯狂补贴',activityId: '1000010',pageSize:5
    }
  ]
  const [goodData, setData] = useState<any>()

  useEffect(()=>{
    const  mapData = new Map();
    api3482({pageSize:5, activityId:1000010}).then(res=>{   
        mapData.set('爆款推荐', res?.data?.slice(0,1))
        mapData.set('超值好货', res?.data?.slice(1,3))
        mapData.set('疯狂补贴', res?.data?.slice(3))
        setData(mapData)
    })
  },[])
  
  const {run:openNativeGoodDetail}  =useDebounceFn((productId, activityId)=>{    
    if(isAppWebview){
      WebViewJavascriptBridge.callHandler(
        "openNativePage",
        JSON.stringify({ page: '/product/detail', params: { productId: `${productId}`,activityId:activityId } })
      )
    }
  },{wait:300})
  
  return <View className='Promote'>
    <View className='Promote-img'>
      <Image className='Promote-img-ele' src={promote_banner1}></Image>
    </View>
    <View className='Promote-goods'>
      <Single openNativeGoodDetail={openNativeGoodDetail} data={ goodData?.get('爆款推荐')[0]} titleInfo={titleArr[0]}></Single>
      <Double openNativeGoodDetail={openNativeGoodDetail} data={goodData?.get('超值好货')}  titleInfo={titleArr[1]} ></Double>
      <Double openNativeGoodDetail={openNativeGoodDetail} data={goodData?.get('疯狂补贴')}  titleInfo={titleArr[2] } ></Double>
    </View> 
  </View>
}

export default Promote