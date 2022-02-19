import api2906, { IResapi2906 } from '@/apis/21/api2906'
import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { fen2yuan } from '@/utils/base'
import { useCallback, useEffect, useState } from 'react'
import { AtButton } from 'taro-ui'

import './index.scss'
export type IInfo = Required<IResapi2906>['data']
interface IProps {
  uuid?: string | number | undefined
  onPay?: (value: any) => Promise<void> | undefined
}
const Bidding = (props: IProps) => {
  const { uuid } = props
  const [checked, setChecked] = useState<number>(1)
  const [auctionInfo, setAuctionInfo] = useState<IInfo>({})
  useEffect(() => {
    (async () => {
      const form = await api2906({ uuid })
      form && setAuctionInfo(form)
    })()
  }, [])

  const goXieyi = (name) => {
    Taro.navigateTo({
      url: `/pages/webview/index?name=${encodeURIComponent(name)}`
    })
  }


  const bidPrice = () => {
    props?.onPay(auctionInfo.lastAucPrice + checked * auctionInfo.markUp)
  }
  const priceList = [
    {
      id: 1,
      price: fen2yuan(auctionInfo?.lastAucPrice + 1 * auctionInfo?.markUp)
    },
    {
      id: 2,
      price: fen2yuan(auctionInfo?.lastAucPrice + 2 * auctionInfo?.markUp)
    },
    {
      id: 3,
      price: fen2yuan(auctionInfo?.lastAucPrice + 3 * auctionInfo?.markUp)
    }
  ]
  const handleClick = useCallback(
    (value) => {
      setChecked(value)
    },
    [],
  )
  return (
    <div className='bw-Bidding'>
      {/* <div className='bw-Bidding-title'>当前价</div> */}
      <p className='bw-Bidding-now'>
        <Text>¥</Text>
        <Text className='fz60'>{fen2yuan(auctionInfo?.lastAucPrice || auctionInfo.initPrice)}</Text>
      </p>
      <div className='bw-Bidding-box'>
        <Text className='bw-Bidding-box-tips'>中拍率提升50%</Text>
        {
          priceList.map((item, index) => {
            return <Text key={item.id} onClick={handleClick.bind(this, item.id)} className={checked === item.id ? 'bw-Bidding-box-item active' : 'bw-Bidding-box-item'}>¥{item.price}</Text>
          })
        }
      </div>
      <div className='bw-Bidding-btn'>
        <AtButton type='primary' onClick={bidPrice}>出价</AtButton>
      </div>
      <p className='bw-xieyi-left mt24'>出价即表示同意 <Text className='bw-xieyi' onClick={() => { goXieyi('博物交易服务协议') }}>《博物有道交易服务用户协议》</Text><Text className='bw-xieyi' onClick={() => { goXieyi('隐私政策') }}>《隐私保护政策》</Text></p>
    </div>
  )
}

export default Bidding
