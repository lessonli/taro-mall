import { IResapi2140 } from '@/apis/21/api2140'
import api4660, { IResapi4660 } from '@/apis/21/api4660'
import api4668 from '@/apis/21/api4668'
import api4832, { IResapi4832 } from '@/apis/21/api4832'
import BwModal from '@/components/Modal'
import Popup from '@/components/Popup'
import { XImage } from '@/components/PreImage'
import { preview, redbag } from '@/constants/images'
import { dealName, deepClone, fen2yuan } from '@/utils/base'
import { View, Text, Radio, Label, RadioGroup } from '@tarojs/components'
import { useDidShow } from '@tarojs/runtime'
import Taro, { useRouter } from '@tarojs/taro'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import Coupons from '../Coupons'
import RedBag from '../RedBag'
import RedBagRules from '../RedBagRules'

import './index.scss'
export type IPreView = Required<IResapi2140["data"]>
export type ICoupon = Required<IResapi4832['data']>
export type IRedBag = Required<IResapi4660['data']>
interface IProps {
  type?: string
  preView: IPreView
  isBuyer?: boolean
  chooseCoupon?: (value?: any) => void
  chooseRedBag?: (value?: any) => void
  chooseDiscounts?: (value?: any, value2?: any) => void
  redBagDetail?: {
    maxRedPacketAmount?: number,
    userRedPacketAmount?: number
  }
}

const DiscountCard = (props: IProps) => {

  const [alertVisible, setAlertVisible] = useState<boolean>(false)

  const { params } = useRouter()

  const [redBag, setRedBag] = useState<any>({ discountAmount: '' })

  const [coupons, setCoupons] = useState<any>({ discountAmount: '' })

  const [couponDetail, setCouponDetail] = useState<Array<ICoupon>>([])

  const [isShowCoupon, setIsShowCoupon] = useState<boolean>(false)

  const [isShowRedBag, setIsShowRedBag] = useState<boolean>(false)

  const [useRedBagNum, setUseRedBagNum] = useState<string | number | undefined>()

  const [couponId, setCouponId] = useState<any>(undefined)

  const [checkedMoney, setCheckedMoney] = useState<any>()

  const [total, setTotal] = useState<number | undefined>(0)

  const [redPacketList, setRedPacketList] = useState([])

  useEffect(() => {

    setCoupons({ discountAmount: null })

    setRedBag({ discountAmount: null })

    if (props.preView?.discountList && props.preView?.discountList.length > 0) {

      props.preView.discountList.forEach((item) => {
        if (item.objType === 2) {
          // 2:优惠券折扣,
          setCoupons(item)

        } else if (item.objType === 3) {
          //3:红包抵扣

          setRedBag(item)
          !useRedBagNum && setUseRedBagNum(item.discountAmount)
          setCheckedMoney(item.discountAmount)
        }
      })
    }

  }, [props.preView])


  const openCoupons = useCallback(
    async () => {

      if (props.type !== 'orderDetail' && props.preView?.productInfo.uuid) {

        const list = await Promise.all([api4832({ productId: props.preView?.productInfo.uuid, enableStatus: 1, orderAmount: props.preView.totalAmount, activityId: params?.activityId || '' }), api4832({ productId: props.preView?.productInfo.uuid, enableStatus: 0, orderAmount: props.preView.totalAmount, activityId: params?.activityId || '' })])

        setCouponDetail(list)

        setIsShowCoupon(true)

      }

    },
    [props]
  )

  const openRedBag = useCallback(
    async () => {
      if (props.type !== 'orderDetail') {

        setIsShowRedBag(true)

        const result = await api4668({ neMerchantId: props.preView?.productInfo?.merchantId, statusList: '1,4' })

        setRedPacketList(result?.data)

      }
    },
    [props],
  )

  const chooseCoupon = useCallback((value) => {

    props.chooseDiscounts(value, useRedBagNum)

    setCouponId(value)

    setIsShowCoupon(false)

  }, [useRedBagNum])

  const chooseRedBag = useCallback((value) => {

    // if (couponId !== undefined) {

    const num = value.detail.value

    props.chooseDiscounts(couponId, num)

    setUseRedBagNum(num)

    setIsShowRedBag(false)

    // }

  }, [couponId])

  return (
    <View className='DiscountCard'>
      <View className='DiscountCard-item'>
        <View>
          <Text className='DiscountCard-item-title'>商品金额</Text>
          <Text className='DiscountCard-item-num'>共{props.preView?.productQuantity}件商品</Text>
        </View>
        <Text className='DiscountCard-item-price'>¥ {fen2yuan(props.preView?.productAmount)}</Text>
      </View>
      <View className='DiscountCard-item'>
        <View className='DiscountCard-item-title'>运费</View>
        <Text className='DiscountCard-item-price'>¥ {fen2yuan(props.preView?.freightAmount)}</Text>
      </View>
      <View className='DiscountCard-item' onClick={openCoupons}>
        <View>
          <Text className='DiscountCard-item-title'>优惠券</Text>
          {props.preView?.discountList && props.preView?.discountList.length > 0 && props.preView?.couponId && <Text className='DiscountCard-item-title-tips'>{props.preView?.discountList.filter(item => item.objType === 2)[0].objName}</Text>}
          {props.preView?.mCouponAmount > 0 && <Text className='DiscountCard-item-title-tips'>店铺券</Text>}
          {props.preView?.couponAmount > 0 && <Text className='DiscountCard-item-title-tips'>平台券</Text>}
        </View>
        {props.type !== 'orderDetail' ? <View>
          {coupons?.discountAmount ? <Text className='DiscountCard-item-red'>-¥{fen2yuan(coupons?.discountAmount)}</Text> :
            (props.preView?.couponId || props.preView?.couponId === '') ? <Text className='DiscountCard-item-num'>不使用优惠券</Text> : <Text className='DiscountCard-item-num'>暂无可用优惠券</Text>}
          <Text className='DiscountCard-item-num'>{'>'}</Text>
        </View> : <View>
          {(props.preView?.mCouponAmount > 0 || props.preView?.couponAmount > 0) ? <Text className='DiscountCard-item-red'>-¥{fen2yuan(props.preView?.couponAmount || props.preView?.mCouponAmount)}</Text>
            : <Text className='DiscountCard-item-price'>-¥{fen2yuan(props.preView?.couponAmount || props.preView?.mCouponAmount)}</Text>}
        </View>
        }
      </View>
      <View className='DiscountCard-item' onClick={openRedBag}>
        <View>
          <Text className='DiscountCard-item-title'>红包</Text>
          {/* <Text className='DiscountCard-item-radius' onClick={() => setAlertVisible(true)}>?</Text> */}
          <Text className="myIcon fz30 DiscountCard-item-radius" onClick={(e) => { e.stopPropagation(); setAlertVisible(true) }}>&#xe759;</Text>
          <Text className='DiscountCard-item-tips'>叠加优惠</Text>
        </View>
        {props.type !== 'orderDetail' ? <View >
          {props.preView?.maxRedPacketAmount > 0 ? redBag?.discountAmount ? <Text className='DiscountCard-item-red'>-¥{fen2yuan(redBag?.discountAmount)}</Text> : <Text className='DiscountCard-item-num'>不使用红包</Text> :
            <Text className='DiscountCard-item-num'>暂无可用红包</Text>}
          <Text className='DiscountCard-item-num'>{'>'}</Text>
        </View> : <View>
          {props.preView?.redPacketAmount > 0 ? <Text className='DiscountCard-item-red'>-¥{fen2yuan(props.preView?.redPacketAmount)}</Text> :
            <Text className='DiscountCard-item-price'>-¥{fen2yuan(props.preView?.redPacketAmount)}</Text>}
        </View>}
      </View>
      <View className='DiscountCard-item h80'>
        <View>

        </View>
        <View>
          <Text className='DiscountCard-item-num'>{props.type !== 'orderDetail' ? '合计：' : (props.isBuyer ? '实付金额：' : '交易金额：')}</Text>
          <Text className='DiscountCard-item-red'>¥ <Text className='fz32'>{fen2yuan(props.preView?.payAmount)}</Text></Text>
        </View>
      </View>
      <Popup headerType='close' visible={isShowCoupon} onClose={() => setIsShowCoupon(false)} title='优惠券'>
        <Coupons couponId={props.preView?.couponId} chooseCoupon={chooseCoupon} couponDetail={couponDetail}></Coupons>
      </Popup>
      <Popup headerType='close' visible={isShowRedBag} onClose={() => setIsShowRedBag(false)} title='红包'>
        <RadioGroup onChange={chooseRedBag} >
          <Label>
            <View className='DiscountCard-noRedBag'>
              <Radio value={'0'} checked={useRedBagNum === 0}></Radio>
              <Text className='DiscountCard-noRedBag-text'>不使用红包</Text>
            </View>
          </Label>
          <Label>
            <View className='bw-RedBag'>
              <View className='bw-RedBag-item'>
                <View className='bw-RedBag-item-left'>
                  <XImage className='bw-RedBag-item-left-img' disabledPlaceholder src={redbag}></XImage>
                  <Text className='bw-RedBag-item-left-all'>红包余额 ¥{fen2yuan(props.preView?.userRedPacketAmount)}</Text>
                  <Text className='bw-RedBag-item-left-count'>可抵扣 ¥{fen2yuan(props.preView?.maxRedPacketAmount)}</Text>
                </View>
                <View className='bw-RedBag-item-right'>
                  <Radio checked={checkedMoney === useRedBagNum} value={props.preView?.maxRedPacketAmount}></Radio>
                </View>
              </View>
            </View>
          </Label>
          <View className='bw-RedBag-noUse'>
            {redPacketList && redPacketList.length > 0 && <View className='bw-RedBag-noUse-title'>不可用红包</View>}
            <View className='bw-RedBag-noUse-content'>
              {redPacketList.map(item => <View className='bw-RedBag-noUse-content-item'>
                <View className='bw-RedBag-noUse-content-item-left'>
                  <Text className='bw-RedBag-noUse-content-item-left-1'>¥</Text>
                  <Text className='bw-RedBag-noUse-content-item-left-2'>{fen2yuan(item?.awardAmount)}</Text>
                </View>
                <View className='bw-RedBag-noUse-content-item-right'>
                  <View className='bw-RedBag-noUse-content-item-right-1'>限{dealName(item?.shopName, 8)}使用</View>
                  <View className='bw-RedBag-noUse-content-item-right-2'>{dayjs(item?.expireTime).format('YYYY-MM-DD')}过期</View>
                </View>
              </View>)}
            </View>
          </View>
        </RadioGroup>
      </Popup>
      <BwModal title='红包规则' visible={alertVisible} content={<RedBagRules />} type='alert' onClose={() => { setAlertVisible(false) }} onCancel={() => { setAlertVisible(false) }}></BwModal>
    </View >
  )
}

export default DiscountCard