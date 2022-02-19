import Taro, { showModal } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import { AtForm, AtButton, AtInput, message } from 'taro-ui'
import { onValidateData, validateData } from '@/utils/validate'
import BwModal from '@/components/Modal'

import './index.scss'
import ListItem from '@/components/ListItem'
import api3692 from '@/apis/21/api3692'
import api2420 from '@/apis/21/api2420'
const Certify = () => {
  const [formData, setFormData] = useState<any>({})
  const [spanName, setSpanName] = useState<string>('获取验证码')
  const [isSend, setIsSend] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const FormRules = {
    realName: [{ required: true, message: '输入真实姓名' }],
    idCardNo: [{ required: true, message: '请输入身份证号码' }, {
      validator: (rule: any, value: string) => {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
      },
      message: '请输入正确的身份证'
    }],
    mobile: [
      { required: true, message: "请输入手机号" },
      {
        validator: (rule: any, value: string) => {
          return /^1[3-9]\d{9}$/.test(value);
        },
        message: "请输入正确的手机号",
      },
    ],
    bankCardNo: [{ required: true, message: '请输入银行卡号' }],
    bankCompanyName: [{ required: true, message: '请输入开卡银行公司名' }],
    bankAddress: [{
      required: true, message: '请输入开户银行名'
    }],
    mtCode: [{ required: true, message: '请输入验证码' }],
  }
  const options = [
    {
      name: 'realName',
      title: '持卡人姓名',
      placeholder: '输入真实姓名',
      label: '真实姓名'
    },
    {
      name: 'idCardNo',
      title: '身份证号码',
      placeholder: '输入身份证号码',
      label: '身份证号'
    },
    {
      name: 'bankCardNo',
      title: '银行卡卡号',
      placeholder: '输入银行卡卡号',
      label: '银行卡号'
    },
    {
      name: 'bankCompanyName',
      title: '发卡银行',
      placeholder: '输入发卡银行',
      label: '发卡银行'
    },
    {
      name: 'bankAddress',
      title: '开户行',
      placeholder: '输入开户行',
      label: '开户行'
    },
    {
      name: 'mobile',
      title: '预留手机号',
      placeholder: '输入预留手机号',
      label: '预留手机号'
    },
    // {
    //   name: 'bankAddress',
    //   title: '发卡银行',
    //   placeholder: '输入卡号后自动识别',
    // }
  ]

  const getVerificationCode = () => {
    if (!isSend && formData.mobile) {
      api3692({ mobile: formData.mobile })
      let num = 60
      setSpanName(`${num}s后重发`)
      let timer = setInterval(() => {
        if (num > 0) {
          num--
          setSpanName(`${num}s后重发`)
        } else {
          clearInterval(timer)
          setSpanName('获取验证码')
          setIsSend(false)
        }
      }, 1000)
      setIsSend(true)
    } else {
      if (!formData.mobile) {
        Taro.showToast({
          title: '请先输入手机号',
          icon: 'none'
        })
      }
    }
  }


  const onChange = (key: string | number, value: any) => {
    const form = Object.assign({}, formData, { [key]: value })
    setFormData(form)
  }

  const onSubmit = async () => {
    const result = await onValidateData(FormRules, formData)
    if (result) {
      setModalVisible(true)

    }
  }


  const onComfirm = async () => {
    await api2420(formData)
    setTimeout(() => {
      Taro.showToast({ title: '认证成功' })
    }, 10);
    Taro.navigateBack()
  }

  const content = useMemo(() => <div className='Certify-box'>
    {
      options.map((item, index) => {
        return <p className='Certify-box-item' key={index}><span className='Certify-box-item-label'>{item.label}:</span><span className='Certify-box-item-value'>{formData[item.name]}</span></p>
      })
    }

  </div>, [formData])


  return (
    <div className='Certify' >
      <BwModal
        cancelText='修改'
        content={content}
        confirmText='保存提交'
        title='认证信息确认'
        type='confirm'
        onConfirm={onComfirm}
        onCancel={() => { setModalVisible(false) }}
        onClose={() => { setModalVisible(false) }}
        visible={modalVisible}></BwModal>
      <div className='Certify-content'>
        <AtForm>
          {
            options.map((item, index) => {
              return <AtInput
                key={index}
                name={item.name}
                title={item.title}
                type='text'
                onBlur={validateData.bind(this, FormRules, item.name, formData[item.name])}
                placeholder={item.placeholder}
                value={formData[item.name]}
                onChange={onChange.bind(this, item.name)}
              />
            })
          }
          <ListItem left={<AtInput
            className='certify-atInput'
            name='mtCode'
            title='验证码'
            type='text'
            onBlur={validateData.bind(this, FormRules, 'mtCode', formData.mtCode)}
            placeholder='请输入验证码'
            value={formData.mtCode}
            onChange={onChange.bind(this, 'mtCode')}
          />} icon={<span className='certify-code' onClick={getVerificationCode} style={{ color: !isSend ? '#AA1612' : '#999999' }}>{spanName}</span>}></ListItem>
        </AtForm>
      </div>
      <div className='Certify-btn' onClick={onSubmit}>
        <AtButton type='primary'>提交</AtButton>
      </div>
      <div className='Certify-tipsBox'>
        <p className='Certify-tipsBox-title'>实名认证说明：</p>
        <p className='Certify-tipsBox-tips'>1.请确保输入的姓名和身份证号为本人真实信息</p>
        <p className='Certify-tipsBox-tips'>2.请确保银行卡信息不错填、不漏填；</p>
        <p className='Certify-tipsBox-tips'>3.博物有道承诺以上信息仅限用户的资金托管、提现及认证使用。</p>
        <p className='Certify-tipsBox-tips'>4.开户行是指办理开户手续的营业网点；</p>

      </div>
    </div >
  )
}

export default Certify
