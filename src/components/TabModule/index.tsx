import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import './index.scss'
interface Iprops {
  tabValueList: {
    label: string;
    value: number;
  }[];
  defaultKey?: number | undefined,
  onTabChange: (id: number | undefined) => void;
  style: React.CSSProperties;
}

const TabModule = (props: Iprops) => {
  const { tabValueList, onTabChange, style, defaultKey } = props
  const [activeKey, setActiveKey] = useState<number | undefined>(defaultKey || tabValueList?.[0]?.value)
  // 切换tab
  const onTabClick = (value: number | undefined) => {
    setActiveKey(value)
    // onTabChange(type)
  }
  useEffect(() => {
    onTabChange(activeKey)
  }, [activeKey])
  return (
    <div className='TabModule-box' id='TabModule_copy'>
      <div className='TabModule' style={style}>
        <div className='TabModule-content'>
          {tabValueList?.map(item => {
            return <span key={item.value} onClick={onTabClick.bind(this, item.value)} className={activeKey === item.value ? 'TabModule-content-item checked' : 'TabModule-content-item'}>{item.label}
              {activeKey === item.value ? <span className='line'></span> : ''}
            </span>
          })}
        </div>
      </div>
    </div >
  )
}

export default TabModule
