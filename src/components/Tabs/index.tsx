import { View, Text } from "@tarojs/components"
import classNames from "classnames"
import { CSSProperties } from "react"

import './index.scss'

type TabValue = any

export type ITabOption = {
  label: string;
  value: TabValue;
}

interface IProps {
  options: ITabOption[];
  value: TabValue;
  onChange: (v: TabValue) => void;
  className?: string;
  style?: CSSProperties;
  /**
   * 布局
   */
  composition?: 1 | 2;
  /**
   * tab-item class 用于覆写样式
   */
  itemClassName?: string;
}

function Tabs (props: IProps) {

  const composition = props.composition || 1

  const classnames = classNames('bw-tabs-component', `bw-tabs-component-${composition}`, props.className)

  return <View className={classnames} style={{
    justifyContent: composition === 1 ? 'space-between' : 'flex-start',
    ...(props.style || {}),
  }}>
    {
      props.options.map(({ label, value }) => {
        const c = classNames('bw-tabs-component-item', {
          'bw-tabs-component-item__active': props.value === value,
          [`bw-tabs-component-item__${composition}`]: true,
        }, props.itemClassName)
        return <View
          key={value}
          className={c}
          onClick={() => props.onChange(value)}
        >
          <Text className="bw-tabs-component-item-label">{label}</Text>
        </View>
      })
    }
  </View>
}

export default Tabs