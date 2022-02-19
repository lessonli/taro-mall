
import { goldSeller, diamondSeller, serviceProviders, userBg, sfsq, gryq, yqkd, tdgl, qianbao, zhaq,hbkq_merchant, kefu, xtsz, paimai, ykjgl, shangxy } from "@/constants/images";
import Taro from '@tarojs/taro'
import { Text, View, ScrollView, Image } from "@tarojs/components"

import { useDidHide, useReady } from "@tarojs/runtime";
import { useWxShare } from "@/utils/hooks";
import { useMount, useRequest } from 'ahooks'
import Commodity from '@/components/CommodityModule'
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useDidShow } from "@tarojs/taro";
import { LoadingView, NoMore } from '@/components/ScrollView';
import NavigationBar, { useH5Title } from "@/components/NavigationBar";
import compose, { formatMoeny, fen2yuan } from '@/utils/base';
import storge, { session } from "@/utils/storge";
import { XImage } from "@/components/PreImage";

import api2508 from "@/apis/21/api2508";
import BwModal from "@/components/Modal";
import api2876, { IResapi2876 } from "@/apis/21/api2876";
import api3008, { IResapi3008 } from "@/apis/21/api3008";
import api3014, { IResapi3014 } from "@/apis/21/api3014";
import Swiper from '@/components/Swiper';
import api2972, { IResapi2972 } from '@/apis/21/api2972';
import api3704 from "@/apis/21/api3704"; // 商户状态
import api2452 from "@/apis/21/api2452"; // 商户个人主页

import { foorPrints } from '@/utils/storge';
import { DEVICE_SYSTEM } from '@/constants';
import Big from "big.js";
import { getUserInfo as cachedGetUserInfo } from "@/utils/cachedService";
import './index.scss'
import H5TabBar from "@/components/Tab-bar";

import MerchantLevel from "@/pages/user/index/components/MerchantLevel/MerchantLevel";
import api4424 from "@/apis/21/api4424";
import TabBar from "@/components/Tab-bar";
import BwScrollView from "@/components/PageScrollView";
import { selectTabIndex } from "@/store/atoms";
import { useRecoilState } from "recoil";
// import TabBar from "@/custom-tab-bar";


function Index() {
  const [userInfo, setUserInfo] = useState<IResapi2876['data']>({})
  const [orderInfo, setOrderInfo] = useState<IResapi3008['data'] | IResapi3014['data']>({})
  const [isBuyer, setIsBuyer] = useState<Boolean>(storge.getItem('userCurrentPosition') === 'buyer')
  const [cacheUser, setCacheUser] = useState() // 已改为接口取值
  const [footprintNum, setFootprintNum] = useState<number>(0)
  const [pageNo, setPageNo] = useState<number>(0)
  const [bannerList, setBannerList] = useState<any>([])
  const [commodityData, setCommodityData] = useState<[]>([])
  const [merchantData, setMerchantData] = useState({})
  const [merchantStatus, setMerchantStatus] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [isShowLoading, setShowLoading] = useState<Boolean>(false)
  const [selected, setSelected] = useRecoilState(selectTabIndex)
  const isWeapp = process.env.TARO_ENV === 'weapp'
  const inviteList = [
    { title: '邀请开店', tip: '最高每人奖励230元', style: { color: '#8D4C2E' }, page: '/pages/merchant/openStore/index', img: yqkd },
    { title: '锁粉神器', tip: '专属粉丝长久绑定', style: { color: '#8B4804' }, page: '/pages/active/newUserShare/index?activityId=1000009', img: sfsq },
    { title: '个人邀请', tip: '直接邀请笔笔可查', style: { color: '#484C62' }, page: '/pages/user/invites/index', img: gryq },
    { title: '团队管理', tip: '一分耕耘一分收获', style: { color: '#184864' }, page: '/pages/user/index/teamManagement/index', img: tdgl }
  ]

  useEffect(() => {
    getOrderInfo()
  }, [isBuyer])
  useEffect(() => {
    (async () => {
      isShowLoading && Taro.showLoading({ title: '加载中' })
      const res = await api2972({ type: isBuyer ? 2 : 3 })
      setBannerList(res)
      const userInfo = await cachedGetUserInfo()
      setCacheUser(userInfo);
      setShowLoading(false)
      Taro.hideLoading()
    })()
  }, [isBuyer])

  // useEffect(() => {
  //   Taro.stopPullDownRefresh()
  // }, [])


  const getMerchantData = async () => {
    const merchantData = await api3704()
    const merchantStatus = await api2452()
    setMerchantStatus(merchantStatus)
    setMerchantData(merchantData)
  }

  useDidShow(() => {
    // 默认 根据用户身份调用接口 当点击改变身份的时候 调用 
    setSelected(3)
    isBuyer ? getUserInfo() : getMerchantData();
    (async () => {
      const res = await foorPrints.getList({ pageNo: 1, pageSize: 10 })
      setFootprintNum(res.total)
    })()

    session.setItem('userCurrentPosition', storge.getItem('userCurrentPosition'))
  })

  useWxShare()

  const getUserInfo = (async () => {
    const res = await api2876()
    setUserInfo(res)
  })

  // 获取订单数量相关
  const getOrderInfo = useCallback(async () => {
    if (isBuyer) {
      const res = await api3008()
      setOrderInfo(res)
    } else {
      const res = await api3014()
      setOrderInfo(res)
    }
  }, [isBuyer])
  const changeUserStatus = () => {
    // 点击 操作 反逻辑
    setShowLoading(true)
    if (isBuyer) {
      getMerchantData()
      storge.setItem('userCurrentPosition', 'merchant')
      session.setItem('userCurrentPosition', 'merchant')
      setIsBuyer(false)

    } else {
      getUserInfo()
      storge.setItem('userCurrentPosition', 'buyer')
      session.setItem('userCurrentPosition', 'buyer')

      setIsBuyer(true)
    }
  }
  const getNumber = (num): string => {
    const NUMBERMAX = 100
    if (num > NUMBERMAX) {
      return '99+'
    }
    return num
  }
  const getMerchantOrderNum = (num) => {
    // num = num*11000 // 本地测试 扩大
    let big = new Big(num)
    if (num < 9999) {
      return num
    }
    return big.div(10000).toFixed(1) + 'w'

  }
  const handleCopy = (e) => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.setClipboardData({
        data: merchantData?.channelNo,
      })
    } else {
      Taro.setClipboardData({
        data: merchantData?.channelNo,
        success: () => {
          Taro.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
        fail: () => {
          Taro.showToast({
            title: '复制失败'

          })
        }
      })
    }

    e.stopPropagation() // 防止触发页面跳转
  }

  const bg = useMemo(() => {

    if (!isBuyer) {
      if (merchantStatus?.merchantLevel === 1) {
        // return goldSeller
        return 'index-header-boxBgGoldSeller'
      }
      if (merchantStatus?.merchantLevel === 2) {
        // return diamondSeller
        return 'index-header-boxBgDiamondSeller'
      }
      if (merchantStatus?.merchantLevel === 3) {
        // return serviceProviders
        return 'index-header-boxBgServiceProviders'
      }
    }
    if (isBuyer) {
      // return userBg
      return 'index-header-boxBguUserBg'
    }
  }, [isBuyer, merchantStatus?.merchantLevel])


  const toPage = (url) => {
    if (!url) return
    Taro.navigateTo({
      url: url
    })
  }
  const swiper = useMemo(() => {
    return <Swiper type='height' list={bannerList}></Swiper>
  }, [bannerList])
  const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 20
    setPageNo(pageNo)

    if (isBuyer) {
      const res = await api2508({
        pageNo,
        pageSize
      })

      return {
        list: res?.data,
        total: res?.total,
        pageNo,
        pageSize,
      }
    }
  }, [isBuyer])
  const { data, loadMore, reload, loadingMore, noMore } = useRequest(service, {
    loadMore: true,
    refreshDeps: [isBuyer],
    debounceInterval: 200,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    // loadingDelay: 500,
  })
  const toUserInfo = () => {
    const url = isBuyer ? '/pages/system/accountInfo/index' : `/pages/store/storeSetting/index?merchantId=${merchantData?.merchantNo}`
    return Taro.navigateTo({ url })
  }
  // @ts-ignore
  // console.log(cacheUser, 'cacheUser');
  const handleToNewUserShare = () => {
    toPage('/pages/active/newUserShare/index?activityId=1000009')
  }

  const chartBw = async () => {
    const res = await api4424()
    Taro.navigateTo({
      url: `/pages/im/message/index?id=${res?.identifier}&type=1`
    })
  }

  const pullDownRefresh = useCallback(
    () => {
      if (isBuyer) {
        getUserInfo()
        getOrderInfo()
        reload()
      } else {
        getMerchantData()
        getOrderInfo()
      }
    },
    [isBuyer],
  )
  return (
    <View className='index-wrapper-box'>
      <BwScrollView
        onPullDownRefresh={pullDownRefresh}
        onScrollToLower={loadMore}
      >
        {process.env.TARO_ENV !== 'weapp' && <TabBar value={4} />}
        {/* <NavigationBar background='#ffffff' title={isBuyer ? '我的' : '卖家中心'}></NavigationBar> */}
        <View className={`index-wrapper`}>
          {/* style={{ backgroundImage: `url(${bg})` }} */}
          <View className={`index-header-box ${bg} ${!isBuyer ? 'index-header-box-seller' : ''} `} >
            <View className='index-user-info'>
              <View className='index-img' onClick={toUserInfo}>
                {isBuyer ? <XImage className='index-img-eleRound' src={userInfo?.headImg} /> : <XImage className='index-img-ele' src={merchantData?.shopLogo} />}
              </View>
              <View className='index-user' onClick={toUserInfo}>
                {isBuyer && <View className={`index-user-storeName`}> <View className="index-user-storeName-text">{userInfo?.nickName}</View></View>}
                {!isBuyer && <View className={`index-user-storeName ${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceTitle' : ''}`}>
                  <View className='index-user-storeName-text'>{merchantData?.shopName}</View>
                  <View className='index-user-storeName-level'> <MerchantLevel level={merchantData?.merchantLevel}></MerchantLevel></View>
                </View>}
                {/* {isBuyer && <View className='index-user-growthValue' style={{ opacity: 0 }}>成长值 2355 <Text className='myIcon'>&#xe740;</Text></View> } */}

                {!isBuyer && <p className={`index-user-invite ${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceText' : ''}`} ><Text>邀请码:{merchantData?.channelNo}</Text><Text onClick={handleCopy} className={`${merchantData?.merchantLevel !== 3 ? 'index-user-copy' : 'index-user-serviceCopy'}`}>复制</Text></p>}
              </View>
              {cacheUser?.userLevel === 3 &&
                <View className={`index-buyer-center ${isBuyer ? 'index-sell-center' : ''}`} onClick={changeUserStatus}>
                  <Text className='myIcon m-r-10 m-l-10'>&#xe740;</Text>
                  {isBuyer ? '切换卖家' : '切换买家'}
                </View>}
            </View>
            {/*isBuyer true 买家 false 卖家*/}
            {!isBuyer ? <View className='index-user-seller'>
              <View onClick={() => toPage('/pages/user/index/distribution/index')}>
                <View className={`index-user-seller-number ${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceTitle' : ''} `}>
                  {compose(formatMoeny, fen2yuan)(merchantData?.distributionGmv || 0)}
                </View>
                <View className={`${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceText' : ''}`}>分销销售额</View>
              </View>
              <View onClick={() => toPage('/pages/user/index/cumulativeEarnings/index')}>
                <View className={` index-user-seller-number ${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceTitle' : ''}`}>
                  {compose(formatMoeny, fen2yuan)(merchantData?.commissionTotalAmount)}
                </View>
                <View className={`${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceText' : ''}`}>累计佣金</View>
              </View>
              <View onClick={() => toPage('/pages/user/index/wallet/index')}>
                <View className={` index-user-seller-number ${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceTitle' : ''}`}> {compose(formatMoeny, fen2yuan)(merchantData?.totalAvailableAmount)}</View>
                <View className={`${merchantStatus?.merchantLevel === 3 ? 'userIndexServiceText' : ''}`}>我的钱包</View>
              </View>
            </View> : <View className='index-user-buyer index-user-seller'>
              <View onClick={() => toPage('/pages/user/auctHistories/index')}>
                <View className='index-user-seller-number'>{userInfo?.aucProdNum}</View>
                <View>参拍</View>
              </View>
              <View onClick={() => toPage('/pages/user/index/focus/index')}>
                <View className='index-user-seller-number'>{userInfo?.followCount}</View>
                <View>关注</View>
              </View>
              <View onClick={() => toPage('/pages/user/collection/index?isCollect=true')}>
                <View className='index-user-seller-number'>{userInfo?.collectProdNum}</View>
                <View>收藏</View>
              </View>
              <View onClick={() => toPage('/pages/user/collection/index?isCollect=false')}>
                <View className='index-user-seller-number'>{footprintNum}</View>
                <View>足迹</View>
              </View>
            </View>}
          </View>
        </View>
        {/* {bannerList.length > 0 && <View className='index-user-banner'>
          {swiper}
        </View>} */}
        <View>
        </View>

        {/* <View className='index-user-content-wrapper'> */}
        <View className={`index-user-content-wrapper ${!isBuyer ? 'p-b-120' : ''}`}>
          {/*  邀请管理*/}
          {!isBuyer && <View className={`index-user-order index-user-invite-manange`}>
            <View className='index-user-title index-user-order-title index-user-invite'>
              <Text>邀请管理</Text>
              <Text className='index-user-order-title-allOrder'>邀请越多赚的越多</Text>
            </View>

            <View className='index-user-invite-list'>
              {inviteList.map((item, idx) => {
                return <View key={idx} className='index-user-invite-list-item' onClick={() => toPage(item.page)}>
                  <View className='index-user-invite-list-item-left'>
                    <View className='index-user-invite-list-item-title' style={item.style}>{item.title}</View>
                    <View className='index-user-invite-list-item-tip'>{item.tip}</View>
                  </View>
                  <View className='index-user-invite-list-item-right'>
                    <Image className='index-user-invite-list-item-right-img' src={item.img} />
                  </View>
                </View>
              })}
            </View>
          </View>}
          {/*  我的/店铺订单*/}
          {bannerList.length > 0 && <View className={`index-user-banner ${!isBuyer ? 'm-t-24' : null}`}>
            {swiper}
          </View>}
          <View className='index-user-order'>
            <View className='index-user-title index-user-order-title '>
              <p>{isBuyer ? '我的订单' : '店铺订单'} </p>
              {isBuyer && <p className='index-user-order-title-allOrder' onClick={() => toPage('/pages/order/list/index')}>全部订单 <Text className='myIcon index-user-order-title-allOrder-icon'>&#xe726;</Text></p>}
            </View>
            {/* 买家 */}
            {
              isBuyer && <View className='index-user-order-list'>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=0')}>
                  <View className='myIcon index-user-order-list-item-img'>&#xe729;</View>
                  <View>待付款</View>
                  {/* index-user-order-list-item-icon */}
                  {orderInfo?.pendingPayCount > 0 && <Text className={`${DEVICE_SYSTEM === 'ios' ? 'index-user-order-list-item-icon' : 'index-user-order-list-item-androidIcon'}`}>{getNumber(orderInfo?.pendingPayCount)}</Text>}
                </View>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=1')}>
                  <p className='myIcon index-user-order-list-item-img'>&#xe72a;</p>
                  <View>待发货</View>
                  {(orderInfo?.pendingDeliveryCount > 0) && <Text className={`${DEVICE_SYSTEM === 'ios' ? 'index-user-order-list-item-icon' : 'index-user-order-list-item-androidIcon'}`}>{getNumber(orderInfo?.pendingDeliveryCount)}</Text>}
                </View>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=2')}>
                  <p className='myIcon index-user-order-list-item-img'>&#xe72f;</p>
                  <View>待收货</View>
                  {(orderInfo?.deliveredCount > 0) && <Text className={`${DEVICE_SYSTEM === 'ios' ? 'index-user-order-list-item-icon' : 'index-user-order-list-item-androidIcon'}`}>{getNumber(orderInfo?.deliveredCount)}</Text>}

                </View>
                {/* 买家*/}
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=3')}>
                  <p className='myIcon index-user-order-list-item-img'>&#xe72d;</p>
                  <View>待评价</View>
                  {orderInfo?.receivedCount > 0 && <Text className={`${DEVICE_SYSTEM === 'ios' ? 'index-user-order-list-item-icon' : 'index-user-order-list-item-androidIcon'}`}>{getNumber(orderInfo?.receivedCount)}</Text>}
                </View>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/afterSale/list/index')}>
                  <p className='myIcon index-user-order-list-item-img'>&#xe732;</p>
                  <View>售后/退款</View>
                  {(orderInfo?.returnCount > 0) && <Text className={`${DEVICE_SYSTEM === 'ios' ? 'index-user-order-list-item-icon index-user-order-list-item-shtkIcon' : 'index-user-order-list-item-androidIcon index-user-order-list-item-shtkIcon'}`}
                  >{getNumber(orderInfo?.returnCount)}</Text>}
                </View>
              </View>

            }
            {/* 卖家 */}
            {
              !isBuyer && <View className='index-user-order-list'>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=0')}>
                  <View className='index-merchant-order-list-item-num'>{getMerchantOrderNum(orderInfo?.pendingPayCount || 0)}</View>
                  <View>待付款</View>
                </View>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=1')}>
                  <View className='index-merchant-order-list-item-num'>{getMerchantOrderNum(orderInfo?.pendingDeliveryCount || 0)}</View>
                  <View>待发货</View>
                </View>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index?status=2')}>
                  <View className='index-merchant-order-list-item-num'>{getMerchantOrderNum(orderInfo?.deliveredCount || 0)}</View>
                  <View>待收货</View>
                </View>

                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/afterSale/list/index')}>
                  <View className='index-merchant-order-list-item-num'>{getMerchantOrderNum(orderInfo?.returnCount || 0)}</View>
                  <View>售后/退款</View>
                </View>
                <View className='index-user-order-list-item' onClick={() => toPage('/pages/order/list/index')}>
                  <View className='index-merchant-order-list-item-num'>{getMerchantOrderNum(orderInfo?.allCount || 0)}</View>
                  <View>全部</View>
                </View>
              </View>

            }
          </View>
          <View className='index-user-order'>
            <View className='index-user-title index-user-order-title '>
              <p>常用工具</p>
            </View>
            {isBuyer ? <View className='index-user-order-list index-user-order-utils'>
              <View className='index-user-order-list-item' onClick={() => toPage('/pages/user/index/wallet/index')}>
                <p><Image className='index-user-order-list-item-img' src={qianbao} alt='' /></p>
                <View>我的钱包</View>
              </View>
              <View className='index-user-order-list-item' onClick={() => toPage('/pages/user/couponCenter/index')}>
                <p><Image className='index-user-order-list-item-img' src={hbkq_merchant} alt='' /></p>
                <View>红包卡券</View>
              </View>
              <View className='index-user-order-list-item' onClick={() => toPage('/pages/user/customerService/list/index')}>
                <p><Image className='index-user-order-list-item-img' src={kefu} alt='' /></p>
                <View>帮助客服</View>
              </View>
              <View className='index-user-order-list-item' onClick={() => toPage('/pages/system/setting/index')}>
                <p><Image className='index-user-order-list-item-img' src={xtsz} alt='' /></p>
                <View>系统设置</View>
              </View>
            </View> : <View className='index-user-order-list'>
              <View className='index-user-order-list-item index-user-order-utils' onClick={() => toPage('/pages/merchant/auction/list/index?productType=1')} >
                <p><Image className='index-user-order-list-item-img' src={paimai} /></p>
                <View>拍品管理</View>
              </View>
              <View className='index-user-order-list-item index-user-order-utils' onClick={() => toPage('/pages/merchant/auction/list/index?productType=0')}>
                <p><Image className='index-user-order-list-item-img' src={ykjgl} /></p>
                <View>一口价管理</View>
              </View>
              <View className='index-user-order-list-item index-user-order-utils' onClick={chartBw}>
                <p><Image className='index-user-order-list-item-img' src={kefu} alt='' /></p>
                <View>在线客服</View>
              </View>
              <View onClick={() => toPage('/pages/bwSchool/list/index')} className='index-user-order-list-item index-user-order-utils'>
                <p><Image className='index-user-order-list-item-img' src={shangxy} alt='' /></p>
                <View>博物学院</View>
              </View>

            </View>}
          </View>
        </View>

        {isBuyer && <View className=''>
          {/* 只有买家显示 */}
          <View className='index-recomment-title'>为你推荐</View>
          <View>
            <Commodity data={data?.list}></Commodity>
            {
              noMore ? <NoMore /> : <LoadingView visible={loadingMore} />
            }
          </View>
        </View>
        }
      </BwScrollView>
    </View>

  )
}

export default Index
