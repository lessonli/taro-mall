import { View, Text, Image } from "@tarojs/components";

import { useState, useCallback, useMemo, useEffect } from "react";
import { XImage } from "@/components/PreImage";
import { openRed, bw_icon, empty, openRed_open, openredPacket, openRed_bg, openRed_bg2,openRed_open2 } from "@/constants/images";

import Popup from "@/components/Popup";
import { noop, addAppEventlistener, bwNativeCallJsSyncFn, removeAppEventlistener } from "@/utils/app.sdk";




import { IRedInfo } from "../..";
import { Itype } from "../..";

import './index.scss'
import { DEVICE_NAME, isAppWebview } from "@/constants";
import { updateToken } from "@/utils/storge";
import { getStatus, getUserInfo } from "@/utils/cachedService";

interface Iprops {
  data: IRedInfo,
  toRecord: () => void
  openCanvas: () => void
}


interface IProps {
  data: IRedInfo,
  handleClick: () => void,
  userInfo: any
  runAuth: any
  refWeappLogin?: any,
  type: Itype
}


function Open(props: IProps) {
  console.log(props, 'props');
  useEffect(() => {
    addAppEventlistener('loginSuccess', (data) => {
      console.log(JSON.parse(data), 'dataOpen');
      const { token } = JSON.parse(data)
      updateToken(token)
      getUserInfo.reset()
      // getStatus.reset()
      props?.refWeappLogin?.current?.WeappLoginPopup?.getUserDetail(true)

    })

    return () => {
      removeAppEventlistener('loginSuccess', noop)
    }
  }, [])
  const openRed = () => {
    console.log(props, 'props');
    if (props?.userInfo?.mobileStatus === 1) {
      props.handleClick()
    } else {
      console.log(props, 'props');
      DEVICE_NAME === 'weapp' && props?.runAuth()
      if (isAppWebview) {
        console.log('app登录');

        WebViewJavascriptBridge.callHandler(
          'openNativePage',
          JSON.stringify({ page: 'login' })
        )
      }

    }

  }
  return <View className='openRed'>
    <View className='openRed-img'>

    </View>
    <View className='openRed-curtain'>
      <Popup
        visible={true}
        headerType='empty'
      >
        <View className='openRed-curtain-content' onClick={() => openRed()}>
          
         <Image className='openRed-curtain-content-img' src={openRed_bg2}></Image>
         <Image className="openRed-curtain-content-openImg" src={openRed_open2}></Image>
          
          <View className='openRed-curtain-content-shopInfo'>
            {props.userInfo?.mobileStatus && <>
              {
                props.type !== 'action' && <>
                  <Image className='openRed-img-text-con-img' src={props?.data?.shopLogo}></Image>
                  <Text className='openRed-curtain-content-shopInfo-shopName'> {props?.data?.shopName}</Text>
                  <Text className='m-l-8' >x</Text> </>}
            </>
            }
            <Image className='openRed-img-text-con-img m-r-8' src={bw_icon}></Image><Text>博物有道</Text>
          </View>
          
          {
            props?.type!=='merchantBuy' && <View className='openRed-curtain-content-tip'>
              <View>邀您拆红包</View>
              <View>最高88元现金立享提现</View>
            </View>
          }
           {
            props?.type ==='merchantBuy' && <View className='openRed-curtain-content-tip'>
              <View>免单红包派发中</View>
              
            </View>
          }

        </View>

      </Popup>
    </View>
  </View>
}

export default Open