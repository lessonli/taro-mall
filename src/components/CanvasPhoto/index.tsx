import { Button, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro'
import { useReady } from '@tarojs/taro';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as images from "@/constants/images";
import poster from '@/assets/img/poster.png'
import jp from '@/assets/img/jp.png'
import poster2 from '@/assets/img/poster2.png'
import open from '@/assets/img/open.png'
import './index.scss'
import classNames from 'classnames';
import { IResapi2524 } from '@/apis/21/api2524';
import { IResapi2612 } from '@/apis/21/api2612';
import { IResapi2906 } from '@/apis/21/api2906';
import { getUserInfo } from '@/utils/cachedService'
import dayjs from 'dayjs';
import { getHostProxyImg, fen2yuan, loginCertify } from '@/utils/base';
import api2100, { IResapi2100 } from '@/apis/21/api2100';
import { host } from '@/service/http';
import { DEVICE_NAME, isAppWebview, MINI_PROGRAM_TYPE } from '@/constants';
import Bottom from './components/Bottom';
import { IResapi4542 } from '@/apis/21/api4542';
import { autoAddImageHost } from '../PreImage/transformImageSrc';

export type IDetail1 = Required<IResapi4542["data"]>
export type IStoreInfo = Required<IResapi2612>['data']
export type IDetail = Required<IResapi2612>['data']
export type IAuctionInfo = Required<IResapi2906>['data']
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
  storeInfo?: any,
  goodsDetail?: IDetail,
  onClose?: any,
  visible?: boolean | undefined,
  type?: string | undefined,
  shareImg?: string | undefined
  shareLink?: string | undefined
  auction?: IAuctionInfo
  userInfo?: any
  shareData?: IshareData | undefined
  headImg?: string //头图
  showBottom?: Boolean | undefined // 是否展示bottom
  init?: any
  operationType?: string[] | ['friend' | 'friendLine' | 'copy' | 'saveImg']
  size?: {
    width: number
    height: number
  }
}
const CanvasPhoto = function (props: IProps) {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const { operationType, onClose, visible, storeInfo, goodsDetail, type, shareImg, auction, shareLink, shareData, headImg, showBottom = true, init, size = { width: 522, height: 774 } } = props
  const [imgUrl, setImgUrl] = useState<string>('')
  const [showPoint, setShowPoint] = useState<boolean>(false)
  const [showCanvas, setShowCanvas] = useState<boolean>(false)
  const env = process.env.TARO_ENV
  const [rpx, setRpx] = useState(1)
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
    {
      label: '下载图片',
      img: images.download,
      dev: 'weapp',
      type: 4
    }
  ]
  const handleClick = (type) => {
    console.log(shareData, 'shareData');

    switch (type) {
      case 1:
        if (DEVICE_NAME === 'wxh5') {
          setShowPoint(true)
        }

        if (isAppWebview) {
          if (
            page.router?.path.indexOf('live') > -1 ||
            page.router?.path.indexOf('active/redPacket/detail') > -1 ||
            page.router?.path.indexOf('pages/active/openRedPacket/index') > -1
          ) {
            WebViewJavascriptBridge.callHandler(
              'callWeAppShareToFriend',
              JSON.stringify({
                userName: shareData?.userName,
                path: shareData?.shareUrl.replace(host, ''),
                hdImageData: autoAddImageHost(shareData?.posterImg),
                withShareTicket: true,
                miniprogramType: API_ENV === 'prod' ? MINI_PROGRAM_TYPE.WXMiniProgramTypeRelease : MINI_PROGRAM_TYPE.WXMiniProgramTypePreview,
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
      default:
        break;
    }
  }
  const handleClose = () => {
    Taro.hideLoading()
    onClose()
  }
  const initCanvas = function () {

    // console.log(this);
    Taro.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      }).exec(async (res) => {
        const userInfo = await getUserInfo()
        const width = res && res[0]?.width
        const height = res && res[0]?.height
        const ctx = await Taro.createCanvasContext('canvas', this)
        init({ ctx, userInfo, rpx, ...props, width, height }).then((res: any) => {
          setImgUrl(res)
          Taro.hideLoading()
          setShowCanvas(true)
        })
      })
  }


  const downloadImg = (index) => {
    if (index.belong === 'saveImg') {
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
    }
  }

  useLayoutEffect(() => {
    getUserInfo().then(res => {
      Taro.showLoading({ title: '生成海报中', mask: false })
      Taro.getSystemInfo({
        success: function (res) {
          const rpx = res.windowWidth / 375
          setRpx(rpx)
        }
      })
      Taro.nextTick(() => {
        if (env === 'h5') {
          var c: any = document.getElementById("#canvas");
          const width = c?.width
          const height = c?.height
          var ctx = c?.getContext("2d");
          // ctx.clearRect(0, 0, width, height)//清空画布
          (async () => {
            const userInfo = await getUserInfo()
            init({ c, ctx, userInfo, rpx, ...props, width, height }).then((res: any) => {
              setImgUrl(res)
              Taro.hideLoading()
              setShowCanvas(true)
            })
          })()
        } else {
          initCanvas()
          // Taro.nextTick(()=>{
          //   initCanvas()
          // })

        }
      })
    }).catch(err => {
      if (err.code === 1000) {
        loginCertify()
      } else if (err.code === 1010) {
        loginCertify.call(this, 1)
      }
    })


  }, [])
  const rootClass = classNames(
    'CanvasPhoto',
    {
      'CanvasPhoto--active': visible
    }
  )

  const ShareDemo = () => {
    return (
      <div className='shareDemo' onClick={setShowPoint.bind(this, false)}>
        <img className='p1' src={images.POINT} alt="" />
        <img className='p2' src={images.SHARE} alt="" />
      </div>
    )
  }


  return (
    <div className={rootClass}>
      {
        showPoint ? <ShareDemo /> : null
      }

      <div className={`${process.env.TARO_ENV === 'weapp' ? 'CanvasPhoto-content-weapp CanvasPhoto-content' : 'CanvasPhoto-content'} ${type === 'pullNew' ? 'CanvasPhoto-pullNewContetn' : ''}`} >
        <div style={{ width: (size?.width / 2) + 'px', height: (size?.height / 2) + 'px' }} className={showCanvas && process.env.TARO_ENV === 'h5' ? 'box boxShadow' : 'box'}>
          {
            imgUrl ? <img className='h5Poster boxShadow' src={imgUrl} alt="" /> : process.env.TARO_ENV === 'weapp' ? <Canvas type="" style={{ width: (size?.width / 2) + 'px', height: (size?.height / 2) + 'px' }} className={showCanvas ? 'merchant-canvas boxShadow' : 'merchant-canvas hide'} canvasId="canvas" id='canvas'> </Canvas> : <canvas className={showCanvas ? '' : 'hide'} width={size?.width * 2} height={size?.height * 2} style={{ width: '100%', height: '100%' }} id='#canvas'></canvas>
          }
        </div>
      </div>
      {showBottom && <Bottom type={type} handleClick={handleClick} downloadImg={downloadImg} handleClose={handleClose} operationType={operationType}></Bottom>}


    </div >
  )
}

export default CanvasPhoto
