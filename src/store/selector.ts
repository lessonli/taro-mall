import { fontSizeState } from './atoms'
import { selector } from 'recoil'

// 计算订单总价，属于订单状态的衍生状态
export const myOrderTotalCost = selector<number>({
  key: 'myOrderTotalPrice',
  get: ({ get }) => {
    const order = get(fontSizeState)
    return order.split(';')
  }
})