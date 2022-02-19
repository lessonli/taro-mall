import Taro, { onNetworkStatusChange, request, useDidShow, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Text, Textarea, View, LivePlayer, Swiper, SwiperItem, Image, Input, CoverView } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import LiveShoppingCar from '../components/LiveShoppingCar'
import LiveProduct from '../components/LiveProduct'
import { tim, TIM } from '@/service/im';
import { useRecoilState } from 'recoil'
import { isImReady, liveHistoryIn, liveModal, liveUserInfo, receivedMessage, shoppingCarListInfo, worker } from '@/store/atoms'
import LiveModal from '../components/LiveModal'
import Popup from '@/components/Popup'
import LiveHeader, { LiveId } from '../components/LiveHeader'
import LiveChat from '../components/LiveChat'
import LiveBottom from '../components/LiveBottom'
import NavigationBar from '@/components/NavigationBar'
import api4504, { IResapi4504 } from '@/apis/21/api4504'
import { BwTaro, deepClone, fen2yuan } from '@/utils/base'
import api4610, { IResapi4610 } from '@/apis/21/api4610'
import { useRef } from 'react'
import LiveEnd from '../components/LiveEnd'
import api4510 from '@/apis/21/api4510'
import { setUser } from '@sentry/browser'
import LiveInput from '../components/LiveInput'
import api4624 from '@/apis/21/api4624'
import CanvasPhoto from '@/components/CanvasPhoto'
import { initLive } from '@/components/CanvasPhoto/components/CanvasInit'
import api3560 from '@/apis/21/api3560'
import api4522 from '@/apis/21/api4522'
import api3554 from '@/apis/21/api3554'
import { host } from '@/service/http'
import { getImID, globalConfig } from '@/utils/cachedService'
import { useUserTypeHookHome, useWeappUrlChannelHook } from '@/utils/hooks'
import { autoAddImageHost } from '@/components/PreImage/transformImageSrc'
import asyncValidate from '../setting/asyncValidate'
import { IHandleCaptureException, Sentry } from '@/sentry.repoter'
import LiveLeave from '../components/LIveLeave'
import api4692 from '@/apis/21/api4692'
import PreView from '../components/LiveRoomPreView'
import LiveSpot from '../components/LiveSpot'
import { useDidHide } from '@tarojs/runtime'
import api4842 from '@/apis/21/api4842'
import { TaroDocument } from '@tarojs/runtime/dist/dom/document'
import PreLoadingBOx from '@/components/PreLoading'
import { liveBg } from '@/constants/images'
import { XImage } from '@/components/PreImage'
import LiveRedPacket from '../components/LiveRedPacket'
import api4922 from '@/apis/21/api4922'

export type ILiveRoomInfo = Required<IResapi4504["data"]>
export type IProduct = Required<IResapi4610["data"]>
interface ISendMessage {
  type: string
}

const Live = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const { params } = useRouter()
  const paramsRef = useRef(Taro.getCurrentInstance())
  const [roomId, setRoomId] = useState<string>(params.roomId || '')
  const [recordId, setRecordId] = useState<string>(params.recordId || '')
  const [clientX, setClientX] = useState<number>(0)
  const [isScreenShow, setIsScreenShow] = useState<number>(0)
  const [isShowShoppingCar, setIsShowShoppingCar] = useState<number>(0)
  const [isReady, setIsReady] = useRecoilState(isImReady)
  const [liveRoomInfo, setLiveRoomInfo] = useState<ILiveRoomInfo>({})
  const [commodity, setCommodity] = useState<IProduct>()
  const [showCommodityCard, setShowCommodityCard] = useState<Number>(0)
  const [showModal,] = useState<boolean>(false)
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [sendMessages, setSendMessages] = useState<any>({})
  const [message, setMessage] = useRecoilState(receivedMessage)
  const [liveModalInfo, setLiveModalInfo] = useRecoilState<{ type: string | number, payload: {} }>(liveModal)
  const [showProductZd, setShowProductZd] = useState(false)
  const [workers, setWorkers] = useRecoilState(worker)
  const [commodityTime, setCommodityTime] = useState<any>() // 置顶商品的倒计时
  const [commodityTimeList, setCommodityTimeList] = useState<string[]>([]) // 置顶商品的倒计时
  const [seeNum, setSeeNum] = useState<number>(0)
  const [identifier, setIdentifier] = useState<string>()
  const [checkInBlacklist, setCheckInBlacklist] = useState<boolean | undefined>(false)
  const [autoFocus, setAutoFocus] = useState<boolean>(false)
  const [chatInfo, setChatInfo] = useState<any>({ phrases: [] })
  const [canvasVisible, setCanvasVisible] = useState(false)
  const [shareImg, setshareImg] = useState<string | undefined>('')
  const [shareLink, setShareLink] = useState<string | undefined>('')
  const [shareInfo, setShareInfo] = useState<any>()
  const [productNum, setProductNum] = useState<number>(0)
  // const [userInfo, setUserInfo] = useState<any>({ nick: '', headImg: '' })
  const [config, setConfig] = useState<any>()
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [isPreView, setisPreView] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [reFreash, setReFreash] = useState<boolean>(true)
  const [isLeave, setIsLeave] = useState<boolean>(false)
  const [shoppingCarItem, setShoppingCarItem] = useRecoilState(shoppingCarListInfo)
  const [userInfo, setUserInfo] = useRecoilState(liveUserInfo)
  const [isLiveHistoryIn, setIsLiveHistoryIn] = useRecoilState(liveHistoryIn)
  const [likeNum, setLikeNum] = useState<number>(0)
  const [phrases, setPhrases] = useState<boolean>(true)
  const [isShowOperation, setIsShowOperation] = useState<boolean>(true)
  const [historyList, setHistoryList] = useState<any>([])
  const [isCompelete, setIsCompelete] = useState<boolean>(false)
  const [showRedPacket, setShowRedPacket] = useState<boolean>(false)
  const [redPacketDetail, setRedPacketDetail] = useState({})
  const shareDetail = useRef()
  const timer = useRef()
  const modalTimer = useRef()
  const dealTimer = useRef()
  const spotModule = useRef()
  const redPacketTimer = useRef(null)
  const { userType } = useUserTypeHookHome()
  // const [showBg, setshowBg] = useState<boolean>(true)
  const showShopping = () => {
    setPopupVisible(true)
  }

  useWeappUrlChannelHook()

  //weapp分享到好友

  useShareAppMessage(async () => {
    const res = shareDetail.current
    const data = {
      title: res?.title,
      path: res?.shareUrl.replace(host, ''),
      imageUrl: autoAddImageHost(res?.posterImg)
    }
    return data
  })

  // useShareTimeline(() => {
  //   return {
  //     title: shareInfo?.title,
  //     path: shareInfo?.shareUrl.replace(host, ''),
  //     imageUrl: autoAddImageHost(shareInfo?.picUrl)
  //   }
  // })

  const sendMessage = (value) => {
    onBlur(false)

    if (checkInBlacklist) {
      // 在黑名单中发送，只自己可见
      setSendMessages({
        type: 'TIMTextElem',
        payload: {
          text: value,
        },
        nick: userInfo.nick
      })
    } else {
      //正常发送
      setSendMessages({
        type: 'TIMTextElem',
        payload: {
          text: value,
        },
        nick: userInfo.nick
      })

      let message = tim.createTextMessage({
        to: roomId,
        conversationType: TIM.TYPES.CONV_GROUP,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          text: value
        },
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      });
      // 2. 发送消息 
      let promise = tim.sendMessage(message);
      promise.then(function (imResponse) {
        // 成功发送信息
        onBlur(false)
        // 发送成功
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    }

  }

  const touchstart = (e) => {
    // 手指滑动（暂无用）
    setClientX(e.changedTouches[0].clientX)
  }

  const touchEnd = useCallback((e) => {
    //左划右划（暂无用）
    if (Math.abs(e.changedTouches[0].clientX - clientX) > 80) {
      if (e.changedTouches[0].clientX > clientX) {
        if (isScreenShow === 2) {
          setIsScreenShow(1)
        }
      } else {
        setIsScreenShow(2)
      }
    }
  }, [clientX, isScreenShow])

  const work2Time = async (item) => {
    // workers倒计时
    const result = await globalConfig()
    workers.postMessage({
      type: 'productCard',
      msg: item?.endTime - result?.timeDifference
    })

    workers.onMessage((data) => {
      if (data.type === 'productCard') {
        // 置顶倒计时
        setCommodityTime(data.msg)
        if (!data.msg) {
          timer.current = setTimeout(() => {
            setShowProductZd(false)
          }, 5000);
        }
      } else if (data.type === 'productList') {

        // 列表倒计时
        setCommodityTimeList(data.msg)
      }
      // console.log(data.msg, 'worker post msg')
    })
  }


  const getRedPacket = (detail) => {

    // 获取红包详情

    clearInterval(redPacketTimer.current)

    globalConfig().then(result => {
      let diffTime = detail?.expireTime - result.timeDifference
      let timeDetail = {
        h: Math.floor((diffTime - Date.parse(new Date())) / 1000 / 60 / 60),
        m: Math.floor((diffTime - Date.parse(new Date())) / 1000 / 60 % 60),
        s: Math.floor((diffTime - Date.parse(new Date())) / 1000 % 60)
      }

      setRedPacketDetail({ ...timeDetail, uuid: detail?.uuid, amountStrategy: detail?.amountStrategy })

      redPacketTimer.current = setInterval(() => {
        if (diffTime - Date.parse(new Date()) >= 0) {

          let timeDetail = {
            h: Math.floor((diffTime - Date.parse(new Date())) / 1000 / 60 / 60),
            m: Math.floor((diffTime - Date.parse(new Date())) / 1000 / 60 % 60),
            s: Math.floor((diffTime - Date.parse(new Date())) / 1000 % 60)
          }

          setRedPacketDetail({ ...timeDetail, uuid: detail?.uuid, amountStrategy: detail?.amountStrategy })

        } else {
          setShowRedPacket(false)
          clearInterval(redPacketTimer.current)
        }

      }, 1000)

      // workers.onMessage((data) => {

      //   if (data.type === 'redPacket') {
      //     if (data.status === 1) {

      //       setRedPacketDetail({ ...data.msg, uuid: detail?.uuid })

      //     } else {
      //       setShowRedPacket(false)
      //     }

      //   }
      //   // console.log(data.msg, 'worker post msg')
      // })
      setShowRedPacket(true)
    })
  }

  const init = async () => {
    // 初始化 
    const liveRoomInfo = await api4504({ roomId })
    setLikeNum(liveRoomInfo?.likeCount)
    asyncValidate(
      {
        recordId: {
          validator: (rule, value, cb) => {
            return liveRoomInfo?.status === 0 || (liveRoomInfo?.status !== 0 && !!liveRoomInfo?.recordId)
          },
          message: `recordId ${liveRoomInfo?.recordId} 不合法`
        }
      },
      liveRoomInfo || {},
    ).catch((errs) => {
      Sentry?.captureException({
        exceptionName: 'live_room_api_room_info',
        errs,
        value: liveRoomInfo,
      } as IHandleCaptureException)
    })

    if (liveRoomInfo?.status === 0) {
      setIsEnd(true)
    } else if (liveRoomInfo?.status === 1) {
      setisPreView(true)
    }
    setLiveRoomInfo(liveRoomInfo)
    setRecordId(liveRoomInfo?.recordId || '')
    if (liveRoomInfo?.viewCount > seeNum) {
      setSeeNum(liveRoomInfo?.viewCount)
    }
    setIsCompelete(true)
    const product = await api4610({ roomId, recordId: liveRoomInfo?.recordId })
    if (product?.uuid) {
      setShowCommodityCard(1)
      setCommodity(product)
      setShowProductZd(true)
      if (product?.productType === 1) {
        work2Time(product.aucInfo)
      }
    }

    const redPacketDetail = await api4922({ roomId })
    if (redPacketDetail?.status === 1) {
      getRedPacket(redPacketDetail)
    }
    const productNumInfo = await api4522({
      roomId,
      recordId: liveRoomInfo?.recordId
    })
    setProductNum(productNumInfo.aucNum + productNumInfo.secKill)

    const checkInBlacklist = await api4510({ roomId })
    setCheckInBlacklist(checkInBlacklist)
    const chatInfo = await api4624()
    setChatInfo(chatInfo)
    const data = await api3554({ shareType: 10, targetId: roomId })
    setShareInfo(data)
    // shareDetail.current = new Promise((resolve, reject) => {
    shareDetail.current = Object.assign({}, { ...liveRoomInfo }, { ...data })
    // return resolve(obj)
    // })
    !identifier && (getImID().then(res => {
      setIdentifier(res?.identifier)
    }))

    // 获取历史消息
    getHistory(roomId)

  }

  const getHistory = async (roomId) => {

    const historyList = await api4842({ roomId: roomId })
    let list: any[] = []
    historyList?.forEach(item => {
      if (item?.liveUser) {
        item?.MsgBody && item?.MsgBody.forEach(item2 => {
          if (item2.MsgType === 'TIMTextElem') {
            setSendMessages({
              type: 'TIMTextElem',
              from: 'history',
              payload: {
                text: JSON.parse(item2.MsgContent).Text,
              },
              nick: item.liveUser.nickName
            })
            list.push({
              type: 'TIMTextElem',
              from: 'history',
              payload: {
                text: JSON.parse(item2.MsgContent).Text,
              },
              nick: item.liveUser.nickName
            })
          } else {
            if (JSON.parse(JSON.parse(item2.MsgContent).Data).value) {
              setSendMessages({
                type: 'notice',
                from: 'history',
                payload: {
                  text: JSON.parse(JSON.parse(item2.MsgContent).Data).value,
                },
                nick: item.liveUser.nickName
              })
              list.push({
                type: 'notice',
                from: 'history',
                payload: {
                  text: JSON.parse(JSON.parse(item2.MsgContent).Data).value,
                },
                nick: item.liveUser.nickName
              })
            }
          }
        })
      }
    })
    setHistoryList(list)

    // if (list.length > 0) {
    //   setIsLiveHistoryIn(true)
    //   let i = 0
    //   let timer = setInterval(() => {
    //     if (i < list.length) {
    //       setSendMessages(list[i])
    //       i++
    //     } else {
    //       setIsLiveHistoryIn(false)
    //       clearInterval(timer)
    //     }
    //   }, 200)
    // }
  }

  const routerRef = useRef(Taro.getCurrentInstance())

  useEffect(() => {

    const a = page.router?.params?.roomId
    const b = roomId
    const c = routerRef.current.router?.params?.roomId
    if (
      !(a === b && b === c && a !== undefined && a !== 'undefined')
    ) {
      Sentry?.captureException({
        exceptionName: '直播间roomId不同',
        errs: '',
        value: JSON.stringify({ a, b, c }),
      } as IHandleCaptureException)
    }

  }, [roomId])


  useEffect(() => {
    if (isReady) {
      tim.getMyProfile().then(data => {
        setUserInfo({ nick: data.data.nick, headImg: data.data.avatar, img: data.data.avatar, identifier: data.data.userID })
      })
      let promise = tim.joinGroup({ groupID: roomId, type: TIM.TYPES.GRP_AVCHATROOM })
      promise.then(function (imResponse) {
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            break;
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            setIsEnd(false)
            tim.getGroupProfile({ groupID: roomId }).then(res => {
              setDisabled(res.data.group.muteAllMembers)
            })
            // 初始化
            break;
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            break;
          default:
            break;
        }
      }).catch(function (imError) {
        console.log('加群失败', 1121212121212);
        console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
      }).finally(() => {
        // 加群操作之后进行直播间数据初始化
        init()
      })

    } else {
      // // tim.logout().finally(res => {
      // getImID().then(async (imConfig) => {
      //   setIdentifier(imConfig?.identifier)
      //   tim.login({ userID: imConfig?.identifier, userSig: imConfig?.imSign })
      // })
      // // })
    }
  }, [isReady])

  useEffect(() => {
    if (userType === 'buyer' && !isReady) {
      getImID().then(async (imConfig) => {
        setIdentifier(imConfig?.identifier)
        tim.login({ userID: imConfig?.identifier, userSig: imConfig?.imSign }).then(res => {
          setTimeout(() => {
            setIsReady(true)
          }, 1000);
        })
      })
    }
  }, [userType, isReady])

  const getMessageValue = (message) => {
    //群公告消息体转化
    let messageValue = {
      msgType: 0,
      receiver: '',
      roomId: '',
      status: 0,
      viewNum: 0,
      userInfo: {},
      prodInfo: {},
      aucInfo: {},
      orderInfo: {},
      redPacketInfo: {}

    }
    message.payload.newGroupProfile.groupCustomField.forEach(item => {
      let main = JSON.parse(item.value)
      if (item.key === 'live') {
        messageValue.msgType = main.mt
        messageValue.roomId = main.rid
        messageValue.viewNum = main.vnum
        messageValue.receiver = main.rec
        messageValue.status = main.status
      }
      switch (main['_vt']) {
        case 'prod':
          messageValue.prodInfo = Object.assign({}, messageValue.prodInfo, main)
          break;
        case 'auc':
          let aucInfo = JSON.parse(item.value)
          messageValue.aucInfo = Object.assign({}, messageValue.aucInfo, {
            markUp: aucInfo?.incr,
            endTime: aucInfo?.etime,
            lastAucPrice: aucInfo?.lprice,
            delayState: aucInfo?.delay,
            auctionNum: aucInfo?.makeUp,
          })
          break;
        case 'user':
          messageValue.userInfo = Object.assign({}, messageValue.userInfo, JSON.parse(item.value))
          break;
        case 'order':
          messageValue.orderInfo = Object.assign({}, messageValue.orderInfo, JSON.parse(item.value))
          break;
        case 'rp':
          messageValue.redPacketInfo = Object.assign({}, messageValue.redPacketInfo, JSON.parse(item.value), { expireTime: JSON.parse(item.value)?.etime, amountStrategy: JSON.parse(item.value)?.as })
          break;
        default:
          break;
      }
      // if (JSON.parse(item.value)['_vt'] === 'prod') {
      //   messageValue.prodInfo = Object.assign({}, messageValue.prodInfo, JSON.parse(item.value))
      // }
      // if (JSON.parse(item.value)['_vt'] === 'auc') {
      //   let aucInfo = JSON.parse(item.value)
      //   messageValue.aucInfo = Object.assign({}, messageValue.aucInfo, {
      //     markUp: aucInfo?.incr,
      //     endTime: aucInfo?.etime,
      //     lastAucPrice: aucInfo?.lprice,
      //     delayState: aucInfo?.delay,
      //     auctionNum: aucInfo?.makeUp,
      //   })
      // }
      // if (JSON.parse(item.value)['_vt'] === 'user') {
      //   messageValue.userInfo = Object.assign({}, messageValue.userInfo, JSON.parse(item.value))
      // }
      // if (JSON.parse(item.value)['_vt'] === 'order') {
      //   messageValue.orderInfo = Object.assign({}, messageValue.orderInfo, JSON.parse(item.value))
      // }
    })
    return messageValue
  }

  const dealMessage = (message) => {
    if (modalTimer.current) {
      clearTimeout(modalTimer.current)
      modalTimer.current = null
    }
    let type = ''
    if (message.payload.operationType === 6) {
      const messageValue = getMessageValue(message)

      switch (messageValue.msgType) {
        case 1000:
          //入群
          if (messageValue.viewNum > seeNum) {
            setSeeNum(messageValue.viewNum)
          }
          break
        case 1001:
          if (messageValue.status === 1) {
            setIsLeave(true)
            setIsEnd(false)
          } else if (messageValue.status === 2) {
            setIsLeave(false)
            setIsEnd(false)
            setisPreView(false)
            api4504({ roomId }).then(liveRoomInfo => {
              setLiveRoomInfo(liveRoomInfo)
              refresh()
            })
          } else {
            setIsLeave(false)
            setIsEnd(true)
          }
          //点赞
          break;
        case 1002:
          //商品上下架
          if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
          }
          if (messageValue.prodInfo?.top === 1) {
            if (messageValue.prodInfo?.ps === 1) {
              setShowProductZd(false)
              setShowCommodityCard(1)
              // setShowModal(true)
              let prod = messageValue?.prodInfo
              let aucInfo = messageValue?.aucInfo
              setCommodity({
                uuid: prod?.uuid,
                name: prod?.name,
                icon: prod?.icon || 'undefined',
                price: prod?.price,
                stock: prod?.stock,
                productType: prod?.pt,
                publishStatus: prod?.ps,
                aucInfo: messageValue.aucInfo
              })
              setShowProductZd(true)
              messageValue?.prodInfo.pt === 1 && work2Time(messageValue?.aucInfo)
            }
            // 倒计时逻辑
            // if (res.data.productType === 1) {
          } else {
            if (messageValue.prodInfo?.uuid === commodity?.uuid) {

              setShowProductZd(false)
            }
          }
          // }
          break;
        case 1003:
          //用户出价

          if (messageValue.userInfo?.imid !== identifier) {
            setLiveModalInfo(item => {
              return {
                type: messageValue.msgType, payload: {
                  name: messageValue.userInfo?.name,
                  headImg: messageValue.userInfo?.img,
                  price: fen2yuan(messageValue?.aucInfo?.lastAucPrice)
                }
              }
            })
          }


          setSendMessages({
            type: 'bidding',
            payload: {
              text: `出价${fen2yuan(messageValue?.aucInfo?.lastAucPrice)}元`,
            },
            nick: messageValue.userInfo.name
          })
          if (messageValue.prodInfo.uuid && commodity.uuid && messageValue.prodInfo?.uuid === commodity?.uuid) {
            changeProduct(messageValue.aucInfo)
          }
          setShoppingCarItem({ price: messageValue?.aucInfo?.lastAucPrice, endTime: messageValue?.aucInfo?.endTime, uuid: messageValue.prodInfo?.uuid })

          // if(messageValue.prodInfo.uuid !== commodity.uuid) {

          // }
          // work2Time(messageValue.aucInfo)
          // let newProduct = deepClone(commodity)
          // newProduct.aucInfo = messageValue.aucInfo
          // setCommodity(newProduct)
          break;
        case 1004:
          // 中拍广播
          // setLiveModalInfo(item => {
          //   return {
          //     type: res.data.msgType, payload: {
          //       name: res.data.userInfo.nickName,
          //       headImg: res.data.userInfo.headImg,
          //       price: fen2yuan(res.data?.aucInfo?.lastAucPrice)
          //     }
          //   }
          // })
          // setSendMessages({
          //   type: 'success',
          //   payload: {
          //     text: `已中拍`,
          //   },
          //   nick: res.data.userInfo.nickName
          // })
          break;
        case 1005:
          // 用户付款提醒

          if (messageValue.prodInfo.uuid === commodity?.uuid) {
            timer.current = setTimeout(() => {
              setShowProductZd(false)
            }, 3000)
          }

          if (messageValue.prodInfo?.pt === 1) {
            if (messageValue.receiver === identifier) {
              type = 'mine' // 自己中拍
            } else {
              type = 'others' // 他人中拍

            }
            setSendMessages({
              type: 'success',
              payload: {
                text: `以${fen2yuan(messageValue.aucInfo?.lastAucPrice)}元中拍！`,
              },
              nick: messageValue.userInfo?.name
            })
          } else {
            if (messageValue.receiver === identifier) {
              type = 'sendOrder' // pai派单
            }
          }

          if (type) {
            if (type === 'others') {
              if (!dealTimer.current) {
                setLiveModalInfo(item => {
                  return {
                    type: type, payload: {
                      name: messageValue.userInfo?.name,
                      headImg: messageValue.userInfo?.img,
                      productName: messageValue.prodInfo?.name,
                      icon: messageValue.prodInfo?.icon,
                      price: messageValue.prodInfo?.pt === 1 ? fen2yuan(messageValue.aucInfo?.lastAucPrice) : fen2yuan(messageValue.prodInfo?.price),
                      orderNo: messageValue.orderInfo?.oid
                    }
                  }
                })
                dealTimer.current = setTimeout(() => {
                  clearTimeout(dealTimer.current)
                  dealTimer.current = null
                }, 200)
              }
            } else {
              setLiveModalInfo(item => {
                return {
                  type: type, payload: {
                    name: messageValue.userInfo?.name,
                    headImg: messageValue.userInfo?.img,
                    productName: messageValue.prodInfo?.name,
                    icon: messageValue.prodInfo?.icon,
                    price: messageValue.prodInfo?.pt === 1 ? fen2yuan(messageValue.aucInfo?.lastAucPrice) : fen2yuan(messageValue.prodInfo?.price),
                    orderNo: messageValue.orderInfo?.oid
                  }
                }
              })
            }
          }

          break;
        case 1006:
          if (!dealTimer.current) {
            setLiveModalInfo(item => {
              return {
                type: messageValue.msgType, payload: {
                  name: messageValue.userInfo?.name,
                  headImg: messageValue.userInfo?.img,
                }
              }
            })
            setSendMessages({
              type: 'pay',
              payload: {
                text: `付款成功！`,
              },
              nick: messageValue.userInfo.name
            })
            // modalTimer.current = setTimeout(() => {
            //   clearModal()
            // }, 3000)
            dealTimer.current = setTimeout(() => {
              clearTimeout(dealTimer.current)
              dealTimer.current = null
            }, 200)
          }

          break;

        case 1007:
          if (messageValue.redPacketInfo?.s === 1) {

            getRedPacket(messageValue.redPacketInfo)

          } else {
            workers.postMessage({
              type: 'redPacketHide'
            })
            setShowRedPacket(false)
          }
          break
        default:
          break;
      }
    }
    if (type !== 'mine' && type !== 'sendOrder') {

      modalTimer.current = setTimeout(() => {
        clearModal()
      }, 3000)
    }

  }

  useEffect(() => {
    if (message && message.data) {
      message.data.forEach((item) => {
        if (item.payload.groupProfile && item.payload.groupProfile.groupID === roomId) {
          if (item.payload.operationType === 1) {
            // const num = seeNum + 1
            // setSeeNum(num)
            if (identifier === item.payload.operatorID) {
              console.log(identifier, item, 99999999);

              const value = item
              asyncValidate(
                {
                  nick: {
                    required: true,
                  },
                  avatar: {
                    required: true,
                  }
                },
                value,
              ).catch((errs) => {
                Sentry?.captureException({
                  exceptionName: 'live_room_userInfo',
                  errs,
                  value,
                } as IHandleCaptureException)
              })
              setUserInfo({ nick: item.nick, headImg: item.avatar, img: item.avatar, identifier: item.payload.operatorID })
            }
          } else if (item.payload.operationType === 5) {
            console.log(('收到关闭消息'));

            // setIsEnd(true)
          } else if (item.payload.operationType === 6) {
            dealMessage(item)
            // if (!dealTimer.current) {
            //   dealTimer.current = setTimeout(() => {
            //     clearTimeout(dealTimer.current)
            //     dealTimer.current = null
            //   }, 200)
            // }
          }
        } else if (message && message.data && item.type === 'TIMCustomElem') {
          if (JSON.parse(item.payload.data)._type === 'stream') {
            // setReFreash(false)
            // setTimeout(() => {
            //   setReFreash(true)
            // }, 200);
            refresh()
          } else if (JSON.parse(item.payload.data)._type === 'allMute') {
            setDisabled(!!JSON.parse(item.payload.data).status)
          } else if (JSON.parse(item.payload.data)._type === 'prodNum') {
            let data = JSON.parse(item.payload.data)
            setProductNum(data.aucNum + data.secKill)
          } else if (JSON.parse(item.payload.data)._type === 'likeNum') {
            let data = JSON.parse(item.payload.data)
            if (data.likeNum > likeNum) {
              setLikeNum(data.likeNum)
            }
            // setProductNum(data.aucNum + data.secKill)
          }
        }
      })
    }
  }, [message, identifier])

  const changeProduct = (aucInfo) => {
    // 更新价格
    work2Time(aucInfo)
    let newProduct = deepClone(commodity)
    if (aucInfo.lastAucPrice > newProduct.aucInfo.lastAucPrice) {
      newProduct.aucInfo.lastAucPrice = aucInfo.lastAucPrice
      newProduct.aucInfo = deepClone(aucInfo)
    } else {
      aucInfo.lastAucPrice = newProduct.aucInfo.lastAucPrice
      newProduct.aucInfo = deepClone(aucInfo)
    }
    setCommodity(newProduct)
  }


  const getTips = (type, value) => {
    // 聊天框提示
    let news = {}
    if (type === 'buying') {
      news = {
        _type: 'buying',
        value: ' 正在去购买',
        nick: userInfo?.nick,
        identifier: userInfo?.identifier,
        img: userInfo?.img
      }
    } else if (type === 'share') {
      news = {
        _type: 'share',
        value: ' 分享了直播间',
        nick: userInfo?.nick,
        identifier: userInfo?.identifier,
        img: userInfo?.img
      }
    } else if (type === 'attention') {
      news = {
        _type: 'attention',
        value: ' 关注了直播间',
        nick: userInfo?.nick,
        identifier: userInfo?.identifier,
        img: userInfo?.img
      }
      let copyInfo = deepClone(liveRoomInfo)
      copyInfo.attentionStatus = !!value ? 1 : 0
      setLiveRoomInfo(copyInfo)
      if (value === 0) {
        return
      }
    } else if (type === 'notice') {
      news = {
        _type: 'notice',
        value: ' 给主播点赞了～',
        nick: userInfo?.nick,
        identifier: userInfo?.identifier,
        img: userInfo?.img
      }
    }
    setSendMessages({
      type: news['_type'],
      payload: {
        text: news?.value,
      },
      nick: userInfo.nick,
      color: news?.color
    })
    let message = tim.createCustomMessage({
      to: roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
      // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
      // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
      payload: {
        data: JSON.stringify(news), // 用于标识该消息是骰子类型消息
        description: '', // 获取骰子点数
        extension: ''
      }
      // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
      // cloudCustomData: 'your cloud custom data'
    });
    // 2. 发送消息 
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 成功发送信息
      // 发送成功
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  }

  const joinBidding = (lastAucPrice) => {
    // 自己参与竞拍
    setLiveModalInfo(item => {
      return {
        type: 1003, payload: {
          name: userInfo.nick,
          headImg: userInfo.headImg,
          price: fen2yuan(commodity.aucInfo?.lastAucPrice + commodity.aucInfo?.markUp)
        }
      }
    })
    if (lastAucPrice) {
      const newProduct = deepClone(commodity)
      if (newProduct.aucInfo.lastAucPrice === lastAucPrice)
        changeProduct(newProduct.aucInfo)
    }

  }
  useDidShow(async () => {
    if (liveRoomInfo && liveRoomInfo?.recordId) {
      clearInterval(redPacketTimer.current) // 默认去除红包计时器
      const product = await api4610({ roomId, recordId: liveRoomInfo?.recordId })
      if (product?.uuid) {
        setShowCommodityCard(1)
        setCommodity(product)
        setShowProductZd(true)
        if (product?.productType === 1) {
          work2Time(product.aucInfo)
        }
      }
      const redPacketDetail = await api4922({ roomId })
      if (redPacketDetail?.status === 1) {
        getRedPacket(redPacketDetail)
      } else {
        setShowRedPacket(false)
      }
      if (liveModalInfo.type !== 'none') {
        // clearModal()
      }
      setTimeout(() => {
        spotModule.current && spotModule.current.start(1)
        // sendMessage('执行了一次')
      }, 50);
      historyList.length < 1 && getHistory(roomId)
    }
    const result = await api4692({ roomId })
    if (result?.ownState === 1) {
      BwTaro.redirectTo({
        url: '/pages/index/index'
      })
      setTimeout(() => {
        Taro.showToast({
          title: '自己无法查看操作自己的直播间',
          icon: 'none',
          duration: 2000
        })
      }, 1000);
    }
    if (isEnd) {
      const liveRoomInfo = await api4504({ roomId })
      if (liveRoomInfo?.status === 2) {
        setIsEnd(false)
      }
      setLiveRoomInfo(liveRoomInfo)
      refresh()
    }
  })

  const clearModal = () => {
    setLiveModalInfo(item => {
      return { type: 'none', payload: {} }
    });

  }

  const onBlur = (value) => {
    setAutoFocus(false)
  }

  useEffect(() => {

    return () => {
      clearInterval(redPacketTimer.current)
    }

  }, [])
  // useEffect(() => {
  //   const worker = Taro.createWorker('workers/request/index.js'); // 文件名指定 worker 的入口文件路径，绝对路径
  //   worker.postMessage({
  //     type: 1,
  //     msg: '开始',
  //     num: 30
  //   })
  //   worker.onMessage((msg) => {
  //     if (msg > 0) {
  //     }
  //     console.log(msg, 'worker post msg')
  //   })
  // }, [])

  const refresh = () => {
    setReFreash(false)
    setIsLeave(false)
    setTimeout(() => {
      setReFreash(true)
    }, 20);

  }

  const closePopUp = async () => {
    setPopupVisible(false)
    const productNumInfo = await api4522({
      roomId,
      recordId: liveRoomInfo?.recordId
    })
    setProductNum(productNumInfo.aucNum + productNumInfo.secKill)
  }

  const openCanvas = async () => {
    // if (process.env.TARO_ENV === 'weapp') {
    //   setshareImg('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGc8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyV3pHTUJHY3pkY0QxaXlGRjF4Y3gAAgSinEFhAwQAjScA')
    //   setShareLink('https://h5.bowuyoudao.com/pages/goods/goodsDetail/index?productId=722022146977280&channel=01347833')
    //   setCanvasVisible(true)
    //   return
    // }
    const data = await api3560({ targetId: roomId, shareType: 10 })
    getTips('share')
    setshareImg(data?.qrCodeUrl)
    setShareLink(data?.shareUrl)
    // if (goodsDetail && auctionInfo && storeInfo) {
    // }
    setCanvasVisible(true)
  }

  // 关闭canvas
  const onCloseCanvas = () => {
    setCanvasVisible(false)
  }

  const chatClass = classNames(
    'Live-chat',
    { 'chatChange': showProductZd },
  )

  const shoppingClass = classNames(
    'live-screen-shopping',
    { 'live-screen-operationShow': isShowShoppingCar === 1 },
    { 'live-screen-operationHide': isShowShoppingCar === 2 },
  )

  const commodityClass = classNames(
    { 'show': showCommodityCard === 1 },
    { 'hide': showCommodityCard === 2 },
  )

  const modalClass = classNames(
    { 'modalShow': showModal },
    { 'modalHide': !showModal },
  )


  const closeOperation = (status) => {
    console.log(status, 112);

    setIsShowOperation(status)
  }

  const netChange = (e) => {
    if (e.mpEvent.detail.code === 2032) {
      setIsLeave(false)
      // Taro.showToast({
      //   title: '主播暂时离开！',
      //   icon: 'none'
      // })
    }
  }


  const LiveBg = () => {
    return <XImage disabledPlaceholder className='live-bg' src={liveBg}></XImage>
  }

  /**
   * live为整个组件，做切换的时候提取出来，放在swiperItem里 roomId传值控制
   */

  return (
    <View onTouchStart={touchstart} onTouchEnd={touchEnd} className="touchNone">
      {!isCompelete && process.env.TARO_ENV === 'weapp' && <LiveBg />}
      <Popup visible={popupVisible} title={'购物车'} onVisibleChange={closePopUp} headerType='empty'>
        {popupVisible && <LiveShoppingCar buying={() => { getTips('buying') }} roomId={roomId} recordId={liveRoomInfo?.recordId} timeList={commodityTimeList} close={() => { setIsShowShoppingCar(2) }} className={shoppingClass}></LiveShoppingCar>}
      </Popup>
      {isEnd && !isLeave && <LiveEnd liveRoomInfo={liveRoomInfo} seeNum={seeNum}></LiveEnd>}
      {isLeave && !isEnd && <LiveLeave liveRoomInfo={liveRoomInfo} refresh={refresh}></LiveLeave>}
      {!isEnd && reFreash && !isPreView && <LivePlayer onStateChange={netChange} className='live-player' objectFit='fillCrop' autoplay mode='live' picture-in-picture-mode='push' src={liveRoomInfo?.streamPullUrl}></LivePlayer>}
      {isPreView && <PreView liveRoomInfo={liveRoomInfo} getTips={getTips} openPoster={openCanvas} roomId={roomId}></PreView>}
      {!reFreash && <View className='live-baseBg'></View>}
      {/* {<XImage disabledPlaceholder className='live-bgImg' src={liveBg}></XImage>} */}
      <Swiper className='live-swiper live-screen' vertical={true}>
        <SwiperItem className='live-screen-swiper1'>
          <NavigationBar
            leftBtn={<LiveHeader getTips={getTips} seeNum={seeNum} liveRoomInfo={liveRoomInfo} closeOperation={closeOperation}></LiveHeader>}
          />
          <View className='live-id'>
            <LiveId liveRoomInfo={liveRoomInfo}></LiveId>
          </View>
          <View className='live-screen-chat'>
            <LiveChat className={chatClass} sendMessage={sendMessages} notice={chatInfo.notice}></LiveChat>
          </View>
          <View>
            {showProductZd && <LiveProduct
              joinBidding={joinBidding}
              buying={() => { getTips('buying') }}
              commodity={commodity} time={commodityTime}
              className={commodityClass}
              roomId={roomId}
              recordId={liveRoomInfo?.recordId}
            ></LiveProduct>}
            <LiveModal close={clearModal}></LiveModal>
          </View>
          <LiveBottom
            inputFocus={autoFocus}
            ref={spotModule}
            phrases={chatInfo.phrases}
            getTips={getTips}
            sendMessage={sendMessage}
            changePhrases={(value) => { setPhrases(!value) }}
            likeNum={likeNum}
            liveRoomInfo={liveRoomInfo}
            merchantId={liveRoomInfo?.merchant?.merchantId}
            disabled={disabled}
            productNum={productNum}
            chat={() => { setAutoFocus(true) }}
            openCanvas={openCanvas}
            isShowOperation={isShowOperation}
            showShopping={showShopping}
            popupVisible={popupVisible}
            roomId={roomId}
          ></LiveBottom>
          <LiveRedPacket attentionStatus={liveRoomInfo?.attentionStatus} showRedPacket={showRedPacket} redPacketDetail={redPacketDetail} />
        </SwiperItem>
        {/* <SwiperItem></SwiperItem> */}
      </Swiper>
      {
        liveRoomInfo && shareImg && <CanvasPhoto storeInfo={liveRoomInfo}
          shareImg={shareImg}
          shareLink={shareLink}
          type={'commodity'}
          operationType={['friend', 'saveImg']}
          init={initLive}
          size={
            {
              width: 522,
              height: 860
            }
          }
          visible={canvasVisible} onClose={onCloseCanvas} />
      }
      {autoFocus && <LiveInput autoFocus={autoFocus} phrases={chatInfo.phrases} onBlur={onBlur} sendMessage={sendMessage}></LiveInput>}
    </View >
  )
}

export default Live
