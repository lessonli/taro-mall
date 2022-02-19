import { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh, useReady } from "@tarojs/taro";
import * as images from '@/constants/images'
// import H5TabBar from '@/components/Tab-bar'
import './index.scss'
import Swiper from '@/components/Swiper';
import api2972, { IResapi2972 } from '@/apis/21/api2972';
import storge, { session } from '@/utils/storge';
import Commodity from '@/components/CommodityModule'
import { useRequest } from 'ahooks'
import api3404 from '@/apis/21/api3404';
import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import PreImage, { XImage } from '@/components/PreImage';
import StickBox, { useStick } from '@/components/StickBox';
import { useAppTitle, useWxShare } from '@/utils/hooks';
import SearchContainer from '@/components/SearchPage';
// import TabBar from '@/custom-tab-bar';
import qs from 'query-string'
import worker from './worker'
import NavigationBar, { navigationBarInfo } from '@/components/NavigationBar';
import { getAppCheckedStatus } from '@/service/http';
import { DEVICE_NAME } from '@/constants';
import { AtCurtain } from 'taro-ui';
import api4694 from '@/apis/21/api4694';
import { deepClone } from '@/utils/base';
import BwScrollView from '@/components/PageScrollView';
import { HomeData, selectTabIndex } from '@/store/atoms';
import { useRecoilState } from 'recoil';
import list from '../goods/goodSample/list';
import { sendCustomEvent } from '@/utils/uma';
import TabBar from '@/components/Tab-bar';
import { DESIGN_ITEM_WIDTH } from '@/components/WaterfallList';
import { useRef } from 'react';

export type IBanner = Required<IResapi2972["data"]>
const Index = () => {
  const [value, setValue] = useState<string>('')
  const [bannerList, setBannerList] = useState<IBanner>()
  const [pageNo, setPageNo] = useState<number>(0)
  const [commodityData, setCommodityData] = useState<[]>([])
  const [jingangList, setJingangList] = useState<[]>([])
  const [tjList, setTjList] = useState<[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [scrollTop, setScrollTop] = useState<number>(0)
  const [rewardInfo, setRewardInfo] = useState<string>()
  const [rewardVisible, setRewardVisible] = useState<boolean>(false)
  const [position, setPosition] = useState<'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'>('static')
  const [advertisingList, setAdvertisingList] = useState([])
  const [showAdverseImg, setShowAdverseImg] = useState<boolean>(true)
  const [cacheData, setCacheData] = useRecoilState(HomeData)
  const [selected, setSelected] = useRecoilState(selectTabIndex)

  const pRef = useRef()

  const service = async (
    // 获取商品
    result?: { pageNo: number, pageSize: number, totalNum?: number | undefined }
  ) => {
    console.log('开始执行');
    
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20
    const res = await api3404({
      pageNo,
      pageSize
    })
    const totalNum = result?.totalNum ? result?.totalNum + res.data.length : res.data.length

    const banners = await pRef.current
    

    return {
      list: res?.data,
      total: res?.total,
      totalNum: totalNum,
      pageNo,
      pageSize,
      tjBanners: banners?.filter(item => item.type === 1) || [],
    }
  }

  const { loading, data, run, loadMore, refresh, reload } = useRequest(service, {
    loadMore: true,
    // debounceInterval: 200,
    manual: true
    // isNoMore: (d) => (d ? d.list.length >= d.total : false)
  })

  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore: data?.total === 0 && !loading
  })

  // const loadMore = useCallback(() => {
  //   !loading && data?.total !== 0 && run(data)
  // }, [data, loading])

  const onScroll = (e: any) => {
    const { scrollTop } = e
    useStick(scrollTop, 0, position, setPosition)
  }
  useWxShare()


  useReady(() => {
    console.log('useReady')
  })


  // usePullDownRefresh(() => {
  //   Taro.startPullDownRefresh()
  // })


  const init = async (refresh?) => {
    let bannerList: any = {
      0: [],
      1: [],
      4: [],
      5: []
    }
    if (cacheData.bannerList && !refresh && process.env.TARO_ENV === 'weapp') {
      cacheData?.bannerList.forEach(item => {
        bannerList[item.type].push(item)
      })
      
      setTjList(bannerList[1]);
      setBannerList(bannerList[0]);
      setJingangList(bannerList[4]);
      (bannerList[5]?.length > 0) && showRewardVisble(bannerList[5])
    } else {
      pRef.current = api4694({ types: [0, 1, 4, 5] })
      const list = await pRef.current
      if (list.length > 0) {
        list.forEach(item => {
          bannerList[item.type].push(item)
        })

        setTjList(bannerList[1]);
        setBannerList(bannerList[0]);
        setJingangList(bannerList[4]);
        (bannerList[5]?.length > 0) && showRewardVisble(bannerList[5])
      }
      setCacheData(value => {
        return { bannerList: list }
      })

    }
    return reload()

  }

  useEffect(() => {
    (async () => {
      try {
        await getAppCheckedStatus()
      } catch (e) {

      }
      init()
    })()

    // const worker = Taro.createWorker('./worker.ts') // 文件名指定 worker 的入口文件路径，绝对路径
    // worker.onMessage(function (res) {
    //   console.log(res)
    // })
    // worker.postMessage({
    //   msg: 'hello worker'
    // })
    // const config = await globalConfig()
    // var myWorker = new Worker(worker);
    // myWorker.postMessage(1632037979000);
    // myWorker.onmessage = (m) => {
    //   console.log("msg from worker: ", m.data);
    //   myWorker.postMessage(m.data);
    // };


  }, [])

  useDidShow(() => {
    setSelected(0)
  })

  // useDidShow(() => {
  //   (async () => {
  //     api2972({ type: 1 }).then(list => {
  //       setTjList(list)
  //     })
  //     api2972({ type: 0 }).then(list => {
  //       setBannerList(list)
  //     })
  //     api2972({ type: 4 }).then(list => {
  //       setJingangList(list)
  //     })
  //   })()
  // })

  // const goSearch = useCallback(() => {
  //   Taro.navigateTo({
  //     url: '/pages/search/index'
  //   })
  // }, [])
  const goSearch = useCallback(() => {
    setShowSearch(true)
    // Taro.navigateTo({
    //   url: '/pages/search/index'
    // })
  }, [])


  const onClose = () => {
    setShowSearch(false)
  }

  const goRouter = useCallback((url) => {
    if (process.env.TARO_ENV === 'weapp') {
      url && Taro.navigateTo({ url: url })
    } else {

      if (url.indexOf(window.location.host) > -1) {
        Taro.navigateTo({
          url: url.split(window.location.host)[1]
        })
      } else {
        url && (window.location.href = url)
      }
    }

  }, [])
  const showRewardVisble = (array) => {
    let inrTime = new Date().getTime();
    let list = deepClone(array)
    // console.clear();
    let newList = []
    if (!storge.getItem(`inrTimeList`)) {
      // 首次
      setRewardVisible(true)
      let inrTimeList = {}
      list.forEach(item => {
        inrTimeList[`inrTime${item.uuid}`] = ''
        // inrTimeList[`inrTime${item.uuid}`] = inrTime
        newList.push(item)
      });
      storge.setItem('inrTimeList', inrTimeList)
    } else {
      // 判断对应的广告位
      let inrTimeList = storge.getItem(`inrTimeList`)
      list.forEach(item => {
        if (!inrTimeList[`inrTime${item.uuid}`]) {
          setRewardVisible(true)
          inrTimeList[`inrTime${item.uuid}`] = ''
          newList.push(item)
        } else {
          if (inrTimeList[`inrTime${item.uuid}`] + (item.inrTime || 0) * 60 * 1000 < inrTime) {
            setRewardVisible(true)
            newList.push(item)
            inrTimeList[`inrTime${item.uuid}`] = ''
          }
        }
      });
      storge.setItem('inrTimeList', inrTimeList)
    }

    setAdvertisingList(newList)



    // list.forEach(item => {
    //   let inrTime = new Date().getTime()
    //   // storge.getItem(`inrTimeList`)[`adverse${item.uuid}`]
    //   console.log(storge.getItem(`inrTimeList`), 111111);

    // });

    // if (!storge.getItem('inrTime') || storge.getItem('inrTime') + 60 * < inrTime && DEVICE_NAME === 'weapp') {
    //   // console.log('一天一次');
    //   setRewardVisible(true)

    //   storge.setItem('inrTime', inrTime)
    // }
  }

  const closeAdverse = useCallback(
    () => {
      if (advertisingList.length > 1) {
        let newList = deepClone(advertisingList)
        newList.shift()
        setShowAdverseImg(false)
        // setShowAdverseImg(true)
        setAdvertisingList(newList)
      } else {
        setRewardVisible(false)
      }
    },
    [advertisingList],
  )

  useEffect(() => {
    let list = deepClone(advertisingList)
    if (list.length > 0) {
      let inrTimeList = storge.getItem(`inrTimeList`)
      if (!inrTimeList[`inrTime${list[0].uuid}`]) {
        setRewardInfo(list[0])
        inrTimeList[`inrTime${list[0].uuid}`] = new Date().getTime()
        setShowAdverseImg(true)
        storge.setItem('inrTimeList', inrTimeList)
      } else {
        list.shift()
        setAdvertisingList(list)
      }
    }
  }, [advertisingList])


  const getOpenRed = () => {
    console.log('开红包');
    setRewardVisible(false)
    Taro.navigateTo({ url: rewardInfo?.maUrl })

  }

  const swiper = useMemo(() => {
    return <Swiper list={bannerList}></Swiper>
  }, [bannerList])

  const waterfallSource = useMemo(() => {
    return [
      {
        swiper: data?.tjBanners || [],
        width: DESIGN_ITEM_WIDTH,
        height: 500,
        uuid: 'swiper',
      },
      ...(data?.list || []),
    ]
  }, [data])

  return (
    <>
      {/* <PreImage src={'https://img.bowuyoudao.com/product/1626421415354qnt3ur4qn.jpg?w=1080&h=1440'} onClick={() => { console.log(11) }} onLoad={() => {
        console.log((222));
      }}></PreImage> */}
      {/* <NavigationBar
        title={title}
        background={'#ffffff'}
      /> */}
      {showSearch && <SearchContainer onClose={onClose}></SearchContainer>}
      {/* <ScrollView
        className='homeScroview' scrollY
        scrollWithAnimation
        lowerThreshold={1200}
        onScroll={onScroll}
        onScrollToLower={loadMore}
      > */}
      <BwScrollView
        onScroll={onScroll}
        onScrollToLower={loadMore}
        onPullDownRefresh={() => { return init(true) }}>
        <View className='bw-home'>
          <StickBox position={position} id={'home'} type='top'>
            <View id='home' className='bw-home-header'>
              <img className='bw-home-header-logo' src={images.bowub} alt="" />
              <View className='bw-home-header-searchBox' onClick={goSearch}>
                <i className='myIcon'>&#xe710;</i>
                <View className='bw-home-header-searchBox-text'>搜索</View>
              </View>
            </View>

          </StickBox>
          <View className='bw-home-banner'>
            {swiper}
          </View>
          <View className='bw-home-tags'>
            <View>
              <i className='myIcon'>&#xe73e;</i>
              <Text className='bw-home-tags-text'>千万消费保障</Text>
            </View>
            <View>
              <i className='myIcon'>&#xe73d;</i>
              <Text className='bw-home-tags-text'>7天无理由退货</Text>
            </View>
            <View>
              <i className='myIcon'>&#xe73c;</i>
              <Text className='bw-home-tags-text'>30秒极速响应</Text>
            </View>
          </View>
          <View className='bw-home-activity'>
            {jingangList?.map((item, index) => {
              return <PreImage className='bw-home-activity-img' key={index} onClick={() => { goRouter(process.env.TARO_ENV === 'weapp' ? item.maUrl : item?.h5Url) }} src={item?.icon} alt="" />
            })}
          </View>

          <View className='bw-home-commodity'>
            <Commodity data={waterfallSource}></Commodity>
          </View>
          {
            data?.total === 0 ? <NoMore /> : <>{listStatus.noMore ? <NoMore /> : <LoadingView visible={listStatus.loading} />}</>
          }
          {!showSearch && process.env.TARO_ENV !== 'weapp' && <TabBar value={1} />}
        </View>

        <AtCurtain
          isOpened={rewardVisible}
          onClose={closeAdverse}
        >
          <View className='bw-home-modalCon'>
            {showAdverseImg && <Image onClick={() => getOpenRed()} className={showAdverseImg ? 'bw-home-modalCon-img' : 'bw-home-modalCon-imgHide'} src={rewardInfo?.icon}></Image>}
          </View>
        </AtCurtain>
      </BwScrollView>
      {/* </ScrollView> */}

    </>
  )
}

export default Index

