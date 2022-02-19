import Tabs from "@/components/Tabs";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { NO_CANPAI } from "@/constants/images";

import './index.scss'
import { BUYER_AUCT_STATUS, BUYER_AUCTION_STATUS, MERCHANT_AUCTION_STATUS, systemInfo, isAppWebview } from "@/constants/index";
import api2396, {IResapi2396} from "@/apis/21/api2396";
import { useRequest } from "ahooks";
import { AtButton } from "taro-ui";
import Taro, { useDidShow } from "@tarojs/taro";
import PayFeePopup from "@/components/PayFeePopup";
import api2652 from "@/apis/21/api2652";
import paySdk from "@/components/PayFeePopup/paySdk";
import VirtualScrollList, { LoadingView, NoMore } from "@/components/ScrollView";
import Empty from "@/components/Empty";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan } from "@/utils/base";
import Bidding from "@/pages/goods/components/Bidding";
import api2380 from "@/apis/21/api2380";
import { useDidHide } from "@tarojs/runtime";
import Popup from "@/components/Popup";
import { openAppProdcutDetail } from "@/utils/app.sdk";
import { globalConfig, sleep } from "@/utils/cachedService";
import api2906 from "@/apis/21/api2906";

const opts = Object.keys(BUYER_AUCT_STATUS).map(key => BUYER_AUCT_STATUS[key])

type IItem = Required<Required<IResapi2396>['data']>['data'][0]

const Item = (props: {
  data: IItem;
  onPay?: (data: IItem) => void;
  onOneMore?: (data: IItem) => void;
}) => {

  const {data} = props

  const buyerStatus = data.aucUser?.auctionStatus
  const merchantStatus = data.auction?.status

  const handleClick = (e, name) => {
    e.stopPropagation?.()
    if (name === '去支付') {
      // props.onPay?.(data)
      Taro.navigateTo({
        url: `/pages/order/detail/index?orderNo=${data.aucOrder?.orderNo}`
      })
    }

    if (name === '已领先') {

    }

    if (name === '加一手') {
      // TODO: 拉起出价组件 后支付
      props.onOneMore?.(data)
    }

    if (name === '进店逛') {
      Taro.navigateTo({
        url: `/pages/store/index?merchantId=${data.merchantId}`
      })
    }
  }

  const toGood = useCallback(() => {
    if (isAppWebview) {
      openAppProdcutDetail({
        productId: data.uuid
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/goods/goodsDetail/index?productId=${data.uuid}`
    })
  }, [data.uuid])

  return <View className='auctionHistories-item' onClick={toGood}>
      <View className='auctionHistories-item-icon' >
        <Image src={data.icon || ''} className='auctionHistories-item-icon-1' />
        {
          !!data.iconText && <Text className='auctionHistories-item-icon-2'>
            {/* <Text className="auctionHistories-item-icon-2-text">{data.iconText}</Text> */}
            {data.iconText}
          </Text>
        }
        
      </View>
      <View className='auctionHistories-item-content'>
        <View>
          <View className='auctionHistories-item-content__name'>{data.name}</View>
          <View className='auctionHistories-item-content__prices'>
            <Text className="m-r-12">起拍价￥{compose(formatMoeny, fen2yuan)(data.auction?.initPrice)}</Text>
            <Text>加价￥{compose(formatMoeny, fen2yuan)(data.auction?.markUp)}</Text>
          </View>
        </View>
        <View className='auctionHistories-item-content__footer'>
          <View className='auctionHistories-item-content__footer-l'>
            <View className='auctionHistories-item-content__footer-l-1'>
              当前价 <Text className='color-primary'>
                ￥<Text className='auctionHistories-item-content__footer-l-1-num'>{compose(formatMoeny, fen2yuan)(data.auction?.lastAucPrice)}</Text>
              </Text>
            </View>
            {
              !!data.leftPayTime && <View className='auctionHistories-item-content__footer-l-2'>
                剩余支付时间 <Text className='color-primary'>{data.leftPayTime}</Text>
              </View>
            }
            
          </View>
          <View className='auctionHistories-item-content__footer-r'>
            {
              (buyerStatus === BUYER_AUCTION_STATUS.waitPay.value)? <AtButton type='primary' size='small' onClick={(e) => handleClick(e, '去支付')}>去支付</AtButton> : null
            }
            {
              (buyerStatus === BUYER_AUCTION_STATUS.first.value) ? <AtButton size='small' onClick={(e) => handleClick(e, '已领先')} disabled>已领先</AtButton> : null
            }
            {
              (buyerStatus === BUYER_AUCTION_STATUS.out.value && merchantStatus === MERCHANT_AUCTION_STATUS.ing.value )? <AtButton size='small' type='primary' onClick={(e) => handleClick(e, '加一手')}>加一手</AtButton> : null
            }
            {/* 已支付，超时未支付和截拍未中拍 */}
            {(
              buyerStatus === BUYER_AUCTION_STATUS.hasPay.value ||
              (buyerStatus === BUYER_AUCTION_STATUS.out.value && merchantStatus === MERCHANT_AUCTION_STATUS.hasEnd.value) ||
              ([
                MERCHANT_AUCTION_STATUS.failed.value,
                MERCHANT_AUCTION_STATUS.closed.value,
              ].includes(merchantStatus))) ? <AtButton size='small' onClick={(e) => handleClick(e, '进店逛')}>进店逛</AtButton> : null
            }
          </View>
        </View>
      </View>
  </View>
}

export default () => {
  let timeDifference = 0
  const [visibles, setVisibles] = useState({
    PayFeePopup: false,
    binding: false,
  });

  const [currentItem, setCurrentItem] = useState<IItem>({});

  const [currentStatus, setCurrentStatus] = useState(BUYER_AUCT_STATUS.got.value)

  const [list, setList] = useState([]);

  const timerRef = useRef()

  const flag = useRef(false)

  const topay = useCallback(async (price: number) => {
    await api2380({
      auctionPrice: price,
      productId: currentItem.uuid,
    })
    setVisibles({
      ...visibles,
      binding: false
    })
    Taro.showToast({ title: '已出价', icon: 'none' })
    run(data, {
      _first: true,
      _price: price,
      ...currentItem,
    })
  }, [currentItem])

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize =  result?.pageSize || 15

    const res = await api2396({
      pageNo,
      pageSize,
      queryType: currentStatus,
    })

    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }

  }, [currentStatus])

  // const { data, loadMore, loadingMore, loading, noMore, reload } = useRequest(service, {
  //   manual: true,
  //   loadMore: true,
  //   debounceInterval: 400,
  //   isNoMore: (d) => (d ? d.list.length >= d.total : false),
  // })

  const xService = useCallback(async (
    result?: { pageNo: number, pageSize: number, list: IItem[], noMore: boolean; },
    item?: IItem & { _first?: boolean; _price?: number;},
  ) => {
    // api2906 不满足用户查单个商品的拍卖状态

    if (item) {
      if (item._first) {
        result?.list.forEach(ele => {
          if (ele.uuid === item.uuid && ele.aucUser && ele.auction) {
            // 手动 领先
            ele.aucUser.auctionStatus = 1
            ele.auction.lastAucPrice = item._price
          }
        })
        return Promise.resolve(result)
      }
      const r = await api2906({uuid: item.uuid})
      result?.list.forEach(ele => {
        if (ele.uuid === item.uuid && ele.auction) {
          // 更新截拍时间
          ele.auction.endTime = r?.endTime
          ele.auction.status = r?.status
        }
      })
      return result
    }

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize =  result?.pageSize || 15

    const res = await api2396({
      pageNo,
      pageSize,
      queryType: currentStatus,
    })
    const list = (result?.list || []).concat(res?.data || [])
    return {
      list,
      total: res?.total || 0,
      pageNo,
      pageSize,
      noMore: list.length >= res?.total,
    }

  }, [currentStatus])

  const {data, run, loading, reset, refresh} = useRequest(xService, {
    debounceInterval: 100,
    manual: false,
  })

  const loadMore = () => run(data)
  const reload = () => {
    reset()
    run(undefined)
  }

  // useDidShow(() => {
  //   console.log('useDidShow')
  //   reload()
  // })

  const openPay = (data: IItem) => {
    setCurrentItem(data)
    setVisibles({
      ...visibles,
      PayFeePopup: true
    })
  }

  const openOneMore = (data: IItem) => {
    // 拉起 出价
    setCurrentItem(data)
    setTimeout(() => {
      setVisibles({
        ...visibles,
        binding: true,
      })
    }, 0);
  }

  const handlePay = async (payType) => {
    const service = () => api2652({
      orderNo: currentItem.aucOrder?.orderNo,
      payType,
    })

    return paySdk(service, payType).then((res) => {
      reload()
    }).catch(({err, res}) => {
      // TODO: 验签失败 提示
      // TODO: 取消支付 停留当前页面
    })
  }

  useEffect(() => {
    const updateListData = () => {
      const alist = (data?.list || []).map((item: IItem) => {
        // 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已评价；5->已关闭；6->无效订单
        const orderStatus = item.aucOrder?.status
        // 0:竞拍中1:已截拍2:已流拍3:竞拍失败,
        const status = item.auction?.status
        // 0:出局1:领先2:待支付3:已支付
        const userAuctionStatus = item.aucUser?.auctionStatus
        let iconText = ''
        // 剩余支付时间
        let leftPayTime = ''
        if ((userAuctionStatus === 0 && status === 0) || status === 1 || userAuctionStatus === 1) {
          const a = countDownTimeStr(new Date(item.auction?.endTime || '').getTime(), timeDifference)
          iconText = a === null ? '' : `距截拍 ${a.hh}:${a.mm}:${a.ss}`
          if (!a && status === 0) {
            run(data, item)
          }
        }

        if (userAuctionStatus === 2 || userAuctionStatus === 3) {
          iconText = '已中拍'
          if (orderStatus === 0) {
            // 截拍时间 + 48h
            const a = new Date(item.aucOrder?.operateTimeout || 0).getTime()
            const r = countDownTimeStr(a, timeDifference)
            leftPayTime = r ? `${r?.hh}:${r.mm}:${r.ss}` : ''
          }
        }

        if (status === 1) {
          iconText === '已截拍'
        }
        if (status === 3) {
          iconText = '竞拍失败'
        }
        return {
          ...item,
          iconText,
          leftPayTime,
        }
      })

      setList(alist)
    }
    clearInterval(timerRef.current)
    timerRef.current = setInterval(updateListData, 1000)
    updateListData()
  }, [data])

  // useDidShow(() => {
  //   reload()
  // })

  useEffect(() => {

    globalConfig()
    .then(res => {
      timeDifference = res.timeDifference
    })

    return () => {
      console.log('页面离开')
      clearInterval(timerRef.current)
    }
  }, [])

  useDidHide(() => {
    console.log('页面离开')
    clearInterval(timerRef.current)
  })

  const descTitle = useMemo(() => {
    if (currentStatus === BUYER_AUCT_STATUS.got.value) {
      return `请在48小时内支付待支付拍品`
    } else {
      return `最近7天参拍记录`
    }
  }, [currentStatus])

  const Row = useCallback(({data, index}) => {
    return <Item data={data[index]} onOneMore={openOneMore} onPay={openPay} />
  }, [data])

  return <View className='auctionHistories'>
    <View className='auctionHistories-header'>
      <Tabs
        options={opts}
        composition={1}
        value={currentStatus}
        onChange={async (v) => {
          setCurrentStatus(v)
          // 兼容小程序 值更新异步
          await sleep(0)
          reload()
        }}
      ></Tabs>
    </View>
    <View className="auctionHistories-content">
    <View className='auctionHistories-content__title'>{descTitle}</View>
      <VirtualScrollList
        subHeight={getRealSize(168)}
        itemSize={getRealSize(252)}
        data={{ list, total: data?.total }}
        listStatus={{
          noMore: data?.noMore,
          loading: loading,
        }}
        row={Row}
        loadMore={loadMore}
    />
    </View>

    {/* <ScrollView
      className='auctionHistories-content'
      scrollY
      onScrollToLower={loadMore}
    >
      <View className='auctionHistories-content__title'>{descTitle}</View>
      {
        list.map(item => <Item
          data={item}
          key={item.uuid}
          onPay={openPay}
          onOneMore={openOneMore}
        />)
      }
      <View>
        {
          data?.list.length > 0 && (
            noMore ? <NoMore /> : <LoadingView visible />
          )
        }
      </View>
      <View>
        {
          data?.list.length === 0 && (
            <View>
              <Empty src={NO_CANPAI} text='暂无参拍记录' style={{ marginTop: '60px' }} />
            </View>
          )
        }
      </View>
    </ScrollView> */}

    <PayFeePopup
      disableYUEPay
      visible={visibles.PayFeePopup}
      onVisibleChange={(v) => setVisibles({...visibles, PayFeePopup: v})}
      fee={currentItem.auction?.lastAucPrice || 0}
      feeType='buy'
      title='支付'
      onSubmit={handlePay}
    ></PayFeePopup>
    <Popup
      visible={visibles.binding}
      onVisibleChange={(binding) => setVisibles({...visibles, binding})}
      title=""
      headerType="close"
    >
      {
        visibles.binding && <Bidding uuid={currentItem.uuid} onPay={topay}></Bidding>
      }
    </Popup>
  </View>
}
