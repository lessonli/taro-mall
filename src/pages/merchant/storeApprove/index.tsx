import Taro from '@tarojs/taro'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import ListItem from '@/components/ListItem'
import { card1, card2, card3, cardBorder } from '@/constants/images'
import './index.scss'
import api3542 from '@/apis/21/api3542'
import Upload, { IFile, parseStr2Files } from '@/components/Upload'
import { IChinaTree, getChinaAddsTree } from '@/utils/cachedService'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import BWPicker from '@/components/SelectPicker'
import * as images from '@/constants/images'
import api2436 from '@/apis/21/api2436'
import { IReqapi2436 } from '@/apis/21/api2436'
import { View, Text, Image } from '@tarojs/components'
import PreviewImg from '@/components/PreviewImg'
import { onValidateData } from '@/utils/validate'
import api2444 from '@/apis/21/api2444'
import { useDidShow } from '@tarojs/runtime'
import { session } from '@/utils/storge'
export type IFormData = Required<IReqapi2436>
const StoreApprove = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const shopLogoUploadRef = useRef()
  const frontUploadRef = useRef()
  const backUploadRef = useRef()
  const headUploadRef = useRef()
  const [cityVisible, setCityVisible] = useState<boolean>(false)
  const [tree, setTree] = useState<IChinaTree>([])
  const [addressInfo, setAddressInfo] = useState<string[]>(['', '', ''])
  const [refundAddress, setRefundAddress] = useState<string>('')
  const [shopLogo, setShopLogo] = useState<IFile[]>([]);
  const [frontImg, setFrontImg] = useState<IFile[]>([]);
  const [backImg, setBackImg] = useState<IFile[]>([]);
  const [headImg, setHeadImg] = useState<IFile[]>([]);
  const [formData, setFormData] = useState<IFormData>()

  const prevPagePath = useMemo(() => {
    const pages = Taro.getCurrentPages()
    return pages[pages.length - 1]?.path || pages[pages.length - 1]?.route
  }, [])

  const FormRules = {
    shopName: [{ required: true, message: '请填写店铺名称' }],
    shopLogo: [{ required: true, message: '请选择店铺logo的图片' }],
    district: [{ required: true, message: '请选择店铺地址' }],
    idCardFront: [{ required: true, message: '请上传身份证人像面的照片' }],
    idCardBack: [{ required: true, message: '请上传身份证国徽面的照片' }],
    idCardHand: [{ required: true, message: '请上传本人手持身份证的照片' }],

  }

  const onSubmit = async () => {
    const result = await onValidateData(FormRules, formData)
    if (result) {
      //@ts-ignore
      if (formData.shopName.indexOf('博物') > -1) {
        Taro.showToast({
          title: '店铺名称请不要带博物两字',
          icon: 'none'
        })
        return
      }
      if (!refundAddress) {
        Taro.showToast({ title: '请先选择退货地址', icon: 'none' })
        return
      }
      await api2436(formData)
      session.setItem('pages/storeApprove/index', formData)
      Taro.redirectTo({ url: '/pages/merchant/earnestMoney/index' })
      // await api2436(formData)
      // setTimeout(() => {
      //   Taro.showToast({ title: '认证成功啦～', duration: 2000 })
      // });
      // Taro.navigateBack()
    }

  }
  const onReset = () => {

  }

  // item操作
  const handleChange = (key: string | number, value: any) => {
    const form = Object.assign({}, formData, { [key]: value })
    setFormData(form)
  }

  //选择退货地址
  const goAddress = () => {
    Taro.navigateTo({
      url: `/pages/other/address/addAddress/index?refund=${refundAddress ? 'edit' : 'add'}`
    })
  }

  // 选择店铺地址
  const onOk = () => {

    const form = Object.assign({}, formData, { province: addressInfo[0], city: addressInfo[1], district: addressInfo[2] })
    setFormData(form)
  }


  useEffect(() => {
    (async () => {
      const res = await getChinaAddsTree()
      setTree(res)
      // @ts-ignore
      setAddressInfo([res[0].value, res[0].children[0].value, res[0].children[0].children[0].value])

      const form = await api2444()
      setFormData(form)
      setShopLogo(parseStr2Files(form?.shopLogo))
    })()
  }, [])

  useDidShow(async () => {
    const data = await api3542()
    data && setRefundAddress(`${data.province}-${data.city}-${data.district}-${data.detailAddress}`)
  })

  const changeImg = (value, name, fn) => {
    fn(value)
    handleChange(name, value.length > 0 ? value[0].url : '')
  }

  const goXieyi = useCallback((name) => {
    Taro.navigateTo({
      url: `/pages/webview/index?name=${encodeURIComponent(name)}`
    })
  }, [])

  const reLoad = useCallback((ref) => {
    // ref.current?.handleRemove(0)
    ref.current?.handUpload()
  }, [])
  // shopLogo触发按钮
  const shopLogoPreview = useMemo(() => {
    return <View>
      <img src={shopLogo[0]} onClick={() => { shopLogoUploadRef.current?.handUpload() }} className='storeApprove-logo-src' alt="" />
    </View>
  }, [shopLogo])

  // 身份证正面触发按钮
  const frontButton = useMemo(() => {
    return <View onClick={() => { frontUploadRef.current?.handUpload() }} className='storeApprove-card-photo-preview'>
      <img className='storeApprove-card-photo-preview-img' src={images.preview} alt="" />
      <Text className='text'>上传身份证人像面</Text>
    </View>
  }, [frontImg])

  // 身份证背面
  const backButton = useMemo(() => {
    return <View onClick={() => { backUploadRef.current?.handUpload() }} className='storeApprove-card-photo-preview'>
      <img src={images.preview} alt="" />
      <Text className='text'>上传身份证国徽面</Text>
    </View>
  }, [backImg])

  // 手持
  const headButton = useMemo(() => {
    return <View onClick={() => { headUploadRef.current?.handUpload() }} className='storeApprove-card-photo-preview'>
      <img src={images.preview} alt="" />
      <Text className='text'>上传手持身份证面</Text>
    </View>
  }, [headImg])


  return (
    <div className='storeApprove'>
      <AtForm
        onReset={onReset}
      >
        <AtInput
          name='name'
          title='店铺名称'
          type='text'
          placeholder='请填写店铺名称'
          value={formData?.shopName}
          disabled={formData?.authStatus !== 0}
          style={{ textAlign: 'right' }}
          onChange={handleChange.bind(this, 'shopName')}
        />
        <p className='storeApprove-tips'>不可使用他人注册商标或包含联系方式 (店铺认证后不可修改)</p>
        <ListItem left={<div className='storeApprove-logo'>
          <span className='storeApprove-logo-title'>店铺logo</span>
        </div>} right={<Upload
          ref={shopLogoUploadRef}
          value={shopLogo} onChange={(value) => { changeImg(value, 'shopLogo', setShopLogo) }}
          max={1}
          mode="single"
          className='storeApprove-logo-src'
          uploadButton={shopLogoPreview}
          imageComponent={shopLogo.map(item => { return <PreviewImg type={1} src={item.url} reLoad={() => { reLoad(shopLogoUploadRef) }} /> })}
        ></Upload>} />
        <p className='storeApprove-tips'>推荐尺寸512*512，不可使用二维码或包含联系方式</p>
        <ListItem type={1} left={<span >店铺地址</span>} right={<span className='color666' onClick={() => { setCityVisible(true) }}>{formData?.province ? `${formData?.province}-${formData?.city}-${formData?.district}` : <span>点击选择</span>}</span>}
        />
        <ListItem type={1} left={<span >退货地址</span>} right={<span className='color666' onClick={goAddress}>{refundAddress || '去设置'}</span>}
        />

        <div className='storeApprove-card'>
          <p className='storeApprove-card-title'>身份证照片</p>
          <p className='storeApprove-card-tips'>请使用手机横向拍摄以保持图片清晰正常显示</p>
          <div className='storeApprove-card-photo'>
            <Upload
              ref={frontUploadRef}
              value={frontImg} onChange={(value) => { changeImg(value, 'idCardFront', setFrontImg) }}
              max={1}
              mode="single"
              className='storeApprove-card-photo-card'
              uploadButton={frontButton}
              imageComponent={frontImg.map((item, index) => { return <PreviewImg className='others' key={index} src={item.url} reLoad={() => { reLoad(frontUploadRef) }} /> })}
            ></Upload>
            <div className='storeApprove-card-photo-card-exm'>
              <span className='storeApprove-card-photo-card-exm-tips'>示例图</span>
              <img className='storeApprove-card-photo-card-exm-img' src={card1} alt="" />
            </div>
            <Upload
              ref={backUploadRef}
              value={backImg} onChange={(value) => { changeImg(value, 'idCardBack', setBackImg) }}
              max={1}
              mode="single"
              className='storeApprove-card-photo-card'
              uploadButton={backButton}
              imageComponent={backImg.map((item, index) => { return <PreviewImg className='others' key={index} src={item.url} reLoad={() => { reLoad(backUploadRef) }} /> })}
            ></Upload>
            <div className='storeApprove-card-photo-card-exm'>
              <span className='storeApprove-card-photo-card-exm-tips'>示例图</span>
              <img className='storeApprove-card-photo-card-exm-img' src={card2} alt="" />
            </div>
          </div>
        </div>
        <div className='storeApprove-card'>
          <p className='storeApprove-card-title'>手持身份证照片</p>
          <p className='storeApprove-card-tips'>拍照时请对焦在证件上，保持脸部和身份证清</p>
          <div className='storeApprove-card-photo'>
            <Upload
              ref={headUploadRef}
              value={headImg} onChange={(value) => { changeImg(value, 'idCardHand', setHeadImg) }}
              max={1}
              mode="single"
              className='storeApprove-card-photo-card'
              uploadButton={headButton}
              imageComponent={headImg.map((item, index) => { return <PreviewImg className='others' key={index} src={item.url} reLoad={() => { reLoad(headUploadRef) }} /> })}
            ></Upload>
            <div className='storeApprove-card-photo-card-exm'>
              <span className='storeApprove-card-photo-card-exm-tips'>示例图</span>
              <img className='storeApprove-card-photo-card-exm-img' src={card3} alt="" />
            </div>
          </div>
        </div>
        <AtButton className='storeApprove-card-btn' formType='submit' onClick={onSubmit} type='primary' >下一步</AtButton>
        <Text className='storeApprove-card-xieyi'>点击即表示同意 <Text className='bw-xieyi' onClick={() => { goXieyi('博物有道认证增值服务协议') }}>《博物有道认证增值服务协议》</Text>、<Text className='bw-xieyi' onClick={() => { goXieyi('博物有道卖家入驻协议') }}>《卖家入驻协议》</Text>、<Text className='bw-xieyi' onClick={() => { goXieyi('个人信息使用授权书') }}>《个人信息使用授权书》</Text></Text>
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

export default StoreApprove
