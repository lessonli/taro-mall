
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { useEffect, useState, useMemo } from "react";
import { XImage } from "@/components/PreImage";
import { WxOpenLaunchWeapp } from "@/components/WxComponents";
import { IResapi4864 } from "@/apis/21/api4864";
import { DEVICE_NAME } from "@/constants";
import LiveIcon from "@/components/LIveIcon";
import Big from "big.js";
import './index.scss'


type ILiveListItem = Required<Required<IResapi4864>['data']>['data'][0]

interface IProps {
  data: ILiveListItem
  toRoomDetail: (roomId, recordId) => void
}
function LiveListItem(props: IProps) {
  const getFansNum = (num) => {
    // num = num*11000 // 本地测试 扩大
    let big = new Big(num)
    if (num < 9999) {
      return num
    }
    return big.div(10000).toFixed(1) + 'w'

  }
  return <>
    {
      DEVICE_NAME === 'wxh5' ? <WxOpenLaunchWeapp key={props?.data?.roomId} path={`pages/live/room/index?roomId=${props.data?.roomId}`}>
        <View className="bw-liveListItem" onClick={() => props?.toRoomDetail(props?.data?.roomId, props?.data?.recordId)}>
          <View className="bw-liveListItem-box">
            <XImage className='bw-liveListItem-box-img' className="bw-liveListItem-box-img" src={props?.data?.coverImg}>
              <View className="bw-liveListItem-box-img-mask"></View>
              
                <LiveIcon cusText={ props?.data?.status === 1? `${getFansNum(props?.data?.fansNum)}粉丝`:`${props?.data?.viewCount}观看` } status={props?.data?.status} ></LiveIcon>

              <View className="bw-liveListItem-box-img-liveInfo">
                <View className="bw-liveListItem-box-img-liveInfo-avatar">
                  <Image className="bw-liveListItem-box-img-liveInfo-avatar-img" src={props?.data?.headImg}></Image>
                </View>
                <View className="bw-liveListItem-box-img-liveInfo-title">
                  <View className="bw-liveListItem-box-img-liveInfo-title-tit">{props?.data?.roomName}</View>
                  <View className="bw-liveListItem-box-img-liveInfo-title-desc">{props?.data?.title}</View>
                </View>
              </View>
            </XImage>

          </View>
        </View>

      </WxOpenLaunchWeapp> : <View className="bw-liveListItem" onClick={() => props?.toRoomDetail(props?.data?.roomId)}>
        <View className="bw-liveListItem-box">
          <XImage className='bw-liveListItem-box-img' className="bw-liveListItem-box-img" src={props?.data?.coverImg}>
            <View className="bw-liveListItem-box-img-mask"></View>
            <LiveIcon cusText={ props?.data?.status === 1? `${getFansNum(props?.data?.fansNum)}粉丝`:`${props?.data?.viewCount}观看` } status={props?.data?.status} ></LiveIcon>
            <View className="bw-liveListItem-box-img-liveInfo">
              <View className="bw-liveListItem-box-img-liveInfo-avatar">
                <Image className="bw-liveListItem-box-img-liveInfo-avatar-img" src={props?.data?.headImg}></Image>
              </View>
              <View className="bw-liveListItem-box-img-liveInfo-title">
                <View className="bw-liveListItem-box-img-liveInfo-title-tit">{props?.data?.roomName}</View>
                <View className="bw-liveListItem-box-img-liveInfo-title-desc">{props?.data?.title}</View>
              </View>
            </View>
          </XImage>

        </View>
      </View>
    }
  </>
}

export default LiveListItem