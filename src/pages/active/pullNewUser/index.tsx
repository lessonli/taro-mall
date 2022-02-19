
import { View, Text, ScrollView, Image } from "@tarojs/components";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Taro, { useShareAppMessage, usePullDownRefresh, useReachBottom } from "@tarojs/taro";

import { AtButton, AtCurtain } from "taro-ui";

import { useWeappUrlChannelHook, useUserTypeHook } from "@/utils/hooks";

import { session, isBuyerNow } from "@/utils/storge";
import { XImage } from "@/components/PreImage";
import { zxj, lxbg, empty, lxhb, pullNewBg3, moreFree, txBg, lxhb2,wxtsbg } from "@/constants/images";
import { tabs, moneyStatus } from "./constants";
import BwModal from "@/components/Modal";
import NavigationBar, { BackAndHomeBtn, SingleBackBtn } from "@/components/NavigationBar";
import { useDebounceFn, useRequest } from 'ahooks'
import compose, { formatMoeny, fen2yuan } from "@/utils/base";
import { getHostProxyImg } from '@/utils/base';
import dayjs from "dayjs";

import { host } from "@/service/http";
import { getStatus, getUserInfo } from "@/utils/cachedService";
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import Empty from '@/components/Empty';

import CanvasPhoto from "@/components/CanvasPhoto";
import { initPullNew } from "@/components/CanvasPhoto/components/CanvasInit";

import api4528, { IResapi4528 } from '@/apis/21/api4528'
import api4530, { IResapi4530 } from '@/apis/21/api4530'
import api4532, { IResapi4532 } from '@/apis/21/api4532'
import api3554 from "@/apis/21/api3554";
import api3560 from "@/apis/21/api3560";
import api4534 from "@/apis/21/api4534"; // 邀请记录
import api4536 from "@/apis/21/api4536"; // 提现记录
import api4538 from "@/apis/21/api4538"; // 提现成功列表

import Strategy from "./components/Strategy";
import Marqueen from '../components/Marqueen'

type IActive = Required<IResapi4528>['data']
type IStatistical = Required<IResapi4530>['data']

import './index.scss'


function PullNew() {
  const page = useMemo(() => Taro.getCurrentInstance(), []);
  const uuid = '2000002'
  const { userType } = useUserTypeHook()

  const [currentValue, setCurrentValue] = useState(1)
  const [withdrawList, setWithdrawList] = useState([])
  const [lxModal, setLxModal] = useState({
    txModal: false,
    shareModal: false,
    endModal: false,
    fuliModal: false,
    merchantModal: false // 仅仅商家展示区首页的弹窗
  })

  const [activeInfo, setActiveInfo] = useState<IActive>()
  const [statistical, setStatistical] = useState<IStatistical>()

  const [shareLink, setShareLink] = useState()
  const [shareQrcode, setShareQrcode] = useState()
  const [showActive, setShowActive] = useState(0)





  useEffect(() => {
    (async () => {
      Taro.showLoading()
      try {
        const status = await getStatus()
        const userInfo = await getUserInfo()
        if (status.mobileStatus === 1) {
          setShowActive(1)
          const activeRes = await api4528({ uuid })
          const statisticalRes = await api4530({ uuid })
          const withdrawListRes = await api4538()

          setStatistical(statisticalRes)
          setActiveInfo(activeRes)
          setWithdrawList(withdrawListRes)
          if (activeRes?.activityStatus === 2) {
            showModal('endModal')
          }

          // TODO: 调整布局之后放开

          if (userInfo.userLevel === 3) {
            showModal('merchantModal')
          }


          // 分享相关
          const shareLinkRes = await api3554({ shareType: 9, targetId: uuid })
          setShareLink(shareLinkRes)
          Taro.hideLoading()
        }
        if (!status || status.mobileStatus !== 1) {


          setShowActive(2)
        }
      } catch (error) {
        setShowActive(2)

        Taro.hideLoading()
      }
      Taro.hideLoading()
    })()
  }, [])

  useWeappUrlChannelHook()

  useShareAppMessage(() => {
    const shareData = {
      title: activeInfo?.activityName,
      imageUrl: activeInfo?.icon,
      path: shareLink?.shareUrl?.replace(host, ''),
    }


    return shareData
  })

  usePullDownRefresh(() => {

    api4530({ uuid })
      .then(res => {
        setStatistical(res)
      })
      .finally(() => {
        Taro.stopPullDownRefresh()
      })
  })

  useReachBottom(() => {
    loadMore()
  })


  const handleClick = () => {
    const bindingPhoen = (url) => {
      session.setItem('activeInfo', { activityId: page.router?.params.activityId, inviteUserId: page.router?.params.inviteUserId })
  
      session.setItem('redirect', url)
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }

    getStatus().then(res => {
      console.log(res, 'res');

      if (!res) {
        bindingPhoen('/pages/active/pullNewUser/index')
      }
      if (res.mobileStatus !== 1) {
        bindingPhoen('/pages/active/pullNewUser/index')
      }
      if (res.mobileStatus === 1) {
        setShowActive(1)
      }
    }).catch(error => {
      bindingPhoen('/pages/active/pullNewUser/index')
    })

  }


  const showModal = (key) => {
    setLxModal({ ...lxModal, [key]: true })
  }

  const closeModal = (key) => {
    setLxModal({ ...lxModal, [key]: false })
  }
  const { run: submit } = useDebounceFn(() => {
    if (statistical?.availableAmount <= 0) {
      return Taro.showToast({
        title: '暂无提现额度',
        icon: 'none',
        duration: 2000
      })
    }
    api4532({
      activityId: uuid,
      withdrawAmount: statistical?.availableAmount
    }).then(res => {
      //  提现完成 之后 状态的 或者重新请求接口
      setStatistical({ ...statistical, enableWithdraw: 0 })
      closeModal('txModal')
    })


  }, { wait: 200 })

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    if (currentValue === 1) return ''
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 10
    const fn = currentValue === 0 ? api4536 : api4534
    const res = await fn({
      pageNo,
      pageSize,
    })

    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [currentValue])
  const { data, loadMore, reload, loadingMore, noMore, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [currentValue],
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })



  const handleInvide = async () => {
    showModal('shareModal')
    const shareQrcodeRes = await api3560({ shareType: 9, targetId: uuid })
    setShareQrcode(shareQrcodeRes)

  }
  const handleTx = () => {
    showModal('txModal')
  }
  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })

  return <>
    {showActive === 1 &&
      <View
        className='bw-ScrollView-lx'
      >
        <Marqueen list={withdrawList.length > 0 && withdrawList} />
        <View className='bw-lx-box'>
          <View className='bw-lx-box-img'>
            <XImage className='bw-lx-box-img-ele' src={pullNewBg3} />
            <View className='bw-lx-box-img-rule' onClick={() => Taro.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(`${host}/pages/active/pullNewUser/rules/index`)}` })}>规则</View>
            <View className='bw-lx-box-img-buttonGroup'>
              <AtButton openType='share' className='bw-lx-box-img-buttonGroup-yqzq' type='primary'>邀请赚钱</AtButton>
              <AtButton className='bw-lx-box-img-buttonGroup-mdmyq' onClick={() => handleInvide()}>面对面邀请 </AtButton>
            </View>
          </View>
          <View className='bw-lx-box-tx'>
            <View className='bw-lx-box-tx-title'>我的现金</View>
            <View className='bw-lx-box-tx-info'>
              <View className='bw-lx-box-tx-info-action'>
                <Text className='bw-lx-box-tx-info-action-sym'>￥</Text>
                <Text className='bw-lx-box-tx-info-action-num'>{compose(formatMoeny, fen2yuan)(statistical?.totalAmount)}</Text>
              </View>
              {statistical?.enableWithdraw === 1 && <View className='bw-lx-box-tx-info-btn' onClick={() => handleTx()}>提现至钱包</View>}
              {statistical?.enableWithdraw === 0 && <View className='bw-lx-box-tx-info-btnDis'>今日已提现</View>}

            </View>
          </View>
          <View className='bw-lx-box-free' onClick={() => showModal('fuliModal')}>
            <Image className='bw-lx-box-free-img' src={moreFree}></Image>
          </View>
          <View className='bw-lx-box-tabs'>
            <View className='bw-lx-box-tabs-list'>
              {
                tabs.map((item, i) => {
                  return <View
                    onClick={() => setCurrentValue(i)}
                    className={`bw-lx-box-tabs-list-item  ${currentValue === i ? 'bw-lx-box-tabs-list-item-active' : ''}`}
                    key={item.value}
                  >
                    {item.title}
                  </View>
                })
              }
            </View>

            <View className='bw-lx-box-tabs-content'>

              <View className='bw-lx-box-tabs-content-list'>
                {
                  currentValue === 0 && data?.list.map((item, index) => {
                    return <View className='bw-lx-box-tabs-content-list-item' key={index}>
                      <View>{dayjs(item.gmtCreate).format('YYYY.MM.DD HH:mm')} 提现 <Text style={{ color: '#f54c3e' }}>{compose(formatMoeny, fen2yuan)(item.withdrawAmount)}</Text>元</View>
                      <View style={{ color: moneyStatus.get(item.auditStatus)?.color }}>{moneyStatus.get(item.auditStatus)?.label}</View>
                    </View>
                  })

                }
                {
                  currentValue === 0 &&
                  listStatus.empty && <Empty src={empty} text="暂无数据" className="m-t-60" />
                }

                {
                  currentValue === 2 && data?.list.map((item, index) => {
                    return <View className='bw-lx-box-tabs-content-list-invitem' key={index}>
                      <View className='bw-lx-box-tabs-content-list-invitem-img'>
                        <XImage className='bw-lx-box-tabs-content-list-invitem-img-ele' src={item.headImg}></XImage>
                      </View>
                      <View className='bw-lx-box-tabs-content-list-invitem-user'>
                        <View className='bw-lx-box-tabs-content-list-invitem-user-nickName'>{item.nickName}</View>
                        <View className='bw-lx-box-tabs-content-list-invitem-user-text'>
                          {dayjs(item.gmtCreate).format('YYYY.MM.DD HH:mm')}注册,帮您得
                          <Text style={{ color: '#f54c3e' }}> {compose(formatMoeny, fen2yuan)(item.rewardAmount)}</Text>
                          元
                        </View>
                      </View>
                    </View>
                  })
                }
                {
                  currentValue === 2 &&
                  listStatus.empty && <Empty src={empty} text="暂无数据" className="m-t-60" />
                }
                {
                  currentValue === 1 && <Strategy></Strategy>
                }
              </View>
            </View>
          </View>
          <View className='bw-lx-modal'>
            <AtCurtain
              isOpened={lxModal.txModal}
              onClose={() => closeModal('txModal')}
            // closeBtnPosition='top-right'
            >
              <View className='bw-lx-modal-content'>
                <View className='bw-lx-modal-content-head'>
                  <View className='bw-lx-modal-content-head-title'>提现须知</View>
                  <View className='bw-lx-modal-content-head-moneyInfo'>
                    <Text className='bw-lx-modal-content-head-moneyInfo-sym'>￥</Text>
                    <Text className='bw-lx-modal-content-head-moneyInfo-num'>{compose(formatMoeny, fen2yuan)(statistical?.availableAmount)}</Text>
                  </View>
                  <View className='bw-lx-modal-content-head-tip'>当前可提现余额</View>
                </View>
                <View className='bw-lx-modal-content-bottom'>
                  <AtButton className='bw-lx-modal-content-bottom-btn' onClick={submit}>确认提现</AtButton>
                  <View className='bw-lx-modal-content-bottom-tip'>每日可提现1次</View>
                </View>
              </View>
            </AtCurtain>
          </View>
          <View className='bw-lx-modalfuli'>
            <AtCurtain isOpened={lxModal.fuliModal} onClose={() => closeModal('fuliModal')}>
              <View className='bw-lx-modalfuli-fuliPic'>
                <Image className='bw-lx-modalfuli-fuliPic-img' src='https://bwyd-online.oss-cn-hangzhou.aliyuncs.com/logo/laxin_kefu3.png'></Image>
              </View>
            </AtCurtain>
          </View>
          
          {/*  商户身份 强跳首页 */}
          <View className='lx-modal-merchant'>
              <BwModal
                visible={lxModal.merchantModal}
                title='温馨提示'
                content={<View className='lx-modal-merchant-content'>
                  <View>仅普通用户可参加本次活动</View>
                  <Image className='lx-modal-merchant-bg'  src={wxtsbg}></Image>
                </View>}
                confirmText='确认'
                onConfirm={()=> {
                  closeModal('merchantModal')
                  Taro.reLaunch({url: '/pages/index/index'})
                }}
              >

              </BwModal>
          </View>

          {
            lxModal.shareModal && shareQrcode?.qrCodeUrl &&
            <CanvasPhoto
              type='pullNew'
              headImg={lxhb2}
              visible={lxModal.shareModal}
              onClose={() => closeModal('shareModal')}
              onCancel={() => closeModal('shareModal')}
              shareImg={shareQrcode?.qrCodeUrl}
              init={initPullNew}
              size={{ width: 520, height: 712 }}
              shareLink={shareLink?.shareUrl}
            // shareData=''

            />
          }

          <View className='lx-end-Modal'>
            <BwModal
              visible={lxModal.endModal}
              type='alert'
              title='活动已结束'
              confirmText='关闭'
              onClose={() => closeModal('endModal')}
              onCancel={() => closeModal('endModal')}
              content={<View> 活动已结束 </View>}
            >

            </BwModal>
          </View>
        </View>
      </View>

    }


    {
      showActive === 2 && <View className='lx-status-box' onClick={() => handleClick()}>
        <XImage className='lx-status-box-img' src={lxbg}></XImage>
      </View>
    }


  </>
}

export default PullNew