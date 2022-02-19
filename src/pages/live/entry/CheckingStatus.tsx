import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'

import './CheckingStatus.scss'
import { isAppWebview } from '@/constants'
import NavigationBar, { SingleBackBtn } from '@/components/NavigationBar'
import { BwTaro } from '@/utils/base'

/**
 * 审核中
 */
export default (props: {
  status: 'waiting' | 'success';
}) => {
  return <View className="liveChecking">
    <NavigationBar
      title={props.status === 'success' ? '申请提交成功' : '审核中'}
      leftBtn={<SingleBackBtn />}
    />
    {
      props.status === 'waiting' && <Text className={`myIcon liveChecking-status-icon liveChecking-${props.status}`}>&#xe74e;</Text>
    }
    {
      props.status === 'success' && <Text className={`myIcon liveChecking-status-icon liveChecking-${props.status}`}>&#xe751;</Text>
    }
    <View className="liveChecking-1">{props.status === 'waiting' ? '开播申请审核中' : '开播申请提交成功'}</View>
    <View className="liveChecking-2">预计1个工作日内审核完毕，请耐心等待</View>
    <View className="liveChecking-3">
      <AtButton type="secondary" onClick={() => {
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'openNativePage',
            JSON.stringify({
              page: '/home',
            })
          )
        } else {
          BwTaro.redirectTo({ url: '/pages/index/index' })
        }
      }}>返回首页</AtButton>
    </View>
  </View>
}