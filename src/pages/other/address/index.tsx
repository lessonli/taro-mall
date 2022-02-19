import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import Radio from '@/components/Radio'
import { Radio, RadioGroup } from '@/components/RadioGroup'
import BwModal from '@/components/Modal'
import * as images from '@/constants/images'
import './index.scss'
import api2260, { IResapi2260 } from '@/apis/21/api2260'
import api2252 from '@/apis/21/api2252'
import { getAddressList } from '@/utils/cachedService'
import { addOrgToUrl, getUrl2Address } from '@/utils/base'
import api2244 from '@/apis/21/api2244'
import { useDidShow } from '@tarojs/runtime'
import { session } from '@/utils/storge'

export type IAddress = Required<IResapi2260["data"]>

interface Iprops {
  onClick?: () => {} | undefined;
  editAddress?: any | undefined
  deleteAddress?: any | undefined
  addressList: IAddress
  updateList?: any | undefined
}
// params: chooseAble
const AddressCard = (props: Iprops) => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [radioValue, setRadioValue] = useState()
  const { addressList, onClick, deleteAddress, editAddress, updateList } = props
  const radioClick = async (value) => {
    await api2244({ addressNo: value })
    setRadioValue(value)
    // updateList()
    Taro.showToast({ title: '设置默认成功', icon: 'none' })
  }
  const handClick = useCallback((addressNo, type) => {
    type === 'delete' && deleteAddress(addressNo)
    type === 'edit' && editAddress(addressNo)

  }, [])
  const onConfirm = useCallback((addressNo) => {
    if (!page.router?.params.chooseAble) return
    // let url = getUrl2Address(page.router?.params.sourceUrl, page, 1)
    // let url = decodeURIComponent(page.router?.params.sourceUrl)
    // url = addOrgToUrl(url, 'addressNo', addressNo)
    // pages/other/address/index
    session.setItem('pages/other/address/index', {
      activedAddressNo: addressNo,
    })
    Taro.navigateBack()
    // Taro.redirectTo({
    //   url: url
    // })
  }, [])
  useEffect(() => {
    const data = addressList?.filter(item => item.isDefault === true)[0]
    setRadioValue(data?.addressNo)
  }, [])
  return (
    <>
      {
        addressList?.map((item, index) => {
          return <RadioGroup value={radioValue} onChange={radioClick} key={item.addressNo}><div className='addressCard'>
            <div onClick={onConfirm.bind(this, item.addressNo)}>
              <div className='addressCard-person'>
                <span className='addressCard-person-name'>{item.name}</span>
                <span className='addressCard-person-phone'>{item.mobile}</span>
              </div>
              <div className='addressCard-detail'>
                <span className='addressCard-detail-address'>{item.province} {item.city} {item.district} {item.detailAddress}</span>
                {/* <span className='addressCard-detail-use' onClick={onClick?.bind(this)}>使用</span> */}
              </div>
            </div>
            <div className='addressCard-check'>
              <Radio name={item.addressNo}>
                <span className='fz28'>默认地址</span>
              </Radio>
              <p className='addressCard-check-operation'>
                <span onClick={handClick.bind(this, item.addressNo, 'edit')}>编辑</span>
                <span onClick={handClick.bind(this, item.addressNo, 'delete')}>删除</span>
              </p>
            </div>
          </div></RadioGroup>
        })
      }
      {/* <RadioList radioListOption={radioListOption} onChange={radioClick}></RadioList> */}
    </>


  )
}
const Address = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [addressList, setAddressList] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [addressNo, setAddressNo] = useState<any>()
  const [modalInfo, setModalInfo] = useState<{ title: string, type: string }>({ title: '确定删除该地址？', type: 'del' })

  useDidShow(() => {
    getList()
  })

  const getList = async () => {
    const data = await getAddressList.reset()
    setAddressList(data)
  }

  const AddAddress = () => {
    let url = '/pages/other/address/addAddress/index?add=true'
    // page.router?.params.sourceUrl && (url = addOrgToUrl(url, 'sourceUrl', encodeURIComponent(page.router?.params.sourceUrl)))
    Taro.navigateTo({
      url: url,
    })
  }
  const handleDelete = useCallback((value) => {
    setAddressNo(value)
    setVisible(true)
    getList()
  }, [])

  const handleEdit = useCallback((value) => {
    let url = '/pages/other/address/addAddress/index'
    url = addOrgToUrl(url, 'addressNo', value)
    // page.router?.params.sourceUrl && (url = addOrgToUrl(url, 'sourceUrl', encodeURIComponent(page.router?.params.sourceUrl)))
    Taro.navigateTo({
      url: url
    })
  }, [])
  const onConfirm = useCallback(async () => {
    await api2252({ addressNo: addressNo })
    setVisible(false)
    Taro.showToast({ title: '删除成功' })
    getList()
  }, [addressNo])

  const onClose = useCallback(() => {
    setVisible(false)
  }, [])
  return (
    <div className='address'>
      {addressList.length > 0 && <AddressCard updateList={getList} addressList={addressList} deleteAddress={handleDelete} editAddress={handleEdit}></AddressCard>}
      <div className='address-btn' >
        <AtButton type='primary' onClick={AddAddress}>新增地址</AtButton>
      </div>
      <BwModal visible={visible} title={modalInfo.title} confirmText='确定' cancelText='取消' onConfirm={onConfirm} onCancel={onClose} />
    </div>
  )
}

export default Address
