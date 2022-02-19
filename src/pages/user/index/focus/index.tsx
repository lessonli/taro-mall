import Taro from '@tarojs/taro';
import { View, Text, ScrollView, Image } from '@tarojs/components'
import api2900,{IResapi2900}  from '@/apis/21/api2900'
import { useCallback, useState , useEffect} from 'react';
import { useRequest } from "ahooks";
import { SHOP_AUTH_TAGS } from '@/constants';
import Empty from '@/components/Empty';
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import api2884 from '@/apis/21/api2884'; // 关注接口
import api2892 from '@/apis/21/api2892'; // 取消接口
import { paimai, empty,VIP } from '@/constants/images';
import { isAppWebview } from '@/constants';
import Label from '@/components/Label';


export type Iprop = Required<IResapi2900>['data']
import './index.scss'
import { useDidShow } from '@tarojs/runtime';


function Focus(){
  const xservice = useCallback(((async( result, 
    itemData)=>{
      const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
      const pageSize =  result?.pageSize || 15
      if(itemData?._update){        
        const list = (result?.list || []).map((item,index)=>{
          if (index === itemData.idx) {
            return {
              ...item,
              ...itemData,
            }
          }
          return item
        })
        return Promise.resolve({
          ...(result || {}),
          list,
        })
      }
          // 防止最后一页了
    if (result?.prevList.length === 0) return Promise.resolve(result)


    const res = await api2900({
      pageNo, 
      pageSize,
    })
    const clist = res?.data || []
    return {
      prevList: clist,
      list: (result?.list || []).concat(clist),
      // lastId: clist.length > 0 ? clist[clist.length - 1].uuid : '',
      total: res?.total,
      pageNo
      // pageSize,
    }
    }
    
   
  )),[])


const  {data, run, reset, loading} = useRequest(xservice, {
  // manual: true,
  
})
const listStatus = useListStatus({
  list: data?.list || [],
  loading,
  noMore: (data?.list || []).length >= data?.total && !loading
})





// useDidShow(() => {
//   reset()
//   run()
// })



  // const service = useCallback(async (
  //   result?: { pageNo: number, pageSize: number }
  // ) => {
  //   const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
  //   const pageSize =  result?.pageSize || 10

  //   const res = await api2900({
  //     pageNo, 
  //     pageSize,
  //   })
  //   return {
  //     list: res?.data,
  //     total: res?.total,
  //     pageNo,
  //     pageSize,
  //   }
  // }, [])


  // const { data, loadMore, reload, loading, noMore, loadingMore, run } = useRequest(service, {
  //   loadMore: true,
  //   refreshDeps: [],
  //   // debounceInterval: 300,
  //   isNoMore: (d) => (d ? d.list.length >= d.total : false),
  // })  



  const handleFocus=(e,itemData)=>{ 
   const {status, item:{merchantNo}} = itemData
    
    if(!status) {
       //关注
       api2884({merchantNo})
       Taro.showToast({
         title: '已关注'
       })
    }
    if(status){
      api2892({merchantNo})
      Taro.showToast({
        title: '已取消'
      })
    }

    run(data, {
      ...itemData,
      _update: true,
    })
    e.stopPropagation()

  } 

  const toMerchantDetail = (merchantNo)=>{
    if(isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'openNativePage',
        JSON.stringify({ page: '/merchant/home', params: {merchantId: merchantNo} } )
      )
    }
    if(!isAppWebview){
      Taro.navigateTo({
        url: `/pages/store/index?merchantId=${merchantNo}`
      })
    }
      
  }
  return(
   <View className='bw-focus'>
     <ScrollView className='bw-focus-scroll-view' scrollY   onScrollToLower={() => {
        !listStatus.noMore &&  run(data)
      }}>
       {data?.list.map((item,idx)=>{
       return <View key={item.merchantNo} className='bw-focus-item' onClick ={()=> toMerchantDetail(item.merchantNo)}>
          <View className='bw-focus-item-content'> 
            <View><Image className='bw-focus-item-content-img' src={item.shopLogo}></Image></View>
            <View className='bw-focus-item-content-tit'>
              <View className='bw-focus-item-content-tit-text'>{item.shopName}</View>
              <View className='bw-focus-item-content-tit-approve'>
                <View className='storeModule-header-tags'>
                {item?.shopAuthTags?.map(item => {
                  return <Label src={VIP} key={item} label={SHOP_AUTH_TAGS.get(item).label}></Label>
                })}
          </View>

                {/* <View className='bw-focus-item-content-tit-approve-item'>
                  <Text className='myIcon bw-focus-item-content-tit-approve-item-icon'>&#xe72b;</Text>
                  <Text>食品许可</Text>
                </View> */}
              </View>
            </View>
          </View>
          {!(item?.status)? <View className='bw-focus-item-focus' onClick={(e)=>handleFocus(e,{item, idx, status:true})}>已关注</View>:<View onClick={(e)=>handleFocus(e,{item, idx, status:false})} className='bw-focus-item-focus bw-focus-item-isfocus '>关注</View>}
       </View>
       })}
       
       <View>
          {/* {
            listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
          } */}
          {
            listStatus.empty && <Empty src={empty} text="暂无关注" className="m-t-60" />
          }   
        </View>
     </ScrollView>
   </View>
  )
}

export default Focus