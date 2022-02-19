import { CSSProperties, useState, useEffect } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text, CoverView } from "@tarojs/components";

import './index.scss'
import classNames from "classnames";
import { useCallback } from "react";
import { session } from "@/utils/storge";

export const navigationBarInfo = {
  _init: false,
  menuButtonHeight: 0,
  navigationBarHeight: 0,
  statusBarHeight: 0,
  navigationBarAndStatusBarHeight: 0,
  platform: null,
  screenWidth: 0,
}

function getBar() {
  if (process.env.TARO_ENV !== 'weapp') return null
  if (navigationBarInfo._init) return navigationBarInfo
  const { statusBarHeight, platform, screenWidth } = Taro.getSystemInfoSync()
  const { top, height } = Taro.getMenuButtonBoundingClientRect()

  const menuButtonHeight = height || 32
  let navigationBarHeight = 0
  // 判断胶囊按钮信息是否成功获取
  if (top && top !== 0 && height && height !== 0) {
    navigationBarHeight = (top - statusBarHeight) * 2 + height
  } else {
    navigationBarHeight = platform === 'android' ? 48 : 40
  }

  Object.assign(navigationBarInfo, {
    _init: true,
    menuButtonHeight,
    navigationBarHeight,
    statusBarHeight,
    navigationBarAndStatusBarHeight: statusBarHeight + navigationBarHeight,
    screenWidth,
    platform,
  })

  return navigationBarInfo
}

/**
 * 包含自定义 navigationBar 组件的页面，需要空出 pdt
 */
export const navigationBarPageStyle = (() => {
  const navigationBarInfo = getBar()
  if (process.env.TARO_ENV === 'h5') return {}
  return {
    paddingTop: `${navigationBarInfo?.navigationBarAndStatusBarHeight}px`,
    boxSizing: 'border-box',
  }
})()

/**
 * 设置H5title 如果title需要动态设置，请传入 function
 * @param title 
 */
export const useH5Title = (title: string | (() => string)) => {
  useDidShow(() => {
    if (process.env.TARO_ENV === 'h5') {
      document.title = typeof title === 'string' ? title : title()
    }
  })
}

export const SingleBackBtn = (props: {
  round?: boolean;
  /**
   * 默认是后退
   */
  onClick?: Function;
}) => {

  const { round, onClick, ...rest } = props

  const handClick = () => {
    props.onClick ? props.onClick() : Taro.navigateBack()
  }

  const names = classNames('myIcon', 'bw-single-back', {
    [`bw-single-back__round`]: round
  })
  return <Text
    className={names}
    onClick={handClick}
    {...(rest || {})}
  >&#xe707;</Text>
}

export const BackAndHomeBtn = (props: {
  onBack?: () => void,
}) => {
  const tohome = useCallback(() => {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }, [])


  const handleBack = () => {
    let navigatorPrevPagePath = session.getItem('navigatorPrevPagePath') as string
    if (session.getItem('navigatorPrevPagePath')) {
      session.setItem('navigatorPrevPagePath', '')
      navigatorPrevPagePath = navigatorPrevPagePath.startsWith('/') ? navigatorPrevPagePath : `/${navigatorPrevPagePath}`
      Taro.navigateTo({ url: navigatorPrevPagePath })
    } else {
      (props.onBack || Taro.navigateBack)()
    }
  }

  return <View className="bw-BackAndHomeBtn">
    <View className={'bw-BackAndHomeBtn-item'} onClick={handleBack} ><Text className="myIcon bw-BackAndHomeBtn-back">&#xe707;</Text></View>
    <View className={'bw-BackAndHomeBtn-item'} onClick={tohome}><Text className="myIcon bw-BackAndHomeBtn-home">&#xe756;</Text></View>
  </View>
}

const NavigationBar = (props: {
  background?: '#ffffff';
  // 先只支持文字
  title?: string;
  // 自定义内容 如搜索
  content?: React.ReactNode;
  leftBtn?: any;
  children?: any;
  style?: CSSProperties;
  className?: string | any;
}) => {

  const navigationBarInfo = getBar()

  const navigationBarStyle = {
    height: navigationBarInfo?.navigationBarAndStatusBarHeight + 'px',
    background: props.background || 'none',
    ...(props.style || {}),
  }

  const names = classNames('bw-navigationBar', props.className)

  useEffect(() => {
    if (process.env.TARO_ENV === 'h5') {
      if (props.title && typeof props.title === 'string') {
        document.title = props.title
      }
    }
  }, [props.title]);

  useDidShow(() => {
    if (process.env.TARO_ENV === 'h5') {
      if (props.title && typeof props.title === 'string') {
        document.title = props.title
      }
    }
  })

  return process.env.TARO_ENV === 'weapp' ?
    (
      <View className="navigationBox" style={{ height: navigationBarInfo?.navigationBarAndStatusBarHeight + 'px' }}>
        <View className={names} style={navigationBarStyle}>
          {/* 空白来占位状态栏 */}
          <View style={{ height: navigationBarInfo?.statusBarHeight + 'px' }}></View>
          {/* 自定义导航栏 */}
          <View className="bw-navigationBar-contents" style={{ height: navigationBarInfo?.navigationBarHeight + 'px' }}>
            {
              props.children ? props.children : <>
                <View className="bw-navigationBar-contents-btns">
                  {
                    props.leftBtn
                  }
                </View>

                <View className={`bw-navigationBar-contents-title auto-center bw-navigationBar-contents-title__${navigationBarInfo?.platform}`}>
                  {
                    props.title
                  }
                </View>
              </>
            }
          </View>

          {/* 空白占位fixed空出的位置 */}
          {/* <View style={{height: navigationBarInfo?.navigationBarAndStatusBarHeight + 'px', background: 'red'}}></View> */}
        </View>
      </View>) :
    <></>
}

export default NavigationBar