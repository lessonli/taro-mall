import { getUserInfo } from '@/utils/cachedService'
import { addImage1, circleImg, draw2Line, drawRoundRect, drawText } from '@/utils/canvas'
import Taro from '@tarojs/taro'
import * as images from "@/constants/images";
import '../index.scss'
import { fen2yuan } from '@/utils/base';
import dayjs from 'dayjs';
import { env } from 'config/dev';
import { autoAddImageHost } from '@/components/PreImage/transformImageSrc';
import { ossUrl } from '@/components/Upload/oss';

const getUserAvatar = (avatar: string) => {
  if (avatar.indexOf(ossUrl) > -1) {
    return `${avatar}${avatar.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,w_80,m_lfit`
  }
  return avatar
}

export const initMerchant = (props) => {
  // 店铺海报
  const { ctx, userInfo, storeInfo, rpx, shareImg, width, height, c } = props
  if (process.env.TARO_ENV === 'h5') {
    return new Promise((resolve) => {
      // h5 店铺
      addImage1(images.POSTER).then(img => {
        ctx.drawImage(img, 0, 0, width, height)
        addImage1(storeInfo?.shopLogo).then(img2 => {
          ctx.drawImage(img2, 426, 186, 186, 186)
          ctx.beginPath();
          ctx.fontWeight = 600;
          drawText(1, ctx, storeInfo?.shopName, width / 2, 440, '48px Microsoft YaHei', '#000', 'middle', 'center')
          ctx.fontWeight = 500;
          drawText(1, ctx, storeInfo?.productNum, 154, 590, '56px Microsoft YaHei', '#333', 'middle', 'center')
          ctx.fontWeight = 500;
          drawText(1, ctx, fen2yuan(storeInfo?.marginShopAmount), 518, 590, '56px Microsoft YaHei', '#333', 'middle', 'center')
          ctx.fontWeight = 500;
          drawText(1, ctx, storeInfo?.fansNum, 878, 590, '56px Microsoft YaHei', '#333', 'middle', 'center')
          // ctx.drawImage(img2, 48, 1404, 96, 96)
          ctx.fontWeight = 500;
          drawText(1, ctx, userInfo?.nickName, 160, 1452, '48px Microsoft YaHei', '#666', 'middle', 'left')
          addImage1(userInfo.headImg).then(img => {
            circleImg(ctx, img, 48, 1404, 48)
            addImage1(shareImg).then(img3 => {
              drawRoundRect(ctx, 0, 266, 760, 504, 504, img3, 1)
              var resultImg = c.toDataURL("image/jpeg"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
              resolve(resultImg)
            })
          })
        })

      })
    })
  } else {
    return new Promise((resolve) => {
      addImage1(images.POSTER).then(img1 => {
        drawRoundRect(ctx, 0, 0, 0, 520, 878, img1, rpx)
        addImage1(storeInfo?.shopLogo).then(img2 => {
          drawRoundRect(ctx, 0, 213, 93, 93, 93, img2, rpx)
          drawText(rpx, ctx, storeInfo?.shopName, 520 / 2, 220, '15px Microsoft YaHei', '#000', 'middle', 'center')
          drawText(rpx, ctx, storeInfo?.productNum, 77, 297, '14px Microsoft YaHei', '#333', 'middle', 'center')
          drawText(rpx, ctx, fen2yuan(storeInfo?.marginShopAmount), 259, 297, '14px Microsoft YaHei', '#333', 'middle', 'center')
          drawText(rpx, ctx, storeInfo?.fansNum, 434, 297, '14px Microsoft YaHei', '#333', 'middle', 'center')
          // ctx.drawImage(img2, 48, 1404, 96, 96)
          drawText(rpx, ctx, userInfo?.nickName, 80, 726, '12px Microsoft YaHei', '#666', 'middle', 'left')
          addImage1(userInfo.headImg).then(img => {
            circleImg(ctx, img, 24, 702, 24)
            addImage1(shareImg).then(img3 => {
              drawRoundRect(ctx, 0, 133, 380, 252, 252, img3, rpx)
              ctx.draw(true, () => {
                Taro.canvasToTempFilePath({
                  canvasId: 'canvas',
                  success: function (res) {
                    resolve(res.tempFilePath)
                  }
                }, this)
              })
            })
          })
        })
      })
    })
  }
}

export const initOpenStore = (props) => {
  //开店海报
  const { ctx, userInfo, rpx, shareImg, width, height, c } = props
  if (process.env.TARO_ENV === 'h5') {
    return new Promise((resolve) => {
      // h5 店铺
      addImage1(images.open).then(img => {
        ctx.drawImage(img, 0, 0, width, height)
        drawText(1, ctx, `${userInfo.nickName}`, 160, 1340, '44px Microsoft YaHei', '#8B572A', 'middle', 'left')
        drawText(1, ctx, `分享给你`, 160, 1402, '40px Microsoft YaHei', '#AF8968', 'middle', 'left')
        addImage1(userInfo.headImg).then(img => {
          circleImg(ctx, img, 48, 1310, 48)
          addImage1(shareImg).then(img2 => {
            drawRoundRect(ctx, 0, 860, 1314, 130, 130, img2, 1)
            var resultImg = c.toDataURL("image/png"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
            resolve(resultImg)
          })
        })

      })
    })
  } else {

    return new Promise((resolve) => {
      addImage1(images.open).then(img3 => {
        drawRoundRect(ctx, 0, 0, 0, width * 2, height * 2, img3, rpx)
        drawText(rpx, ctx, `${userInfo.nickName}`, 80, 670, '11px Microsoft YaHei', '#8B572A', 'middle', 'left')
        drawText(rpx, ctx, `分享给你`, 80, 701, '10px Microsoft YaHei', '#AF8968', 'middle', 'left')
        addImage1(userInfo.headImg).then(img => {
          circleImg(ctx, img, 24, 655, 24)
          addImage1(shareImg).then(img2 => {
            drawRoundRect(ctx, 0, 430, 657, 65, 65, img2, rpx)
            ctx.draw(true, () => {
              Taro.canvasToTempFilePath({
                canvasId: 'canvas',
                success: function (res) {
                  resolve(res.tempFilePath)
                }
              }, this)
            })
          })
        })
      })
    })
  }
}

export const initCommodity = (props) => {
  // 商品海报
  const { c, ctx, userInfo, rpx, shareImg, goodsDetail, auction, width, height } = props

  if (process.env.TARO_ENV === 'h5') {
    return new Promise((resolve) => {
      addImage1(goodsDetail?.icon).then(img2 => {
        drawRoundRect(ctx, 50, 40, 180, 960, 956, img2, 1)
        if (goodsDetail?.productType === 1) {
          ctx.fillStyle = "rgba(170, 22, 18, 1)";
          ctx.fillRect(42, 1038, width - 84, 100);
          drawText(1, ctx, `${dayjs(auction?.endTime).format('MM-DD HH:mm:ss')}结束`, 498, 1085, '48px  Microsoft YaHei', '#fff', 'middle', 'left')
          drawText(1, ctx, `${auction?.status === 0 ? '正在竞拍' : '竞拍结束'}`, 158, 1085, '44px Microsoft YaHei', '#fff', 'middle', 'left')
          addImage1(images.jp).then(img => {
            drawRoundRect(ctx, 0, 90, 1060, 52, 52, img, 1)
          })
        }
        addImage1(images.poster2).then(img => {
          ctx.drawImage(img, 0, 0, width, height)
          drawText(1, ctx, goodsDetail?.productType === 1 ? `当前价 ¥` : '一口价 ¥', 66, 1245, '48px Microsoft YaHei', '#AA1612', 'middle', 'left')
          drawText(1, ctx, `${goodsDetail?.productType === 1 ? fen2yuan(auction?.lastAucPrice) : fen2yuan(goodsDetail?.price)}`, 270, 1236, '80px Microsoft YaHei', '#AA1612', 'middle', 'left')
          // drawText(ctx, `${goodsDetail?.name}`, 66, 1342, '48px Microsoft YaHei', '#8B572A', 'middle', 'left')
          draw2Line(1, ctx, goodsDetail?.name, 66, 1290, 800)
          drawText(1, ctx, `${userInfo.nickName}  分享一个好物`, 186, 96, '44px Microsoft YaHei', '#8B572A', 'middle', 'left')
          // drawText(ctx, `分享一个好物`, 750, 96, '44px Microsoft YaHei', '#AF8968', 'middle', 'left')
          addImage1(userInfo.headImg).then(img => {
            circleImg(ctx, img, 64, 48, 48)
            addImage1(shareImg).then(img2 => {
              drawRoundRect(ctx, 0, 836, 1280, 130, 130, img2, 1)
              var resultImg = c.toDataURL("image/png"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
              resolve(resultImg)
              // Taro.hideLoading()
              // setShowCanvas(true)
            })
          })

        })
      })
    })
  } else {
    return new Promise((resolve) => {
      addImage1(images.poster2).then(img4 => {
        if (goodsDetail?.productType === 1) {
          ctx.setFillStyle('rgba(170, 22, 18, 1)')
          ctx.fillRect(10.5, 259.5, (width - 21), 25);
          drawText(rpx, ctx, `${dayjs(auction?.endTime).format('MM-DD HH:mm:ss')}结束`, 249, 543, '12px  Microsoft YaHei', '#fff', 'middle', 'left')
          drawText(rpx, ctx, `${auction?.status === 0 ? '正在竞拍' : '竞拍结束'}`, 79, 543, '11px Microsoft YaHei', '#fff', 'middle', 'left')
          addImage1(images.jp).then(img3 => {
            // ctx.setFillStyle('red')
            // ctx.fillRect(21, 519, (width - 84) / 2, 50);
            drawRoundRect(ctx, 0, 45, 530, 26, 26, img3, rpx)
          })
        }
        addImage1(goodsDetail?.icon).then(img2 => {
          Taro.getImageInfo({ src: img2 }).then(data => {
            const iconHeight = 480 / data.width * data.height
            if (iconHeight > 480) {
              const iconTop = 90 - (iconHeight - 480) / 2
              drawRoundRect(ctx, 25, 20, iconTop, 480, iconHeight, img2, rpx)
            } else {
              drawRoundRect(ctx, 25, 20, 90, 480, 480, img2, rpx)
            }
            // drawRoundRect(ctx, 25, 20, 90, 480, 480, img2)
            drawRoundRect(ctx, 0, 0, 0, 522, 778, img4, rpx)
            // ctx.drawImage(img4, 0, 0, width, height)
            drawText(rpx, ctx, goodsDetail?.productType === 1 ? `当前价 ¥` : '一口价 ¥', 33, 1245 / 2, '12px Microsoft YaHei', '#AA1612', 'middle', 'left')
            drawText(rpx, ctx, `${goodsDetail?.productType === 1 ? fen2yuan(auction?.lastAucPrice) : fen2yuan(goodsDetail?.price)}`, 135, 618, '20px Microsoft YaHei', '#AA1612', 'middle', 'left')
            // drawText(ctx, `${goodsDetail?.name}`, 66, 1342, '48px Microsoft YaHei', '#8B572A', 'middle', 'left')
            draw2Line(rpx, ctx, goodsDetail?.name, 33, 646, 200)
            drawText(rpx, ctx, `${userInfo?.nickName}  分享一个好物`, 93, 48, '11px Microsoft YaHei', '#8B572A', 'middle', 'left')
            // drawText(ctx, `分享一个好物`, 750, 96, '44px Microsoft YaHei', '#AF8968', 'middle', 'left')
            addImage1(userInfo.headImg).then(img => {
              circleImg(ctx, img, 32, 24, 24)
              addImage1(shareImg).then(img2 => {
                drawRoundRect(ctx, 0, 418, 640, 65, 65, img2, rpx)
                ctx.draw(true, () => {
                  Taro.canvasToTempFilePath({
                    canvasId: 'canvas',
                    destWidth: width * 3,
                    destHeight: height * 3,
                    success: function (res) {
                      resolve(res.tempFilePath)
                    }
                  }, this)
                })
              })
            })
          })

        })
      })
    })
  }
}

export const initRedPacket = (props)=>{
  const { ctx, userInfo, rpx, shareImg, width, height, headImg, c } = props

  if (process.env.TARO_ENV === 'h5'){
    return new Promise((resolve) => {
       addImage1(headImg).then(img => {
        ctx.drawImage(img, 0, 0, width, 1446)
        drawText(1, ctx, `${userInfo.nickName}`, 180, 80, '44px Microsoft YaHei', '#A97343', 'middle', 'left')
        drawText(1, ctx, `分享给你`, 180, 140, '40px Microsoft YaHei', '#A97343', 'middle', 'left')
        addImage1(getUserAvatar(userInfo.headImg)).then((img2:string) => {
          circleImg(ctx, img2, 35, 42, 62)
          addImage1(shareImg).then((img3)=>{

            circleImg(ctx, img3, 355, 795, 165)
            
            var resultImg = c.toDataURL("image/jpeg"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
            resolve(resultImg)
          })
        })
      })
    })
 
  } else {
    return new Promise((resolve) => {
      addImage1(headImg).then((img1: string) => {
        drawRoundRect(ctx, 0, 0, 0, 522, 713, img1, rpx)
        addImage1(shareImg).then((img2: string) => {
          // circleImg(ctx, img2, 172, 343, 87)
          circleImg(ctx, img2, 177, 390, 83)
          drawText(rpx, ctx, `${userInfo.nickName}`, 105, 39, '12px Microsoft YaHei', '#A97343', 'middle', 'left')
          drawText(rpx, ctx, `分享给你`, 105, 69, '12px Microsoft YaHei', '#A97343', 'middle', 'left',)
          addImage1(getUserAvatar(userInfo.headImg)).then((img4: string) => {
            circleImg(ctx, img4, 32, 24, 32)
            ctx.draw(true, () => {
              Taro.canvasToTempFilePath({
                canvasId: 'canvas',
                success: (res) => {
                  resolve(res.tempFilePath)
                },
                fail: (err => {
                  Taro.showToast({ title: '加载失败请重试', icon: 'none' })
  
                })
              })
            })
          })
        })
      })
    })
  }
}

export const initPullNew = (props) => {
  //拉新
  const { ctx, userInfo, rpx, shareImg, width, height, headImg } = props
  return new Promise((resolve) => {
    addImage1(headImg).then((img1: string) => {
      drawRoundRect(ctx, 0, 0, 0, 522, 778, img1, rpx)
      addImage1(shareImg).then((img2: string) => {
        circleImg(ctx, img2, 160, 350, 94)
        drawText(rpx, ctx, `${userInfo.nickName}`, 105, 39, '12px Microsoft YaHei', '#FFEBB4', 'middle', 'left')
        drawText(rpx, ctx, `分享给你`, 105, 69, '12px Microsoft YaHei', '#FFEBB4', 'middle', 'left',)
        addImage1(userInfo.headImg).then((img4: string) => {
          circleImg(ctx, img4, 32, 24, 32)
          ctx.draw(true, () => {
            Taro.canvasToTempFilePath({
              canvasId: 'canvas',
              success: (res) => {
                resolve(res.tempFilePath)
              },
              fail: (err => {
                Taro.showToast({ title: '加载失败请重试', icon: 'none' })

              })
            })
          })
        })
        // })
      })
    })
  })
}

// 极速捡漏 新人专享  高货专区 模板活动 均使用该方法
export const initNewUser = (props) => {

  //新人专享

  const { ctx, userInfo, rpx, shareImg, width, height, headImg, c } = props

  if (process.env.TARO_ENV === 'h5') {
    return new Promise((resolve) => {
      addImage1(headImg).then(img => {
        ctx.drawImage(img, 0, 0, width, 1264)
        addImage1(images.active_bottom).then(img => {
          ctx.drawImage(img, 0, 1264, width, 286)
          drawText(1, ctx, `${userInfo.nickName}`, 160, 1328, '44px Microsoft YaHei', '#8B572A', 'middle', 'left')
          drawText(1, ctx, `分享给你`, 160, 1378, '40px Microsoft YaHei', '#AF8968', 'middle', 'left')
          addImage1(shareImg).then(img => {
            drawRoundRect(ctx, 0, 860, 1314, 130, 130, img, 1)
            addImage1(userInfo.headImg).then(img => {
              circleImg(ctx, img, 48, 1310, 48)
              var resultImg = c.toDataURL("image/png"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
              resolve(resultImg)
            })
          })
        })
      })
    })
  } else {
    return new Promise((resolve) => {
      addImage1(headImg).then((img1: string) => {
        drawRoundRect(ctx, 0, 0, 0, 522, 632, img1, rpx)
        addImage1(images.active_bottom).then((img2: string) => {
          drawRoundRect(ctx, 0, 0, 632, 522, 143, img2, rpx)
          drawText(rpx, ctx, `${userInfo.nickName}`, 85, 670, '11px Microsoft YaHei', '#8B572A', 'middle', 'left')
          drawText(rpx, ctx, `分享给你`, 85, 699, '11px Microsoft YaHei', '#AF8968', 'middle', 'left')
          addImage1(shareImg).then((img3: string) => {
            drawRoundRect(ctx, 0, 426, 650, 80, 80, img3, rpx)
            addImage1(userInfo.headImg).then((img4: string) => {
              circleImg(ctx, img4, 24, 659, 27)
              ctx.draw(true, () => {
                Taro.canvasToTempFilePath({
                  canvasId: 'canvas',
                  success: (res) => {
                    resolve(res.tempFilePath)
                  },
                  fail: (err => {
                    Taro.showToast({ title: '加载失败请重试', icon: 'none' })

                  })
                })
              })
            })
          })
        })
      })
    })
  }
}


export const initLive = (props) => {

  const { ctx, storeInfo, rpx, shareImg, width, height, headImg, c } = props
  if (process.env.TARO_ENV === 'h5') {
    return new Promise((resolve) => {
      addImage1(autoAddImageHost(storeInfo.posterImg || '')).then(img => {
        drawRoundRect(ctx, 0, 0, 0, 522 * 2, 522 * 2, img, rpx)
        ctx.fillStyle = 'rgba(0, 0, 0, .3)'
        ctx.fillRect(0, 0, 522 * 2, 522 * 2);
        addImage1(images.liveBottom).then(img2 => {
          if (storeInfo.status === 2) {
            addImage1(images.live).then(res => {
              drawRoundRect(ctx, 0, 32, 32, 92 * 2, 68, res, rpx)
            })
          } else {
            addImage1(images.yuzhan1).then(res => {
              drawRoundRect(ctx, 0, 32, 32, 92 * 2, 68, res, rpx)
            })
          }
          drawRoundRect(ctx, 0, 0, 522 * 2, 522 * 2, 338 * 2, img2, rpx)
          addImage1(storeInfo.headImg).then(img3 => {

            circleImg(ctx, img3, 16 * 2, 446 * 2, 30 * 2)
            drawText(rpx, ctx, `${storeInfo.roomName}`, 84 * 2, 463 * 2, '48px Microsoft YaHei', '#ffffff', 'middle', 'left')
            drawText(rpx, ctx, `${storeInfo.merchant.fansCount} 粉丝`, 84 * 2, 493 * 2, '32px Microsoft YaHei', '#ffffff', 'middle', 'left')
            drawText(rpx, ctx, storeInfo.title, 24 * 2, 560 * 2, '56px Microsoft YaHei', '#1E1E1E', 'middle', 'left')
            storeInfo.status === 1 && drawText(rpx, ctx, `开播时间${dayjs(storeInfo.startTime).format('MM月DD日 HH:mm')}`, 24 * 2, 602 * 2, '56px Microsoft YaHei', '#C8A881', 'middle', 'left')
            addImage1(shareImg).then(img4 => {
              drawRoundRect(ctx, 0, 52 * 2, 646 * 2, 142 * 2, 142 * 2, img4, rpx)
              var resultImg = c.toDataURL("image/png"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
              resolve(resultImg)
            })
          })
        })
      })
    })
  } else {
    return new Promise((resolve) => {
      addImage1(autoAddImageHost(storeInfo.posterImg || '')).then(img => {
        drawRoundRect(ctx, 0, 0, 0, 522, 522, img, rpx)
        // ctx.rect(0, 0, 522, 261)
        ctx.setFillStyle('rgba(0, 0, 0, .3)')
        ctx.fillRect(0, 0, 261, 261);
        setTimeout(() => {
          ctx.setFillStyle('rgba(0, 0, 0, 1)')
          addImage1(images.liveBottom).then(img2 => {
            if (storeInfo.status === 2) {
              addImage1(images.live).then(res => {
                drawRoundRect(ctx, 0, 16, 16, 92, 34, res, rpx)
              })
            } else {
              addImage1(images.yuzhan1).then(res => {
                drawRoundRect(ctx, 0, 16, 16, 92, 34, res, rpx)
              })
            }
            drawRoundRect(ctx, 0, 0, 522, 522, 338, img2, rpx)
            addImage1(storeInfo.headImg).then(img3 => {

              circleImg(ctx, img3, 16, 446, 30)
              drawText(rpx, ctx, `${storeInfo.roomName}`, 84, 463, '12px Microsoft YaHei', '#ffffff', 'middle', 'left')
              drawText(rpx, ctx, `${storeInfo.merchant.fansCount} 粉丝`, 84, 493, '8px Microsoft YaHei', '#ffffff', 'middle', 'left')
              drawText(rpx, ctx, storeInfo.title, 24, 560, '14px Microsoft YaHei', '#1E1E1E', 'middle', 'left')
              storeInfo.status === 1 && drawText(rpx, ctx, `开播时间${dayjs(storeInfo.startTime).format('MM月DD日 HH:mm')}`, 24, 602, '14px Microsoft YaHei', '#C8A881', 'middle', 'left')
              addImage1(shareImg).then(img4 => {
                drawRoundRect(ctx, 0, 52, 646, 142, 142, img4, rpx)
                addImage1(images.play).then(playImg => {
                  storeInfo.status === 2 && drawRoundRect(ctx, 0, 206, 206, 110, 110, playImg, rpx)
                  ctx.draw(true, () => {
                    Taro.canvasToTempFilePath({
                      canvasId: 'canvas',
                      success: (res) => {
                        resolve(res.tempFilePath)
                      },
                      fail: (err => {
                        Taro.showToast({ title: '加载失败请重试', icon: 'none' })

                      })
                    })
                  })
                })
              })
            })
          })
        }, 10);
      })
    })
  }

}