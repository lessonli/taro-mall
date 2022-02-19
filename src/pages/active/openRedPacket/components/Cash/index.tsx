
import Taro from "@tarojs/taro";
import { useMemo } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import NavigationBar, { BackAndHomeBtn } from "@/components/NavigationBar";

import compose, { formatMoeny, fen2yuan } from "@/utils/base";
import TextSwiper from "../TextSwiper";
import './index.scss'
import { isAppWebview } from "@/constants";
import { Itype } from "../..";
import { IRedInfo } from "../..";


interface Iprops {
  data: IRedInfo,
  toRecord: () => void
  openCanvas: () => void
  YuETX?: () => void
  recordList: []
  toMall: () => void
  merchantBuyHandleInToMerchant:()=>void
  type: Itype
  toPage: (url) => void
}


function Cash(props: Iprops) {

  const decisionAction = useMemo(() => {
     {/* isNewerUser 0 老用户 | 不存在 分享 1 新用户 商城  type=action 走 去商商城模式 */}
    if (props.type === 'action') {
      return <AtButton className='cash-header-btnGroup-tx' onClick={() => props.toMall()} >
        去使用
      </AtButton>
    } else if(props.type === 'liveList'){
      return <AtButton className='cash-header-btnGroup-tx' onClick={() => props.toPage('/pages/active/template/index?activityId=1012835972341248&_type=2')} >
      去直播间列表
    </AtButton>
    }else if(props.type === 'merchantBuy'){
      return <View>
        <AtButton className='cash-header-btnGroup-tx' onClick={props?.merchantBuyHandleInToMerchant} >
        进店逛逛
        </AtButton>
        <View className="cash-header-btnGroup-text m-t-12"  onClick={()=>props.openCanvas()} >分享给好友 让ta也拿红包 <Text className="myIcon fz24">&#xe726;</Text> </View>
      </View>
     } else {
      if (props?.data?.isNewerUser === 1 && isAppWebview) {
        return <AtButton className='cash-header-btnGroup-tx' onClick={() => props.toMall()} >
          去商城逛逛

        </AtButton>
      } else if (!props?.data?.isNewerUser && isAppWebview) {
        return <AtButton className='cash-header-btnGroup-tx' onClick={() => props.openCanvas()} >
          分享给好友， 红包翻倍

        </AtButton>
      } else if (!isAppWebview) {
        return <AtButton className='cash-header-btnGroup-tx' onClick={() => props.openCanvas()}>
          分享给好友， 红包翻倍
        </AtButton>
      }
    }
  }, [props])


  return <View className='cash'>
    <NavigationBar leftBtn={<BackAndHomeBtn />} title='开红包' background='#ec5e32'></NavigationBar>
    <View className='cash-header'>
      <View className='cash-header-info'>
        {/* <TextSwiper type={props.type} recordList={props.recordList}></TextSwiper> */}
        {
          props?.type !=='merchantBuy' &&  <TextSwiper type={props.type} recordList={props?.recordList}></TextSwiper>
        }
        {
          props?.type=== 'merchantBuy' && <View className="_red_tip">红包金额无门槛使用抵扣</View>
        }  
        <View className='cash-header-info-money'>
          <View className='cash-header-info-money-num'>￥{compose(formatMoeny, fen2yuan)(props?.data?.awardAmount)}</View>
          <View className='cash-header-info-money-tip'>获得现金红包, 可提现到微信零钱</View>
        </View>
        
        {
          props?.type !== 'merchantBuy' &&  <View className='cash-header-info-record' onClick={() => props.toRecord()}>
          我的红包
        </View>
        }
      </View>
      <View className={`${props?.type=='merchantBuy'?'': ''} cash-header-btnGroup `}>
        {decisionAction}

      </View>
    </View>
    {/* <Rules /> */}
  </View>
}

export default Cash