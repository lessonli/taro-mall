import { Button, Canvas, Image } from '@tarojs/components';
import Taro from '@tarojs/taro'
import { useReady } from '@tarojs/taro';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import * as images from "@/constants/images";
import './index.scss'
import classNames from 'classnames';
import { IResapi2524 } from '@/apis/21/api2524';
import { IResapi2612 } from '@/apis/21/api2612';
import { IResapi2906 } from '@/apis/21/api2906';
import { getUserInfo } from '@/utils/cachedService'
import dayjs from 'dayjs';
import { getHostProxyImg, fen2yuan, loginCertify } from '@/utils/base';
import { IResapi2100 } from '@/apis/21/api2100';
import { host } from '@/service/http';
import { DEVICE_NAME, isAppWebview, MINI_PROGRAM_TYPE } from '@/constants';
import Bottom from './components/Bottom';
import { IResapi4542 } from '@/apis/21/api4542';
import { autoAddImageHost } from '../PreImage/transformImageSrc';
import { creatCanvas, IJson } from '@/utils/poster';

export type IDetail1 = Required<IResapi4542["data"]>
export type IStoreInfo = Required<IResapi2612>['data']
export type IDetail = Required<IResapi2612>['data']
export type IAuctionInfo = Required<IResapi2906>['data']

interface NewProps {
  visible: boolean; // 显示海报
  width: number,
  height: number,
  json?: any;
  operationType?: string[] | ['friend' | 'friendLine' | 'copy' | 'saveImg'];
  shareLink?: string | undefined
  // onVisibleChange: Function; // 
  // preFetch: ()=> Promise<string[]>
  // getPreImg: Function; // 缓存图片

}
interface IshareData {
  title?: string,
  desc?: string,
  link?: string,
  imgUrl?: string
  nickName?: string,
  shareUrl?: string,
  posterImg?: any,
  withShareTicket?: any,
  miniprogramType?: any
}
interface IProps {
  storeInfo?: any,  // 新版不需要传
  goodsDetail?: IDetail, // 新版不需要传
  onClose?: any,
  visible?: boolean | undefined,
  type?: string | undefined, // 新版不需要传
  shareImg?: string | undefined
  shareLink?: string | undefined
  auction?: IAuctionInfo // 新版不需要传
  userInfo?: any
  shareData?: IshareData | undefined
  headImg?: string //头图 
  showBottom?: Boolean | undefined // 是否展示bottom 
  init?: any // 新版不需要传
  operationType?: string[] | ['friend' | 'friendLine' | 'copy' | 'saveImg']
  size?: { // 新版不需要传
    width: number
    height: number
  }
  width: number,
  height: number,
  json?: any;
  /**
   * 开始绘制前的操作
   */
  beforeDraw?: () => Promise<any>;
}


const Poster = function (props: IProps, ref) {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const { operationType, onClose, visible, type, shareLink, shareData, showBottom = true, size = { width: 522, height: 774 } } = props
  const [imgUrl, setImgUrl] = useState<string>('')
  const [showPoint, setShowPoint] = useState<boolean>(false)
  const [showCanvas, setShowCanvas] = useState<boolean>(false)
  const [imgLose, setImgLose] = useState<boolean>(false)
  const env = process.env.TARO_ENV
  const handleClick = (type) => {
    switch (type) {
      case 1:
        if (DEVICE_NAME === 'wxh5') {
          setShowPoint(true)
        }

        if (isAppWebview) {
          if (page.router?.path.indexOf('live') > -1 || page.router?.path.indexOf('active/redPacket/detail') > -1) {
            WebViewJavascriptBridge.callHandler(
              'callWeAppShareToFriend',
              JSON.stringify({
                userName: shareData?.userName,
                path: shareData?.shareUrl.replace(host, ''),
                hdImageData: autoAddImageHost(shareData?.posterImg),
                withShareTicket: true,
                miniprogramType: process.env.NODE_ENV === 'production' ? MINI_PROGRAM_TYPE.WXMiniProgramTypeRelease : MINI_PROGRAM_TYPE.WXMiniProgramTypePreview,
                // 配置体验版小程序时 打开
                // miniprogramType:MINI_PROGRAM_TYPE.WXMiniProgramTypePreview,
                title: shareData?.title,
                description: shareData?.desc
              })
            )
          } else {
            WebViewJavascriptBridge.callHandler(
              'callAppShareToFriend',
              JSON.stringify(shareData)
            )
          }
        }

        break;
      case 2:
        if (DEVICE_NAME === 'wxh5') {
          setShowPoint(true)
        }
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'callAppShareToTimeline',
            JSON.stringify(shareData)
          )
        }
        break;
      case 3:
        // if (env === 'h5') {
        Taro.setClipboardData({
          data: shareLink || '',
          success: function (res) {
            Taro.showToast({
              title: '复制成功',
              icon: 'none'
            })
          }
        })
        // }
        break;
      case 4:
        Taro.saveImageToPhotosAlbum({
          filePath: imgUrl,
          success: function (res) {
            console.log(res)
            Taro.showToast({
              title: '保存图片成功',
              icon: 'none'
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
        break
      default:
        break;
    }
  }

  useImperativeHandle(ref, () => ({

    /**
     * 
     * @param json 海报config配置json
     * @returns 
     */

    startDraw: (json: IJson) => canvasInit(json),

  }));

  const handleClose = () => {
    if (!imgUrl) {
      setImgLose(true)
    }
    Taro.hideLoading()
    onClose()
  }

  const rpx = useMemo(() => {
    Taro.getSystemInfo({
      success: function (res) {
        const rpx = res.windowWidth / 375
        return rpx
      }
    })
  }, [])


  const canvasInit = (json?: IJson) => {
    if (env === 'h5') {
      var c: any = document.getElementById("#canvas");
      const width = c?.width
      const height = c?.height
      var ctx = c?.getContext("2d");
      // ctx.clearRect(0, 0, width, height)//清空画布
      (async () => {
        creatCanvas(ctx, rpx, json || props.json, width, height, c).then(res => {
          setImgUrl(res)
          Taro.hideLoading()
          setShowCanvas(true)
          setImgLose(false)
        })
      })()
    } else {
      Taro.createSelectorQuery()
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        }).exec(async (res) => {
          const width = res && res[0]?.width
          const height = res && res[0]?.height
          const ctx = await Taro.createCanvasContext('canvas', this)
          creatCanvas(ctx, rpx, json || props.json, width, height).then(res => {
            setImgUrl(res)
            Taro.hideLoading()
            setShowCanvas(true)
            setImgLose(false)
          })
        })

    }
  }

  const closeCanvas = () => {
    onClose()
  }

  useLayoutEffect(() => {

  }, [])

  useEffect(() => {
    // if (imgLose && visible) {
    //   canvasInit()
    // }
    visible && Taro.showLoading({
      title: '海报生成中'
    })
  }, [visible])

  const rootClass = classNames(
    'CanvasPhoto',
    {
      'CanvasPhoto--active': visible
    }
  )

  const ShareDemo = useMemo(() => () => {
    return (
      <div className='shareDemo' onClick={setShowPoint.bind(this, false)}>
        <img className='p1' src={images.POINT} alt="" />
        <img className='p2' src={images.SHARE} alt="" />
      </div>
    )
  }, [])

  return (
    <div className={rootClass} onClick={closeCanvas}>

      {
        showPoint ? <ShareDemo /> : null
      }
      <div className={`${process.env.TARO_ENV === 'weapp' ? 'CanvasPhoto-content-weapp CanvasPhoto-content' : 'CanvasPhoto-content'}`} >
        <div style={{ width: (props.width / 2) + 'px', height: (props.height / 2) + 'px' }} className={showCanvas && process.env.TARO_ENV === 'h5' ? 'box boxShadow' : 'box'}>
          {
            imgUrl ? visible && <Image onClick={(e) => { e.stopPropagation() }} className='h5Poster boxShadow' src={imgUrl} alt="" /> : process.env.TARO_ENV === 'weapp' ? <Canvas type="" style={{ width: (props.width / 2) + 'px', height: (props.height / 2) + 'px' }} className={showCanvas ? 'merchant-canvas boxShadow' : 'merchant-canvas hide'} canvasId="canvas" id='canvas'> </Canvas> : <canvas className={showCanvas ? '' : 'hide'} width={props.width * 2} height={props.height * 2} style={{ width: '100%', height: '100%' }} id='#canvas'></canvas>
          }
        </div>
      </div>
      {showBottom && <Bottom type={type} handleClick={handleClick} handleClose={handleClose} operationType={operationType}></Bottom>}
    </div >
  )
}

export default forwardRef(Poster)
