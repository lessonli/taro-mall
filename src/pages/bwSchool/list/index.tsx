
import Taro, { useShareAppMessage } from '@tarojs/taro';
import {ScrollView} from '@tarojs/components';
import { View, Text, Image } from '@tarojs/components';
import {useState, useCallback,useEffect, useMemo } from "react";
import NavigationBar from '@/components/NavigationBar';
import Tabs from "@/components/Tabs";
import { useRequest } from "ahooks";
import SchoolItem from "./components/SchoolItem";
import { cachedWxConfig, useWeappUrlChannelHook } from '@/utils/hooks';
import api2868 from '@/apis/21/api2868';
import api2852, {IReqapi2852, IResapi2852} from '@/apis/21/api2852';
import Empty from '@/components/Empty';
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import './index.scss'
import api3554 from '@/apis/21/api3554';
import { XImage } from '@/components/PreImage';
import { BWYD_ICON, weixin} from '@/constants/images';
import { isAppWebview } from '@/constants';
import ShareBottom from './components/bwShareBottom';
import { host } from '@/service/http';
import { useRef } from 'react';

export type IItem = Required<Required<IResapi2852>['data']>
function BwSchool() {
  const [tableKey, setTableKey] = useState<number>()
  const [menuList, setMenuList] = useState<any>([])
  const [shareVisible, setVisible] = useState(false)
  const [isAppShareData, setAppShareDate] = useState()
  const tabChange = useCallback((value) => {
    setTableKey(value)
  }, [])

  const sharePromise = useRef(undefined)

  useEffect(()=>{
    (async ()=>{
      const menuList = []
      const tabList = await api2852()
      tabList?.forEach(item=>{
        menuList.push({label: item.name, value: item.id})
      })
      
      setMenuList(menuList)
      setTableKey(menuList[0]?.value)
    })()
  }, [])

  useEffect(()=>{
    (async()=>{
      sharePromise.current = api3554({shareType: 5})
      const data = await sharePromise.current
      console.log('sharePromise data', data)
      const shareData = {
        title: '博物商学院',
        desc: data?.subTitle,
        link: data?.shareUrl,
        imgUrl: BWYD_ICON,
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      }
      setAppShareDate(shareData)
      cachedWxConfig().then(wx=>{ 
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)
        
      })
    })()
  },[])

  useShareAppMessage(async () =>{
    const res = await sharePromise.current
    return {
      title: '博物商学院',
      path: res?.shareUrl?.replace(host, ''),
      imageUrl: BWYD_ICON,
    }
  })

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize =  result?.pageSize || 6

    const res = await api2868({
      categoryId: tableKey,
      pageNo, 
      pageSize,
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [tableKey])


  useEffect(() => {
    tableKey && reload()
  }, [tableKey])

  useWeappUrlChannelHook()

  const handle =(uuid:string)=>{
    const htmlUrl = `${host}/pages/bwSchool/detail/index?uuid=${uuid}`
   Taro.navigateTo({
     url: `/pages/webview/index?url=${encodeURIComponent(htmlUrl)}`
   })
    
  }
  const { run, data, reload, loading,loadMore, noMore  } = useRequest(service, {
    loadMore: true,
    manual: true,
    // refreshDeps: [tableKey],
    // debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })
  const listStatus = useListStatus({
    list: data?.list,
    loading,
    // noMore,
    noMore: (data?.list || []).length >= data?.total && !loading
  })


  return(
    <View className='full-screen-page'>
      {/* <NavigationBar
        title='博物学院'
        background='#ffffff'
      /> */}
      <ShareBottom
        shareData={isAppShareData}
        visible={shareVisible} 
        onClose={()=>setVisible(false)} 
      ></ShareBottom>
      <Tabs options={menuList} composition={1} value={tableKey} onChange={tabChange} />
      <ScrollView 
        scrollY
        onScrollToLower={loadMore}
        className='bw-school-scrollview'
      >
          <View>
            {
              data?.list.map((item) => {              
                return <SchoolItem key={item.uuid} data={item} productType={1} handle={()=>handle(item.uuid)} />
              })
            }
          </View>
           <View>
            {
              listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
            }
            {
              listStatus.empty && <Empty src={''} text="暂无文章" className="m-t-60" />
            }
          
          </View>
        </ScrollView>
        <View className='poster-share'>
          <Image className='poster-share-img' src={weixin} onClick={()=>setVisible(true)} />
        </View>
    </View>
  )
}

export default BwSchool
