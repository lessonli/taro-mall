
import {useState} from 'react'
import {View, Text, ScrollView} from '@tarojs/components'
import Tabs from "@/components/Tabs";
import Taro from "@tarojs/taro";
import Empty from '@/components/Empty';
import { LoadingView, NoMore, useListStatus } from '@/components/ScrollView';
import { empty } from '@/constants/images';
import { useEffect } from 'react';
import useRequest from 'ahooks';
import api3806, {IResapi3806, IReqapi3806} from '@/apis/21/api3806';
import api3860, {IResapi3860} from '@/apis/21/api3860';
import {BUSINESS_DETAIL_STATUS,} from "@/constants";
import dayjs from 'dayjs';
import './index.scss'

export type Idetail = Required<IResapi3860>['data']
export type Ilist = Required<IResapi3806>['data']

const opts = Object.keys(BUSINESS_DETAIL_STATUS).map(key => BUSINESS_DETAIL_STATUS[key])
function BusinessDetail() {
  const [currentStatus,setCurrentStatus] = useState(BUSINESS_DETAIL_STATUS.fans.value)
  const params = Taro.getCurrentInstance().router?.params
  const [detail, setDetail] = useState<Idetail>()
  const [list, setList] = useState<Ilist>()
  const toPage = (url) => {
    if (!url) return
    Taro.navigateTo({
      url:url
    })
  }
  useEffect(()=>{
    (async()=>{
      const list =  await api3806({type: currentStatus,merchantNo: params.merchantNo})
     
      
      setList(list)
    })()
  },[currentStatus])


  useEffect(()=>{
    (async()=>{
      const res =  await api3860({merchantNo: params.merchantNo})
      setDetail(res)
    })()
  },[])  
  return(
    <>
      <View className='businessDetail-list-item'>
        <View className='businessDetail-list-item-content'>
          <View className='businessDetail-list-item-content-img'>
            <img className='businessDetail-list-item-content-img-imgEle' src={detail?.headImg} alt='' />
          </View>
          <View className='businessDetail-list-item-content-info'>
            <View className='businessDetail-list-item-content-info-name'>{detail?.nickName}</View>
            <View className='businessDetail-list-item-content-info-date'><Text>{dayjs(detail?.displayTime).format('YYYY-MM-DD')}</Text> {dayjs(detail?.displayTime).format('HH:mm:ss')} <Text></Text></View>
          </View>
        </View>
        <View className='businessDetail-list-item-result'>
          <View className='businessDetail-list-item-result-item'>
            <Text className='businessDetail-list-item-result-item-number'>{detail?.privateFansCount}</Text>
            <View>专属粉丝</View>

          </View>
          <View className='businessDetail-list-item-result-item'>
            <Text className='businessDetail-list-item-result-item-number'>{detail?.directSubMerchantCount}</Text>
            <View>邀请商家</View>
          </View>
        </View>

      </View>
      
        <Tabs className='m-t-24' options={opts} composition={1} onChange={setCurrentStatus} value={currentStatus} />
        <View className='businessDetail-tabs'>
          {list?.map((item,index)=>{
           return <View key={index} className='businessDetail-tabs-item'>
              <View className='businessDetail-tabs-item-date'>{dayjs(item?.statisticsDate).format('YYYY-MM-DD')}</View>
              <View className='businessDetail-tabs-item-number'>+ {item.count}</View>
          </View>
          })}
          {list?.length === 0 && <Empty text='暂无数据' src={empty}></Empty> }
      </View>
    </>
  )
}

export default BusinessDetail
