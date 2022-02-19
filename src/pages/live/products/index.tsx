import Tabs from "@/components/Tabs"
import { View } from "@tarojs/components"
import { useState } from "react"
import { AtButton } from "taro-ui"
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import './index.scss'
import { sleep } from "@/utils/cachedService";

const Item = (props: {
  data: {uuid: string}
}) => <View className="m-t-24">{props.data.uuid}</View>

/**
 * 商品管理
 */
export default () => {

  const [tabopts, setTabopts] = useState([
    {label: '秒杀', value: 1},
    {label: '拍卖', value: 2},
  ])

  const [currentStatus, setCurrentStatus] = useState(1)

  const data = new Array(100).fill(1).map((_, i) => ({uuid: `${i}`}))

  // usePullDownRefresh(async () => {
  //   console.log('usePullDownRefresh')
  //   await sleep(3000)
  //   Taro.stopPullDownRefresh()
  // })

  useReachBottom(() => {
    console.log('useReachBottom')
  })

  return <View className="liveGoods">
    <Tabs
      className="liveGoods-tabs"
      options={tabopts}
      value={currentStatus}
      onChange={setCurrentStatus}
    ></Tabs>

    <View>
      {
        data.map(ele => <Item data={ele} key={ele.uuid} />)
      }
    </View>

    <View className="liveGoods-footer">
      <AtButton type="primary" onClick={() => {
        // 打开 app 商品管理
        Taro.navigateTo({
          url: `/pages/live/productPublish/index`
        })
      }}>创建商品</AtButton>
    </View>
  </View>
}