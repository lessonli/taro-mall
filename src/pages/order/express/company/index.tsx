import api3458 from "@/apis/21/api3458";
import RadioScrollList, { RadioItem } from "@/components/RadioScrollList";
import { View, Text, Input, ScrollView } from "@tarojs/components";
import { useRequest } from "ahooks";
import { useState, useEffect, useCallback } from "react";
import Taro, { useDidShow } from '@tarojs/taro'

import './index.scss'
import api3536 from "@/apis/21/api3536";
import { addOrgToUrl } from "@/utils/base";
import events from "@/constants/eventBus";
import { session } from "@/utils/storge";

export default () => {

  const page = Taro.getCurrentInstance()

  const [val, setVal] = useState();

  const [name, setName] = useState('');
  
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number },
    // companyName?: string,
  ) => {

    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize =  result?.pageSize || 15

    const res = await api3536({
      pageNo,
      pageSize,
      companyName: name,
    })

    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total,
    }

  }, [name])

  const {data, reload, loadMore, run} = useRequest(service, {
    loadMore: true,
    refreshDeps: [name],
    debounceInterval: 600,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })

  const seacrh = (name) => {
    setName(name)

  }

  const handleChceked = (v, companyName) => {
    setVal(v)
    setTimeout(() => {

      session.setItem('pages/order/express/company/index', {
        companyCode: v,
        companyName,
      })

      Taro.navigateBack()
    }, 200)
  }

  useDidShow(() => {
    const {companyCode, companyName} = session.getItem('pages/order/express/company/index')
    setVal(companyCode || '')
  })

  return <View className="chooseExpressPage full-screen-page">
    <View className="chooseExpressPage-header">
      <Text className="myIcon">&#xe710;</Text>
      <Input className="chooseExpressPage-header-inp" placeholder="输入快递公司名称" value={name} onInput={event => seacrh(event.detail.value)} />
    </View>
    {/* <RadioScrollList 
      className="chooseExpressPage-ScrollView"
      value={val}
      onChange={setVal}
      options={opts}
    /> */}
    <ScrollView
      className="chooseExpressPage-ScrollView"
      scrollY
      onScrollToLower={loadMore}
      lowerThreshold={120}
    >
      {
        data?.list.map(item => {
          return <RadioItem label={item.companyName} value={item.companyCode} checked={val === item.companyCode} onChecked={handleChceked} />
        })
      }
    </ScrollView>
    
  </View>
}