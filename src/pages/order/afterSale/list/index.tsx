import api1940, { IResapi1940 } from "@/apis/21/api1940";
import api3650 from "@/apis/21/api3650";
import Empty from "@/components/Empty";
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import Tabs from "@/components/Tabs";
import { RETURN_STATUS } from "@/constants";
import { empty } from "@/constants/images";
import compose, { formatMoeny, fen2yuan, getRealSize } from "@/utils/base";
import storge, { isBuyerNow } from "@/utils/storge";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import NavigationBar, { navigationBarInfo, navigationBarPageStyle, SingleBackBtn } from '@/components/NavigationBar'

import './index.scss'
import { XImage } from "@/components/PreImage";

type IItem = Required<Required<IResapi1940>['data']>['data'][0]

const STATUS = RETURN_STATUS.ing.children
const opts = [
  { label: '待处理', value: 0 },
  { label: '处理中', value: 1 },
  { label: '已处理', value: 2 },
  { label: '全部', value: '' },
]

export default () => {
  const isBuyer = isBuyerNow()

  const [status, setStatus] = useState(isBuyer ? '' : 0)

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15

    const res = await (isBuyer ? api3650 : api1940)({
      status,
      pageNo,
      pageSize,
    })

    return {
      list: res?.data || [],
      total: res?.total || 0,
      pageNo,
      pageSize,
    }
  }, [status])

  const { data, loadMore, loadingMore, noMore, reload, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [status],
    // debounceInterval: 300,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })

  const isEmpty = useMemo(() => {
    return !loading && data?.list.length === 0
  }, [data, loading])

  const listStatus = useListStatus({
    loading,
    noMore,
    list: data?.list || [],
  })

  const handleBtnClick = (name, item: IItem) => {
    if (name === '退货物流') {
      storge.setItem('expressIcon', item.productIcon || '')
      Taro.navigateTo({
        url: `/pages/order/express/detail/index?afterSaleId=${item.uuid}&orderReturnNo=${item.uuid}`
      })
    }
  }

  const ScrollViewStyle = useMemo(() => {
    return isBuyer ? {
      height: '100%'
    } : {
      height: `calc(100% - ${process.env.TARO_ENV === 'h5' ? getRealSize(88) : (getRealSize(88) + navigationBarInfo?.navigationBarAndStatusBarHeight)
        }px)`
    }
  }, [])

  const toPage = useCallback((item: IItem) => {
    Taro.navigateTo({
      url: `/pages/order/afterSale/detail/index?orderNo=${item.orderNo}&orderReturnNo=${item.uuid}`
    })
  }, [])

  return <View className="afterSaleListPage full-screen-page">
    <NavigationBar
      title={isBuyer ? '售后列表' : '店铺售后列表'}
      background="#ffffff"
      leftBtn={<SingleBackBtn />}
    />
    {
      !isBuyer && <Tabs
        options={opts}
        value={status}
        onChange={setStatus}
      ></Tabs>
    }

    <ScrollView
      className={`afterSaleListPage-ScrollView ${isBuyer ? 'afterSaleListPage__buyer' : 'afterSaleListPage__merchant'}`}
      style={ScrollViewStyle}
      scrollY
      onScrollToLower={loadMore}
    >
      {
        data?.list.map((item: IItem) => {
          return <View className="afterSaleListPage-ScrollView-item" key={item.uuid}>
            <View className="afterSaleListPage-ScrollView-item-header justify-between p-t-24 p-r-32 p-b-24 p-l-32">
              {/* 头像 */}

              <View className={`fz28 afterSaleListPage-ScrollView-item-header-l`}>
                <XImage src={isBuyer ? item.merchant?.icon : item.user?.icon} query={{ 'x-oss-process': 'image/resize,w_80/quality,q_100' }} className={`afterSaleListPage-ScrollView-item-header-ava ${isBuyer ? 'ava-merchant' : 'ava-user'} m-r-12`} />
                <Text>{
                  isBuyer ? item.merchant?.name : item.user?.name
                }</Text>
              </View>
              {
                !!item.statusStr && <View className="fz28 afterSaleListPage-ScrollView-item-header-text">{item.statusStr}</View>
              }

            </View>

            <View className="flex p-t-24 p-r-32 p-b-24 p-l-32 afterSaleListPage-product" onClick={() => toPage(item)}>
              <XImage src={item.productIcon}
                query={{ 'x-oss-process': 'image/resize,w_80/quality,q_100' }}
                className="afterSaleListPage-product-icon m-r-16" />
              <View className="afterSaleListPage-product-content">
                <View className="afterSaleListPage-product-content-name fz28 tabColor">{item.productName}</View>
                <View className="afterSaleListPage-product-content-result">
                  {item.amountTypeLabel}：<Text className="color-primary fz24">￥</Text><Text className="color-primary">{compose(formatMoeny, fen2yuan)(item.returnAmount)}</Text>
                </View>
              </View>
            </View>

            {
              item.status === RETURN_STATUS.ing.children.onTheWay.value && <View className="afterSaleListPage-product-footer">
                <AtButton size="small" onClick={() => handleBtnClick('退货物流', item)}>退货物流</AtButton>
              </View>
            }
          </View>
        })
      }

      <View>
        {
          (data?.list.length > 0 && noMore) && <NoMore />
        }
        {
          isEmpty ? (
            <Empty src={empty} text={`暂无${status === '' ? '' : opts.find(e => e.value === status)?.label}订单`} className="p-t-40" />
          ) : <LoadingView visible={listStatus.loading} />
        }
      </View>

    </ScrollView>
  </View>
}