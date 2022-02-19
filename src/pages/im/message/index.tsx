import Taro, { ENV_TYPE, getFileInfo, showLoading } from '@tarojs/taro'
import { Image, Text, ScrollView, View, Textarea, Video } from "@tarojs/components";
import './index.scss'
// import TIM from 'tim-js-sdk';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { session } from '@/utils/storge';
import { useDidShow } from '@tarojs/runtime';
import { AtInput, AtTextarea } from 'taro-ui';
import { useRecoilState } from 'recoil';
import { conversationList, noReadNumber, receivedMessage, isImReady } from '@/store/atoms';
import { back, emoj, loading, loading1, mrtx, paishe, plus, shipin, tupian } from '@/constants/images';
import { addWaterMarker, XImage } from '@/components/PreImage';
import dayjs from 'dayjs';
import { debounce, deepClone, getEmojiSize, getRealSize, selectorQueryClientRect, unitChatTime, fen2yuan } from '@/utils/base';
import NavigationBar from '@/components/NavigationBar';
import { DEVICE_NAME, IMID } from '@/constants';
import { imgs, url } from '@/constants/emoji'
import { tim, TIM } from '@/service/im';
import classNames from 'classnames';
import api2108 from '@/apis/21/api2108';
import { env } from 'config/dev';
const Message = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [value, setValue] = useState<any>('')
  const [messageList, setMessageList] = useState<any>([])
  const [list, setList] = useRecoilState(conversationList)
  const [noReadNum, setNoReadNum] = useRecoilState(noReadNumber)
  const [message, setMessage] = useRecoilState(receivedMessage)
  const [isReady, setReady] = useRecoilState(isImReady)
  const [scrollTop, setScrollTop] = useState<number>(9999)
  const [showOperation, setshowOperation] = useState<boolean>(false)
  const [nextReqMessageID, setNextReqMessageID] = useState<any>()
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [emojiVisible, setEmojiVisible] = useState<boolean>(false)
  const [storeName, setStoreName] = useState<string>('聊天')
  const [chatTime, setChatTime] = useState<number>(0)
  const [checked, setChecked] = useState<string>()
  const [chatNum, setChatNum] = useState<number>(0)
  const [stepHeight, setStepHeight] = useState<number>(0)
  const [loadingId, setLoadingId] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [scale, setScale] = useState<number>(0)
  const [fromMessage, setFromMessage] = useState<any>({})
  const [textareaHeight, setTextareaHeight] = useState<number>(20)
  const [bottomHeight, setBottomHeight] = useState<number>(0)
  const scrollRef = useRef()
  const textAreaRef = useRef()
  // const tim = TIM.create(IMID)
  const type = page.router?.params.type

  const getMessage = async () => {
    // 获取消息列表
    const imResponse = nextReqMessageID ? await tim.getMessageList({ conversationID: `C2C${page.router?.params.id}`, count: 20 }) : await tim.getMessageList({ conversationID: `C2C${page.router?.params.id}`, count: 15, nextReqMessageID })

    const messageList = JSON.parse(JSON.stringify(imResponse.data.messageList)); // 消息列表。


    let firstTime = messageList.length > 0 ? messageList[0].time * 1000 : 0
    setChatTime(firstTime)
    setChatNum(messageList.length - 1)
    messageList.forEach((item, index) => {
      if (index !== 0) {
        if (firstTime + 300000 > item.time * 1000) {
          item.time = null
        } else {
          item.time && (firstTime = item.time * 1000)
          setChatTime(firstTime)
        }
      }
      if (item.payload.description || item.payload.data) {
        item.payload.goodsDetail = item.payload.data.indexOf('_type') > -1 ? JSON.parse(item.payload.data) : JSON.parse(item.payload.description)
      }
      if (item.type === 'TIMImageElem') {
        item.scale = item.payload.imageInfoArray[0].width / item.payload.imageInfoArray[0].height
      }
    })
    setMessageList(messageList)
    const nextReqMessageID1 = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。

    setNextReqMessageID(nextReqMessageID1)
    const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
    setIsCompleted(isCompleted)

  }


  useLayoutEffect(() => {
    const id = page.router?.params.id;
    if (isReady) {
      tim.getUserProfile({
        userIDList: [page.router?.params.id] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      }).then(res => {
        setFromMessage(res)
      })
      setNoReadNum((value => {
        const num = list.filter(item => item.userProfile.userID === page.router?.params.id)[0]?.unreadCount
        return value - num
      }))

      setList(value => {
        let list = JSON.parse(JSON.stringify(value))
        list.forEach(item => {
          if (item.userProfile.userID === page.router?.params.id) {
            item.unreadCount = 0
            setStoreName(item.userProfile.nick)
          }
        })
        return list
      })
      getMessage().then(async (res) => {
        const dom1 = await selectorQueryClientRect('#scrollHeight')
        // const height1 = DEVICE_NAME === 'weapp' ? dom1.height : scrollRef.current.offsetHeight
        setTimeout(() => {
          setScrollTop(scrollTop + 500)
          setIsLoading(false)
        }, 800);
      })

    }
    return () => {
      tim.setMessageRead({ conversationID: `C2C${id}` })
      setList(value => {
        let list = JSON.parse(JSON.stringify(value))
        list.forEach(item => {
          if (item.userProfile.userID === id) {
            item.unreadCount = 0
          }
        })
        return list
      })
    }

  }, [isReady])

  // useEffect(() => {
  //   if (!nextReqMessageID && messageList) {
  //     // setTimeout(() => {

  //     // }, 1000);
  //   }
  // }, [messageList])

  useEffect(() => {
    api2108()
    if (isReady && message && message.data) {
      if (message.data[0].from === page.router?.params.id) {
        const list = JSON.parse(JSON.stringify(messageList))
        const newMessage = JSON.parse(JSON.stringify(message))
        if (newMessage.data[0].type === "TIMCustomElem") {
          if (newMessage.data[0].payload.description || newMessage.data[0].payload.data) {
            newMessage.data[0].payload.goodsDetail = newMessage.data[0].payload.data._type ? JSON.parse(newMessage.data[0].payload.data) : JSON.parse(newMessage.data[0].payload.description)
          }
        }
        if (newMessage.data[0].type === 'TIMImageElem') {
          newMessage.data[0].scale = newMessage.data[0].payload.imageInfoArray[0].width / newMessage.data[0].payload.imageInfoArray[0].height
        }
        if (chatTime + 300000 > newMessage.data[0].time * 1000) {
          newMessage.data[0].time = null
        } else {
          setChatTime(newMessage.data[0].time * 1000)
        }
        list.push(newMessage.data[0])
        setMessageList(list)

        if (message.type === "TIMImageElem") {

          Taro.getImageInfo({
            src: message.payload.imageInfoArray[0].url,
            success: function (res) {
              setScrollTop(scrollTop + res.height)
            }
          })
        } else {
          setScrollTop(scrollTop + 500)
        }
      } else if (message.data[0].flow === 'out') {
        updateMessage(message.data[0], 'out')
      }
    }

  }, [message])

  const updateMessage = (message, type = 'in') => {
    let scale1 = 1
    setValue('')
    setshowOperation(false)
    let num = chatNum
    setChatNum(num++)
    textAreaRef.current.style.height = `${getRealSize(80)}px`
    const list = JSON.parse(JSON.stringify(messageList))
    const message1 = JSON.parse(JSON.stringify(message))

    if (chatTime + 300000 > message1.time * 1000) {
      message1.time = null
    } else {
      setChatTime(message1.time * 1000)
    }
    let idList = [...loadingId]
    idList.push(message1.ID)
    if (type !== 'out') {
      setLoadingId(idList)
    }
    if (message.type === "TIMImageElem") {

      Taro.getImageInfo({
        src: message.payload.imageInfoArray[0].url,
        success: function (res) {
          setScrollTop(scrollTop + res.height)
          scale1 = res.width / res.height
          setScale(res.width / res.height)
        }
      }).then(() => {
        message1.scale = scale1
        list.push(message1)
        setMessageList(list)
      })
    } else {
      setScrollTop(scrollTop + 500)
      message1.scale = scale1
      list.push(message1)
      setMessageList(list)
    }

  }

  const sendMessage = () => {
    if (isReady) {
      let message = tim.createTextMessage({
        to: page.router?.params.id,
        conversationType: TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          text: value
        },
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      });

      // 预发送信息
      updateMessage(message)


      // 2. 发送消息
      let promise = tim.sendMessage(message);

      promise.then(function (imResponse) {
        // const list = JSON.parse(JSON.stringify(messageList))
        // list[list.length - 1].loading = null
        // setMessageList(list)
        // 发送成功
        resetList(imResponse)

      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    }
  }

  // 更新会话
  const resetList = (imResponse) => {
    const list = loadingId.filter(item => item !== imResponse.ID)
    setLoadingId(list)
    setList(value => {
      let list = deepClone(value)
      list.forEach(item => {
        if (item.userProfile.userID === page.router?.params.id) {
          if (imResponse.data.message.type === 'TIMTextElem') {
            item.lastMessage.messageForShow = imResponse.data.message.payload.text
          } else if (imResponse.data.message.type === "TIMImageElem") {
            item.lastMessage.messageForShow = '[图片]'
          } else if (imResponse.data.message.type === "TIMCustomElem") {
            item.lastMessage.messageForShow = '[自定义消息]'
          }
          item.lastMessage.payload = imResponse.data.message.payload
          if (!item.userProfile.avatar && !item.userProfile.nick) {
            item.userProfile.nick = fromMessage?.data[0].nick
            item.userProfile.avatar = fromMessage?.data[0].avatar
          }
          // item.lastMessage.payload = imResponse.data.message.payload
          // item.lastMessage.messageForShow = imResponse.data.message.payload
          // item.lastMessage.lastTime = imResponse.data.message.time
        }
      })
      return list
    })
  }


  const onChange = async (e) => {
    // setValue(e.detail.value)
    setValue(e.target.value)
    // e.target.style.height = 'auto'
    // e.target.style.height = `${e.target.scrollHeight}px`
    // console.log(await selectorQueryClientRect('#textarea'));
    textAreaRef.current.style.height = 'auto'
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
    // console.log(textAreaRef.current.scrollHeight);

  }
  const onChangeWeapp = async (e) => {
    // setValue(e.detail.value)
    setValue(e)


  }
  const onScroll = (e) => {
    if (stepHeight !== e.detail.scrollHeight) {
      setStepHeight(e.detail.scrollHeight)

    }
  }

  const onScrollToUpper = useCallback(async () => {

    const dom1 = await selectorQueryClientRect('#scrollHeight')

    const height1 = DEVICE_NAME === 'weapp' ? dom1.height : scrollRef.current.clientHeight
    !isCompleted && nextReqMessageID && tim.getMessageList({ conversationID: `C2C${page.router?.params.id}`, count: 20, nextReqMessageID }).then(imResponse => {
      // Taro.showLoading({
      //   title: '加载历史记录'
      // })
      let list = [...messageList]
      let firstTime = chatTime
      imResponse.data.messageList.reverse().forEach(item => {
        if (firstTime - 300000 < item.time * 1000) {
          item.time = null
        } else {
          firstTime = item.time * 1000
          setChatTime(firstTime)
        }
        if ((item.payload.data && JSON.parse(item.payload.data)._type === 'productCard' || (item.payload.description && JSON.parse(item.payload.description)._type === 'productCard'))) {
          item.payload.goodsDetail = JSON.parse(item.payload.data)._type ? JSON.parse(item.payload.data) : JSON.parse(item.payload.description)
        }
        if (item.type === 'TIMImageElem') {
          item.scale = item.payload.imageInfoArray[0].width / item.payload.imageInfoArray[0].height
        }
        list.unshift(item)
      })
      setMessageList(list)
      // console.log(list.length);


      // setChecked(`scroll${list.length - chatNum + 3}`)
      // setChatNum(list.length - 1)

      const nextReqMessageID1 = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。

      setNextReqMessageID(nextReqMessageID1)
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      setIsCompleted(isCompleted)
      // setTimeout(() => {
      //   Taro.nextTick(async () => {
      //     const dom2 = await selectorQueryClientRect('#scrollHeight')
      //     setScrollTop(dom2.height - height1)
      //     Taro.hideLoading()
      //     // setScrollTop(dom2.height)
      //   })
      // }, 500);
      Taro.showToast({
        title: '历史记录已加载',
        icon: 'none'
      })
    })




  }, [messageList, nextReqMessageID, isCompleted])

  const getOperation = () => {

    setEmojiVisible(false)
    setshowOperation(!showOperation)
    setScrollTop(scrollTop + 100)
  }

  const getFile = (e) => {
    console.log(23454555656);

    if (process.env.TARO_ENV !== 'weapp') {
      let message = tim.createImageMessage({
        to: page.router?.params.id,
        conversationType: TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          file: e.target.files[0],
        },
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
        onProgress: function (event) { }
      })

      updateMessage(message)

      let promise = tim.sendMessage(message);
      promise.then(function (imResponse) {
        // 发送成功
        // const list = JSON.parse(JSON.stringify(messageList))
        // list.push(imResponse.data.message)
        // setMessageList(list)
        // setValue('')
        // setshowOperation(false)
        resetList(imResponse)
        // setScrollTop(scrollTop + 500)
        // let num = chatNum
        // setChatNum(num++)
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    }
  }

  const preview = (url) => {
    Taro.previewImage({
      current: addWaterMarker(url), // 当前显示图片的http链接
      urls: [addWaterMarker(url)] // 需要预览的图片http链接列表
    })
  }


  const showEmoji = () => {
    setshowOperation(false)
    setEmojiVisible(true)
    setScrollTop(scrollTop + 500)
  }

  const hideOperation = () => {
    setshowOperation(false)
    setEmojiVisible(false)
    process.env.TARO_ENV === 'weapp' && Taro.onKeyboardHeightChange(res => {
      setTimeout(() => {
        // setBottomHeight(res.height)
        setScrollTop(scrollTop + 100)
      }, 100);
    })

  }

  const chooseEmoji = async (item) => {
    setValue(value + ' ' + item)
    //  await selectorQueryClientRect('#textarea')
    textAreaRef.current.style.height = 'auto'
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
  }

  const goGoods = (item, type) => {
    if (item._type === 'productCard') {
      Taro.navigateTo({
        url: `/pages/goods/goodsDetail/index?productId=${item.productId}`
      })
    } else {
      let userCurrentPosition = 'buyer'
      if (type === 'send') {
        userCurrentPosition = item._sender
      } else {
        userCurrentPosition = item._sender === 'buyer' ? 'merchant' : 'buyer'
      }
      Taro.navigateTo({
        url: `/pages/order/detail/index?orderNo=${item.orderNo}&userCurrentPosition=${userCurrentPosition}`
      })
    }
  }
  const onClose = () => {
    setshowOperation(false)
    setEmojiVisible(false)
  }

  const onPlayAudio = (url) => {
    const innerAudioContext = Taro.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = url
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
  }

  const getFileWeapp = () => {
    const id = page.router?.params.id
    if (process.env.TARO_ENV === 'weapp') {
      Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

          let message = tim.createImageMessage({
            to: id,
            conversationType: TIM.TYPES.CONV_C2C,
            // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
            // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
            // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
            payload: {
              file: res
            },
            // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
            // cloudCustomData: 'your cloud custom data'
            onProgress: function (event) { }
          })

          updateMessage(message)

          let promise = tim.sendMessage(message);
          promise.then(function (imResponse) {
            // 发送成功
            // const list = JSON.parse(JSON.stringify(messageList))
            // list.push(imResponse.data.message)
            // setMessageList(list)
            // setValue('')
            // setshowOperation(false)
            resetList(imResponse)
            setScrollTop(scrollTop + 500)
            // let num = chatNum
            // setChatNum(num++)
          }).catch(function (imError) {
            // 发送失败
            console.warn('sendMessage error:', imError);
          });

          // var tempFilePaths = res.tempFilePaths
        }
      })
    }

  }

  const onPlay = (id) => {
    let videoContext = Taro.createVideoContext(id)
    videoContext.requestFullScreen()
  }

  const activeClass = classNames(
    'message-chat',
    {
      'actived': showOperation
    },
    {
      'emojiActived': emojiVisible
    }
  )
  const goBack = () => {
    Taro.navigateBack()
  }

  return (
    <div className='im-container'>
      <ScrollView
        className='im-scrollview'
        scrollY
        // refresherEnabled
        // refresherThreshold={50}
        // refresherDefaultStyle='white'
        // refresherBackground='#fff'
        onScrollToUpper={debounce(onScrollToUpper, 1000)}
        scrollTop={scrollTop}
        lowerThreshold={50}
        onScroll={onScroll}
      // onScrollToLower={loadMore}
      >
        <NavigationBar
          title={storeName}
          background={'#ffffff'}
          leftBtn={<i className='myIcon fz50' onClick={goBack}>&#xe707;</i>}
        />
        {isLoading && <div className='im-message-loading'>
          <div>
            <img className='im-message-loading-img' src={loading1} alt="" />
            <p className='im-message-loading-tips'> 消息加载中</p>
          </div>
        </div>}
        <div className={activeClass} id='scrollHeight' ref={scrollRef}>
          {messageList.map((item, index) => {
            return <div className='message-chat-list' key={item.ID + index} onClick={onClose}>
              {item.time && <p className='message-chat-list-time'> {unitChatTime(item.time)}</p>}
              {item.flow === 'in' ? <div className='message-chat-adverse'>
                <Image className='message-chat-adverse-head' src={item.avatar || mrtx} />
                {item.payload.text && <p className='message-chat-adverse-content'>
                  {item.payload.text.split(/(\[.+?\])/).filter(item => item !== ' ').map((item, index) => {
                    return item.indexOf(']') > -1 && imgs.filter(item2 => item2.face_name === item).length > 0 ? <span key={index} className='emojiImg' style={{ backgroundSize: getEmojiSize(56) + 'px', backgroundPosition: `${getRealSize(-6)}px ${(process.env.TARO_ENV === 'weapp' ? -56 : getRealSize(-56)) * (parseInt(imgs.filter(item2 => item2.face_name === item)[0].face_id) - 1)}${process.env.TARO_ENV === 'weapp' ? 'rpx' : 'px'}` }}></span> :
                      <span key={index}>{item}</span>
                  })}
                </p>}
                {item.payload.imageFormat && <Image style={item.scale > 1 ? { width: '140px', height: `${140 / item.scale}px` } : { height: '140px', width: `${140 / item.scale}px` }} onClick={() => { preview(item.payload.imageInfoArray[1].url) }} src={item.payload.imageInfoArray[1].url} className={item.payload.imageInfoArray[1].width / item.payload.imageInfoArray[1].height >= 1 || item.scale >= 1 ? 'message-chat-adverse-image' : 'message-chat-adverse-imageH'}>
                </Image>}
                {item.type === "TIMSoundElem" &&
                  <div className='message-chat-adverse-audio' onClick={() => { onPlayAudio(item.payload.url) }}>
                    <div className="arrow"></div>
                    <div className='wave'>
                      <div className="wifi-circle first"></div>
                      <div className="wifi-circle second"></div>
                      <div className="wifi-circle third"></div>
                    </div>
                  </div>
                }
                {item.type === "TIMVideoFileElem" &&
                  <div className='message-chat-adverse-video'>
                    <Video
                      id={`video${index}`}
                      src={item.payload.videoUrl}
                      posterForCrawler={item.payload.remoteVideoUrl}
                      onPlay={() => { onPlay(`video${index}`) }}
                      initialTime={0}
                      controls={true}
                      autoplay={false}
                      loop={false}
                      muted={false}
                      showCenterPlayBtn={false}
                    />
                  </div>
                }
                {
                  item.payload.goodsDetail && <div className='message-chat-adverse-card ml14' onClick={() => { goGoods(item.payload.goodsDetail, 'receive') }}>
                    {item.payload.goodsDetail._type !== 'productCard' && <div className='message-chat-adverse-card-title'>{item.payload.goodsDetail?.orderTitle}</div>}
                    <div className='message-chat-adverse-card-box'>
                      <img className='message-chat-adverse-card-box-img' src={item.payload.goodsDetail?.productIcon} alt="" />
                      <div className='message-chat-adverse-card-box-des'>
                        <p className='message-chat-adverse-card-box-des-name'>{item.payload.goodsDetail?.porductName}</p>
                        {item.payload.goodsDetail._type === 'productCard' ? <p className='message-chat-adverse-card-box-des-price'>¥ {fen2yuan(item.payload.goodsDetail?.price)}</p> :
                          <p className='message-chat-adverse-card-box-des-price'>{item.payload.goodsDetail?.orderSatusStr}</p>}
                      </div>
                    </div>
                    {item.payload.goodsDetail._type !== 'productCard' && <div className='message-chat-adverse-card-orderNo'>
                      订单编号：{item.payload.goodsDetail?.orderNo}
                    </div>}
                  </div>
                }
              </div> : <div className='message-chat-own'>
                {/* <span className='emojiImg' ></span> */}
                <div className='message-chat-own-contentBox'>
                  {loadingId.includes(item.ID) && <div className='message-chat-own-contentBox-loading'><img className='message-chat-own-contentBox-loading-img' src={loading} alt="" /></div>}
                  {item.payload.text && <p className='message-chat-own-content'>
                    {item.payload.text.split(/(\[.+?\])/).filter(item => item !== ' ').map((item, index) => {
                      return item.indexOf(']') > -1 && imgs.filter(item2 => item2.face_name === item).length > 0 ? <span className='emojiImg' key={index} style={{ backgroundSize: getEmojiSize(56) + 'px', backgroundPosition: `${getRealSize(-6)}px ${(process.env.TARO_ENV === 'weapp' ? -56 : getRealSize(-56)) * (parseInt(imgs.filter(item2 => item2.face_name === item)[0].face_id) - 1)}${process.env.TARO_ENV === 'weapp' ? 'rpx' : 'px'}` }}></span> :
                        <span key={index}>{item}</span>
                    })}
                  </p>}
                  {item.payload.imageFormat && <Image style={item.scale > 1 ? { width: '140px', height: `${140 / item.scale}px` } : { height: '140px', width: `${140 * item.scale}px` }} onClick={() => { preview(item.payload.imageInfoArray[1].url) }} src={item.payload.imageInfoArray[1].url} className={item.payload.imageInfoArray[1].width / item.payload.imageInfoArray[1].height >= 1 || item.scale >= 1 ? 'message-chat-own-image' : 'message-chat-own-imageH'} />
                  }
                  {
                    item.payload.goodsDetail && <div className='message-chat-own-card' onClick={() => { goGoods(item.payload.goodsDetail, 'send') }}>
                      {item.payload.goodsDetail._type !== 'productCard' && <div className='message-chat-own-card-title'>{item.payload.goodsDetail?.orderTitle}</div>}
                      <div className='message-chat-own-card-box'>
                        <img className='message-chat-own-card-box-img' src={item.payload.goodsDetail?.productIcon} alt="" />
                        <div className='message-chat-own-card-box-des'>
                          <p className='message-chat-own-card-box-des-name'>{item.payload.goodsDetail?.porductName}</p>
                          {item.payload.goodsDetail._type === 'productCard' ? <p className='message-chat-own-card-box-des-price'>¥ {fen2yuan(item.payload.goodsDetail?.price)}</p> :
                            <p className='message-chat-own-card-box-des-price'>{item.payload.goodsDetail?.orderSatusStr}</p>}
                        </div>
                      </div>
                      {item.payload.goodsDetail._type !== 'productCard' && <div className='message-chat-own-card-orderNo'>
                        订单编号：{item.payload.goodsDetail?.orderNo}
                      </div>}
                    </div>
                  }
                </div>
                <Image className='message-chat-own-head' src={item.avatar || mrtx} />
              </div>
              }

            </div>
          })}


        </div>
      </ScrollView >
      <div className='message-chat-bottom' style={{ bottom: process.env.TARO_ENV === 'weapp' ? bottomHeight : 0 }}>
        <div className='message-chat-bottom-inputBox'>
          <textarea className='message-chat-bottom-input' cursorSpacing={20} onInput={onChange} ref={textAreaRef} rows='1' id='textarea' onFocus={hideOperation} value={value}></textarea>
          <View className='message-chat-bottom-showBox'>{value}</View>
          {/* <AtTextarea className='message-chat-bottom-input' onChange={onChangeWeapp} autoHeight ref={textAreaRef} adjustPosition id='textarea' onFocus={hideOperation} value={value}></AtTextarea> */}
          <div className='message-chat-bottom-operation'>
            <img src={emoj} className='message-chat-bottom-operation-img' onClick={showEmoji}></img>
            {!value ? <img src={plus} className='message-chat-bottom-operation-img' onClick={getOperation}></img>
              : <p className='send' onClick={sendMessage}>发送</p>}
          </div>
        </div>
        {showOperation && <div className='message-chat-bottom-content'>
          <div className='message-chat-bottom-content-box'>
            <input type="file" id='file' className='image-input' onChange={getFile} onClick={getFileWeapp} name="" />
            <div className='message-chat-bottom-content-box-icon'>
              <XImage className='message-chat-bottom-content-box-icon-img' src={tupian}></XImage>
            </div>
            <p className='message-chat-bottom-content-box-name'>照片</p>
          </div>
          {/* <div className='message-chat-bottom-content-box'>
              <div className='message-chat-bottom-content-box-icon'>
                <XImage className='message-chat-bottom-content-box-icon-img' src={paishe}></XImage>
              </div>
              <p className='message-chat-bottom-content-box-name'>拍摄</p>
            </div>
            <div className='message-chat-bottom-content-box'>
              <div className='message-chat-bottom-content-box-icon'>
                <XImage className='message-chat-bottom-content-box-icon-img' src={shipin}></XImage>
              </div>
              <p className='message-chat-bottom-content-box-name'>视频</p>
            </div> */}
        </div>}
        {emojiVisible && <div className='message-chat-bottom-emojiContent'>
          {imgs.map((item, index) => {
            return <View key={item.face_id + index} className='message-chat-bottom-emojiContent-embox'><View className='emoji' style={{ backgroundSize: getEmojiSize(80) + 'px', backgroundPosition: `${getRealSize(-6)}px ${process.env.TARO_ENV === 'weapp' ? -80 * index + 'rpx' : getRealSize(-80) * index + 'px'}` }} key={index} onClick={() => { chooseEmoji(item.face_name) }}>
              {/* <Text>{item}</Text> */}
            </View></View>
          })}
        </div>}
      </div>
    </div>

  )
}

export default Message
