import Taro from '@tarojs/taro'
import { zhuanke as storeImg, VIP as vip, vip0 } from '@/constants/images'
import Label from '@/components/Label'
import './index.scss'
import { IResapi2612 } from '@/apis/21/api2612'
import { JSXElementConstructor, ReactElement, ReactNodeArray, ReactPortal } from 'react'
import { SHOP_AUTH_TAGS } from '@/constants'
import { getUserAvatar } from '@/utils/poster'
export type IData = Required<IResapi2612>['data']

interface Iprops {
  children?: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal | null | undefined
  data?: IData,
  type?: number
}
const StoreHeader = (props: Iprops) => {
  const { type } = props
  const { data } = props
  return (
    <div className='storeModule-header'>
      <img src={getUserAvatar(data?.shopLogo || '', 90)} className='storeModule-header-img' alt="" />
      <div className={'storeModule-header-info'}>
        <div className={type === 1 ? 'storeModule-header-info-name storeModule-header-info-name1' : 'storeModule-header-info-name'}>
          {data?.shopName}
        </div>
        <div className='storeModule-header-tags'>
          <Label src={data?.authStatus === 0 ? vip0 : vip} label={data?.authStatus === 0 ? '未认证' : '实名认证'}></Label>
          {/* {data?.shopAuthTags?.map(item => {
            return <Label src={vip} key={item} label={SHOP_AUTH_TAGS.get(item).label}></Label>
          })} */}
        </div>
      </div>
      {
        props.children
      }

    </div >
  )
}

export default StoreHeader
