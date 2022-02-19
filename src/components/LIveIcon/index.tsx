import { yuzhan1 } from '@/constants/images'
import Taro from '@tarojs/taro'
import { Image, Text } from '@tarojs/components'

import './index.scss'

interface IProps {
  status?: number
  cusText?: string

}

const LiveIcon = (props: IProps) => {
  return (
    <>
      {props.status === 2 ? <div className='LiveIcon-icon'>
        <div className='LiveIcon-icon-live'>
          <span className='line1 line'></span>
          <span className='line2 line'></span>
          <span className='line3 line'></span>
          直播中
        </div>
        <div className='LiveIcon-icon-see'>{props.cusText}</div>
      </div> :
        <div className='LiveIcon-icon-yuzhan'>
          <Image className='LiveIcon-icon-yuzhan-img' src={yuzhan1} alt="" />
          <div className='LiveIcon-icon-yuzhan-see'>{props.cusText}</div>
        </div>}
    </>
  )
}

export default LiveIcon
