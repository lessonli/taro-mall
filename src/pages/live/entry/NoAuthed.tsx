import api4620, {IResapi4620} from '@/apis/21/api4620'
import ListItem from '@/components/ListItem'
import { kaitongzhibo } from '@/constants/images'
import {View, Image, Text} from '@tarojs/components'
import { useState } from 'react'
import { useEffect } from 'react'
import { AtButton } from 'taro-ui'
import Taro, { useDidShow } from '@tarojs/taro'
import { fen2yuan } from '@/utils/base'
import { useMemo } from 'react'
import NavigationBar, { SingleBackBtn } from '@/components/NavigationBar'
import api2452 from '@/apis/21/api2452'

const Fulfilled = () => <Text><Text className="myIcon Fulfilled">&#xe74c;</Text>已满足</Text>
const Rejected = () => <Text><Text className="myIcon Rejected">&#xe746;</Text>未满足</Text>

/**
 * 申请开通直播
 */
export default () => {

  const [detail, setDetail] = useState<Required<IResapi4620['data']> & {merchantLevel: number}>()

  /**
   * 店铺等级：服务商
店铺完成认证
店铺保证金>=5000
店铺关注粉丝>=500
店铺累计交易额>=50000元
   */
  const LIMIT = {
    marginAmount: 5000,
    fansCount: 500,
    tradeAmount: 50000,
    // 商户等级
    merchantLevel: 3,
  }

  useDidShow(() => {
    (async () => {
      console.log('useDidShow-----------');
      
      const res = await api4620()
      setDetail(res)
    })()
  })

  const disabled = useMemo(() => {
    return !(
      detail?.authStatus === 2 &&
      fen2yuan(detail?.marginAmount) >= LIMIT.marginAmount &&
      detail?.fansCount >= LIMIT.fansCount &&
      fen2yuan(detail?.tradeAmount) >= LIMIT.tradeAmount &&
      detail.merchantLevel === LIMIT.merchantLevel
    )
  }, [detail])

  return <View className="NoAuthed">
    <NavigationBar
      title={'申请开通直播'}
      leftBtn={<SingleBackBtn />}
    />
    <Image src={kaitongzhibo} className="NoAuthed-banner" />
    <View className="NoAuthed-content">
      <View className="NoAuthed-content-title">申请条件</View>
      <View className="NoAuthed-content-card">
        <ListItem
          type={1}
          icon={detail?.authStatus > 0 ? null : undefined}
          left="店铺完成实名认证"
          right={<Text onClick={() => {
            if (detail?.authStatus > 0) return
            Taro.navigateTo({
              url: `/pages/merchant/storeApprove/index`
            })
          }}>{({
            0: '未认证',
            1: '认证中',
            2: '已认证',
          }[detail?.authStatus])}</Text>}
        />
        <ListItem
          type={1}
          icon={fen2yuan(detail?.marginAmount) >= LIMIT.marginAmount ? null : undefined}
          left={`店铺保证金≥${LIMIT.marginAmount}元`}
          right={<Text onClick={() => {
            if (fen2yuan(detail?.marginAmount) >= LIMIT.marginAmount) return
            Taro.navigateTo({
              url: `/pages/merchant/earnestMoney/index`
            })
          }}>{fen2yuan(detail?.marginAmount) >= LIMIT.marginAmount ? '已缴纳' : '去缴纳'}</Text>}
        />
        <ListItem
          type={1}
          icon={null}
          left={`店铺关注粉丝≥${LIMIT.fansCount}人`}
          right={ detail?.fansCount >= LIMIT.fansCount ? <Fulfilled /> : <Rejected />}
        />
        <ListItem
          type={1}
          icon={null}
          left={`店铺累计交易额≥${LIMIT.tradeAmount}元`}
          right={fen2yuan(detail?.tradeAmount) >= LIMIT.tradeAmount ? <Fulfilled /> : <Rejected />}
        />
        <ListItem
          type={1}
          icon={null}
          left={`店铺等级为服务商`}
          right={detail?.merchantLevel === LIMIT.merchantLevel ? <Fulfilled /> : <Rejected />}
        />
      </View>

      <View className="NoAuthed-content-footer">
        <AtButton type="primary" disabled={disabled} onClick={() => {Taro.navigateTo({url: `/pages/live/apply/index`})}}>立即开通</AtButton>
        <View className="NoAuthed-content-footer-text agreements">点击即表示同意<Text className="agreement-item" onClick={() => {
          Taro.navigateTo({
            url: `/pages/webview/index?name=${encodeURIComponent('博物商家入驻协议11.17')}`
          })
        }}>《博物有道直播申请协议》</Text></View>
      </View>
    </View>
  </View>
}