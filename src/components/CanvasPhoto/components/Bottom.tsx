import Taro from '@tarojs/taro'
import * as images from "@/constants/images";
import './index.scss'
import { Button } from '@tarojs/components';
import { useMemo } from 'react';

const operationList = [
  {
    label: '微信好友',
    img: images.weixin,
    dev: 'all',
    belong: 'friend',
    type: 1
  },
  {
    label: '朋友圈',
    img: images.pengyouquan,
    dev: 'h5',
    belong: 'friendLine',
    type: 2
  },
  {
    label: '复制链接',
    img: images.lianjie,
    dev: 'all',
    belong: 'copy',
    type: 3
  },
  {
    label: '下载图片',
    img: images.download,
    dev: 'weapp',
    belong: 'saveImg',
    type: 4
  }
]

const operationListLive = [
  {
    label: '微信好友',
    img: images.weixin,
    dev: 'all',
    belong: 'friend',
    type: 1
  },
  {
    label: '下载图片',
    img: images.download,
    dev: 'weapp',
    belong: 'saveImg',
    type: 4
  }
]


const Bottom = (props) => {
  const { handleClick, downloadImg, handleClose, type, operationType = ['friend', 'friendLine', 'copy', 'saveImg'] } = props
  const list = useMemo(() => {
    let arr: any[] = []
    operationType.forEach(item => {
      operationList.forEach(val => {
        if (item === val.belong) {
          arr.push(val)
        }
      })
    })
    return arr
  }, [operationType])
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const env = process.env.TARO_ENV
  return (
    <div className='CanvasPhoto-bottom'>
      {process.env.TARO_ENV === 'h5' && <p className='CanvasPhoto-bottom-tips'>长按上方图片，保存或发送给好友</p>}
      {page.router?.path.indexOf('live') > -1 ? <div className='CanvasPhoto-bottom-operation CanvasPhoto-bottom-around'>
        {
          list.map((item, index) => {
            return item.dev === 'all' || item.dev === env ?
              <div key={index} onClick={handleClick.bind(this, item.type)} className='CanvasPhoto-bottom-operation-item'>
                {type === 'pullNew' && item.label === '复制链接' ? '' : <div className='CanvasPhoto-bottom-operation-item-img' onClick={() => { downloadImg(item) }}>

                  <img src={item.img} alt="" />

                </div>}

                {process.env.TARO_ENV === 'weapp' && index < 1 && <Button openType='share' className='CanvasPhoto-bottom-operation-item-btn'></Button>}

                {(type === 'pullNew' && item.label === '复制链接') ? '' : <p>{item.label}</p>}

              </div>
              : null
          })
        }

      </div> : <div className='CanvasPhoto-bottom-operation'>
        {
          list.map((item, index) => {
            return item.dev === 'all' || item.dev === env ?
              <div key={index} onClick={handleClick.bind(this, item.type)} className='CanvasPhoto-bottom-operation-item'>
                {type === 'pullNew' && item.label === '复制链接' ? '' : <div className='CanvasPhoto-bottom-operation-item-img' onClick={() => { downloadImg(item) }}>

                  <img src={item.img} alt="" />

                </div>}

                {process.env.TARO_ENV === 'weapp' && index < 1 && <Button openType='share' className='CanvasPhoto-bottom-operation-item-btn'></Button>}

                {(type === 'pullNew' && item.label === '复制链接') ? '' : <p>{item.label}</p>}

              </div>
              : null
          })
        }

      </div>}
      <div className='CanvasPhoto-bottom-cancel' onClick={handleClose}>
        取消
      </div>
    </div>
  )
}

export default Bottom
