import {View, Text} from '@tarojs/components'
import BwModal, {Iprops as ModalProps} from "@/components/Modal"
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

export const ModelContentBeforeStartLive = () => <View className="fz24 color666" style={{textAlign: 'left'}}>
<View className="m-b-24">为了维护网络文明健康，净化直播环境，请主播遵守法律法规，弘扬正能量。如下直播规范请务必知晓遵守。</View>
<View>1、不可在直播间提及其他竞品平台；</View>
<View>2、不可在直播间展示个人微信号，主动或被动引导用户线下交易；</View>
<View>3、任何违法违规、色情暴力、低俗不良行为将被处罚封禁；</View>
</View>

export default (props: ModalProps & {
  onOk: () => void;
  /**
   * 倒计时总数 默认5
   */
  count?: number;
  children?: any;
}) => {

  const KNOW_COUNT = props.count || 5

  const [knownCount, setKnownCount] = useState(KNOW_COUNT)
  const timer = useRef()
  const aRef = useRef(KNOW_COUNT)

  const handleKnown = (e) => {
    if (knownCount > 0) {
      e.stopPropagation()
    } else {
      aRef.current = KNOW_COUNT
      clearInterval(timer.current)
      setKnownCount(aRef.current)
      props.onOk()
    }
  }

  const runTimer = () => {
    aRef.current = aRef.current - 1
    if (aRef.current < 0) {
      clearInterval(timer.current)
      setKnownCount(aRef.current)
    } else {
      setKnownCount(aRef.current)
    }

  }

  useEffect(() => {
    if (props.visible) {
      // runTimer()
      timer.current = setInterval(runTimer, 1000)
    } else {
      aRef.current = KNOW_COUNT
      clearInterval(timer.current)
      setKnownCount(aRef.current)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [props.visible, knownCount])

  return (<>
    <BwModal
      type="alert"
      title={props.title}
      visible={props.visible}
      onClose={props.onClose}
      content={props.content}
      alertText={<View className={`${knownCount > 0 ? 'color-primary-disabled' : 'color-primary'}`} onClick={handleKnown}>我知道了{knownCount > 0 ? `(${knownCount}s)` : ''}</View>}
    ></BwModal>
    </>
  )
}