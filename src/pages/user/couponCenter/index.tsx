

import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import api4668, { IResapi4668 } from "@/apis/21/api4668";

import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView"
import { ScrollView } from "@tarojs/components";
import Empty from "@/components/Empty";
import { empty } from "@/constants/images";
import dayjs from "dayjs";
import api4724, { IReqapi4724 } from "@/apis/21/api4724";
import ListItem from "@/components/ListItem";
import { useDebounceFn, useRequest } from 'ahooks'
import compose, { formatMoeny, fen2yuan, BwTaro, dealName, queryUrlParams } from "@/utils/base";
import RedBagRules from "@/pages/order/components/RedBagRules";
import BwModal from "@/components/Modal";
import NavigationBar, { SingleBackBtn, BackAndHomeBtn } from "@/components/NavigationBar";
import Tabs from "@/components/Tabs";
import { CouponItem } from "@/pages/order/components/Coupons";
// import api4832, {IResapi4832} from "@/apis/21/api4832";
import api4814, { IResapi4814 } from "@/apis/21/api4814";
import api4884 from "@/apis/21/api4884";
import api4926 from "@/apis/21/api4926";
import './index.scss'
import { DEVICE_NAME, isAppWebview,SENDSTAMPS_USETIME_LIST } from "@/constants";


type IredListIt = Required<Required<IResapi4668>['data']>['data'][0]

interface IredListItem {
  item: IredListIt
}
type IcouponData = Required<Required<IResapi4814>['data']>['data']

function List() {
  const [countInfo, setCountInfo] = useState()
  const [ruleVisible, setRulesVisible] = useState<boolean>(false)
  const [option, setOption] = useState([
    { label: '红包', value: 1 },
    { label: '优惠券(0)', value: 2 },
  ])
  const [couponTab, setCouponTab] = useState([
    { label: '未使用', value: 0 },
    { label: '已使用', value: 1 },
    { label: '已过期', value: 2 },
  ])
  const [currentvalue, setCurrentValue] = useState<number>(0)
  const [pageTabCurrent, setPageCurrent] = useState(1)
  useEffect(() => {
    (async () => {

      const countCoupon = await api4884();
      setOption([
        { label: '红包', value: 1 },
        { label: `优惠券(${countCoupon?.notUseCount})`, value: 2 },
      ])
      const countInfoRes = await api4926();
      setCountInfo(countInfoRes)
    })()
  }, [])

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15
    const fn = pageTabCurrent === 1 ? api4668 : api4814
    const res = await fn({
      pageNo,
      pageSize,
      useStatus: currentvalue

    })
    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [pageTabCurrent, currentvalue])

  const { data, loadMore, reload, loadingMore, noMore, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [pageTabCurrent, currentvalue],
    debounceInterval: 100,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })

  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore
  })
  const getStatus = useCallback((item) => {
    //  如果是现金红包
    if (item.accountType === 1) {
      if (item.status === 1) {
        return <View className="bgYellow">待提现</View>
      } else if (item.status === 6) {
        return <View className="bgYellow">提现中</View>
      } else if (item.status === 2) {
        return <View className="color999">已提现</View>
      } else if (item.status === 5 || item.status === 3) {
        return <View className="color999">已过期</View>
      }

    } else if (item.accountType === 2) {
      if (item.status === 1) {
        return <View className="color999 fz24">
          {dayjs(item?.expireTime).format('YYYY-MM-DD HH:mm')}后过期
        </View>
      } else if (item.status === 2) {
        return <View className="color999 fz24">已使用</View>
      } else if (item.status === 4) {
        return <View className="color999 fz24">部分使用</View>
      } else if (item.status === 5 || item.status === 3) {
        return <View className="color999 fz24">已过期</View>
      }
    }
    return <>

    </>
  }, [])

  const {run:handleClick} = useDebounceFn((item)=>{
    //  过期的 已使用 不需跳转
   if(item?.status ===2 || item?.status ===3 || item?.status===5) return
     //  现金红包 走详情 其他红包： 店铺可用 去店铺主页  全平台可用 去新人专享
    // 1 现金 2 余额accountType
    // useRange 1 全平台可用  2 店铺可用
    if(item?.accountType === 1) {
      Taro.navigateTo({ url: `/pages/active/openRedPacket/detail/index?uuid=${item.uuid}`})
    }
    if(item?.accountType ===2){
      if(item?.useRange ===1){
        Taro.navigateTo({url: '/pages/active/newUserShare/index?activityId=1000009'})
      } else if(item?.useRange===2){
        if(isAppWebview){
          WebViewJavascriptBridge.callHandler(
            'openNativePage',
            JSON.stringify({
              page: '/merchant/home',
              params: { merchantId: item?.merchantId },
            })
          )
        }else{
          Taro.navigateTo({url: `/pages/store/index?merchantId=${item?.merchantId}`})
        }
      }

    }
    
   
  
  }, {wait:200})
  const RedListItem = (props: IredListItem) => {
    return <View>
      {/* <ListItem
        left={<View className='redReceived-left'>
          <View className='redReceived-left-store'>
            <View className='redReceived-left-store-name'>{props?.item.shopName}</View>
            {
              props?.item?.receiveType === 2 && <Text className='redReceived-left-store-name-tag'>分享领取</Text>
            }

          </View>
          <View className="redReceived-left-time m-t-10">
            {getStatus(props?.item)}
          </View>
        </View>}
        type={1}
        right={
          <View className='redReceived-right'>
            <View className='redReceived-right-money'>+{compose(formatMoeny, fen2yuan)(props?.item.awardAmount)}</View>
            <View className='redReceived-right-text m-t-10'>{props?.item.accountType === 1 ? '现金红包' : '普通红包'}</View>
          </View>
        }
        icon={null}
       

     /> */}
     <ListItem type={1} icon={null} left={
       <>
       <View  className={`redReceived-left ${(props?.item.status ===3 ||props?.item.status ===2|| props?.item?.status ===5)? 'opacity5':''}`} >
         <View className="redReceived-left-money">
           <Text className="redReceived-left-money-sys">￥</Text>
           <Text className="redReceived-left-money-price">{compose(fen2yuan(props?.item?.awardAmount))}</Text>
         </View>
         <View className="redReceived-left-title">
          <View className="redReceived-left-title-name">
            {
              props?.item?.useRange ===1 && '全平台可用'
            }
            {
              props?.item?.useRange ===2 && `限${dealName(props?.item?.shopName,8)}使用`
            }
          </View>
          <View className="redReceived-left-title-tip">
            {getStatus(props?.item)}
          </View>
         </View>
       </View>
       </>
     } 
     handleClick={()=>handleClick(props.item)}
     right={

    (props?.item?.status === 1 || props.item?.status ===4 )&& <View className="redReceived-right-btn">立即使用</View>
      
     }
    // right= 
     />
     
    </View>
  }
   const HandleImmediateUseRed = (item)=>{
    console.log(item, 'item');
    if(!item.h5Url){
      if(isAppWebview){
        WebViewJavascriptBridge.callHandler(
          'openNativePage',
          JSON.stringify({ page: '/home' }),
        )
        return
      } else {
        BwTaro.navigateTo({url:'/pages/index/index'})
      }
    } else {
      let isToMerchant = item.h5Url.includes('pages/store/index')
      let params = queryUrlParams(item?.h5Url)
      let [,toPage] =  item.h5Url.split('/pages')
      if(isToMerchant){
        if(isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'openNativePage',
            JSON.stringify({ page: '/merchant/home', params: {merchantId: params?.merchantId} } )
          )
        }
      }
      // 如果不是去店铺首页 就都在 h5 环境内
      if(!isAppWebview){
        Taro.navigateTo({
          url: `/pages${toPage}`
        })
      }
    }
    
   }

  return <ScrollView
    className='redReceived'
    onScrollToLower={loadMore}

    scrollY

  >
    <NavigationBar background="#ffffff" leftBtn={<BackAndHomeBtn></BackAndHomeBtn>} title={'红包卡券'}></NavigationBar>
    <Tabs options={option}
      value={pageTabCurrent}
      composition={1}
      onChange={(v) => setPageCurrent(v)}

    ></Tabs>

    {
      pageTabCurrent === 1 && <>  <View className='redReceived-count'>
        {/* <View className='redReceived-count-totalText'>共收到<Text className='redReceived-count-totalText-money'> {countInfo?.totalCount}</Text>个红包</View> */}
        <View className="redReceived-count-totalText">红包金额</View>
        <View className='redReceived-count-totalMoney'>￥{compose(formatMoeny, fen2yuan)(countInfo?.totalAmount)}</View>
      </View>
        <View className="redReceived-tipBox">无门槛，多个普通红包金额叠加使用抵扣 <Text className="myIcon fz30" onClick={() => setRulesVisible(true)}>&#xe759;</Text></View>
        <View className='redReceived-list'>
          {data?.list.map((item, index) => {
            return <RedListItem item={item} key={index}></RedListItem>
          })}
        </View></>
    }
    {
      pageTabCurrent === 2 && <>
        <View className="redReceived-coupon">
          <View className="redReceived-coupon-tab">
            {
              couponTab?.map((tabItem, index) => {
                return <>
                  <View key={index} className={`redReceived-coupon-tab-item ${currentvalue === index ? 'redReceived-coupon-tab-itemActive' : ''}`} onClick={() => setCurrentValue(index)}>{tabItem?.label}</View>
                </>
              })
            }
          </View>
          {
            data?.list.length > 0 && <>
              <View className="redReceived-coupon-tabList">

                {
                  data?.list.map((item, index) => {
                    return <> <CouponItem
                      key={index}
                      disabled={currentvalue === 0 ? false : true}
                      currentCoupon={item}
                      Radio={
                        currentvalue === 0 && <View className="redReceived-coupon-tabList-use" onClick={HandleImmediateUseRed.bind(null,item)}>立即使用</View>
                      }
                    />
                    </>
                  })
                }
              </View>
            </>
          }

        </View>
      </>
    }
    <View className="edReceived-coupon-tabList-status">
      {
        listStatus.noMore ? <NoMore /> : null }
      {
        listStatus.empty ? <Empty src={empty}></Empty>: <LoadingView visible={listStatus.loading} /> 
      }
    </View>

    <BwModal
      title='红包规则'
      visible={ruleVisible}
      content={<RedBagRules />}
      type='alert'
      onClose={() => { setRulesVisible(false) }}
      onCancel={() => { setRulesVisible(false) }} />

  </ScrollView>
}





export default List