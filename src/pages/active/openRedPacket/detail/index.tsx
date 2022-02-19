

import { View, Text, Image } from "@tarojs/components";
import NavigationBar, { BackAndHomeBtn } from "@/components/NavigationBar";
import Taro from "@tarojs/taro";
import { redDetailBg } from "@/constants/images";
import { AtButton } from "taro-ui";

import compose, { formatMoeny, fen2yuan } from "@/utils/base";
import BwModal from "@/components/Modal";
import { useAsync } from "@/utils/hooks"
import { getUserInfo } from "@/utils/cachedService";
import dayjs from "dayjs";
import './index.scss'

import api4682, { IResapi4682 } from "@/apis/21/api4682";
import api4672, { IResapi4672 } from "@/apis/21/api4672"; // 提现到微信零钱
import { useEffect, useState, useMemo, useRef } from "react";

type Idetail = Required<IResapi4682>['data']

function Detail() {
  const page = useMemo(() => Taro.getCurrentInstance().router, [])
  const [visible, setVisible] = useState(false)
  const [detail, setDetail] = useState<Idetail>()
  const [userInfo, setUserInfo] = useState<any>()

  useEffect(() => {
    getDetail();
    getUserInfo().then(res => {
      setUserInfo(res)
    })
  }, [])

  const getDetail = async () => {
    const detailRes = await api4682({ uuid: page?.params?.uuid })
    console.log(detailRes, 'detailRes');
    setDetail(detailRes)
  }

  const statusText = useMemo(() => {
    console.clear();

    console.log(detail, 'detail');

    if (detail?.accountType === 1) {
      if (detail?.redPacketReceiveStatus === 1) {
        return '待提现'
      } else if (detail?.redPacketReceiveStatus === 6) {
        return '提现中'
      } else if (detail?.redPacketReceiveStatus === 2) {
        return  '已提现'
      } else if (detail?.redPacketReceiveStatus === 5 || detail.redPacketReceiveStatus === 3) {
        return  '已过期'
      }

    } else if (detail?.accountType === 2) {
      if (detail?.redPacketReceiveStatus === 1) {
        return '待使用'
      } else if (detail?.redPacketReceiveStatus === 2) {    
        return  '已使用'
      } else if (detail?.redPacketReceiveStatus === 4) {
        return '部分使用'
      } else if (detail?.redPacketReceiveStatus === 5 || detail?.redPacketReceiveStatus === 3) {
        return '已过期'
      }
    }




  }, [detail])


  const { run: handleSubmit } = useAsync(async () => {
    await api4672({ uuid: page?.params?.uuid })
    await getDetail()
    setVisible(false)
  }, { manual: true })

  return <View className='redDetail'>
    {/* title 具体显示内容待定 */}
    <NavigationBar leftBtn={<BackAndHomeBtn />} background='#EC5E32' title='红包'></NavigationBar>
    <View className='redDetail-head'>
    </View>
    <View className='redDetail-info'>
      <View className='redDetail-info-from' >
        来自【{detail?.shopName}】
      </View>
      <View className='redDetail-info-money'>￥{compose(formatMoeny, fen2yuan)(detail?.awardAmount)}</View>
    </View>
    <View className='redDetail-cardBox'>
      <View className='redDetail-cardBox-card'>
        <View className='redDetail-cardBox-card-text'>
          <Text className='m-r-24'>当前状态: </Text> <Text>
            {/* {detail?.accountType === 2 && '系统自动提现至博物有道钱包余额'} */}
            {statusText}


          </Text>
        </View>
        <View className='redDetail-cardBox-card-text'>
          <Text className='m-r-24'>领取时间: </Text> <Text>{dayjs(detail?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</Text>
        </View>
        {/* 该功能 去除 */}
        {/* <View className='redDetail-cardBox-card-text'>
          <Text className='m-r-24'>红包详情: </Text> <Text className='redDetail-cardBox-card-text-see' onClick={()=>{Taro.reLaunch({url: `/pages/active/openRedPacket/index?uuid=${detail?.uuid}`})}}>点击查看</Text>
        </View> */}

        <View className='redDetail-cardBox-card-text'>
          <Text className='m-r-24'>过期时间: </Text> <Text>{dayjs(detail?.expireTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
        </View>
        {/*  主动领取不显示该字段 */}
        {detail?.receiveType !== 1 && <View className='redDetail-cardBox-card-text'>
          <Text className='m-r-24'>备注说明: </Text> <Text>红包奖励分享, 过期不可使用</Text>
        </View>}
        {detail?.receiveType === 1 && <View className='redDetail-cardBox-card-text'>
          <Text className='m-r-24'>备注说明: </Text> <Text>领取红包, 过期不可使用</Text>
        </View>}

      </View>
    </View>
    {detail?.redPacketReceiveStatus === 1 && detail.accountType === 1 &&
      <View className='redDetail-btnBox'>
        <AtButton className='redDetail-btnBox-btn' onClick={() => setVisible(true)}>提现到微信零钱</AtButton>
      </View>
    }


    <BwModal
      visible={visible}
      onCancel={() => setVisible(false)}
      onClose={() => setVisible(false)}
      onConfirm={() => handleSubmit()}
      title='提现'
      confirmText='确认提现'
      content={<View className='color666 fz24'>
        可提现{compose(formatMoeny, fen2yuan)(detail?.awardAmount)}，到【{userInfo?.nickName}】的微信零钱
      </View>}
      cancelText='取消'
    >

    </BwModal>


  </View>
}

export default Detail
