import { IResapi2260 } from "@/apis/21/api2260"
import { View, Text, Image } from "@tarojs/components"
import { useCallback } from "react"
import Taro from "@tarojs/taro";

import './index.scss'
import { getAddressList } from "@/utils/cachedService";
import { session } from "@/utils/storge";

export type IReceiver = Required<Required<IResapi2260>['data']>[0]

export default (props: { data?: IReceiver, disabled?: boolean, ableCopy?: boolean }) => {

  const {data} = props

  const handleClick = useCallback(async () => {
    if (!!props.disabled) return
    const res = await getAddressList()
    if (res?.length === 0) {
      // 添加
      Taro.navigateTo({
        url: `/pages/other/address/addAddress/index?add1st=true`
      })
      return
    }
    const addressNo = props.data?.addressNo
    session.setItem('pages/other/address/index', {
      activedAddressNo: addressNo || '',
    })
    // const {router} = Taro.getCurrentInstance()
    Taro.navigateTo({
      url: `/pages/other/address/index?chooseAble=true`
    })
  }, [props.data, props.disabled])

  const copyStr = (str) => {
    const str1 = `${data?.name} ${data?.mobile} ${data?.province}${data?.city}${data?.district}${data?.detailAddress}`
    if (process.env.TARO_ENV === 'weapp' && str === 'wrap') {
      Taro.setClipboardData({
        data: str1,
      })
    } else if (process.env.TARO_ENV === 'h5') {
      Taro.setClipboardData({
        data: str1,
        success: () => {
          Taro.showToast({
            title: '复制成功',
            icon: 'none'
          })
        }
      })
    }
  }

  return (
    <View className="ReceiveAdds" onClick={handleClick} style={{ position: 'relative' }}>
      <View className="flex items-center">
        <Text className="myIcon ad-icon">&#xe721;</Text>
        {
          props.data ?
            <View className="ReceiveAdds__me">
              <View className="fw600">
                {data?.name}
                <Text className="ReceiveAdds__me-phone">{data?.mobile}</Text>
              </View>
              <View className="ReceiveAdds__me-detail">{data?.province}{data?.city}{data?.district}{data?.detailAddress}</View>
            </View> :
            <View className="ReceiveAdds__empty">请填写收货地址</View>
        }
      </View>
      {
        !props.disabled && <Text className="myIcon next-btn">&#xe726;</Text>
      }
      {
        props.ableCopy && props.data &&
        <Text className="copy-btn-wrap" onClick={() => copyStr('wrap')}>
          <Text className="copy-btn" onClick={copyStr}>复制</Text>
        </Text>
      }
      <View className="ReceiveAdds__border"></View>
    </View>
  )
}