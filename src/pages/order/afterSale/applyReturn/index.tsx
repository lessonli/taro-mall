import ListItem from "@/components/ListItem";
import RadioGroup, { Radio } from "@/components/RadioGroup";
import Upload, { parseFiles2Str } from "@/components/Upload";
import { REGS, RETURN_APPLY_TYPE, RETURN_REASONS, ORDER_STATUS } from "@/constants";
import { View, Text } from "@tarojs/components";
import { AtButton, AtInput, AtTextarea } from "taro-ui";
import { useEffect, useMemo, useState } from 'react'
import Taro from "@tarojs/taro";

import './index.scss'
import Popup from "@/components/Popup";
import { RadioItem } from "@/components/RadioScrollList";
import api2564 from "@/apis/21/api2564";
import Schema, { Rules } from "async-validator";
import api1676, {IResapi1676} from "@/apis/21/api1676";
import compose, { formatMoeny, fen2yuan } from "@/utils/base";

const reasons = Object.keys(RETURN_REASONS).map(key => RETURN_REASONS[key])

export default () => {
  const page = Taro.getCurrentInstance()
  const [values, setValues] = useState({
    proofPics: [],
    description: '',
    reason: '',
    returnName: '',
    returnPhone: '',
    returnAmount: '',
    type: RETURN_APPLY_TYPE.onlyMoney.value,
  });

  const [orderDetail, setOrderDetail] = useState<Required<IResapi1676>['data']>();

  const [bools, setbools] = useState({
    reason: false,
    submiting: false,
  });

  useEffect(() => {
    api1676({ orderNo: page.router?.params.orderNo }).then(res => {
      setOrderDetail(res)
    })
  }, [])

  const handleValuesChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSubmit = async () => {
    const rules: Rules = {
      type: {
        required: true,
        message: '请选择售后类型',
      },
      reason: {
        required: true,
        message: '请选择退款原因',
      },
      returnPhone: {
        validator: (_, value, cb) => {
          if (value !== '' && !REGS.phone.pattern.test(value)) {
            return new Error(REGS.phone.message)
          }
          return cb()
        }
      },
      description: {
        required: values.reason === '质量问题',
        type: 'string',
        message: '请输入退款说明',
      },
      proofPics: {
        type: 'array',
        required: values.reason === '质量问题',
        message: '请上传产品图片',
      }
    }
    const validator = new Schema(rules)
    validator.validate(values, {suppressWarning: true}, async (errs) => {
      if (errs && errs.length > 0) {
        return Taro.showToast(({
          title: errs[0].message,
          icon: 'none',
        }))
      }
      setbools({
        ...bools,
        submiting: true,
      })
      const proofPics = parseFiles2Str(values.proofPics || [])
      console.log(proofPics, values.proofPics.map(e => e.url))
      const orderReturnNo = await api2564({
        orderNo: page.router?.params.orderNo,
        type: values.type,
        reason: values.reason || '',
        description: values.description || '',
        proofPics,
        returnName: values.returnName || '',
        returnPhone: values.returnPhone || '',
      })
      setbools({
        ...bools,
        submiting: false,
      })

      Taro.showToast({
        icon: 'none',
        title: '售后订单已创建'
      })

      Taro.redirectTo({
        url: `/pages/order/afterSale/detail/index?orderNo=${page.router?.params.orderNo}&orderReturnNo=${orderReturnNo}`
      })
      

    })
  }
  const typeOpts = useMemo(() => {
    if (orderDetail?.status === ORDER_STATUS.waitDispatch.value) {
      // 待发货 only 仅退款
      return [
        RETURN_APPLY_TYPE.onlyMoney,
      ]
    } else {
      return [
        RETURN_APPLY_TYPE.onlyMoney,
        RETURN_APPLY_TYPE.moneyAndProduct,
      ]
    }
  }, [orderDetail])

  const backFee = useMemo(() => {
    if (values.type === ORDER_STATUS.waitDispatch.value) {
      return orderDetail?.payAmount
    }
    // 运费
    return orderDetail?.payAmount - (orderDetail?.freightAmount || 0)
  }, [orderDetail, values])

  const currentReason = useMemo(() => reasons.find(e => e.value === values.reason)?.label || '请选择', [values])

  return <View className="applyReturnpage">
    <View className="applyReturnpage-card">
      <ListItem
        icon={null}
        type={1}
        left={<View className="bw-required">售后类型</View>}
        right={<RadioGroup value={values.type} onChange={(v) => handleValuesChange('type', v)} >
          {
            typeOpts.map(({ label, value}) => <Radio name={value} key={value}>{label}</Radio>)
          }
        </RadioGroup>}
      />

      <ListItem
        type={1}
        left={<View className="bw-required">退款原因</View>}
        right={<View 
          className={currentReason === '请选择' ? 'color-placeholder' : 'tabColor'}
          onClick={() => setbools({...bools, reason: true})}>{currentReason}</View>}
      />

      <ListItem
        type={1}
        icon={null}
        left={<View className="bw-required">{'退款金额'}</View>}
        right={<View>
          <View className="color-primary fz28">￥{compose(formatMoeny, fen2yuan)(orderDetail?.payAmount)}</View>
        </View>}
      />
    </View>

    <View className="applyReturnpage-card p-24">
      <View className={`fz32 m-b-12 fontColor`}>
        <Text className={`fz32 fontColor ${currentReason === '质量问题' ? 'bw-required' : ''}`}>退款说明</Text>
      </View>
      <AtTextarea placeholder="请输入退款说明" count={false} value={values.description} onChange={(v) => handleValuesChange('description', v)} />
      <View>
        <Upload 
          value={values.proofPics}
          onChange={(v) => handleValuesChange('proofPics', v)}
          max={3}
          type="image"
        ></Upload>
      </View>
    </View>

    <View className="applyReturnpage-card">
      <ListItem
        icon={null}
        type={1}
        left={'退款联系人'}
        right={<AtInput placeholder="选填" name="returnName" value={values.returnName}  onChange={(v) => handleValuesChange('returnName', v)} />}
      />
      <ListItem
        icon={null}
        type={1}
        left={'联系方式'}
        right={<View><AtInput placeholder="选填" name="returnPhone" value={values.returnPhone}  onChange={(v) => handleValuesChange('returnPhone', v)} type="phone" /></View>}
      />
    </View>

    <View className="applyReturnpage-footer p-24">
      <AtButton type="primary" onClick={handleSubmit} loading={bools.submiting}>发起退款</AtButton>
    </View>

    <Popup
      title="选择退货原因"
      visible={bools.reason}
      onVisibleChange={reason => setbools({...bools, reason })}
      headerType="close"
    >
      <View>
      {
        reasons.map((item) => <RadioItem label={item.label} value={item.value} checked={item.value === values.reason} onChecked={(v) => handleValuesChange('reason', v)} />)
      }
      </View>
    </Popup>

  </View>
}