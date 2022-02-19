import Taro from '@tarojs/taro'

import { View, Image, Text, RadioGroup, Label, Radio, Input } from '@tarojs/components'

import './index.scss'
import NavigationBar, { SingleBackBtn } from '@/components/NavigationBar'
import { isAppWebview, SENDSTAMPS_USETIME_LIST } from '@/constants'
import ListItem from '@/components/ListItem'
import { useEffect, useMemo, useState } from 'react'
import { deepClone } from '@/utils/base'
import BWPicker from '@/components/SelectPicker/index.v2'
import { getRecentlyDays } from '@/pages/merchant/publish/components/step2'
import { number } from 'prop-types'
import Popup from '@/components/Popup'
import api4764 from '@/apis/21/api4764'
import { RadioItem } from '@/components/RadioScrollList'
import computeDate from '@/utils/computeDate'
import { onValidateData } from '@/utils/validate'
import api4912 from '@/apis/21/api4912'
import { useRequest } from 'ahooks'
import { AtButton, AtInput } from 'taro-ui'
import dayjs from 'dayjs'
import { AtInputMoney } from '@/components/AtInputPlus'
import { sleep } from '@/utils/cachedService'

const SendStamps = () => {

  const [formValues, setFormValues] = useState<Record<string, any>>({
    grantType: '1',
    price: '',
    maxPrice: '',
    perLimitL: '',
    minPoint: '',
    startTime: '',
    endTime: '',
    duration: '',
    publishStatus: '',
    publishCount: ''
  })

  const [endTimes] = useState(getRecentlyDays());

  const [Visibles, setVisibles] = useState<boolean>(true)

  const [visibleForm, setVisibleForm] = useState<Record<string, any>>({
    startTime: false,
    endTime: false,
    duration: false
  })

  const [endTimeVisible, setEndTimeVisible] = useState<boolean>(false)

  const [durationList, setDurationList] = useState([])

  const [currentValue, setCurrentValue] = useState<Record<string, any>>({})

  const [startTimeData, setStartTimeData] = useState([])
  const [endTimeData, setEndTimeData] = useState([])

  const FormRules = {
    grantType: [{ required: true, message: '请选择发放类型' }],
    price: [{ required: true, message: '请输入优惠券面额' }, {
      validator: (rule: any, value: string) => {

        if (formValues?.grantType === '2') {

          if (parseInt(value) / 100 >= 10) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }

      },
      message: "折扣不能超过10",
    },],
    perLimit: [{ required: true, message: '请输入每人限领张数' }],
    startTime: [{ required: true, message: '请选择开始领取时间' }],
    endTime: [{ required: true, message: '请选择结束领取时间' }],
    duration: [{ required: true, message: '请选择领取后失效时长' }],
    publishCount: [{ required: true, message: '请输入发行数量' }],
  }


  const dealTime = (date, text?) => {
    if (date) {
      return `${date[0]}-${date[1]}-${date[2]} ${date[3]}:${date[4]}`
    } else {
      if (text) {
        return text
      } else {
        return ''
      }
    }
  }

  const submitForm = async () => {

    const result = await onValidateData(FormRules, formValues)

    if (result) {

      let obj = Object.assign({}, { ...formValues }, { startTime: dayjs(dealTime(formValues.startTime)).unix() * 1000, endTime: dayjs(dealTime(formValues.endTime)).unix() * 1000 })

      if (obj.grantType === '2') {
        obj.price = obj.price / 10
      }
      const formResult = await api4912(obj)

      Taro.navigateBack().then(() => {
        Taro.showToast({
          title: '优惠券创建成功',
          icon: 'none'
        })
      })

    }

  }

  const { run: handleSubmit, loading: submitIng } = useRequest(submitForm, {
    debounceInterval: 400,
    manual: true,
  })

  useEffect(() => {

    sleep(500).then(() => {
      const timeData = computeDate()
      setStartTimeData(timeData)
      setEndTimeData(timeData)
    })

  }, [])

  useEffect(() => {
    if (formValues?.startTime) {
      setEndTimeData(computeDate(dayjs(dealTime(formValues?.startTime))))
    }
  }, [formValues?.startTime])

  // const endTImeData = useMemo(() => {
  //   if (formValues?.startTime) {
  //     return computeDate(dayjs(dealTime(formValues?.startTime)))
  //   } else {
  //     return computeDate()
  //   }
  // }, [formValues?.startTime])


  /**
   * 后退
   */

  const handleBack = () => {
    if (isAppWebview) {
      WebViewJavascriptBridge.callHandler('closeWebview', JSON.stringify({ close: 'stamps' }))
    } else {
      Taro.navigateBack()
    }
  }

  /**
   * radio选择
   */
  const changeRadio = (key, value) => {
    let copyData = deepClone(formValues)
    copyData[key] = value?.detail?.value
    setFormValues(copyData)
  }

  const list = [
    {
      key: 'grantType',
      label: '满减券',
      value: '1'
    },
    {
      key: 'grantType',
      label: '折扣券',
      value: '2'
    }
  ]

  const handleFormChange = (name, value) => {

    const sentValue = value?.detail?.value || value

    Object.assign(formValues, { [name]: sentValue })
    // TODO: checkbox usecontent 有bug
    setFormValues({ ...formValues })
    // setFormValues(
    //   ['serviceIds', 'freightPrice', 'distPercentOpend', 'margin'].includes(name) ?
    //     {...formValues} :
    //     formValues
    // )
  }


  const durationTimeList = async () => {
    if (durationList.length < 1) {
      const reasonList = await api4764()
      setDurationList(reasonList?.productReasons)
      setVisibleForm({ ...visibleForm, duration: true })
    } else {
      setVisibleForm({ ...visibleForm, duration: true })
    }
  }

  const CheckGroup = (props: {
    list: Array<{
      key: string
      label: string
      value: string
    }>
  }) => {
    return <View className='sendStamps-checkGroup'>
      {props.list.map(item => {
        return <RadioGroup onChange={(value) => { changeRadio(item?.key, value) }}>
          <View className='sendStamps-checkGroup-label'>
            <Label>
              <Radio id={item?.key + item?.value} checked={formValues.grantType === item.value} value={item?.value}></Radio>
              <Text className='sendStamps-checkGroup-text'>{item?.label}</Text>

            </Label>
          </View>
        </RadioGroup>
      })}
    </View>
  }

  return (
    <View className='sendStamps'>
      <NavigationBar
        title={formValues?.grantType === '1' ? '店铺满减券' : '店铺折扣券'}
        background={'#ffffff'}
        leftBtn={<SingleBackBtn onClick={handleBack}></SingleBackBtn>}
      />
      <View className='sendStamps-content'>
        <ListItem className='sendStamps-content-item' left='券的类型' right={<CheckGroup list={list} />} icon={null}></ListItem>
        <ListItem className='sendStamps-content-item' left='优惠信息'
          right={
            <View className='sendStamps-content-item-inputBox'>
              <Text className='bd'>满</Text>
              <AtInputMoney name='minPoint' className='sendStamps-content-item-input' value={formValues?.minPoint} placeholder='输入金额' onChange={(v) => { handleFormChange('minPoint', v) }} type='number' />
              <Text className='ml18 bd'>{formValues?.grantType === '1' ? '减' : '打'}</Text>
              <AtInputMoney name='price' className='sendStamps-content-item-input' value={formValues?.price} placeholder={formValues?.grantType === '1' ? '输入金额' : '输入折扣'} onChange={(v) => { handleFormChange('price', v) }} type='number' />
            </View>
          } icon={<Text className='sendStamps-content-item-icon'>{formValues?.grantType === '1' ? '元' : '折'}</Text>}></ListItem>
        {formValues?.grantType === '2' && <ListItem className='sendStamps-content-item' left='最高可减' right={<AtInputMoney name='maxPrice' value={formValues?.maxPrice} className='sendStamps-content-item-input' placeholder='可不填写最高抵扣金额' onChange={(v) => { handleFormChange('maxPrice', v) }} type='number' />} icon={<Text className='sendStamps-content-item-icon'>元</Text>}></ListItem>}
        <ListItem className='sendStamps-content-item' left='发放数量' right={<Input className='sendStamps-content-item-input' placeholder='输入发放数量' type='number' onInput={(v) => { handleFormChange('publishCount', v) }} />} icon={<Text className='sendStamps-content-item-icon'>张</Text>}></ListItem>
        <ListItem className='sendStamps-content-item' left='每人限领' right={<Input className='sendStamps-content-item-input' placeholder='输入限领数量' type='number' onInput={(v) => { handleFormChange('perLimit', v) }} />} icon={<Text className='sendStamps-content-item-icon'>张</Text>}></ListItem>
        <ListItem className='sendStamps-content-item'
          handleClick={() => { setVisibleForm({ startTime: true }) }}
          left='开始领取时间'
          right={<Text className={formValues?.startTime ? 'sendStamps-content-item-time' : 'sendStamps-content-item-time placeholder'} >{dealTime(formValues?.startTime, '请选择开始领取时间')}</Text>}></ListItem>
        <ListItem className='sendStamps-content-item'
          handleClick={() => { setVisibleForm({ endTime: true }) }}
          left='结束领取时间'
          right={<Text className={formValues?.endTime ? 'sendStamps-content-item-time' : 'sendStamps-content-item-time placeholder'}>{dealTime(formValues?.endTime, '请选择结束领取时间')}</Text>}></ListItem>
        <ListItem className='sendStamps-content-item'
          handleClick={durationTimeList}
          left='使用有效期'
          right={<Text
            className={formValues?.duration ? 'sendStamps-content-item-time' : 'sendStamps-content-item-time placeholder'}>{SENDSTAMPS_USETIME_LIST[formValues?.duration]?.label || '请选择使用有效期'}</Text>}></ListItem>
        <Text className='sendStamps-content-tips'>优惠券仅限一口价商品使用</Text>
      </View>
      {/* <View className='sendStamps-submit' onClick={handleSubmit}>
        确认发券
      </View> */}
      <AtButton type="primary" className='sendStamps-submit' loading={submitIng} onClick={handleSubmit}>确认发券</AtButton>
      <BWPicker
        cols={5}
        title="开始领取时间"
        data={startTimeData}
        visible={visibleForm?.startTime}
        onVisibleChange={(v) => setVisibleForm({ startTime: false })}
        value={formValues?.startTime}
        onChange={(v) => handleFormChange('startTime', v)}
      />
      <BWPicker
        cols={5}
        title="结束领取时间"
        data={endTimeData}
        visible={visibleForm?.endTime}
        onVisibleChange={(v) => setVisibleForm({ endTime: false })}
        value={formValues?.endTime}
        onChange={(v) => handleFormChange('endTime', v)}
      />
      <Popup
        title="使用有效期"
        visible={visibleForm?.duration}
        onVisibleChange={reason => setVisibleForm({ duration: false })}
        headerType="close"
      >
        <View>
          {
            Object.keys(SENDSTAMPS_USETIME_LIST).map((item) => <RadioItem label={SENDSTAMPS_USETIME_LIST[item].label} value={item} checked={item === formValues?.duration} onChecked={(v) => handleFormChange('duration', v)} />)
          }
        </View>
      </Popup>
    </View >
  )
}

export default SendStamps


