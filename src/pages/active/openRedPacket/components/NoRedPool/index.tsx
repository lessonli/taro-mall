import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import NavigationBar, { BackAndHomeBtn } from "@/components/NavigationBar";
import Rules from "../Rules";
import compose, { formatMoeny, fen2yuan } from "@/utils/base";
import TextSwiper from "../TextSwiper";
import './index.scss'

import { Itype } from "../..";
import { IRedInfo } from "../..";

interface Iprops {
  openCanvas: () => void
  toRecord: () => void
  recordList: []
  toMall: () => void
  toPage: (url) => void
  type: Itype
}

function NoRedPoll(props: Iprops) {
  console.log(props, 'props红包池');

  return <View className='noRedPoll'>
    <NavigationBar leftBtn={<BackAndHomeBtn />} title='开红包' background='#ec5e32'></NavigationBar>
    <View className='noRedPoll-header'>
      <View className='noRedPoll-header-info'>
        {/* <TextSwiper type={props.type} recordList={props.recordList}></TextSwiper> */}
        {
          props?.type !=='merchantBuy' &&  <TextSwiper type={props.type} recordList={props?.recordList}></TextSwiper>
        }
        {
          props?.type=== 'merchantBuy' && <View className="_red_tip">红包金额无门槛使用抵扣</View>
        }  
        <View className='noRedPoll-header-info-money'>
          <View className='noRedPoll-header-info-money-num'>没有红包了</View>
        </View>
        {
          props?.type !== 'merchantBuy' &&  <View className='noRedPoll-header-info-record' onClick={() => props.toRecord()}>
          我的红包
        </View>
        }
        {/* <View className='noRedPoll-header-info-record' onClick={() => props.toRecord()}>
          我的红包
        </View> */}
      </View>
      <View className='noRedPoll-header-btnGroup'>
        {
          props.type === 'liveList' ? <AtButton className='noRedPoll-header-btnGroup-share' onClick={() => props.toPage('/pages/active/template/index?activityId=1012835972341248&_type=2')} >
            去直播间列表

          </AtButton> : <AtButton className='noRedPoll-header-btnGroup-share' onClick={() => props.toMall()} >
            去商城逛逛

          </AtButton>
        }




      </View>
    </View>

  </View>
}

export default NoRedPoll