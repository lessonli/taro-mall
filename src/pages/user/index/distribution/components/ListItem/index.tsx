

import './index.scss'
import compose, {formatMoeny, fen2yuan} from '@/utils/base';
import { Idata } from '../../index'
import dayjs from 'dayjs';

export type Iprops = {
  data: Idata
}

export default function ListItem(props:Iprops) {
  const {data} = props
  return(
    <div className='distribution-list-item'>
      <div className='distribution-list-item-left'>
        <p>￥{compose(formatMoeny, fen2yuan)(data?.gmv)}</p>
        <p>{dayjs(data?.statisticsDate).format('YYYY-MM-DD')}</p>
      </div>
      <div className='color333'>{data?.orderCount}</div>
    </div>
  )
}
