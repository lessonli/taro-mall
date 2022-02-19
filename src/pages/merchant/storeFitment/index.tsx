import Taro from '@tarojs/taro'
import ListItem from '@/components/ListItem'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import * as images from '@/constants/images'
import './index.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Upload, { IFile, parseStr2Files } from '@/components/Upload';
import { View, Button, Image, } from '@tarojs/components'
import { getChinaAddsTree, IChinaTree } from '@/utils/cachedService'
import BWPicker from '@/components/SelectPicker'
import api3542 from '@/apis/21/api3542'
import api3512 from '@/apis/21/api3512'
import api2444, { IResapi2444 } from '@/apis/21/api2444'
import PreviewImg from '@/components/PreviewImg'
import { onValidateData } from '@/utils/validate'
import { useDidShow } from '@tarojs/runtime'
export type IFormData = Required<IResapi2444['data']>

const StoreFitment = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const shopLogoUploadRef = useRef()
  const [cityVisible, setCityVisible] = useState<boolean>(false)
  const [tree, setTree] = useState<IChinaTree>([])
  const [addressInfo, setAddressInfo] = useState<string[]>(['', '', ''])
  const [refundAddress, setRefundAddress] = useState<string>('')
  const [shopLogo, setShopLogo] = useState<IFile[]>([]);
  const [formData, setFormData] = useState<IFormData>()

  const FormRules = {
    shopLogo: [{ required: true, message: '请选择店铺logo的图片' }],
    district: [{ required: true, message: '请选择店铺地址' }],

  }

  const onSubmit = async () => {
    const result = await onValidateData(FormRules, formData)
    if (result) {
      if (!refundAddress) {
        Taro.showToast({ title: '请先选择退货地址', icon: 'none' })
        return
      }
      await api3512(formData)
      setTimeout(() => {
        Taro.showToast({ title: '装修成功啦～', duration: 2000 })
      });
      let url = decodeURIComponent(page.router?.params.sourceUrl)
      if (page.router?.params.sourceUrl) {
        Taro.redirectTo({
          url: url
        })
      } else {
        Taro.redirectTo({
          url: '/pages/store/storeSetting/index'
        })
      }
    }

  }
  const onReset = () => {

  }
  const handleChange = (key: string | number, value: any) => {
    const form = Object.assign({}, formData, { [key]: value })
    setFormData(form)
  }
  const goAddress = () => {
    Taro.navigateTo({
      url: `/pages/other/address/addAddress/index?refund=${refundAddress ? 'edit' : 'add'}`
    })
  }
  const changeShopLogo = useCallback((value) => {
    setShopLogo(value)
    if (value && value.length > 0) {
      handleChange('shopLogo', value.length > 0 ? value[0].url : '')
    }
  }, [formData])
  const onOk = () => {

    const form = Object.assign({}, formData, { province: addressInfo[0], city: addressInfo[1], district: addressInfo[2] })
    setFormData(form)
  }
  useEffect(() => {
    (async () => {
      const res = await getChinaAddsTree()
      setTree(res)
      // @ts-ignore
      // setAddressInfo([res[0].value, res[0].children[0].value, res[0].children[0].children[0].value])
      const form = await api2444()
      setFormData(form)
      setShopLogo(parseStr2Files(form?.shopLogo))
      setAddressInfo([
        form?.province || res[0].value,
        form?.city || res[0].children[0].value,
        form?.district || res[0].children[0].children[0].value,
      ])
    })()
  }, [])

  useDidShow(async () => {
    const data = await api3542()
    data && setRefundAddress(`${data.province}-${data.city}-${data.district}-${data.detailAddress}`)
  })

  const reLoad = useCallback((ref) => {
    // ref.current?.handleRemove(0)
    ref.current?.handUpload()
  }, [])

  // shopLogo触发按钮
  const shopLogoPreview = useMemo(() => {
    return <View>
      <img src={shopLogo[0]} onClick={() => { shopLogoUploadRef.current?.handUpload() }} className='storeFitment-logo-src' alt="" />
    </View>
  }, [shopLogo])
  return (
    <div className='storeFitment'>
      <AtForm
        onReset={onReset}
      >
        <AtInput
          name='shopName'
          title='店铺名称'
          type='text'
          className='br8'
          placeholder='请填写店铺名称'
          disabled={formData?.authStatus !== 0}
          value={formData?.shopName}
          style={{ textAlign: 'right' }}
          onChange={handleChange.bind(this, 'shopName')}
        />
        <p className='storeFitment-tips'>不可使用他人注册商标或包含联系方式 (店铺认证后不可修改)</p>
        <ListItem className='br8 bb0' left={<div className='storeFitment-logo'>
          <span className='storeFitment-logo-title'>店铺logo</span>
        </div>} right={<Upload
          ref={shopLogoUploadRef}
          value={shopLogo} onChange={changeShopLogo}
          mode="single"
          max={1}
          className='storeFitment-logo-src'
          uploadButton={shopLogoPreview}
          imageComponent={shopLogo.map((item, index) => { return <PreviewImg key={index} type={1} src={item.thumbUrl || item.url} reLoad={() => { reLoad(shopLogoUploadRef) }} /> })}
        ></Upload>} />
        <p className='storeFitment-tips'>推荐尺寸512*512，不可使用二维码或包含联系方式</p>
        <div className='br8 overhide'>
          <ListItem type={1} left={<span >店铺地址</span>} right={<span onClick={() => { setCityVisible(true) }}>{formData?.province ? <span className='color666'>{`${formData?.province}-${formData?.city}-${formData?.district}`}</span> : <span>点击选择</span>}</span>}
          />
          <ListItem type={1} className='bb0' left={<span >退货地址</span>} right={<span onClick={goAddress}>{refundAddress ? <span className='color666'>{refundAddress}</span> : <span>去设置</span>}</span>}
          />
        </div>
        <AtButton className='storeFitment-btn' onClick={onSubmit} type='primary'>提交</AtButton>
      </AtForm>
      <BWPicker
        visible={cityVisible}
        headerType={undefined}
        onVisibleChange={setCityVisible}
        data={tree}
        onOk={onOk}
        cols={3}
        value={addressInfo}
        onChange={setAddressInfo}
        title="选择地址"
      ></BWPicker>
    </div>
  )
}

export default StoreFitment
