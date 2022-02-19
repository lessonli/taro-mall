import api1668, { IResapi1668 } from "@/apis/21/api1668"
import api1916, { IResapi1916 } from "@/apis/21/api1916"
import api2004 from "@/apis/21/api2004"
import api2652 from "@/apis/21/api2652"
import api4718 from "@/apis/21/api4718"
import Empty from "@/components/Empty"
import NavigationBar, { navigationBarInfo, navigationBarPageStyle, SingleBackBtn } from "@/components/NavigationBar"
import PayFeePopup from "@/components/PayFeePopup"
import paySdk from "@/components/PayFeePopup/paySdk"
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView"
import Tabs from "@/components/Tabs"
import { ORDER_STATUS, PAY_TYPE, PRIMARY_COLOR, RETURN_STATUS , DEVICE_NAME} from "@/constants"
import { empty } from "@/constants/images"
import compose, { formatMoeny, getRealSize, fen2yuan, deepClone } from "@/utils/base"
import storge, { session } from "@/utils/storge"
import { View, ScrollView, Image, Text } from "@tarojs/components"
import { useRequest } from "ahooks"
import { useCallback, useMemo, useState, useEffect } from "react"
import { AtButton } from "taro-ui"
import Taro from "@tarojs/taro";

import "./index.scss";
import { XImage } from "@/components/PreImage"
import { useWxShare } from "@/utils/hooks"
import { useDidShow } from "@tarojs/runtime"
import ChoosePay from "@/components/PayFeePopup/ChoosePay"
import RewardModal from "../components/RewardModal"
import { sleep } from "@/utils/cachedService"
import api2660 from "@/apis/21/api2660"
import api4722 from "@/apis/21/api4722"
import { useRef } from "react"

type IBuyerOrder = Required<Required<IResapi1668>['data']>['data'][0]
type IMerchantOrder = Required<Required<IResapi1916>['data']>['data'][0]

const opts = {
  waitPay: ORDER_STATUS.waitPay,
  waitDispatch: ORDER_STATUS.waitDispatch,
  hasDispatch: { ...ORDER_STATUS.hasDispatch, label: '待收货' },
  hasReceive: { ...ORDER_STATUS.hasReceive, label: '待评价' },
  all: { label: '全部', value: '' },
}

const options = Object.keys(opts).map(key => opts[key])

type IBtnName = '查看订单' | '立即发货' | '立即发货' | '物流查询' | '查看物流' | '去评价' | '确认收货' | '立即支付' | '提醒支付' | '售后详情'

const OrderItemCard = (props: {
  data: IBuyerOrder & IMerchantOrder;
  userCurrentPosition: 'buyer' | 'merchant';
  onBtnClick: (name: IBtnName, data: IBuyerOrder & IMerchantOrder) => void;
  onSubmitSuccess: any;
}) => {

  const { data } = props

  const isBuyer = props.userCurrentPosition === 'buyer'

  const toMerchant = () => {
    isBuyer && Taro.navigateTo({
      url: `/pages/store/index?merchantId=${data.merchant?.id}`
    })
  }

  const toOrder = () => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?orderNo=${data.uuid}`
    })
  }

  const Btn = (aprops) => <AtButton {...aprops} size="small" onClick={() => props.onBtnClick(aprops.children, data)} />

  return <View className="OrderItemCard">
    <View className="OrderItemCard-header">
      <View className="OrderItemCard-header-l" onClick={toMerchant}>
        {/* x-oss-process=image/resize,w_100/quality,q_80 */}
        <XImage src={isBuyer ? data.merchant?.icon : data.user?.icon} query={{ 'x-oss-process': 'image/resize,w_120/quality,q_100' }} className={`OrderItemCard-header-l--img ${!isBuyer ? 'OrderItemCard-header-l--round' : ''}`} />
        <Text className="OrderItemCard-header-l--name">{isBuyer ? data.merchant?.name : data.user?.name}</Text>
        {/* <Image src="2" className="OrderItemCard-header-l--level" /> */}
      </View>

      <Text className="OrderItemCard-header-r">
        {data.statusStr}
        {/* {
          !data.returnStatus || data.returnStatus === RETURN_STATUS.none.value && <>
            { isBuyer && data.status === ORDER_STATUS.waitPay.value && '待付款' }
            { !isBuyer && data.status === ORDER_STATUS.waitPay.value && '待买家付款' }

            { data.status === ORDER_STATUS.waitDispatch.value && '待卖家发货' }

            { isBuyer && data.status === ORDER_STATUS.hasDispatch.value && '待收货' }
            { !isBuyer && data.status === ORDER_STATUS.hasDispatch.value && '待买家收货' }

            { isBuyer && data.status === ORDER_STATUS.hasReceive.value && '待评价' }
            { !isBuyer && data.status === ORDER_STATUS.hasReceive.value && '待买家评价' }

            { data.status === ORDER_STATUS.hasNote.value && '交易完成' } 
          </>
        } */}

        {/* 售后 */}
        {/* { data.returnStatus === RETURN_STATUS.ing.value && '售后中' }
        { data.returnStatus === RETURN_STATUS.end.value && '退款/退货退款' } */}
      </Text>
    </View>

    <View className="OrderItemCard-product" onClick={toOrder}>
      <XImage src={data.productIcon}
        query={{ 'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(180) * 2)}` }}
        className="OrderItemCard-product-l" />
      <View className="OrderItemCard-product-r">
        <View className="OrderItemCard-product-r-name">{data.productName}</View>
        <View className="OrderItemCard-product-r-nums">
          <View className="OrderItemCard-product-r-nums-l">
            <Text className="OrderItemCard-product-r-nums-l__price">￥ {compose(formatMoeny, fen2yuan)(data.productPrice)}</Text>
            {/* {
              !isBuyer && (
                <Text className="OrderItemCard-product-r-nums-l__earn color-primary">赚 {compose(formatMoeny, fen2yuan)(data.distPercent * data.productPrice / 100)}</Text>
              )
            } */}

          </View>
          <Text className="OrderItemCard-product-r-nums-r">x{data.productQuantity}</Text>
        </View>
      </View>
    </View>

    {
      true && <View className="OrderItemCard-footer">
        <View className="OrderItemCard-footer-1">
          <Text className="OrderItemCard-footer-1__1">共 {data.productQuantity} 件商品</Text>
          <Text className="OrderItemCard-footer-1__2">
            合计：<Text className="color-primary unit-money">￥</Text> <Text className="color-primary fz24">{compose(formatMoeny, fen2yuan)(data.payAmount)}</Text>
          </Text>
        </View>
        <View className="flex OrderItemCard-footer-btns">
          <View>
            {
              isBuyer && data.status === ORDER_STATUS.waitDispatch.value && <Btn>查看订单</Btn>
            }

            {isBuyer && <>
              {/* { data.status === ORDER_STATUS.waitPay.value && <Btn type="secondary" >私信卖家</Btn> } */}
              {/* 统一到订单详情页支付 */}
              {/* {data.status === ORDER_STATUS.waitPay.value && <Btn type="secondary">立即支付</Btn>} */}
              {data.status === ORDER_STATUS.hasDispatch.value &&
                data.returnStatus !== RETURN_STATUS.ing.value &&
                <>
                  <Btn>物流查询</Btn>
                  <Btn type="secondary">确认收货</Btn>
                </>}
              {
                data.status === ORDER_STATUS.hasReceive.value && <Btn type="secondary">去评价</Btn>
              }

            </>}
            {
              !isBuyer && <>
                {/* {data.status === ORDER_STATUS.waitPay.value && <Btn>提醒支付</Btn>} */}
                {/* {data.status === ORDER_STATUS.waitPay.value && <Btn>私信买家</Btn>} */}
                {
                  data.status === ORDER_STATUS.waitDispatch.value &&
                  data.returnStatus !== RETURN_STATUS.ing.value &&
                  <Btn type="secondary">立即发货</Btn>}
                {data.status === ORDER_STATUS.hasDispatch.value && <Btn>查看物流</Btn>}
              </>
            }
            {/* {
              data.returnStatus === RETURN_STATUS.ing.value && <Btn>售后详情</Btn>
            } */}
          </View>
        </View>
      </View>
    }

  </View>
}

export default () => {
  const ins = Taro.getCurrentInstance()
  const paramsStatus = ins.router?.params.status

  const searchQueries = useRef(deepClone(session.getItem('pages/order/search/index') || {})).current
  
  useEffect(() => {
    session.resetItem('pages/order/search/index')
  }, [])
  console.log('searchQueries', JSON.stringify(searchQueries));
  
  const [status, setStatus] = useState<any>(
    paramsStatus === undefined ? opts.all.value : Number(ins.router?.params.status)
  )

  const userCurrentPosition = session.getItem('userCurrentPosition')
  
  // 从搜索入口跳转 展示搜索结果
  const isSearcher = Object.keys(searchQueries).reduce((res, key) => {
    if (!!searchQueries[key]) {
      res = true
    }
    return res
  }, false)  

  const [visibles, setVisibles] = useState({
    PayFeePopup: false,
  });

  const [currentItem, setCurrentItem] = useState<IMerchantOrder & IBuyerOrder>();

  const [reward, setReward] = useState<number>()
  const [rewardVisible, setRewardVisible] = useState<boolean>(false)

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15

    let res

    if (isSearcher) {
      res = await api4722({
        ...searchQueries,
        pageNo,
        pageSize,
      })
    } else {
      const fn = userCurrentPosition === 'buyer' ? api1668 : api1916

      res = await fn({
        status,
        pageNo,
        pageSize,
      })
    }

    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [status, isSearcher, searchQueries])

  const { data, loadMore, reload, loadingMore, noMore, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [status],
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })

  const isEmpty = useMemo(() => {
    return !loading && data?.list.length === 0
  }, [data, loading])

  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore
  })

  useWxShare()

  const handleClick = async (name: IBtnName, data: IBuyerOrder & IMerchantOrder) => {
    name = name.trim()
    console.log(name)
    if (name === '立即发货') {
      Taro.navigateTo({
        url: `/pages/order/dispatch/index?orderNo=${data.uuid}`
      })
    }
    if (name === '查看订单') {
      Taro.navigateTo({
        url: `/pages/order/detail/index?orderNo=${data.uuid}`
      })
    }

    if (name === '物流查询' || name === '查看物流') {
      storge.setItem('expressIcon', data.productIcon)
      Taro.navigateTo({
        url: `/pages/order/express/detail/index?orderNo=${data.uuid}`
      })
    }

    if (name === '确认收货') {

      // Taro.hideLoading()
      // reload()
      Taro.showModal({
        content: '确认收货后，视为订单完成（售后关闭），系统自动将货款结算至商家。',
        confirmText: '确认收货',
        confirmColor: PRIMARY_COLOR,
        success: (result) => {
          if (!result.confirm) return
          api2004({ orderNo: data.uuid }).then(() => {
            reload()
            // Taro.redirectTo({
            //   url: `/pages/order/result/index?orderNo=${data.uuid}&orderStatus=${ORDER_STATUS.hasReceive}`
            // })
          }).then(async()=>{
            if(DEVICE_NAME === 'weapp') {
              const rewardRes = await api4718({orderId: data.uuid })
              if(rewardRes?.rewardAmount){
                setRewardVisible(true)
                setReward(Number(rewardRes?.rewardAmount))
              }
            }
          })
        }
      })
    }

    if (name === '私信买家') {

    }

    if (name === '提醒支付') {
      // TODO：im
    }

    if (name === '立即支付') {
      // setCurrentItem(data)
      // setVisibles({
      //   ...visibles,
      //   PayFeePopup: true,
      // })
      Taro.navigateTo({
        url: `/pages/order/pay/index?orderNo=${data.uuid}&payAmount=${data.payAmount}`
      })
    }

    if (name === '去评价') {
      Taro.navigateTo({
        url: `/pages/order/evaluation/index?orderNo=${data.uuid}&sourceUrl=${encodeURIComponent(ins.router?.path || '')}`
      })
    }

    if (name === '售后详情') {
      Taro.navigateTo({
        url: `/pages/order/afterSale/detail/index?orderNo=${data.uuid}&orderReturnNo=${data.orderReturnNo}`
      })
    }
  }

  useWxShare()

  useDidShow(() => {
    const { needReload } = session.getItem('pages/order/list/index')
    needReload && reload()
    session.resetItem('pages/order/list/index')
  })

  const h3 = useMemo(() => {
    if (isSearcher) return {
      height: `calc(100% - ${process.env.TARO_ENV === 'h5' ? getRealSize(72) : getRealSize(72) + navigationBarInfo?.navigationBarAndStatusBarHeight}px)`
    }
    return {
      height: `calc(100% - ${process.env.TARO_ENV === 'h5' ? getRealSize(88) : (getRealSize(88) + navigationBarInfo?.navigationBarAndStatusBarHeight)}px - ${userCurrentPosition === 'merchant' ? getRealSize(80) : 0}px)`
    }
  }, [])

  const handlePay = async ({payType, payPassword}) => {
    const fn = payType === PAY_TYPE.WX.value ?
    paySdk(() => api2652({
      orderNo: currentItem?.uuid,
      payType,
    }), payType) :
    api2660({
      orderNo: currentItem?.uuid,
      payType,
      payPassword,
    })

    await fn
    reload()
    Taro.navigateTo({
      url: `/pages/order/payResult/index?orderNo=${currentItem?.uuid}&payAmount=${currentItem?.payAmount}`
    })
  }
  const handleConfirm =()=>{
    setRewardVisible(false)
    Taro.navigateTo({url:'/pages/user/index/accountBalance/index'})
  }

  const SeacherHeader = useCallback(() => {
    const toSearch = () => {
      Taro.navigateTo({
        url: `/pages/order/search/index`
      })
    }
    return <View className="SeacherHeader p-t-16 p-l-24 p-r-24">
      <View className="SeacherHeader-container fz30" onClick={toSearch} >
        <Text className="color333 m-l-24">订单编号<Text className="myIcon">&#xe71e;</Text></Text>
        <Text className="SeacherHeader-container_pla">请输入订单编号</Text>
      </View>
    </View>
  }, [])

  return <View className="orderListPage full-screen-page">
    <NavigationBar
      background="#ffffff"
      title={userCurrentPosition === 'buyer' ? '我的订单' : (
        isSearcher ? '搜索结果' : '店铺订单'
      )}
      leftBtn={<SingleBackBtn onClick={Taro.navigateBack} />}
    />
    {
      !isSearcher && userCurrentPosition === 'merchant' && <SeacherHeader />
    }
    {
      isSearcher ?  <View className="fz26 color999 ordersearcherlist-header">搜索到<Text className="color-primary p-l-4 p-r-4">{data?.total || 0}</Text>笔订单</View> :
      <Tabs
        options={options}
        value={status}
        onChange={setStatus}
      ></Tabs>
    }

    <ScrollView
      className="orderListPage-ScrollView"
      style={h3}
      scrollY
      onScrollToLower={loadMore}
    >
      <View>
        {
          data?.list.map(item => <OrderItemCard
            key={item.uuid}
            data={item}
            userCurrentPosition={userCurrentPosition}
            onBtnClick={handleClick}
          />)
        }
      </View>
      <View>
        {
          listStatus.noMore ? <NoMore /> : null
        }
        {
          listStatus.empty ? (
            <Empty src={empty} text={`暂无${isSearcher ? '相关' : (status === opts.all.value ? '' : Object.keys(opts).map(e => opts[e]).find(e => e.value === status).label)}订单`} className="p-t-80" />
          ) : <LoadingView visible={listStatus.loading} />
        }
      </View>
    </ScrollView>

    {/* <PayFeePopup
      visible={visibles.PayFeePopup}
      onVisibleChange={(v) => setVisibles({ ...visibles, PayFeePopup: v })}
      fee={currentItem?.payAmount || 0}
      title="订单支付"
      headerType="close"
      feeType="buy"
      onSubmit={toPay}
    ></PayFeePopup> */}
    <ChoosePay
      title="订单支付"
      visible={visibles.PayFeePopup}
      onClose={() => setVisibles({...visibles, PayFeePopup: false})}
      payAmount={currentItem?.payAmount || 0}
      onSubmit={handlePay}
    />
    <RewardModal
      visible={rewardVisible}
      title={`${compose(formatMoeny,fen2yuan)(reward)}元下单奖励金额已入账`}
      onClose={()=>setRewardVisible(false)}
      onConfirm={()=> handleConfirm()}
    />
  </View>
}