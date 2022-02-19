import { avatar1, avatar2, avatar3, spot1, spot2, spot3, spot4, spot5, spot6, spot7 } from "@/constants/images"
import { addImage1 } from "@/utils/canvas"
import Taro from '@tarojs/taro'
/**
 * >=min && <=max
 * @param min 
 * @param max 
 */
function getRandom(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}
// function getCtx() {
//   return new Promise((resolve, reject) => {
//     Taro.nextTick(() => {
//       Taro.createSelectorQuery()
//         .select('#canvas')
//         .fields({
//           node: true,
//           size: true,
//         }).exec(async (res) => {
//           const width = res && res[0]?.width
//           const height = res && res[0]?.height
//           const ctx = await Taro.createCanvasContext('canvas', this)
//           resolve({ width, height, ctx })
//         })
//     })
//   })
// }
class ThumbsUpAni {
  imgsList = [];
  context;
  width = 0;
  height = 0;
  scanning = false;
  renderList = [];
  scaleTime = 0.3;// 百分比
  constructor(data) {
    this.loadImages();
    this.context = data.ctx
    this.width = data.width;
    this.height = data.height;
    this.imgsList = data.imgsList
  }
  loadImages() {
    // const images = [
    //   spot1, spot2, spot3, spot4, spot5, spot6, spot7
    // ];
    // Promise.all([addImage1(spot1), addImage1(spot2), addImage1(spot3), addImage1(spot4), addImage1(spot5), addImage1(spot6), addImage1(spot7)]).then(res => {
    //   res.forEach(item => {
    //     this.imgsList.push(item)
    //   });
    // })
    // images.forEach((src) => {
    //   const p = new Promise(function (resolve) {
    //     const img = new Image;
    //     img.onerror = img.onload = resolve.bind(null, img);
    //     img.src = 'https://img12.360buyimg.com/img/' + src;
    //   });
    //   promiseAll.push(p);
    // });
    // Promise.all(promiseAll).then((imgsList) => {
    //   this.imgsList = imgsList.filter((d) => {
    //     if (d && d.width > 0) return true;
    //     return false;
    //   });
    //   if (this.imgsList.length == 0) {
    //     dLog('error', 'imgsList load all error');
    //     return;
    //   }
    // })
  }
  createRender(opacity?) {

    if (this.imgsList.length == 0) return null;
    // const basicScale = [0.2, 0.6, .8][getRandom(0, 2)];

    const getScale = (diffTime) => {
      if (diffTime < 0.3) {
        return +((diffTime / 0.3).toFixed(2)) * 1
      } else if (diffTime < 0.6 && diffTime > 0.3) {
        return 1
      } else if (diffTime > 0.6 && diffTime < 1) {
        return +(((1 - diffTime) / 0.4).toFixed(2)) * 1 > 0.6 ? +(((1 - diffTime) / 0.4).toFixed(2)) * 1 : 0.6
      }
    };
    const context = this.context;
    // 随机读取一个图片来渲染
    const image = this.imgsList[getRandom(0, this.imgsList.length - 1)]
    const offset = 5;
    const basicX = this.width / 2 + getRandom(-offset, offset);
    const angle = getRandom(2, 10);
    let ratio = getRandom(10, 20) * ((getRandom(0, 1) ? 1 : -1));
    const getTranslateX = (diffTime) => {
      if (diffTime < this.scaleTime) {// 放大期间，不进行摇摆位移
        return basicX;
      } else {
        return basicX + ratio * Math.sin(angle * (diffTime - this.scaleTime));
      }
    };

    const getTranslateY = (diffTime) => {
      // if (diffTime < 0.2) {
      //   return this.height
      // } else {

      return 12 + (this.height - 24 / 2) * (1 - diffTime);
      // }
    };

    const fadeOutStage = getRandom(14, 18) / 100;
    const getAlpha = (diffTime, opacity?) => {
      if (opacity) {
        return 0
      }
      let left = 1 - +diffTime;
      if (diffTime < 0.4) {
        return 0 + (diffTime / 0.4).toFixed(2);
      } else {
        if (left > fadeOutStage) {
          return 1;
        } else {
          return 1 - +((fadeOutStage - left) / fadeOutStage).toFixed(2);
        }
      }

    };

    return (diffTime) => {
      // 差值满了，即结束了 0 ---》 1
      if (diffTime >= 1) return true;
      context.save();
      const scale = getScale(diffTime);
      context.scale(scale, scale);
      // const rotate = getRotate();
      const translateX = getTranslateX(diffTime);
      const translateY = getTranslateY(diffTime);
      context.translate(translateX * (1 / parseFloat(scale)), translateY * (1 / parseFloat(scale)));
      // context.rotate(rotate * Math.PI / 180);
      context.setGlobalAlpha(getAlpha(diffTime, opacity))
      context.drawImage(
        image,
        -10,
        0,
        24,
        24
      );
      context.restore();
    };
  }
  scan() {
    // this.context.clearRect(0, 0, this.width, this.height);
    // this.context.setFillStyle("#f4f4f4")
    // this.context.fillRect(0, 0, 200, 400);
    let index = 0;
    let length = this.renderList.length;
    if (length > 0) {
      requestFrame(this.scan.bind(this));
      this.context.draw()
      this.scanning = true;
    } else {
      this.scanning = false;
    }
    while (index < length) {
      const child = this.renderList[index];
      if (!child || !child.render || child.render.call(null, (Date.now() - child.timestamp) / child.duration)) {
        // 结束了，删除该动画
        this.renderList.splice(index, 1);
        length--;
      } else {
        // continue
        index++;
      }
    }
  }
  start(isHide?) {
    console.log(isHide, 1212);

    const render = this.createRender(isHide);
    const duration = getRandom(1500, 3000);
    this.renderList.push({
      render,
      duration,
      timestamp: Date.now(),
    });
    if (!this.scanning) {
      this.scanning = true;
      requestFrame(this.scan.bind(this));
    }
    return this;
  }
  clear() {
    requestFrame(this.scan.bind(this));
    // this.context.drw
  }
}
function requestFrame(cb) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  )(cb);
}

export default ThumbsUpAni