
import { View, Text, Image, } from "@tarojs/components";
import { bw_icon } from "@/constants/images";
import { useEffect } from "react";
import { XImage } from "@/components/PreImage";
import { AtButton } from "taro-ui";
import './index.scss'

function Result() {
  // const handleClose = () => {
  //   window.open("about:blank", "_self").close()
    
  // }
  return <View className='scan-result'>
    <View className='scan-result-img'>
      <XImage className='scan-result-img-ele' src={bw_icon}></XImage>
    </View>
    <View className='scan-result-text'>
      <Text className='myIcon scan-result-text-icon'>&#xe70c;</Text>
      <Text>扫码成功</Text>
    </View>
    {/* <View className='scan-result'>
      <AtButton type='primary' onClick={() => handleClose()}> 确定</AtButton>
    </View> */}
  </View>
}

export default Result