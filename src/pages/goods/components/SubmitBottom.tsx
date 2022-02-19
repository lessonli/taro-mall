import Taro, { onAppHide, useDidShow } from '@tarojs/taro'
import { siliao, dianp, bianji, xiajia } from '@/constants/images'
import './index.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import TIMH5 from 'tim-js-sdk';
// import TIMWEAPP from 'tim-wx-sdk';
import { TIM, tim } from '@/service/im';
import storge from '@/utils/storge'
import { IResapi2906 } from '@/apis/21/api2906'
import { getImID, getStatus, getUserInfo } from '@/utils/cachedService'
import api3122 from '@/apis/21/api3122'
import { useDidHide } from '@tarojs/runtime'
import { IResapi2524 } from '@/apis/21/api2524'
import { BwTaro, fen2yuan } from '@/utils/base'
import api2108 from '@/apis/21/api2108'
import api4094 from '@/apis/21/api4094'
import BwModal from '@/components/Modal';
import api2060 from '@/apis/21/api2060';
import { IMID, MERCHANT_YKJ_STATUS } from '@/constants';
import { ICustomerMessage, IDescription } from '@/pages/im/message';
import { useUserTypeHook } from '@/utils/hooks'
import { env } from 'config/prod';
import { isImReady } from '@/store/atoms';
import { useRecoilState } from 'recoil';
import api4082, { req4082Config } from '@/apis/21/api4082';
import { request } from '@/service/http';
import api2028 from '@/apis/21/api2028';
import LoginWrapperBtn from '@/components/WxComponents/LoginWrapperBtn';
export type IDetail = Required<IResapi2524["data"]>
export type IAuctionIngo = Required<IResapi2906>['data']
interface Iprops {
  type?: number | undefined
  earn?: number | undefined
  productType?: number | undefined
  ownState?: number | undefined
  stock?: number | undefined
  auctionInfo?: IAuctionIngo
  onClick?: any
  openShare?: any
  sDistPercent?: number | undefined
  goodsDetail?: IDetail
  priceUpdate: boolean
  onUpdate?: any
  updateAuction?: any
  publishStatus?: number
}

/**
 * 调用 tim 用户的登录
 * @returns 
 */
export const useTIMAutoLogin = () => {
  const [isReady] = useRecoilState(isImReady)

  const run = async () => {
    if (!isReady) {
      // @ts-ignore
      const imConfig = await getImID()
      await tim.login({ userID: imConfig?.identifier, userSig: imConfig?.imSign })
      return Promise.resolve()
    } else {
      return Promise.resolve()
    }
  }

  return {
    run,
    isReady,
  }

}

const SubmitButton = (props: Iprops) => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const interRef = useRef(null)
  const { type = 4, earn = 2, sDistPercent, productType, ownState, stock = 0, auctionInfo, onClick, openShare, goodsDetail, priceUpdate, onUpdate, updateAuction, publishStatus } = props
  const [lingxian, setLingxian] = useState<boolean | undefined>(false)
  const sourceUrl = page.router?.params.sourceUrl || ''
  const [label, setLabel] = useState<string>('')
  const [shareLabel, setShareLabel] = useState<string>('')
  const [modalTitle, setModalTitle] = useState<string>('')
  const [cancelText, setCancelText] = useState<string>('')
  const [btnType, setBtnType] = useState<string>('')
  const [timer, setTimer] = useState<any>()
  const [modalVisible, setModalVisible] = useState(false)
  const { userType } = useUserTypeHook()
  const [userInfo, setUserInfo] = useState<any>({})
  const { run: TIMAutoLogin } = useTIMAutoLogin()

  useEffect(() => {
    clearInterval(interRef.current)
    if (goodsDetail?.productType === 1) {
      let time: any
      (async () => {
        // const form = await api2500({ productId: page.router?.params.productId })
        // setLingxian(form?.isAhead)
        // const result = await getUserInfo()
        const getPreInfo = async () => {
          const form = await api3122({ productId: page.router?.params.productId })
          console.log(lingxian, form?.ahead);

          if (lingxian && !form?.ahead) {
            updateAuction()
            setLingxian(form?.ahead)
          } else {
            setLingxian(form?.ahead)
          }
        }
        getPreInfo()
        const userInfo = await getUserInfo()
        setUserInfo(userInfo)
        interRef.current = setInterval(() => { getPreInfo() }, 10000)
      })()
    }
    return () => {
      clearInterval(interRef.current)
    }
  }, [goodsDetail?.productType, lingxian])

  useDidHide(() => {
    // 清除定时器
    clearInterval(interRef.current)
    setTimer(null)
  })

  useEffect(() => {
    if (productType === 0) {
      //一元购
      if (stock > 0) {
        // 商品有库存
        setLabel('立即买')
        setShareLabel('分享商品')
      } else {
        // 商品没库存了
        setLabel('商品售罄')
        setShareLabel('分享商品')
      }
    } else {
      // 拍卖
      setShareLabel('分享邀请出价')
      if (auctionInfo?.status === 0) {
        // 拍卖进行中
        if (lingxian) {
          setLabel('已领先')
        } else {
          setLabel('出个价')
        }
      } else {
        setShareLabel('拍卖已结束')
        setLabel('拍卖已结束')
      }
    }
    if (publishStatus === 0) {
      setLabel('商品已下架')
      setShareLabel('商品已下架')
    }
  }, [auctionInfo, lingxian, productType, stock, publishStatus])

  useEffect(() => {
    if (priceUpdate) {
      (async () => {
        const form = await api3122({ productId: page.router?.params.productId })
        setLingxian(form?.ahead)
      })()
    }
  }, [priceUpdate])

  const handleClick = () => {
    (async () => {
      if (publishStatus === 1) {
        if (productType === 1) {
          // 拍卖品
          if (auctionInfo?.status === 0) {
            const form = await api3122({ productId: page.router?.params.productId })
            // setLingxian(form?.isAhead)

            // 是否需要缴纳保证金
            if (form?.needMargin) {
              // todo 唤起缴纳保证金
              onClick({ type: 6, title: '缴纳保证金' })
            } else {
              if (lingxian) {
                Taro.showToast({
                  title: '已领先无需出价',
                  icon: 'none'
                })
              } else {

                onClick({ type: 4, title: '当前价' })
              }
            }
          } else {
            Taro.showToast({ title: '拍卖已结束', icon: 'none' })
          }
        } else {
          const result = await api2108()
          if (result) {
            if (stock > 0) {
              onClick({ type: 5, title: '一口价' })
            } else {
              Taro.showToast({ title: '商品已经售罄～', icon: 'none' })
            }
          }
        }
      } else {
        Taro.showToast({ title: '商品已下架～', icon: 'none' })
      }
    })()
  }

  const shareClick = () => {
    if (publishStatus === 1) {
      if (goodsDetail?.productType === 1) {
        if (auctionInfo?.status === 0) {
          openShare()
        }

      } else {
        if (stock > 0) {
          openShare()
        }
      }
    } else {
      Taro.showToast({ title: '商品已下架～', icon: 'none' })
    }

  }

  const goChat = useCallback(async () => {
    await TIMAutoLogin()
    setBtnType('chat')
    setModalTitle('是否带上商品链接咨询商家？')
    setCancelText('不带，直接咨询')
    setModalVisible(true)
    // const result = await api4094({ merchantId: goodsDetail?.merchantId })
    // const options = {
    //   SDKAppID: 1400568433 // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
    // };
    // const tim = TIM.create(options)
    // let message = tim.createCustomMessage({
    //   to: result?.identifier,
    //   conversationType: TIM.TYPES.CONV_C2C,
    //   // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
    //   // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
    //   // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
    //   payload: {
    //     data: 'goodCard', // 用于标识该消息是骰子类型消息
    //     description: JSON.stringify({
    //       name: goodsDetail?.name,
    //       logo: goodsDetail?.icon,
    //       link: window.location.href,
    //       producttId: goodsDetail?.uuid
    //     })
    //   }
    // })
    // tim.sendMessage(message).then(res => {
    //   console.log(res);

    //   Taro.navigateTo({
    //     url: `/pages/im/message/index?id=${result?.identifier}&type=1`
    //   })
    // })

  }, [goodsDetail])

  const goEdit = useCallback(() => {
    if (auctionInfo?.auctionNum && auctionInfo?.auctionNum > 0) {
      Taro.showToast({
        title: '拍品已有出价，不可编辑'
      })
    } else {
      Taro.navigateTo({
        url: `/pages/merchant/publish/product/index?productId=${goodsDetail?.uuid}&productType=${goodsDetail?.productType}&prevStatus=${auctionInfo?.status}`
      })
    }
  }, [goodsDetail?.uuid, goodsDetail?.productType, auctionInfo?.status, auctionInfo?.auctionNum])

  const goOff = useCallback(() => {
    setBtnType('off')
    if (auctionInfo?.auctionNum && auctionInfo?.auctionNum > 0) {
      Taro.showToast({
        title: '拍品已有出价，不可编辑'
      })
    } else {
      setModalTitle('确认下架该商品？')
      setCancelText('取消')
      setModalVisible(true)
    }

  }, [])

  const onConfirm = async () => {
    if (btnType === 'chat') {
      const result = await api4094({ merchantId: goodsDetail?.merchantId })
      // const options = {
      //   SDKAppID: 1400568433 // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
      // };
      let message = tim.createCustomMessage({
        to: result?.identifier,
        conversationType: TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
        payload: {
          data: JSON.stringify({
            _type: 'productCard',
            porductName: goodsDetail?.name,
            productIcon: goodsDetail?.icon,
            productId: goodsDetail?.uuid,
            price: goodsDetail?.productType === 1 ? auctionInfo?.lastAucPrice : goodsDetail?.price
          } as IDescription), // 用于标识该消息是骰子类型消息
          description: JSON.stringify({
            _type: 'productCard',
            porductName: goodsDetail?.name,
            productIcon: goodsDetail?.icon,
            productId: goodsDetail?.uuid,
            price: goodsDetail?.productType === 1 ? auctionInfo?.lastAucPrice : goodsDetail?.price
          } as IDescription)
        }
      })
      tim.sendMessage(message, {
        // 如果接收方不在线，则消息将存入漫游，且进行离线推送（在接收方 App 退后台或者进程被 kill 的情况下）。接入侧可自定义离线推送的标题及内容
        offlinePushInfo: {
          title: userInfo?.nickName, // 离线推送标题
          description: '向您发起了一笔商品咨询~', // 离线推送内容
        }
      }).then(res => {
        Taro.navigateTo({
          url: `/pages/im/message/index?id=${result?.identifier}&type=1`
        })
      })
      setModalVisible(false)
    } else if (btnType === 'off') {
      const result = await api2060({ uuid: goodsDetail?.uuid, status: MERCHANT_YKJ_STATUS.off.value })
      Taro.showToast({
        title: '商品已下架'
      })
      setModalVisible(false)
      onUpdate()
    }
  }

  const onCancel = async () => {
    if (btnType === 'chat') {
      const result = await api4094({ merchantId: goodsDetail?.merchantId })
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${result?.identifier}&type=1`
      })
    }
    setModalVisible(false)
  }

  const RightText = useMemo(() => () => {

    return (
      <>
        { //买家
          userType === 'buyer' ? <>
            {ownState === 0 ? <div className={(auctionInfo?.status && auctionInfo?.status !== 0) || publishStatus === 0 ? 'SubmitButton-bottom-btn disabled' : 'SubmitButton-bottom-btn'} onClick={handleClick}>
              {label}
            </div> : <div className={(auctionInfo?.status && auctionInfo?.status !== 0) || publishStatus === 0 ? 'SubmitButton-bottom-longBtn disabled' : 'SubmitButton-bottom-longBtn'} onClick={shareClick}>
              {shareLabel}
            </div>}
          </> : <>
            { //卖家
              ownState === 0 ? <>
                {((stock > 0 && productType === 0) || (productType === 1 && auctionInfo?.status === 0)) && publishStatus === 1 ? <div className='SubmitButton-bottom-btn2'>
                  {productType === 1 ? <div className='SubmitButton-bottom-btn2-left' onClick={shareClick}>
                    分享赚
                  </div>
                    : <div className='SubmitButton-bottom-btn2-left1' onClick={shareClick}>
                      <p className='p1'>分享赚</p>
                    </div>}
                  {productType === 1 ? <div className={auctionInfo?.status && auctionInfo?.status !== 0 ? 'SubmitButton-bottom-btn2-right disabled' : 'SubmitButton-bottom-btn2-right'} onClick={handleClick}>
                    {label}
                  </div>
                    : <div className='SubmitButton-bottom-btn2-right2' onClick={handleClick}>
                      <p className='p1'>{label}</p>
                    </div>}
                </div> : <div className='SubmitButton-bottom-btn disabled' onClick={handleClick}>{label}</div>}
              </> : <>{!sourceUrl ? <div className={(auctionInfo?.status && auctionInfo?.status !== 0) || publishStatus === 0 ? 'SubmitButton-bottom-longBtn disabled' : 'SubmitButton-bottom-longBtn'} onClick={shareClick}>
                {shareLabel}
              </div> : <div className={(auctionInfo?.status && auctionInfo?.status !== 0) || publishStatus === 0 ? 'SubmitButton-bottom-btn disabled' : 'SubmitButton-bottom-btn'} onClick={shareClick}>
                {shareLabel}
              </div>}</>
            }
          </>
        }
      </>
    )
  }, [label, ownState, sourceUrl, shareLabel, auctionInfo, publishStatus])

  const goRouter = useCallback(
    () => {
      BwTaro.navigateTo({
        url: '/pages/index/index'
      })
    },
    [],
  )

  const LeftButton = useMemo(() => () => {

    const BtnSiliao = LoginWrapperBtn((sProps) => <div className='SubmitButton-bottom-item' onClick={sProps.onClick}>
      <img src={siliao} alt="" />
      <p>私聊</p>
    </div>)

    return (
      <>
        {
          !sourceUrl ? <div className='flex'>
            <div className='SubmitButton-bottom-item' onClick={goRouter}>
              <img src={dianp} alt="" />
              <p>首页</p>
            </div>
            {ownState === 1 ? null : <BtnSiliao onClick={goChat} />}
          </div>
            : <div className='flex'>
              <div className='SubmitButton-bottom-item' onClick={goEdit}>
                <img src={bianji} alt="" />
                <p>编辑</p>
              </div>
              <div className='SubmitButton-bottom-item' onClick={goOff}>
                <img src={xiajia} alt="" />
                <p>下架</p>
              </div>
            </div>
        }
      </>
    )
  }, [ownState, sourceUrl])
  return (
    <div className='SubmitButton-bottom'>
      <LeftButton />
      <RightText />
      <BwModal visible={modalVisible} type='confirm' title={modalTitle} onConfirm={onConfirm} onClose={() => { setModalVisible(false) }} onCancel={onCancel} cancelText={cancelText} confirmText={btnType === 'chat' ? '好的' : '确定'} />
    </div>
  )
}

export default SubmitButton
