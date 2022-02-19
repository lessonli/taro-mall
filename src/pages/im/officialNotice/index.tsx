import api2108 from '@/apis/21/api2108'
import Empty from '@/components/Empty'
import NavigationBar from '@/components/NavigationBar'
import { XImage } from '@/components/PreImage'
import { WxOpenLaunchWeapp } from '@/components/WxComponents'
import { empty } from '@/constants/images'
import { tim } from '@/service/im'
import { isImReady, noReadNumber, noReadNumber_notice, receivedMessage } from '@/store/atoms'
import { deepClone, unitChatTime } from '@/utils/base'
import { session } from '@/utils/storge'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import './index.scss'

const officialNotice = () => {
  const [isReady, setReady] = useRecoilState(isImReady)
  const [message, setMessage] = useRecoilState(receivedMessage)
  const [list, setList] = useState([])
  const [nextReqMessageID, setNextReqMessageID] = useState<string>('')
  const [isCompelete, setIsCompelete] = useState<boolean>(false)
  const [noReadNum_notice, setNoReadNum_notice] = useRecoilState(noReadNumber_notice)
  const [noReadNum, setNoReadNum] = useRecoilState(noReadNumber)
  const [routerType, setRouterType] = useState<string>('act')
  useReachBottom(() => {

    // getMessageList(identity)
    if (!isCompelete && nextReqMessageID) {
      tim.getMessageList({ conversationID: 'C2C1666666661', count: 20, nextReqMessageID }).then(data => {
        setNextReqMessageID(data.data.nextReqMessageID)
        setIsCompelete(data.data.isCompleted)
        let newList = data.data.messageList.map(item => {
          return { ...JSON.parse(item.payload.data), time: unitChatTime(item.time) }
        }).reverse()
        setList(list.concat(newList))
      })
    }
  })

  useEffect(() => {
    if (!isReady) {
      if (!session.getItem('token')) {
        api2108()
      }
    } else {
      tim.getMessageList({ conversationID: `C2C1666666661`, count: 20 }).then(data => {
        setNextReqMessageID(data.data.nextReqMessageID)
        setIsCompelete(data.data.isCompleted)
        let list = data.data.messageList.map(item => {
          console.log(item.time * 1000, JSON.parse(item.payload.data));
          return { ...JSON.parse(item.payload.data), time: unitChatTime(item?.time), isEnd: JSON.parse(item.payload.data).ext?.act ? item?.time * 1000 > JSON.parse(item.payload.data).ext?.act.et * 1000 : false }
        }).reverse()
        console.log(list, 121);

        setList(list)

      })

      tim.setMessageRead({ conversationID: 'C2C1666666661' }).then(res => {
        // setNoReadNum(value => { return value - noReadNum_notice })
        setNoReadNum_notice(0)
      })

      // tim.getConversationList().then(res => {
      //   const list = res.data.conversationList.filter(item => item.conversationID === 'C2C1666666661')
      //   setList(list)
      // })
    }
  }, [isReady])

  useEffect(() => {
    if (message && message.data) {
      if (message.data[0].type === "TIMCustomElem") {
        if (message.data[0].conversationID === 'C2C1666666661') {
          let newList = deepClone(list)
          newList.unshift({ ...JSON.parse(message.data[0].payload.data), time: unitChatTime(message.data[0].time), isEnd: JSON.parse(message.data[0].payload.data).ext?.act ? message.data[0]?.time * 1000 > JSON.parse(message.data[0].payload.data).ext?.act.et : false })
          setList(newList)
        }
      }
    }
  }, [message])

  const goLink = (item) => {
    if (item.linkType === 50) {
      // 跳转直播间
      Taro.navigateTo({
        url: `/pages/live/room/index?roomId=${item?.ext?.live.id}`
      })
    } else if (item.linkType === 0 && !item.isEnd) {
      // h5 跳链接
      if (process.env.TARO_ENV === 'h5') {
        if (item.link.indexOf(window.location.host) > -1) {
          Taro.navigateTo({
            url: item.link.split(window.location.host)[1]
          })
        } else {
          item.link && (window.location.href = item.link)
        }
      } else {
        item.maLink && Taro.navigateTo({ url: `${item.maLink}` })
      }
    }
  }



  return (
    <View className="im-OfficialNotice">
      <NavigationBar
        title={'官方通知'}
        background={'#ffffff'}
        leftBtn={<Text onClick={() => { Taro.navigateBack() }} className="myIcon messageBack bw-BackAndHomeBtn-back">&#xe707;</Text>}
      />
      {
        list.map((item, i) => {
          return (item?.ext?.live && process.env.TARO_ENV === 'h5') ? <WxOpenLaunchWeapp key={i} path={`pages/live/room/index?roomId=${item?.ext?.live.roomId}`}>
            <View className='im-OfficialNotice-item' key={i}>
              <Text className='im-OfficialNotice-item-time'>{item?.time}</Text>
              <View className='im-OfficialNotice-item-box'>
                <View className='im-OfficialNotice-item-title' style={{ color: item?.isEnd && '#bdbdbd' }}>{item?.title}</View>
                <View className='im-OfficialNotice-item-content' style={{ color: item?.isEnd && '#bdbdbd' }}>{item?.content}</View>
                {item?.ext?.[item?.linkType === 50 ? 'live' : 'act'] && <View className='im-OfficialNotice-item-img'>
                  <XImage disabledPlaceholder mode='aspectFill' className='im-OfficialNotice-item-img-content' src={item?.ext?.[item?.linkType === 50 ? 'live' : 'act']?.pic}></XImage>
                  {item.isEnd && <View className='im-OfficialNotice-item-img-hide'></View>}
                  {item.isEnd && <View className='im-OfficialNotice-item-img-end'>已结束</View>}
                </View>}
              </View>
            </View>
          </WxOpenLaunchWeapp> : <View className='im-OfficialNotice-item' key={i} onClick={() => { goLink(item) }}>
            <Text className='im-OfficialNotice-item-time'>{item?.time}</Text>
            <View className='im-OfficialNotice-item-box'>
              <View className='im-OfficialNotice-item-title' style={{ color: item?.isEnd && '#bdbdbd' }}>{item?.title}</View>
              <View className='im-OfficialNotice-item-content' style={{ color: item?.isEnd && '#bdbdbd' }}>{item?.content}</View>
              {item?.ext?.[item?.linkType === 50 ? 'live' : 'act'] && <View className='im-OfficialNotice-item-img'>
                <XImage disabledPlaceholder mode='aspectFill' className='im-OfficialNotice-item-img-content' src={item?.ext?.[item?.linkType === 50 ? 'live' : 'act']?.pic}></XImage>
                {item.isEnd && <View className='im-OfficialNotice-item-img-hide'></View>}
                {item.isEnd && <View className='im-OfficialNotice-item-img-end'>已结束</View>}
              </View>}
            </View>
          </View>
        })
      }
      {list.length < 1 && <Empty className='im-OfficialNotice-empty' text='暂无消息' src={empty} />}
    </View>
  )
}

export default officialNotice
