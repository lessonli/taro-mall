
import { Text, View, Image } from "@tarojs/components";

import { useMemo, useCallback, useEffect } from "react";

import {hjLevel, serviceLevel,zsLevel }  from '@/constants/images'
import { XImage } from "@/components/PreImage";
import './index.scss'

interface Iprops  {
  level: number
}

function MerchantLevel(props:Iprops){    
  const Img = useMemo(()=>{
    if(props.level === 1) {
      return hjLevel
    }
    if(props.level === 2){
      return zsLevel
    }
    if(props.level === 3){
      return serviceLevel
    }
  }, [props.level])

  return <View className='index-imageWrap'>
    <Image className ={`${props.level === 3 ? 'index-image-service': 'index-image'}`} src={Img as string}></Image>
  </View>
}
export default MerchantLevel