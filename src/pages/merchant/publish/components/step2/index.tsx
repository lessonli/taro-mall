import { View, Button, Picker, Text, Switch, Checkbox, CheckboxGroup, Image } from '@tarojs/components';
import Taro from '@tarojs/taro'
import { useState, useEffect, useMemo } from 'react';
import { AtButton, AtInput, AtSwitch, AtModal, AtModalAction, AtModalHeader, AtModalContent } from "taro-ui";

import ClassifyPicker from "@/components/ClassifyPicker";
import PickAssuranceFee from "@/components/PickAssuranceFee";
import PayAssuranceFeeModal from "@/components/PayAssuranceFeeModal";
import { getChinaAddsTree, getServices, IChinaTree } from "@/utils/cachedService";
import BWPicker from '@/components/SelectPicker';
import ListItem from '@/components/ListItem';
import { AtInputMoney } from "@/components/AtInputPlus";

import './index.scss'
import { EXPRESS_DELIVERY, MALL_SERVICES, MERCHANT_YKJ_STATUS, PRIMARY_COLOR, PRODUCT_TYPE, REGS } from '@/constants';
import api2092 from '@/apis/21/api2092';
import { useCallback } from 'react';
import Schema, { Rules, ValidateSource } from 'async-validator';

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import Popup from '@/components/Popup';
import BWCheckbox from '@/components/Checkbox';
import RadioGroup, { Radio } from '@/components/RadioGroup';
import PayFeePopup from '@/components/PayFeePopup';
import storge, { session } from '@/utils/storge';
import api1844 from '@/apis/21/api1844';
import api1852 from '@/apis/21/api1852';
import BwModal from '@/components/Modal';
import api2936 from '@/apis/21/api2936';
import api2918 from '@/apis/21/api2918';
import paySdk from '@/components/PayFeePopup/paySdk';
import compose, { formatMoeny, fen2yuan } from '@/utils/base';
import api2060 from '@/apis/21/api2060';
import api2978 from '@/apis/21/api2978';
import api2984 from '@/apis/21/api2984';
import agreements from '@/constants/agreements';
import { useDebounceFn, useRequest } from 'ahooks';

dayjs.extend(isoWeek)

export const FieldText = (props: {
  placeholder: string;
  value: string;
}) => {
  if (['', undefined, null].includes(props.value)) {
    return <Text className="color-placeholder">{props.placeholder}</Text>
  }
  return <Text className="tabColor">{props.value}</Text>
}

// ????????????30???
export const getRecentlyDays = (days: number = 6) => {
  // ??????????????????????????????????????????????????????120??????????????????????????????10????????????????????????????????????????????????????????????10??????????????????????????????????????????5????????????????????????????????????????????????
  const range = 120 * 60 * 60 * 1000
  const hours: string[] = []
  for (let i = 0; i < 48; i++) {
    const h = Math.floor(i / 2)
    const m = i % 2
    let r = `${h > 9 ? h : '0'+h}:${m === 0 ? '00' : '30'}`
    hours.push(r)
  }
  // const hours = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21']
  const weeks = ['??????', '??????', '??????', '??????', '??????', '??????', '??????']
  const current = dayjs()
  const startT = current.valueOf()
  const endT = startT + range
  return Array(days).fill(1).reduce((res, _, i) => {
    const date = current.add(i, 'days')
    const month = date.get('month') + 1
    const day = date.get('date')
    const isoweekday = weeks[dayjs(date).isoWeekday() - 1]

    const e = date.format('YYYY-MM-DD')
    
    const children = hours.reduce((res, item) => {
      const t = dayjs(`${e} ${item}:00`).valueOf()
      if (i === 0) {
        // ???????????? & ??????30min
        // const isAfter = Number(current.format('HH:mm').replace(':', '')) <= Number(item.replace(':', ''))
        const isAfter30Min = t - startT >= 30 * 60 * 1000
        isAfter30Min && res.push({
          label: item,
          value: item,
        })
      } else if (i === days - 1){
        if (t <= endT) {
          res.push({ label: item, value: item })
        }
      } else {
        res.push({ label: item, value: item })
      }
      return res
    }, [])

    let textDate = `${month}???${day}??????${isoweekday}???`
    if (i === 0) {
      textDate = `?????????${isoweekday}???`
    }
    if (i === 1) {
      textDate = `?????????${isoweekday}???`
    }

    res[i] = {
      label: textDate,
      value: e,
      children,
    }
    return res
  }, [])
}


export default (props: {
  productType: any;
  productId?: string;
  prevInfo: any;
  isCreate: boolean;
}) => {
  const [distPercents, setdistPercents] = useState<IChinaTree>([]);
  const [endTimes] = useState(getRecentlyDays());

  const [mallServices, setMallServices] = useState(MALL_SERVICES);

  const [submitIng, setsubmitIng] = useState(false);

  const [visibles, setVisibles] = useState<Record<string, boolean>>({
    'distPercent': false,
    'margin': false,
    'startTime': false,
    endTime: false,
    serviceIds: false,
    isSaveDraft: false,
    PayFeePopup: false,
    BwModal: false,
    BwModalDelay: false,
  });

  const [formValues, setFormValues] = useState<Record<string, any>>({
    'initPrice': 0,
    markUp: '',
    'distPercent': [''],
    distPercentOpend: true,
    'margin': '',
    startTime: '',
    endTime: process.env.TARO_ENV === 'h5' ? ['', ''] : undefined,
    serviceIds: [1],
    delayState: 0,
    freightPrice: 0,
    // ?????????
    price: '',
    originalPrice: '',
    stock: '1',
    limitNum: -1,
  });

  const handleFormChange = (name, value) => {

    Object.assign(formValues, {[name]: value})
    // TODO: checkbox usecontent ???bug
    setFormValues({...formValues})
    // setFormValues(
    //   ['serviceIds', 'freightPrice', 'distPercentOpend', 'margin'].includes(name) ?
    //     {...formValues} :
    //     formValues
    // )
  }
  // ??????????????????
  const isDraft = useMemo(() => Boolean(props.prevInfo._draft), [props.prevInfo])
  // ?????????????????????
  const isEditOneMore = useMemo(() => Boolean(props.productId), [props.productId])
  // ????????????
  const isNew = useMemo(() => !isDraft && !isEditOneMore, [isDraft, isEditOneMore])

  useEffect(() => {
    console.log(props.prevInfo)
    if (isNew) {
      setFormValues({
        ...formValues,
        ...(props.prevInfo || {}),
        distPercent: [props.prevInfo.categoryIdDistPercent || ''],
        distPercentOpend: true,
      })
    } else if (isEditOneMore) {
      // ????????????????????? ???????????????
      const {
        auction,
        originalPrice, price, freightPrice, stock, serviceIds,
        distPercent, // ???????????????????????????
        categoryIdDistPercent, // ????????????????????????????????????
      } = props.prevInfo
      const distPercentOpend = Boolean(distPercent)

      if (props.productType === PRODUCT_TYPE.PM.value) {
        console.log('auction =>', auction)
        const { startTime, delayState, initPrice, markUp, margin, endTime } = auction
        setFormValues({
          ...props.prevInfo,
          ...formValues,
          endTime: endTime ? dayjs(endTime).format('YYYY-MM-DD HH:mm').split(' ') : '',
          margin,
          markUp,
          initPrice,
          delayState,
          serviceIds : serviceIds ? serviceIds.split(',').map(e => Number(e)) : [],
          distPercent: [distPercent],
          distPercentOpend,
          freightPrice,        
        })
  
      } else if (props.productType === PRODUCT_TYPE.YKJ.value) {
        setFormValues({
          ...props.prevInfo,
          ...formValues,
          originalPrice,
          price,
          stock,
          serviceIds: serviceIds ? serviceIds.split(',').map(e => Number(e)) : [],
          freightPrice,
          distPercent: [distPercent],
          distPercentOpend,
        })
      }

    }
  }, [props.prevInfo, props.productId])

  useEffect(() => {
    getServices().then(res => {
      // ?????????????????????
      const map = new Map()
      res.reduce((result, item) => {
        result.set(item.id, {
          label: item.name,
          value: item.id,
          desc: item.desc,
          disabled: false,
        })
        return result
      }, map)
      if (API_ENV !== 'mock') {
        setMallServices(map)
      }
    })
    const {categoryIdDistPercent} = props.prevInfo
    api2092().then(res => {
      const v = (res || []).map(v => ({ label: `?????????${v}%${Number(categoryIdDistPercent) === Number(v) ? '(??????)' : ''}`, value: v }))
      console.log(v)
      setdistPercents(v)
    })
    return () => {
    }
  }, [])

  const handleSaveDraft = () => {
    Taro.showModal({
      confirmText: '??????',
      cancelText: '??????',
      confirmColor: PRIMARY_COLOR,
      content: '?????????????????????????????????',
      success: () => {
        // TODO:
        storge.setItem('publishProductDrafts', [
          ...storge.getItem('publishProductDrafts'),

        ])
      }
    })

    // Taro.showModal({
    //   title: '????????????',
    //   content: '??????????????????????????????????????????????????????????????????????????????????????????',
    //   confirmText: '????????????',
    //   cancelText: '??????',
    //   confirmColor: PRIMARY_COLOR,
    //   success: () => {
    //     console.log('????????????')
    //   }
    // })
  }

  const handleSubmit1 = async () => {
    console.log(formValues)
    let rRules: Rules = {}
    const {
      price, originalPrice, stock, 
      delayState, initPrice, markUp, margin, endTime,
      freightPrice, serviceIds, distPercentOpend, distPercent,
      ...prevFormValues
    } = formValues

    let formData = {
      productType: props.productType,
      serviceIds,
      freightPrice,
      distPercent: Boolean(distPercentOpend) ? distPercent : '',
    }

    if (props.productType === PRODUCT_TYPE.YKJ.value) {
      rRules = {
        price: {
          pattern: REGS.price.pattern,
          required: true,
          validator: (_, value, cb) => {
            if (Number(formValues.price) >= Number(formValues.originalPrice)) {
              return new Error('??????????????????????????????')
            }
            cb()
          }
        },
        originalPrice: {
          pattern: REGS.price.pattern,
          // message: '??????????????????',
          required: true,
          validator: (_, value, cb) => {
            if (Number(formValues.price) > Number(formValues.originalPrice)) {
              return new Error('??????????????????????????????')
            }
            cb()
          }
        },
        stock: {
          pattern: REGS.price.pattern,
          required: true,
          validator: (_, value, cb) => {
            if (REGS.integer.pattern.test(value) && Number(value) > 0) {
              cb()
            }
            return new Error('????????????????????????')
          }
        },
        freightPrice: {
          required: true,
          message: '???????????????'
        },
        // serviceIds: {
        //   type: 'array',
        //   min: 1,
        //   message: '?????????????????????',
        // },
        distPercent: {
          validator: (_, value, cb) => {
            const a = Boolean(formValues.distPercentOpend)
            if (a && value?.[0]) {
              cb()
            } else if (!a) {
              cb()
            }
            return new Error('?????????????????????')
          }
        },
      }

      Object.assign(formData, {
        price,
        originalPrice,
        stock,
      })
    } else if (props.productType === PRODUCT_TYPE.PM.value) {
      rRules = {
        _initPrice: {
          pattern: REGS.integer.pattern,
          message: '??????????????????????????????',
        },
        _markUp: {
          pattern: REGS.integer.pattern,
          required: true,
          message: '?????????????????????????????????',
        },
        // margin: {
        //   required: true,
        //   message: '??????????????????',
        // },
        endTime: {
          required: true,
          message: '?????????????????????'
        },
        freightPrice: {
          required: true,
          message: '???????????????'
        },
        // serviceIds: {
        //   type: 'array',
        //   min: 1,
        //   message: '?????????????????????',
        // },
        distPercent: {
          validator: (_, value, cb) => {
            const a = Boolean(formValues.distPercentOpend)
            if (a && value?.[0]) {
              cb()
            } else if (!a) {
              cb()
            }
            return new Error('?????????????????????')
          }
        },
      }
      Object.assign(formData, {
        initPrice: initPrice || 0,
        _initPrice: fen2yuan(initPrice || 0),
        markUp,
        _markUp: ['', undefined, null, 'undefined', 'null'].includes(markUp) ? '' : fen2yuan(markUp),
        margin: margin || 0,
        endTime,
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        delayState,
      })
    }

    const validator = new Schema(rRules)
    validator.validate(formData, {suppressWarning: true}, async (errs, fields) => {
      if (errs && errs.length > 0) {
        return Taro.showToast(({
          title: errs[0].message,
          icon: 'none',
        }))
      }

      let auction = {}
      if (props.productType === PRODUCT_TYPE.PM.value) {
        auction = {
          initPrice: formData.initPrice,
          markUp: formData.markUp,
          margin: formData.margin,
          startTime: dayjs().format('YYYY-MM-DD HH:mm'),
          endTime: formData.endTime.join(' '),
          delayState: formData.delayState ? 1 : 0,
        }
        // price ????????? ????????????
        formData.price = formData.initPrice
        formData.stock = 1
      }
      Object.assign(formData, { 
        serviceIds: serviceIds.join(','),
        // ????????????????????????????????????????????????????????????0
        distPercent: Boolean(distPercentOpend) ? distPercent[0] : 0,
        ...prevFormValues
      }, {auction})
      console.log(formData)
      // ?????????????????? => ????????? => ????????????????????????????????? => ????????????
      const fn = !props.isCreate ? api1852 : api1844
      if (!props.isCreate) {
        // ?????????
        await api2060({ status: MERCHANT_YKJ_STATUS.off.value, uuid: props.productId })
      }
      // Taro.showLoading({
      //   title: '???????????????'
      // })
      setsubmitIng(true)
      try {
        const res = await fn(formData)
        // TODO: ???????????????????????????
        const productId = props.isCreate ? res : props.productId
        handleFormChange('productId', productId)
        const res2 = await api2936({uuid: productId})
        if (res2?.needMargin) {
          setsubmitIng(false)
          setVisibles({
            PayFeePopup: true,
          })
        } else {
          // ????????????
          await api2060({ status: MERCHANT_YKJ_STATUS.onSale.value, uuid: productId })
          const s = session.getItem('pages/merchant/auction/list/index')
          session.setItem('pages/merchant/auction/list/index', {
            ...s,
            publishSuccess: true,
          })
          Taro.showToast({
            icon: 'none',
            title: '??????????????????'
          })
          
          Taro.redirectTo({
            url: `/pages/goods/goodsDetail/index?productId=${productId}&productType=${props.productType}&sourceUrl=${encodeURIComponent(Taro.getCurrentInstance().router?.path || '')}`,
          })
        }

      } catch(e) {
        setsubmitIng(false)
      }    

    })
  }

  const {run: handleSubmit, loading: submitIng2} = useRequest(handleSubmit1, {
    debounceInterval: 400,
    manual: true,
  })

  // ???????????????
  const payForMargin = async (payType) => {
    const service = () => api2984({
      productId: formValues.productId,
      payType,
    })

    return paySdk(service, payType).then(res => {
      const s = session.getItem('pages/merchant/auction/list/index')
      session.setItem('pages/merchant/auction/list/index', {
        ...s,
        publishSuccess: true,
      })
      Taro.showToast({
        icon: 'none',
        title: '??????????????????'
      })
      Taro.redirectTo({
        url: `/pages/goods/goodsDetail/index?productId=${formValues.productId}&productType=${props.productType}&sourceUrl=publish`,
      })
    }).catch((error) => {
        setVisibles({
          ...visibles,
          PayFeePopup: false,
        })
         Taro.showModal({
          title: '????????????',
          content: '??????????????????????????????????????????????????????????????????????????????????????????',
          confirmText: '????????????',
          cancelText: '??????',
          confirmColor: PRIMARY_COLOR,
          success: (result) => {
            if (!result.confirm) return
            setVisibles({
              ...visibles,
              PayFeePopup: true,
            })
          }
        })
    })

  }


  return <View className="publistGoodStep2">
    <View className="publistGoodStep2-price publistGoodStep2--card">
      {
        props.productType === PRODUCT_TYPE.YKJ.value && <>
          <ListItem
            type={1}
            icon={null}
            left={<View>????????????</View>}
            right={<View className="flex items-center"><AtInputMoney name="price" placeholder="??????????????????" value={formValues.price} onChange={(v) => {
              handleFormChange('price', v)
            }} /><Text>???</Text></View>}
          />
          <ListItem
            type={1}
            icon={null}
            left={'??????'}
            right={<View className="flex items-center"><AtInputMoney name="originalPrice" placeholder="????????????" value={formValues.originalPrice} onChange={(v) => handleFormChange('originalPrice', v)} /><Text>???</Text></View>}
          />
          <ListItem
            type={1}
            icon={null}
            left={'????????????'}
            right={<View><AtInput name="stock" placeholder="??????????????????" value={formValues.stock} onChange={(v) => handleFormChange('stock', v)} /></View>}
          />
        </>
      }
      {
        props.productType === PRODUCT_TYPE.PM.value && (<>
          <ListItem
            type={1}
            left={<View>?????????</View>}
            right={<View className="flex items-center"><AtInputMoney name="initPrice" placeholder="????????????????????????0???" type="number" value={formValues['initPrice']} onChange={v => handleFormChange('initPrice', v)} /><Text>???</Text></View>}
            icon={null}
          ></ListItem>

          <ListItem
            type={1}
            icon={null}
            left={`????????????`}
            right={<View className="flex items-center"><AtInputMoney name="markUp" className="add-p-inpuut" placeholder="??????????????????" value={formValues.markUp} onChange={(v) => handleFormChange('markUp', v)} /><Text>???</Text></View>}
          />

          <ListItem
            type={1}
            left={'?????????'}
            right={<Text className="tabColor">{compose(formatMoeny, fen2yuan)(formValues['margin'])}???</Text>}
            handleClick={() => setVisibles({ 'margin': true })}
          />
        </>)
      }
    </View>
    {
      props.productType === PRODUCT_TYPE.PM.value &&
      <View className="publistGoodStep2--card">
        <ListItem
          type={1}
          icon={null}
          left={'????????????'}
          right={<Text className="tabColor">????????????</Text>}
        />

        <ListItem
          type={1}
          left={'????????????'}
          right={
            <FieldText placeholder="?????????" value={formValues.endTime && `${formValues.endTime.join(' ')}`} />
          }
          handleClick={() => setVisibles({ endTime: true })}
        />

      </View>
    }

    {
      props.productType === PRODUCT_TYPE.PM.value &&
      <View className="publistGoodStep2--card">
        <ListItem
          icon={null}
          type={1}
          left={<View>?????????????????? <Text className='at-icon at-icon-help' onClick={() => setVisibles({BwModalDelay: true})}></Text></View>}
          right={<View><Switch color={PRIMARY_COLOR} checked={Boolean(formValues.delayState)} onChange={v => handleFormChange('delayState', v.detail.value ? 1 : 0)} /></View>}
        />
      </View>
    }

    <View className="publistGoodStep2--card express-fees">
      <View className="express-fees--title color333">????????????</View>
      <View>
        <RadioGroup value={formValues.freightPrice} onChange={v => handleFormChange('freightPrice', v)} >
          <View className="flex items-center" style={{ verticalAlign: 'top' }}>
          {
            Array.from(EXPRESS_DELIVERY).map(([, item]) => <Radio key={item.value} name={item.value} ><Text className="m-r-20">{item.label}</Text></Radio>)
          }
          </View>
        </RadioGroup>
      </View>
    </View>

    <View className="publistGoodStep2--card">
      <ListItem
        type={1}
        left={'????????????'}
        right={
          <FieldText placeholder="" value={formValues?.serviceIds?.map(v => mallServices.get(v)?.label).join('???')} />
        }
        handleClick={() => setVisibles({ serviceIds: true })}
      />
    </View>

    <View className="publistGoodStep2--card">
      <ListItem
        icon={null}
        type={1}
        left={<View>??????????????????<Text className='at-icon at-icon-help' onClick={() => setVisibles({BwModal: true})}></Text></View>}
        right={<View><Switch color={PRIMARY_COLOR} checked={formValues.distPercentOpend} onChange={v => handleFormChange('distPercentOpend', Boolean(v.detail.value))} /></View>}
      />

      {
        Boolean(formValues.distPercentOpend) &&
        <ListItem
          type={1}
          left={'????????????'}
          right={
            <FieldText placeholder="" value={`????????????${formValues['distPercent']?.[0] || ''}%`} />
          }
          handleClick={() => setVisibles({ 'distPercent': true })}
        />
      }
    </View>

    {/* {
      props.productType === PRODUCT_TYPE.YKJ.value &&
      <View className="publistGoodStep2--card">
        <ListItem
          type={1}
          icon={null}
          left={<View>??????????????????</View>}
          right={<View>
            <Switch color={PRIMARY_COLOR} checked={true} onChange={(e) => handleFormChange('limitNum', e.detail.value ? 1 : -1)} />
          </View>}
        />
        {
          formValues.limitNum > 0 &&
          <ListItem
            type={1}
            left={<View>????????????</View>}
            right={<View>
              <AtInput name="limitNum" placeholder="??????????????????" value={formValues.limitNum} onChange={(v) => handleFormChange('limitNum', v)} />
            </View>}
          />
        }
      </View>
    } */}

    <View className="publistGoodStep2-footer">
      <View className="publistGoodStep2-footer__btns">
        {/* <AtButton className="publistGoodStep2-footer__btns-item" onClick={handleSaveDraft}>????????????</AtButton> */}
        <AtButton type="primary" className="publistGoodStep2-footer__btns-item" loading={submitIng2} onClick={handleSubmit}>????????????</AtButton>
      </View>
      <View className="publistGoodStep2-footer__text">??????????????????<Text className="publistGoodStep2-footer__text-name" onClick={() => {
        Taro.navigateTo({
          url: `/pages/webview/index?name=${encodeURIComponent('????????????????????????')}`
        })
      }}>??????????????????????????????</Text></View>
    </View>

    {/* <AtModal
      isOpened={visibles.isSaveDraft}
      onClose={() => setVisibles({ isSaveDraft: false })}
      onConfirm={() => {console.log('onConfirm')}}
    >
      <AtModalContent>
        <View>??????????????????????????????</View>
      </AtModalContent>
      <AtModalAction>
        <View className="at-modal-btns">
          <View className="at-modal-btns-item" onClick={() => setVisibles({ isSaveDraft: false })}>??????</View>
          <View className="at-modal-btns-item at-modal-btns-item__primary" onClick={() => setVisibles({ isSaveDraft: false })}>??????</View>
        </View>
      </AtModalAction>
    </AtModal> */}

    {/* <View onClick={() => setVisible(!visible)}>????????????</View>
    <View>{cats}</View>
    <ClassifyPicker
      visible={visible}
      onVisibleChange={setVisible}
      onOk={setCats}
      defaultValue={cats}
    ></ClassifyPicker>

    <View>
      <PickAssuranceFee 
        value={fee} 
        onChange={setFee} 
        visible={visiblePickAssuranceFee} 
        onVisibleChange={setvisiblePickAssuranceFee} 
      ></PickAssuranceFee>
    </View> */}


    <PayAssuranceFeeModal
      visible={visibles['margin']}
      onVisibleChange={(v) => setVisibles({ ['margin']: v })}
      value={formValues['margin']}
      onChange={(v) => handleFormChange('margin', v)}
    />

    <BWPicker
      cols={2}
      title="????????????"
      data={endTimes}
      visible={visibles.startTime}
      onVisibleChange={(v) => setVisibles({startTime: v})}
      value={formValues.startTime}
      onChange={(v) => handleFormChange('startTime', v)}
    />

    <BWPicker
      headerType="close"
      cols={2}
      title="????????????"
      data={endTimes}
      visible={visibles.endTime}
      onVisibleChange={(v) => setVisibles({endTime: v})}
      value={formValues.endTime}
      onChange={(v) => handleFormChange('endTime', v)}
    />

    <View>
      <BWPicker
        title="??????????????????"
        headerType="close"
        visible={visibles['distPercent']}
        onVisibleChange={(v) => setVisibles({ ...visibles, 'distPercent': v })}
        cols={1}
        data={distPercents}
        value={formValues['distPercent']}
        onChange={(v) => handleFormChange('distPercent', v)}
      ></BWPicker>

    </View>
    <View>
      <Popup
        headerType="close"
        visible={visibles.serviceIds}
        onVisibleChange={(v) => setVisibles({ serviceIds: v })}
        title="????????????????????????"
        onOk={() => setVisibles({ serviceIds: false })}
      >
        <BWCheckbox.Group value={formValues.serviceIds} onChange={(v) => handleFormChange('serviceIds', v)}>
          <View className="mall-service-items">
          {
            Array.from(mallServices).map(([, item]) => {
              return <BWCheckbox.Label for={item.value} key={item.value} className="mall-service-item">
                <View>{item.label} <Text className="mall-service-item__desc">{item.desc}</Text>
                </View>
                <BWCheckbox />
              </BWCheckbox.Label>
            })
          }
          </View>
        </BWCheckbox.Group>
        {/* <CheckboxGroup>
          {
            Array.from(MALL_SERVICES).map(([, item]) => {
              return <View key={item.value}>
                <View>{item.label} <Text>{item.desc}</Text></View>
                <Checkbox color={PRIMARY_COLOR} size="small" value={item.value.toString()} ></Checkbox>
              </View>
            })
          }
        </CheckboxGroup> */}
      </Popup>
    </View>

    <PayFeePopup
      disableYUEPay
      visible={visibles.PayFeePopup}
      onVisibleChange={v => setVisibles({PayFeePopup: v})}
      title="???????????????"
      headerType="close"
      feeType="deposit"
      fee={formValues.margin}
      onSubmit={payForMargin}
      desc={<View>??????????????????????????????????????????????????????????????????????????????????????????
        <Text className="payFee-component-header__text" onClick={() => {
          Taro.navigateTo({
            url: `/pages/webview/index?name=${encodeURIComponent('???????????????')}`
          })
        }}>???????????????</Text>
      ????????????????????????</View>}
    ></PayFeePopup>

    <BwModal
      visible={visibles.BwModal}
      type="alert"
      title="??????????????????"
      content={
        <View>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????</View>
      }
      onClose={() => setVisibles({BwModal: false})}
    ></BwModal>

    <BwModal
      visible={visibles.BwModalDelay}
      type="alert"
      title="??????????????????"
      content={
        <View>???????????????????????? 5 ?????????????????????????????????????????????5??????</View>
      }
      onClose={() => setVisibles({...visibles, BwModalDelay: false})}
    ></BwModal>
    
  </View>
}