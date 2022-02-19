
import Taro from "@tarojs/taro"
import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { View, Text, Image, ScrollView } from "@tarojs/components"
import { AtButton } from "taro-ui"

import { LoadingView, NoMore, useListStatus } from "@/components/ScrollView"
import ListItem from "@/components/ListItem";
import Empty from "@/components/Empty"

import api4662, {IResapi4662} from "@/apis/21/api4662" // 单个红包详情
import api4664 from "@/apis/21/api4664" // 单个红包 领取列表
import api2444, {IResapi2444} from "@/apis/21/api2444" // 获取当前商户信息
import api3554, {IResapi3554} from "@/apis/21/api3554" // 分享链接
import api3560, {IResapi3560} from "@/apis/21/api3560" // 分享二维码
import { return_tag } from "@/constants/images"
import { useRequest } from "ahooks"

import { empty, redPoster,redPoster2, redPoster3,redShareimg, putongRed,pinshouqiRed, xinrenRed} from "@/constants/images";
import compose, { fen2yuan, formatMoeny } from "@/utils/base";


import dayjs from "dayjs";
import { XImage } from "@/components/PreImage"

import FloatBtn from "../../components/FloatBtn"
import { initNewUser, initPullNew, initRedPacket } from "@/components/CanvasPhoto/components/CanvasInit"
import CanvasPhoto from "@/components/CanvasPhoto"

type IMerchant = Required<IResapi2444>['data']
// type IShareLink = Required<IResapi3554>['data']
type IQrcode = Required<IResapi3560>['data']
type Idetail = Required<IResapi4662>['data']

interface IShareData {
  userName: string,
  title: string,
  hdImageData: string,
  path: string,
  description: string,
  shareUrl: string,
  posterImg:string,

}

import './index.scss'


function Detail() {
  const params = useMemo(() => Taro.getCurrentInstance().router?.params, [])
  const [detail, setDetail] = useState<Idetail>()
  const [visible, setVisible] = useState<boolean>(false)
  const [merchantData, setMerchantData] = useState<IMerchant>()
  // const [shareLink, setShareLink] = useState<IShareLink>()
  const [qrCode, setQrCode] = useState<IQrcode>()
  const [shareData, setShareData] = useState<IShareData>()
  const srcObj = {
    1:xinrenRed,
    2:putongRed,
    3:pinshouqiRed
  }

  useEffect(()=>{
    
    getRedPacketDetail()
    getMerchantData();
    run()
    
  },[])
  
  const getRedPacketDetail = useCallback(async()=>{
    const detailRes = await api4662({uuid:params?.uuid})   
    console.log(detailRes, 'detailRes');
    
    setDetail(detailRes)
    
  },[])
  const getMerchantData = useCallback(async()=>{
    const merchantRes = await api2444({uuid:params?.uuid})   
    setMerchantData(merchantRes)
    
  },[])
  
  const openCanvas = async()=>{
    const qrCodeRes = await api3560({shareType: 12, targetId: params?.uuid,customParam:`?type=merchantBuy`})
      setQrCode(qrCodeRes)
      setShareData({
        title: qrCodeRes?.title,
        userName: WEAPP_GH_ID,
        hdImageData: qrCodeRes?.picUrl,
        path: qrCodeRes?.shareUrl as string,
        shareUrl: qrCodeRes?.shareUrl as string,
        // app端 需要该字段 
        description: qrCodeRes?.title,
        posterImg: qrCodeRes?.picUrl
      })
      setVisible(true)
  }


 
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 15
    const res = await api4664({
      pageNo,
      pageSize,
      redPacketId:params?.uuid
    })

    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [])

  const { run,data, loadMore, reload, loadingMore, noMore, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [],
    manual: true,
    isNoMore: (d) => (d ? d.list.length >= d.total : false),
    
  })
  const listStatus = useListStatus({
    list: data?.list || [],
    loading,
    noMore
  })
  const refersh = async()=>{
    Taro.showLoading()
    Promise.all([getRedPacketDetail(), run()]).finally(()=>{
     Taro.hideLoading()
   })
  }

  const ListLeft = ({item}) => {
    return <View className='redPacketDetail-list-left'>
      <View className='redPacketDetail-list-left-user'>
        <Image className='redPacketDetail-list-left-user-img' src={item?.headImg} />
      </View>
      <View className='redPacketDetail-list-left-info'>
        <View className='redPacketDetail-list-left-info-nickName'>{item.nickName}</View>
        <View className='redPacketDetail-list-left-info-time'>{dayjs(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</View>
      </View>
    </View>
  }


  return <>
    <View className='redPacketDetail'>
      <View className='redPacketDetail-head'>
      <View className='redPacketDetail-head-img'> <XImage src={srcObj[`${detail?.amountStrategy}`]} className='redPacketDetail-head-img-ele' /></View>
      <View className="redPacketDetail-head-tip">
        {
          detail?.useRange ===1 ? '全平台可用': '仅店铺可用'
        }
      </View>
      {/* status 1 待领取 2 已领完 3 已过期 */}
      {
        detail?.status === 1 && <>
        <View className='redPacketDetail-head-money'>￥{compose(formatMoeny,fen2yuan)(detail?.totalAmount)}</View>
        <AtButton className='redPacketDetail-head-btn' onClick={()=>openCanvas()}>立即分享红包</AtButton>
        <View className='redPacketDetail-head-text'>未领完和领取未使用的红包都自动退回至余额</View>
        </>
      }
      {
        detail?.status === 2 && <>
        <View className='redPacketDetail-head-money'>已领完</View>
        <AtButton className='redPacketDetail-head-btn' onClick={()=>Taro.navigateTo({url: '/pages/active/redPacket/index'})}>再发一个红包</AtButton>
        <View className='redPacketDetail-head-text'>新增店铺关注{detail.followCount}个, 专属粉丝{detail.privateFansCount}个</View>
        </>
      }
      {
        detail?.status === 3 && <>
        <View className='redPacketDetail-head-money'>已过期</View>
        <AtButton className='redPacketDetail-head-btn' onClick={()=>Taro.navigateTo({url: '/pages/active/redPacket/index'})}>再发一个红包</AtButton>
        <View className='redPacketDetail-head-text'>新增店铺关注{detail.followCount}个, 专属粉丝{detail.privateFansCount}个</View>
        </>
      }
      
      </View>
      
      <View className='redPacketDetail-info'>
        <View className='redPacketDetail-info-item'>待领取{(detail?.leftCount)}/{detail?.totalCount}, 剩{compose(formatMoeny, fen2yuan)(detail?.leftAmount)}元, 共{compose(formatMoeny, fen2yuan)(detail?.totalAmount)}元</View>
        <Text className='redPacketDetail-info-item'>领取有效期至 {dayjs(detail?.expireTime).format('MM-DD HH:mm')},</Text>
        <Text className='redPacketDetail-info-item m-l-8'>使用有效期至 {dayjs(detail?.receiveExpireTime).format('MM-DD HH:mm')}</Text>
      </View>
      <ScrollView 
        className='redPacketDetail-scrollView'
        scrollY 
        onScrollToLower={loadMore}>
        <View className='redPacketDetail-list'>
          {
            data?.list.map((item, index) => {
              return <>
                <ListItem
                  key={index}
                  type={1}
                  left={<ListLeft item={item} />}
                  right={<>
                    <View className='redPacketDetail-list-right'>
                      <View className='redPacketDetail-list-right-money'>{compose(formatMoeny,fen2yuan)(item.awardAmount)}元</View>
                      <View className='redPacketDetail-list-right-text'>
                        {item.awardType === 1 && '绑定专属粉丝'}
                        {item.awardType === 2 && '成功关注店铺'}
                        {item.awardType === 3 && '分享邀请奖励'}
                      </View>
                      {/*  过期退回打标签 */}
                      {
                        item.status === 3 &&  <View className="redPacketTag"></View>
                      }
                    </View>
                  </>}
                  icon={null}
                />
              </>
            })
          }
        </View>
        <View>
        {
          listStatus.noMore ? <NoMore /> : null
        }
        {
          listStatus.empty ? (
            <Empty src={empty} text='暂无红包记录' className='p-t-80' />
          ) : <LoadingView visible={listStatus.loading} />
        }
        
      </View>
      </ScrollView>
      <View className='redPacketDetail-btnGroup'>
        <FloatBtn icon={<Text className='myIcon fz50'>&#xe756;</Text>}></FloatBtn>
        <FloatBtn handleClick={()=>refersh()} icon={<Text className='myIcon fz50'>&#xe747;</Text>}></FloatBtn>
      </View>
      {
        visible && <CanvasPhoto
          shareImg={qrCode?.qrCodeUrl}
          shareLink={qrCode?.shareUrl}
          headImg={redPoster3}
          visible={visible}
          shareData={shareData}
          operationType={['friend']}
          size={{width: 522, height: 715}}
          init={initRedPacket}
          onClose={() => setVisible(false)}
        />
      }
    </View>
    
      
  </>
}


export default Detail