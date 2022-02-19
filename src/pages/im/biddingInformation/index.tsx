import api2108 from '@/apis/21/api2108'
import Empty from '@/components/Empty'
import NavigationBar from '@/components/NavigationBar'
import { XImage } from '@/components/PreImage'
import Tabs from '@/components/Tabs'
import { empty } from '@/constants/images'
import { tim } from '@/service/im'
import { isImReady, noReadNumber, noReadNumber_bidding, receivedMessage } from '@/store/atoms'
import { deepClone, unitChatTime } from '@/utils/base'
import { useUserTypeHook } from '@/utils/hooks'
import { session } from '@/utils/storge'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import './index.scss'

const tarde = () => {
  const [isReady, setReady] = useRecoilState(isImReady)
  const [message, setMessage] = useRecoilState(receivedMessage)
  const { userType } = useUserTypeHook()
  const [list, setList] = useState([])
  const [nextReqMessageID, setNextReqMessageID] = useState<string>('')
  const [isCompelete, setIsCompelete] = useState<boolean>(false)
  const [noReadNum_bidding, setNoReadNum_bidding] = useRecoilState(noReadNumber_bidding)
  const [noReadNum, setNoReadNum] = useRecoilState(noReadNumber)
  useReachBottom(() => {

    // getMessageList(identity)
    console.log(nextReqMessageID, isCompelete);
    if (!isCompelete && nextReqMessageID) {
      tim.getMessageList({ conversationID: 'C2C1999999991', count: 20, nextReqMessageID }).then(data => {
        setNextReqMessageID(data.data.nextReqMessageID)
        setIsCompelete(data.data.isCompleted)
        let newList = data.data.messageList.map(item => {
          return { ...JSON.parse(item.payload.data), time: unitChatTime(item.time) }
        }).reverse()
        setList(list.concat(newList))
      })
    }

  })
  const typeList = {
    21: { btnName: '去付款', color: '#AA1612', priceDes: '中拍价：' },
    31: { btnName: '去出价', color: '#AA1612', priceDes: '当前价：' }, // 出价被超过
    0: { btnName: '', color: '', priceDes: '' },
  }

  useEffect(() => {
    if (!isReady) {
      if (!session.getItem('token')) {
        api2108()
      }
    } else {
      getMessageList()
      // tim.getConversationList().then(res => {
      //   const list = res.data.conversationList.filter(item => item.conversationID === 'C2C1666666661')
      //   setList(list)
      // })
    }
  }, [isReady])

  const getMessageList = () => {
    tim.getMessageList({ conversationID: 'C2C1999999991', count: 20 }).then(data => {
      setNextReqMessageID(data.data.nextReqMessageID)
      setIsCompelete(data.data.isCompleted)
      let list = data.data.messageList.map(item => {
        return { ...JSON.parse(item.payload.data), time: unitChatTime(item.time) }
      }).reverse()

      setList(list)
    })
    tim.setMessageRead({ conversationID: 'C2C1999999991' }).then(res => {
      setNoReadNum(value => { return value - noReadNum_bidding })
      setNoReadNum_bidding(0)
    })
  }

  useEffect(() => {
    if (message && message.data) {
      if (message.data[0].type === "TIMCustomElem") {
        if (message.data[0].conversationID === 'C2C1999999991') {
          let newList = deepClone(list)
          newList.unshift({ ...JSON.parse(message.data[0].payload.data), time: unitChatTime(message.data[0].time) })
          setList(newList)
        }
      }
    }
  }, [message])

  const goProduct = (item) => {
    if (item.linkType === 31) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${item.ext?.auc.id}`
      })
    } else if (item.linkType === 21) {
      Taro.navigateTo({
        url: `/pages/order/detail/index?orderNo=${item.ext?.order.id}`
      })
    }
  }

  return (
    <View className='im-biddingInformation'>
      <NavigationBar
        title={'参拍信息'}
        background={'#ffffff'}
        leftBtn={<Text onClick={() => { Taro.navigateBack() }} className="myIcon messageBack bw-BackAndHomeBtn-back">&#xe707;</Text>}
      />
      <View className='im-biddingInformation-content'>
        {list.map((item, i) => {
          return <View className='im-biddingInformation-content-item' key={i} onClick={() => { goProduct(item) }}>
            <Text className='im-biddingInformation-content-item-time'>{item?.time}</Text>
            <View className='im-biddingInformation-content-item-box'>
              <View className='im-biddingInformation-content-item-title'>{item?.title}</View>
              {item?.ext?.auc && <View className='im-biddingInformation-content-item-card'>
                <XImage className='im-biddingInformation-content-item-card-img' src={item?.ext?.auc.pic} disabledPlaceholder={false}></XImage>
                <View className='im-biddingInformation-content-item-card-info'>
                  <View className='im-biddingInformation-content-item-card-info-title'>{item?.ext?.auc.name}</View>
                  <View className='im-biddingInformation-content-item-card-info-des'>
                    <Text>{typeList[item?.linkType].priceDes}¥ {item?.ext?.auc.price}</Text>
                  </View>
                </View>
              </View>}
              <View className='im-biddingInformation-content-item-content'>{item?.content}</View>
              {item?.ext?.auc && typeList[item?.linkType].btnName && <View className='im-biddingInformation-content-item-btn'>
                <Text className='left' style={{ color: typeList[item?.linkType].color }}>{typeList[item?.linkType].btnName}</Text>
                <Text className='right'>{'>'}</Text>
              </View>}
              {/* <Image className='im-biddingInformation-item-img' mode='heightFix' src={item?.icon}></Image> */}
            </View>
          </View>
        })}
        {list.length < 1 && <Empty className='im-biddingInformation-empty' text='暂无消息' src={empty} />}
      </View>
    </View>
  )
}

export default tarde
