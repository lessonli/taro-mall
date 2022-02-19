import { View, Text, Input, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import { CSSProperties } from "react";

import './index.scss'

export const RadioItem = (props: {
  checked?: boolean;
  label: string;
  value?: any;
  onChecked?: (v: any, label: string) => void;
}) => {

  const names = classNames('bwRadioItem', {
    'bwRadioItem__checked': props.checked,
  })

  const h = () => {
    console.log(props.value)
    props.onChecked?.(props.value, props.label)
  }

  return <View className={names} onClick={h}>
    <View>{props.label}</View>
    {
      props.checked && <Text className="myIcon">&#xe715;</Text>
    }
  </View>
}

export default (props: {
  height?: string;
  style?: CSSProperties;
  className?: string;
  options: {label: string, value: any}[];
  value: any;
  onChange: (v: any) => void;
}) => {

  const s = {
    ...(props.style || {})
  }

  if (props.height) {
    s.height = props.height
  }

  const names = classNames('radioScrollList', props.className)

  return <ScrollView
    style={s}
    className={names}
    scrollY
  >
    {
      props.options.map(option => {
        const name = classNames('radioScrollList-item', {
          'color-primary': option.value === props.value
        })
        return <View key={option.value} className={name}>
          <Text>{option.label}</Text>
          <Text className="myIcon">&#xe715;</Text>
        </View>
      })
    }
  </ScrollView>
}