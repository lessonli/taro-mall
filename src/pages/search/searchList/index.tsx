import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import SearchModule from '@/components/SearchModule'
import Tabs from '@/components/Tabs'
import SortTab from '@/components/SortTab'
import Commodity from '@/components/CommodityModule'
import { useRequest } from 'ahooks'
import './index.scss'
import { useCallback, useEffect, useMemo, useState } from 'react'
import api3404 from '@/apis/21/api3404'
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import StickBox, { useStick } from '@/components/StickBox'
import { empty, vip1 } from '@/constants/images'
import Empty from '@/components/Empty'
import NavigationBar, { navigationBarInfo, SingleBackBtn } from '@/components/NavigationBar'
import { BwTaro } from '@/utils/base'

const SearchList = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [tabValue, setTabValue] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<any>(page.router?.params?.searchValue)
  const [pageNo, setPageNo] = useState<number | undefined>(undefined)
  const [commodityData, setCommodityData] = useState<[]>([])
  const [updata, setUpdate] = useState<boolean>(true)
  const [scrollTop, setScrollTop] = useState<number>(0)
  const [position, setPosition] = useState<'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'>('static')
  const [sortOption, setSortOption] = useState<{
    label: string;
    value: string;
    asc: boolean;
  }[]>([{
    label: '综合排序',
    value: 'composite',
    asc: false
  }, {
    label: '最新上架',
    value: 'newest',
    asc: false
  }, {
    label: '价格',
    value: 'price',
    asc: true
  }, {
    label: '销量',
    value: 'sales',
    asc: true
  }])
  const [orderItems, setOrderItems] = useState<{
    column?: string | undefined;
    asc?: boolean | undefined;
  }[] | undefined>()
  const tabOption = {
    options: [
      {
        label: '拍卖',
        value: 1
      },
      {
        label: '一口价',
        value: 0
      }
    ],
    onChange: useCallback((value: number): void => {
      //tab切换之后调用获取商品接口 todo
      setTabValue(value)
      if (value === 0) {
        setSortOption([{
          label: '综合排序',
          value: 'composite',
          asc: false
        }, {
          label: '最新上架',
          value: 'newest',
          asc: false
        }, {
          label: '价格',
          value: 'price',
          asc: true
        }, {
          label: '销量',
          value: 'sales',
          asc: true
        }])
      } else {
        setSortOption([
          {
            label: '综合排序',
            value: 'composite',
            asc: false
          },
          {
            label: '即将截拍',
            value: 'deadline',
            asc: false
          },
          {
            label: '最新上拍',
            value: 'newest',
            asc: false
          },
          {
            label: '0元起拍',
            value: 'zero',
            asc: false
          }
        ])
      }
    }, []),
    value: tabValue,
    style: {
      background: '#fff',
      'justify-content': 'flex-start'
    }
  }



  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20
    const res = await api3404({
      productType: tabValue,
      keywords: page.router?.params?.searchId ? '' : searchValue,
      categoryId: page.router?.params?.searchId || '',
      orderItems: orderItems,
      pageNo,
      pageSize,
    })
    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }

  }, [tabValue, orderItems])

  const { loading, data, run, reset, loadMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [tabValue, orderItems],
    debounceInterval: 200,
    manual: true
    // isNoMore: (d) => (d ? d.list.length >= d.total : false)
  })

  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore: (data?.list || []).length >= data?.total && !loading
  })

  const onScroll = (e: any) => {
    const { scrollTop } = e.mpEvent ? e.mpEvent.detail : e.detail
    useStick(scrollTop, 0, position, setPosition)

  }

  // const pageList = useMemo(() => data?.currentList || [], [data?.currentList])
  // useEffect(() => {
  //   console.log(9999);

  //   setCommodityData(data?.currentList)
  // }, [data?.currentList])


  const onSortChange = (value) => {
    setOrderItems(value)
  }

  useEffect(() => {    
    setUpdate(false)
    const requestData = { ...data, pageNo: 0 }
    reset()
    run(undefined).then(res => {
      setUpdate(true)
    })

  }, [tabValue, orderItems])


  const goBack = () => {
    Taro.navigateBack({
      fail: () => {
        BwTaro.redirectTo({
          url: '/pages/index/index'
        })
      }
    })
  }

  return (
    <ScrollView
      className='searchListBox'
      scrollY
      scrollTop={scrollTop}
      scrollWithAnimation
      lowerThreshold={200}
      onScroll={onScroll}
      onScrollToLower={loadMore}
    >
      <NavigationBar
        title={'搜索'}
        background={'#ffffff'}
        leftBtn={<SingleBackBtn />}
      />
      <div className='bw-searchList'>
        <StickBox position={position} id={'searchList'}>
          <View id='searchList'>
            <SearchModule value={searchValue} />
            <Tabs {...tabOption} composition={2} className='searchListBox-box' itemClassName='searchListBox-tabs'></Tabs>
            <SortTab options={sortOption} className='searchListBox-sortBox' onChange={onSortChange}></SortTab>
          </View>
        </StickBox>
        <View className='bw-searchList-content'>
          {updata && <Commodity data={data?.list}></Commodity>}
          {
            listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />
          }
          {
            listStatus?.empty && data?.pageNo === 1 && <div className='bw-searchList-empty'><Empty src={empty} text={'暂无数据'}></Empty></div>
          }
        </View>
      </div>



    </ScrollView >
  )
}

export default SearchList
