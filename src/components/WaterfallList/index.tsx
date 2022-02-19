import { IResapi1660 } from "@/apis/21/api1660"
import { IResapi3404 } from "@/apis/21/api3404"
import compose, { fen2yuan, getRealSize } from "@/utils/base"
import { View, Image, Text } from "@tarojs/components"
import React, { useEffect, useMemo, useState } from "react"
import { useRef } from "react"
import { navigationBarInfo } from "../NavigationBar"
import { XImage } from "../PreImage"

import './index.scss'

type IDataSourceItem = {
  /**
   * item元素原始宽度
   */
  width: number;
  /**
   * item元素原始高度
   */
  height: number;
}
/**
 * 设计稿 一列的宽度
 */
export const DESIGN_ITEM_WIDTH = 343
const MARGIN_BTTOM = 16
const MARGIN_GAP = 16

/**
 * 瀑布流组件
 * 仅支持移动端 单行双列
 */
export default function <T>(props: {
  dataSource: (IDataSourceItem & T)[];
  children: (data: IDataSourceItem & T, index: number) => React.ReactNode;
  uniqueKey?: string;
}) {
  /**
   * 记录左右已填充位置
   */
  const tops = useRef({
    left: 0,
    right: 0
  })

  const [list, setList] = useState<(IDataSourceItem & T & {style: React.CSSProperties})[]>([])
  const [containerH, setContainerH] = useState(0)

  const l2 = useMemo(() => DESIGN_ITEM_WIDTH + MARGIN_GAP, [])

  useEffect(() => {
    tops.current.left = 0
    tops.current.right = 0

    const blist = props.dataSource.map((item, i) => {
      const posRight = tops.current.left > tops.current.right
      const left = posRight ? l2 : 0
      const top = (posRight ? tops.current.right : tops.current.left)

      const itemHeight = DESIGN_ITEM_WIDTH / (item.width / item.height)

      // 更新 tops
      if (posRight) {
        tops.current.right = tops.current.right + itemHeight + MARGIN_GAP
      } else {
        tops.current.left = tops.current.left + itemHeight + MARGIN_GAP
      }

      const style = {
        height: getRealSize(itemHeight) + 'px',
        left: getRealSize(left) + 'px',
        top: getRealSize(top) + 'px',
      }

      return {
        ...item,
        style
      }
    })

    setList(blist)

    setContainerH(Math.max(tops.current.left, tops.current.right) - MARGIN_BTTOM)
  }, [props.dataSource])

  const cH = useMemo(() => ({
    height: getRealSize(containerH) + 'px'
  }), [containerH])

  return <View className="waterfalllist-wrapper">
    <View className="waterfalllist" style={cH}>
      {
        list.map((item, i) => {
          const key = props.uniqueKey ? item[props.uniqueKey] : i
          return <View className="waterfalllist-item fz24" style={item.style} key={key}>{props.children?.(item, i)}</View>
        })
      }
    </View>
  </View>
}

/**
 * 瀑布流商品列表 item
 */
export function WaterFallProductItem (props: {
  data: Required<Required<IResapi3404>['data']>;
}) {
  /**
   * 不设置高度 ximage 会有空隙
   */
  const h = {
    height: getRealSize(props.data.iconHeigh) + 'px'
  }

  return <View className="WaterFallProductItem">
    {/* <XImage src={props.data.icon} /> */}
    <View>
      <XImage 
        style={h}
        className="WaterFallProductItem-icon" 
        mode="scaleToFill"
        src={props.data.icon}
        query={{
          'x-oss-process': `image/resize,w_${Math.ceil(getRealSize(navigationBarInfo.screenWidth || 375) * 2)},m_lfit`,
          'image_process': 'format,webp'
        }}
      />
    </View>
    {/* 商品footer */}
    <View className="WaterFallProductItem_footer">
      <View className="fz28 WaterFallProductItem_footer-name">{props.data.name}</View>
      <View className="flex fz24 WaterFallProductItem_footer-prices">
        <View className="color-primary fz24">￥<Text className="fz36">{compose(fen2yuan)(props.data.price)}</Text></View>
        <Text>￥{fen2yuan(props.data.originalPrice)}</Text>
      </View>
    </View>
  </View>
}

/**
 * 瀑布流 直播item
 * @param props 
 */
export function WaterFallLiveItem(props: {
  data: Required<Required<IResapi3404>['data']>;
}) {
  
}