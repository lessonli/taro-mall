import { View, Text } from '@tarojs/components'
import compose, {formatMoeny, fen2yuan} from '@/utils/base'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import  {IResapi3590} from '@/apis/21/api3590'
import { XImage } from "@/components/PreImage"
type Idata = Required<Required<IResapi3590>['data']>['data'][0]

import './index.scss'



function PledgeListItem(props:{
  data?: Idata
}) {
const {data} =props
const text = useMemo(()=>{
  if(data?.status === 1){
    return '冻结保证金'
  }
  if(data?.status ===2 || data?.status === 3){
    return '退回保证金'
  }

  if(data?.status ===4 || data?.status === 5){
    return '扣除保证金'
  }
}, [data])
  
  return(
    <div className='pledgeListItem-wrapper'>
      <div className='pledgeListItem-wrapper-content'>
        <div className='pledgeListItem-wrapper-content-img'>
                <XImage className='pledgeListItem-wrapper-content-img-imgEle' query={{ 'x-oss-process': 'image/resize,w_120/quality,q_100' }}  src={data?.targetIcon} alt='' />
        </div>
        <div className='pledgeListItem-wrapper-content-title'>
          <p className='pledgeListItem-wrapper-content-title-text'>{data?.targetName}</p>
          <p className='pledgeListItem-wrapper-content-title-date'>
            <Text className='m-r-16'>{dayjs(data?.gmtCreate).format('YYYY-MM-DD')}</Text>
            <Text>{dayjs(data?.gmtCreate).format('HH:mm:ss')}</Text>
          </p>
        </div>
      </div>
      <div className='pledgeListItem-wrapper-type'>
        <div>
          <Text className='m-r-8'>{text}</Text>
          <Text>￥{compose(formatMoeny, fen2yuan)(data?.margin)}</Text>
        </div>
        {/* pd 要求 先不展示 */}
        {/* 拍品出价 订单完成 订单违约*/}
        {/* <div className='pledgeListItem-offer pledgeListItem-finish pledgeListItem-unconventional'>
          拍品出价
        </div> */}
      </div>
    </div>
  )
}

export default PledgeListItem
