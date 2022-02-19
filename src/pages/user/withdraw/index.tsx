
import { View, Text } from '@tarojs/components'
import { useCallback, useEffect, useState, useRef, forwardRef } from 'react'
import { AtInput } from 'taro-ui'
import BwModal from '@/components/Modal'
import Taro from '@tarojs/taro'
import Popup, { PopUpLoading } from '@/components/Popup'
import PayPassword from '@/components/PayPassword'
import compose, { formatMoeny, fen2yuan, yuan2fen } from '@/utils/base'
import api3890 from '@/apis/21/api3890' // 佣金手续费
import api3872 from '@/apis/21/api3872' // 货款手续费
import api3896 from '@/apis/21/api3896' // 佣金 提现申请
import api3878 from '@/apis/21/api3878' // 货款提现申请
import api2108, { IResapi2108 } from '@/apis/21/api2108' // 用户状态
import './index.scss'
import { useDidShow } from '@tarojs/taro'

import storge, { session } from "@/utils/storge"
import { useAsync } from '@/utils/hooks'

type IUserStatus = Required<IResapi2108>['data']

function Withdrawal() {
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [payPasswordModal, setPayPasswordModal] = useState(false)
  const [payModal, setPayModal] = useState(false)
  const [params, setParams] = useState<any>()
  const [money, setMoney] = useState('')
  const [userStatus, setUserStatus] = useState<IUserStatus>()
  const [poundage, setPoundage] = useState<any>() // 手续费
  const payRef = useRef(null)
  useDidShow(() => {
    // const params = Taro.getCurrentInstance().router?.params;
    const params = session.getItem('pages/user/withdraw/index');
    (async () => {
      setParams(params)
      const userStatus = await api2108()
      setUserStatus(userStatus)
    })()
    setPayPasswordModal(false)
  })

  const getPoundge = useCallback(() => {
    // (async()=>{
    //   const fn = params?.type==='1'? api3890 : api3872
    //   const poundage = await fn({withdrawAmount: compose(fen2yuan)(money)})
    const fn = params?.type === '1' ? api3890 : api3872
    fn({ withdrawAmount: compose(yuan2fen)(money) }).then(res => {
      setPoundage(res)
      setWithdrawModal(true)
    }).catch(err => {
      return Taro.showToast({
        icon: 'none',
        title: err?.message || '请重试'
      })
    })

  }, [params, money])

  const change = (value) => {
    setMoney(value)
  }
  const handleWithdraw = () => {
    //  先取消 提现确认弹窗 后打开 支付密码弹窗
    setWithdrawModal(false)
    setPayModal(true)
  }

  const { run: handleSubmit, pending } = useAsync((v) => {
    const fn = params?.type === '1' ? api3896 : api3878
    return fn({ withdrawAmount: yuan2fen(money), payPassword: v }).then(res => {
      Taro.showToast({
        icon: 'none',
        title: '提现成功'
      })
      setPayModal(false)

      Taro.navigateBack()
    }).catch(err => {
      setPayModal(false)
      payRef.current.clear()
      Taro.showToast({
        icon: 'none',
        title: err?.message || '请重试'
      })
    })

  }, { manual: true })

  const applyWithdrawal = () => {
    // allMoney 可提现金额
    const allMoney = params?.type === '1' ? compose(fen2yuan)(params?.commissionAvailableAmount) : compose(fen2yuan)(params?.productAvailableAmount)


    if (Number(money) > Number(allMoney)) return Taro.showToast({ icon: 'none', title: '输入金额大于可提现金额' })

    if (userStatus?.payPasswordStatus === 0) {
      // return Taro.showToast({
      //   icon: 'none',
      //   title: '请设置支付密码'
      // })
      return setPayPasswordModal(true)


    }

    const { withdrawLimitMax, withdrawLimitMin } = params
    if (money === '') return Taro.showToast({ icon: 'none', title: '提现金额为空' })

    if (Number(money) < compose(fen2yuan)(Number(withdrawLimitMin))) {
      return Taro.showToast({ icon: 'none', title: '小于可提现最小额度' })
    }
    if (Number(money) > compose(fen2yuan)(Number(withdrawLimitMax))) {

      return Taro.showToast({ icon: 'none', title: '大于最大可提现额度' })
    }
    getPoundge()




  }
  const allWithdraw = () => {
    const allMoney = params?.type === '1' ? compose(fen2yuan)(params?.commissionAvailableAmount) : compose(fen2yuan)(params?.productAvailableAmount)

    return setMoney(allMoney)
  }
  const visibleChange = useCallback(() => {
    setPayModal(false)
    payRef?.current.clear()

  }, [])
  return (
    <View className='Withdrawal'>
      <View className='Withdrawal-panel'>
        <View className='Withdrawal-panel-tixian'>
          <View className='Withdrawal-panel-tixian-text'>可提现金额(元)</View>
          {params?.type === '2' && <Text className='Withdrawal-panel-tixian-num'>{compose(formatMoeny, fen2yuan)(params?.productAvailableAmount)}</Text>}
          {params?.type === '1' && <Text className='Withdrawal-panel-tixian-num'>{compose(formatMoeny, fen2yuan)(params?.commissionAvailableAmount)}</Text>}
        </View>
        <View className='Withdrawal-panel-tit'>提现金额</View>
        <View className='Withdrawal-panel-action'>
          <View className='Withdrawal-panel-action-input'>
            <Text className='Withdrawal-panel-action-input-icon'>￥</Text>
            <AtInput type='number' placeholder='输入金额' value={money} name='money' onChange={change} />
          </View>
          <View onClick={() => allWithdraw()} className='Withdrawal-panel-action-all'>全部提现</View>
        </View>
        <View className='Withdrawal-panel-tx'>
          <View className='Withdrawal-panel-tx-text'>提现至银行卡</View>
          <View className='Withdrawal-panel-tx-yhk'>
            <Text className='Withdrawal-panel-tx-yhk-card'>{params?.bankCardNo}</Text>
          </View>
        </View>
      </View>
      <View onClick={() => applyWithdrawal()} className='Withdrawal-apply'>申请提现</View>
      <BwModal
        visible={withdrawModal}
        title="提现信息确认"
        content={
          <View className='Withdrawal-modal'>
            <View className='Withdrawal-modal-item'>
              <View className='Withdrawal-modal-item-label'>银行卡号: </View>
              <View className='Withdrawal-modal-item-value'>{params?.bankCardNo}</View>
            </View>
            <View className='Withdrawal-modal-item'>
              <View className='Withdrawal-modal-item-label'>提现金额: </View>
              <View className='Withdrawal-modal-item-value'>{money}</View>
            </View>
            <View className='Withdrawal-modal-item'>
              <View className='Withdrawal-modal-item-label'>手续费: </View>
              <View className='Withdrawal-modal-item-value'>{compose(fen2yuan)(poundage?.serviceFee)}</View>
            </View>
          </View>
        }
        cancelText='修改'
        confirmText='保存提交'
        onClose={() => setWithdrawModal(false)}
        onCancel={() => setWithdrawModal(false)}
        onConfirm={() => handleWithdraw()}
      />

      <BwModal
        visible={payPasswordModal}
        title='设置密码'
        content={<View>为确保资金安全, 提现需要设置支付密码</View>}
        onCancel={() => setPayPasswordModal(false)}
        onClose={() => setPayPasswordModal(false)}
        confirmText='立即设置'
        onConfirm={() => Taro.navigateTo({ url: '/pages/user/index/setPayPassword/index' })} // 立即设置
      />
      <Popup
        onVisibleChange={() => visibleChange()}
        visible={payModal}
        title={<PopUpLoading title="请输入余额密码" fetchPending={pending} />}
        headerType="close"
      >
        <PayPassword title='提现金额' fee={Number(money)} ref={payRef} length={6} onSubmit={handleSubmit} />
      </Popup>
    </View>
  )
}

export default Withdrawal