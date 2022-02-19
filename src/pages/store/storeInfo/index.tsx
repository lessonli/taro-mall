import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'
import StoreHeader from '../components/store-header'
import Tabs from '@/components/Tabs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Evaluate from '@/components/Evaluate'
import Attention from '@/components/Attention'
import api2348 from '@/apis/21/api2348'
import { useRequest } from 'ahooks'
import './index.scss'
import api2612, { IResapi2612 } from '@/apis/21/api2612'
import api2884 from '@/apis/21/api2884'
import api2892 from '@/apis/21/api2892'
import { ScrollView } from '@tarojs/components'
import { empty } from '@/constants/images'
import Empty from '@/components/Empty'
import api2476 from '@/apis/21/api2476'
import dayjs from 'dayjs'
import { fen2yuan } from '@/utils/base'

export type IStoreInfo = Required<IResapi2612>['data']

const StoreInfo = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [tabValue, setTabValue] = useState(Number(page.router?.params.tabValue) || 1)
  const [evaluateType, setEvaluateType] = useState<number | string>('')
  const [storeInfo, setStoreInfo] = useState<IStoreInfo>()
  const [attention, setAttention] = useState<boolean>(false)
  const [marginShopAmount, setMarginShopAmount] = useState<number | undefined>(0)
  const tabOption = {
    options: [
      {
        label: '店铺简介',
        value: 1
      },
      {
        label: '店铺评价',
        value: 2
      }
    ],
    onChange: useCallback((value: number): void => {
      //tab切换之后调用获取商品接口 todo
      setTabValue(value)

    }, []),
    value: tabValue,
    style: {
      background: '#fff'
    }
  }

  const evaluateTabs = [
    {
      label: `全部 ${storeInfo?.comments?.totalNum}`,
      value: ''
    },
    {
      label: `好评 ${storeInfo?.comments?.goodNum}`,
      value: 0
    },
    {
      label: `中评 ${storeInfo?.comments?.middleNum}`,
      value: 1
    },
    {
      label: `差评 ${storeInfo?.comments?.badNum}`,
      value: 2
    }
  ]
  const desInfo = [{
    title: '店铺保证金',
    desLeft: `该商家已在平台缴纳 `,
    dynamic: fen2yuan(marginShopAmount),
    desRight: ` 元店铺保证金，交易由博物有道联合第三方银行提供资金担保，货款在买家确认收货后结算给商家。`
  },
  {
    title: '个人认证',
    desLeft: `该商家已通过 `,
    dynamic: storeInfo?.authStatus !== 0 && '个人认证',
    desRight: `，身份信息已在博物有道备案。`
  }]
  const Info = (infoProps) => {
    const { data } = infoProps
    return (
      <div className='storeInfo-info-item'>
        <p className='storeInfo-info-item-title'>{data.title}</p>
        <p className='storeInfo-info-item-des'>
          <Text>{data.desLeft}</Text>
          <Text className='storeInfo-info-item-des-600'>{data.dynamic}</Text>
          <Text>{data.desRight}</Text>
        </p>
      </div>
    )
  }
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20

    const res = await api2348({
      merchantId: page.router?.params.merchantId,
      scoreState: evaluateType,
      pageNo,
      pageSize,
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [evaluateType])

  const { data, loadMore, reload, loading, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [evaluateType],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  useEffect(() => {
    (async () => {
      const data = await api2612({ merchantId: page.router?.params.merchantId })
      setStoreInfo(data)
      setAttention(data?.followStatus)
      // const form = await api2476()
      setMarginShopAmount(data?.marginShopAmount)
    })()
  }, [])

  const evaluateTabChange = useCallback((value) => {
    setEvaluateType(value)

    // setEvaluateType()
  }, [])

  const payAttention = useCallback(async () => {
    // getStatus.reset()
    if (attention) {
      await api2892({ merchantNo: page.router?.params.merchantId })
      setAttention(!attention)
    } else {
      await api2884({ merchantNo: page.router?.params.merchantId })
      setAttention(!attention)
    }

  }, [attention])
  return (
    <ScrollView
      className='storeInfo-scrollview'
      scrollY
      scrollWithAnimation
      lowerThreshold={50}
      onScrollToLower={loadMore}
    >
      <div className='storeInfo'>
        <StoreHeader data={storeInfo}>
          {storeInfo?.isOwnShop !== 1 && <Attention onChange={payAttention} hasAttention={attention} color={true}></Attention>}
        </StoreHeader>
        <div className='storeInfo-tab'>
          <Tabs {...tabOption} composition={2} itemClassName='storeInfo-tab-mr'></Tabs>
        </div>
        {
          tabValue === 1 ? <div className='storeInfo-info'>
            {
              storeInfo?.marginShopAmount > 0 && desInfo.map((item, index) => {
                return <Info key={index} data={item}></Info>
              })
            }
            <div className='storeInfo-info-item'>
              <p className='storeInfo-info-item-title'>店铺信息</p>
              <p className='storeInfo-info-item-des'>
                <Text>该商家于</Text>
                <Text className='storeInfo-info-item-des-600'>{dayjs(storeInfo?.gmtCreate).format('YYYY-MM-DD HH:mm')}</Text>
                <Text>在博物有道开店</Text>
                {storeInfo?.province && <Text>,备案地址为{storeInfo?.province}{storeInfo?.city}{storeInfo?.district}</Text>}

              </p>
            </div>
          </div> : <div className='storeInfo-evaluate'>
            {storeInfo?.comments ? <><div className='storeInfo-evaluate-header'>
              <div>
                <span className='storeInfo-evaluate-header-title'>店铺评分</span>
                {<span className='storeInfo-evaluate-header-source'>{storeInfo?.comments.avgScore}</span>}
              </div>
              <div>
                <span className='storeInfo-evaluate-header-percent'>{storeInfo?.comments.goodRate}%</span>
                <span className='storeInfo-evaluate-header-tips'>好评率</span>
              </div>
            </div>
              <div className='storeInfo-evaluate-labelTabs'>
                {
                  evaluateTabs.map((item, index) => {
                    return <span key={index} className={evaluateType === item.value ? 'active' : ''} onClick={evaluateTabChange.bind(this, item.value)}>{item.label}</span>
                  })
                }
              </div></> : <div className='storeInfo-empty'><Empty src={empty} text='暂无数据'></Empty></div>
            }
            <div className='storeInfo-evaluate-content'>
              {
                data?.list?.map(item => {
                  return <div className='storeInfo-evaluate-content-item' key={item.userId}><Evaluate data={item}></Evaluate><p className='storeInfo-evaluate-content-line'></p></div>
                })
              }

            </div>
          </div>
        }

      </div>
    </ScrollView>
  )
}

export default StoreInfo
