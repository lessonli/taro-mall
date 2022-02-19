import { useEffect, useState } from "react";
import { View, Text } from '@tarojs/components';
import classNames from "classnames";
import Taro from '@tarojs/taro'
import { AtFloatLayout, AtButton, AtIcon } from "taro-ui"

import './index.scss'
import { ReactNode } from "react";

export interface IProps {
  cancelText?: string;
  okText?: string;
  title?: string | ReactNode;

  onCancel?: Function;

  onOk?: Function;

  onClose?: Function;

  visible: boolean;

  onVisibleChange?: (v: boolean) => void;

  className?: string;

  layoutCenter?: boolean
  // 两种头部展现形式
  headerType?: 'close' | 'empty' | undefined;
  /**
   * mask 可点击关闭 默认false
   */
  maskDisabled?: boolean;

  children?: React.ReactNode;
}

export const PopUpLoading = (props: { title?: string; fetchPending?: boolean }) => <View className='pop-titleBox'>
  <Text className='myIcon pop-titleBox-title'>{props.title}</Text>
  {props.fetchPending && <Text className='myIcon pop-rotation loading-icon'></Text>}
</View>

export default (props: IProps) => {

  const close = () => {
    props.onVisibleChange?.(false)
    props.onClose?.()
  }

  // useEffect(() => {
  //   document.documentElement.style.overflow = 'hidden';
  // }, [])

  const handleOk = async () => {
    const p = props.onOk?.()
    if (Object.prototype.toString.call(p) === '[object Promise]') {
      await p
    }
    props.onVisibleChange?.(false)
  }

  const rootClass = classNames(
    'bw-popup',
    {
      'bw-popup--active': props.visible
    },
    props.className || '',
  )

  const handleMaskClose = () => {
    if (!props.maskDisabled) {
      close()
    }
  }

  return <View className={rootClass}>
    <View className="bw-popup__overlay" onClick={handleMaskClose} ></View>
    <View className={`bw-popup__container layout ${props?.layoutCenter ? 'bw-popup__container_center' : 'bw-popup__container_bottom'}`}>
      {
        props.headerType === 'close' && (
          <View className="layout-header">
            <Text></Text>
            {typeof props.title === 'string' ? <Text className="layout-header__title">{props.title || ''}</Text> : props.title}
            <i className="myIcon layout-header__close-icon" onClick={close}>&#xe73b;</i>
            {/* <AtIcon value="close layout-header__close-icon" onClick={close}></AtIcon> */}
          </View>
        )
      }
      {
        !props.headerType && (
          <View className="layout-header">
            <Text className="layout-header__cancel-btn" onClick={close} >{props.cancelText || '取消'}</Text>
            <Text className="layout-header__title">{props.title || ''}</Text>
            <Text className="layout-header__ok-btn" onClick={handleOk}>{props.okText || '保存'}</Text>
          </View>
        )
      }

      <View className="layout-content">
        {props.children}
      </View>
    </View>
  </View>
}