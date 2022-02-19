import api4678 from '@/apis/21/api4678'
import api4680, { IResapi4680 } from '@/apis/21/api4680'
import { RED_PACKET_STATUS } from '@/constants'
import { liveClose, liverp, liveRpBg, liveRpBg_open, liverp_p, openredPacket } from '@/constants/images'
import { fen2yuan } from '@/utils/base'
import { globalConfig } from '@/utils/cachedService'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'

import './index.scss'

export type IRedPacketDetail = Required<IResapi4680["data"]>
interface IProps {
  redPacketDetail: {},
  showRedPacket?: boolean
  attentionStatus?: number
}
const LiveRedPacket = (props: IProps) => {

  const [visible, setVisible] = useState<boolean>(false)

  const [redPacketDetail, setRedPacketDetail] = useState<IRedPacketDetail>({})

  const [timesDetail, settimesDetail] = useState({})

  const timer = useRef(null)

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }

  }, [])

  const closeVisible = () => {
    clearInterval(timer.current)
    setVisible(false)

  }

  const dealTime = async (expireTime) => {
    clearInterval(timer.current)
    const result = await globalConfig()
    let time = expireTime - result?.timeDifference
    let times = {
      h: Math.floor((time - Date.parse(new Date())) / 1000 / 60 / 60),
      m: Math.floor((time - Date.parse(new Date())) / 1000 / 60 % 60),
      s: Math.floor((time - Date.parse(new Date())) / 1000 % 60)
    }
    settimesDetail(times)
    timer.current = setInterval(() => {
      let times = {
        h: Math.floor((time - Date.parse(new Date())) / 1000 / 60 / 60),
        m: Math.floor((time - Date.parse(new Date())) / 1000 / 60 % 60),
        s: Math.floor((time - Date.parse(new Date())) / 1000 % 60)
      }
      settimesDetail(times)

    }, 1000)
  }

  const openRp = async () => {

    const redPacketDetail = await api4680({ redPacketId: props.redPacketDetail?.uuid })
    if (redPacketDetail) {
      setRedPacketDetail(redPacketDetail)
      if (redPacketDetail?.status === 2) {
        dealTime(redPacketDetail?.expireTime)
      }
      setVisible(true)
    } else {
      setRedPacketDetail({ status: 0 })
    }

  }

  const openRedPacket = () => {
    if (props?.attentionStatus !== 1) {
      Taro.showToast({
        title: '点击右上角“关注”直播间抢红包',
        icon: 'none'
      })
      return
    }
    api4678({ redPacketId: props.redPacketDetail?.uuid }).then(redPacketDetail => {
      setRedPacketDetail(redPacketDetail)
      if (redPacketDetail?.status === 2) {
        dealTime(redPacketDetail?.expireTime)
      } else if (redPacketDetail?.status === 0) {
        setRedPacketDetail({ status: 0 })
      }
    }).catch(() => {
      setRedPacketDetail({ status: 0 })
    })
  }

  const RedPacketResult = () => {
    return (
      <>
        {
          redPacketDetail?.status === 0 && <View className='Live-redPacket-popUp-content-desc'>
            <View className='Live-redPacket-popUp-content-desc-get'>
              <View className='Live-redPacket-popUp-content-desc-get-price'>
                <Text className='Live-redPacket-popUp-content-desc-get-price-3'>手慢了，红包派完了</Text>
              </View>
              <View className='Live-redPacket-popUp-content-desc-get-fail'>让主播给点福利～</View>
            </View>
            <View className='Live-redPacket-popUp-content-desc-btn' onClick={closeVisible}>去看直播</View>
          </View>
        }
        {
          redPacketDetail?.status === 2 && <View className='Live-redPacket-popUp-content-desc'>
            <View className='Live-redPacket-popUp-content-desc-success'>
              恭喜抢到红包
            </View>
            <View className='Live-redPacket-popUp-content-desc-get'>
              <View className='Live-redPacket-popUp-content-desc-get-price'>
                <Text className='Live-redPacket-popUp-content-desc-get-price-1'>{fen2yuan(redPacketDetail.awardAmount)}</Text>
                <Text className='Live-redPacket-popUp-content-desc-get-price-2'>元</Text>
              </View>
              <View className='Live-redPacket-popUp-content-desc-get-where'>{redPacketDetail?.useRange === 1 ? '全平台通用' : '当前直播间可用'}</View>
            </View>
            <View className='Live-redPacket-popUp-content-desc-time'>{timesDetail?.h <= 9 ? `0${timesDetail?.h || 0}` : timesDetail?.h}:{timesDetail?.m <= 9 ? `0${timesDetail?.m || 0}` : timesDetail?.m}:{timesDetail?.s <= 9 ? `0${timesDetail?.s || 0}` : timesDetail?.s}后失效</View>
          </View>
        }
        {
          redPacketDetail?.status === 1 && <View className='Live-redPacket-popUp-content-desc'>
            {/* <View className='Live-redPacket-popUp-content-desc-price'>
              <Text className='Live-redPacket-popUp-content-desc-price-1'>1000</Text>
              <Text className='Live-redPacket-popUp-content-desc-price-2'>元</Text>
            </View> */}
            {/* <View className='Live-redPacket-popUp-content-desc-type'>现金红包</View> */}
          </View>}
      </>
    )
  }

  return (
    <View className='Live-redPacket'>
      {props.showRedPacket && <View className='Live-redPacket-content' onClick={openRp}>
        <Image className='Live-redPacket-img' src={props.redPacketDetail?.amountStrategy === 3 ? liverp : liverp_p}></Image>
        <Text className='Live-redPacket-time'>{props.redPacketDetail?.m <= 9 ? `0${props.redPacketDetail?.m || 0}` : props.redPacketDetail?.m}:{props.redPacketDetail?.s <= 9 ? `0${props.redPacketDetail?.s || 0}` : props.redPacketDetail?.s}</Text>
      </View>}
      {visible && <View className='Live-redPacket-popUp'>
        <View className="Live-redPacket-popUp-content">
          <RedPacketResult />
          {redPacketDetail?.status === 2 && <View className='Live-redPacket-popUp-content-desc-btn' onClick={closeVisible}>去购物消费</View>}
          <Image className="Live-redPacket-popUp-content-img" onClick={openRedPacket} src={redPacketDetail?.status === 1 ? liveRpBg : liveRpBg_open}></Image>
          <Image className="Live-redPacket-popUp-content-icon" onClick={closeVisible} src={liveClose}></Image>
        </View>
      </View>}
    </View>
  )
}

export default LiveRedPacket