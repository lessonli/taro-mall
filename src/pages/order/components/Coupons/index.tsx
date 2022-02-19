import { IResapi4832 } from '@/apis/21/api4832'
import { COUPON_TYPE } from '@/constants'
import { yiguoqi, yishiyong } from '@/constants/images'
import Item from '@/pages/active/template/components/StoreItem'
import list from '@/pages/goods/goodSample/list'
import { couponTIme, dealName, fen2yuan } from '@/utils/base'
// import { Radio, RadioGroup } from '@/components/RadioGroup'
import { View, Text, RadioGroup, Radio, Label, Image } from '@tarojs/components'
import dayjs from 'dayjs'
import { ReactNode, useEffect, useRef } from 'react'
import { useState } from 'react'

import './index.scss'


export type ICouponDetail = Required<IResapi4832['data']>
export type ICouponDetailList = Required<Required<IResapi4832>['data']>['data']
export type ICouponDetailItem = Required<Required<IResapi4832>['data']>['data'][0]

interface Iprops {

  onChangeRadio: (value: number) => void

  list?: ICouponDetailList;

  disabled?: boolean

  couponId?: any

}
const CouponsList = (props: Iprops) => {

  // const [checkRadio, setCheckRadio] = useState<any>()
  const checkRadio = useRef(props.couponId)

  const onRadioCheck = (value) => {
    const id = value.detail.value
    checkRadio.current = id
    if (checkRadio === props.couponId) return
    props.onChangeRadio(value)
  }

  // useEffect(() => {

  //   setCheckRadio(props.couponId)

  // }, [props.couponId])

  return <View className='bw-coupons-list'>
    <RadioGroup onChange={onRadioCheck}>
      {
        props?.list && props?.list.map(item => {
          return <Label key={item.uuid} for={`coupon${item?.uuid}`}><CouponItem disabled={props.disabled} currentCoupon={item} Radio={!props.disabled && <Radio checked={props.couponId === item.uuid} id={`coupon${item?.uuid}`} className='bgWhite' value={item.uuid} ></Radio>}></CouponItem></Label>
        })
      }
    </RadioGroup>

  </View>
}

interface ItemProps {

  Radio?: ReactNode;

  currentCoupon?: ICouponDetailItem;

  disabled?: boolean

}

export const CouponItem = (props: ItemProps) => {

  return <View className='bw-coupons-list-item' style={{ opacity: props.disabled ? '0.5' : '1' }}>
    <View className='bw-coupons-list-item-content'>
      <View className='bw-coupons-list-item-left'>
        {props.currentCoupon?.grantFrom && <View className='bw-coupons-list-item-left-tips'>
          {props.currentCoupon?.grantFrom === 1 ? '平台优惠券' : '店铺优惠券'}
        </View>}
        {props.currentCoupon?.grantType === 1 ? <View>
          <Text className='bw-coupons-list-item-left-1'>¥ </Text>
          <Text className='bw-coupons-list-item-left-2'>{fen2yuan(props.currentCoupon?.price)}</Text>
        </View> :
          <View>
            <Text className='bw-coupons-list-item-left-2'>{props.currentCoupon?.price / 10}</Text>
            <Text className='bw-coupons-list-item-left-1'>折</Text>
          </View>}
        <View className='bw-coupons-list-item-left-mj'>{props.currentCoupon?.minPoint > 0 ? `满${fen2yuan(props.currentCoupon?.minPoint)}元可用` : '无门槛'}</View>

      </View>
      <View className='bw-coupons-list-item-right'>
        <View>
          <View className='bw-coupons-list-item-right-1'>{props.currentCoupon?.couponName || props.currentCoupon?.name}</View>
          {/* {props.currentCoupon?.targets && props.currentCoupon?.targets.length > 0 && <View className='bw-coupons-list-item-right-2'>限{dealName(props.currentCoupon?.targets?.map((item) => item.targetName).join('和'), 12)}可用</View>} */}
          <View className='bw-coupons-list-item-right-2'>{dealName(props.currentCoupon?.instruction, 10)}</View>
          <View className='bw-coupons-list-item-right-3'>{dayjs(props.currentCoupon?.expireTime).format('YYYY-MM-DD hh:mm')}过期</View>
        </View>
      </View>
    </View>
    {props.currentCoupon?.useStatus === 1 && <Image className='bw-coupons-list-item-status' src={yishiyong}></Image>}
    {props.currentCoupon?.useStatus === 2 && <Image className='bw-coupons-list-item-status' src={yiguoqi}></Image>}
    <View>
      {
        props.Radio
      }
      {/* <Radio value={item.id} ></Radio> */}
    </View>
  </View>
}

interface ICoupon {

  couponDetail?: Array<ICouponDetail>;

  chooseCoupon?: (value?: any) => void

  couponId?: any
}

const Coupons = (props: ICoupon) => {

  const [checkedId, setCheckedId] = useState<any>('')

  const onChangeRadio = (value) => {
    console.log(111223);

    let couponId = ''
    if (value) {
      couponId = process.env.TARO_ENV === 'h5' ? value.detail.value : value.mpEvent.detail.value
    }

    setCheckedId(couponId)

    props.chooseCoupon(couponId)


  }

  useEffect(() => {

    !checkedId && setCheckedId(props.couponId)

  }, [props.couponId])


  return (
    <View className='bw-coupons'>
      <Label id='empty1' onClick={(e) => { e.stopPropagation(); onChangeRadio('') }}>
        <View className='DiscountCard-noCoupon'>
          <Radio checked={checkedId === ''} id='empty1'></Radio>
          <Text className='DiscountCard-noCoupon-text'>不使用优惠券</Text>
        </View>
      </Label>
      <View className='bw-coupons-content'>
        {props?.couponDetail[0] && props?.couponDetail[0].total > 0 && <View className='bw-coupons-content-title'>
          可用优惠券（{props.couponDetail[0]?.total}）
        </View>}
        <CouponsList couponId={checkedId} list={props.couponDetail[0]?.data} onChangeRadio={onChangeRadio} />
        {props?.couponDetail[1] && props?.couponDetail[1].total > 0 && <View className='bw-coupons-content-title mt24'>
          不可用优惠券（{props.couponDetail[1]?.total}）
        </View>}
        <CouponsList disabled={true} list={props.couponDetail[1]?.data} onChangeRadio={onChangeRadio} />
      </View>
    </View>
  )
}

export default Coupons
