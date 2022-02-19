
import { View, Text } from "@tarojs/components"
import ListItem from "@/components/ListItem"
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import { useEffect, useState, useMemo, useCallback } from "react"
import './index.scss'
import { getStatus } from "@/utils/cachedService"
import storge, { session } from "@/utils/storge";

import { clearCache } from "@/utils/cachedService";
import BwModal from "@/components/Modal";

function Setting() {
  const [userInfo, setUserInfo] = useState({})
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    (async () => {
      const userInfo = await getStatus()
      setUserInfo(userInfo)
    })()
  },[])

  const wxAuth = useMemo(() => {
    if (userInfo?.wxAuthStatus === 0) {
      return <Text>微信未授权</Text>
    }
    if (userInfo?.wxAuthStatus === 1) {
      return <Text>微信已授权</Text>
    }
  }, [userInfo])

  const goAddress = useCallback(() => {
    const path = Taro.getCurrentInstance().router?.path
    const currentPath = encodeURIComponent(path)
    const targetUrl = '/pages/other/address/index'
    Taro.navigateTo({
      url: `${targetUrl}?sourceUrl=${currentPath}`
    })
  }, [])

  const goAccountInfo = useCallback((url) => {
    Taro.navigateTo({
      url: '/pages/system/accountInfo/index'
    })
  }, [])
  const logout = () => {
    storge.clearAll()
    session.clearAll()
    clearCache()
    setVisible(false)
    Taro.reLaunch({ url: '/pages/index/index' })
  }


  return (<>
    <View className='bw-system-setting'>
      <View className='bw-system-setting-item'>
        <ListItem
          handleClick={goAccountInfo}
          type={1} left='账户信息' right={wxAuth} />
        <ListItem type={1} left='收货地址' handleClick={goAddress} />
      </View>
      <View className='bw-system-setting-item'>
        {/* <ListItem type={1} left={<View>账号安全</View>} /> */}
        <ListItem type={1} handleClick={() => Taro.navigateTo({ url: '/pages/user/feedback/index' })} left={<View>问题与反馈</View>} />
        <ListItem type={1} handleClick={() => Taro.navigateTo({ url: '/pages/user/tready/index' })} left={<View>协议中心</View>} />
        {/* <ListItem type={1} left={<View>当前版本</View>}  right={<Text>V2.01</Text>}/> */}
        {/* <ListItem type={1} left={<View>清除缓存</View>}  right={<Text>6.0MB</Text>}/> */}
        <ListItem handleClick={() => Taro.navigateTo({ url: '/pages/system/aboutBw/index' })} type={1} left={<View>关于博物有道</View>} />
      </View>
      {process.env.TARO_ENV !== 'weapp' && <AtButton className='bw-system-setting-loginOut' onClick={() => setVisible(true)} type='primary'>退出登录</AtButton>}

    </View>
    <BwModal
      visible={visible}
      title='确认退出登录'
      confirmText='确定'
      cancelText='取消'
      onCancel={() => setVisible(false)}
      onClose={() => setVisible(false)}
      onConfirm={() => logout()}
    />
  </>
  )
}

export default Setting