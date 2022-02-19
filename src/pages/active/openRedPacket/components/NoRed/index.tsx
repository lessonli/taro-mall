

import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import NavigationBar, { BackAndHomeBtn } from "@/components/NavigationBar";
import Rules from "../Rules";
import compose, { formatMoeny, fen2yuan } from "@/utils/base";
import TextSwiper from "../TextSwiper";
import './index.scss'
import { isAppWebview } from "@/constants";
import { Itype } from "../..";
import { IRedInfo } from "../..";
import { useMemo } from "react";

interface Iprops {
  data: IRedInfo,
  openCanvas: () => void
  toRecord: () => void
  recordList: []
  toMall: () => void
  toPage: (url) => void
  type: Itype
}

function NoRed(props: Iprops) {
  console.log(props, 'props');
  const decisionAction = useMemo(() => {
    {/* isNewerUser 0 老用户 | 不存在 分享 1 新用户 商城  type=action 走 去商商城模式 */ }
    if (props.type === 'action') {
      return <AtButton className='noRed-head-btnGroup-tx' onClick={() => props.toMall()} >
        去使用
      </AtButton>
    } else if(props.type === 'liveList'){
      return <AtButton className='noRed-head-btnGroup-tx' onClick={() => props.toPage('/pages/active/template/index?activityId=1012835972341248&_type=2')} >
      去直播间列表
    </AtButton>
    } else if(props.type === 'merchantBuy'){
      return <View>
        <AtButton className='noRed-head-btnGroup-tx' onClick={()=>props.toPage('/pages/active/template/index?activityId=1012835972341248&_type=2')} >
        进店逛逛
        </AtButton>
        <View className="noRed-head-btnGroup-text m-t-12"  onClick={()=>props.openCanvas()} >分享给好友 让ta也拿红包 <Text className="myIcon fz24">&#xe726;</Text> </View>
      </View>
     }else {
      if (props?.data?.isNewerUser === 1 && isAppWebview) {
        return <AtButton className='noRed-head-btnGroup-tx' onClick={() => props.toMall()} >
          去商城逛逛
        </AtButton>
      } else if (!props?.data?.isNewerUser && isAppWebview) {
        return <AtButton className='noRed-head-btnGroup-tx' onClick={() => props.openCanvas()} >
          分享给好友， 红包翻倍
        </AtButton>
      } else if (!isAppWebview) {
        return <AtButton className='noRed-head-btnGroup-tx' onClick={() => props.openCanvas()} >
          分享给好友， 红包翻倍
        </AtButton>
      }
    }
  }, [props])

  return <View className='noRed'>
    <NavigationBar leftBtn={<BackAndHomeBtn />} title='开红包' background='#ec5e32'></NavigationBar>
    <View className='noRed-head'>
      <View className='noRed-head-info'>
        {/* <TextSwiper type={props.type} recordList={props.recordList}></TextSwiper> */}
        {
          props?.type !=='merchantBuy' &&  <TextSwiper type={props.type} recordList={props?.recordList}></TextSwiper>
        }
        {
          props?.type=== 'merchantBuy' && <View className="_red_tip">红包金额无门槛使用抵扣</View>
        }  
        <View className='noRed-head-info-money'>
          <View className='noRed-head-info-money-num'>红包领光啦~</View>
          <View className='noRed-head-info-money-tip'>您已经领取该商家的红包，分享还可以赚现金奖励哦</View>
        </View>
        
        {
          props?.type !== 'merchantBuy' &&  <View className='noRed-head-info-record' onClick={() => props.toRecord()}>
          我的红包
        </View>
        }

      </View>
      <View className={`${props?.type=='merchantBuy'?'m-t-94': ''} noRed-head-btnGroup `}>
        {/* isNewerUser 0 老用户 | 不存在 分享 1 新用户 商城 */}

        {decisionAction}
      </View>
    </View>
    {/* <Rules /> */}
  </View>
}

export default NoRed