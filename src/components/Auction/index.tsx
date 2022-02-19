import { DEVICE_NAME, DEVICE_SYSTEM } from '@/constants'
import { globalConfig } from '@/utils/cachedService'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import './index.scss'
interface Iprops {
  status?: number | undefined,
  delayState?: number | undefined,
  endTime: number,
  position: "static" | "relative" | "absolute" | "sticky" | "fixed",
  onUpdate?: any
}
const Auction = (props: Iprops) => {
  const { endTime, delayState, status, position, onUpdate } = props
  const [desc, setDesc] = useState<[number, number, number, number]>([0, 0, 0, 0])
  const interRef = useRef(null)
  useEffect(() => {
    // 待支付 倒计时
    (async () => {
      clearInterval(interRef.current)
      // const data: {
      //   curlTime?: number | undefined;
      // } = await await api2912()
      const config = await globalConfig()
      const updateTime = () => {
        const r = endTime - config?.timeDifference - dayjs().valueOf()
        if (r >= 0) {
          //@ts-ignore
          const d = parseInt(r / 1000 / 60 / 60 / 24)
          let h
          let m
          if (d > 0) {
            //@ts-ignore
            h = parseInt(r / 1000 / 60 / 60 % 24)
          } else {
            h = Math.floor(r / 1000 / 60 / 60)
          }
          if (d < 1 && h < 1) {
            m = Math.floor(r / 1000 / 60 % 60)
          } else {
            m = Math.floor(r / 1000 / 60 % 60)
          }
          const s = Math.floor(r / 1000 % 60)
          setDesc([d, h, m, s])
        } else {
          onUpdate()
          clearInterval(interRef.current)
        }
      }
      updateTime()
      interRef.current = setInterval(updateTime, 1000)
    })()
  }, [endTime])
  const auctionClass = classNames(
    'Auction-box',
    {
      'Auction-box-end': status != 0
    },
    {
      'mt36': position == 'fixed'
    }
  )
  return (
    <div className='Auction'>
      <div className={auctionClass}>
        <div className='Auction-box-left'>
          <i className='myIcon Auction-box-title'>&#xe6fa;</i>
          <span className='Auction-box-title'>{status === 0 ? '正在竞拍' : '拍卖结束'}</span>
        </div>
        {status === 0 ? <div className='Auction-box-right'>
          <span className='Auction-box-tips'>距离截拍</span>
          <div className='Auction-box-time'>
            {desc[0] > 0 && <> <p className='timeBox'>{desc[0] <= 9 ? `0${desc[0]}` : desc[0]}</p>
              <p>天</p></>}
            {!(desc[0] < 1 && desc[1] < 1) && <><p className='timeBox'>{desc[1] <= 9 ? `0${desc[1]}` : desc[1]}</p>
              <p>时</p></>}
            <p className='timeBox'>{desc[2] <= 9 ? `0${desc[2]}` : desc[2]}</p>
            <p>分</p>
            {desc[0] < 1 && <><p className='timeBox'>{desc[3] <= 9 ? `0${desc[3]}` : desc[3]}</p>
              <p>秒</p></>}
            {/* {desc[0] < 1 && desc[1] < 1 && DEVICE_SYSTEM === 'ios' && <div className='timeBox mileseconds'>
            </div>} */}
          </div>
          {delayState === 1 ? <span className='Auction-box-yanshi'>延时</span> : null}
        </div> : <span className='Auction-box-right-end'>{dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')} 结束</span>}
        {/* <AtCountdown
          isCard
          format={{ day: '天', hours: '时', minutes: '分', seconds: '秒' }}
          seconds={360000}
          onTimeUp={onTimeUp}
        /> */}
      </div>
    </div >
  )
}

export default Auction
