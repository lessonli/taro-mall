import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import * as images from '@/constants/images'
import classNames from 'classnames'
import './index.scss'
import { useCallback, useState } from 'react'
import Item from 'antd-mobile/lib/popover/Item'

interface IProps {
  options: {
    label: string;
    value: string;
    asc: boolean;
  }[]
  onChange?: any | undefined,
  className?: string | undefined
}
const SortTab = (props: IProps) => {
  const { className, options, onChange } = props
  const [checked, setChecked] = useState<string>('composite')
  const [sort, setSort] = useState<boolean | undefined>()

  const rootClass = classNames(
    'bw-sortTab',
    className
  )
  const handleClick = useCallback((value, asc, sortValue) => {
    if (asc === true) {
      setSort(!sortValue)
    } else {
      setSort(undefined)
    }
    if (value == checked) {
      onChange([{ column: value, asc: !sort }])
    } else {
      if (asc === true) {
        setSort(true)
      } else {
        setSort(undefined)
      }
      setChecked(value)
      onChange([{ column: value, asc: true }])
    }
  }, [checked, sort])
  return (
    <View className={rootClass} >
      {
        options.map((item, index) => {
          return <View key={index}>
            {
              item.asc ? <View className='bw-sortTab-item'>
                <Text className={checked === item.value ? 'bw-sortTab-item-text bw-sortTab-active' : 'bw-sortTab-item-text'} onClick={handleClick.bind(this, item.value, item.asc, sort)}>{item.label}</Text>
                <View className='bw-sortTab-item-icon'>
                  <Image className='bw-sortTab-item-icon-img up' src={sort === true && item.value === checked ? images.UP1 : images.UP0}></Image>
                  <Image className='bw-sortTab-item-icon-img down' src={sort === false && item.value === checked ? images.DOWN1 : images.DOWN0}></Image>
                </View>
              </View> : <View className={checked === item.value ? 'bw-sortTab-item bw-sortTab-active' : 'bw-sortTab-item'} onClick={handleClick.bind(this, item.value)}>{item.label}</View>
            }

          </View>
        })
      }
    </View>
  )

}
export default SortTab
