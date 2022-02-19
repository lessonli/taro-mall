import { addAppEventlistener, bwNativeCallJsAsyncFn, bwNativeCallJsSyncFn, noop, removeAppEventlistener, runAppSyncMethod } from "@/utils/app.sdk"
import { updateToken } from "@/utils/storge"
import { View, Button } from "@tarojs/components"
import { useEffect } from "react"
import { useState } from "react"
import { AtButton } from "taro-ui"

export default () => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    addAppEventlistener('loginSuccess', (data) => {
      setCount(1)
      const { token } = JSON.parse(data)
      updateToken(token)
      return '1'
    })

    return () => {
      removeAppEventlistener('loginSuccess')
    }
  }, [count])

  return <View>
    <AtButton full onClick={() => {
      const token = runAppSyncMethod('getNativeToken')
      alert(token)
    }}>同步获取app token</AtButton>

    <AtButton full type="secondary" onClick={() => {
      WebViewJavascriptBridge.callHandler(
        'callWeAppShareToFriend',
        JSON.stringify({
          title: '主标题',
          desc: '副标题',
          link: '分享落地页',
          imgUrl: "分享图标"
        }),
        (res) => {
          console.log('updateWxShareData res', res);

        }
      )
      console.log('updateWxShareData tttttt');

    }}>异步读取app测试</AtButton>

    <View>
      login success 调用次数 {count}
    </View>

    {/* <AtButton full onClick={() => {
      bwNativeCallJsAsyncFn('aaa', JSON.stringify({b: 1}))
    }}>app调用 js 异步方法aaa</AtButton>

    <AtButton full onClick={() => {
      bwNativeCallJsSyncFn(
        'bwNativeCallJsSyncFn'
      )
    }}>app调用 js 同步方法loginSuccess</AtButton> */}
  </View>
}