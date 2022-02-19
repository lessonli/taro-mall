// import crypto from 'crypto-js';
import Taro from '@tarojs/taro'
// import Oss from 'ali-oss/dist/aliyun-oss-sdk';
import qs from "query-string";

// import { API_ENV } from '@/service/http'
import api2596 from '@/apis/21/api2596';

import { getUserInfo, sleep } from "@/utils/cachedService";
import api2948 from '@/apis/21/api2948';
import { loadScript } from '@/utils/base';

/**
 * 图片上传地址
 *  - 线上地址 https://image.bowuyoudao.com
 *  - 测试及其他 https://bwyd-test.oss-cn-hangzhou.aliyuncs.com
 * 
 * 图片上传路径，为方便管理图片，需要以目录区分端
 * - H5 : web
 * - 小程序: webapp
 * - ios: ios
 * - android: android
 * - pc端: pc
 * 
 * 举例： https://image.bowuyoudao.com/web/xxxxxxx_w120_h220_s_1024.png
 */

export const ossUrl = API_ENV === 'prod' ? 'https://image.bowuyoudao.com' : 'https://bwyd-test.oss-cn-hangzhou.aliyuncs.com'

/**
 * https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
 * https://stackoverflow.com/questions/27553617/convert-blob-to-file
 * 转换图片 base64 => file
 * @param dataURI 
 * @param fileName 
 * @returns 
 */
function dataURItoFile(dataURI, fileName) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia = byteString.charCodeAt(i);
  }
  // return new Blob([ab], { type: 'image/jpeg' });
  return new File([ia], fileName, { type: 'image/jpeg', lastModified: Date.now() })
}

/**
 * https://blog.csdn.net/u011628753/article/details/110878292
 * @param dataURI 
 * @param fileName 
 * @returns 
 */
function bolbToFile(dataURI, fileName) {

  //将base64转换为blob
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  //将blob转换为file
  function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  const blob = dataURLtoBlob(dataURI)
  const file = blobToFile(blob, fileName)
  console.log('处理后file', file)
  return file
}

function getH5ImageInfo(src: string): Promise<{
  w: number;
  h: number;
  s: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve({
        w: img.width,
        h: img.height,
        // 取不到 暂时随便定义一个值
        s: 10100
      })
    }
    img.onerror = reject
  })
}

export function genUuid(len = 16, radix = 16) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid: string[] = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
// http://192.168.0.48:5000/img/video.mp4

// 计算签名。
// function computeSignature(accessKeySecret, canonicalString) {
//   return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
// }


export const uploadWeappToOss = async function (type: 'image' | 'video' = 'image') {

  const fn = async ({ uid, file: filePath }): Promise<{
    uid: string;
    status: 'done' | 'error',
    url: string;
    response?: any;
  }> => {

    if (API_ENV === 'mock') {
      return Promise.resolve({
        uid,
        name: uid,
        url: '',
        status: 'done'
      })
    }

    const date = new Date();
    date.setHours(date.getHours() + 1);
    const policyText = {
      expiration: date.toISOString(), // 设置policy过期时间。
      conditions: [
        // 限制上传大小。
        ["content-length-range", 0, 1024 * 1024 * 1024],
      ],
    };

    const credentials = await api2948({ policy: JSON.stringify(policyText) })
    // TODO: EXT  文件后缀
    const bucket = `${process.env.TARO_ENV === 'h5' ? 'web' : 'weapp'}/${uid}`
    // const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。
    // const signature = computeSignature(credentials?.accessKeySecret, policy)
    const formData = {
      OSSAccessKeyId: credentials?.accessKeyId,
      signature: credentials?.signature,
      policy: credentials?.policy,
      'x-oss-security-token': credentials?.securityToken,
      // 设置文件上传至OSS后的文件路径。例如需要将myphoto.jpg上传至test文件夹下，此处填写test/myphoto.jpg。
      key: bucket,
    }

    return new Promise((resolve, reject) => {

      if (API_ENV === 'mock') {
        sleep().then(() => {
          resolve({
            uid,
            url: 'http://bwyd-test.oss-cn-hangzhou.aliyuncs.com/2a389eb2-8a9c-4e39-a8f7-fb17ada13d4e',
            status: 'done',
          })
        })
        return
      }

      Taro.uploadFile({
        url: ossUrl,
        filePath, // 填写待上传文件的文件路径，例如：D:\example.txt
        name: 'file',
        formData,
        success: (res) => {
          console.log(res)
          if (res.statusCode === 204) {
            console.log(`${ossUrl}/${bucket}`)
            resolve({
              uid,
              url: `${ossUrl}/${bucket}`,
              status: 'done',
              response: res,
            })
          } else {
            // Taro.showToast({
            //   title: '上传失败',
            //   icon: 'none',
            // })
            reject({
              uid,
              url: '',
              status: 'error',
              response: res
            })
          }
        },
        fail: (err) => {
          reject({
            uid,
            url: '',
            status: 'error',
            response: err,
          })
        }
      })
    })
  }

  return fn

}

export const uploadWeappToOssgetBase64Imgs = function ({ limit }, type: 'image' | 'video' = 'image'): Promise<{ uid: string; name: string; thumbUrl: string; }[]> {
  const p: any[] = []
  const getBase64Img = (filePath, size) => {
    return new Promise(async (resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath,
        encoding: 'base64',
        success: (img) => {
          Taro.getImageInfo({
            src: filePath,
            success: (e) => {
              const thumbUrl = 'data:image/png;base64,' + img.data
              const uid = `${genUuid()}_w${e.width}_h${e.height}_s${size}.${e.type}`
              resolve({
                uid,
                name: uid,
                status: 'uploading',
                thumbUrl,
                filePath,
              })
            }
          })

        },
        fail: reject
      })
    })
  }

  return new Promise((resolve, reject) => {
    if (type === 'video') {
      Taro.chooseVideo({
        sourceType: ['album'],
        maxDuration: 40,
        success: (res) => {
          const uid = `${genUuid()}`
          const result = {
            ...res,
            filePath: res.tempFilePath,
            uid,
            status: 'uploading',
            thumbUrl: res.tempFilePath,
          }
          p.push(Promise.resolve(result))
          resolve(Promise.all(p))
        }
      })
      return
    }
    Taro.chooseImage({
      count: limit,
      success: async (res) => {
        const l = res.tempFilePaths.length
        for (let i = 0; i < res.tempFiles.length; i++) {
          if (i <= limit - 1) {
            p.push(getBase64Img(res.tempFiles[i].path, res.tempFiles[i].size))
            if (
              (limit >= l && i === l - 1) ||
              (limit < l && i === limit - 1)
            ) {
              resolve(Promise.all(p))
            }
          }

          // p.push(getBase64Img(res.tempFilePaths[i]))
          // if (i === res.tempFilePaths.length - 1) {
          //   resolve(Promise.all(p))
          // }
        }
      },
      fail: (e) => {
        console.log('fail', e)
        reject(e)
        // if (e.errMsg === 'chooseImage:fail cancel') {
        //   // resolve([])
        //   reject(e)
        // } else {
        //   reject(e)
        // }
      }
    })
  })
}


export const uploadH5ToOss = async function () {

  const fn = async ({ uid, file, w, h, s, thumbUrl }): Promise<{
    uid: string;
    status: 'done' | 'error',
    url: string;
    response?: any;
  }> => {
    console.log(uid, file)
    if (API_ENV === 'mock') {
      return Promise.resolve({
        uid,
        name: uid,
        url: '',
        status: 'done'
      })
    }

    const credentials = await api2596()
    const config = {
      accessKeyId: credentials?.accessKeyId || '',
      accessKeySecret: credentials?.accessKeySecret || '',
      stsToken: credentials?.securityToken || '',
      region: 'oss-cn-hangzhou',
      // bucket: `bwyd-test/${API_ENV}/${userInfo.userNo || 'trader'}/${process.env.TARO_ENV}`,
      bucket: credentials?.bucketName,
    };
    // const Oss = require('ali-oss')
    // import Oss from 'ali-oss/dist/aliyun-oss-sdk.js';
    await loadScript('https://tsla.bowuyoudao.com/npm/ali-oss/6.16.0/dist/aliyun-oss-sdk.min.js')
    const client = new OSS(config);
    let fileResult = file
    if (thumbUrl) {
      fileResult = bolbToFile(thumbUrl, file.name)
      const c = await getH5ImageInfo(thumbUrl)
      w = c.w
      h = c.h
      s = c.s
    }
    console.log(fileResult)
    // storeAs可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    const ext = file.name.split('.').pop().toLowerCase()
    const storeAs = `web/${uid}_w${w || ''}_h${h || ''}_s${s || ''}.${ext}`
    let savedCpt

    const result = await client.multipartUpload(storeAs, fileResult, {
      checkpoint: savedCpt,
      progress: (p, checkpoint) => {
        // console.log(`oss progress => `, p, checkpoint)
        savedCpt = checkpoint
      }
    });
    // console.log('multipartUpload result => ', result)
    // Please set the etag of expose-headers in OSS 
    // const [url] = result?.res.requestUrls

    // https://bwyd-test.oss-cn-hangzhou.aliyuncs.com/bwyd-test/test/UA75953106590654464127/h5/74d26962-1ad9-482f-98b1-461fc885a93c
    const url = `${ossUrl}/${storeAs}`

    // console.log('oss url => ', uid, url)
    return {
      url,
      uid,
      status: 'done',
    }
  }

  return fn

  // return Promise.resolve(['http://bwyd-test.oss-cn-hangzhou.aliyuncs.com/2a389eb2-8a9c-4e39-a8f7-fb17ada13d4e'])
}

export const uploadH5ToOssgetBase64Imgs = async function (
  { files, limit },
  type: 'image' | 'video' = 'image',
  tester?: RegExp,
): Promise<{ uid: string; name: string; thumbUrl: string; file: any }[]> {

  if (files.length > limit) {
    Taro.showToast({
      title: `最多还能上传${limit}张图片`,
      icon: 'none'
    })
  }

  const l = files.length

  const genbase64 = function (file) {
    console.log('file', file)
    return new Promise((resolve, reject) => {

      if (type === 'image' && !/\.(png|jpg|gif|jpeg)$/i.test(file.name)) {
        Taro.showToast({
          title: '上传格式不合法',
          icon: 'none',
        })
        reject()
        return
      }

      if (type === 'video') {
        const base64 = window.URL.createObjectURL(file)
        const uid = genUuid()
        resolve({
          uid,
          name: uid,
          thumbUrl: base64,
          filePath: file,
        })
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        const content = this.result
        const img = new Image()
        img.src = content as string
        img.onload = function () {
          // const _this = this
          const w = img.width, h = img.height, scale = w / h;
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = w
          canvas.height = h
          ctx?.drawImage(img, 0, 0, w, h)

          const quality = 1
          const base64 = canvas.toDataURL('image/jpeg', quality)
          const uid = genUuid()
          resolve({
            uid,
            name: uid,
            thumbUrl: base64,
            filePath: file,
            w,
            h,
            s: file.size,
          })
        }
      }
    })
  }

  const p = []

  return new Promise((resolve) => {
    for (let i = 0; i < files.length; i++) {
      // @ts-ignore
      if (i <= limit - 1) {
        p.push(genbase64(files[i]))
        if (
          (limit >= l && i === l - 1) ||
          (limit < l && i === limit - 1)
        ) {
          resolve(Promise.all(p))
        }
      }
    }
  })
}

/**
 * 解析oss图片宽高 支持 _w222_h333 ?w=99&h=88
 * @param url https://oss/xxxx_w200_h200_s5653.png
 * @returns 
 */
export const parseOssImageInfo = (url: string) => {
  let w = url.match(/_w\d*/)?.[0]?.replace('_w', '')
  let h = url.match(/_h\d*/)?.[0]?.replace('_h', '')
  let size = url.match(/_s\d*/)?.[0]?.replace('_s', '')
  if (!w) {
    const { query } = qs.parseUrl(url)
    w = query.w
    h = query.h
    size = query.size
  }
  const r = {
    width: Number(w || 120),
    height: Number(h || 120),
    size: Number(size || 1024),
  }

  return {
    ...r,
    url,
  }
}