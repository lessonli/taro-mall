import api3404, {IResapi3404} from "@/apis/21/api3404"
import { OneRowDoubleColumnProductItem } from "@/components/ProductItem"
import { parseOssImageInfo } from "@/components/Upload/oss"
import WaterfallList, { DESIGN_ITEM_WIDTH, WaterFallProductItem } from "@/components/WaterfallList"
import { View } from "@tarojs/components"
import { useRequest } from "ahooks"
import { useMemo } from "react"
import { useEffect } from "react"
import { useCallback } from "react"

import './index.scss'

type IItem = Required<Required<IResapi3404>['data']>

const rn = (i) => Math.ceil(Math.random() * 100 + i * Math.random() * 10)

export default () => {

  const service = useCallback(async (
    result?: { pageNo: number, list: IItem[] },
  ) => {
    const pageSize = 20
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1

    const res = await api3404({
      pageSize, pageNo,
    })


    return {
      list: (result?.list || []).concat(res.data),
      pageSize,
      pageNo,
      // total: 
    }

  }, [])

  const {loading, run, data, reset} = useRequest(service, {
    manual: true,
  })

  // const dataSource = new Array(50).fill(undefined).map((_, i) => {
  //   return {width: rn(i), height: rn(i),}
  // })

  const dataSource = useMemo(() => {
    const products = data?.list.map((item, i) => {

      if (item.live === undefined) {
        const {width, height} = parseOssImageInfo(item.icon)
        /**
         * 商品图高度
         */
        const iconHeight = DESIGN_ITEM_WIDTH / (width / height)
        /**
         * 设计稿 文案高度
         */
        const footerHeight = 130
        return {
          ...item,
          width: DESIGN_ITEM_WIDTH,
          height: iconHeight + footerHeight,
          iconHeight,
        }
      } else { // 直播
        const {width, height} = parseOssImageInfo(item.live.coverImg || '')
        return {
          ...item,
          width,
          height,
        }

      }
    }) || []
    // TODO: 拼接swiper数据
    return products
  }, [data?.list])

  

  useEffect(() => {
    run(undefined)
    
  }, [])

  return <View>
    <View>瀑布流展示</View>
    <WaterfallList<IItem>
      dataSource={dataSource}
      uniqueKey="uuid"
    >
      {
        (data, i) => {
          if (data.live === undefined) {
            return <OneRowDoubleColumnProductItem data={data} mode="waterfall" />
          } else {
            return 111
          }
        }
      }
    </WaterfallList>
    <View>普通列表</View>
    <View className="sample-items">
      {
        dataSource.map(item => <OneRowDoubleColumnProductItem data={item} key={item.uuid}/>)
      }
    </View>
  </View>
}