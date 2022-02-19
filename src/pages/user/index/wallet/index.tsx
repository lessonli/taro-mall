import { useState,useCallback,useMemo, useEffect } from 'react';
import Taro   from '@tarojs/taro'
import ListItem from "@/components/ListItem";
import storge, { isBuyerNow } from "@/utils/storge";
import { getStatus, getMerchantInfo } from '@/utils/cachedService';
import compose, { formatMoeny, fen2yuan } from "@/utils/base";

import api2476, {IResapi2476} from '@/apis/21/api2476'; //商户信息
import api2116 from '@/apis/21/api2116';  // 用户
import './index.scss'

import { View,Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/runtime';

export type Iprops = Required<IResapi2476>['data']


function Wallet(){
  const isBuyer = isBuyerNow()
  const [info, setInfo] = useState<any>()
  // const [data, setData] = useState<Iprops>()
  const [userInfo, setUserInfo] = useState<any>()
  const [merchantInfo, setMerchantInfo] = useState<any>() 
  useEffect(()=>{
    (async()=>{
    const fn = isBuyer? api2116 : api2476 
    const res =  await fn()
      setInfo(res)
    })()
  },[isBuyer])

  useDidShow(() => {
    (async()=>{
      const userInfoRes= await getStatus.reset()
      setUserInfo(userInfoRes)
      if(!isBuyer){
        const merchantInfoRes = await getMerchantInfo.reset()
        setMerchantInfo(merchantInfoRes)
     }
    })()
  })  
  const toPage = (url) => {    
    if (!url) return
    Taro.navigateTo({
      url:url
    })
  }
//  保证金
  const handleEarnestMoney= ()=>{
    // const path = Taro.getCurrentInstance().router?.path
    // let currentPath =  encodeURIComponent(path)
    if(merchantInfo?.authStatus !== 0) {
      return  toPage('/pages/merchant/earnestMoney/index')
    } else{
      return Taro.showToast({title: '请进行店铺认证', icon: 'none'})
    }
  }

  //  设置支付密码
  const handleSettingPassword=(status)=>{
    toPage('/pages/user/index/setPayPassword/index')
  }
  //  店铺认证
  const  toStoreApprove = useCallback(status=>{
    const path = Taro.getCurrentInstance().router?.path
    let currentPath =  encodeURIComponent(path)
    let targetUrl = isBuyer?'/pages/user/certify/index': '/pages/merchant/storeApprove/index'
    if(status ===0 ){
      toPage(`${targetUrl}?sourceUrl=${currentPath}`)
    }
  },[isBuyer])
  let certification = useMemo(()=>{
    const data = isBuyer? userInfo: merchantInfo   
    console.log(data, 'info1');
     
    if(data?.authStatus===0){
      return {color: '#AA1612',value: '去认证' , status: 0}
    }
    if(data?.authStatus===1){
      return {color: '#C19529',value: '审核中' ,status: 1 }
    }
    if(data?.authStatus===2){
      return {color: '#666666',value: '已认证', status: 2   }
    }
  },[userInfo,merchantInfo, isBuyer])
  
  let payPasswordStatus = useMemo(()=>{
    if(userInfo?.payPasswordStatus===0){
      return {color:"#AA1612", value: "去设置", status:0}
    } else if(userInfo?.payPasswordStatus===1){
      return {color:"#666666", value: "已设置", status:1}
    }
   
  }, [userInfo])
  const  iconLock = <View className='myIcon fz26'>&#xe727;</View>
  const  iconRight = <View className='myIcon fz26'>&#xe726;</View>



  return(
   <div className='wrapper'>
     <div className='wallet-list'>
       {/*买家*/}
       <ListItem
         className='wallet-list-item'
         type={1}
         handleClick={()=>toPage('/pages/user/index/pledgeMoney/index?isBuyer=true')}
         left={<div className='wallet-list-leftItem'> <Text  className='myIcon wallet-list-leftItem-icon'>&#xe730;</Text>竞拍保证金</div>}
       />
       <ListItem
         className='wallet-list-item'
         type={1}
         handleClick={()=>toPage('/pages/user/index/accountBalance/index')}
         left={<div className='wallet-list-leftItem'> <Text className='myIcon wallet-list-leftItem-icon'>&#xe736;</Text>余额</div>}
         right={<Text className='color666'><Text >￥</Text>{compose(formatMoeny, fen2yuan)(info?.availableAmount)}</Text>}
       />
       {
         isBuyer &&  <ListItem
         className='wallet-list-item'
         type={1}
         handleClick={()=>toPage('/pages/user/couponCenter/index')}
         left={<div className='wallet-list-leftItem'> <Text className='myIcon wallet-list-leftItem-icon'>&#xe75a;</Text>红包卡券</div>}
       />
       }
     </div>
     {/*买家*/}
     {isBuyer && <> <div className='wallet-list wallet-list-one'>
       <p className='wallet-list-title'>账户安全</p>
       <ListItem
         className='wallet-list-item'
         type={1}
         handleClick={()=>{toStoreApprove(certification?.status)}}
         icon={certification?.status===2 ? iconLock: iconRight}
         right={<View className='fz32' style={{color: certification?.color}} > {certification?.value} </View>}
         left={<div className='wallet-list-leftItem'> <Text className='myIcon store wallet-list-leftItem-icon'>&#xe737;</Text>实名认证</div>}
       />
     </div>
      <View className='wallet-list'>
      <ListItem
        className='wallet-list-item'
        type={1}
        handleClick={()=>handleSettingPassword(payPasswordStatus?.status)}
        left={<div className='wallet-list-leftItem'> <i className='myIcon store wallet-list-leftItem-icon'>&#xe734;</i>支付密码</div>}
        right={<span style={{color: payPasswordStatus?.color}}>{payPasswordStatus?.value}</span>}
      />
    </View>
     </>
     }
     {/*卖家*/}
     {!isBuyer && <>
       <div className='wallet-list m-t-24'>
         <ListItem
           className='wallet-list-item'
           handleClick={()=>toPage('/pages/user/index/pledgeMoney/index?isBuyer=false')}
           left={<div className='wallet-list-leftItem'> <i className='myIcon icon-account wallet-list-leftItem-icon '>&#xe733;</i>发拍保证金</div>}
         />
         <ListItem
           className='wallet-list-item'
           type={1}
           handleClick={()=>{toPage('/pages/user/paymentForGoods/index?commission=2')}}
           left={<div className='wallet-list-leftItem'> <i className='myIcon icon-account wallet-list-leftItem-icon'>&#xe735;</i>货款</div>}
           right={<Text className='color666'><Text >￥</Text>{compose(formatMoeny, fen2yuan)(info?.productAvailableAmount)}</Text>}
           
         />
         <ListItem
           className='wallet-list-item'
           type={1}
           handleClick={()=>toPage('/pages/user/paymentForGoods/index?commission=1')}
           left={<div className='wallet-list-leftItem'> <i className='myIcon icon-account wallet-list-leftItem-icon'>&#xe735;</i>佣金</div>}
           right={<Text className='color666'><Text >￥</Text>{compose(formatMoeny, fen2yuan)(info?.commissionAvailableAmount)}</Text>}
         />
         <ListItem
           className='wallet-list-item'
           type={1}
           handleClick={handleEarnestMoney}
           left={<div className='wallet-list-leftItem'> <Text className='myIcon icon-account wallet-list-leftItem-icon'>&#xe72b;</Text>店铺保证金</div>}
           right={merchantInfo?.authStatus !==0 &&  <span className='color666'>{ '￥'+compose(formatMoeny, fen2yuan)(info?.marginShopAmount)}</span>}
         />
       </div>
         <p className='wallet-list-title'>店铺安全</p>
         <View className='wallet-list'>
         <ListItem
           className='wallet-list-item'
           type={1}
           handleClick={()=>{toStoreApprove(certification?.status)}}
           icon={certification?.status===2 ? iconLock: iconRight}
           right={<View className='fz32' style ={{color: certification?.color}} > {certification?.value} </View>}
           left={<div className='wallet-list-leftItem'> <i className='myIcon store wallet-list-leftItem-icon'>&#xe730;</i>店铺认证</div>}
         />
        <ListItem
          className='wallet-list-item'
          type={1}
          handleClick={()=>handleSettingPassword(payPasswordStatus?.status)}
          left={<div className='wallet-list-leftItem'> <i className='myIcon store wallet-list-leftItem-icon'>&#xe734;</i>支付密码</div>}
          right={<span style={{color: payPasswordStatus?.color}}>{payPasswordStatus?.value}</span>}
        />
      </View>
     </>}
   </div>
  )
}

export default  Wallet
