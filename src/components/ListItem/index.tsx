import { View } from '@tarojs/components';
import Taro from '@tarojs/taro'
import classNames from 'classnames';

import './index.scss'

interface Iprops {
  className?: string;
  handleClick?: any,
  type?: any,
  icon?: JSX.Element | null,
  children?: JSX.Element,
  left?: React.ReactNode,
  right?: React.ReactNode,
  style?: React.CSSProperties | undefined
}
const ListItem = (props: Iprops) => {
  const { handleClick, type, icon, left, right, style } = props
  const rootClass = classNames(
    'bw-list-item',
    {
      'ListItem': type === 1
    },
    {
      'ListItemDefault': type !== 1
    },
    props.className || ''
  )
  return (
    <div className={rootClass} style={style} onClick={handleClick}>
      <div className='ListItem-child ListItemDefault-child'>
        <View className='ListItem-child-left ListItemDefault-child-left'>
          {left}
        </View>
        <View className='ListItem-child-right ListItemDefault-child-right'>
          {right}
        </View>
      </div>
      <View className='ListItem-icon-right ListItemDefault-icon-right'>
        {icon !== undefined ? icon : <i className='myIcon ListItem-icon ListItemDefault-icon'>&#xe726;</i>}
      </View>
    </div>
  )
}

export default ListItem
