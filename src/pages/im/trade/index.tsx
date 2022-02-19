import api2108 from '@/apis/21/api2108'
import Empty from '@/components/Empty'
import NavigationBar from '@/components/NavigationBar'
import { XImage } from '@/components/PreImage'
import Tabs from '@/components/Tabs'
import { empty } from '@/constants/images'
import { tim } from '@/service/im'
import { isImReady, noReadNumber, noReadNumber_buyer, noReadNumber_merchant, noReadNumber_trade, receivedMessage } from '@/store/atoms'
import { deepClone, unitChatTime } from '@/utils/base'
import { getUserInfo } from '@/utils/cachedService'
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
  const [identity, setIdentity] = useState<'buyer' | 'merchant' | ''>('')
  const [nextReqMessageID, setNextReqMessageID] = useState<string>('')
  const [isCompelete, setIsCompelete] = useState<boolean>(false)
  const [noReadNum_trade, setNoReadNum_trade] = useRecoilState(noReadNumber_trade)
  const [noReadNum_buyer, setNoReadNum_buyer] = useRecoilState(noReadNumber_buyer)
  const [noReadNum_merchant, setNoReadNum_merchant] = useRecoilState(noReadNumber_merchant)
  const [noReadNum, setNoReadNum] = useRecoilState(noReadNumber)
  const [list, setList] = useState([])

  const typeList = {
    20: { btnName: '物流详情', color: '#333', priceDes: '合计：' },
    21: { btnName: '去付款', color: '#AA1612', priceDes: '代付款：' },
    22: { btnName: '去发货', color: '#AA1612', priceDes: '合计：' },
    23: { btnName: '物流详情', color: '#333', priceDes: '合计：' },
    30: { btnName: '', color: '#333', priceDes: '当前价：' },
    0: { btnName: '', color: '#333', priceDes: '' },
  }

  useReachBottom(() => {

    // getMessageList(identity)
    if (!isCompelete && nextReqMessageID) {
      let id = identity === 'buyer' ? 'C2C1777777771' : 'C2C1888888881'
      tim.getMessageList({ conversationID: id, count: 20, nextReqMessageID }).then(data => {
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
      getUserInfo().then(res => {
        if (res.userLevel === 3) {
          setIdentity('merchant')
          getMessageList('merchant')
          setNoReadNum_merchant(0)
        } else {
          setIdentity('buyer')
          getMessageList('buyer')
          setNoReadNum_buyer(0)
        }

      })

      // tim.getConversationList().then(res => {
      //   const list = res.data.conversationList.filter(item => item.conversationID === 'C2C1666666661')
      //   setList(list)
      // })
    }
  }, [isReady])

  const getMessageList = (userType) => {
    let id = userType === 'buyer' ? 'C2C1777777771' : 'C2C1888888881'
    tim.getMessageList({ conversationID: id, count: 20 }).then(data => {
      setNextReqMessageID(data.data.nextReqMessageID)
      setIsCompelete(data.data.isCompleted)
      let list = data.data.messageList.map(item => {
        return { ...JSON.parse(item.payload.data), time: unitChatTime(item.time) }
      }).reverse()
      setList(list)
    })
    tim.setMessageRead({ conversationID: id }).then(res => {
      // setNoReadNum(value => { return value - (userType === 'buyer' ? noReadNum_buyer : noReadNum_merchant) })
      setNoReadNum_trade((value) => (value - (userType === 'buyer' ? noReadNum_buyer : noReadNum_merchant)))
    })
  }

  useEffect(() => {
    if (message && message.data) {
      if (message.data[0].type === "TIMCustomElem") {
        if (message.data[0].conversationID === 'C2C1888888881') {
          if (identity === 'merchant') {
            setNoReadNum_merchant(0)
            let newList = deepClone(list)
            newList.unshift({ ...JSON.parse(message.data[0].payload.data), time: unitChatTime(message.data[0].time) })
            setList(newList)
          }
        }
        if (message.data[0].conversationID === 'C2C1777777771') {
          if (identity === 'buyer') {
            setNoReadNum_buyer(0)
            let newList = deepClone(list)
            newList.unshift({ ...JSON.parse(message.data[0].payload.data), time: unitChatTime(message.data[0].time) })
            setList(newList)
          }
        }
      }
    }
  }, [message, identity])

  const tabOption = {
    options: [
      {
        label: '我是卖家',
        value: 'merchant'
      },
      {
        label: '我是买家',
        value: 'buyer'
      }
    ],
    onChange: useCallback((value: 'buyer' | 'merchant'): void => {
      //tab切换之后调用获取商品接口 todo
      setIdentity(value)
      if (value === 'buyer') {
        setNoReadNum_buyer(0)
      } else {
        setNoReadNum_merchant(0)
      }
      getMessageList(value)
    }, []),
    value: identity,
    style: {
      background: '#fff',
      'justify-content': 'flex-start'
    }
  }


  const goOrder = (item) => {
    if ([20, 21, 22, 23].indexOf(item.linkType) > -1) {
      Taro.navigateTo({
        url: `/pages/order/detail/index?orderNo=${item.ext?.order.id}&userCurrentPosition=${identity}`
      })
    }
    if (item.linkType === 0) {
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
    if (item.linkType === 30) {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${item.ext?.auc.id}`
      })
    }
  }

  return (
    <View className='im-trade'>
      <NavigationBar
        title={'交易物流'}
        background={'#ffffff'}
        leftBtn={<Text onClick={() => { Taro.navigateBack() }} className="myIcon messageBack bw-BackAndHomeBtn-back">&#xe707;</Text>}
      />
      {userType === 'merchant' && <View className='im-trade-tabs'>
        {noReadNum_merchant > 0 && <Text className='im-trade-tabs-unread-merchant'>{noReadNum_merchant}</Text>}
        {noReadNum_buyer > 0 && <Text className='im-trade-tabs-unread-buyer'>{noReadNum_buyer}</Text>}
        <Tabs {...tabOption} composition={1} itemClassName='im-trade-tabs-box'></Tabs>
      </View>}
      <View className='im-trade-content'>
        {list.map((item, i) => {
          return <View className='im-trade-content-item' key={i} onClick={() => { goOrder(item) }}>
            <Text className='im-trade-content-item-time'>{item?.time}</Text>
            <View className='im-trade-content-item-box'>
              <View className='im-trade-content-item-title'>{item?.title}</View>
              {item?.ext?.order && item?.ext?.order.name && <View className='im-trade-content-item-card'>
                <XImage className='im-trade-content-item-card-img' src={item?.ext?.order.pic} disabledPlaceholder={false}></XImage>
                <View className='im-trade-content-item-card-info'>
                  <View className='im-trade-content-item-card-info-title'>{item?.ext?.order.name}</View>
                  <View className='im-trade-content-item-card-info-des'>
                    <Text>共 {item?.ext?.order.num} 件商品</Text>
                    <Text className='ml32'>{typeList[item?.linkType].priceDes}¥ {item?.ext?.order.amount}</Text>
                  </View>
                </View>
              </View>}
              {item?.ext?.auc && item?.ext?.auc.name && <View className='im-trade-content-item-card'>
                <XImage className='im-trade-content-item-card-img' src={item?.ext?.auc.pic} disabledPlaceholder={false}></XImage>
                <View className='im-trade-content-item-card-info'>
                  <View className='im-trade-content-item-card-info-title'>{item?.ext?.auc.name}</View>
                  <View className='im-trade-content-item-card-info-des'>
                    <Text>{typeList[item?.linkType].priceDes}¥ {item?.ext?.auc.price}</Text>
                  </View>
                </View>
              </View>}
              <View className='im-trade-content-item-content'>{item?.content}</View>
              {typeList[item?.linkType].btnName && <View className='im-trade-content-item-btn'>
                <Text className='left' style={{ color: typeList[item?.linkType].color }}>{typeList[item?.linkType].btnName}</Text>
                <Text className='right'>{'>'}</Text>
              </View>}
              {/* <Image className='im-trade-item-img' mode='heightFix' src={item?.icon}></Image> */}
            </View>
          </View>
        })}
        {list.length < 1 && <Empty className='im-trade-empty' text='暂无消息' src={empty} />}
      </View>
    </View>
  )
}

export default tarde
