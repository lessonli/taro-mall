
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { launch_down, success, guideToBrower } from "@/constants/images";
import { banner_promote1 } from "@/constants/images";
import { useEffect, useState, useMemo } from "react";
import Single from "./components/Single";
import Double from "./components/Double";
import api3482 from "@/apis/21/api3482";
import api3560, { IReqapi3560 } from "@/apis/21/api3560";
import api4794 from "@/apis/21/api4794";
import './index.scss'
import { DEVICE_NAME, DEVICE_SYSTEM } from "@/constants";
import { host } from "@/service/http";
import { useDebounceFn } from "ahooks";
import Popup from "@/components/Popup";


function Launch() {
  const pages = useMemo(() => Taro.getCurrentInstance().router, [])
  const [visible,setVisible] = useState<boolean>(false)
  
  const mapData = new Map();
  const titleArr = [
    {
      _title: '爆款推荐',activityId: '1000010',pageSize:5
    },
    {
      _title: '超值好货',activityId: '1000010',pageSize:5
    },
    {
      _title: '疯狂补贴',activityId: '1000010',pageSize:5
    }
  ]
  const [goodData, setData] = useState<any>()
  const [qrcodeInfo, setQrcodeInfo] = useState<any>()
  const [promotionPage, setPromotionPage] = useState()

  useEffect(() => {
      api3560({ shareType: 7,targetId:1000010}).then(qrcodeInfoRes=>{
        setQrcodeInfo(qrcodeInfoRes)
      })
   
    // 页面地址 配置 channel 会自动解析到请求头
    api4794().then(res=>{
    
      setPromotionPage(res)
      
    })


    const  mapData = new Map();
    api3482({pageSize:5, activityId:1000010}).then(res=>{   
        mapData.set('爆款推荐', res?.data?.slice(0,1))
        mapData.set('超值好货', res?.data?.slice(1,3))
        mapData.set('疯狂补贴', res?.data?.slice(3))
        setData(mapData)
    })


  }, [])
  const downApp = async() => {
    
    // 只存在h5 的投放页
    if(DEVICE_NAME === 'wxh5'){
      return setVisible(true)
    }

    Taro.setClipboardData({
      data: qrcodeInfo?.shareToken,
      success: () => {
        // Taro.showToast({
        //   title: '口令已生成, 快去下载吧',
        //   icon:'none'
        // })
        let a = document.createElement('a')
        console.log('复制成功');
        //  解决ios 无法点击下载
        a.setAttribute('style', 'cursor: pointer');
        // TODO: 区分 安卓 和 ios apk
        if(DEVICE_SYSTEM === 'android'){
          a.setAttribute('href', 'https://tsla.bowuyoudao.com/app-release/Android/bw-release-v2.1.4.apk')
        }
        if(DEVICE_SYSTEM === 'ios'){
           a.setAttribute('href', 'https://apps.apple.com/cn/app/%E5%8D%9A%E7%89%A9%E6%9C%89%E9%81%93-%E6%96%87%E7%8E%A9%E4%B8%A5%E9%80%89%E7%94%B5%E5%95%86/id1557160198')
        }      
        a.click() 
      }
    })

  }
  const {run:toGoodsDetail} = useDebounceFn((productId)=>{
    Taro.navigateTo({
      url: `/pages/goods/goodsDetail/index?productId=${productId}`
    })
  }, {wait:200})

  return <View className='Launch'>
    <View className='Launch-img'>
      <Image className='Launch-img-ele' src={banner_promote1}></Image>
    </View>
    <View className='Launch-goods'>
      <Single toGoodsDetail={toGoodsDetail}  downApp={downApp} data={goodData?.get('爆款推荐')[0]} titleInfo={titleArr[0]}></Single>
      <Double toGoodsDetail={toGoodsDetail} downApp={downApp} data={goodData?.get('超值好货')}   titleInfo={titleArr[1] } ></Double>
      <Double toGoodsDetail={toGoodsDetail} downApp={downApp} data={goodData?.get('疯狂补贴')}  titleInfo={titleArr[2]} ></Double>

    </View>
    <View className='Launch-more m-t-22'>
      <Image className='Launch-more-img' onClick={downApp} src={promotionPage?.promotionQrCodeUrl}></Image>
    </View>
    <View className='Launch-down'>
      <Image className='Launch-down-img' onClick={downApp} src={launch_down}></Image>
    </View>
    <Popup headerType='empty' visible={visible} onVisibleChange={()=>setVisible(false)}>
      <Image className='launch-guide-img' src={guideToBrower}></Image>
    </Popup>
  </View>
}

export default Launch