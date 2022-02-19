import api3404 from '@/apis/21/api3404'
import api3482 from '@/apis/21/api3482'
import api4718, { req4718Config } from '@/apis/21/api4718'

import Commodity from '@/components/CommodityModule'
import { isAppWebview } from '@/constants'
import { resultAttention, reward } from '@/constants/images'
import compose, { formatMoeny, fen2yuan, BwTaro } from '@/utils/base'
import { ScrollView, Text, View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRequest, useUnmount } from 'ahooks'
import { useCallback, useMemo, useState } from 'react'
import StoreHeader from '../store/components/store-header'
import { useRef, useEffect } from 'react'
import BwModal from '@/components/Modal'
import { DEVICE_NAME } from '@/constants'

import { request } from '@/service/http'

import './index.scss'

const PayResult = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [commodityData, setCommodityData] = useState<[]>([])
  const [rewardAmount, setRewardAmount] = useState<number>()
  const [rewardModal, setRewardModal] = useState<boolean>(false)
  const refTimer = useRef(null)
  useEffect(() => {
    DEVICE_NAME === 'weapp' && getOrderReward()
  }, [])
  useUnmount(() => {
    DEVICE_NAME === 'weapp' && clearInterval(refTimer.current)
  })
  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20
    const res = await api3482({
      pageNo,
      pageSize,
      activityId: 100004
    })

    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [])

  const { data, loadMore, reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  const goHome = useCallback(() => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({ page: '/home' }),
      )
      return
    }
    BwTaro.redirectTo({
      url: '/pages/index/index'
    })
  }, [])

  const getOrderReward = () => {
    let num = 3000
    refTimer.current = setInterval(async () => {
      num -= 500
      if (num > 0) {
        try {
          const res = await request(req4718Config({ orderId: page.router?.params.orderNo }))
          console.log(res, 'res');

          if (res.rewardAmount) {
            setRewardAmount(Number(res.rewardAmount))
            setRewardModal(true)
            clearInterval(refTimer.current)
          }

        } catch (error) {
          // 淹没 错误信息
        }


      } else {
        clearInterval(refTimer.current)
      }
    }, 500)

  }

  const handleOrder = () => {
    Taro.redirectTo({
      url: `/pages/order/detail/index?orderNo=${page.router?.params.orderNo}`
    })
  }

  return (
    <ScrollView
      className='resultScroll'
      scrollY
      scrollWithAnimation
      lowerThreshold={200}
      onScrollToLower={loadMore}
    >
      <div className='PayResult'>
        <div className='PayResult-header'>
          <div className='PayResult-header-content'>
            <div>
              <p className='PayResult-header-content-result'>
                <i className='myIcon PayResult-header-content-result-success'>&#xe70c;</i>
                <span>支付成功</span>
              </p>
              <p className='PayResult-header-content-price'><Text>¥</Text><Text className='big'>{compose(formatMoeny, fen2yuan)(page.router?.params.payAmount || '')}</Text></p>
            </div>
          </div>
          <div className='PayResult-header-btn'>
            <span className='PayResult-header-btn-order' onClick={handleOrder}>查看订单</span>
            <span className='PayResult-header-btn-back' onClick={goHome}>返回首页</span>
          </div>
        </div>
        {/* <img className='PayResult-attention' src={resultAttention} alt="" /> */}
        <div className='PayResult-commodity'>
          <div className='PayResult-commodity-title'>为你推荐</div>
          <Commodity data={data?.list}></Commodity>
        </div>
      </div>
      <BwModal
        visible={rewardModal}
        title={`恭喜！ 抽中下单奖励${compose(formatMoeny, fen2yuan)(rewardAmount)}`}
        onClose={() => setRewardModal(false)}
        onCancel={() => setRewardModal(false)}
        content={<View>
          <View>订单完成后将入账【我的钱包-余额】</View>
          <Image className='resultScroll-img' src={reward}></Image>
        </View>}
        confirmText='收下奖励'
        onConfirm={() => setRewardModal(false)}
      ></BwModal>
    </ScrollView>
  )
}

export default PayResult
