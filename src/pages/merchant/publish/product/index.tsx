import { useEffect, useCallback, useMemo, useState } from "react";
import { View } from "@tarojs/components";
import NavigationBar, {SingleBackBtn} from "@/components/NavigationBar";

import Taro, { useReady } from "@tarojs/taro";
import Step1 from "@/pages/merchant/publish/components/step1";
import Step2 from "@/pages/merchant/publish/components/step2";
import { MERCHANT_AUCTION_STATUS, PRODUCT_TYPE } from "@/constants";

import storge from "@/utils/storge";
import api2906 from "@/apis/21/api2906";
import { setWxH5Config } from "@/utils/hooks";
import api3572 from "@/apis/21/api3572";

export default () => {

  const ins = Taro.getCurrentInstance()

  // @ts-ignore
  let { productId, productType, prevStatus } = ins.router?.params
  productType = Number(productType)
  productId = productId || undefined

  // 已经截拍的 失败 productId 只做信息复制， 不做提交
  const realProdId = (prevStatus && 
    [
      MERCHANT_AUCTION_STATUS.hasEnd.value,
      MERCHANT_AUCTION_STATUS.failed.value,
    ].includes(Number(prevStatus))) ? undefined : (productId || undefined)

  const [currentStep, setCurrentStep] = useState(1)
  const [prodductInfo, setProdductInfo] = useState({productType, productId});

  const title = useMemo(() => `发布${productType === PRODUCT_TYPE.PM.value ? PRODUCT_TYPE.PM.label : PRODUCT_TYPE.YKJ.label}`, [productType])
  

  const getInitalProductInfo = async () => {
    if (!productId) return    
    const res = await api3572({ uuid: productId })
    let auction = {}
    if (productType === PRODUCT_TYPE.PM.value) {
      auction = await api2906({ uuid: productId })
    }
    setProdductInfo({
      ...prodductInfo,
      ...(res || {}),
      ...{ auction: auction || {} },
    })

  }

  const handleFirstSubmit = (v) => {
    console.log('handleFirstSubmit', v)
    storge.setItem('publishProductInfo', {
      ...prodductInfo,
      ...v
    })
    setProdductInfo({
      ...prodductInfo,
      ...v,
    })
    setCurrentStep(2)
  }

  useEffect(() => {
    getInitalProductInfo()
    return () => {
    }
  }, []);

  console.log(ins.router)

  const currentHref = useMemo(() => {
    if (!ins.router) return ''
    const {path, params} = ins.router
    return process.env.TARO_ENV === 'weapp' ? `${path}?${Object.keys(params).map((b) => `${b}=${params[b]}`).join('&')}` : path
  }, [ins])

  return <View className="publishProduct">
    <NavigationBar
      title={title}
      background={'#ffffff'}
      leftBtn={<SingleBackBtn />}
    />
    <View>
      {
        currentStep === 1 && (
          <Step1 
            productType={productType} 
            productId={productId}
            prevInfo={productId ? prodductInfo : undefined}
            onSubmitSuccess={handleFirstSubmit}
            currentHref={currentHref}
          />
        )
      }

      {
        currentStep === 2 && (
          <Step2
            productId={productId}
            productType={productType}
            prevInfo={prodductInfo}
            isCreate={!realProdId}
          />
        )
      }

    </View>

  </View>
}