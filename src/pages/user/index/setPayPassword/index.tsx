
import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { useMount, useDebounceFn } from 'ahooks'
import Taro from '@tarojs/taro'
import { getStatus, getUserInfo } from '@/utils/cachedService'

import api3578 from '@/apis/21/api3578'
import api2412 from '@/apis/21/api2412' //设置支付密码
import IResapi2100 from '@/apis/21/api2100'
import PayPassword from '@/components/PayPassword'

import InputLimit from '@/components/AtInputLimit'
import { AtInputMoney } from '@/components/AtInputPlus'
import { queryUrlParams } from '@/utils/base'
import { useAsync } from '@/utils/hooks'
import './index.scss'
import { isAppWebview } from '@/constants'

function SetPayPassword() {
  const [spanName, setSpanName] = useState<string>('获取验证码')
  const [isSend, setIsSend] = useState<boolean>(false)
  const [code, setCode] = useState<string>('7788')
  const [userInfo, setUserInfo] = useState<any>()
  const [demoValue, setDemoValue] = useState('')
  const [formValues, setFormValues] = useState<any>({
    'mtCode': '',
    'password': '',
    'surePassword': '',
  })

  const { run: handleSubmit, pending } = useAsync(async() => {
    let numReg = /^\d{6}$/g
    if (!formValues.mtCode) {
      return Taro.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
    if (!formValues.password) {
      return Taro.showToast({
        title: '请输入支付密码',
        icon: 'none'
      })
    }
    if (formValues.password.length != 6) {
      return Taro.showToast({
        title: '密码长度只允许6位',
        icon: 'none'
      })
    }
    if (!formValues.surePassword) {
      return Taro.showToast({
        title: '请输入确认密码',
        icon: 'none'
      })
    }
    if (formValues.surePassword !== formValues.password) {
      return Taro.showToast({
        title: '两次输入不相同',
        icon: 'none'
      })
    }
    if (!(numReg.test(formValues?.surePassword))) {
      return Taro.showToast({
        title: '请输入纯数字',
        icon: 'none'
      })
    }
    // 支付密码
    let pathHistory = Taro.getCurrentPages()
    console.log(pathHistory, 'pathHistory');
    let prevPage = pathHistory[pathHistory?.length - 1 -1]?.path || undefined
    let prevUrl = prevPage?.split('?')[0] || undefined
    const res =  await api2412({ ...formValues, mobile: userInfo.mobile })
    getStatus.reset()
      
      // TODO: 改成白名单模式 避免 多个 else if
     const whiteList = ['/pages/order/detail/index', '/pages/order/list/index', '/pages/user/index/wallet/index', '/pages/active/redPacket/index', '/pages/order/pay/index', '/pages/system/accountSecurity/index']
      if(!isAppWebview){
        return Taro.navigateBack()
      } 
      if(!prevPage && isAppWebview){
        return  WebViewJavascriptBridge.callHandler('closeWebview', JSON.stringify({}))
        // 此处这里 把 单独关于 app 支付密码的单独列出来 后期如果 还有别的页面 直接添加即可
      }else if(prevUrl === '/pages/order/genOrder/index' && isAppWebview){
        //  如果是生成订单页直接关闭 webview 
        return WebViewJavascriptBridge.callHandler('closeWebview', JSON.stringify({}))
      } else if(whiteList.includes(prevUrl) && isAppWebview){
        return Taro.navigateBack()
      }
      //  兜底
      return  Taro.showToast({title: '设置成功', icon: 'none'})
   
  }, { manual:true })

  const handleChange = (type: string, v: number | string) => {
    console.log(v, 'v', type, 'type');
    setFormValues({ ...formValues, [type]: v })

  }
  const getVerificationCode = () => {
    if (!isSend) {
      api3578()
      let num = 60
      setSpanName(`${num}s后重发`)
      let timer = setInterval(() => {
        if (num > 0) {
          num--
          setSpanName(`${num}s后重发`)
        } else {
          clearInterval(timer)
          setSpanName('获取验证码')
          setIsSend(false)
        }
      }, 1000)

      setIsSend(true)
    }
  }

  useEffect(() => {
    (async () => {
      const res = await getUserInfo()
      setUserInfo(res)
    })()
  }, [])

  return (
    <View className='SetPayPassword'>
      <AtForm className='SetPayPassword-form'>
        <View className='SetPayPassword-b-b'>
          <View className='SetPayPassword-form-item SetPayPassword-form-item-no-b '>
            <View className='SetPayPassword-form-item-label'>手机号码</View>
            <View className='SetPayPassword-form-item-value'>{userInfo?.mobile}</View>
          </View>
        </View>


        <View className='bw-password-yzm'>
          {/* <AtInput style={{textAlign: 'left'}}  name='code' value={formValues?.mtCode}  title='验证码' placeholder='请输入验证码' onChange={(v)=>{handleChange("mtCode", v)}}></AtInput> */}
          <Text className='bw-password-yzm-label' >验证码</Text>
          <InputLimit className='bw-password-yzm-value' maxlength={6} onInput={(e) => handleChange('mtCode', e.target.value)} value={formValues.mtCode} placeholder='请输入验证码' ></InputLimit>
          {/* <View className='SetPayPassword-form-item-yzm'> {spanName}</View> */}
          {!isSend && <View className='SetPayPassword-form-item-yzm' onClick={getVerificationCode} style={{ color: '#AA1612' }}>{spanName}</View>}
          {isSend && <View className='SetPayPassword-form-item-yzmActive' onClick={getVerificationCode} style={{ color: '#999999' }}>{spanName}</View>}
        </View>

        <View className='SetPayPassword-b-b'>
          <AtInput name='payPassword' title='支付密码' value={formValues.password} type='password' placeholder='请输入支付密码' onChange={(v) => handleChange('password', v)}></AtInput>
        </View>

        <View className='SetPayPassword-b-b'>
          <AtInput name='surePassword' title='确认密码' value={formValues.surePassword} type='password' placeholder='请再次输入密码' onChange={(v) => handleChange('surePassword', v)}></AtInput>
        </View>
      </AtForm>
      <View className='p-24'>   <AtButton className='SetPayPassword-payPassword-btn'  onClick={() => handleSubmit()} disabled={pending} type='primary'>确认</AtButton></View>

    </View>
  )
}
export default SetPayPassword