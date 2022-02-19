
import Taro from "@tarojs/taro";
import { useMemo, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import NavigationBar,{BackAndHomeBtn} from "@/components/NavigationBar";
import Rules from "../Rules";
import compose, { formatMoeny, fen2yuan,ms2day } from "@/utils/base";
import TextSwiper from "../TextSwiper";
import './index.scss'

import { IRedInfo } from "../..";
import { isAppWebview } from "@/constants";
import { Itype } from "../..";
interface Iprops {
  data: IRedInfo
  openCanvas: () => void
  toRecord: () => void
  toMall: () => void
  recordList?:[]
  type: Itype
  toPage: (url)=>void
  merchantBuyHandleInToMerchant:()=>void
  expreTimeText:string

}

function BancnceRed(props: Iprops) {
  const decisionAction = useMemo(() => {
    if (props.type === 'action') {
      return <AtButton className='bancnceRed-head-btnGroup-tx' onClick={()=>props.toMall()} >
        去使用

     </AtButton>
    } else if(props.type === 'liveList'){
      return <AtButton className='bancnceRed-head-btnGroup-tx' onClick={()=>props.toPage('/pages/active/template/index?activityId=1012835972341248&_type=2')} >
        去直播间列表
     </AtButton>
    }else if(props.type === 'merchantBuy'){
      return <View>
        <AtButton className='bancnceRed-head-btnGroup-tx' onClick={props?.merchantBuyHandleInToMerchant} >
        进店逛逛
        </AtButton>
        <View className="bancnceRed-head-btnGroup-text m-t-12"  onClick={()=>props.openCanvas()} >分享给好友 让ta也拿红包 <Text className="myIcon fz24">&#xe726;</Text> </View>
      </View>
     }else {
      if (props?.data?.isNewerUser === 1 && isAppWebview) {
        return <AtButton className='bancnceRed-head-btnGroup-tx' onClick={()=>props.toMall()} >
          去使用

       </AtButton>
      } else if (!props?.data?.isNewerUser && isAppWebview) {
        return <AtButton className='bancnceRed-head-btnGroup-tx' onClick={()=>props.openCanvas()} >
        分享给好友， 红包翻倍

        </AtButton>
      } else if (!isAppWebview) {
        return <AtButton className='bancnceRed-head-btnGroup-tx' onClick={()=>props.openCanvas()} >
        分享给好友， 红包翻倍

        </AtButton>
      }
    }
  }, [props])
  return <View className='bancnceRed'>
    <NavigationBar background='#ec5e32' title='开红包' leftBtn={<BackAndHomeBtn />} />
    <View className='bancnceRed-head'>
      <View className='bancnceRed-head-info'>
        {
          props?.type !=='merchantBuy' &&  <TextSwiper type={props.type} recordList={props?.recordList}></TextSwiper>
        }
        {
          props?.type=== 'merchantBuy' && <View className="_red_tip">红包金额无门槛使用抵扣</View>
        }  
        <View className='bancnceRed-head-info-money'>
          <View className='bancnceRed-head-info-money-num'>￥{compose(formatMoeny, fen2yuan)(props.data.awardAmount)}</View>
          <View className='bancnceRed-head-info-money-tip'>
            {
              props.type !=='merchantBuy' && '获得普通红包, 可用于博物有道平台消费'
            }
            {
              props.type=== 'merchantBuy' && props?.expreTimeText
            }
            
          </View>
        </View>
        {
          props?.type !== 'merchantBuy' &&  <View className='bancnceRed-head-info-record' onClick={() => props.toRecord()}>
          我的红包
        </View>
        }
       
      </View>
      <View className={`${props?.type=='merchantBuy'?'m-t-94': ''} bancnceRed-head-btnGroup `}>
          {/* isNewerUser 0 老用户 | 不存在 分享 1 新用户 商城 */}
        {decisionAction}
      </View>
    </View>
    {/* <Rules /> */}
  </View>
}

export default BancnceRed