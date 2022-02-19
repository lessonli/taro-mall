import { View, Image, Text } from "@tarojs/components"
import { useEffect, useState } from "react"
import Taro from "@tarojs/taro";
import api2556 from "@/apis/21/api2556";
import storge, { isBuyerNow } from "@/utils/storge";
import api2548 from "@/apis/21/api2548";
import api2588, {IResapi2588} from "@/apis/21/api2588";
import api2532 from "@/apis/21/api2532";

import './index.scss'
import { updateH5Title } from "@/utils/base";

// const mock = {
//   "data": [
//       {
//           "time": "2021-08-08 12:35:00",
//           "ftime": "2021-08-08 12:35:00",
//           "context": "【杭州市】 您的快递已签收, 签收人在【蜂站科技的新湖菲林蜂站】(新湖菲林14幢负一层)领取。如有疑问请电联:（18072994786）, 投诉电话:（13738177720）, 您的快递已经妥投。风里来雨里去, 只为客官您满意。上有老下有小, 赏个好评好不好？【请在评价快递员处帮忙点亮五颗星星哦~】",
//           "location": ""
//       },
//       {
//           "time": "2021-08-07 14:53:10",
//           "ftime": "2021-08-07 14:53:10",
//           "context": "【杭州市】 快件已被【蜂站科技的新湖菲林蜂站】代收，如有问题请电联（13738177720），感谢使用中通快递，期待再次为您服务！",
//           "location": ""
//       },
//       {
//           "time": "2021-08-07 10:48:15",
//           "ftime": "2021-08-07 10:48:15",
//           "context": "【杭州市】 【杭州仓前】 的叶竹万（18072994786） 正在第1次派件, 请保持电话畅通,并耐心等待（95720为中通快递员外呼专属号码，请放心接听）",
//           "location": ""
//       },
//       {
//           "time": "2021-08-07 07:18:48",
//           "ftime": "2021-08-07 07:18:48",
//           "context": "【杭州市】 快件已经到达 【杭州仓前】",
//           "location": ""
//       },
//       {
//           "time": "2021-08-07 05:14:58",
//           "ftime": "2021-08-07 05:14:58",
//           "context": "【嘉兴市】 快件离开 【杭州中转部】 已发往 【杭州仓前】",
//           "location": ""
//       },
//       {
//           "time": "2021-08-07 04:18:55",
//           "ftime": "2021-08-07 04:18:55",
//           "context": "【嘉兴市】 快件已经到达 【杭州中转部】",
//           "location": ""
//       },
//       {
//           "time": "2021-08-06 23:47:37",
//           "ftime": "2021-08-06 23:47:37",
//           "context": "【上海市】 快件离开 【上海】 已发往 【杭州中转部】",
//           "location": ""
//       },
//       {
//           "time": "2021-08-06 23:47:26",
//           "ftime": "2021-08-06 23:47:26",
//           "context": "【上海市】 快件已经到达 【上海】",
//           "location": ""
//       },
//       {
//           "time": "2021-08-06 15:27:35",
//           "ftime": "2021-08-06 15:27:35",
//           "context": "【上海市】 【松江三部】（021-60665234） 的 夜班操作员刘法红（18721252934） 已揽收",
//           "location": ""
//       }
//   ]
// }

export default () => {

  const isBuyer = isBuyerNow()
  const page = Taro.getCurrentInstance()
  const [detail, setDetail] = useState<Required<IResapi2588>['data']>();

  const expressIcon = storge.getItem('expressIcon')


  useEffect(() => {

    (async() => {
      updateH5Title('物流详情')
      const {orderNo, orderReturnNo} = page.router?.params
      const p = orderReturnNo ?
        (isBuyer ? api2588({orderReturnNo}) : api2548({orderReturnNo})) :
        (isBuyer ? api2556({ orderNo }) : api2532({ orderNo }))
      const res = await p
      setDetail(res)
    })()
  }, [])

  const handleCopy = () => {
    Taro.setClipboardData({
      data: detail?.number || '',
      success: () => {
        Taro.showToast({
          title: '复制成功',
          icon: 'none',
        })
      }
    })
  }

  return <View>
   <View className='express-detail'>
      <View className='express-detail-info'>
        <Image className='express-detail-info-img' src={expressIcon}></Image>
        <View className='express-detail-info-content'>
          <View className='express-detail-info-content-status fz32'>{detail?.statusDescribe}</View>
          <View className='express-detail-info-content-num'>
            <Text className="m-r-4 fz28" >{detail?.company}:</Text>
            <Text className="fz28">{detail?.number}</Text>
            <Text className='copy-btn' onClick={handleCopy} >复制</Text>
          </View>
        </View>
      </View>
      <View className="express-detail-list">
        {
          (detail?.detailList || []).map((item, i) => {
            return <View className={`express-detail-item ${i === 0 ? 'express-detail-item__latest' : ''} ${i===detail?.detailList?.length - 1 ? 'express-detail-item__last' : ''}`}>
              <View>
                <Text className={`express-detail-item-round ${i===0 ? 'express-detail-item-round__active' : ''}`}></Text>
                <View>{item.context}</View>
                <View className="express-detail-item-time">{item.recordTime}</View>
              </View>
            </View>
          })
        }
      </View>

        {/* <View className='express-detail-stepBox-step'>
          <View className='express-detail-last express-detail-stepBox-step-item '>
              <Text className='express-detail-stepBox-step-item-tail'></Text>
              <View className='express-detail-stepBox-step-item-iconNormal'>

              </View>
              <View className='express-detail-stepBox-step-item-content'>
              <View className='express-detail-stepBox-step-item-content-status'>已签收</View>
                <View className='express-detail-item-active-text express-detail-stepBox-step-item-content-text'>您的快件正在派送中，请您准备签收（快递员：陈飞，联系电话：<Text className='express-detail-item-active-text-phone'>15236373710</Text></View>
                <View className='express-detail-stepBox-step-item-content-time m-t-8'>2021-06-15 14:21:32</View>
              </View>
          </View>
        </View> */}

    </View>
  </View>
}
