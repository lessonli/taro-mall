import { View, Text, Icon } from '@tarojs/components'
import { useState, useEffect, useMemo, useCallback } from 'react'
import BwModal from '@/components/Modal'
import ListItem from '@/components/ListItem'
import { getStatus } from '@/utils/cachedService'
import Taro from '@tarojs/taro'
import api2912, { IResapi2912 } from '@/apis/21/api2912' // 销户配置
import './index.scss'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { globalConfig } from '@/utils/cachedService'

export type IcancellationData = Required<IResapi2912>['data']
function AccountSecurity() {
  const [modal, setmodal] = useState(false)
  const [userInfo, setUserinfo] = useState<any>({})
  const [cancellation, setCancellation] = useState<IcancellationData>()
  useDidShow(() => {
    (async () => {
      let userInfo = await getStatus.reset()
      setUserinfo(userInfo)
      //  销户配置
      const cancellation = await globalConfig()
      setCancellation(cancellation)
    })()
  })

  const right = useMemo(() => {
    switch (userInfo?.authStatus) {
      case 0:
        return (<View className='tipText' >去认证</View>)
        break;
      case 1:
        return (<View >认证中</View>)
        break;
      case 2:
        return <View  >已认证</View>
    }

  }, [userInfo])
  const payRight = useMemo(() => {
    switch (userInfo?.payPasswordStatus) {
      case 0:
        return (<View className='tipText'>未设置</View>)
        break;
      case 1:
        return (<View >已设置</View>)
        break;
    }

  }, [userInfo])
  console.log(cancellation, 'cancellation');
  const handle = useCallback((status) => {
    // console.log(status);

    if (status === 0) {
      return Taro.navigateTo({
        url: '/pages/user/certify/index'
      })
    }
  }, [userInfo])
  const handlePay = useCallback((status) => {
    // console.log(status);
    return Taro.navigateTo({
      url: '/pages/user/index/setPayPassword/index'
    })
    // if(status ===0) {

    // }
  }, [userInfo])
  const handleOut = () => {
    setmodal(true)
    // Taro.showModal({
    //   title: '注销账号',
    //   showCancel: false,
    //   confirmColor: '#8E2C31',
    //   content: `注销账号请将账号等材料发送至 ${cancellation?.closeAccountEmail}`,
    //   success: () => {
    //     // TODO:

    //   }
    // })
  }
  return (
    <View className='bw-AccountSecurity'>
      <View className='bw-AccountSecurityWrap'>
        <ListItem type={1}
          handleClick={() => handle(userInfo?.authStatus)}
          left={<View>
            <Text className='myIcon bw-AccountSecurity-icon'>&#xe737;</Text>
            <Text className='fz32'>实名认证</Text>
          </View>} right={right} />
        <ListItem
          handleClick={() => handlePay(userInfo?.payPasswordStatus)}
          type={1} left={<View>
            <Text className='myIcon bw-AccountSecurity-icon'>&#xe734;</Text>
            <Text>支付密码</Text>
          </View>} right={payRight} />
        <ListItem type={1}
          handleClick={() => handleOut()}
          left={<View>
            <Text className='myIcon bw-AccountSecurity-icon'>&#xe737;</Text>
            <Text className='fz32'>注销账号</Text>
          </View>}
        />
      </View>
      <BwModal
        content={<View className='system-cancellation'>注销账号请将账号等材料发生至邮箱:{cancellation?.closeAccountEmail},平台将在15个工作日内处理并回复
        </View>}
        visible={modal}
        type='alert'
        onClose={() => setmodal(false)}
        onConfirm={() => setmodal(false)}
        title='注销账号' />
    </View>
  )
}
export default AccountSecurity