import Tabs from "@/components/Tabs"
import { View, ScrollView, Text } from "@tarojs/components"
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Taro, { redirectTo } from "@tarojs/taro";

import Empty from '@/components/Empty'
import {NO_GOODS} from '@/constants/images'
import { AtButton } from "taro-ui"
import api2124 from "@/apis/21/api2124"
import VirtualList from '@tarojs/components/virtual-list'

import AuctionItem, {IItem, TBtnName} from '@/pages/auction/list/AuctionItem'
import { useRequest } from "ahooks"

import './index.scss'
import { LoadingView, NoMore } from "@/components/ScrollView"
import api2060 from "@/apis/21/api2060"
import { MERCHANT_YKJ_STATUS, PRODUCT_TYPE } from "@/constants"
import { getRealSize } from "@/utils/base";


const SystemInfo = Taro.getSystemInfoSync()
const {windowHeight} = SystemInfo

export default () => {

  const [tabVal, setTabVal] = useState(MERCHANT_YKJ_STATUS.onSale.value)
  const VirtualListRef = useRef()

  const options = Object.keys(MERCHANT_YKJ_STATUS).map((key) => MERCHANT_YKJ_STATUS[key])

  const toPublish = () => {
    Taro.navigateTo({
      url: `/pages/merchant/publish/product/index?productType=${PRODUCT_TYPE.YKJ.value}`
    })
  }

  const VirtualListHeight = windowHeight - getRealSize(88)
  const itemSize = getRealSize(425)

  const xservice = useCallback(async (
    result?: { total: number; lastId?: string; list: IItem[]; noMore: boolean },
    cItem?: {
      _update?: boolean;
      _remove?: boolean;
    } &IItem,
  ) => {

    if (cItem?._remove) {
      const xlist = result?.list?.filter(e => e.uuid !== cItem.uuid)
      const total = result?.total - 1
      return Promise.resolve({
        ...result,
        list: xlist,
        lastId: xlist?.[xlist?.length - 1].uuid || '',
        total,
        noMore: xlist?.length >= total,
      })
    }

    if (cItem?._update) {
      const xlist = result?.list?.map(item => {
        if (item.uuid === cItem.uuid) {
          return cItem
        }
        return item
      })
      return {
        ...result,
        list: xlist,
      }
    }

    const pageSize =  10
    const res = await api2124({
      productType: 0, 
      publishStatus: tabVal, 
      pageSize,
      lastId: result?.lastId || '',
    })
    const cList = res?.data || []
    const fullList = (result?.list || []).concat(cList)
    const total = res?.total || 0
    return {
      tabVal,
      lastId: cList.length > 0 ? cList[cList.length - 1].uuid : '',
      prevList: cList,
      list: fullList,
      total,
      noMore: fullList.length >= total,
    }
  }, [tabVal])

  const {data, loading, run, reset} = useRequest(xservice, {
    manual: true,
    refreshDeps: [tabVal],
    debounceInterval: 200,
  })

  useEffect(() => {
    reset()
    // VirtualListRef.current?.scrollTo?.(0)
    run()
  }, [tabVal])

  const ListStatus = useMemo(() => {
    if (!loading && data?.list?.length === 0) return <Empty src={NO_GOODS} text="暂无商品" className="m-t-120" />
    return <View className="m-b-120">
      {
        !!data?.noMore ? <NoMore /> : <LoadingView visible={loading} />
      }
    </View>
  }, [loading, data,])

  const handleChange = useCallback((name: TBtnName, uuid, itemData: IItem) => {
    if (name === '下架') {
      run(data, {_remove: true, ...itemData})
    }

    if (name === '店铺推荐' || name === '取消推荐') {
      run(data, { ...itemData, _update: true, shopRecStatus: itemData.shopRecStatus === 1 ? 0 : 1 })
    }
  }, [data])

  const Item = useMemo(() => ({ data, index }) => <AuctionItem productType={0} data={data[index]} onSuccess={handleChange} />, [data])

  return <View className="onePriceListPage full-screen-page">
    <Tabs
      options={options}
      value={tabVal}
      onChange={setTabVal}
    ></Tabs>

    <View className="onePriceListPage-list">
      <VirtualList
        className="onePriceListPage-VirtualList"
        width="100%"
        height={VirtualListHeight}
        itemData={data?.list || []}
        itemCount={data?.list?.length || 0}
        itemSize={itemSize}
        overscanCount={10}
        renderBottom={ListStatus}
        ref={VirtualListRef}
        onScroll={({ scrollDirection, scrollOffset }) => {

          if (scrollOffset > (data?.list?.length - (VirtualListHeight / itemSize)) * itemSize - 100) {
            // loadMore()
            if (!data?.noMore) {
              run(data)
            }
          }
        }}
      >
        {Item}
      </VirtualList>
    </View>

    <View className="border-box pd2432 fixed-bottom">
      <AtButton type="primary" onClick={toPublish}>发布商品</AtButton>
    </View>
  </View>
}