import {Button, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro'
import { useReady } from '@tarojs/taro';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import * as images from "@/constants/images";

import './index.scss'
import classNames from 'classnames';
import { isAppWebview, DEVICE_NAME } from '@/constants';
import { getUserInfo } from '@/utils/cachedService'
import { host } from '@/service/http';
import { getHostProxyImg } from '@/utils/base';



interface IshareData {
  title?: string,
  desc?: string,
  link?: string,
  imgUrl?: string
}

interface IProps {
  shareData?: IshareData,
  onClose?: any,
  visible?: boolean | undefined,
  type?: string | undefined,
  shareImg?: string | undefined //二维码
  shareLink?: string | undefined
  userInfo?: any,
  headImg?: string //头图
}
const ActiveCanvasPhoto = function (props: IProps) {
  console.log(props, 'props');
  
  const { onClose, visible, shareImg, shareLink, headImg, shareData } = props
  const [imgUrl, setImgUrl] = useState<string>('')
  const [showPoint, setShowPoint] = useState<boolean>(false)
  const env = process.env.TARO_ENV
  const [showCanvas, setShowCanvas] = useState<boolean>(false)
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
    switch (type) {
      case 1:
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'callAppShareToFriend',
            JSON.stringify(shareData),
            res => {
              const { code, data } = JSON.parse(res)
              if (code === 0) {
                Taro.hideLoading()
                onClose()
              } else {
                Taro.hideLoading()
                onClose()
                Taro.showToast({ icon: 'none', title: '分享失败' })
              }
            }
          )
        }
        if (DEVICE_NAME === 'wxh5') {
          setShowPoint(true)
        }
        break;
      case 2:              
        if (isAppWebview) {
          WebViewJavascriptBridge.callHandler(
            'callAppShareToTimeline',
            JSON.stringify(shareData),
            res => {
              const { code, data } = JSON.parse(res)
              if (code === 0) {
                Taro.hideLoading()
                onClose()
              } else {
                Taro.hideLoading()
                onClose()
                Taro.showToast({ icon: 'none', title: '分享失败' })
              }
            }
          )
        }
        if (DEVICE_NAME === 'wxh5') {            
          setShowPoint(true)
        }
        break;
      case 3:
        Taro.setClipboardData({
          data: shareLink || '',
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
    Taro.hideLoading()
    onClose()
  }

  const initCanvas = ()=>{
    Taro.createSelectorQuery()
    .select('#canvas')
    .fields({
      node: true,
      size: true,
    }).exec(async (res) => {
      const userInfo = await getUserInfo()
      const width = res[0].width
      const height = res[0].height
      const ctx = await Taro.createCanvasContext('canvas', this)
      addImage1(headImg).then((img1:string) => {
        console.log('cll', headImg, 'headImg');
        
        drawRoundRect(ctx, 0, 0, 0, 522, 632, img1)
        // https://dev.bowuyoudao.com/proxy-image/https://tsla.bowuyoudao.com/weapp/img/active_bottom.png
        addImage1(images.active_bottom).then((img2:string) => {          
          drawRoundRect(ctx, 0, 0, 632, 522, 143, img2)
          drawText(ctx, `${userInfo.nickName}`, 85, 670, '11px Microsoft YaHei', '#8B572A', 'middle', 'left')
          drawText(ctx, `分享给你`, 85, 699, '11px Microsoft YaHei', '#AF8968', 'middle', 'left')
          addImage1(shareImg).then((img3:string) => {
            drawRoundRect(ctx, 0, 426, 650, 80, 80, img3)
            addImage1(userInfo.headImg).then((img4:string) => {
              circleImg(ctx, img4, 24, 659, 27)
              setShowCanvas(true)
              ctx.draw(true,()=>{
                Taro.canvasToTempFilePath({
                  canvasId:'canvas',
                  success:(res)=>{
                    setImgUrl(res.tempFilePath)
                    Taro.hideLoading()
                    setShowCanvas(true)
                  },
                  fail:(err=>{
                    Taro.showToast({title:'加载失败请重试', icon: 'none'})
                    console.log(err, 'err');
                    
                  })
                })
              })
            })
          })
          setShowCanvas(true)
        })
      })

  })
       
      
  }




  const addImage = (src) => {
    console.log(src, 'src');
    
    // 本地下载图片
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'weapp') {
        Taro.downloadFile({
          src: src,
          success: (img) => {
            resolve(img)
          }
        })
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
          resolve(img);
        };
        img.onerror = () => {
          reject();
        };

        if (img.complete) {
          resolve(img);
        }
      }
    });
  }

  const addImage1 = (src) => {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'weapp') {
        Taro.downloadFile({
          url: getHostProxyImg(src),
          success: (img) => {
            resolve(img.tempFilePath)
          }
        })
      } else {
        const img = new Image();
        console.log(img, 'img')
        img.crossOrigin = "anonymous";
        // img.src = `${host}/image-proxy?url=${src}&x-oss-process=image/resize,p_50`;
        img.src = getHostProxyImg(src)
        img.onload = () => {
          resolve(img);
        };
        img.onerror = (err) => {
          console.log(err, 'err');
          reject();
        };

        if (img.complete) {
          resolve(img);
        }
      }
    });
  }

  const draw2Line = (ctx, t, x, y, w) => {

    var chr = t.split("");
    var temp = "";
    var row = [];

    // ctx.font = "20px Arial";
    // ctx.fillStyle = "black";
    // ctx.textBaseline = "middle";

    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < w) {
        ;
      }
      else {
        row.push(temp);
        temp = "";
      }
      temp += chr[a];
    }

    row.push(temp);

    for (var b = 0; b < row.length; b++) {
      if (process.env.TARO_ENV === 'h5') {
        if (b <= 1) {
          drawText(ctx, row[b], x, y + (b + 1) * 66, '48px Microsoft YaHei', '#8B572A', 'middle', 'left')
        } else if (b < 3) {
          drawText(ctx, '...', x, y + (b + 1) * 66, '48px Microsoft YaHei', '#8B572A', 'middle', 'left')
        }
      } else {
        if (b <= 1) {
          drawText(ctx, row[b], x, y + (b + 1) * 33, '12px Microsoft YaHei', '#8B572A', 'middle', 'left')
        } else if (b < 3) {
          drawText(ctx, '...', x, y + (b + 1) * 33, '12px Microsoft YaHei', '#8B572A', 'middle', 'left')
        }
      }
      // ctx.fillText(row[b], x, y + (b + 1) * 20);
    }
  }



  // 绘制图片
  const drawRoundRect = (ctx, r, x, y, w, h, img) => {
    if (process.env.TARO_ENV === 'h5') {
      ctx.save();
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, w, h)
      ctx.restore(); // 返回上一状态
    } else {
      ctx.drawImage(img, x / 2, y / 2, w / 2, h / 2);
    }
  }


  // 圆形图片
  const circleImg = (ctx, img, x, y, r) => {
    if (process.env.TARO_ENV === 'h5') {
      ctx.save();
      var d = 2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, x, y, d, d)
      ctx.restore();
    } else {
      var d = 2 * r;
      var cx = x + r;
      var cy = y + r;
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx / 2, cy / 2, r / 2, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(img, x / 2, y / 2, d / 2, d / 2)
      ctx.restore()
    }
  }

  // 绘制文字
  const drawText = useCallback((ctx, value, left, top, font?, fillStyle?, textBaseline?, textAlign?, lineHeight?) => {
    if (process.env.TARO_ENV === 'h5') {
      ctx.font = font;
      ctx.fillStyle = fillStyle
      ctx.textBaseline = textBaseline
      ctx.textAlign = textAlign
      ctx.fontWeight = 500;
      ctx.lineHeight = lineHeight;
      ctx.fillText(value, left, top);
    } else {
      font && (ctx.font = font)
      fillStyle && ctx.setFillStyle(fillStyle)
      textBaseline && ctx.setTextBaseline(textBaseline)
      textAlign && ctx.setTextAlign(textAlign)
      ctx.fillText(String(value), left / 2, top / 2);
    }

    // ctx.globalCompositeOperation = 'destination-over'
  }, [])
  // 小程序 下载图片
  const downloadImg = (index) => {
    if (index === 3) {
      Taro.saveImageToPhotosAlbum({
        filePath: imgUrl,
        success: function (res) {
          console.log(res)
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  }



  useLayoutEffect(() => {
    Taro.showLoading({ title: '生成海报中', mask: false })
    Taro.nextTick(() => {
      if (env === 'h5') {
        var c: any = document.getElementById("#canvas");
        const width = c?.width
        const height = c?.height

        var ctx = c?.getContext("2d");
        // ctx.clearRect(0, 0, width, height)//清空画布
        (async () => {
          const userInfo = await getUserInfo()
          addImage1(headImg).then(img => {
            ctx.drawImage(img, 0, 0, width, 1264)
            addImage1(images.active_bottom).then(img => {
              ctx.drawImage(img, 0, 1264, width, 286)
              drawText(ctx, `${userInfo.nickName}`, 160, 1328, '44px Microsoft YaHei', '#8B572A', 'middle', 'left')
              drawText(ctx, `分享给你`, 160, 1378, '40px Microsoft YaHei', '#AF8968', 'middle', 'left')
              addImage1(shareImg).then(img => {
                drawRoundRect(ctx, 0, 860, 1314, 130, 130, img)
                addImage1(userInfo.headImg).then(img => {
                  circleImg(ctx, img, 48, 1310, 48)
                  var resultImg = c.toDataURL("image/png"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
                  setImgUrl(resultImg)
                  Taro.hideLoading()
                  setShowCanvas(true)
                })
              })
            })
          })
        })()
      } else {
        
        console.log('init')
        
        initCanvas()
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

      <div className={process.env.TARO_ENV === 'weapp' ? 'CanvasPhoto-content-weapp CanvasPhoto-content' : 'CanvasPhoto-content'}>
        {/* 活动 */}
        <div className={showCanvas ? 'commodityBox1 boxShadow' : 'commodityBox1'}>
          
           {
            imgUrl ? <img className='h5Poster' src={imgUrl} alt="" /> : process.env.TARO_ENV === 'weapp' ? <Canvas type="" style={{ width: (522 / 2) + 'px', height: (775 / 2) + 'px' }} className={showCanvas ? 'commodity-canvas boxShadow' : 'commodity-canvas hide'} canvasId="canvas" id='canvas'> </Canvas> : <canvas className={showCanvas ? '' : 'hide'} width='1044' height='1550' style={{ width: '100%', height: '100%' }} id='#canvas'></canvas>
          }
        </div>
      </div>
      <div className='CanvasPhoto-bottom'>
      {process.env.TARO_ENV === 'h5' && <p className='CanvasPhoto-bottom-tips'>长按上方图片，保存或发送给好友</p>}
        <div className='CanvasPhoto-bottom-operation'>
        {
            operationList.map((item, index) => {
              return item.dev === 'all' || item.dev === env ? <div key={index} onClick={handleClick.bind(this, item.type)} className='CanvasPhoto-bottom-operation-item'>
                <div className='CanvasPhoto-bottom-operation-item-img' onClick={() => { downloadImg(index) }}>
                  <img src={item.img} alt="" />
                </div>
                {process.env.TARO_ENV === 'weapp' && index < 1 && <Button openType='share' className='CanvasPhoto-bottom-operation-item-btn'></Button>}
                <p>{item.label}</p>
              </div> : null
            })
          }
        </div>
        <div className='CanvasPhoto-bottom-cancel' onClick={handleClose}>
          取消
        </div>
      </div>

    </div >
  )
}

export default ActiveCanvasPhoto
