import { View, Text, } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { host } from "@/service/http";
import './index.scss'
import { Itype } from "../..";
import api4838 from "@/apis/21/api4838";
interface Iprops {
  type:Itype
  receiveExpireDays: string
}

function Rules(props: Iprops) {
  const [ruleInfo, setRulesInfo] = useState<any>()
  useEffect(() => {
    (async () => {
      const rules = await api4838()
      const receiveExpireDays = props.receiveExpireDays? props.receiveExpireDays :'7'
      setRulesInfo(rules?.receiveRule?.replace(/\{0\}/g, receiveExpireDays))
    })()
  }, [props.receiveExpireDays])

  return <>
    <View className='red-rules'>
      {/*  */}
      {
        props.type !== 'action' && <View className='red-rules-con'>
          <View className="red-rules-con-rule">
            {ruleInfo}
            {/* <Text className='red-rules-con-item-text' onClick={() => Taro.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(`${host}/pages/active/openRedPacket/rules/index`)}` })}>查看详情</Text> */}
          </View>
        </View>
      }
      {
        props.type === 'action' && <View className='red-rules-con'>

          <View className="red-rules-con-rule">
            {ruleInfo}

          </View>

        </View>
      }
    </View>
  </>
}

export default Rules