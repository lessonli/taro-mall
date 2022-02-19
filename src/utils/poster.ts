import { useCallback } from "react";
import { getHostProxyImg } from "./base";
import Taro from '@tarojs/taro'
import { IHandleCaptureException, Sentry } from "@/sentry.repoter";
// import { ossUrl } from "@/components/Upload/oss";

const ossUrl = API_ENV === 'prod' ? 'https://image.bowuyoudao.com' : 'http://bwyd-test.oss-cn-hangzhou.aliyuncs.com'

export const getUserAvatar = (avatar: string, width: number) => {
  const ossUrl2 = [
    'https://image.bowuyoudao.com',
    'https://img.bowuyoudao.com',
    'http://bwyd-test.oss-cn-hangzhou.aliyuncs.com',
  ]
  let a = false
  ossUrl2.forEach(u => {
    if (avatar.startsWith(u)) {
      a = true
    }
  })
  if (a) {
    return `${avatar}${avatar.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,w_${width},m_lfit`
  }

  return avatar
}

export const addImage1 = (src, width?: number) => {
  return new Promise((resolve, reject) => {
    if (process.env.TARO_ENV === 'weapp') {
      wx.getStorage({
        key: 'savedFiles',
        success: function (res) {
          if (res.data && res.data[src] && res.data[src].path) {
            console.log(res.data, '走缓存', 111);
            resolve(res.data[src].path)

          } else {
            let realPath = width ? getUserAvatar(src, width) : src
            Taro.downloadFile({
              url: getHostProxyImg(realPath || ''),
              success: (img) => {
                resolve(img.tempFilePath)
              },
              complete: (data) => {
                if (data?.statusCode === 404 || data?.stausCode === 500) {
                  Sentry?.captureMessage(`图片加载失败`)
                  Sentry?.captureException({
                    exceptionName: 'canvas_imgUpLoad_err',
                    errs: data?.statusCode,
                    value: data?.tempFilePath,
                  } as IHandleCaptureException)
                  Taro.showToast({
                    title: '图片生成失败，请重试',
                    icon: 'none'
                  })
                }
              }
            })
          }
        },
        fail: (data) => {
          let realPath = width ? getUserAvatar(src, width) : src
          Taro.downloadFile({
            url: getHostProxyImg(realPath || ''),
            success: (img) => {
              resolve(img.tempFilePath)
            },
            complete: (data) => {
              if (data?.statusCode === 404 || data?.stausCode === 500) {
                Sentry?.captureMessage(`图片加载失败`)
                Sentry?.captureException({
                  exceptionName: 'canvas_imgUpLoad_err',
                  errs: data?.statusCode,
                  value: data?.tempFilePath,
                } as IHandleCaptureException)
                Taro.showToast({
                  title: '图片生成失败，请重试',
                  icon: 'none'
                })
              }
            }
          })
        }
      });
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      console.log(src, '图片地址');

      // img.src = `${host}/image-proxy?url=${src}&x-oss-process=image/resize,p_50`;
      if (src.hasOwnProperty('done')) {
        resolve(src.url || '')
      } else {
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
    }
  });
}

export const draw2Line = (rpx = 1, ctx, t, x, y, w, color, textBaseline, textAlign) => {

  var chr = t.split("");
  var temp = "";
  var row = [];

  // ctx.font = "20px Arial";
  // ctx.fillStyle = "black";
  // ctx.textBaseline = "middle";

  for (var a = 0; a < chr.length; a++) {
    if (ctx.measureText(temp).width < (process.env.TARO_ENV === 'h5' ? w * 4 : w)) {
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
        drawText(rpx, ctx, row[b], x, (y + (b + 1) * 66) / 2, 24, color, textBaseline, textAlign)
      } else if (b < 3) {
        drawText(rpx, ctx, '...', x, (y + (b + 1) * 66) / 2, 24, color, textBaseline, textAlign)
      }
    } else {
      if (b <= 1) {
        drawText(rpx, ctx, row[b], x / 2, (y + (b + 1) * 66) / 2, 24, color, textBaseline, textAlign)
      } else if (b < 3) {
        drawText(rpx, ctx, '...', x / 2, (y + (b + 1) * 66) / 2, 24, color, textBaseline, textAlign)
      }
    }
    // ctx.fillText(row[b], x, y + (b + 1) * 20);
  }
}

export const tempLine = (rpx = 1, ctx, t, x, y, w, color, textBaseline, textAlign) => {

  var chr = t.split("");
  var temp = "";
  var row = [];

  // ctx.font = "20px Arial";
  // ctx.fillStyle = "black";
  // ctx.textBaseline = "middle";

  for (var a = 0; a < chr.length; a++) {
    if (ctx.measureText(temp).width < (process.env.TARO_ENV === 'h5' ? w * 4 : w)) {
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
      if (b < 1) {
        drawText(rpx, ctx, row[b] + (row.length >= 1 ? '...' : ''), x, y, 24, color, textBaseline, textAlign)
      }
    } else {
      if (b < 1) {
        drawText(rpx, ctx, row[b] + (row.length >= 1 ? '...' : ''), x, y, 24, color, textBaseline, textAlign)
      }
    }
    // ctx.fillText(row[b], x, y + (b + 1) * 20);
  }
}


export const fillRadius = (rpx = 1, ctx, x, y, w, h, r, color) => {
  if (process.env.TARO_ENV === 'h5') {
    w = w * 2
    h = h * 2
    x = x * 2
    y = y * 2
    r = r * 2
    let rate = 1
    let radius = r * rate * rpx * 2
    let angleLine = 10 * rpx
    ctx.beginPath();
    ctx.save();
    // ctx.setLineWidth(1)
    ctx.strokeStyle = '#fff'
    ctx.moveTo(x, y);           // 创建开始点
    ctx.lineTo(x + w - angleLine / 2, y);          // 创建水平线
    ctx.arcTo(x + w, y, x + w, y + angleLine, radius); // 创建弧
    ctx.lineTo(x + w, y + h - angleLine / 2);         // 创建垂直线
    ctx.arcTo(x + w, y + h, x - angleLine / 2 + w, y + h, radius); // 创建弧
    ctx.lineTo(x + angleLine / 2, y + h);         // 创建水平线
    ctx.arcTo(x, y + h, x, y - angleLine / 2 + h, radius); // 创建弧
    ctx.lineTo(x, y + angleLine / 2);         // 创建垂直线
    ctx.arcTo(x, y, x + angleLine / 2, y, radius); // 创建弧
    ctx.closePath()
    ctx.clip();
    ctx.fillStyle = "#fff"
    ctx.fillRect(x, y, w, h);
    ctx.stroke();
    ctx.restore()
  } else {

    w = w / 2
    h = h / 2
    x = x / 2
    y = y / 2
    r = r / 2
    let rate = 1
    let radius = r * rate * rpx * 2
    let angleLine = 10 * rpx
    // { x: (30+30)*rate,y: (246+30)*rate },
    ctx.beginPath();
    ctx.save();
    ctx.setLineWidth(1)
    ctx.setStrokeStyle('#fff')
    ctx.moveTo(x, y);           // 创建开始点
    ctx.lineTo(x + w - angleLine / 2, y);          // 创建水平线
    ctx.arcTo(x + w, y, x + w, y + angleLine, radius); // 创建弧
    ctx.lineTo(x + w, y + h - angleLine / 2);         // 创建垂直线
    ctx.arcTo(x + w, y + h, x - angleLine / 2 + w, y + h, radius); // 创建弧
    ctx.lineTo(x + angleLine / 2, y + h);         // 创建水平线
    ctx.arcTo(x, y + h, x, y - angleLine / 2 + h, radius); // 创建弧
    ctx.lineTo(x, y + angleLine / 2);         // 创建垂直线
    ctx.arcTo(x, y, x + angleLine / 2, y, radius); // 创建弧
    ctx.closePath()
    ctx.clip();
    ctx.setFillStyle("#fff");
    ctx.fillRect(x, y, w, h);
    ctx.stroke();
    ctx.restore()
  }


}


// 绘制图片
export const drawRoundRect = (ctx, r, x, y, w, h, img, rpx = 1, topRadius?) => {
  if (process.env.TARO_ENV === 'h5') {
    r = r * 2
    w = w * 2
    h = h * 2
    x = x * 2
    y = y * 2
    ctx.save();
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, topRadius !== undefined ? topRadius : r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, topRadius !== undefined ? topRadius : r);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, w, h)
    ctx.restore(); // 返回上一状态
  } else {
    r = r / 2 * rpx
    w = w / 2 * rpx
    h = h / 2 * rpx
    x = x / 2 * rpx
    y = y / 2 * rpx
    if (r) {
      ctx.beginPath();
      ctx.save();
      let rate = 1
      let width = w
      let radius = r * rate * rpx
      let angleLine = 5 * rpx
      // { x: (30+30)*rate,y: (246+30)*rate },
      ctx.setLineWidth(1)
      ctx.setStrokeStyle('#fff')
      ctx.moveTo(x, y);           // 创建开始点
      ctx.lineTo(x + w - (topRadius === 0 ? 0 : angleLine / 2), y);          // 创建水平线
      ctx.arcTo(x + w, y, x + w, y + angleLine, topRadius !== undefined ? topRadius : radius); // 创建弧
      ctx.lineTo(x + w, y + h - angleLine / 2);         // 创建垂直线
      ctx.arcTo(x + w, y + h, x - angleLine / 2 + w, y + h, radius); // 创建弧
      ctx.lineTo(x + angleLine / 2, y + h);         // 创建水平线
      ctx.arcTo(x, y + h, x, y - angleLine / 2 + h, radius); // 创建弧
      ctx.lineTo(x, y + angleLine / 2);         // 创建垂直线
      ctx.arcTo(x, y, x + angleLine / 2, y, topRadius !== undefined ? topRadius : radius); // 创建弧
      ctx.stroke();
      ctx.clip();
    }
    ctx.drawImage(img, x * rpx, y * rpx, w * rpx, h * rpx);
    ctx.restore()
  }
}


// 圆形图片
export const circleImg = (ctx, img, x, y, r) => {
  if (process.env.TARO_ENV === 'h5') {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx * 2, cy * 2, r * 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x * 2, y * 2, d * 2, d * 2)
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
export const drawText = (rpx = 1, ctx, value, left, top, font?, fillStyle?, textBaseline?, textAlign?, lineHeight?) => {
  if (process.env.TARO_ENV === 'h5') {
    ctx.font = `${font * 2}px  Microsoft YaHei`;
    ctx.fillStyle = fillStyle
    ctx.textBaseline = textBaseline
    ctx.textAlign = textAlign
    ctx.fontWeight = 500;
    ctx.lineHeight = lineHeight;
    ctx.fillText(value, left * 2, top * 2);
  } else {
    font && (ctx.font = `${font / 2}px  Microsoft YaHei`)
    fillStyle && ctx.setFillStyle(fillStyle)
    textBaseline && ctx.setTextBaseline(textBaseline)
    textAlign && ctx.setTextAlign(textAlign)
    ctx.fillText(String(value), left / 2 * rpx, top / 2 * rpx);
  }
  // ctx.globalCompositeOperation = 'destination-over'
}


const getResult = (list) => {
  async function queue(arr) {
    let res = []
    for (let fn of arr) {
      var data = await fn();
      console.log(data, 12312);

      res.push(data);
    }
    return await res
  }
  return queue(list)

}

type ChildItem = {
  type: string;
  left: number;
  color?: string;
  top: number;
  width: number;
  height: number;
  value?: string;
  verticalAlign?: string;
  textAlign?: string;
  font?: any;
  otherSide?: boolean;
  radius?: number;
  src?: string;
  length?: number;
  cut?: boolean;
  [key: string]: any
}

export interface IJson {
  width?: number
  height?: number
  children: ChildItem[]
}


/**
 * 绘制海报
 * @param ctx  canvas上下文
 * @param rpx  手机像素比
 * @param json  海报config参数
 * @param width  上下文宽度
 * @param height  上下文高度
 * @returns  图片url
 */

export const creatCanvas = (ctx: any, rpx: any = 1, json: IJson, width: number, height: number, c?: any) => {

  return new Promise(async (resolve) => {
    let promiseList = []
    let imgList: any[] = []
    let childrenList: any[] = []
    let imgEmu = ['img', 'bg', 'circleImg']

    json.children.forEach((item, i) => {

      if (imgEmu.includes(item.type)) {

        imgList.push(addImage1(item.src, item.width))
      } else {
        imgList.push(new Promise((resolve) => {
          resolve(1)
        }))
      }
    })

    childrenList = await Promise.all(imgList)


    json.children.forEach((item, i) => {
      if (item.otherSide === true || item.otherSide === undefined) {
        let promiseItem = () => {
          return new Promise(async (resolve) => {
            if (item.type === 'img') {
              let img = childrenList[i]
              drawRoundRect(ctx, item.radius, item.left, item.top, item.width, item.height, img, rpx, item.topRadius)
              resolve(1)
            } else if (item.type === 'bg') {
              let img = childrenList[i]
              if (process.env.TARO_ENV === 'h5') {
                ctx.drawImage(img, 0, 0, width, height)
              } else {
                drawRoundRect(ctx, 0, item.left, item.top, width * 2, height * 2, img, rpx)
              }
              resolve(2)
            } else if (item.type === 'text') {
              let value = item.value
              if (item.value.length > 10 && item.cut) {
                value = item.value.substring(0, 7) + '...'
              }
              drawText(rpx, ctx, value, item.left, item.top, item.font, item.color, item.verticalAlign, item.textAlign)

              resolve(3)
            } else if (item.type === 'circleImg') {
              let img = childrenList[i]
              circleImg(ctx, img, item.left, item.top, item.radius)
              resolve(4)
            } else if (item.type === 'fill') {
              if (process.env.TARO_ENV === 'h5') {
                ctx.fillStyle = item.color;
                ctx.fillRect(item.left * 2, item.top * 2, item.width * 2, item.height * 2);
              } else {
                ctx.setFillStyle(item.color)
                ctx.fillRect(item.left / 2, item.top / 2, item.width / 2, item.height / 2);
              }
              resolve(5)
            } else if (item.type === 'textLine') {
              draw2Line(rpx, ctx, item.value, item.left, item.top, item.length, item.color, item.verticalAlign, item.textAlign)
              resolve(6)
            } else if (item.type === 'tempLine') {
              tempLine(rpx, ctx, item.value, item.left, item.top, item.length, item.color, item.verticalAlign, item.textAlign)
              resolve(7)
            } else if (item.type === 'fillRadius') {
              fillRadius(rpx, ctx, item.left, item.top, item.width, item.height, item.radius, item.color)
              resolve(8)
            }

          })
        }
        promiseList.push(promiseItem)
      }

    });

    getResult(promiseList).then(res => {
      if (process.env.TARO_ENV === 'weapp') {
        ctx.draw(true, () => {
          Taro.canvasToTempFilePath({
            canvasId: 'canvas',
            success: function (res) {
              resolve(res.tempFilePath)
            }
          }, this)
        })
      } else {
        var resultImg = c.toDataURL("image/png"); // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
        resolve(resultImg)
      }
    }).catch(reject => {
      reject(1)
    })
  })

}
