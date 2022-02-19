import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtInput, AtForm,AtButton } from "taro-ui";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";


import Big from "big.js";

import ListItem from "@/components/ListItem";
import BWPicker from "@/components/SelectPicker";
import { AtInputMoney } from "@/components/AtInputPlus";
import ChoosePay from "@/components/PayFeePopup/ChoosePay";
import { XImage } from "@/components/PreImage";

import { readPacketBg } from "@/constants/images";
import { PAY_TYPE } from "@/constants";
import compose,{days2second, fen2yuan, formatMoeny, hours2Second, yuan2fen} from "@/utils/base";

import api4920 from "@/apis/21/api4920";
import api4686,{IResapi4686} from "@/apis/21/api4686"; // 红包配置
import api4656 from "@/apis/21/api4656"; // 余额支付
import api4658 from "@/apis/21/api4658"; // 微信支付
import api4802 from "@/apis/21/api4802"; // 新版余额支付 
import api4804 from "@/apis/21/api4804"; // 新版 微信支付  后面 旧的支付方式会慢慢下掉
import paySdk from "@/components/PayFeePopup/paySdk";
import dayjs from "dayjs";
import { getDataPicker,getDataHoursPicker } from "./constant";
import './index.scss'
import RadioGroup, { Radio } from "@/components/RadioGroup";
import { useAsync } from "@/utils/hooks";



interface Ivisible  {
  selectPicker:boolean,
  tx:boolean
}
interface IFormData {
  totalMoney: string|number,
  redPacketNum: string | number,
  // 领取有效期(有效期天数)
  expireSeconds: string|number,
  // 使用有效期
  receiveExpireSeconds: string|number,
  useRange: 1 | 2 // 1-全平台可用2-仅店铺可用
}
type IFormDataKey = keyof IFormData

// type IItem = Required<Required<IResapi1940>['data']>['data'][0]
type IRedConfg = Required<Required<IResapi4686>['data']>

function CreateRedPacket(){
  const [visible, setVisible] = useState<Ivisible>({
    selectPicker: false,
    tx:false
  })
  const [redConfig, setRedConfig] = useState<IRedConfg>()

  const [formData, setFormData] = useState<IFormData>({
    totalMoney: '',
    redPacketNum: '',
    expireSeconds: '7', // 领取(有效期天数)
    receiveExpireSeconds: '12', // 使用有效期
    useRange:1
    
  })
  const [status, setStatus] = useState<number>() // 0 领取有效期 1 使用有效期
  const [redPacketId, setRedPacketId] = useState<string>('')
  
  useEffect(()=>{
    (async()=>{
      const redConfigRes = await api4686()
      setRedConfig(redConfigRes)
    })()
  },[])


  const showModal = (key:('selectPicker'|'tx' )):void=>{
    setVisible({...visible, [key]:true})
  }
  const closeModal =(key:('selectPicker'|'tx' )):void=>{
    setVisible({...visible, [key]:false})
  }

  // 输入框change
  const inputChange=(key:IFormDataKey, value:(string|number))=>{
    setFormData({...formData, [key]:Number(value)})
  }

  //  时间选择器的时间change
  const handleChange=(e)=>{    
  //  refexpireSeconds.current = e[0]
  if(status===0){
   
  }
  status=== 0?setFormData({...formData, expireSeconds:e[0]}): setFormData({...formData, receiveExpireSeconds:e[0]})
   
  }

  const isRule  = useMemo(()=>{
    const {totalMoney, redPacketNum} = formData
    if(totalMoney && redPacketNum){
      
      if(redPacketNum  <  redConfig?.redPacketTotalCountMin) {
         Taro.showToast({
          title: '小于最小红包数量',
          icon: 'none'
        })
        return false
      }

      if(redPacketNum  >  redConfig?.redPacketTotalCountMax) {
        Taro.showToast({
         title: '大于最大红包数量',
         icon: 'none'
       })
       return false
     }
     

      let bTotmoney = new Big(totalMoney)
      // 单个红包的钱
      const oneRedMoney = bTotmoney.div(redPacketNum).toNumber()
      
      if(oneRedMoney < redConfig?.averageSingleRedPacketAmountMin){
        Taro.showToast({
          title: '单个红包小于最小钱数',
          icon: 'none'
        })
        return false
      }
      if(oneRedMoney > redConfig?.averageSingleRedPacketAmountMax){
        Taro.showToast({
          title: '单个红包大于最大钱数',
          icon: 'none'
        })
        return false
      }
     return true
    }

    return false

  }, [formData.totalMoney, formData.redPacketNum,redConfig?.averageSingleRedPacketAmountMax,redConfig?.averageSingleRedPacketAmountMin,redConfig?.redPacketTotalCountMin, redConfig?.redPacketTotalCountMax])

  const handlePay = async ({payType, payPassword}) => {
    const fn = payType === PAY_TYPE.WX.value ?
    
    paySdk(() => api4804({
     orderNo:redPacketId
      
    }), payType) :
    api4802({
      payPassword: payPassword,
      orderNo:redPacketId
    })

     fn.then(data=>{
      // const uuid = data.uuid || data.res.uuid

      redPacketId && Taro.navigateTo({url: `/pages/active/redPacket/detail/index?uuid=${redPacketId}`})
      setFormData({
        totalMoney: '',
        redPacketNum: '',
        expireSeconds: '7',   
        receiveExpireSeconds: '12',
        useRange: 1, // 使用范围
      })
    })
    
  }
  const handleItemChange=(status) =>{
    showModal('selectPicker')
    setStatus(status)
  }
  const {run:beforeOpen, pending} = useAsync(async()=>{
    if (pending) return
    const res = await api4920({
      redPacketAmount: formData.totalMoney,
      redPacketCount: formData.redPacketNum,
      expireSeconds:days2second(Number(formData.expireSeconds)),
      receiveExpireSeconds: hours2Second(Number(formData?.receiveExpireSeconds)),
      useRange: formData?.useRange,
      type:1,
      // 1-新人红包2-普通红包3-拼手气红包  
      amountStrategy:1
    })
    setRedPacketId(res?.uuid)
    showModal('tx')

    

  },{manual:true})
  return<> 
    <View className='create-redPacket'>
      <View className='create-redPacket-img' onClick={()=>window.location.href ='https://mp.weixin.qq.com/s/P7Ndhw3cuIKcEnPKS6-9Bg'}>
        <View className='create-redPacket-img-rules'>
          <View>1.领取红包自动关注店铺</View>
          <View>2.新用户绑定成专属粉丝</View>
          <View>3.未领完和领取未使用的红包都自动退回至余额</View>
        </View>
      </View>
      <View className='create-redPacket-con'>
        <View className='create-redPacket-con-item'>
         <View className='create-redPacket-con-item-con'>
            <View className='create-redPacket-con-item-con-label'>总金额</View>
            <View> <AtInputMoney name='totalMoney' type='number' value={formData.totalMoney as string} onChange={(value)=>inputChange('totalMoney',value)}  placeholder='输入红包金额'></AtInputMoney> 元</View>
         </View>
         <View className='create-redPacket-con-item-tip'>未领完和领取未使用的红包都自动退回至余额</View>
        </View>
        <View className='create-redPacket-con-item'>
         <View className='create-redPacket-con-item-con'>
            <View className='create-redPacket-con-item-con-label'>红包数量</View>
            <View className='create-redPacket-con-item-con-label-input'>
               <AtInput
              name='redPacketNum' 
              type='number' 
              value={formData.redPacketNum} 
              placeholder='输入红包数量'
              onChange={(value)=>inputChange('redPacketNum',value)}
            />个
            </View>
         </View>
         <View className='create-redPacket-con-item-tip'>最大支持{redConfig?.redPacketTotalCountMax}个，每个不小于{fen2yuan(redConfig?.averageSingleRedPacketAmountMin)}元，不大于{fen2yuan(redConfig?.averageSingleRedPacketAmountMax)}元</View>
        </View>
        <View className='create-redPacket-con-item'>
          <ListItem type={1} left='领取有效期' right={`${formData.expireSeconds}天`} handleClick={()=>handleItemChange(0)}></ListItem>
        </View>
        <View className='create-redPacket-con-item-tip'>未领完的红包金额在<Text className="tipText">{formData.expireSeconds}</Text>天后自动退回余额</View>
        <View className='create-redPacket-con-item'>
          <ListItem type={1} left='使用有效期' right={`${formData.receiveExpireSeconds}小时`} handleClick={()=>handleItemChange(1)}></ListItem>
        </View>
        <View className='create-redPacket-con-item-tip'>领取未使用的红包金额统一在<Text className="tipText">过期</Text>后退回余额</View>
        <View className="create-redPacket-con-item">
      
          <ListItem
            type={1}
            left='使用范围'
            icon={null}
            right={<>
            <RadioGroup value={formData?.useRange} onChange={(v)=>inputChange('useRange',v)}> 
              <Radio name={1}>
                <span>全平台可用</span>
              </Radio>
              <Radio name={2}>
                <span>仅店铺可用</span>
              </Radio>
          </RadioGroup>
          </>}
          ></ListItem>
      
        </View>
      </View>
      <View className='create-redPacket-totalMoney'>
        <View className='create-redPacket-totalMoney-money'>
          ￥{compose(formatMoeny,fen2yuan)(formData.totalMoney)}
        </View>
        <AtButton onClick={beforeOpen} className='create-redPacket-totalMoney-action' disabled={isRule?false:true}>塞钱进红包</AtButton>
        <View className='create-redPacket-totalMoney-send' onClick={()=>Taro.navigateTo({url:'/pages/active/redPacket/list/index'})} >发出的红包</View>
      </View>
    </View>
    {/* // 0 领取有效期 1 使用有效期 */}
    <BWPicker 
      visible={visible.selectPicker}
      data={status===0 ? getDataPicker : getDataHoursPicker}
      cols={1}
      headerType='empty'
      value={status === 0?[formData?.expireSeconds] :[formData.receiveExpireSeconds]}
      onVisibleChange={()=>closeModal('selectPicker')}
      onChange={(e)=>handleChange(e)}
    >
    </BWPicker>
    <ChoosePay 
      visible={visible.tx}
      payAmount={Number(formData.totalMoney)}
      onClose={()=>closeModal('tx')}
      onSubmit={handlePay}
    ></ChoosePay>
  </>
}

export default CreateRedPacket