
import Taro from "@tarojs/taro"
import Popup, { IProps as IPopupProps } from "../Popup"
import { View, Text } from "@tarojs/components"

import './WeappLogin.scss'
import { forwardRef, useCallback, useState } from "react"
import { AtButton } from "taro-ui"
import { useEffect } from "react"
import { clearCache, getStatus, tryCodeLogin } from "@/utils/cachedService"
import api1788 from "@/apis/21/api1788"
import { session, updateToken } from "@/utils/storge"
import { useAsync } from "@/utils/hooks"
import api2924 from "@/apis/21/api2924"
import { IResapi2108 } from "@/apis/21/api2108"
import { IHandleCaptureException, Sentry } from "@/sentry.repoter"
import { useImperativeHandle } from "react"
import { useRef } from "react"
import { sendCustomEvent } from "@/utils/uma"


export type IWeappLoginPopupProps = {
  content?: any;
  onSuccess: () => void;
  // 每次调用用户信息接口 会回调该函数
  onUserInfoUpdate?: (useInfo: IResapi2108['data']) => void;
  /**
   * 强制授权模式 默认false
   */
  forceAuth?: boolean;
  /**
   * 授权方式：强提示授权 | 静默授权
   * 默认 confirmTip
   */
  authType?: 'confirmTip' | 'silence',
  /**
   * 埋点名称
   */
  sendCustomEventName?: string;

  /**
   * 登录描述
   */
  loginDesc: string;
} & IPopupProps

const WeappLoginPopupa = (
  props: IWeappLoginPopupProps,
  ref: any
) => {
  const { loginDesc='授权登录即可领红包' } = props
  const [authed, setAuthed] = useState({
    // 静默授权 不在需要
    wxAuthed: props.authType === 'silence',
    mobileAuthed: false,
  })
  
  const { run: loginWithMobile, pending: bingingMobile } = useAsync((data) => {
    return new Promise(async (reslove, reject) => {
      if (
        data.detail.errMsg === 'getPhoneNumber:fail user deny' ||
        !data.detail.iv ||
        !data.detail.encryptedData
      ) {

        sendCustomEvent(`bind_mobile_cancel`, {
          x_name: props.sendCustomEventName || '',
        })

        // 用户点击取消
        reject()
      } else {
        let authData = {}
        try {
          const code = await getAuthCode()
          let activeInfo = session.getItem('activeInfo');
          authData = {
            code,
            encryptedData: data.detail.encryptedData,
            iv: data.detail.iv,
            appId: WEAPP_APP_ID,
            activityId: activeInfo?.activityId,
            inviteUserId: activeInfo?.inviteUserId
          }
          sendCustomEvent(`bind_mobile_success`, {
            x_name: props.sendCustomEventName || ''
          })
          await api2924(authData);
          clearCache()
          session.resetItem('activeInfo')
          getUserDetail(true)
          reslove(undefined)
        } catch (errs) {
          sendCustomEvent(`bind_mobile_fail`, {
            x_name: props.sendCustomEventName || '',
          })
          Sentry?.captureException({
            exceptionName: 'weapp_login_mobile_fail',
            errs,
            value: authData,
          } as IHandleCaptureException)
          reject(errs)
        }
      }
    })
  }, { manual: true })

  const getUserDetail = async (needReset: boolean) => {
    
    const fn = needReset ? getStatus.reset : getStatus
    fn()
      .then(async (res) => {

        props.onUserInfoUpdate?.(res)
        if (res.mobileStatus === 1) { // 手机号已存在
          props.onVisibleChange?.(false)
          setAuthed({
            wxAuthed: true,
            mobileAuthed: true,
          })
          props.onSuccess?.()
        } else { // 只完成微信授权，没有完成手机号授权
          if (props.forceAuth && process.env.TARO_ENV === 'weapp') props.onVisibleChange?.(true)
          setAuthed({
            wxAuthed: true,
            mobileAuthed: false,
          })
        }
      }).catch(async (err) => {

        if (!needReset && props.authType === 'silence' && process.env.TARO_ENV === "weapp") {
          // 老用户 静默授权直接就登录
          try {
            console.log('tryCodeLogin 1');
            
            await tryCodeLogin()
            getUserDetail(true)
            return
          } catch(e) {
            setAuthed({
              wxAuthed: true,
              mobileAuthed: false,
            })
          }
          
        }

        props.onUserInfoUpdate?.(err?.data)
        if (err.code === 1000) {
          if (props.forceAuth && process.env.TARO_ENV === "weapp") props.onVisibleChange?.(true)
          setAuthed({
            wxAuthed: props.authType === 'silence' ? true : false,
            mobileAuthed: false,
          })
        } else if (err.code === 1010) { // 未绑定手机号
          if (props.forceAuth && process.env.TARO_ENV === "weapp") props.onVisibleChange?.(true)
          setAuthed({ mobileAuthed: false, wxAuthed: true })
        }
      })
  }

  useEffect(() => {
    // 拉取用户信息，获取认证状态
    getUserDetail(false)
  }, [])

  const getAuthCode = useCallback(() => new Promise((reslove, reject) => {
    Taro.login({
      success: res => {
        if (res?.code && !!res?.code) {
          reslove(res.code)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  }), [])

  const { run: getAuth, pending: wxAuthing } = useAsync(async () => {

    const getUserProfile = () => new Promise<Taro.getUserProfile.SuccessCallbackResult>((reslove, reject) => {
      sendCustomEvent(`getUserProfile_start`, {
        x_name: props.sendCustomEventName || ''
      })
      Taro.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          if (res?.encryptedData && res?.iv) {
            sendCustomEvent(`getUserProfile_success`, {
              x_name: props.sendCustomEventName || ''
            })
            reslove(res)
          } else {
            sendCustomEvent(`getUserProfile_fail`, {
              x_name: props.sendCustomEventName || ''
            })
            reject(res)
          }
        },
        fail: (e) => {
          sendCustomEvent(`getUserProfile_fail`, {
            x_name: props.sendCustomEventName || ''
          })
          reject(e)
        }
      })
    })
    let authData = {}
    try {
      const [code, { iv, encryptedData }] = await Promise.all([
        getAuthCode(),
        getUserProfile(),
      ])
      authData = {
        encryptedData, iv, appId: WEAPP_APP_ID, code
      }
      const userInfo = await api1788(authData)
      userInfo?.token && updateToken(userInfo?.token)
      getUserDetail(true)
    } catch (errs) {
      Sentry?.captureException({
        exceptionName: 'weapp_login_auth_fail',
        errs,
        value: authData
      } as IHandleCaptureException)
    }
  }, { manual: true })

  useImperativeHandle(ref, () => ({
    getUserDetail,
  }))

  return <View className='authButtonBox'>
    <Popup
      className='authButtonBox-popup'
      visible={props.visible}
      onVisibleChange={props.onVisibleChange}
      onCancel={props.onCancel}
      layoutCenter
      headerType='empty'
    >
      <View className='authButtonBox-box'>
        <View className='authButtonBox-box-title'>微信账号授权</View>
        {
          props.content ? props.content : <View className='authButtonBox-box-content'>{loginDesc}</View>
        }
        <Text className='myIcon authButtonBox-box-close' onClick={() => {
          props.onCancel?.()
          props.onVisibleChange?.(false)
        }}>&#xe73b;</Text>
        {
          props.authType !== 'silence' && !authed.wxAuthed && <AtButton className='authButtonBox-box-btn' type='primary' onClick={getAuth} disabled={wxAuthing} loading={wxAuthing} >安全登录</AtButton>
        }
        {
          props.authType !== 'silence' && authed.wxAuthed && !authed.mobileAuthed &&
          <AtButton disabled={bingingMobile} loading={bingingMobile} className='authButtonBox-box-btn' type='primary' openType='getPhoneNumber' onGetPhoneNumber={loginWithMobile}>绑定手机号</AtButton>
        }
        {/* 静默授权 直接拉取手机号即可 */}
        {
          props.authType === 'silence' && !authed.mobileAuthed &&
          <AtButton disabled={bingingMobile} loading={bingingMobile} className='authButtonBox-box-btn' type='primary' openType='getPhoneNumber' onGetPhoneNumber={loginWithMobile}>安全登录</AtButton>
        }
      </View>
    </Popup>
  </View>
}

export const WeappLoginPopup = forwardRef(WeappLoginPopupa)

/**
 * 包裹小程序授权
 * <WeappLogin>
 *  {
 *    (userInfo, runAuth) => <Button
 *    onClick={() => {
 *    if (userInfo.mobileStatus === 1) {
 *    去领奖
 *  } else {
 *    runAuth()
 * }
 * }}
 * >登录领奖</Button>
 * }
 * </WeappLogin>
 */
const A = (props: Optional<IWeappLoginPopupProps> & {
  children?: (
    useInfo: IResapi2108['data'],
    /**
     * 执行授权流程
    */
    runAuth: () => void,
    /**
     * 获取用户信息状态
     */
     userInfoFething: boolean,
  ) => React.ReactNode;
}, ref: any) => {

  const [visible, setVisible] = useState(false)
  const [userInfo, setUserInfo] = useState<IResapi2108['data']>()

  const [userInfoFething, setUserInfoFething] = useState(true)

  const { children, onUserInfoUpdate, ...rest } = props

  const WeappLoginPopupprops = {
    ...rest,
    onUserInfoUpdate: (data) => {
      setUserInfo(data)
      setUserInfoFething(false)
    },
    visible,
    onVisibleChange: setVisible,
  }

  const handleTrigger = () => {    
    setVisible(userInfo?.mobileStatus !== 1)
  }

  const refb = useRef()

  useImperativeHandle(ref, () => ({
    WeappLoginPopup: refb.current,
  }))

  return <>
    <WeappLoginPopup
      ref={refb}
      {...WeappLoginPopupprops}
    />
    <View>
      {
        children?.(userInfo, handleTrigger, userInfoFething)
      }
    </View>
  </>
}

export default forwardRef(A)