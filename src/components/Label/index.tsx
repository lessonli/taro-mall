import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Iprops {
  label?: string | undefined;
  src: any;
  background?: string
}
const Label = (props: Iprops) => {
  const { src, label, background } = props
  return (
    <div className='Label' style={{ background }}>
      <img src={src} alt="" />
      <span className='Label-label'>{label}</span>
    </div>
  )
}

export default Label
