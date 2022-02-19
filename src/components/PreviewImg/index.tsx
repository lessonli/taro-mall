import Taro from '@tarojs/taro'
import classNames from 'classnames'

import './index.scss'

const PreviewImg = (props: {
  className: string;
  src: string;
  type: 1 | any;
  reLoad: any;
}) => {
  const { src, reLoad, type } = props

  const names = classNames(`PreviewImg`, props.className)

  return (
    <div className={names}>
      <img className='PreviewImg-approveImg' onClick={type === 1 ? reLoad : () => { }} src={src}></img>
      {!type && <p className='PreviewImg-btn' onClick={reLoad}>点击重新上传</p>}
    </div>
  )
}

export default PreviewImg
