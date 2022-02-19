

import { View, Text, ScrollView } from "@tarojs/components";
import { useCallback, useState, useEffect } from "react";
import Tabs from "@/components/Tabs";
import { FEEDBACK_RECORD_SRATUS, FEEDBACK_TYPE } from "@/constants";
import ListItem from "@/components/ListItem";
import dayjs from "dayjs";
import api4418 from "@/apis/21/api4418";
import { useRequest } from "ahooks";
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView"
import Empty from "@/components/Empty";
import { empty } from "@/constants/images";
import Taro from "@tarojs/taro";


const opts = Object.keys(FEEDBACK_RECORD_SRATUS).map(key => FEEDBACK_RECORD_SRATUS[key])

import './index.scss'

type IItem = {
  data: {
    content: string,
    gmtCreate: string | number,
    image: string,
    type: 0 | 1 | 2,
    uuid: string
  }
}

const Item = (props: IItem) => {
  const { data } = props

  return (
    <View className='feedback-record-list-item'>
      <View className='feedback-record-list-item-box'>
        <Text className='feedback-record-list-item-box-tit'>{`[${FEEDBACK_TYPE[data.type]}]`}</Text>
        <View className='feedback-record-list-item-box-content'>{data.content}</View>
      </View>
      <View className='feedback-record-list-item-date'>
        <Text>{dayjs(data.gmtCreate).format('YYYY-MM-DD')}</Text> <Text>{dayjs(data.gmtCreate).format('HH:mm:ss')}</Text>
      </View>
    </View>
  )
}

function RecordList() {
  const [currentValue, setCurrentValue] = useState(0)

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15

    const res = await api4418({
      pageNo,
      pageSize,
      status: currentValue
    })

    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }

  }, [currentValue])

  const { data, loadMore, loadingMore, loading, noMore } = useRequest(service, {
    loadMore: true,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    refreshDeps: [currentValue]
  })
  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore
  })

  return <>
   <View className='full-screen-page'>
   <Tabs options={opts} value={currentValue} onChange={(v) => setCurrentValue(v)}></Tabs>
    <ScrollView scrollY onScrollToLower={loadMore} className='bw-record-Scrollview'>
      <View className='m-t-24 feedback-record-list'>
        {data?.list.map((item => {
          return <ListItem key={item.uuid} handleClick={()=>Taro.navigateTo({url: `/pages/user/feedback/detail/index?uuid=${item.uuid}`})} left={<Item data={item} ></Item>} icon={null}></ListItem>
        }))}
      </View>
      <View>
        {
          listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
        }
        {
          listStatus.empty && <Empty src={empty} text='暂无反馈' className='m-t-60' />
        }
      </View>
    </ScrollView>
   </View>

  </>

}

export default RecordList