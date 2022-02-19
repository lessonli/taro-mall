
import { View, Text, ScrollView } from "@tarojs/components";
import { useState, useCallback, useEffect } from "react";
import Tabs from "@/components/Tabs";
import { BwTaro } from "@/utils/base";
import { coupons_yijieshu, coupons_yizhongzhi, empty } from "@/constants/images";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { useRequest } from "ahooks";
import { useListStatus } from "@/components/ScrollView";
import compose, { fen2yuan } from "@/utils/base";

import api4930, { IResapi4930 } from "@/apis/21/api4930";
import api4932 from "@/apis/21/api4932";
import dayjs from "dayjs";
import BwModal from "@/components/Modal";
import './index.scss'
import Big from "big.js";
import { SENDSTAMPS_USETIME_LIST } from "@/constants";
import { setWifiList } from "@tarojs/taro";
import { useAsync } from "@/utils/hooks";
import { url } from "@/constants/emoji";
import { AtButton } from "taro-ui";
import Empty from "@/components/Empty";
type IdataItem = Required<Required<IResapi4930>['data']>['data'][0]

interface Iprops {
  data: IdataItem
  // stopSendCoupons:()=>void
}
interface IdataCopy {
  list: Array<IdataItem>
}

function CouponsList() {
  const [current, setCurrent] = useState('1')
  const [dataCopy, setDataCopy] = useState<IdataCopy>()
  const [visible, setVisible] = useState<boolean>(false)
  const [tipVisible, setTipVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<IdataItem>()

  const tabOptions = {
    options: [
      {
        label: '发放中',
        value: '1'
      },
      {
        label: '已失效',
        value: '0,2'
      }
    ],
  }
  const useRange = {
    0: '全场通用',
    1: '指定商品',
    2: '指定店铺',
    3: '指定活动',
    4: '指定分类'
  }
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15
    const a = current.split(',').map(Number)
    const res = await api4930({
      pageNo,
      pageSize,
      publishStatuses: a
    })

    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [current])
  const { run, data, reload, loading, loadMore, noMore } = useRequest(service, {
    loadMore: true,
    manual: true,
    refreshDeps: [current],
    // debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
  })
  const listStatus = useListStatus({
    list: data?.list,
    loading,
    // noMore,
    noMore: (data?.list || []).length >= data?.total && !loading
  })
  useEffect(() => {
    setDataCopy(data)
  }, [data])

  const { run: handleSubmit } = useAsync(async () => {
    try {
      await api4932({ publishStatus: 0, uuid: currentItem?.uuid })
      let currentIndex = dataCopy?.list?.findIndex((item) => item.uuid === currentItem?.uuid)
      dataCopy?.list?.splice(currentIndex, 1);
      setDataCopy(dataCopy)
      setTipVisible(false)
    } catch (error) {

    }
  }, { manual: true })


  console.log(dataCopy?.list, '  dataCopy?.list');

  useDidShow(() => {
    current == '0,2' && setCurrent('1');
    current === '1' && run()
  })
  useEffect(() => {
    current && reload()
  }, [current])
  const CouponsItem = (props: Iprops) => {
    return <View className="couponsItemBox-couponsItem">
      <View className="couponsItemBox-couponsItem-top">
        <View className="couponsItemBox-couponsItem-top-left">
          {
            props?.data?.grantType === 1 && <>
              <Text className="couponsItemBox-couponsItem-top-left-sys">￥</Text>
              <Text className="couponsItemBox-couponsItem-top-left-money">{fen2yuan(props?.data?.price)}</Text>
            </>
          }
          {
            props?.data?.grantType === 2 && <>
              <Text className="couponsItemBox-couponsItem-top-left-money">
                {
                  new Big((props?.data?.price))
                    .div(10)
                    .toNumber()
                }
              </Text>
              <Text className="couponsItemBox-couponsItem-top-left-sys">折</Text>

            </>
          }
        </View>
        <View className="couponsItemBox-couponsItem-top-right">
          <View className="couponsItemBox-couponsItem-top-right-name">
            {
              // 优惠券类型 1 金额 2 折扣
              props?.data?.grantType === 1 && `满${fen2yuan(props?.data?.minPoint)}元可用`
            }
            {
              // 优惠券类型 1 金额 2 折扣
              props?.data?.grantType === 2 && `满${fen2yuan(props?.data?.minPoint)}元可用 （最高减${fen2yuan(props?.data?.maxPrice)}元)`
            }
          </View>
          <View className="couponsItemBox-couponsItem-top-right-date">
            领取有效期: {dayjs(props.data?.startTime).format('MM.DD HH:mm')} 至 {dayjs(props.data?.endTime).format('MM.DD HH:mm')}
          </View>
          <View className="couponsItemBox-couponsItem-top-right-date">
            使用有效期: {SENDSTAMPS_USETIME_LIST[props?.data?.duration || 0].label} <Text className="couponsItemBox-couponsItem-top-right-date-detail" onClick={() => { setCurrentItem(props?.data); setVisible(true); }}>查看详情</Text>
          </View>
          {
            current !== '1' && props?.data?.publishStatus === 2 && <View className="couponsItemBox-couponsItem-top-right-watermark_jieshu"></View>
          }
          {
            current !== '1' && props?.data?.publishStatus === 0 && <View className="couponsItemBox-couponsItem-top-right-watermark_zhongzhi"></View>
          }


        </View>
      </View>
      <View className="couponsItemBox-couponsItem-bottom">
        <View>
          已领取 <Text className="tipText">{props?.data?.receiveCount}</Text>/<Text>{props?.data?.publishCount}</Text>
          <Text className="m-l-12">已核销</Text><Text className="tipText m-l-12">{props?.data?.usedCount}</Text>
        </View>
        {
          current === '1' && <View className="couponsItemBox-couponsItem-bottom-send" onClick={() => {
            setTipVisible(true)
            setCurrentItem(props.data)
          }}>停止发放</View>
        }
      </View>

    </View>
  }
  return <View className="couponsListContainer">
    <Tabs value={current} {...tabOptions} onChange={(v) => setCurrent(v)} ></Tabs>
    <ScrollView
      className="couponsListContainerScrollView"
      scrollY
      onScrollToLower={() => {
        !listStatus.noMore && run(dataCopy)
      }}

    >
      <View className="couponsItemBox">
        {/* <CouponsItem></CouponsItem> */}
        {
          dataCopy?.list?.map((item, index) => {
            return <CouponsItem data={item} key={item?.uuid}></CouponsItem>
          })
        }
        {
          dataCopy?.list?.length === 0 && <Empty className="m-t-120" src={empty}></Empty>
        }
      </View>
      <View className="couponsListContainer-btnBox">
        <View className="couponsListContainer-btn" onClick={() => BwTaro.navigateTo({ url: '/pages/other/sendStamps/index' })}>立即发券</View>
      </View>
    </ScrollView>

    <BwModal
      title={currentItem?.grantType === 1 ? '满减券' : '折扣券'}
      visible={visible}
      onClose={() => setVisible(false)}
      onCancel={() => { setVisible(false) }}
      onConfirm={() => setVisible(false)}
      type="alert"
      content={<>
        <View className="couponsListContainer-modal">
          <View>使用门槛: 满{fen2yuan(currentItem?.minPoint)}元可用</View>
          <View>优惠信息: {currentItem?.grantType == 1 ? `减${fen2yuan(currentItem?.price)}元` : `打${new Big((currentItem?.price || 10)).div(10).toNumber()}折 最高减${fen2yuan(currentItem?.maxPrice)}元`}</View>
          {/* <View> 使用范围: { useRange[currentItem?.useType]}</View> */}
          <View> 领取时间: {dayjs(currentItem?.startTime).format('MM.DD HH:mm')}~{dayjs(currentItem?.endTime).format('MM.DD HH:mm')}</View>
          <View>使用时间: {SENDSTAMPS_USETIME_LIST[currentItem?.duration || 0].label}</View>
          <View> 领取限制: 每人限领{currentItem?.perLimit}张</View>
        </View>
      </>}
    >

    </BwModal>
    <BwModal
      visible={tipVisible}
      onCancel={() => setTipVisible(false)}
      onClose={() => setTipVisible(false)}
      title='温馨提示'
      cancelText="取消"
      confirmText="确认停发"
      onConfirm={handleSubmit}
      content={
        <View>优惠券停止发放后，已被用户领取的券可正常使用，是否停发？</View>
      }
    >

    </BwModal>

  </View>
}

export default CouponsList