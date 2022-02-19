import { useCallback } from "react";
import { getHostProxyImg } from "./base";
import Taro from '@tarojs/taro'
import { Sentry, IHandleCaptureException } from '@/sentry.repoter'
export const addImage1 = (src) => {

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
      img.crossOrigin = "anonymous";
      // img.src = `${host}/image-proxy?url=${src}&x-oss-process=image/resize,p_50`;
      img.src = getHostProxyImg(src)
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (err) => {
        Sentry?.captureMessage(`图片加载失败`)
        Sentry?.captureException({
          exceptionName: 'canvas_imgUpLoad_err',
          errs: err,
          value: img.src,
        } as IHandleCaptureException)

        reject();
      };

      if (img.complete) {
        resolve(img);
      }
    }
  });
}

export const draw2Line = (rpx = 1, ctx, t, x, y, w) => {

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
        drawText(rpx, ctx, row[b], x, y + (b + 1) * 66, '48px Microsoft YaHei', '#8B572A', 'middle', 'left')
      } else if (b < 3) {
        drawText(rpx, ctx, '...', x, y + (b + 1) * 66, '48px Microsoft YaHei', '#8B572A', 'middle', 'left')
      }
    } else {
      if (b <= 1) {
        drawText(rpx, ctx, row[b], x, y + (b + 1) * 33, '12px Microsoft YaHei', '#8B572A', 'middle', 'left')
      } else if (b < 3) {
        drawText(rpx, ctx, '...', x, y + (b + 1) * 33, '12px Microsoft YaHei', '#8B572A', 'middle', 'left')
      }
    }
    // ctx.fillText(row[b], x, y + (b + 1) * 20);
  }
}



// 绘制图片
export const drawRoundRect = (ctx, r, x, y, w, h, img, rpx = 1) => {
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

    ctx.drawImage(img, x / 2 * rpx, y / 2 * rpx, w / 2 * rpx, h / 2 * rpx);

  }
}


// 圆形图片
export const circleImg = (ctx, img, x, y, r) => {
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
export const drawText = (rpx = 1, ctx, value, left, top, font?, fillStyle?, textBaseline?, textAlign?, lineHeight?) => {
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
    ctx.fillText(String(value), left / 2 * rpx, top / 2 * rpx);
  }

  // ctx.globalCompositeOperation = 'destination-over'
}