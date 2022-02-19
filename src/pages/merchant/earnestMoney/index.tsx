import Taro from '@tarojs/taro'
import ListItem from '@/components/ListItem'
import { Text } from '@tarojs/components'
import './index.scss'
import RadioList from '@/components/RadioList'
import * as images from "@/constants/images";
import { useEffect, useMemo, useState } from 'react'
import api2476, { IResapi2476 } from '@/apis/21/api2476'
import { fen2yuan } from '@/utils/base'
import { AtButton } from 'taro-ui'
import api2460, { IResapi2460 } from '@/apis/21/api2460'
import { AtInputMoney } from '@/components/AtInputPlus'
import { cachedWxConfig, useAsync } from '@/utils/hooks'
import api2984 from '@/apis/21/api2984'
import { DEVICE_NAME } from '@/constants'
import api3548 from '@/apis/21/api3548';
import paySdk from '@/components/PayFeePopup/paySdk';
import api2436 from '@/apis/21/api2436';
import { session } from '@/utils/storge';
import api2612, { IResapi2612 } from '@/apis/21/api2612';
export type ICash = Required<IResapi2476>['data']
export type IConfig = Required<IResapi2460>['data']
export type IStoreInfo = Required<IResapi2612>['data']
const EarnestMoney = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [cash, setCash] = useState<ICash>()
  const [config, setConfig] = useState<IConfig>()
  const [price, setPrice] = useState<string | undefined>()
  const [storeInfo, setStoreInfo] = useState<IStoreInfo>()
  const radioListOption = [{
    icon: images.WX_PAY_ICON,
    label: '微信支付',
    value: 1
  }]

  const prevPagePath = useMemo(() => {
    const pages = Taro.getCurrentPages()
    return pages[pages.length - 1]?.path || pages[pages.length - 1]?.route
  }, [])

  useEffect(() => {
    (async () => {
      cachedWxConfig()
      const data = await api2612()
      setStoreInfo(data)
      const cashData = await api2476()
      setCash(cashData)
      const cashConfig = await api2460()
      setConfig(cashConfig)
    })()
  }, [])

  const onChecked = (value) => {
    console.log(value);

  }
  const handleFormChange = (value) => {
    setPrice(value)

  }
  const getMoney = () => {
    if (cash?.marginShopAmount === 0 && (Number(price) < config?.shopMarginFirstMinAmount)) {
      Taro.showToast({ title: `首次缴纳最低${fen2yuan(config?.shopMarginFirstMinAmount)}元` })
      setTimeout(() => {
        handleFormChange(config?.shopMarginFirstMinAmount)
      }, 0);
    }
  }
  const {run: pay, pending} = useAsync(async () => {
    if (!price) {
      Taro.showToast({
        title: '请输入要缴纳的金额',
        icon: 'none'
      })
      return
    }
    const service = () => api3548({ rechargeAmount: cash?.marginShopAmount === 0 && Number(price) < config?.shopMarginFirstMinAmount ? config?.shopMarginFirstMinAmount : price })
    if (DEVICE_NAME === 'webh5') {
      if (storeInfo?.authStatus === 0) {
        const formData = session.getItem('pages/storeApprove/index')
        // api2436(formData)
      }
    }
    await paySdk(service)
    setTimeout(() => {
      Taro.showToast({ title: storeInfo?.authStatus === 0 ? '认证成功啦～' : '缴纳成功啦～', duration: 2000 })
    }, 200);
    if (prevPagePath.indexOf('pages/live/entry/index') > -1) {
      Taro.navigateBack()
    } else {
      Taro.redirectTo({
        url: '/pages/store/storeSetting/index'
      })
    }
  }, {manual: true})

  return (
    <div className='EarnestMoney'>
      <div className='EarnestMoney-header br8'>
        <div className='EarnestMoney-header-box'>
          <p className='p1'>保证金 (元) </p>
          <p className='p2'>{fen2yuan(cash?.marginShopAmount) || 0}</p>
        </div>
      </div>
      <div className='EarnestMoney-input'>
        <ListItem className='bb0 br8' type={1} left={<span>缴纳金额</span>} right={<AtInputMoney name="price" placeholder="输入保证金金额" onBlur={getMoney} value={price} onChange={(v) => handleFormChange(v)} />} icon={<span className='normal'>元</span>} />
        <p className='EarnestMoney-input-tips'><Text>最高单笔缴纳</Text> <Text className='colorCheck '> {fen2yuan(config?.shopMarginMaxAmount) || 0} </Text>元</p>
      </div>
      <div className='EarnestMoney-payList'>
        <p className='EarnestMoney-payList-title'>选择付款方式</p>
        <RadioList listClassName='br8 bb0' radioListOption={radioListOption} onChange={onChecked}></RadioList>
      </div>
      <div className='EarnestMoney-btn'>
        <AtButton type='primary' onClick={pay} disabled={pending} loading={pending}>立即缴纳（可退）</AtButton>
      </div>
    </div>
  )
}

export default EarnestMoney
