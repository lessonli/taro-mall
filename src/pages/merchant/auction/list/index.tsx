import { useState, useEffect, useMemo, useRef } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { empty, NO_GOODS as emptyImg } from "@/constants/images";
import { AtButton } from 'taro-ui'
import { useRequest } from "ahooks";
import Taro, { useDidShow } from "@tarojs/taro";

import Empty from '@/components/Empty'
import TabModule from '@/components/TabModule'

import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";

import api2124, { IResapi2124 } from "@/apis/21/api2124";

import './index.scss'
import { useCallback } from 'react'
import { formatDate, formatMoeny, getRealSize } from '@/utils/base'

import AuctionItem, { TBtnName } from '@/pages/merchant/auction/list/AuctionItem'
import Tabs from '@/components/Tabs';
import { GOOD_PUBLISH_STATUS, PRODUCT_TYPE, MERCHANT_YKJ_STATUS } from '@/constants';
import NavigationBar, { navigationBarInfo, navigationBarPageStyle, SingleBackBtn } from '@/components/NavigationBar';
import { session } from '@/utils/storge';
import { sleep } from '@/utils/cachedService';

export type IItem = Required<Required<IResapi2124>['data']>['data'][0]

// 拍品管理

// 进入页面 会触发 useDidShow & useEffect 期望只触发useDidShow 所以加锁

export default () => {

  const flag = useRef(false)
  
  const page = Taro.getCurrentInstance()

  const productType = (Number(page.router?.params.productType || 0)) as 0 | 1
  const [currentStatus, setCurrentStatus] = useState(productType === 1 ? 0 : 1)

  const xRef = useRef()

  const tabOptions = productType === 1 ? Array.from(GOOD_PUBLISH_STATUS).map(([_, item]) => item) : Object.keys(MERCHANT_YKJ_STATUS).map((key) => MERCHANT_YKJ_STATUS[key])
  useDidShow(() => {
    console.log('useDidShow')

    const {publishName, publishProductId, publishSuccess} = session.getItem('pages/merchant/auction/list/index')
    session.resetItem('pages/merchant/auction/list/index')
    if (
      publishName === '编辑旧商品' && publishSuccess
      // productType === PRODUCT_TYPE.YKJ.value &&
      // currentStatus === MERCHANT_YKJ_STATUS.onSale.value
    ) {
      // TODO：单个商品数据更新
    } else if (
      publishName === '重新发布新商品' && publishProductId !== '' && publishSuccess
    ) {
      flag.current = true
      run(data, {
        _remove: true,
        uuid: publishProductId
      })
    } else if (!publishName && !publishProductId) {
      
    }

    // if (!publishName && !publishProductId) {
    //   flag = true
    //   reset()
    //   run()
    //   setTimeout(() => {
    //     flag = false
    //   }, 0);
    // }
  })

  useEffect(() => {
    !flag.current && run()
    flag.current = false
  }, [])

   

  const xservice = useCallback(async (
    result?: { lastId: string; list: IItem[]; total: number; noMore: boolean; },
    itemData?: { _remove?: boolean; _update?: boolean; } & IItem,
  ) => {
    if (itemData?._update) {
      const list = (result?.list || []).map((item, i) => {
        if (item.uuid === itemData.uuid) {
          return itemData
        }
        return item
      })
      return Promise.resolve({
        ...(result || {}),
        list,
      })
    }

    if (itemData?._remove) {
      const list = (result?.list || []).filter(item => item.uuid !== itemData.uuid)
      const total = result?.total - 1
      return Promise.resolve({
        ...(result || {}),
        list,
        lastId: list?.[list.length - 1]?.uuid || '',
        total,
      })
    }
    // 防止最后一页了
    const pageSize = 10
    const req = {
      productType,
      pageSize,
      lastId: result?.lastId || '',
    }
    if (productType === 1) {
      req.auctionStatus = currentStatus
    } else {
      req.publishStatus = currentStatus
    }
    const res = await api2124(req)

    const clist = res?.data || []
    const list = (result?.list || []).concat(clist)
    const l = (res?.data || []).length
    return {
      list,
      lastId: list.length > 0 ? list[list.length - 1].uuid : '',
      total: list.length + (res?.total || 0)- l,
      noMore: l === 0,
    }

  }, [currentStatus])

  const { loading, data, run, reset } = useRequest(xservice, {
    manual: true,
    debounceInterval: 100,
    // refreshDeps: [currentStatus],
  })

  // useEffect(() => {
  //   reset()
  //   !flag && run()
  // }, [currentStatus])

  const toPublish = useCallback(() => {
    session.setItem('pages/merchant/auction/list/index', {
      publishProductId: '',
      publishName: '发布新商品'
    })
    Taro.navigateTo({
      url: `/pages/merchant/publish/product/index?productType=${productType}`
    })
  }, [])

  const changeStatus = (name, uuid, item) => {
    if (['店铺推荐', '取消推荐'].includes(name)) {
      const newItem = {
        ...item,
        _update: true,
        shopRecStatus: item.shopRecStatus === 1 ? 0 : 1,
      }
      run(data, newItem)
    }

    if (name === '下架') {
      run(data, {_remove: true, ...item})
    }
  }



  const Row = useCallback(({data, index}) => <AuctionItem data={data[index]} productType={productType} onSuccess={changeStatus} />, [data])

  const subHeight = useMemo(() => {
    return process.env.TARO_ENV === 'h5' ? getRealSize(88) : (getRealSize(88) + navigationBarInfo?.navigationBarAndStatusBarHeight)
  }, [])

  return <View className="auction-list-page">

    <NavigationBar
      background="#ffffff"
      title={productType === 1 ? '拍品管理' : '一口价管理'}
      leftBtn={<SingleBackBtn />}
    />

    <View className="auction-list-page__header">
      <Tabs
        options={tabOptions}
        value={currentStatus}
        onChange={(s) => {
          setCurrentStatus(s)
          reset()
          run()
        }}
      ></Tabs>
    </View>

    <VirtualScrollList
      subHeight={subHeight}
      itemSize={getRealSize(431)}
      row={Row}
      listStatus={{
        noMore: data?.noMore,
        loading,
      }}
      data={data}
      loadMore={() => run(data)}
      ref={xRef}
      emptyProps={{
        src: productType === 1 ? emptyImg : empty,
        text: productType === 1 ? '暂无拍品' : '暂无商品'
      }}
      bottomClassName="m-b-120"
    />

    <View>
      {
        true && <View className="fixed-publish-btn">
          <AtButton type="primary" onClick={toPublish}>{productType === 1 ? '发布拍品' : '发布一口价'}</AtButton>
        </View>
      }
    </View>
  </View>
}

