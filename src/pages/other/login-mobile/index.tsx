import { Input, View, RadioGroup, Radio, Label } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { onValidateData, validateData } from '@/utils/validate'
import { AtButton } from 'taro-ui'
import api2028 from '@/apis/21/api2028'
import api2012 from '@/apis/21/api2012'
import storge, { getToken, session, updateToken } from '@/utils/storge'
import { Text } from '@tarojs/components'
import { DEVICE_NAME } from '@/constants'
import { clearCache, getStatus, getUserInfo } from '@/utils/cachedService'
import { setWxH5Config, useAsync } from '@/utils/hooks'
import { createIM } from '@/service/im'
import './index.scss'
import api2132 from '@/apis/21/api2132'
import api4076 from '@/apis/21/api4076'
import { logo } from '@/constants/images'
// import RadioGroup, { Radio } from '@/components/RadioGroup'
import ListItem from '@/components/ListItem'
import api3698 from '@/apis/21/api3698'
import InputLimit from '@/components/AtInputLimit'
import { BwTaro } from '@/utils/base'

const LoginMobile = () => {
  const [phoneNumber, setPhoneNumber] = useState<any>('')
  const [spanName, setSpanName] = useState<string>('获取验证码')
  const [isSend, setIsSend] = useState<boolean>(false)
  const [code, setCode] = useState<string>(API_ENV !== 'prod' && process.env.NODE_ENV === 'production' ? '777888' : '')
  const [showLoading, setShowLoading] = useState<boolean>(process.env.TARO_ENV === 'h5')
  const [redirect] = useState<any>(session.getItem('redirect'))
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [radioValue, setRadioValue] = useState<any>(0)
  const FormRules = {
    mobile: [
      { required: true, message: "请输入手机号" },
      {
        validator: (rule: any, value: string) => {
          return /^1[3-9]\d{9}$/.test(value);
        },
        message: "请输入正确的手机号",
      },
    ],
    mtCode: [{ required: true, message: "请输入验证码" },]
  }
  // 清除
  const clear = () => {
    setPhoneNumber('')
  }
  const validateDataNum = () => {
    validateData(FormRules, 'mobile', phoneNumber)
  }
  const changeNumber = (e) => {
    // const { value } = e.target
    setPhoneNumber(e.detail.value)

  }
  // 验证码逻辑
  const getVerificationCode = () => {
    if (!isSend && phoneNumber) {
      if (DEVICE_NAME === 'webh5') {

        api2012({ mobile: phoneNumber })
      } else {

        api3698({ mobile: phoneNumber })
      }
      let num = 60
      setSpanName(`${num}s后重发`)
      Taro.showToast({ title: '验证码已发送', icon: 'none' })
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
    } else {
      if (!phoneNumber) {
        Taro.showToast({
          title: '请先输入手机号',
          icon: 'none'
        })
      }
    }
  }

  const changeCode = (e: { detail: { value: any } }) => {
    const { value } = e.detail
    setCode(value)

  }

  const submitPhone = useCallback(async () => {
    if (radioValue !== 1) {
      Taro.showToast({ title: '请先查看协议并确认同意', icon: 'none' })
      return
    }
    const form = { mobile: phoneNumber, mtCode: code }
    const result = await onValidateData(FormRules, form)
    if (result) {
      if (DEVICE_NAME === 'webh5' || process.env.TARO_ENV === 'weapp') {
        const data = await api2028(form)
        data?.token && updateToken(data.token)
        Taro.showToast({ title: '登录成功', icon: 'none' })
        clearCache()
        const res2 = await getUserInfo()
        if (res2.userLevel !== 3) { // 没有商家身份
          storge.setItem('userCurrentPosition', 'buyer')
        }
        if (process.env.TARO_ENV === 'weapp') {
          Taro.reLaunch({
            url: `/pages/index/index`
          })
        } else {
          window.location.replace(redirect || '/pages/index/index')
        }
        // Taro.reLaunch({
        //   url: `/pages/index/index`
        // })
      } else {
        const data = await api2132(form)
        Taro.showToast({ title: '绑定成功', icon: 'none' })
        clearCache()
        const res2 = await getUserInfo()
        storge.setItem('userCurrentPosition', 'buyer')
        session.setItem('userCurrentPosition', 'buyer')

        if (redirect) {
          window.location.replace(redirect)
        } else {
          BwTaro.redirectTo({
            url: `/pages/index/index`
          })
        }
      }
      getStatus()
    }
  }, [phoneNumber, code, redirect, radioValue])

  const { run: submit, pending } = useAsync(submitPhone, { manual: true })

  const wxh5Login = async () => {
    if (getToken()) {
      getStatus.reset().then(result => {
        if (result.mobileStatus !== 1) {
          setShowLoading(false)
          Taro.hideLoading()
        } else {
          window.location.href = redirect || window.location.origin + '/pages/index/index'
        }

      }).catch(err => {
        setShowLoading(false)
        Taro.hideLoading()
      })

      // if (result && result?.code !== 1010) {
      //   // 如果没绑定就跳到缓存页面或者首页
      //   window.location.href = redirect || window.location.origin + '/pages/index/index'
      // } else {
      //   setShowLoading(false)
      //   Taro.hideLoading()
      // }
    }
  }
  const bcak = () => {
    BwTaro.navigateTo({
      url: '/pages/index/index'
    })
  }
  useEffect(() => {
    if (DEVICE_NAME === 'wxh5') {
      Taro.showLoading({
        title: '登录中...'
      })
      wxh5Login()
    } else if (DEVICE_NAME === 'webh5') {
      setShowLoading(false)
    }

  }, [DEVICE_NAME])

  const goXieyi = (name) => {
    Taro.navigateTo({
      url: `/pages/webview/index?name=${encodeURIComponent(name)}`
    })
  }

  const handleRadio = (e) => {
    const v = e.detail.value
    setRadioValue((Number(v)))
  }

  return (
    <div className='bw-login-mobile'>
      <img className='bw-login-mobile-logo' src={logo} alt="" />
      <div className='bw-login-mobile-content'>
        <div className='bw-login-mobile-content-mobile'>
          <Input placeholder='输入手机号' type='number' adjustPosition onInput={changeNumber} onBlur={validateDataNum} value={phoneNumber}></Input>
          {/* <InputLimit placeholder='输入手机号'  onInput={changeNumber} maxlength={6} onBlur={validateDataNum} value={phoneNumber}></InputLimit> */}
          <i className='myIcon' onClick={clear}>&#xe723;</i>
        </div>
        <div className='bw-login-mobile-content-mobile'>
          <Input className='bw-login-mobile-content-mobile-input' adjustPosition maxlength={6} placeholder='输入验证码' onInput={changeCode} value={code}></Input>

          {/* <span className='bw-login-mobile-content-mobile-line'>|</span> */}
          <span className='bw-login-mobile-content-mobile-code' onClick={getVerificationCode} style={{ color: !isSend ? '#AA1612' : '#999999' }}>{spanName}</span>
        </div>
      </div>
      <div className='bw-login-mobile-btn'>
        <AtButton type='primary' onClick={submit} loading={pending} disabled={pending}>
          {DEVICE_NAME === 'webh5' ? '登录' : '绑定手机号'}
        </AtButton>
        {/* <div className='bw-login-xieyi'>
          <RadioGroup value={radioValue} onChange={() => {
            setRadioValue(1)
          }}>
            <Radio name={1}></Radio>
          </RadioGroup>
          <Text className='bw-xieyi-left'>点击即表示同意 <Text className='bw-xieyi' onClick={() => { goXieyi('用户协议') }}>《博物用户协议》</Text><Text className='bw-xieyi' onClick={() => { goXieyi('隐私政策') }}>《博物隐私政策》</Text></Text>
        </div> */}

        <View className="login-mobile-footer m-t-24">
          <RadioGroup name="a" onChange={handleRadio}>
            <Radio id="login-mobile-radio-1" value="1" checked={Number(radioValue) === 1} />
            <Label for="login-mobile-radio-1" className="fz26 m-l-8">点击即表示同意</Label>
            <Text className='bw-xieyi fz26' onClick={() => { goXieyi('用户协议') }}>《博物用户协议》</Text>
            <Text className='bw-xieyi fz26' onClick={() => { goXieyi('隐私政策') }}>《博物隐私政策》</Text>
          </RadioGroup>
        </View>

      </div>
      {
        showLoading ? <div className='bw-hideBox'>
        </div> : null
      }

    </div>
  )
}

export default LoginMobile
