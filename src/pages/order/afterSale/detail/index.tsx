import storge, { isBuyerNow } from "@/utils/storge";
import { View, Text, Image, NavigationBar } from "@tarojs/components";
import { useState, useEffect, useMemo, useCallback } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { tim, TIM } from '@/service/im';

import './index.scss'
import api1676, { IResapi1676 } from "@/apis/21/api1676";
import api1924, { IResapi1924 } from "@/apis/21/api1924";
import compose, { countDownTimeStr, formatMoeny, fen2yuan, BwTaro } from "@/utils/base";
import { AtButton, AtTextarea } from "taro-ui";
import { AtButtonProps } from "taro-ui/types/button";
import { findObjectValue, IMID, isAppWebview, ORDER_STATUS, PRIMARY_COLOR, RETURN_APPLY_TYPE, RETURN_REASONS, RETURN_STATUS } from "@/constants";
import api2540 from "@/apis/21/api2540";
import api1948, { IResapi1948 } from "@/apis/21/api1948";
import api1996, { IResapi1996 } from "@/apis/21/api1996";
import BwModal from "@/components/Modal";
import dayjs from "dayjs";
import api2580 from "@/apis/21/api2580";
import { useRef } from "react";
import { useDidHide } from "@tarojs/runtime";
import { getCachedOrderRule, globalConfig, getUserInfo, timeDifference } from "@/utils/cachedService";
import api4094 from "@/apis/21/api4094";
import api4088 from "@/apis/21/api4088";
import { IOrderMsgDesc } from "@/pages/im/message/customMessage";
import api4424 from "@/apis/21/api4424";
import { isImReady } from "@/store/atoms";
import { useRecoilState } from "recoil";
import { req4082Config } from "@/apis/21/api4082";
import { request } from "@/service/http";
import { useTIMAutoLogin } from "@/pages/goods/components/SubmitBottom";
import { addWaterMarker, XImage } from "@/components/PreImage";

type IBtnName = '寄回货物' | '联系官方' | '撤销售后' | '物流查询' | '查看物流' | '拒绝售后' | '同意售后' | '拒绝退款' | '同意退款' | '售后物流' | '重新发货'

export default () => {
  let timeDifference = 0
  // const isBuyer = isBuyerNow()
  const [isBuyer, setIsBuyer] = useState(false)
  const page = Taro.getCurrentInstance()
  const orderNo = page.router?.params.orderNo
  const orderReturnNo = page.router?.params.orderReturnNo
  const [orderDetail, setOrderDetail] = useState<Required<IResapi1676>['data'] & Required<IResapi1924>['data']>();

  const [delayTime, setdelayTime] = useState(0);

  const [buyerAfterSaleDetail, setBuyerAfterSaleDetail] = useState<Required<IResapi1996>['data']>();

  const [merchantAfterSaleDetail, setMerchantAfterSaleDetail] = useState<Required<IResapi1948>['data']>();

  const { run: TIMAutoLogin } = useTIMAutoLogin()

  const [statusStr, setStatusStr] = useState({
    title: '',
    desc: ''
  });

  const [bools, setBools] = useState({
    refuseReson: false,
    reason: '',
  });

  const timer = useRef()

  const getMerchantOrder = async () => {
    const res = await api1924({ orderNo })
    setOrderDetail(res)
    // 根据 单号获取退货详情
    const res2 = await api1948({ orderReturnNo })
    setMerchantAfterSaleDetail(res2)
  }

  const getBuyerOrder = async () => {
    const res1 = await api1676({ orderNo })
    setOrderDetail(res1)
    const res = await api1996({ orderReturnNo })
    setBuyerAfterSaleDetail(res)

  }

  useDidShow(async () => {
    const userCurrentPosition = await getCachedOrderRule(orderNo)
    const a = userCurrentPosition === 'buyer'
    setIsBuyer(a)
    a ? getBuyerOrder() : getMerchantOrder()
  })

  const handlePreview = (current) => {
    Taro.previewImage({
      urls: detail.imgs.map(addWaterMarker),
      current: addWaterMarker(current)
    })
  }

  const handleBtnClick = async (name: IBtnName) => {
    name = name.trim()
    if (name === '物流查询' || name === '售后物流') {
      storge.setItem('expressIcon', detail.productIcon || '')
      Taro.navigateTo({
        url: `/pages/order/express/detail/index?orderReturnNo=${detail.uuid}&orderNo=${orderNo}`
      })
    }

    if (name === '查看物流') {
      storge.setItem('expressIcon', detail.productIcon || '')
      Taro.navigateTo({
        url: `/pages/order/express/detail/index?orderNo=${orderNo}`
      })
    }
    if (isBuyer) {

      if (name === '寄回货物') {
        Taro.navigateTo({
          url: `/pages/order/dispatch/index?orderReturnNo=${detail.uuid}&orderNo=${orderNo}`
        })
      }
      if (name === '联系官方') {
        const res3 = await api4424()
        const immsg = {
          to: res3?.identifier,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            text: `订单编号:${orderNo}\n售后单号:${orderReturnNo}\n等待客户输入详细问题～`
          },
          offLineMsg: '向您发起了一笔售后咨询~'
        }
        console.log({ ...immsg })
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'callAppSendIm',
            JSON.stringify(immsg),
            () => {
              // WebViewJavascriptBridge.callHandler(
              //   'openNativePage',
              //   JSON.stringify({
              //     page: '/im/chat',
              //     params: {
              //       identifier: res3?.identifier,
              //     }
              //   })
              // )
            }
          )
        } else {
          const tim = TIM.create(IMID)
          await tim.sendMessage(tim.createTextMessage(immsg))
          Taro.navigateTo({
            url: `/pages/im/message/index?id=${res3?.identifier}&type=1`
          })
        }
      }

      if (name === '撤销售后') {
        Taro.showModal({
          confirmText: '确认',
          confirmColor: PRIMARY_COLOR,
          cancelText: '取消',
          content: '撤销后 售后将关闭',
          success: async (res) => {
            if (!res.confirm) return
            await api2580({
              uuid: detail.uuid
            })
            Taro.showToast({
              icon: 'none',
              title: '已撤销'
            })
            if (Taro.getCurrentPages().length > 1) {
              Taro.navigateBack()
            } else {
              Taro.navigateTo({
                url: `/pages/index/index`
              })
            }
          }
        })
      }

      if (name === '重新发货') {
        Taro.navigateTo({
          url: `/pages/order/dispatch/index?orderReturnNo=${detail.uuid}&orderNo=${orderNo}`
        })
      }
    } else {
      // 商家
      if (name === '同意售后' || name === '同意退款') {
        Taro.showModal({
          confirmText: '确认',
          confirmColor: PRIMARY_COLOR,
          cancelText: '取消',
          content: (name === '同意售后' && [RETURN_STATUS.ing.children.wait.value, RETURN_STATUS.ing.children.ing.value].includes(detail.status)) ? '确认后，请联系用户寄回货品，48小时未寄回售后关闭' : '确认后钱款将直接退还用户',
          success: async (result) => {
            if (!result.confirm) return
            await api2540({
              uuid: detail.uuid,
              handleResult: 0,
            })
            Taro.showToast({
              icon: 'none',
              title: '已同意',
            })
            if (Taro.getCurrentPages().length > 1) {
              Taro.navigateBack()
            } else {
              BwTaro.navigateTo({
                url: '/pages/index/index'
              })
            }

          }
        })
      }

      if (name === '拒绝售后' || name === '拒绝退款') {
        setBools({ ...bools, refuseReson: true })
      }

    }
  }

  const detail = useMemo(() => {
    const type = isBuyer ? buyerAfterSaleDetail?.type : merchantAfterSaleDetail?.type
    // 0->待处理；1->退货中；2->已完成；3->已拒绝;4->已撤销
    const status = isBuyer ? buyerAfterSaleDetail?.status : merchantAfterSaleDetail?.status
    const proofPics = isBuyer ? buyerAfterSaleDetail?.proofPics : merchantAfterSaleDetail?.proofPics
    return {
      operateTimeout: isBuyer ? buyerAfterSaleDetail?.operateTimeout : merchantAfterSaleDetail?.operateTimeout,
      uuid: isBuyer ? buyerAfterSaleDetail?.uuid : merchantAfterSaleDetail?.uuid,
      type,
      typeStr: findObjectValue(RETURN_APPLY_TYPE, type)?.label,
      status,
      statusStr: isBuyer ? buyerAfterSaleDetail?.statusStr : merchantAfterSaleDetail?.statusStr,
      returnName: isBuyer ? buyerAfterSaleDetail?.returnName : merchantAfterSaleDetail?.returnName,
      returnPhone: isBuyer ? buyerAfterSaleDetail?.returnPhone : merchantAfterSaleDetail?.returnPhone,
      productIcon: orderDetail?.orderItemVO?.productPic,
      productName: orderDetail?.orderItemVO?.productName,
      productQuality: orderDetail?.orderItemVO?.productQuantity,
      productPrice: orderDetail?.orderItemVO?.productPrice,
      payAmount: orderDetail?.payAmount,
      description: isBuyer ? buyerAfterSaleDetail?.description : merchantAfterSaleDetail?.description,
      phone: isBuyer ? buyerAfterSaleDetail?.returnPhone : merchantAfterSaleDetail?.returnPhone,
      // handleNote 不对
      createTime: dayjs(isBuyer ? buyerAfterSaleDetail?.gmtCreate : merchantAfterSaleDetail?.gmtCreate).format('YYYY-MM-DD HH:mm:ss'),
      returnAmount: isBuyer ? buyerAfterSaleDetail?.returnAmount : merchantAfterSaleDetail?.returnAmount,
      reason: isBuyer ? buyerAfterSaleDetail?.reason : merchantAfterSaleDetail?.reason,
      imgs: proofPics ? proofPics.split(',') : [],
    }
  }, [buyerAfterSaleDetail, merchantAfterSaleDetail,])

  const Btn = useCallback((props: AtButtonProps & { children: any; }) => <View className="afterSaleDetailPage-btn-wrap"><AtButton size="small" onClick={(e) => {
    e?.stopPropagation?.()
    handleBtnClick(props.children)
  }} {...props} /></View>, [detail])

  useEffect(() => {
    const data = {
      title: detail.typeStr,
      desc: detail.statusStr
    }
    // 卖家已同意，等待卖家寄回
    // 卖家已拒绝，待官方客服介入 (退货退款直接被商家拒绝)
    // 卖家已拒绝，待官方客服介入 (退货退款，商家同意退货，用户退货再次被商家拒绝)
    // 售后完成  已退货退款
    // 售后完成  已退款
    // 售后完成  售后关闭 买家撤销售后
    // 售后完成  售后关闭 平台裁决关闭售后
    // 售后完成  售后关闭 平台裁决退款
    if (
      detail.type === RETURN_APPLY_TYPE.moneyAndProduct.value &&
      detail.status === RETURN_STATUS.ing.children.wait.value
    ) {
      // 待商家处理 展示倒计时 https://bowu.yuque.com/staff-vbdfzc/dmfe0a/ptaox4#PAv8
      const s = () => {
        const r = countDownTimeStr(detail.operateTimeout || 0, timeDifference)
        data.desc = r ? `${r.h}小时${r.m}分钟${r.s}秒后，系统自动关闭` : ''
        setStatusStr(data)
      }

      clearInterval(timer.current)
      timer.current = setInterval(s, 1000)
    } else {
      clearInterval(timer.current)
      setStatusStr(data)
    }
  }, [detail])

  useEffect(() => {

    globalConfig().then(res => {
      timeDifference = res.timeDifference
    })

    return () => {
      clearInterval(timer.current)
    }
  }, [])

  useDidHide(() => {
    clearInterval(timer.current)
  })

  const handleReason = useCallback(async (handleResult: 0 | 1) => {
    await api2540({
      uuid: detail.uuid,
      handleResult,
      handleNote: handleResult === 0 ? '' : bools.reason,
    })
    Taro.showToast({
      icon: 'none',
      title: `已${handleResult === 0 ? '同意' : '拒绝'}`,
    })
    // 上一页状态应该刷新
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack()
    } else {
      BwTaro.navigateTo({
        url: '/pages/index/index'
      })
    }
  }, [bools, buyerAfterSaleDetail, merchantAfterSaleDetail])

  const handleCopy = (str) => {
    Taro.setClipboardData({
      data: str,
      success: () => {
        if (process.env.TARO_ENV === 'h5') {
          Taro.showToast({
            icon: 'none',
            title: '已复制'
          })
        }
      }
    })
  }

  // const reasonStr = useMemo(() => {
  //   return Object.keys(RETURN_REASONS).map(key => RETURN_REASONS[key]).find(item => item.value === Number(detail.reason))?.label
  // }, [detail])

  const handleNote = isBuyer ? buyerAfterSaleDetail?.handleNote : merchantAfterSaleDetail?.handleNote

  const afterSaleStatus = isBuyer ? buyerAfterSaleDetail?.status : merchantAfterSaleDetail?.status

  const toChat = async () => {
    await TIMAutoLogin()
    const res = await (isBuyer ? api4094({ merchantId: orderDetail?.merchantId }) : api4088({ userId: orderDetail?.userId }))
    const identifier = res?.identifier
    const description: IOrderMsgDesc = {
      _sender: isBuyer ? 'buyer' : 'merchant',
      _type: 'orderCard',
      porductName: orderDetail?.orderItemVO?.productName,
      productIcon: orderDetail?.orderItemVO?.productPic,
      orderNo: orderDetail?.uuid,
      orderSatus: orderDetail?.status,
      orderSatusStr: Object.keys(ORDER_STATUS).reduce((res, current) => {
        const { label, value } = ORDER_STATUS[current]
        res[value] = label
        return res
      }, {})[orderDetail?.status] || '',
      orderTitle: (() => {
        if (!isBuyer && orderDetail?.status === ORDER_STATUS.waitPay.value) return '亲，请及时支付'
        if (isBuyer && orderDetail?.status === ORDER_STATUS.waitDispatch.value) return '亲，请尽快发货'
        if (!isBuyer && orderDetail?.status === ORDER_STATUS.hasReceive.value && orderDetail.returnStatus === RETURN_STATUS.none.value) return '亲，麻烦给个好评哦'
        return ''
      })()
    }

    const immsg = {
      to: identifier,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        data: JSON.stringify(description),
        description: JSON.stringify(description)
      },
      offLineMsg: '向您发起了一笔售后咨询~'
    }

    // 区分app H5，并发送消息卡片
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler(
        'callAppSendIm',
        JSON.stringify(immsg),
        () => {
          // WebViewJavascriptBridge.callHandler(
          //   'openNativePage',
          //   JSON.stringify({
          //     page: '/im/chat',
          //     params: {
          //       identifier
          //     }
          //   })
          // )
        }
      )

    } else {
      const userInfo = await getUserInfo()
      const tim = TIM.create(IMID)
      await tim.sendMessage(tim.createCustomMessage(immsg), {
        // 如果接收方不在线，则消息将存入漫游，且进行离线推送（在接收方 App 退后台或者进程被 kill 的情况下）。接入侧可自定义离线推送的标题及内容
        offlinePushInfo: {
          title: userInfo?.nickName, // 离线推送标题
          description: '向您发起了一笔售后咨询~', // 离线推送内容
        }
      }).catch(function (imError) {
        // 发送失败
        // console.warn('sendMessage error:', imError);
        Taro.showToast({
          title: imError,
          icon: 'none'
        })
      });
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${identifier}&type=1`
      })
    }

  }

  const toProduct = useCallback(() => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?orderNo=${orderNo}`
    })
  }, [orderNo])

  return <View className="afterSaleDetailPage">
    <View className="afterSaleDetailPage-status p-32">
      {/* 退货退款 */}
      <View className="fz40">{statusStr.title}</View>
      <View className="fz28">{statusStr.desc}</View>
    </View>
    <View className="afterSaleDetailPage-lines">
      <View className="afterSaleDetailPage-lines-item items-center fz28">
        退款金额：<Text className="color-primary">￥{compose(formatMoeny, fen2yuan)(detail.returnAmount)}</Text>
      </View>
      <View className="afterSaleDetailPage-lines-item fz28">
        <View>退款原因：<Text>{detail.reason}</Text></View>
        {
          detail.imgs.length > 0 && <View className="afterSaleDetailPage-lines-item-imgs m-t-24">
            {
              detail.imgs.map((img, i) => <XImage src={img} key={i} mode="aspectFill" className="afterSaleDetailPage-lines-item-img" onClick={() => handlePreview(img)} />)
            }
          </View>
        }

        {
          !!handleNote && <View className="color-primary fz24 m-t-12">拒绝原因：{handleNote} </View>
        }


      </View>
    </View>

    <View className="afterSaleDetailPage-product" onClick={toProduct}>
      <View className="afterSaleDetailPage-product-content">
        <XImage src={detail.productIcon || ''} className="afterSaleDetailPage-product-content-icon" mode="aspectFill" />
        <View className="afterSaleDetailPage-product-content-texts fz28">
          <View className="afterSaleDetailPage-product-content-texts-name">{detail.productName}</View>
          <View className="justify-between">
            <View>￥{compose(formatMoeny, fen2yuan)(detail.productPrice)}</View>
            <View className="color999">x{detail.productQuality}</View>
          </View>
        </View>
      </View>
      <View className="afterSaleDetailPage-product-footer fz28">
        {
          isBuyer && (<>
            实际支付：<Text className="color-primary fz24">￥</Text><Text className="color-primary">{compose(formatMoeny, fen2yuan)(detail.payAmount)}</Text>
          </>)
        }

        {
          !isBuyer && (<>
            {/* 已发货 待商家处理的售后单，可以查看订单物流 */}
            {
              orderDetail?.status === ORDER_STATUS.hasDispatch.value &&
              afterSaleStatus === RETURN_STATUS.ing.children.wait.value &&
              <Btn>查看物流</Btn>
            }
            {
              detail.type === RETURN_APPLY_TYPE.moneyAndProduct.value && [
                RETURN_STATUS.ing.children.onTheWay.value,
                RETURN_STATUS.ing.children.end.value,
              ].includes(afterSaleStatus) && <Btn>售后物流</Btn>
            }
            {
              detail.type === RETURN_APPLY_TYPE.moneyAndProduct.value &&
              [
                RETURN_STATUS.ing.children.onTheWay.value,
                RETURN_STATUS.ing.children.wait.value
              ].includes(afterSaleStatus) && <>
                <Btn>拒绝售后</Btn>
                <Btn type="secondary">同意售后</Btn>
              </>
            }

            {
              detail.type === RETURN_APPLY_TYPE.onlyMoney.value && afterSaleStatus === RETURN_STATUS.ing.children.wait.value && <>
                <Btn>拒绝退款</Btn>
                <Btn type="secondary">同意退款</Btn>
              </>
            }

          </>)
        }

      </View>
    </View>

    <View className="afterSaleDetailPage-order m-b-24">
      <View className="fz28 p-32">
        <View className="fz32 fontColor mb24">订单信息</View>
        <View className="flex items-center">
          <View className="m-r-32 color999">订单编号：</View>
          <View className="tabColor">{orderNo}</View>
          <Text className="copy-btn" onClick={() => handleCopy(orderNo)}>复制</Text>
        </View>

        <View className="flex items-center m-b-12">
          <View className="m-r-32 color999">售后单号：</View>
          <View className="tabColor">{detail.uuid} </View>
          <Text className="copy-btn" onClick={() => handleCopy(detail.uuid)}>复制</Text>
        </View>

        <View className="flex items-center m-b-24">
          <View className="m-r-32 color999">退款说明：</View>
          <View className="tabColor">{detail.description} </View>
        </View>
        {
          !!detail.returnName && <View className="flex items-center m-b-24">
            <View className="m-r-58 color999">联系人：</View>
            <View className="tabColor">{detail.returnName} </View>
          </View>
        }
        {
          !!detail.phone &&
          <View className="flex items-center m-b-24">
            <View className="m-r-32 color999">联系方式：</View>
            <View className="tabColor">{detail.phone}</View>
          </View>
        }

        <View className="flex items-center">
          <View className="m-r-32 color999">申请时间：</View>
          <View className="tabColor">{detail.createTime}</View>
        </View>
      </View>
      <View className="fz28 tabColor afterSaleDetailPage-order-footer p-24" onClick={toChat}>
        <Text className="myIcon m-r-12 fz28">&#xe705;</Text>
        联系{isBuyer ? '卖家' : '买家'}
      </View>
    </View>

    <View className="afterSaleDetailPage-histories" onClick={() => Taro.navigateTo({
      url: `/pages/order/afterSale/discussion/index?orderReturnNo=${orderReturnNo}&orderNo=${orderNo}`
    })}>
      <View className="p-24 justify-between fz32">
        <Text>协商记录</Text>
        <Text className="myIcon fz32">&#xe726;</Text>
      </View>
    </View>
    {
      orderDetail &&
      <View className="afterSaleDetailPage-footer">
        {
          isBuyer &&
          orderDetail.status === ORDER_STATUS.hasDispatch.value &&
          afterSaleStatus === RETURN_STATUS.ing.children.ing.value &&
          <Btn type="secondary">寄回货物</Btn>
        }
        {
          isBuyer && ![
            RETURN_STATUS.ing.children.revoke.value,
            RETURN_STATUS.ing.children.end.value,
            RETURN_STATUS.ing.children.onTheWay.value,
          ].includes(afterSaleStatus) && <Btn type="secondary">撤销售后</Btn>
        }
        {
          isBuyer && afterSaleStatus === RETURN_STATUS.ing.children.refuse.value && <Btn>联系官方</Btn>
        }
        {/* 退货中 */}
        {
          isBuyer &&
          detail.type === RETURN_APPLY_TYPE.moneyAndProduct.value &&
          afterSaleStatus === RETURN_STATUS.ing.children.onTheWay.value &&
          <Btn>售后物流</Btn>
        }
        {
          isBuyer &&
          detail.type === RETURN_APPLY_TYPE.moneyAndProduct.value &&
          afterSaleStatus === RETURN_STATUS.ing.children.onTheWay.value &&
          <Btn type="secondary">重新发货</Btn>
        }
      </View>
    }

    <BwModal
      title="填写拒绝原因"
      confirmText="确认"
      cancelText="取消"
      visible={bools.refuseReson}
      onClose={() => setBools({ ...bools, refuseReson: false })}
      content={<View className="reason-box">
        <AtTextarea placeholder="请输入原因" value={bools.reason} onChange={reason => setBools({ ...bools, reason })} maxLength={50} />
      </View>}
      onCancel={() => setBools({ ...bools, refuseReson: false })}
      onConfirm={() => handleReason(1)}
    ></BwModal>

  </View>
}