import api1788 from "@/apis/21/api1788"
import api2924 from "@/apis/21/api2924"
import { IHandleCaptureException, Sentry } from "@/sentry.repoter"
import { clearCache, getStatus, tryCodeLogin } from "@/utils/cachedService"
import { useAsync } from "@/utils/hooks"
import { session, updateToken } from "@/utils/storge"
import { sendCustomEvent } from "@/utils/uma"
import { useEffect, useRef, useState } from "react"
import Taro from '@tarojs/taro'

/**
 * 小程序授权code 可以换取openid
 * @returns 
 */
 export const getWeappAuthCode = () => new Promise((reslove, reject) => {
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
})

/**
 * 登录  | 新人注册 
 */
type UserAct = 'login' | 'register'

/**
 * 小程序 code 登录
 * @returns 
 */
export const weappCodeLogin = async () => {
  const code = await getWeappAuthCode()
  console.log('code', code);
  
  const userInfo = await api1788({code, appId: WEAPP_APP_ID})
  userInfo?.token && updateToken(userInfo?.token)
  return userInfo?.token
}

/**
 * 小程序 getUserProfile 授权补全用户信息
 */
export const getWeappUserProfileAuth = async (props: {
  sendCustomEventName?: string;
}) => {

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
        getWeappAuthCode(),
        getUserProfile(),
      ])
      authData = {
        encryptedData, iv, appId: WEAPP_APP_ID, code
      }
      const userInfo = await api1788(authData)
      userInfo?.token && updateToken(userInfo?.token)
      getStatus.reset()
    } catch (errs) {
      Sentry?.captureException({
        exceptionName: 'weapp_login_auth_fail',
        errs,
        value: authData
      } as IHandleCaptureException)
    }



}

export const useWeappLogin = (props: {
  autoLogin: boolean;
  /**
   * 授权方式：强提示授权 | 静默授权
   * 默认 confirmTip 强提示授权
   */
   authType?: 'confirmTip' | 'silence';

   sendCustomEventName?: string;
  /**
   * 登录完成后逻辑
   */
   afterLogin: (act: UserAct) => Promise<unknown>;
}) => {
  const [authed, setAuthed] = useState({
    // 静默授权 不在需要
    wxAuthed: props.authType === 'silence',
    mobileAuthed: false,
  })

  /**
   * 登录  | 新人注册 
   */
  const userAct = useRef<UserAct>('login')

  const getUserDetail = async (needReset: boolean): Promise<unknown> => {
    console.log(888, 'getUserDetail', needReset);
    
    const status = {...authed}
    const fn = needReset ? getStatus.reset : getStatus
    try {
      const res = await fn()
      Object.assign(status, {
        wxAuthed: true,
        mobileAuthed: res.mobileStatus === 1,
      })
      setAuthed(status)
      await props.afterLogin(userAct.current)
      return Promise.resolve(status)
    } catch (err) {
      if (!needReset && props.authType === 'silence' && process.env.TARO_ENV === "weapp") {
        // 老用户 静默授权直接就登录
        try {
          console.log('tryCodeLogin 2');
          
          const res = await tryCodeLogin()
          console.log(777, 'tryCodeLogin ', res);
          
          return getUserDetail(true)
        } catch(e) {          
          // 尝试登录失败 这是一个需要注册的新用户
          Object.assign(status, {
            wxAuthed: true,
            mobileAuthed: false,
          })
          setAuthed(status)
          return Promise.resolve(status)
        }        
      }

      if (err.code === 1000 && process.env.TARO_ENV === "weapp") {
        Object.assign(status, {
          wxAuthed: props.authType === 'silence' ? true : false,
          mobileAuthed: false,
        })
      } else if (err.code === 1010) { // 未绑定手机号
        Object.assign(status, { wxAuthed: true, mobileAuthed: false })
      }
      setAuthed(status)
      return Promise.resolve(status)

    }
    
  }

  const { run: loginWithMobile, pending: bingingMobile } = useAsync((data) => {
    userAct.current = 'register'
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
          const code = await getWeappAuthCode()
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
          // TODO: 拉新活动
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


  useEffect(() => {
    sendCustomEvent('login_test', {a: 1})
    // 自动登录
    props.autoLogin && getUserDetail(false)
  }, [props.autoLogin])

  return {
    authed,
    loginWithMobile,
    bingingMobile,
    getUserDetail,
  }
}