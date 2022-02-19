import { bdSucess } from '@/constants/images'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { AtButton } from 'taro-ui'

import { useAsync } from '@/utils/hooks'
import './index.scss'
export interface Iprops {
  type?: 'confirm' | 'alert' | 'none' | undefined;
  title?: string | undefined;
  content?: JSX.Element | undefined;
  confirmText?: string | undefined;
  alertText?: string | React.ReactNode | undefined;
  cancelText?: string | undefined;
  closeOnClickOverlay?: boolean | undefined;
  visible: boolean;
  onClose?: (() => void) | undefined
  onCancel?: (() => void) | undefined
  onConfirm?: (() => void | Promise<any>)
  showImg?: true | false

}
const BwModal = (props: Iprops) => {
  const defaultMethods = () => { }
  const { alertText = '知道了', type = 'confirm', title, content, confirmText = '确定', cancelText, closeOnClickOverlay, visible, onClose = defaultMethods, onCancel = defaultMethods, onConfirm = defaultMethods, showImg } = props
  const handleClose = () => {
    onClose()
  }
  const handleCancel = () => {
    onCancel()
  }

  const { run: handleSubmit, pending } = useAsync(async () => {
    await promiseOnConfirm()
  }, { manual: true })

  console.log(pending, 'pending');



  const prentDefault = (e) => {
    e.stopPropagation()
  }
  const rootClass = classNames(
    'Bw-Modal',
    {
      'Bw-Modal--active': visible
    }
  )
  const boxClass = classNames(
    'Bw-Modal-box',
    {
      'Bw-Modal-alert': type === 'alert'
    },
    {
      'Bw-Modal-show': visible
    }
  )
  const promiseOnConfirm = () => {
    const res = onConfirm()
    if (typeof res === 'object' && res.then) {
      return res
    }
    return Promise.resolve(undefined)

  }
  return (
    <div className={rootClass} onClick={closeOnClickOverlay ? handleClose : () => { }}>
      <div className={boxClass} onClick={prentDefault}>
        {showImg && <img className='BW-Modal-box-img' src={bdSucess} alt="" />}
        <i className='myIcon Bw-Modal-box-close' onClick={handleClose}>&#xe73b;</i>
        <div className='Bw-Modal-box-title'>
          {title}
        </div>
        <div className='Bw-Modal-box-content'>
          <div>{content}</div>
        </div>
        {
          type === 'confirm' ? <div className='Bw-Modal-box-btn'>
            {
              cancelText ? <div className='cancel' onClick={handleCancel}>
                <AtButton>{cancelText || '取消'}</AtButton>
              </div> : null
            }
            <div className={cancelText ? 'submit-both' : 'submit-alone'} onClick={pending ? () => { } : handleSubmit} >
              <AtButton className='Bw-Modal-confirm-btn' type='primary'>{confirmText}</AtButton>
            </div>
          </div>
            : type === 'none' ? '' : <div className='Bw-Modal-box-alert' onClick={handleClose}>
              {alertText}
            </div>
        }

      </div>
    </div>
  )
}

export default BwModal
