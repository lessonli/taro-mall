import Taro from '@tarojs/taro';
import { useCallback } from 'react';
import { AtButton } from 'taro-ui';
import './index.scss'

const EarnestRules = (props) => {
  const { onClose } = props
  const close = useCallback(
    () => {
      onClose()
    }, []
  )
  return (
    <div className='EarnestRules'>
      <div className='EarnestRules-content'>
        <p>1.商家拍品设置保证金需同等支付对应保证金金额，用户支付保证金后可参与该拍品出价竞拍；</p>
        <p>2.若竞拍失败，在截拍后，保证金将自动原路返回；</p>
        <p>3.竞拍成功后，拍品保证金不抵扣货款。在48小时内成功付款后，拍品保证金将自动原路退回，具体到账时间以银行实际到账时间为主。若超时未付款系统将自动扣除对应的拍品保证金并赔偿给商家。</p>
      </div>
      <AtButton className='EarnestRules-btn' type='primary' onClick={close}>知道了</AtButton>
    </div>
  )
}

export default EarnestRules
