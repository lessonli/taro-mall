import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useCallback } from 'react'

import './index.scss'

const Attention = (props) => {

  const { hasAttention, className, onChange, color } = props

  const getAttention = useCallback(() => {
    // 关注
    onChange()

    Taro.showToast({
      title: hasAttention ? '已取消' : '已关注',
      icon: 'none'
    })
  }, [hasAttention])

  const rootClass = classNames(
    'bw-attention',
    {
      'bw-attention--done': hasAttention
    },
    {
      'bw-attention--color': hasAttention && color
    },
    className
  )
  return (<div className={rootClass} onClick={getAttention}>
    {hasAttention ? '已关注' : '+关注'}
  </div>)

}

export default Attention
