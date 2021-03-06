import api1676, { IResapi1676 } from "@/apis/21/api1676"
import NavigationBar, { navigationBarPageStyle, SingleBackBtn } from "@/components/NavigationBar"
import storge, { isBuyerNow, session } from "@/utils/storge"
import { View, Text, Image } from "@tarojs/components"
import { useCallback, useMemo, useEffect, useState } from "react"
import OrderGoodCard, { OrderCodeCard, IProduct, ExpressRecently } from "@/pages/order/components/OrderGoodCard";
import Taro, { scanCode } from "@tarojs/taro";

import './index.scss'
import ListItem from "@/components/ListItem"
import { AtButton, AtInput } from "taro-ui"
import { useReady, useDidShow } from "@tarojs/runtime"
import { getWxConfig, setWxH5Config, useWxShare } from "@/utils/hooks"
import api1932 from "@/apis/21/api1932"
import api2572 from "@/apis/21/api2572"
import BwModal from "@/components/Modal"
import compose, { formatMoeny, fen2yuan } from "@/utils/base"
import { saomiao } from "@/constants/images"
import api1996, { IResapi1996 } from "@/apis/21/api1996"
import Schema, { Rules } from "async-validator"
import events from "@/constants/eventBus"
import api3530, { IResapi3530 } from "@/apis/21/api3530"
import Popup from "@/components/Popup"
import { RadioItem } from "@/components/RadioScrollList"
import { DEVICE_NAME, ORDER_STATUS, RETURN_STATUS } from "@/constants"
import api4436 from "@/apis/21/api4436"
import api4430 from "@/apis/21/api4430"
import { getCachedOrderRule } from "@/utils/cachedService"

export default () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])


  const orderNo = page.router?.params.orderNo
  const orderReturnNo = page.router?.params.orderReturnNo

  // const isBuyer = isBuyerNow()
  const [isBuyer, setIsBuyer] = useState(false)

  const [orderDetail, setOrderDetail] = useState<Required<IResapi1676>['data'] | undefined>(undefined);

  const [visibles, setvisibles] = useState({
    confirm: false,
    scanResults: false,
  });

  const [scanResults, setScanResults] = useState<Required<IResapi3530>['data']>([
    // {companyCode: '1xsssss', companyName: 'xxxx'},
    // {companyCode: '22222', companyName: '22222'},
  ]);

  const [afterSaleDetail, setAfterSaleDetail] = useState<Required<IResapi1996>['data']>({});

  const [formValues, setFormValues] = useState({
    deliveryCompany: '',
    deliveryCompanyName: '',
    deliveryNo: ''
  });
  // ?????? ????????????????????? ??????
  const getorderDetail = useCallback(async () => {
    const res = await api1676({ orderNo })
    setOrderDetail(res)
    // ????????? ?????????????????????
    if (res?.status === ORDER_STATUS.hasDispatch.value && !isBuyer) {
      const res2 = await api4436({ orderNo })
      setFormValues({
        ...formValues,
        deliveryCompany: res2?.company,
        deliveryCompanyName: res2?.company,
        deliveryNo: res2?.number,
      })
    }
  }, [])

  // ?????? ??????????????? ???????????? ??????
  const getAfterSaleDetail = useCallback(async () => {
    if (!orderReturnNo) return
    const res = await api1996({ orderReturnNo })
    setAfterSaleDetail(res)
    // ?????? ????????? ????????????????????????
    console.log(res?.status, RETURN_STATUS.ing.children.onTheWay.value)
    if (res?.status === RETURN_STATUS.ing.children.onTheWay.value) {
      const res2 = await api4430({ orderReturnNo })
      setFormValues({
        ...formValues,
        deliveryCompany: res2?.company,
        deliveryCompanyName: res2?.company,
        deliveryNo: res2?.number,
      })
    }
  }, [])

  const productItem: IProduct = useMemo(() => {
    return {
      name: orderDetail?.orderItemVO?.productName,
      icon: orderDetail?.orderItemVO?.productPic,
      merchantName: orderDetail?.orderItemVO?.merchantName,
      merchantId: orderDetail?.orderItemVO?.merchantId,
      productId: orderDetail?.orderItemVO?.productId,
      freightPrice: orderDetail?.freightAmount || 0,
      price: orderDetail?.orderItemVO?.productPrice,
      note: orderDetail?.note,
    }
  }, [orderDetail])

  const receiver = useMemo(() => {

    return {
      name: isBuyer ? afterSaleDetail.merchantAddressVO?.name : orderDetail?.orderAddressVO?.receiverName,
      phone: isBuyer ? afterSaleDetail.merchantAddressVO?.mobile : orderDetail?.orderAddressVO?.receiverPhone,
      addr: isBuyer ? `${afterSaleDetail.merchantAddressVO?.province} ${afterSaleDetail.merchantAddressVO?.city} ${afterSaleDetail.merchantAddressVO?.district} ${afterSaleDetail.merchantAddressVO?.detailAddress}` : `${orderDetail?.orderAddressVO?.receiverProvince} ${orderDetail?.orderAddressVO?.receiverCity} ${orderDetail?.orderAddressVO?.receiverDistrict} ${orderDetail?.orderAddressVO?.receiverAddress}`
    }

  }, [orderDetail, afterSaleDetail])

  useDidShow(() => {
    const { companyCode, companyName } = session.getItem('pages/order/express/company/index')
    setFormValues({
      ...formValues,
      deliveryCompany: companyCode,
      deliveryCompanyName: companyName,
    })
    // ??????
    session.resetItem('pages/order/express/company/index')
  })

  useEffect(() => {
    getCachedOrderRule(orderNo).then(userCurrentPosition => {
      const a = userCurrentPosition === 'buyer'
      setIsBuyer(a)
      getorderDetail()
      a && getAfterSaleDetail()
    })
  }, [])

  useWxShare()

  const handleScan = () => {
    // TODO: APP
    const scan = async (deliveryNo: string) => {
      const newVals = {
        ...formValues,
        deliveryNo,
      }
      setFormValues(newVals)

      const list = await api3530({ expressCode: deliveryNo })
      if (list && list.length > 1) {
        setScanResults(list)
        setvisibles({
          ...visibles,
          scanResults: true,
        })
      } else if (list?.length === 1) {
        const { companyName, companyCode } = list?.[0]
        const a = {
          ...newVals,
          deliveryCompany: companyCode,
          deliveryCompanyName: companyName,
        }
        /**
         * ?????? ?????????ios / ?????? didshow ??????????????????????????????
         * ios ??????????????????????????? didShow??????
         * ?????? didShow?????? api???????????????????????????
         */

        session.setItem('pages/order/express/company/index', {
          companyCode,
          companyName,
        })

        setFormValues(a)
      } else {
        // ?????????????????????
        Taro.showToast({
          icon: 'none',
          title: '???????????????????????????'
        })
      }
    }

    if (DEVICE_NAME === 'wxh5') {
      wx.scanQRCode({
        needResult: 1,
        scanType: ['barCode'],
        success: res => {
          const codes = res.resultStr?.split(',') || []
          const deliveryNo = codes[codes.length - 1]
          if (!!deliveryNo) scan(deliveryNo)
        }
      })
    } else if (DEVICE_NAME === 'androidbwh5' || DEVICE_NAME === 'iosbwh5') {
      WebViewJavascriptBridge.callHandler(
        'scanCode',
        JSON.stringify({ scanType: ['barCode'] }),
        res => {
          const { code, data } = JSON.parse(res)
          console.log('????????????', data)
          if (!!data) scan(data)
        }
      )
    } else if (DEVICE_NAME === 'webh5') {
      Taro.showToast({
        icon: 'none',
        title: '??????????????????'
      })
    } else {
      Taro.scanCode({
        scanType: ['barCode'],
        success: (res) => {
          const codes = res.result?.split(',') || []
          const deliveryNo = codes[codes.length - 1]
          if (!!deliveryNo) scan(deliveryNo)
        }
      })
    }
  }

  const handleCopy = () => {
    Taro.setClipboardData({
      data: `${receiver.name} ${receiver.phone} ${receiver.addr}`,
      success: () => {
        Taro.showToast({
          icon: 'none',
          title: '????????????'
        })
      }
    })
  }

  const handleSubmit = async () => {
    const fn = isBuyer ? api2572({
      // ????????????
      // deliveryCompanyName: formValues.deliveryCompanyName,
      deliveryCompany: formValues.deliveryCompanyName,
      deliveryNo: formValues.deliveryNo,
      // ????????????
      uuid: afterSaleDetail.uuid || orderReturnNo,
    }) : api1932({
      // ????????????
      orderNo: page.router?.params.orderNo,
      deliveryCompany: formValues.deliveryCompanyName,
      // deliveryCompanyName: formValues.deliveryCompanyName,
      deliveryNo: formValues.deliveryNo,
      // TODO: 
      pollStatus: 1,
    })
    await fn
    !isBuyer && session.setItem('pages/order/list/index', { needReload: true })
    Taro.showToast({
      icon: 'none',
      title: `${isBuyer ? '??????' : '??????'}???????????????`
    })
    Taro.navigateBack()
  }

  const handleSubmit2 = () => {
    const rules: Rules = {
      deliveryCompany: {
        required: true,
        message: '?????????????????????',
      },
      deliveryNo: {
        required: true,
        max: 20,
        type: 'string',
        message: '????????????????????????1~20?????????',
      }
    }

    const validator = new Schema(rules)
    validator.validate(
      formValues,
      { suppressWarning: true },
      (errs) => {
        console.log(errs)
        if (errs && errs.length > 0) {
          Taro.showToast(({
            title: errs[0].message,
            icon: 'none',
          }))
          return
        }
        setvisibles({ ...visibles, confirm: true })
      }
    )
  }

  const Content = useMemo(() => {
    return <View className="fahuoconfirm">
      <View className="fahuoconfirm-product">
        <Image src={orderDetail?.orderItemVO?.productPic || ''} className="fahuoconfirm-product-icon" />
        <View className="fahuoconfirm-product-detail">
          <View className="fahuoconfirm-product-detail-name">{orderDetail?.orderItemVO?.productName}</View>
          <View className="fahuoconfirm-product-detail-prices">
            <Text>??? {orderDetail?.orderItemVO?.productQuantity} ?????????</Text>
            <Text>{isBuyer ? '????????????' : '??????'}??????{compose(formatMoeny, fen2yuan)(isBuyer ? afterSaleDetail.returnAmount : orderDetail?.payAmount)}</Text>
          </View>
        </View>
      </View>

      <View className="fahuoconfirm-item">
        ???????????????<Text className="fahuoconfirm-item-v">{orderNo}</Text>
      </View>
      <View className="fahuoconfirm-item">
        ???????????????<Text className="fahuoconfirm-item-v">{formValues.deliveryCompanyName}</Text>
      </View>
      <View className="fahuoconfirm-item">
        ???????????????<Text className="fahuoconfirm-item-v">{formValues.deliveryNo}</Text>
      </View>

    </View>
  }, [formValues, orderDetail])


  const toPage = () => {
    // a => chooseList
    session.setItem('pages/order/express/company/index', {
      companyCode: formValues.deliveryCompany,
      companyName: formValues.deliveryCompanyName,
    })
    Taro.navigateTo({
      // url: `/pages/order/express/company/index?companyCode=${formValues.deliveryCompany || ''}&sourceUrl=${encodeURIComponent(page.router?.path || '')}`,
      url: `/pages/order/express/company/index`
    })
  }

  const currentCompany = useMemo(() => {
    return formValues.deliveryCompanyName ? formValues.deliveryCompanyName : '??????????????????'
  }, [formValues])

  return <View className="orderDispatchpage">
    <NavigationBar
      background="#ffffff"
      title={isBuyer ? '??????' : (orderDetail?.status === ORDER_STATUS.hasDispatch.value ? '????????????' : '??????')}
      leftBtn={<SingleBackBtn />}
    />
    <View className="orderDispatchpage-c">
      <View className="orderDispatchpage-c-productwrap">
        <View className="orderDispatchpage-c-product">
          <Image src={productItem.icon || ''} className="orderDispatchpage-c-product-icon" />
          <View className="orderDispatchpage-c-product-content">
            <View className="orderDispatchpage-c-product-content-name">{productItem.name}</View>
            {
              isBuyer && <View className="">
                ???????????? <Text className="color-primary">???</Text> <Text className="color-primary fz32">{compose(formatMoeny, fen2yuan)(afterSaleDetail.returnAmount)}</Text>
                {/* <View>???{productItem.price}</View> */}
                {/* <View>x{productItem.}</View> */}
              </View>
            }

            {
              !isBuyer && <View className="flex justify-between">
                <View>???{compose(formatMoeny, fen2yuan)(orderDetail?.orderItemVO?.productPrice)}</View>
                <View>x{orderDetail?.orderItemVO?.productQuantity}</View>
              </View>
            }

          </View>
        </View>
        {
          !isBuyer && <View className="fz24 justify-end items-end orderDispatchpage-c-product-pay">
            ???????????????<Text className="color-primary fz28">???{compose(formatMoeny, fen2yuan)(orderDetail?.payAmount)}</Text>
          </View>
        }
      </View>
      {/* <OrderGoodCard
        productItem={productItem}
        productQuantity={orderDetail?.orderItemVO?.productQuantity || 1}
        count={orderDetail?.totalAmount || 0}
        lastPay={orderDetail?.payAmount || 0}
        mode="orderDetail"
      /> */}
      {/* ???????????? */}
      <View className="orderDispatchpage-card">
        <View className="orderDispatchpage-card--title">????????????</View>
        <View className="orderDispatchpage-card--content orderDispatchpage-card-addr">
          <View className="orderDispatchpage-card-addr-l">
            <View className="orderDispatchpage-card-addr-l-1">{receiver.name || ''} <Text className="orderDispatchpage-card-addr-l-1-phone">{receiver.phone || ''}</Text></View>
            <View className="orderDispatchpage-card-addr-r">{receiver.addr || ''}</View>
          </View>
          <Text className="copy-btn" onClick={handleCopy} >??????</Text>
        </View>
      </View>

      <View className="orderDispatchpage-card">
        <View className="orderDispatchpage-card--title">????????????</View>
        <View className="orderDispatchpage-card--content">
          <ListItem
            type={1}
            left={'????????????'}
            right={<View className="orderDispatchpage-bianhao">
              <AtInput placeholder="????????????????????????" clear value={formValues.deliveryNo} onChange={v => setFormValues({ ...formValues, deliveryNo: v })} maxlength={20} />
            </View>}
            icon={<Image src={saomiao} className="orderDispatchpage-card--content-saomiao" onClick={handleScan} />}
          />

          <ListItem
            type={1}
            left={'????????????'}
            right={<View
              className={currentCompany === '??????????????????' ? 'color-placeholder' : 'tabColor'}
              onClick={toPage}>{currentCompany}</View>}
          />

        </View>
      </View>


    </View>

    <View className="orderDispatchpage-footer">
      <AtButton type="primary" onClick={handleSubmit2} >??????</AtButton>
    </View>

    <BwModal
      visible={visibles.confirm}
      onClose={() => setvisibles({ ...visibles, confirm: false })}
      onCancel={() => setvisibles({ ...visibles, confirm: false })}
      title={isBuyer ? '??????????????????' : '??????????????????'}
      content={Content}
      cancelText="??????"
      confirmText={`??????${isBuyer ? '???' : '???'}???`}
      onConfirm={handleSubmit}
    ></BwModal>

    <Popup
      title="????????????"
      visible={visibles.scanResults}
      onVisibleChange={scanResults => setvisibles({ ...visibles, scanResults })}
      headerType="close"
    >
      <View>
        {
          scanResults.map(({ companyCode, companyName }) => <RadioItem
            label={`${companyName}: ${formValues.deliveryNo}`}
            value={companyCode}
            checked={companyCode === formValues.deliveryCompany}
            onChecked={v => {
              const item = scanResults.find(e => e.companyCode === v)
              setFormValues({
                ...formValues,
                deliveryCompany: v,
                deliveryCompanyName: item?.companyName || '',
              })
              setTimeout(() => {
                setvisibles({
                  ...visibles,
                  scanResults: false,
                })
              }, 200)
            }}
          />)
        }
      </View>
    </Popup>
  </View>
}