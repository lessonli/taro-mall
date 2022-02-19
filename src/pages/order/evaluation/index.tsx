import api1676, { IResapi1676 } from "@/apis/21/api1676";
import api1756 from "@/apis/21/api1756";
import api1924 from "@/apis/21/api1924";
import Upload, { parseFiles2Str } from "@/components/Upload";
import { isBuyerNow, session } from "@/utils/storge";
import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useState } from "react";
import { AtButton, AtTextarea } from "taro-ui";

import './index.scss'

import Stars from "@/pages/order/evaluation/stars";
import { compose } from "redux";
import { formatMoeny, fen2yuan } from "@/utils/base";

/**
 * evaluation 订单评价
 */
export default () => {

  const page = Taro.getCurrentInstance()

  const params = page.router?.params

  const [orderDetail, setOrderDetail] = useState<Required<IResapi1676>['data']>()

  const [values, setValues] = useState({
    albumPicsArr: [],
    content: '',
    productScore: 5,
    serviceScore: 5,
    postageScore: 5,
  });

  const handleValuesChange = (name, value) => {
    setValues({
      ...values,
      [name]: value
    })
  }

  useEffect(() => {
    (async() => {
      const api = isBuyerNow() ? api1676 : api1924
      const res = await api({ orderNo: params?.orderNo })
      setOrderDetail(res)
    })()
  }, [])

  const handleSubmit = async () => {
    if (values.content === '') {
      Taro.showToast({
        icon: 'none',
        title: '请填写评价'
      })
      return
    }

    const {albumPicsArr, ...rest} = values
    
    await api1756({
      ...rest,
      orderNo: params?.orderNo,
      albumPics: parseFiles2Str(albumPicsArr || []),
    })
    session.setItem('pages/order/list/index', {needReload: true})
    Taro.showToast({
      icon: 'none',
      title: '评价成功!'
    })
    Taro.redirectTo({
      url: decodeURIComponent(params?.sourceUrl || ''),
    })
  }

  return <View className="evaluationPage">
    <View className="evaluationPage-product flex">
      <Image src={orderDetail?.orderItemVO?.productPic || ''} className="evaluationPage-product-icon"/>
      <View className="evaluationPage-product-texts flex">
        <View className="evaluationPage-product-texts-name">{orderDetail?.orderItemVO?.productName}</View>
        <View className="evaluationPage-product-texts-nums">
          ￥{compose(formatMoeny, fen2yuan)(orderDetail?.payAmount)}
        </View>
      </View>
    </View>

    <View className="evaluationPage-f2 p-32">
      <AtTextarea 
        placeholder="商品满足你的期望么？说说你的想法，分享给其他人吧～" 
        count={false}
        value={values.content}
        onChange={content => handleValuesChange('content', content)}
      ></AtTextarea>

      <Upload
        max={6}
        value={values.albumPicsArr}
        onChange={(v) => handleValuesChange('albumPicsArr', v)}
      />

    </View>
    {/*: 五星 */}
    <View className="evaluationPage-f3 p-32 m-t-24">
      <View className="evaluationPage-f3-item fz32 items-center m-b-32">
        <Text>商品质量</Text>
        <Stars value={values.productScore} onChange={v => handleValuesChange('productScore', v)} className="m-l-30"/>
      </View>
      <View className="evaluationPage-f3-item fz32 items-center m-b-32">
        <Text>服务态度</Text>
        <Stars value={values.serviceScore} onChange={v => handleValuesChange('serviceScore', v)} className="m-l-30"/>
      </View>
      <View className="evaluationPage-f3-item fz32 items-center m-b-64">
        <Text>物流服务</Text>
        <Stars value={values.postageScore} onChange={v => handleValuesChange('postageScore', v)} className="m-l-30"/>
      </View>

    </View>

    <View className="evaluationPage-footer">
      <AtButton type="primary" onClick={handleSubmit}>发布评价</AtButton>
    </View>

  </View>
}