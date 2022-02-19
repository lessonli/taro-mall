import Taro from '@tarojs/taro'

import { lingxian, chuju, vip1 as vip, WX_PAY_ICON as head, vip1 } from '@/constants/images'
import { Text } from '@tarojs/components'
import './index.scss'
import { AtButton } from 'taro-ui'
import api3128, { IResapi3128 } from '@/apis/21/api3128'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { fen2yuan } from '@/utils/base'
import PreImage from '@/components/PreImage'
import { ScrollView } from '@tarojs/components'
import { LoadingView, NoMore } from '@/components/ScrollView'
export type Iprops = Required<Required<IResapi3128>['data']>['data'][0]

export const AuctionList = (props: Iprops) => {
  return (
    <div className='AuctionList'>
      <div className='AuctionList-info'>
        <div className='AuctionList-info-detail'>
          <img className='AuctionList-info-detail-headImg' src={props.userInfo?.headImg}></img>
          <div className='AuctionList-info-detail-content'>
            <p className='name'>
              <span>{props.userInfo?.nickName}</span>
              {/* <img src={vip1} alt="" /> */}
            </p>
            <p className='time'>
              {dayjs(props.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
            </p>
          </div>
        </div>
        <Text className='AuctionList-info-price'><Text className='fz24'><Text>¥</Text></Text> {fen2yuan(props?.auctionPrice)}</Text>
      </div>
      <img className='AuctionList-status' src={props?.auctionStatus === 1 ? lingxian : chuju} alt="" />
    </div>
  )
}

const AuctionRecordList = (props) => {
  const { onClose } = props
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const service = useCallback(async (
    // 获取店铺推荐商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 10

    const res = await api3128({
      pageNo,
      pageSize,
      productId: page.router?.params.productId
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [])

  const { data, loadMore, reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })

  const close = useCallback(
    () => {
      onClose()
    }, []
  )
  return (
    <div className='AuctionRecordList'>
      <div>
        <ScrollView
          scrollY
          scrollWithAnimation
          lowerThreshold={50}
          className='AuctionRecordList-content'
          onScrollToLower={loadMore}>
          {/* {data?.list.map((item, index) => {
            return <AuctionList key={`auction${index}`} {...item}></AuctionList>
          })} */}
          {data?.list.map((item, index) => {
            return <AuctionList key={`auction${index}`} {...item}></AuctionList>
          })}
          {
            noMore ? <NoMore /> : <LoadingView visible={loadingMore} />
          }
        </ScrollView>
      </div>
      <div className='AuctionRules-btn'>
        <AtButton type='primary' onClick={close}>确定</AtButton>
      </div>
    </div>
  )
}
export default AuctionRecordList
