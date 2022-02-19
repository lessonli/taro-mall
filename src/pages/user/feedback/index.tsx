
import { View,Text } from "@tarojs/components";
import { useCallback, useState, useEffect } from "react";
import { AtInput, AtButton, AtTextarea } from "taro-ui";
import { Input } from "@tarojs/components";
import { RadioGroup, Radio } from '@/components/RadioGroup'
import Upload, { VideoOutLined, IFile } from '@/components/Upload/index'
import api4412 from "@/apis/21/api4412";
import { useDebounceFn } from "ahooks";

import Taro from "@tarojs/taro";
import './index.scss'



type Ifeedback = {
  albumPicsArr?: Array<string>,
  checked?: number,
  name?: string,
  content: string,
  phoneOrEmail?: string
}

function FeedBack(){
  const [values, setValues] = useState<Ifeedback>({
    albumPicsArr: [],
    checked: -1,
    name: '',
    content: '',
    phoneOrEmail: ''

  });
  const handleValuesChange = (name, value) => {
      setValues({
        ...values,
        [name]: value
      })
    
  }
  // const { run: handleFeedback } = useDebounceFn(() => {
    const {run:handleFeedback} = useDebounceFn(()=>{
// const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    // const emailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if(values.checked === -1) {return Taro.showToast({title: '请选择反馈类型', icon: "none"}) }
    if(values.content === '' &&  values.albumPicsArr?.length=== 0) {return Taro.showToast({title: '请填写反馈内容', icon: "none"}) }
    if(values.name === '' ) {return Taro.showToast({title: '请输入姓名', icon: 'none'}) }
    if(values.phoneOrEmail === '' ) {return Taro.showToast({title: '请输入手机号或邮箱', icon: "none" }) }
    
    // const phoneMatch = phoneReg.test(values.phoneOrEmail as string)
    // const emailMatch  =emailReg.test(values.phoneOrEmail as string)
  
    console.log(values, 'values');
    const images = values.albumPicsArr.map(item=> item.url );        
    api4412({
      contactUser: values.name,
      contactMobile: values.phoneOrEmail,
      type: values.checked,
      content: values.content,
      images: images.join(',')

    }).then(res=>{
      setValues({
        albumPicsArr: [],
        checked: -1,
        name: '',
        content: '',
        phoneOrEmail: ''
      })
      Taro.showToast({title: '反馈成功', icon: 'none'})
    }).catch((err)=>{
      Taro.showToast({title: err.message, icon: 'none'})
    })
    }, {wait:100})
  return  <View className='bw-feadback'>
        <View className='bw-feadback-type'>
          <Text className='bw-feadback-title'>反馈类型</Text>
          <Text className='bw-feadback-must'>*</Text>
          <RadioGroup value={values.checked} onChange={(v) => handleValuesChange('checked', v)}>
            <Radio name={0}>
              <span>软件问题</span>
            </Radio>
            <Radio name={1}>
              <span>退货退款</span>
            </Radio>
            <Radio name={2}>
              <span>投诉</span>
            </Radio>
          </RadioGroup>
        </View>
        <View className='bw-feadback-content'>
          <Text className='bw-feadback-title'>反馈内容</Text>
          <Text className='bw-feadback-must'>*</Text>
          <AtTextarea maxLength={200} value={values.content} onChange={(v)=>{handleValuesChange('content', v)}} placeholder='请输入反馈内容' ></AtTextarea>
          <View  className='bw-feadback-content-upload'>
            <Upload             
              max={3}
              value={values.albumPicsArr}
              onChange={(v) => handleValuesChange('albumPicsArr', v)}
            />
          </View>
        </View>
        <View className='bw-feedback-contact'>
          <AtInput  name='name' value={values.name} title='联系人姓名' placeholder='请输入姓名' onChange={(v)=>{handleValuesChange('name', v)}} ></AtInput>
          <AtInput  name='phoneOrEmail' value={values.phoneOrEmail}  title='联系方式' placeholder='输入手机号或者邮箱' onChange={(v)=>{handleValuesChange('phoneOrEmail', v)}} ></AtInput>
        </View>
        <View className='bw-feedback-action'>
          <View className='bw-feedback-action-btn' ><AtButton onClick={()=>{handleFeedback()}} type='primary'>提交反馈</AtButton></View>
          <View className='bw-feedback-action-record' onClick={()=>{Taro.navigateTo({url: '/pages/user/feedback/recordList/index'})}}>反馈记录</View>
        </View>
  </View>
}

export default FeedBack