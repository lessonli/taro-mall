

import Taro from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import { useState, useCallback, useMemo, useEffect } from "react";

import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView"
import ListItem from "@/components/ListItem";
import Empty from "@/components/Empty"
import { putong_red1, xinren_red1, pinshouqo_red1,  } from "@/constants/images";
import api4660 from "@/apis/21/api4660"; // 红包记录

import { useRequest } from "ahooks"
import { empty } from "@/constants/images";
import compose, { fen2yuan, formatMoeny } from "@/utils/base";
import dayjs from "dayjs";

import './index.scss'
import { XImage } from "@/components/PreImage";


function List() {

  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15
    const res = await api4660({

      pageNo,
      pageSize,
    })

    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [])

  const { data, loadMore, reload, loadingMore, noMore, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [],
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })
  const listStatus = useListStatus({
    list: data?.list || [],
    loading, 
    noMore
  })


  const leftImagAndTitltMap = new Map([
    [1, {src: xinren_red1, title: '新人红包',}, ],
    [2, { src: putong_red1, title: '普通红包', } ],
    [3, {src: pinshouqo_red1, title: '拼手气红包',}]
  ])

  const getRedPacketStatus2Text= (item)=>{
    if(item?.status === 2){
      return <>
        <Text>已领完</Text>
      </>
    }
    if(item?.status === 3){
      return <>
        <Text>已过期</Text>
      </>
    }
    if(item?.status ===1 ){
      return <>
        <View className="rightTextColor">待领取{item?.leftCount}/{item?.totalCount}</View>
      </>
    }
  }

  const ListLeft = ({ item }) => {
    // 0 待支付 1 待领取 2 已领完 3 已过期
    // 1-新人红包2-普通红包3-拼手气红包 amountStrategy	
    return <View className='redPacket-send-list-left'>
      <View className="redPacket-send-list-left-imgBox">
        <XImage className="redPacket-send-list-left-imgBox-img" src={leftImagAndTitltMap.get(item?.amountStrategy)?.src}></XImage>
      </View>
      <View className="redPacket-send-list-left-text">
        <View className="redPacket-send-list-left-text-name">{leftImagAndTitltMap.get(item?.amountStrategy)?.title}</View>
        <View className="redPacket-send-list-left-text-time">{dayjs(item?.payTime).format("MM-DD HH:mm:ss")}</View>
      </View>

    </View>
  }

  console.log(data, 'data');

  return <ScrollView
    className='redPacket-send-scrollview'
    scrollY
    onScrollToLower={loadMore}
  >
    <View className='redPacket-send'>
      <View className='redPacket-send-list'>
        {
          data?.list.map((item, idx) => {
            return <View key={item?.uuid}>
              <ListItem
                type={1}
                icon={null}
                handleClick={() => Taro.navigateTo({ url: `/pages/active/redPacket/detail/index?uuid=${item.uuid}` })}
                left={<ListLeft item={item}></ListLeft>}
                right={<View className='redPacket-send-list-right'>
                  <View className="redPacket-send-list-right-money">{compose(fen2yuan(item?.totalAmount))}元</View>
                  <View className="redPacket-send-list-right-money-status">
                    {getRedPacketStatus2Text(item)}
                  </View>
                </View>
                }
              ></ListItem>
            </View>
          })
        }
      </View>
      <View>
        {
          listStatus.noMore ? <NoMore /> : null
        }
        {
          listStatus.empty ? (
            <Empty src={empty} text='暂无红包' className='p-t-80' />
          ) : <LoadingView visible={listStatus.loading} />
        }
      </View>

    </View>
  </ScrollView>
}

export default List