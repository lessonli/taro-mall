import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Tabs from '@/components/Tabs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './index.scss'
import classNames from 'classnames'
import api4488 from '@/apis/21/api4488'
import { useRequest } from 'ahooks'
import { LoadingView, NoMore, useListStatus } from '@/components/ScrollView'
import { empty } from '@/constants/images'
import Empty from '@/components/Empty'
import LiveProductCard from './LiveProductCard'
import { useRecoilState } from 'recoil'
import { shoppingCarListInfo, worker } from '@/store/atoms'
import { globalConfig } from '@/utils/cachedService'
import dayjs from 'dayjs'
import { useDidHide } from '@tarojs/runtime'
import api4522 from '@/apis/21/api4522'
import asyncValidate from '../setting/asyncValidate'
import { IHandleCaptureException, Sentry } from '@/sentry.repoter'


const LiveShoppingCar = (props: {
  recordId: string;
  roomId: string;
  timeList: any[];
  close: () => void;
  buying: Function
}) => {
  const { close, timeList, recordId, roomId, buying } = props
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [workers, setWorkers] = useRecoilState(worker)
  const [tabValue, setTabValue] = useState(0)
  const [merchantId, setMerchantId] = useState(111)
  // const [timeList, setTimeList] = useState<string[]>([])
  const [productNum, setProductNum] = useState<any>({ aucNum: 0, secKill: 0 })
  const [message, setMessage] = useRecoilState(shoppingCarListInfo)
  const tabOption = {
    options: [
      {
        label: `秒杀中(${productNum.secKill})`,
        value: 0
      },
      {
        label: `拍卖中(${productNum.aucNum})`,
        value: 1
      },

    ],
    onChange: (value) => {
      setTabValue(value)

    },
    value: tabValue,
    style: {
      background: '#f8f8f8',
      'justify-content': 'flex-start'
    }
  }

  useEffect(() => {
    const value = {
      roomId: props.roomId,
      recordId: props.recordId,
    }
    asyncValidate(
      {
        roomId: {
          required: true,
        },
        recordId: {
          required: true,
        },
      },
      value,
    ).catch((errs) => {
      Sentry?.captureException({
        exceptionName: 'live_room_shopping_car_props',
        errs,
        value
      } as IHandleCaptureException)
    })
  }, [props.roomId, props.recordId])


  const service = useCallback(async (

    // 获取购物车商品
    result?: { pageNo: number, pageSize: number, list: any[] }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 10
    const res = await api4488({
      roomId: roomId,
      productType: tabValue,
      pageNo,
      pageSize
    })
    return {
      total: res?.total,
      list: res?.data,
      pageNo,
      pageSize,
    }
  }, [roomId, tabValue])


  const { data, loadMore, loading, reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [roomId, tabValue],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })


  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore
  })


  useEffect(() => {
    (async () => {
      // run()
      if (roomId && recordId) {
        const productNum = await api4522({
          roomId: roomId,
          recordId: recordId
        })
        setProductNum(productNum)
      }
    })()
    return () => {
      workers.postMessage({
        type: 'hide',
        msg: 'hide',
        num: 200
      })
    }
  }, [tabValue, roomId, recordId])

  useEffect(() => {

    if (message) {
      data.list.forEach(val => {
        if (val.uuid === message.uuid) {

          val.auction.lastAucPrice = message.price
          val.auction.endTime = message.endTime
        }
      })
    }

  }, [message])

  useEffect(() => {
    if (data && data?.list?.length > 0) {
      if (data?.list[0].productType === 1) {
        (async () => {
          const config = await globalConfig()
          workers.postMessage({
            type: 'productList',
            msg: data.list,
            num: 200
          })

        })()
      }
    }
  }, [data])



  const rootClass = classNames(
    'Live-shoppingCar',
    props.className
  )

  return (
    <View className={rootClass}>
      <Tabs className='Live-shoppingCar-tabs' {...tabOption} style={{ background: '#fff' }}></Tabs>
      <ScrollView
        className='Live-shoppingCar-content'
        scrollY

        onScrollToLower={loadMore}
      // scrollWithAnimation
      >
        {data?.list.map((item, i) => {
          return <LiveProductCard buying={buying} productInfo={item} endTime={timeList[i]} key={item.uuid} roomId={props.roomId} recordId={props.recordId}></LiveProductCard>
        })}

        <View>
          {
            listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
          }
          {
            listStatus.empty && <Empty src={empty} text='暂无直播商品' className='m-t-60' />
          }
        </View>
      </ScrollView>

      {/* {
        listStatus.empty && data?.pageNo === 1 && <div className='bw-searchList-empty'><Empty src={empty} text={'暂无直播商品'}></Empty></div>
      }
      {
        listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
      } */}
    </View>
  )
}

export default LiveShoppingCar
