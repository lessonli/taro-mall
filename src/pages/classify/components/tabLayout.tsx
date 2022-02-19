import { IResapi1652 } from '@/apis/21/api1652'
import Taro from '@tarojs/taro'
import { useEffect, useLayoutEffect, useState } from 'react'
import '../index.scss'
export type IList = Required<IResapi1652['data']>
interface IProps {
  list?: IList,
  onChange: (value: any) => void,
  value?: number | undefined
}
const TabLayout = (props: IProps) => {
  const { list, onChange, value } = props
  const handleClick = (value: number) => {
    onChange(value)
    // todo 
  }

  // useLayoutEffect(() => {
  //   setTimeout(() => {

  //     handleClick(0)
  //   }, 3000);
  // }, [])
  return (
    <div className='tabLayout'>
      {list?.map((item: any, index) => {
        return <p className={value === index ? 'checked' : ''} key={item.id} onClick={handleClick.bind(this, index)}><span>{item.name}</span></p>
      })}
    </div>
  )
}

export default TabLayout
