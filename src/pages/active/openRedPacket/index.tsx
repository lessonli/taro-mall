import Taro, { login, pageScrollTo, showModal, showToast, useDidHide, useDidShow, useShareAppMessage } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { XImage } from "@/components/PreImage";

import { useReachBottom } from "@tarojs/taro";
import { WeappLoginPopup } from "@/components/WxComponents/WeappLogin";

import CanvasPhoto from "@/components/CanvasPhoto";
import { initRedPacket } from "@/components/CanvasPhoto/components/CanvasInit";
import { useAsync } from "@/utils/hooks";
import Open from "./components/Open";
import Cash from "./components/Cash";
import BancnceRed from "./components/BananceRed";
import NoRed from "./components/NoRed";
import NoRedPoll from "./components/NoRedPool";
import { useUnmount, useRequest } from "ahooks";
import { redShareimg, redPoster2, redPoster3, cumulativeRewardBg, shareModal, avatar1, avatar2, avatar3, bw_icon, empty, openRed_bg2, openRed_open2, red2liveList } from "@/constants/images";
import { useDebounceFn } from "ahooks";
import { IHandleCaptureException, Sentry } from '@/sentry.repoter'
import Rules from './components/Rules'
import { host } from "@/service/http";
import ListItem from "@/components/ListItem";
import compose, { fen2yuan, yuan2fen, formatMoeny, BwTaro, ms2day, countDownTimeStr } from "@/utils/base";
import dayjs from "dayjs";
import { request } from "@/service/http";
import WeappLogin from "@/components/WxComponents/WeappLogin";
import api4680, { IResapi4680, req4680Config } from "@/apis/21/api4680"; // 红包 前置查询
import api4678, { IResapi4678, req4678Config } from "@/apis/21/api4678"; // 拆红包
import api4676, { req4676Config } from "@/apis/21/api4676"; // 查找已存在的红包
import api3560, { IResapi3560 } from "@/apis/21/api3560";
import api4674 from "@/apis/21/api4674";
import api4670 from "@/apis/21/api4670"; // 余额提现
import api4668, { IResapi4668, req4668Config } from "@/apis/21/api4668";
import api4724, { IResapi4724 } from "@/apis/21/api4724";
import api4682, { req4682Config } from "@/apis/21/api4682";
import api4726, { IReqapi4726, IResapi4726 } from "@/apis/21/api4726"; // 领取红包id 记录
import api2604 from "@/apis/21/api2604"; // 店铺推荐
import api2508 from "@/apis/21/api2508"; // 随机推荐
import Commodity from '@/components/CommodityModule';
import Empty from "@/components/Empty";
import Popup from "@/components/Popup";
import storge from "@/utils/storge";
import './index.scss'
import { DEVICE_NAME, isAppWebview } from "@/constants";
import { sendCustomEvent } from "@/utils/uma.ts";
import { globalConfig, sleep } from "@/utils/cachedService";
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import webview from "@/pages/webview";



// 22015 红包池空了     22016 拆红包| 查找下一个红包没找到

// TODO：
//  !. 当前红包已领取 打开了 红包弹窗
//  2. 未登录 登录之后 重新拉取红包信息
//  
// 
// 3. 首页拆红包 拆一个未拆过的 红包  红包弹窗未关闭
interface Ivisible {
  login: boolean,
  canvas: boolean,
  accumulativeShareRewardModal: boolean,
  noGetShareRewardModal: boolean,
  liveListModal: boolean
}
// action 红包购买 liveList 去直播间列表
export type Itype = 'action' | 'liveList' | 'merchantBuy'

type IQrcode = Required<IResapi3560>['data']
type IRewardList = Required<IResapi4668>['data']
type IModalInfo = Required<IResapi4724>['data']
type IreceiveRotationList = Required<IResapi4726>['data']
interface IShareData {
  title?: string,
  path: string,
  picUrl?: string
  posterImg?: string
  userName?: string
  shareUrl?: string
  description?: string
}

export type IRedInfo = Required<IResapi4680 | IResapi4678>['data']

function OpenRedPactet() {
  let timeDifference;
  const page = useMemo(() => Taro.getCurrentInstance().router, [])
  const [redInfo, setRedInfo] = useState<IRedInfo>()
  const [qrCode, setQrCode] = useState<IQrcode>()
  const [shareData, setShareData] = useState<IShareData>()
  const [redPacketId, setRedPacketId] = useState<string>(page?.params?.redPacketId)
  const refCode = useRef()
  const refWeappLogin = useRef()
  // const redPacketId = useRef(page?.params?.redPacketId)
  //  红包轮播
  const [recordList, setRecordList] = useState([])
  const [hasInit, setHasInit] = useState(false)
  const [expreTimeText, setExpreTimeText] = useState<string>('')
  const [visible, setVisibe] = useState<Ivisible>({
    login: false,
    canvas: false,
    accumulativeShareRewardModal: false,
    noGetShareRewardModal: false,
    liveListModal: false


  })
  const [noRedPacket, setNoRedPacket] = useState<boolean>(false);
  const [noRedPacketPoll, setNoRedPacketPoll] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number>(0)
  const tabList = [{ title: '分享奖励' }, { title: '红包规则' }]
  const [rewardList, setRewardList] = useState<IRewardList>()
  const [modalInfo, setModalInfo] = useState<IModalInfo>()
  const timerRef = useRef()
  const timerRef2 = useRef()
  //  接口状态 是否可以看到 规则信息
  const [flag, setFlag] = useState(false)

  useEffect(async () => {
    // 禁用 右上角转发分享
    DEVICE_NAME === 'weapp' && Taro.hideShareMenu()
    console.log(redInfo, 'redInfo');

    if (redInfo && redInfo?.status !== 1 && (page?.params?.type === 'liveList')) {
      //   产品要求 一秒后打开弹窗
      // await sleep(1000) 
      showVisible('liveListModal')
    }
    if (redInfo?.status !== 1 && page?.params?.type === 'merchantBuy') {      
      // run()
      redInfo && run()

    }
  }, [redInfo])


  const eventName = useMemo(() => page?.params?.type === 'action' ? 'hongbao_buy' : 'hongbao_share', [])

  useEffect(() => {
    sendCustomEvent(`open_page`, {
      x_name: eventName
    }, page)

    return () => {

    }
  }, [])

  useEffect(() => {
    if (redInfo?.status !== 1 && page?.params.type === 'action') {
      clearInterval(timerRef.current)
      let num = 3
      timerRef.current = setInterval(() => {
        num -= 1
        Taro.showToast({
          title: `${num}秒后自动前往福利专区`,
          icon: 'none'
        })
        if (num <= 0) {
          clearInterval(timerRef.current)
          toMall()
        }


      }, 1000)
    }
    return () => {
      console.log('页面离开1')
      clearInterval(timerRef.current)
    }
  }, [redInfo])


  useEffect(() => {
    if ( redInfo?.status !== 1 && (page?.params.type === 'liveList' )) {      
      clearInterval(timerRef.current)
      let num = 3
      timerRef.current = setInterval(() => {
        num -= 1
        Taro.showToast({
          title: `${num}秒后自动前往直播列表`,
          icon: 'none'
        })
        if (num <= 0) {
          clearInterval(timerRef.current)
          closeVisible('liveListModal')
          Taro.navigateTo({
            url: '/pages/active/template/index?activityId=1012835972341248&_type=2'
          })
        }


      }, 1000)
    }
    return () => {
      clearInterval(timerRef.current)
    }
  }, [redInfo])
  useEffect(async () => {

    if (page?.params?.type === 'merchantBuy' && redInfo && redInfo?.status !== 1) {

      console.log(redInfo, 'redInfo12');
      
      const globalConfigRes = await globalConfig()
      timeDifference = globalConfigRes.timeDifference;
      timerRef2.current = setInterval(() => {
       
        
        const a = countDownTimeStr(new Date(redInfo&& redInfo?.expireTime || '').getTime(), timeDifference)
      
        if (a?.h >= 24) {
          setExpreTimeText(`${dayjs(redInfo?.expireTime).format('YYYY-MM-DD')}过期`)
          clearInterval(timerRef2.current)
        } else if (a === null) {
          setExpreTimeText(`${dayjs(redInfo?.expireTime).format('YYYY-MM-DD')}过期`)
          clearInterval(timerRef2.current)
        } else {
          setExpreTimeText(`${a.hh}时${a.mm}分${a.ss}秒过期`)
        }
      }, 1000)
    }

  },[redInfo])
  useDidHide(() => {
    clearInterval(timerRef2.current)

  })
  useReachBottom(()=>{
    if(redInfo?.status !==1 && page?.params?.type === 'merchantBuy'){
      loadMore()
    }
  })
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20
    const fn = redInfo?.useRange === 1 ? api2508 : api2604
    const res = await fn({
      merchantId: redInfo?.merchantId,
      pageNo,
      pageSize,
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [redInfo])

  const { run, data, reload, loading, loadMore, noMore } = useRequest(service, {
    loadMore: true,
    manual: true,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })
  const listStatus = useListStatus({
    list: data?.list,
    loading,
    // noMore,
    noMore: (data?.list || []).length >= data?.total && !loading
  })



  //  如果 用户首页 进入 未登录 登录之后 拉取 新红包  点击开红包 还会拉取新红包 所以 登录成功后 设置状态 区分 
  const init = async (
    /**
     * 初始化拉新下一个红包 拆红包 不再拉取
     */
    type: boolean,
  ) => {
    Taro.showLoading({ title: '加载中', mask: true })
    const fn = async () => {
      let _redInfo = {}
      if (page?.params?.redPacketId === 'RP55555666667777788888') {
        if (type) {
          try {
            const code = await request(req4676Config())
            console.log(code);

            refCode.current = code
            const redInfoRes = await request(req4680Config({ redPacketId: code }))
            _redInfo = redInfoRes
            setRedInfo(redInfoRes)
          } catch (error) {
            if (error.code === 22015) {
              // 红包池空了
              _redInfo = { ..._redInfo, status: -1 }
              setNoRedPacketPoll(true)
            }
            setRedInfo({ ..._redInfo, status: 1 })
            Taro.hideLoading()
            Sentry?.captureException({
              exceptionName: 'open_red_packet+init',
              errs: error,
              value: '',
            } as IHandleCaptureException)
          }
        }

      } else {
        // 当 非首页进入 也更新 refCode.current 避免分享 取不到值  (红包id)
        refCode.current = page?.params.redPacketId
        try {
          //  uuid 表示从详情页来 优先
          const redInfoRes = page?.params?.uuid ? await request(req4682Config({ uuid: page?.params?.uuid })) : await request(req4680Config({ redPacketId: redPacketId }))
          _redInfo = { ...redInfoRes }
          setRedInfo(redInfoRes)
        } catch (error) {
          console.log(error, 'error');
          if (error.code === 22015) {
            _redInfo = { ..._redInfo, status: -1 }
            setRedInfo(_redInfo)
            setNoRedPacketPoll(true)
          }
          _redInfo = { ..._redInfo, status: 1 }
          setRedInfo(_redInfo)
          Taro.hideLoading()
        }
      }

      try {
        const rewArdListRes = await request(req4668Config({ receiveType: 2 }))
        setRedInfo(_redInfo)
        setRewardList(rewArdListRes?.data)
        if (_redInfo?.status !== 1) {
          const modalInfoRes = await api4724()
          setModalInfo(modalInfoRes)
          console.log(modalInfoRes, 'modalInfoRes');
          console.log(modalInfo?.shareAmount === 0, 'modalInfo?.shareAmount === 0');

          if (modalInfoRes?.shareAmount > storge.getItem('accumulativeShareReward')) {
            page?.params.type !== 'action' && page?.params.type !== 'liveList' && page?.params.type !== 'merchantBuy' && showVisible('accumulativeShareRewardModal')
            storge.setItem('accumulativeShareReward', modalInfoRes?.shareAmount)
          } else if (modalInfoRes?.shareAmount === 0) {
            page?.params.type !== 'action' && page?.params.type !== 'liveList' && page?.params.type !== 'merchantBuy' && showVisible('noGetShareRewardModal')
          }
        }
        const list = await api4726()
        // showVisible('liveListModal')
        setRecordList(list)

      } catch (error) {
        if (error.code === 1000 || error.code === 1010) {
          _redInfo = { ...redInfo, status: 1 }
          setRedInfo(_redInfo)
        }
      }


      Taro.hideLoading()
      setFlag(true)
    }
    return fn()
  }

  useShareAppMessage(() => {
    const share = {
      title: shareData?.title,
      path: shareData?.path.replace(host, ''),
      imageUrl: shareData?.picUrl
    }
    console.log(share, 'share');

    return share
  })


  const showVisible = (key: ('login' | 'canvas' | 'accumulativeShareRewardModal' | 'noGetShareRewardModal' | 'liveListModal')) => {
    setVisibe({ ...visible, [key]: true })
  }

  const closeVisible = (key: ('login' | 'canvas' | 'accumulativeShareRewardModal' | 'noGetShareRewardModal' | 'liveListModal')) => {
    setVisibe({ ...visible, [key]: false })
  }

  const { run: openRed, pending } = useAsync(async (userinfo, runAuth) => {
    // if (userinfo?.mobileStatus !== 1) {
    //   if(DEVICE_NAME === "weapp"){
    //     return runAuth()
    //   }

    // }
    sendCustomEvent(`${eventName}_chai_hong_bao`)
    try {
      const redInfoRes = await request(req4678Config({ redPacketId: refCode.current || page?.params.redPacketId, inviteUserId: page?.params?.inviteUserId }))
      setRedInfo(redInfoRes)
      // showVisible('liveListModal')
      Taro.hideLoading()

    } catch (error) {
      const { code, message } = error
      Taro.hideLoading()
      if (code === 22016) {  // 当前红包已领完
        console.log(redInfo, 'redrederedredered');

        setRedInfo({ ...redInfo, status: 0 })
        setNoRedPacket(true)
      } else if (code === 22015) {
        setNoRedPacketPoll(true)
        setRedInfo({ ...redInfo, status: -1 })
      } else {
        setRedInfo({ ...redInfo, status: 1 })
        return Taro.showToast({ title: message || error, icon: 'none' })
      }
    }
    Taro.hideLoading()


  }, { manual: true })
  const toRecord = () => {
    Taro.navigateTo({
      url: '/pages/user/couponCenter/index'
    })
  }
  const openCanvas = async () => {
    let codeRes = ''
    try {
      //  从详情页过来 优先取 详情页返回的数据有红包id
      codeRes = await api4674({ uuid: page?.params.uuid ? redInfo?.redPacketId : refCode.current })
    } catch (error) {
      // 红包池空了
      if (error.code === 22015) {
        setNoRedPacket(false)
        setRedInfo({ ...redInfo, status: -1 })
        setNoRedPacketPoll(true)

        return
      }
    }

    const qrCodeRes = await api3560({ shareType: 12, targetId: codeRes, customParam: `?type=${page?.params?.type}` })
    setQrCode(qrCodeRes)

    setShareData({
      userName: WEAPP_GH_ID,
      picUrl: qrCodeRes?.picUrl,
      title: qrCodeRes?.title,
      path: qrCodeRes?.shareUrl as string,
      posterImg: qrCodeRes?.picUrl,
      shareUrl: qrCodeRes?.shareUrl,
      description: qrCodeRes?.title,
    })
    showVisible('canvas')
  }
  const toMall = () => {
    Taro.redirectTo({ url: '/pages/active/newUserShare/index?activityId=1000009' })
  }
  const toPage = (url) => {
    Taro.navigateTo({ url })
    clearInterval(timerRef.current)
    closeVisible('liveListModal')
  }


  // 余额提现
  const YuETX = () => {
    api4670({ uuid: redInfo?.uuid })
      .then(res => {
        console.log(res, 'res');
        Taro.showToast({ title: '提现成功', icon: 'none' })
        return
      })
      .then(() => {

        BwTaro.redirectTo({ url: '/pages/index/index' })
      })
      .catch(err => {
        console.log(err, 'err');
        Taro.showToast({
          title: err.message || err,
          icon: 'none'
        })
      })
  }

  const serRecordList = () => {
    closeVisible('accumulativeShareRewardModal')
    toRecord()
  }
  const merchantBuyHandleInToMerchant = useCallback(()=>{
    if(redInfo?.useRange === 1){
      // 去新人专享
      Taro.navigateTo({url: '/pages/active/newUserShare/index?activityId=1000009'})
    }
    if(redInfo?.useRange ===2){
      // 进入店铺
      if(isAppWebview) {
        WebViewJavascriptBridge.callHandler(
          'openNativePage',
          JSON.stringify({ page: '/merchant/home', params: {merchantId: redInfo?.merchantId} } )
        )
      }
      if(!isAppWebview){
        Taro.navigateTo({
          url: `/pages/store/index?merchantId=${redInfo?.merchantId}`
        })
      }
    }
    },[redInfo])

  console.log(data?.list, 'list');
  
  return <View className='openRedPacket'>
    <WeappLogin ref={refWeappLogin} authType="silence" onSuccess={() => init(true)} sendCustomEventName={eventName}>
      {
        (userinfo, runAuth, userInfoFething) => {
          return <>
            {(redInfo?.status === 1 || (!userinfo)) && !userInfoFething && <Open type={page?.params?.type || ''} refWeappLogin={refWeappLogin} userInfo={userinfo} runAuth={runAuth} data={redInfo} handleClick={pending ? () => { } : () => openRed(userinfo, runAuth)} />}
            {/* 领取过并且是现金红包 */}
            {redInfo?.status === 2 && redInfo.accountType === 1 && <Cash merchantBuyHandleInToMerchant={merchantBuyHandleInToMerchant} type={page?.params?.type || ''} recordList={recordList} toMall={toMall} toPage={toPage} toRecord={toRecord} openCanvas={openCanvas} data={redInfo} ></Cash>}
            {/* 领取过并且是余额红包 */}
            {redInfo?.status === 2 && redInfo.accountType === 2 && <BancnceRed merchantBuyHandleInToMerchant={merchantBuyHandleInToMerchant} type={page?.params?.type || ''} recordList={recordList} toMall={toMall} toPage={toPage} toRecord={toRecord} expreTimeText={expreTimeText} openCanvas={openCanvas} data={redInfo}></BancnceRed>}
            {/* 红包领光了 */}
            {(redInfo?.status === 0 || noRedPacket) && <NoRed  merchantBuyHandleInToMerchant={merchantBuyHandleInToMerchant} type={page?.params?.type || ''} recordList={recordList} data={redInfo} toMall={toMall} toPage={toPage} toRecord={toRecord} openCanvas={openCanvas} ></NoRed>}

            {/* 红包池 空了 */}
            {noRedPacketPoll && <NoRedPoll type={page?.params?.type || ''} recordList={recordList} toMall={toMall} toPage={toPage} toRecord={toRecord} openCanvas={openCanvas}  ></NoRedPoll>}
            {(redInfo?.status !== 1 && flag && page?.params.type !== 'action' && page?.params.type !== 'merchantBuy') && <>
              <View className='openRedPacket-tab'>
                {
                  tabList.map((item, index) => {
                    return <>
                      <View key={index} onClick={() => setCurrentValue(index)} className={`openRedPacket-tab-item ${currentValue === index ? 'openRedPacket-tab-item-active' : ''}`} >{item.title}</View>

                    </>
                  })

                }

              </View>
              {currentValue === 1 && <Rules receiveExpireDays={redInfo?.receiveExpireDays} ></Rules>}
              {
                currentValue === 0 && <View className='redReceived'>
                  {rewardList?.map((item, index) => {
                    return <ListItem
                      key={index}
                      left={<View className='redReceived-left'>
                        <View className='redReceived-left-store'>
                          <View className='redReceived-left-store-name'>{item.shopName}
                            {
                              item?.receiveType === 2 && <Text className='redReceived-left-store-name-tag'>分享领取</Text>
                            }
                          </View>

                        </View>

                        <View className='redReceived-left-time m-t-10'>{dayjs(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</View>
                      </View>}
                      type={1}
                      right={
                        <View className='redReceived-right'>
                          <View className='redReceived-right-money'>+{compose(formatMoeny, fen2yuan)(item.awardAmount)}</View>
                          <View className='redReceived-right-text m-t-10'>{item.accountType === 1 ? '现金红包' : '普通红包'}</View>
                        </View>
                      }
                      handleClick={() => Taro.navigateTo({ url: `/pages/active/openRedPacket/detail/index?uuid=${item.uuid}` })}
                      icon={null}
                    >
                    </ListItem>

                  })}
                  {
                    rewardList?.length === 0 && <Empty src={empty} text='暂无记录' />
                  }

                  {
                    rewardList?.length > 0 && <View onClick={() => toRecord()} className='redReceived-more'>查看更多</View>
                  }


                </View>
              }
            </>}
            {
              redInfo?.status !== 1 && flag && page?.params.type === 'action' && <View>
                <Rules receiveExpireDays={redInfo?.receiveExpireDays} type={page?.params.type}></Rules>
              </View>
            }
            {
              redInfo?.status !== 1 && flag && page?.params.type === 'merchantBuy' && <>
                <View className="openRedPacket-recommended-scrollview-title">猜你喜欢</View>
                {/* <ScrollView
                  scrollY
                  onScrollToLower={loadMore}
                  className="openRedPacket-recommended-scrollview"
                > */}
                
                  <Commodity data={data?.list}></Commodity>
                  <View>
                  {
                    listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
                  }
                  {
                    listStatus.empty && <Empty src={empty} text="暂无推荐" />
                  }
          
                </View>
                {/* </ScrollView> */}
              </>
            }
          </>
        }
      }
    </WeappLogin>
    {
      visible.canvas && <CanvasPhoto
        shareImg={qrCode?.qrCodeUrl}
        shareLink={qrCode?.shareUrl}
        headImg={redPoster3}
        visible={visible.canvas}
        size={{ width: 520, height: 713 }}
        shareData={shareData}
        operationType={['friend', 'saveImg']}
        init={initRedPacket}
        onClose={() => closeVisible('canvas')}
      />
    }
    <View className='accumulativeShareRewardModal'>
      <Popup
        visible={visible.accumulativeShareRewardModal}
        headerType='empty'
        maskDisabled={true}
      // onClose={() => closeVisible('accumulativeShareRewardModal')}
      >
        <View className='accumulativeShareRewardModal-content'>
          <Image className='accumulativeShareRewardModal-content-img' src={cumulativeRewardBg}></Image>
          <View className='accumulativeShareRewardModal-content-info'>
            <View className='accumulativeShareRewardModal-content-info-text'>有{modalInfo?.shareCount}位好友通过了您领取了红包</View>
            <View className='accumulativeShareRewardModal-content-info-title'>累计分享奖励</View>
            <View className='accumulativeShareRewardModal-content-info-money'>￥{compose(formatMoeny, fen2yuan)(modalInfo?.shareAmount)}</View>
            <View className='accumulativeShareRewardModal-content-info-share' onClick={() => openCanvas()}>继续分享领红包</View>
            <View className='accumulativeShareRewardModal-content-info-record' onClick={() => serRecordList()}>查看领取记录 <Text className='myIcon fz26'>&#xe726;</Text></View>
          </View>
        </View>
      </Popup>
    </View>
    <View className='shareModal'>
      <Popup
        visible={visible.noGetShareRewardModal}
        headerType='empty'
        onClose={() => closeVisible('noGetShareRewardModal')}
      >
        <View className='shareModal-content'>
          <Image className='shareModal-content-img' src={shareModal}></Image>
          <Text className='myIcon shareModal-content-close  fz32' onClick={() => closeVisible('noGetShareRewardModal')}>&#xe73b;</Text>
          <View className='shareModal-content-info'>
            <View className='shareModal-content-info-tip'><Text className='myIcon shareModal-content-info-tip-icon '>&#xe73f;</Text> 可提现到微信零钱</View>
            <Image className='shareModal-content-info-img' src={bw_icon}></Image>
            <View className='shareModal-content-info-text'>平台剩余红包</View>
            <View className='shareModal-content-info-money'>￥{compose(formatMoeny, fen2yuan)(modalInfo?.totalLeftAmount)}</View>
            <View className='shareModal-content-info-shareInfo'>
              <Image className='shareModal-content-info-shareInfo-img' src={avatar1}></Image>
              <Image className='shareModal-content-info-shareInfo-img' src={avatar2}></Image>
              <Image className='shareModal-content-info-shareInfo-img' src={avatar3}></Image>
              <Text className='shareModal-content-info-shareInfo-text'>有{modalInfo?.currentSharingCount}人正在分享领红包</Text>
            </View>
            <View className='shareModal-content-info-share' onClick={() => openCanvas()}>分享给好友，红包翻倍</View>
          </View>
        </View>
      </Popup>
    </View>
    <View className="openRedPacket-liveModal">
      <Popup
        headerType="empty"
        visible={visible?.liveListModal}
        onVisibleChange={() => closeVisible('liveListModal')}
      >
        <View className="openRedPacket-liveModal-content">
          <Image className="openRedPacket-liveModal-content-img" onClick={() => toPage('/pages/active/template/index?activityId=1012835972341248&_type=2')} src={red2liveList}></Image>
          <Text className="openRedPacket-liveModal-content-icon myIcon" onClick={() => closeVisible('liveListModal')}>&#xe746;</Text>
        </View>
      </Popup>
    </View>
  </View>

}

export default OpenRedPactet