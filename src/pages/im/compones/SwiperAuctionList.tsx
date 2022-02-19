import PreImage from '@/components/PreImage'
import list from '@/pages/bwSchool/list'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { SwipeAction } from 'antd-mobile'
import { ReactNode, useMemo, useState } from 'react'
import { getRealSize, unitChatTime } from '@/utils/base';
import { AtList, AtSwipeAction } from 'taro-ui'
import qs from 'query-string'
import '../index.scss'
import { navigationBarInfo } from '@/components/NavigationBar'

interface IProps {
  list: any[]
  goMessage: Function
  onDelete: Function
  onTop: Function
}

const SwiperAuctionList = (props: IProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const system = useMemo(() => Taro.getSystemInfoSync(), [])


  const goMessage = (id) => {
    //跳到消息页面

    props.goMessage(id)
  }


  const clickItem = (e, id, isPinned) => {
    if (e.text === '删除') {
      props.onDelete(id)
    } else {
      props.onTop(id, isPinned)
    }
  }

  return (
    <View>

      {
        process.env.TARO_ENV === 'weapp' ? <AtList className='bw-atList'>
          {props.list.map((item, index) => {
            return <AtSwipeAction
              onClick={(e) => clickItem(e, item.conversationID, item.isPinned)}
              key={item.conversationID + index}
              autoClose
              maxDistance={200}
              areaWidth={system.screenWidth}
              // onClosed={this.handleClosed}
              options={[
                {
                  text: item.isPinned ? '取消置顶' : '置顶',
                  style: { backgroundColor: '#ED983D', color: 'white', height: '100px' },
                },
                {
                  text: '删除',
                  // onPress: () => { onDelete(item.conversationID) },
                  style: { backgroundColor: '#F4333C', color: 'white', height: '100px' },
                },
              ]}
            >
              {item.type !== '@TIM#SYSTEM' && <View className={item.isPinned ? 'message-list-item pined' : 'message-list-item'} onClick={() => { goMessage(item?.userProfile.userID) }}>
                <View className='message-list-item-imgBox'>
                  <PreImage className='message-list-item-imgBox-img' src={qs.stringifyUrl({ url: item?.userProfile?.avatar, query: { 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 375) * 2)},m_lfit` } })} />
                  {item?.unreadCount > 0 && <span className='message-list-item-imgBox-point'>{item?.unreadCount}</span>}
                </View>
                <View className='message-list-item-info'>
                  <View className='message-list-item-info-name'>{item?.userProfile.nick}</View>
                  <View className='message-list-item-info-des'>{item?.lastMessage?.messageForShow}</View>
                  <span className='message-list-item-info-time'>{unitChatTime(item?.lastMessage.lastTime)}</span>
                  {/* <span onClick={(e) => { onDelete(item.conversationID, e) }}>删除</span>  */}
                </View>
              </View >
              }
            </AtSwipeAction >
          })}
        </AtList > : <div>
          {props.list.map((item, index) => {
            return <SwipeAction
              key={item.conversationID + index}
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  text: item.isPinned ? '取消置顶' : '置顶',
                  onPress: () => props.onTop(item.conversationID, item.isPinned),
                  style: { backgroundColor: '#ED983D', color: 'white', width: '75px' },
                },
                {
                  text: '删除',
                  onPress: () => { props.onDelete(item.conversationID) },
                  style: { backgroundColor: '#F4333C', color: 'white', width: '75px' },
                },
              ]}
              onOpen={() => console.log('global open')}
              onClose={() => { }}
            >
              {item.type !== '@TIM#SYSTEM' && <div className={item.isPinned ? 'message-list-item mt24 pined' : 'message-list-item mt24'} onClick={() => { goMessage(item?.userProfile.userID) }}>
                <div className='message-list-item-imgBox'>
                  <PreImage className='message-list-item-imgBox-img' src={qs.stringifyUrl({ url: item?.userProfile?.avatar, query: { 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 375) * 2)},m_lfit` } })} />
                  {item?.unreadCount > 0 && <span className='message-list-item-imgBox-point'>{item?.unreadCount}</span>}
                </div>
                <div className='message-list-item-info'>
                  <p className='message-list-item-info-name'>{item?.userProfile.nick}</p>
                  <p className='message-list-item-info-des'>{item?.lastMessage?.messageForShow}</p>
                  <span className='message-list-item-info-time'>{unitChatTime(item?.lastMessage.lastTime)}</span>
                  {/* <span onClick={(e) => { onDelete(item.conversationID, e) }}>删除</span>  */}
                </div>
              </div >
              }
            </SwipeAction >
          })}
        </div >
      }

    </View>
  )
}

export default SwiperAuctionList

