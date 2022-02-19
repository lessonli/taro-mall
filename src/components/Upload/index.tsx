import React, { useState, useRef, useEffect, ReactNode, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input, Image, Icon, Video } from '@tarojs/components'
// import Cropper from "react-cropper"

import { uploadH5ToOss, uploadWeappToOss, uploadH5ToOssgetBase64Imgs, uploadWeappToOssgetBase64Imgs } from './oss'

import './index.scss'
import Cropper from './Cropper'
import { isAppWebview } from '@/constants'

const platform = process.env.TARO_ENV

export const BwAppChooseImage = (data: {
  count: number;
  sourceType: ('album' | 'camera')[];
}) => {
  return new Promise((reslove, reject) => {
    WebViewJavascriptBridge.callHandler(
      'chooseImage',
      JSON.stringify({
        count: data.count,
        sourceType: data.sourceType,
      }),
      (res) => {
        console.log('app =>', res);
        
        const {code, data} = res
        if (code !== 0) {
          console.log('你取消了上传');
          reject()
        } else {
          console.log('app 选择', data);
          reslove({ files: data })
        }
      }
    )
  })

}

// 全屏
// ele:全屏的对象
function requestFullscreen(ele) {
  // 全屏兼容代码
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
}

// 取消全屏
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
}

export interface IFile {
  uid: string;
  name: string;
  percent?: number;
  // 缩略图地址
  thumbUrl: string;
  // 真实地址
  url?: string;
  status?: 'done' | 'uploading' | 'error' | 'removed';
  response?: any;
  w?: number;
  h?: number;
  s?: number;
}

type IUploadProps = {
  value: IFile[];
  onChange: (v: IFile[]) => void;
  /**
   * value 值更新的拦截
   */
  beforeValueChange?: (v: IFile[]) => IFile[];
  /**
   * 模式 单张 多张
   * 默认 multiple
   */
  mode?: 'single' | 'multiple';
  max?: number;
  style?: Record<string, string>;
  className?: string;
  children?: ReactNode;
  // 上传组件完全自定义
  uploadButton?: ReactNode;
  // 图片展示组件完全自定义
  imageComponent?: ReactNode;
  type?: 'image' | 'video';
  /**
   * 裁剪功能 暂时只支持H5
   */
  ableCropper?: boolean;
  cropperOption?: {
    aspectRatio: number; 
  };
}

// 上传图片展示
export const ImgOutLined = (props: {
  text?: string;
}) => (
  <View className={`ImgOutLined ImgOutLined-${platform}`}>
    <Text className="myIcon pic">&#xe716;</Text>
    <View className="t">{props.text || '上传图片'}</View>
  </View>
)

export const VideoOutLined = () => (
  <View className={`ImgOutLined ImgOutLined-${platform}`}>
    <Text className="myIcon pic">&#xe719;</Text>
    <View className="t">上传视频</View>
  </View>
)

/**
 * 解析 string 为files[]
 * @param urls 
 * @param parseThumbUrl 解析缩略图规则
 * @returns 
 */
export const parseStr2Files = (urls: string, parseThumbUrl): IFile[] => {
  return urls.split(',').map((url, i) => {
    return {
      uid: `${i}`,
      name: `${i}`,
      thumbUrl: parseThumbUrl ? parseThumbUrl(url) : url,
      url,
      status: 'done',
    }
  })
}

/**
 * 解析 fiels 为字符串 用于数据提交
 * @param files 
 * @returns 
 */
export const parseFiles2Str = (files: IFile[]) => {
  return files.filter(ele => !!ele.url).map(ele => ele.url).join(',')
}

const Upload = (props: IUploadProps, ref: any) => {

  const inputRef = useRef<HTMLInputElement | undefined>()
  const videoRef = useRef<HTMLVideoElement>()

  let { value } = props
  if (!value) value = []

  const limit = useMemo(() => {
    if (!props.max) {
      return 9999 - value.length
    }
    return props.max - value.length
  }, [value, props.max])

  const handFileChange = async (e) => {
    const uploadFnToOss = process.env.TARO_ENV === 'weapp' ? uploadWeappToOss : uploadH5ToOss

    const getBase64Imgs = process.env.TARO_ENV === 'weapp' ? uploadWeappToOssgetBase64Imgs : uploadH5ToOssgetBase64Imgs

    const f = process.env.TARO_ENV === "h5" ? e.target.files : undefined
    const images = await getBase64Imgs({ files: f, limit: props.mode === 'single' ? 1 : limit }, props.type)
    if (images.length === 0) return
    let imgs = images.map(image => ({
      ...image,
      status: 'uploading',
    }))
    let r = [...value, ...imgs]
    if (props.mode === 'single') {
      r = [...imgs]
    }
    if (props.beforeValueChange) {
      r = props.beforeValueChange(r)
    }
    // @ts-ignore
    props.onChange(r)
    if (props.ableCropper && process.env.TARO_ENV === 'h5') {
      // 裁剪 必然是单选图片
      try {
        const lastFile = r[r.length - 1]
        const a = await Cropper({src: lastFile.thumbUrl, ...(props.cropperOption || {})})
        console.log(a)
        // 裁剪完成后 拿裁剪
        Object.assign(imgs[imgs.length - 1], {
          thumbUrl: a.src,
        })
        Object.assign(r[r.length - 1], {
          thumbUrl: a.src,
        })

        props.onChange([...r])
        // props.onChange([...er, {...lastR, thumbUrl: a.src}])
      } catch(e) {
        // 取消裁剪
        console.log('err')
        props.onChange(r.slice(0, r.length - 1))
        return
      }
    }
    Taro.showLoading({
      title: '上传中~',
      mask: true,
    })
    try {
      const ossUploader = await uploadFnToOss(props.type)
      for (let i = 0; i < imgs.length; i++) {
        // @ts-ignore
        const { uid, filePath } = imgs[i]
        // @ts-ignore
        const { status, url } = await ossUploader({
          ...imgs[i],
          uid, file: filePath,
        })

        r.forEach(item => {
          if (item.uid === uid) {
            Object.assign(item, { url, status })
          }
        })
        if (props.beforeValueChange) {
          r = props.beforeValueChange(r)
        }
        props.onChange(r)
      }      
      clearFile()
      Taro.hideLoading()
    } catch (e) {
      clearFile()
      Taro.hideLoading()
      console.log('eeeee', e)
      if (e?.status === 'error') {
        const uid = e.uid
        let r = value.findIndex(item => item.uid === uid)
        // 删掉出错之后的几张图片
     
        props.onChange(value.filter((_, j) => j < r))
      } else {
        // Taro.showToast('上传出错')
        const ids = imgs.map(e1 => e1.uid)
        let r = value.filter(ele => !ids.includes(ele.uid))
      
        props.onChange(r)
      }
    }

  }

  const clearFile = () => {
    if (process.env.TARO_ENV === 'h5') {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleTrigger = () => {
    if (process.env.TARO_ENV === 'h5') {
      inputRef.current?.click?.()
    } else {
      handFileChange(undefined)
    }
  }

  const handleRemove = (i) => {
    props.onChange(value.filter((_, j) => i !== j))
  }

  const previewItem = useCallback((item) => {
    const index = value.findIndex(e => e.uid === item.uid)
    if (props.type === 'video') {
      if (process.env.TARO_ENV === 'weapp') {
        Taro.previewMedia({
          sources: value.map((e) => ({
            url: e.thumbUrl || e.url,
            type: props.type || 'image',
            // poster
          })),
          current: index || 0,
        })
      } else if (process.env.TARO_ENV === 'h5') {
        // console.log(ev)
        // setcurrentVideo(item.url || item.thumbUrl)
        requestFullscreen(videoRef.current)
        videoRef.current.play()
        // videoRef.current.play()
      }
    } else {
      Taro.previewImage({
        urls: value.map(e => e.url || e.thumbUrl || ''),
        current: item.url || item.thumbUrl
      })
    }
    // Taro.previewImage({
    //   urls: value.map(e => e.thumbUrl || e.url || ''),
    //   current: item.thumbUrl || item.url,
    // })
  }, [value])

  useImperativeHandle(ref, () => ({
    handleRemove,
    handUpload: handleTrigger,
    handlePreviewItem: previewItem,
  }))
  return <>
    {/* {
      props.type === 'video' && <Video ref={videoRef} src={currentVideo} style={{ display: 'none' }}></Video>
    } */}
    {/* <Child ref={childRef}/> */}
    {process.env.TARO_ENV === 'h5' && <input type="file" ref={inputRef} onChange={handFileChange} className="bw-upload-file-input" multiple accept={props.type === 'video' ? 'video/*' : 'image/*'} ></input>}
    {
      props.imageComponent ? props.imageComponent : (value || [])?.map((item, i) => {
        return <View className="bw-upload-img-item" key={i} style={props.style || {}}>
          {
            props.type === 'video' ?
              <View className="video-wrap">
                <Video src={item.thumbUrl || item.url || ''} className="image" ref={videoRef}></Video>
                <View className="video-mask" onClick={() => previewItem(item)}></View>
              </View>
              :
              <Image src={item.thumbUrl || item.url || ''} className={process.env.TARO_ENV === 'h5' ? 'image image-h5' : 'image image-weapp'} mode="aspectFit" onClick={() => previewItem(item)}/>
          }
          <Text className="myIcon clear-btn" onClick={() => handleRemove(i)}>&#xe723;</Text>
        </View>
      })
    }
    {
      limit > 0 && !props.uploadButton && (
        <View className="bw-upload-wrapper" onClick={handleTrigger}>
          {
            props.children ? props.children : <ImgOutLined />
          }
        </View>
      )
    }
    {
      limit > 0 && props.uploadButton
    }
  </>
}

export default forwardRef(Upload)