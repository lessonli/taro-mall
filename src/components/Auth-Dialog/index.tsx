import Taro from '@tarojs/taro'
import * as images from "@/constants/images";

import './index.scss'

const AuthDialog = () => {
  return (
    <div className='AuthDialog'>
      <div className='AuthDialog-box'>
        <img className='AuthDialog-box-img' src={images.AUTH} alt="" />
        <div className='AuthDialog-box-btn'>立即认证</div>
      </div>
    </div>
  )
}

export default AuthDialog
