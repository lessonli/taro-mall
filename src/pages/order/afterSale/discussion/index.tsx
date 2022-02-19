import { isBuyerNow } from "@/utils/storge";
import { View, Text, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import {useBoolean}  from 'ahooks'
import Taro from "@tarojs/taro";
import './index.scss'
import api3722, {IResapi3722} from "@/apis/21/api3722";
import api3716 from "@/apis/21/api3716";

import './index.scss'
import dayjs from "dayjs";
import { bw_icon, empty } from "@/constants/images";
import Empty from "@/components/Empty";
import { addWaterMarker } from "@/components/PreImage";

const operates = {
  0: '系统自动操作',
  1: '用户',
  2: '商户',
  3: '后台管理员'
}

const operateTypes = {
  0: '创建售后',
  1: '同意售后',
  2: '拒绝售后',
  3: '售后发货',
  4: '售后收货',
  5: '撤销售后',
  6: '删除售后',
}

const sdata = {
  "code": 1172463001866448,
  "message": "JYPXJhC",
  "traceId": "7]zs",
  "data": [
    {
      "orderReturnNo": "H^t^F",
      "orderNo": "ew1H",
      "operatorType": 0,
      "operator": "@d%4",
      "operatorIcon": "http://dummyimage.com/180x150",
      "operateTime": "R5tP]F",
      "remark": "qeVygz",
      "extList": [
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/180x150"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/125x125"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/234x60"
        }
      ]
    },
    {
      "orderReturnNo": "KA*jY0",
      "orderNo": "Ii[gC",
      "operatorType": 1,
      "operator": "RkHFOiA",
      "operatorIcon": "http://dummyimage.com/720x300",
      "operateTime": ")5Oe(",
      "remark": "4@aVy",
      "extList": [
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x240"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/180x150"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/468x60"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x240"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/160x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        }
      ]
    },
    {
      "orderReturnNo": "dFCcjmU",
      "orderNo": "OW0ok",
      "operatorType": 2,
      "operator": "sV[a",
      "operatorIcon": "http://dummyimage.com/125x125",
      "operateTime": "cTD3",
      "remark": "wQ6R",
      "extList": [
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/720x300"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x240"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/240x400"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/468x60"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        }
      ]
    },
    {
      "orderReturnNo": "VrWCq",
      "orderNo": "*A$oN",
      "operatorType": -5664156630487648,
      "operator": "AJ6yD",
      "operatorIcon": "http://dummyimage.com/728x90",
      "operateTime": "DCJ1Z$H",
      "remark": "EezkSUM",
      "extList": [
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/125x125"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/160x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/180x150"
        }
      ]
    },
    {
      "orderReturnNo": "d9i&k",
      "orderNo": "uCbgEM",
      "operatorType": 7642213576585328,
      "operator": "L5h#M",
      "operatorIcon": "http://dummyimage.com/125x125",
      "operateTime": "6J1@[%7",
      "remark": "7GsQU",
      "extList": [
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/125x125"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/234x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/468x60"
        }
      ]
    },
    {
      "orderReturnNo": "xCe",
      "orderNo": "ot0eE",
      "operatorType": 8354109905618864,
      "operator": "f&k4",
      "operatorIcon": "http://dummyimage.com/468x60",
      "operateTime": "Y5mFgqv",
      "remark": "ood",
      "extList": [
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/720x300"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/468x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/720x300"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x240"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/240x400"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/180x150"
        }
      ]
    },
    {
      "orderReturnNo": "loKEyex",
      "orderNo": "!U1",
      "operatorType": 8557539564973008,
      "operator": "vkgM",
      "operatorIcon": "http://dummyimage.com/250x250",
      "operateTime": "Moc8",
      "remark": "4pn",
      "extList": [
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/720x300"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/125x125"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/720x300"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/240x400"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        }
      ]
    },
    {
      "orderReturnNo": "8Y%@4S",
      "orderNo": "1(D4",
      "operatorType": -1775533551052384,
      "operator": "GR&Pgp",
      "operatorIcon": "http://dummyimage.com/728x90",
      "operateTime": "pZ%Zks",
      "remark": "@bM*",
      "extList": [
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x250"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/160x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/160x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/180x150"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        }
      ]
    },
    {
      "orderReturnNo": "9r#5p",
      "orderNo": "T1X]p",
      "operatorType": -5577513299864360,
      "operator": "OAFgl",
      "operatorIcon": "http://dummyimage.com/120x240",
      "operateTime": "UvI",
      "remark": "CB03y",
      "extList": [
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x90"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x240"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/720x300"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/300x600"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/468x60"
        }
      ]
    },
    {
      "orderReturnNo": "7I#MnX",
      "orderNo": "ARiyLp",
      "operatorType": 3026526242508600,
      "operator": "vVu@c",
      "operatorIcon": "http://dummyimage.com/160x600",
      "operateTime": "460ezb",
      "remark": "0y%Z",
      "extList": [
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x240"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/468x60"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/336x280"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/728x90"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/234x60"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/240x400"
        },
        {
          "type": 1,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x60"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/250x250"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/120x600"
        },
        {
          "type": 0,
          "label": "四个字啊",
          "value": "http://dummyimage.com/88x31"
        }
      ]
    }
  ]
}
console.log('sdata', sdata)
export default () => {

  const page = Taro.getCurrentInstance()
  
  const isBuyer = isBuyerNow()
  const [active,{setTrue, setFalse}] = useBoolean(true)

  const [list, setList] = useState<Required<IResapi3722>['data']>([]);

  useEffect(() => {
    (async () => {
      const {orderReturnNo, orderNo} = page.router?.params
      const res = await (isBuyer ? api3722 : api3716)({orderNo})
      console.log(res)
      setList(res)
    })()
  }, [])

  const handlePreview = (data) => {
    Taro.previewImage(data)
  }

  return (
    <View>
      {
        (list || []).map((item, i) => {
          return <View className='afterScale-discussion' key={i}>
            <View className='afterScale-discussion-head'>
              <Image className={`afterScale-discussion-head-img ${item.operatorType === 1 ? 'afterScale-discussion-head-RoundImg' : ''}`} src={
                [0,3].includes(item.operatorType) ? bw_icon : item.operatorIcon
              }></Image>
              <View>
                <View className='afterScale-discussion-title'>{item.operator}</View>
                <View className='afterScale-discussion-time m-t-16'>{dayjs(item.operateTime).format('YYYY-MM-DD HH:mm:ss')}</View>
              </View>
            </View>
            <View className='afterScale-discussion-info'>
              <Text>{item.remark}</Text>
              {
                (item.extList || []).map((ele, j) => {
                  if (Number(ele.type) === 0) {
                    return <View key={j}>
                      <Text className='m-r-8'>{ele.label}:</Text>
                      <Text>{ele.value}</Text>
                    </View>
                  }
                  // 图片类型
                  const pics = !!ele.value ? ele.value.split(',') : []
                  return <View key={j}>
                    {
                      pics.map((src, k) => {
                        return <Image src={src} key={k} className="afterScale-discussion-info-image" onClick={() => handlePreview({ urls: pics.map(addWaterMarker), current: addWaterMarker(src) })} />
                      })
                    }
                    
                  </View>
                })
              }
             
            </View>
          </View>
        })
      }
      {
        list?.length === 0 && <Empty src={empty} text="暂无协商记录" className="m-t-120" /> 
      }
    
    </View>
    
    
  )
}