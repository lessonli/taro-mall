
import { isImReady, receivedMessage } from '@/store/atoms'
import { deepClone, hexToRgb } from '@/utils/base'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import './index.scss'

interface Iprops {
  sendMessage: Function
  notice: any
  className: string
}

const LiveChat = (props) => {
  const { sendMessage, notice, className } = props
  const [scrollTop, setScrollTop] = useState(0)
  const [message, setMessage] = useRecoilState(receivedMessage)
  const [chatList, setChatList] = useState<any>([])
  const [isReady,] = useRecoilState(isImReady)
  const [joinInfo, setJoinInfo] = useState<any>(null)
  const [delay, setDelay] = useState<number>(0)
  const [historyList, setHistoryList] = useState<any[]>([])
  const timer = useRef()
  const joinTimer = useRef()
  useEffect(() => {
    if (isReady) {
      if (message && message.data) {
        message.data.forEach(item => {
          if (item.type !== "TIMCustomElem" && item.conversationType !== 'C2C') {
            if (item.nick) {
              if (item.payload.operationType === 1) {
                if (joinInfo) {
                  clearTimeout(timer.current)
                  setJoinInfo(null)
                  setJoinInfo(item.nick)
                } else {
                  setJoinInfo(item.nick)
                }
                timer.current = setTimeout(() => {
                  setJoinInfo(null)
                }, 8000);
              } else {
                if (item.payload.operationType !== 2) {
                  setScrollTop(scrollTop + 1000)
                  let list = chatList
                  if (list.length > 100) {
                    list.shift()
                  }
                  list.push(item)
                  setChatList(list)
                }
              }
            }
          }
          if (item.type === "TIMCustomElem") {
            if (item.payload.data) {
              let data = JSON.parse(item.payload.data)
              if (data._type === 'join') {
                let time = 0
                const list1 = item._elements
                clearTimeout(timer.current)
                if (joinTimer.current) {
                  clearInterval(joinTimer.current)
                  time = 0
                }
                // joinTimer.current = setInterval(() => {
                //   if (time <= list1.length) {
                //     time++
                //     let _data = JSON.parse(list1[time].content.data)
                //     setJoinInfo(null)
                //     setJoinInfo(_data.nick)
                //   } else {
                //     clearInterval(joinTimer.current)
                //   }
                // }, 500)

                list1.forEach(item => {
                  let _data = JSON.parse(item.content.data)
                  time += 500
                  setTimeout(() => {
                    setJoinInfo(null)
                    setJoinInfo(_data.nick)
                  }, time);

                })
                timer.current = setTimeout(() => {
                  setJoinInfo(null)
                }, 8000);

              } else if (data._type === 'buying' || data._type === 'share' || data._type === 'attention' || data._type === 'notice') {
                let data = JSON.parse(item.payload.data)
                setScrollTop(scrollTop + 1000)
                let list = chatList
                if (list.length > 100) {
                  list.shift()
                }
                list.push({
                  type: data._type,
                  payload: {
                    text: data.value,
                  },
                  nick: data.nick,
                  color: data?.color
                })
                setChatList(list)
              } else if (data._type === 'createOrder') {
                let data = JSON.parse(item.payload.data)
                setScrollTop(scrollTop + 1000)
                let list = chatList
                if (list.length > 100) {
                  list.shift()
                }
                list.push({
                  type: data._type,
                  payload: {
                    text: ' 正在付款！',
                  },
                  nick: data.nick
                })
                setChatList(list)
              } else if (data._type === 'clearMsg') {
                setChatList([])
                Taro.showToast({
                  title: '主播进行了清屏～',
                  icon: 'none'
                })
              }
            }
          }
        })
      }
    }
  }, [message, isReady])

  useEffect(() => {
    console.log(sendMessage, 1);
    if (sendMessage.payload) {
      // if (sendMessage.from === 'history') {
      //   let list = historyList
      //   list.push(sendMessage)
      //   setScrollTop(scrollTop + 1000)
      //   setHistoryList(list)
      // } else {
      let list = chatList
      if (list.length > 100) {
        list.shift()
      }

      list.push(sendMessage)
      setScrollTop(scrollTop + 1000)
      setChatList(list)
    }
    // }
  }, [sendMessage])



  const onScroll = (e) => {

  }
  // useEffect(() => {
  //   console.log(scrollTop);
  //   if (!timer.current) {
  //     //@ts-ignore
  //     timer.current = setInterval(() => {
  //       const top = scrollTop + 20

  //       setScrollTop(top)
  //     }, 500)
  //   }
  // }, [scrollTop])

  return (
    <View className={className}>
      {/* <View className='Live-chat-content'> */}
      {joinInfo && <View className='Live-chat-join'>
        <Text>欢迎</Text>
        <Text className='Live-chat-join-nick'>{joinInfo.substring(0, 10)}</Text>
        <Text>进入直播间</Text>
      </View>}
      {/* <View className='Live-chat-hide'></View> */}
      <ScrollView
        className='Live-chat-content'
        scrollY
        // scrollWithAnimation
        onScroll={onScroll}
        scrollTop={scrollTop}
      >
        {/* <View className='Live-chat-content-container'></View> */}

        {notice && <View className='Live-chat-content-container-item'>
          <View className='Live-chat-content-container-item-box'>
            <Text className='Live-chat-content-container-item-box-name notice'>{notice}</Text>
          </View>
        </View>}
        {
          chatList.map((item, i) => {
            return <View className='Live-chat-content-container-item' key={i}>
              <View style={{ background: item.color ? `rgba(${hexToRgb(item.color).r},${hexToRgb(item.color).g},${hexToRgb(item.color).b}, 0.35)` : '' }} className={item.type !== 'TIMTextElem' ? 'Live-chat-content-container-item-box Live-chat-content-container-item-active' : 'Live-chat-content-container-item-box'}>
                {item.type === 'success' && <Text className='Live-chat-content-container-item-box-content'>恭喜</Text>}
                <Text className='Live-chat-content-container-item-box-content'><Text className='Live-chat-content-container-item-box-name lineCamp1'>{item.nick ? item.nick.substring(0, 12) : ''}</Text><Text className='Live-chat-content-container-item-box-name lineCamp1'>{item.type !== 'success' && '：'}</Text>{item.payload.text}</Text>
              </View>
            </View>
          })
        }

      </ScrollView >
      {/* </View> */}
    </View>
  )
}

export default LiveChat
