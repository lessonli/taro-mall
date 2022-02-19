import api2524, { IResapi2524 } from '@/apis/21/api2524'
import api4752 from '@/apis/21/api4752'
import api4764 from '@/apis/21/api4764'
import ListItem from '@/components/ListItem'
import NavigationBar, { BackAndHomeBtn } from '@/components/NavigationBar'
import Popup from '@/components/Popup'
import { XImage } from '@/components/PreImage'
import { RadioItem } from '@/components/RadioScrollList'
import Upload, { parseFiles2Str } from '@/components/Upload'
import { REPORT_REASONS } from '@/constants'
import { getUserInfo } from '@/utils/cachedService'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Schema, { Rules } from 'async-validator'
import { useEffect, useMemo, useState } from 'react'
import { AtButton } from 'taro-ui'
import SubmitButton from '../components/SubmitBottom'

import './index.scss'
export type IDetail = Required<IResapi2524["data"]>
interface IReport {
  albumPicsArr?: Array<string>,
  reason?: string,
  proofPics: any[],
  describe: string
}
const Report = () => {
  const [reasons, setReasons] = useState<string[]>([])
  const page = useMemo(() => Taro.getCurrentInstance(), [])

  const [goodsDetail, setGoodsDetail] = useState<IDetail>()

  const [userInfo, serUserInfo] = useState<any>()

  const [bools, setbools] = useState({
    reason: false,
    submiting: false,
  });

  const [values, setValues] = useState<IReport>({
    albumPicsArr: [],
    reason: '',
    proofPics: [],
    describe: ''

  });
  useEffect(() => {

    (async () => {
      const uuid = page.router?.params?.productId
      const form = await api2524({ uuid })
      // const userInfo = await getUserInfo()
      // serUserInfo(userInfo)
      setGoodsDetail(form)
    })()

  }, [])


  const handleValuesChange = (name, value) => {
    console.log(value, 1212);

    setValues({
      ...values,
      [name]: value
    })

  }

  const handleSubmit = () => {
    const rules: Rules = {
      reason: {
        required: true,
        message: '请选择举报原因',
      },
      describe: {
        required: true,
        type: 'string',
        message: '请输入举报详情',
      },
      proofPics: {
        type: 'array',
        required: true,
        message: '请上传举证图片',
      }
    }
    const validator = new Schema(rules)

    validator.validate(values, { suppressWarning: true }, async (errs) => {
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
      const orderReturnNo = await api4752({
        targetType: 0,
        targetId: page.router?.params.productId,
        reason: values.reason || '',
        describe: values.describe || '',
        proofPics,
        // userId: userInfo.userId || '',
      })
      setbools({
        ...bools,
        submiting: false,
      })

      Taro.showToast({
        icon: 'none',
        title: '提交成功'
      })

      Taro.navigateBack()


    })
  }

  const openReasonList = async () => {
    if (reasons.length < 1) {
      const reasonList = await api4764()
      setReasons(reasonList?.productReasons)
      setbools({ ...bools, reason: true })
    } else {
      setbools({ ...bools, reason: true })
    }
  }



  return (
    <View className='Report'>
      <NavigationBar
        title='商品举报'
        background={'#ffffff'}
        leftBtn={<BackAndHomeBtn />}
      />
      <View className='Report-product'>
        <XImage className='Report-product-img' src={goodsDetail?.icon} disabledPlaceholder></XImage>
        <Text className='Report-product-info'>{goodsDetail?.name}</Text>
      </View>
      <ListItem className='Report-item' left={<View className='Report-title'>
        举报原因
        <Text className='Report-title-red'>*</Text>
      </View>} right={<Text onClick={openReasonList}>{values.reason || '请选择'}</Text>}></ListItem>
      <View className='Report-content'>
        <View className='Report-title ml16'>
          举报内容
          <Text className='Report-title-red'>*</Text>
        </View>
        <Textarea className='Report-content-textarea' onInput={(v) => handleValuesChange('describe', v.detail.value)} placeholder='请详细描述您举报的内容'></Textarea>
        <View className='Report-content-upload'>
          <Upload
            max={6}
            value={values.proofPics}
            onChange={(v) => handleValuesChange('proofPics', v)}
          />
        </View>
      </View>
      <AtButton className='Report-btn' onClick={handleSubmit} type='primary' loading={bools.submiting}>
        提交
      </AtButton>
      <Popup
        title="举报原因"
        visible={bools.reason}
        onVisibleChange={reason => setbools({ ...bools, reason })}
        headerType="close"
      >
        <View>
          {
            reasons.map((item) => <RadioItem label={item} value={item} checked={item === values.reason} onChecked={(v) => handleValuesChange('reason', v)} />)
          }
        </View>
      </Popup>
    </View>
  )
}

export default Report
