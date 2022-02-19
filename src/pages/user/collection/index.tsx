import Taro from '@tarojs/taro';
// TODO: 瀑布流 足迹 后期走接口
import CommodityFoot from './CollectCommodityModule'
import Commodity from '@/components/CommodityModule';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRequest } from "ahooks";
import {View, Text, ScrollView} from "@tarojs/components"
import './index.scss'
import Empty from '@/components/Empty';
import { LoadingView, NoMore, useListStatus } from '@/components/ScrollView';
import { empty } from '@/constants/images';
import api2332 from '@/apis/21/api2332';
import NavigationBar, {SingleBackBtn} from '@/components/NavigationBar';
import { foorPrints } from '@/utils/storge';

function Collection(){
  const [pageNo, setPageNo] = useState<number>(0)
  const [commodityData, setCommodityData] = useState<[]>([])
  const isCollection = Taro.getCurrentInstance().router?.params.isCollect
  console.log(isCollection, 'isCollection');
  
  const Commdit = isCollection === 'true'? Commodity : CommodityFoot
  const service = useCallback(async (

    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    // const isCollection = Taro.getCurrentInstance().router?.params.isCollect
    console.log( Taro.getCurrentInstance().router?.params);
    
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15

    const fn = isCollection=== 'true'? api2332: foorPrints.getList
    setPageNo(pageNo)
    const res = await fn({
      pageNo,
      pageSize
    })    
    setCommodityData( isCollection=== 'true'? res?.data : res.list )    
    return {
      list:  isCollection=== 'true'? res?.data : res.list ,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [])
  const { data, loadMore, loading,reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  // loadingDelay: 500,
})

const listStatus = useListStatus({
  list: data?.list,
  loading,
  noMore
})

  return  <>
  <NavigationBar leftBtn={<SingleBackBtn />} background='#fff' title={isCollection=== 'true'? '收藏': '足迹'}></NavigationBar>
  <ScrollView className='bw-collection-scrollew' scrollY onScrollToLower={loadMore}>
      <View className='bw-collection'>
       { (data.list.length > 0) &&  <Commdit pageNo={pageNo} data={commodityData}></Commdit>}
        {
          // noMore ? <NoMore /> : <LoadingView visible={loadingMore} />
        }
        {
          listStatus.empty && <Empty src={empty} text="暂无数据" className="m-t-60" />
        }
  </View>
  </ScrollView>
  </>

}

export default Collection