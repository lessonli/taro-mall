import Taro from '@tarojs/taro'
import { fen2yuan } from '@/utils/base'
import './index.scss'
interface Iprops {
  productNum?: number | undefined
  fansNum?: number | undefined
  marginShopAmount?: number | undefined
}
const StoreDetail = (props: Iprops) => {
  const { productNum = 0, fansNum = 0, marginShopAmount = 0 } = props
  return (
    <div className='store-info-data'>
      <div className='store-info-data-item'>
        <p className='store-info-data-item-p1'>{productNum}</p>
        <p className='store-info-data-item-p2'>上架宝贝</p>
      </div>
      <div className='store-info-data-item'>
        <p className='store-info-data-item-p1'>{fen2yuan(marginShopAmount)}</p>
        <p className='store-info-data-item-p2'>店铺保证金</p>
      </div>
      <div className='store-info-data-item'>
        <p className='store-info-data-item-p1'>{fansNum}</p>
        <p className='store-info-data-item-p2'>店铺关注</p>
      </div>
    </div>
  )
}

export default StoreDetail
