import Taro, { useRouter } from '@tarojs/taro'

import { View, Image, Text, ScrollView } from '@tarojs/components'

import './index.scss'
import { useEffect, useState, useCallback } from 'react'
import api4918, { IResapi4918 } from '@/apis/21/api4918'
import Popup from '@/components/Popup'
import { CouponItem } from '@/pages/order/components/Coupons'
import api4882 from '@/apis/21/api4882'
import { TAKESTATUS_TYPE } from '@/constants'
import { useRequest } from 'ahooks'
import { deepClone, fen2yuan } from '@/utils/base'
import classNames from 'classnames'

export type ICouponList = Required<IResapi4918>['data']['data']

const CouponList = (props: {
  className?: string
}) => {

  const [couponList, setCouponList] = useState<ICouponList>([])

  const [isShowCoupon, setIsShowCoupon] = useState<boolean>(false)

  const params = useRouter()

  const service = useCallback(async (
    // 获取店铺推荐商品
    result?: { pageNo: number, pageSize: number }
  ) => {

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20

    const res = await api4918({
      pageNo,
      pageSize,
      activityId: params.params?.activityId || '',
      productId: params.params?.productId || '',
      merchantId: params.params?.merchantId || ''
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

  const getCoupon = async (id, status) => {
    if (status === 0) {
      const result = await api4882({ couponId: id })
      let list = deepClone(couponList)
      list.forEach(item => {
        if (item?.uuid === id) {
          item.takeState = 1
        }
      })
      setCouponList(list)
      Taro.showToast({
        title: '领取成功',
        icon: 'none'
      })
    }
  }


  useEffect(() => {

    if (data?.list) {

      setCouponList(deepClone(data?.list))

    }

  }, [data?.list])

  return (
    couponList && couponList.length > 0 ? <View className={props.className}>
      <View className='bw-couponList' onClick={() => { setIsShowCoupon(true) }}>
        <View className='bw-couponList-left'>
          {
            couponList?.map(item => {
              return item.grantType === 1 ? <View className='bw-couponList-left-item'>满{fen2yuan(item.minPoint)}减{fen2yuan(item.price)}元</View> : <View className='bw-couponList-left-item'>满{fen2yuan(item.minPoint)}打{item.price / 10}折</View>
            })
          }
        </View>
        <View className='bw-couponList-right'>
          <Text className='bw-couponList-right-1'>领券</Text>
          <Text className='bw-couponList-right-2 myIcon'>&#xe726;</Text>
        </View>
      </View>

      <Popup headerType='close' visible={isShowCoupon} onClose={() => setIsShowCoupon(false)} title='优惠券'>
        <View className="bw-couponList-content">
          <ScrollView
            scrollY
            className='bw-couponList-content-scroll'
            onScrollToLower={loadMore}
          >
            {
              couponList?.map(item => {
                return <CouponItem currentCoupon={item} Radio={<View className={item?.takeState === 0 ? 'bw-couponList-content-get' : 'bw-couponList-content-get geted'} onClick={() => { getCoupon(item?.uuid, item?.takeState) }}>{TAKESTATUS_TYPE[item?.takeState]}</View>}></CouponItem>
              })
            }
          </ScrollView>
        </View>
      </Popup>
    </View> : <></>
  )
}

export default CouponList
