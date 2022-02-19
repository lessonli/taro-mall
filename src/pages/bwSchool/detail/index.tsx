
import { View, Text } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useMemo, useCallback, useState,useEffect, useRef } from 'react'
import { RichText } from '@tarojs/components'

import dayjs from 'dayjs'
import './index.scss'

import api3554 from '@/apis/21/api3554'
import api3596, {IResapi3596} from '@/apis/21/api3596'
import { escape2Html } from '@/utils/base'
import { cachedWxConfig } from '@/utils/hooks'
import { host } from '@/service/http'
import { BWYD_ICON } from '@/constants/images'

type Idetail = Required<IResapi3596>['data']


function SchoolDetail(){
  const [content, setContent] = useState()
  const [detail, setDetail] = useState<Idetail>()
  const uuid = Taro.getCurrentInstance().router?.params?.uuid;
  const articleId = Taro.getCurrentInstance().router?.params?.articleId;

  const sharePromise = useRef(undefined)

  useEffect(()=>{  
    (async ()=>{
      const res = await api3596({uuid: uuid || articleId})
      sharePromise.current = api3554({shareType: 6, targetId: uuid || articleId})
      const data = await sharePromise.current
      setDetail(res)
      setContent(escape2Html(res?.content || ''))  
      cachedWxConfig().then(wx=>{
        const shareData = {
          title: res?.title,
          desc: data?.subTitle,
          link: data?.shareUrl,
          imgUrl: res?.icon,
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        }
        wx?.updateAppMessageShareData(shareData)
        wx?.onMenuShareTimeline(shareData)    
      })
    })()
  }, [])

  useShareAppMessage(async () => {
    const res = await sharePromise.current
    return {
      title: res?.title,
      path: res?.shareUrl?.replace(host, ''),
      imageUrl: res?.icon || BWYD_ICON,
    }
  })

  return (<View className='bw-schoolDetail'>
    <View className='bw-schoolDetail-title'>{detail?.title}</View>
    <View className='bw-schoolDetail-date'>
      <View>
        <Text className='m-r-16'>{detail?.author}</Text>
        <Text className='m-r-8'>{dayjs(detail?.gmtCreate).format('YYYY-MM-DD')}</Text>
        <Text className='m-r-8'>{dayjs(detail?.gmtCreate).format('HH:mm:ss')}</Text> 
    </View>
       
    </View>
    <View className='bw-schoolDetail-detail-richText' >
      <RichText nodes= {content} className={`bw-richtext bw-richtext_${process.env.TARO_ENV}`}></RichText>
    </View>
  </View>)
}

export default SchoolDetail
