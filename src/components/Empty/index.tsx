import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'

import './index.scss'

export interface IProps {
  src: string;
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * 缺省页
 * @param props 
 * @returns 
 */
const Empty = (props: IProps) => (
  <View className={`empty-component ${props.className || ''}`} style={props.style || {}}>
    <Image src={props.src} className="empty-img"></Image>
    <View className="empty-text">{props.text}</View>
  </View>
)

export default Empty
