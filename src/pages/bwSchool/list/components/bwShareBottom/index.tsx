import { Button } from '@tarojs/components';
import Taro from "@tarojs/taro";
import { useState, useCallback, } from "react";
import * as images from "@/constants/images";
import './index.scss'
import classNames from 'classnames';
import { isAppWebview,DEVICE_NAME } from "@/constants";

function ShareBottom(props) {
  const { onClose, visible, shareData } = props
  console.log(props, 'props');
  
  const env = process.env.TARO_ENV


  const [showMask, setShowMask] = useState<Boolean>(false)
  const operationList = [
    {
      label: '微信好友',
      img: images.weixin,
      dev: 'all',
      type: 1
    },
    {
      label: '朋友圈',
      img: images.pengyouquan,
      dev: 'h5',
      type: 2
    },
    {
      label: '复制链接',
      img: images.lianjie,
      dev: 'all',
      type: 3
    },
    // {
    //   label: '下载图片',
    //   img: images.download,
    //   dev: 'weapp',
    //   type: 4
    // }
  ]
  const handleClick = (type) => {    
   console.log(type, 'type');
   
    switch (type) {
      case 1:
        if (DEVICE_NAME === 'wxh5') {
          setShowMask(true)
        }
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'callAppShareToFriend',
            JSON.stringify(shareData),
            res => {
              const { code, data } = JSON.parse(res)
              if (code === 0) {
                onClose()
              } else {
                onClose()
                Taro.showToast({ icon: 'none', title: '分享失败' })
              }
            }
          )
        }
        break;
      case 2:
        if (DEVICE_NAME === 'wxh5') {
          setShowMask(true)
        }
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'callAppShareToTimeline',
            JSON.stringify(shareData),
            res => {
              const { code, data } = JSON.parse(res)
              if (code === 0) {
                onClose()
              } else {
                onClose()
                Taro.showToast({ icon: 'none', title: '分享失败' })
              }
            }
          )
        }
        break;
      case 3:
          Taro.setClipboardData({
            data: shareData.link || '',
            success: function (res) {
              Taro.showToast({
                title: '复制成功',
                icon: 'none'
              })
            }
          })
        break;
      default:
        break;
    }
  }
  const handleClose = () => {
    onClose()
  }


  const rootClass = classNames(
    'CanvasPhoto',
    {
      'CanvasPhoto--active': visible
    }
  )
  const MaskShare = () => {
    return (
      <div className='shareDemo' onClick={() => { setShowMask(false); onClose() }}>
        <img className='p1' src={images.POINT} alt="" />
        <img className='p2' src={images.SHARE} alt="" />
      </div>
    )
  }
  return <div className={rootClass}>
    {
      showMask ? <MaskShare /> : null
    }
    <div className='CanvasPhoto-bottom'>

      {/* <p className='CanvasPhoto-bottom-tips'>长按上方图片，保存或发送给好友</p> */}
      <div className='CanvasPhoto-bottom-operation bwList-bottom-CanvasPhoto-bottom-operation'>
      {
            operationList.map((item, index) => {
              return item.dev === 'all' || item.dev === env ? <div key={index} onClick={handleClick.bind(this, item.type)} className='CanvasPhoto-bottom-operation-item'>
                <div className='CanvasPhoto-bottom-operation-item-img'>
                  <img src={item.img} alt="" />
                </div>
                {process.env.TARO_ENV === 'weapp' && index < 1 && <Button openType='share' className='CanvasPhoto-bottom-operation-item-btn'></Button>}
                <p>{item.label}</p>
              </div> : null
            })
          }
      </div>
      <div className='bw-CanvasPhoto-bottom-cancel' onClick={handleClose}>
        取消
      </div>
    </div>

  </div >
}


export default ShareBottom
