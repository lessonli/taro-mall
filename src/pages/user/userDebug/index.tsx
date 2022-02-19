
import { View, Text } from "@tarojs/components";
import Taro, {useShareAppMessage} from "@tarojs/taro";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/utils/cachedService";
import { getToken } from "@/utils/storge";
import ListItem from "@/components/ListItem";
import api2876 from "@/apis/21/api2876";
import { XImage } from "@/components/PreImage";
import { BWYD_ICON } from "@/constants/images";
import { DEVICE_NAME } from "@/constants";
import api4526 from "@/apis/21/api4526";
import './index.scss'
function userDebug() {
  const [userInfo, setUserInfo] = useState<{
    nickName: string, mobile: string, headImg: string, token: string,userId:string

  }>()

  useEffect(() => {
    (async () => {
      try {
      let submit = {}
      let userRes = {}
      
      let userInfo = await getUserInfo.reset()
      let system = await Taro.getSystemInfoSync()
      let token = getToken()
       
        
      // userRes = { ...userInfo, token };
      // console.log(userRes, 'userRes');
      Object.assign(submit,userInfo || {}, system || {}, {token: token} || {});
      console.clear();
      console.log(submit)
      await api4526(submit)
      } catch (error) {
        // await api2876()
      }
      


    })()
  }, [])

  useShareAppMessage(()=>{
    return {
      title: '个人隐私请勿随意分享',
      imageUrl: BWYD_ICON,
      path: '/pages/user/userDebug/index'
      
    }
  })
  const copy = (str)=>{
    Taro.setClipboardData({
      data: str,
      success:()=>{
        if(process.env.TARO_ENV === 'weapp'){
          
        }
        if(process.env.TARO_ENV !== 'weapp'){
          Taro.showToast({
            title: '复制成功',
            icon: 'none'
          })
        }
      }
    })
  }
  return <View className='bw-userDebug'>
    {/* <View className='bw-userDebug-title m-b-24 m-t-24'>
      用户相关
    </View> */}
    {/* <View className='bw-userDebug-list'>
      <ListItem type={1} left='用户头像' icon={null} right={
        <View className='bw-userDebug-img' onClick={() => {
          Taro.previewImage({
            urls: [userInfo?.headImg],
            current: userInfo?.headImg
          })
        }}
        >
          <XImage className='bw-userDebug-img-ele' src={userInfo?.headImg} />
        </View>}
      />
      <ListItem type={1} left='昵称' icon={null} right={userInfo?.nickName} />
      <ListItem type={1} left='手机号' icon={null} right={userInfo?.mobile} />
      <ListItem type={1} left='token' icon={null} right={<View onClick={()=>{copy(userInfo?.token)}} className='bw-userDebug-token'>{userInfo?.token} </View>} />
      <ListItem type={1} left='userID' icon={null} right={<View onClick={()=>{copy(userInfo?.userId)}} className='bw-userDebug-token fz26'>{userInfo?.userId} </View>} />

    </View> */}
    <View>
        <View className='bw-userDebug-title m-t-24'>重要提示</View>
        <View className='bw-userDebug-title-tip'>
          官方测试链接 相关问题请联系博物有道官方客服
        </View>
    </View>
    
    


  </View>
}

export default userDebug