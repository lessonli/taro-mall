import Taro from '@tarojs/taro'
import { AtForm, AtInput, AtButton, AtSwitch } from 'taro-ui'
import ListItem from '@/components/ListItem'
import { validateData, onValidateData } from '@/utils/validate'
import './index.scss'
import { useEffect, useMemo, useState } from 'react'
import BWPicker from '@/components/SelectPicker';
import { getAddressList, getChinaAddsTree, IChinaTree } from '@/utils/cachedService';
import api2228, { IReqapi2228 } from '@/apis/21/api2228'
import api2260 from '@/apis/21/api2260'
import api2236 from '@/apis/21/api2236'
import api2428 from '@/apis/21/api2428'
import { addOrgToUrl } from '@/utils/base'
import api3542 from '@/apis/21/api3542'
import { session } from '@/utils/storge'
export type IFormData = Required<IReqapi2228>
const AddAddress = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [formData, setFormData] = useState<IFormData>()
  const [cityVisible, setCityVisible] = useState<boolean>(false)
  const [addressInfo, setAddressInfo] = useState<string[]>(['', '', ''])
  const [tree, setTree] = useState<IChinaTree>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const FormRules = {
    name: [{ required: true, message: '请输入名字' }],
    mobile: [
      { required: true, message: "请输入手机号" },
      {
        validator: (rule: any, value: string) => {
          return /^1[3-9]\d{9}$/.test(value);
        },
        message: "请输入正确的手机号",
      },
    ],
    province: [{ required: true, message: '请选择地区' }],
    detailAddress: [{ required: true, message: '请输入详细地址' }],

  }

  const onSubmit = async () => {

    const result = await onValidateData(FormRules, formData)
    if (result) {
      setIsLoading(true)
      if (page.router?.params.refund) {
        await api2428(formData)
        setTimeout(() => {
          Taro.showToast({ title: '添加退货地址成功', icon: 'none' })
          // let url = decodeURIComponent(page.router?.params.sourceUrl)
          Taro.navigateBack()
          setIsLoading(false)
        }, 500);
      } else {
        if (page.router?.params.add || page.router?.params.add1st) {
          const newNo = await api2228(formData)
          session.setItem('pages/other/address/index', {
            activedAddressNo: newNo,
          })
          await getAddressList.reset()
          setTimeout(() => {
            Taro.showToast({ title: '添加成功', icon: 'none' })
            Taro.navigateBack()
            setIsLoading(false)
          }, 500);
        } else {
          await api2236(formData)
          await getAddressList.reset()
          setTimeout(() => {
            Taro.showToast({ title: '编辑成功', icon: 'none' })
            Taro.navigateBack()
            setIsLoading(false)
          }, 500);
        }
      }

    }

  }
  const onReset = () => {
  }


  const handleChange = async (key: string | number, value: any) => {

    // const errMsgList = getErrorMsgList(errMsg)
    // console.log(errMsgList);
    // validateData(FormRules, key, value)
    const form = Object.assign({}, formData, { [key]: value })
    setFormData(form)

    // setFormData()
  }
  const Icon = <i className='myIcon ListItem-right'>&#xe721;</i>
  const Switch = <AtSwitch color='#AA1612' checked={formData?.isDefault} onChange={handleChange.bind(this, 'isDefault')} />

  const onOk = () => {

    const form = Object.assign({}, formData, { province: addressInfo[0], city: addressInfo[1], district: addressInfo[2] })
    setFormData(form)

  }

  useEffect(() => {
    (async () => {
      const res = await getChinaAddsTree()
      setTree(res)      
      let prevData
      // @ts-ignore
      // setAddressInfo([res[0].value, res[0].children[0].value, res[0].children[0].children[0].value])
      if (page.router?.params.addressNo) {
        const result = await getAddressList()
        if (result) {
          prevData = result.filter(item => item.addressNo === page.router?.params.addressNo)[0]
          setFormData(prevData)
        }
      }
      if (page.router?.params.refund === 'edit') {
        prevData = await api3542()
        setFormData(prevData)
      }
      console.log('prevData', prevData);
      
      setAddressInfo([
        prevData?.province || res[0].value,
        prevData?.city || res[0].children[0].value,
        prevData?.district || res[0].children[0].children[0].value
      ])
    })()
  }, [])

  return (
    <div className='addAddress'>
      <AtForm
        onReset={onReset}
      >
        <AtInput
          name='name'
          title='联系人'
          type='text'
          placeholder='输入联系人姓名'
          value={formData?.name}
          onChange={handleChange.bind(this, 'name')}
        />
        <AtInput
          name='mobile'
          title='手机号码'
          type='number'
          placeholder='联系人手机号'
          value={formData?.mobile}
          onChange={handleChange.bind(this, 'mobile')}
        />
        <ListItem type={1} icon={Icon} left={<span>所在地区</span>} right={<span onClick={setCityVisible.bind(this, true)}>{formData?.province ? <span className='color333'>{`${formData?.province}-${formData?.city}-${formData?.district}`}</span> : <span style={{ color: '#bdbdbd' }}>请选择</span>}</span>} />
        <AtInput
          name='detailAddress'
          title='详细地址'
          type='text'
          placeholder='请输入详细地址'
          value={formData?.detailAddress}
          onChange={handleChange.bind(this, 'detailAddress')}
        />
        {!page.router?.params.refund && <ListItem className='mt24 br8' style={{ borderBottom: 'none' }} type={1} icon={Switch} left={<span>设为默认地址</span>} />}
        <AtButton className='addAddress-btn' loading={isLoading} disabled={isLoading} onClick={onSubmit} type='primary'>保存</AtButton>
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

export default AddAddress
