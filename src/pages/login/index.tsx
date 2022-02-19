import Taro from '@tarojs/taro'
import { View, Image, Button, Text, RadioGroup, Radio, Label } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { logo } from '@/constants/images'
import storge, { getToken, session, updateChannel, updateToken } from "@/utils/storge";
import { clearCache, getStatus, sleep } from "@/utils/cachedService";
import { AuthorizedLoginIn, getRechagre } from '@/service/module/login'
import { BwTaro, debounce, queryUrlParams } from '@/utils/base'
import './index.scss'
import api1788, { req1788Config } from '@/apis/21/api1788'
import api2108 from '@/apis/21/api2108'
import api2924 from '@/apis/21/api2924'
import { DEVICE_NAME } from '@/constants'
import { apiUrl, host } from '@/service/http'
import api3566 from '@/apis/21/api3566'
import PreLoadingBOx from '@/components/PreLoading'
import { createIM } from '@/service/im'
import NavigationBar from '@/components/NavigationBar'
import { useRecoilState } from 'recoil'
import { hasLogin } from '@/store/atoms'
import { IHandleCaptureException, Sentry, SENTRY_REPORT_ENV } from "@/sentry.repoter"
import asyncValidate from '../live/setting/asyncValidate'
import { sendCustomEvent } from '@/utils/uma'
import { useWeappLogin, weappCodeLogin } from '@/components/WxComponents/useWeappLogin'
import { useAsync } from '@/utils/hooks'


/**
 * 测试case
 * 1. 新账号 授权手机号
 * 2. 老账号 页面loading 跳转回原页面
 * @returns 
 */
function Login() {
  const page = useMemo(() => Taro.getCurrentInstance(), [])

  // const [getPhone, setGetPhone] = useState<boolean>(false)
  // const [wxAuthed, setWxAuthed] = useState<any>(true)
  const [compelete, setCompelete] = useState<boolean>(false)
  const [radioValue, setRadioValue] = useState<boolean>(false)
  const [loginTitle, setLoginTitle] = useState<string>('')

  const goXieyi = (name, e) => {
    e?.stopPropagation?.()
    Taro.navigateTo({
      url: `/pages/webview/index?name=${encodeURIComponent(name)}`
    })
  }

  const parseSence = async () => {

    const routerInfo = await api3566({ shareNo: page.router?.params.scene })

    const [path1, queries] = routerInfo?.shareUrl?.split('?')
    const url = routerInfo?.shareUrl?.replace(host, '')
    const params = queries.split('&').reduce((res, current) => {
      const [k, v] = current.split('=')
      res[k] = v
      return res
    }, {})

    session.setItem('entryFromPage', {
      path: path1,
      query: params,
    })
    // 解析channel
    asyncValidate(
      {
        isShare: {
          required: true,
        },
        channel: {
          required: true,
        }
      },
      params,
    ).catch((errs) => {
      Sentry?.captureException({
        exceptionName: 'login_scene_route_info_err',
        errs,
        value: {
          scene: page.router?.params.scene,
          ...params,
        },
      } as IHandleCaptureException)
    })

    if (params.isShare) {
      updateChannel(params.channel)
    }
    if (url) {
      url && BwTaro.redirectTo({ url })
      return
    }
  }

  const hanldRadio = (e) => {
    const v = e.detail.value
    setRadioValue(Boolean(Number(v)))
  }

  const afterLogin = (userAct) => {
    let activeInfo = session.getItem('activeInfo');
    clearCache()
    storge.setItem('userCurrentPosition', 'buyer')
    session.setItem('userCurrentPosition', 'buyer')
    // 从注册流程进来
    if (activeInfo && userAct === 'register') {
      return Taro.redirectTo({
        url: '/pages/active/newUserShare/index?activityId=1000009',
        success: () => session.resetItem('activeInfo')
      })
    } else {
      return BwTaro.redirectTo({
        url: session.getItem('redirect') || '/pages/index/index'
      })
    }

  }

  const { authed, loginWithMobile, bingingMobile, getUserDetail } = useWeappLogin({
    autoLogin: false,
    authType: 'silence',
    sendCustomEventName: 'page_login',
    afterLogin,
  })

  const handleSubmit = (e) => {
    if (radioValue) {
      loginWithMobile(e)
    } else {
      Taro.showToast({
        title: '请先阅读协议并同意后绑定手机',
        icon: 'none',
      })
    }
  }

  useEffect(() => {
    if (page.router?.params.scene) {
      parseSence().finally(() => {
        // setCompelete(true)
      })
    } else {
      setLoginTitle('登录')
      getUserDetail(false).finally(async () => {
        await sleep(600)
        setCompelete(true)
      })
    }
  }, [])

  return (
    <div className="login">
      <NavigationBar
        title={loginTitle}
        background={'#ffffff'}
      />
      {!compelete && process.env.TARO_ENV === 'weapp' && <PreLoadingBOx />}
      <Image className="login-logo" src={logo} />
      {/* {!authed.wxAuthed ? <View className="login-btn" onClick={sliceLogin}>微信登录</View> : null} */}
      {!authed.mobileAuthed && <View className="login-phone">
        微信手机号安全登录
        <Button className="login-phone-btn" disabled={bingingMobile} open-type="getPhoneNumber" onGetPhoneNumber={handleSubmit}>微信手机号安全登录</Button>
      </View>}

      {
        API_ENV !== 'prod' &&
        <AtButton full onClick={() => Taro.reLaunch({url: '/pages/index/index'})}>取消登录</AtButton>
      }
      <div className='bw-login-xieyi'>

        <RadioGroup name="login-checked" onChange={hanldRadio} >
          <Radio className='login-radio' id="login-checked-1" value={"1"} checked={radioValue}></Radio>

          <Label for="login-checked-1" className="bw-xieyi-left">
            点击即表示同意
          </Label>
          <Text className='bw-xieyi' onClick={(e) => { goXieyi('用户协议', e) }}>《博物用户协议》</Text><Text className='bw-xieyi' onClick={(e) => { goXieyi('隐私政策', e) }}>《博物隐私政策》</Text>

        </RadioGroup>
      </div>
    </div>
  )
}

Login.config = {
  navigationBarTitleText: '首屏',
}

export default Login
