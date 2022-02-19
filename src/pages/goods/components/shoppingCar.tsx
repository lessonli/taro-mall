import { IResapi2524 } from '@/apis/21/api2524'
import { fen2yuan } from '@/utils/base'
import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { AtButton, AtInputNumber } from 'taro-ui'
import './index.scss'
export type IProps = Required<IResapi2524["data"]>

const ShoppingCar = (props: IProps & {
  activityId?: string,
}) => {
  const [num, setNum] = useState<number>(1)
  const onChange = (value) => {
    setNum(value)
  }
  const goRouter = () => {
    props.onClose()
    Taro.navigateTo({
      url: `/pages/order/genOrder/index?productType=${props?.productType}&productId=${props?.uuid}&productQuantity=${num}&activityId=${props.activityId || ''}`
    })
  }
  return (
    <div className='shoppingCar'>
      <div className='shoppingCar-header'>
        <img src={props?.icon} className='shoppingCar-header-img' alt="" />
        <div className='shoppingCar-header-content'>
          <p className='shoppingCar-header-content-title'>{props?.name}</p>
          <p className='shoppingCar-header-content-price'><Text>¥</Text><Text>{props?.actInfo?.actPrice ? fen2yuan(props?.actInfo?.actPrice) : fen2yuan(props?.price)}</Text></p>
          <p className='shoppingCar-header-content-kc'>库存 {props?.stock}</p>
        </div>
      </div>
      <div className='shoppingCar-num'>
        <span>数量</span>
        <div>
          <AtInputNumber
            min={1}
            max={props?.actInfo?.perLimit ? props?.actInfo?.perLimit : props?.stock}
            step={1}
            value={num}
            type='number'
            width={278}
            onChange={onChange} />
        </div>
      </div>
      <div className='shoppingCar-btn'>
        <AtButton type='primary' onClick={goRouter}>立即购买</AtButton>
      </div>
    </div>
  )
}

export default ShoppingCar
