import Taro from '@tarojs/taro'

import { head, mrtx, start1, start2 } from "@/constants/images";
import './index.scss'
import { IResapi2348 } from '@/apis/21/api2348'
import dayjs from 'dayjs'
import { XImage } from '../PreImage';
import { Item } from 'antd-mobile/lib/tab-bar';
export type IItem = Required<Required<IResapi2348>['data']>['data'][0]

interface Iprops {
  data?: IItem | undefined
}
const Start = (props) => {
  const { compScore = 0 } = props
  const num = Math.round(compScore)
  const good = (new Array(num)).fill(0)
  const bad = (new Array(5 - num)).fill(0)

  return (
    <div className='Stars'>
      {
        good.map((item, index) => {
          return <img src={start2} key={index} alt="" />
        })
      }
      {
        bad.map((item, index) => {
          return <img src={start1} key={index} alt="" />
        })
      }

    </div>
  )
}
const Evaluate = (props: Iprops) => {
  const { data } = props

  const enlargePic = (item) => {
    Taro.previewImage({
      current: item,
      urls: data?.albumPics.split(',') || [item]
    })
  }

  return (
    <div className='Evaluate'>
      <div className='Evaluate-top'>
        <div className='Evaluate-top-left'>
          <img className='Evaluate-top-head' src={data?.userInfo?.headImg || mrtx} alt="" />
          <div className='Evaluate-top-info'>
            <div className='Evaluate-top-info-name'>{data?.userInfo?.nickName || '默认用户'}</div>
            <div className='Evaluate-top-info-score'>
              <Start compScore={data?.compScore}></Start>
            </div>
          </div>
        </div>
        <span className='Evaluate-top-time'>{dayjs(data?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>
      <div className='Evaluate-text'>{data?.content}</div>
      {data?.albumPics && <div className='Evaluate-img'>
        {data?.albumPics?.split(',').map((item, index) => {
          return <XImage className='Evaluate-img-icon' onClick={() => { enlargePic(item) }} src={item} key={`ev${index}`} />
        })}
      </div>}
    </div>
  )
}

export default Evaluate
