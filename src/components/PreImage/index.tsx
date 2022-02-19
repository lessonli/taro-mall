import Taro, { startLocationUpdateBackground } from '@tarojs/taro'
import { Image as ImageBox, View } from '@tarojs/components'
import './index.scss'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { parseOssImageInfo } from '../Upload/oss'
import { ImageProps } from '@tarojs/components/types/Image'
import qs from 'query-string'
import { useDidShow } from '@tarojs/runtime'
import { useMemo } from 'react'
import { autoAddImageHost } from './transformImageSrc'
import { loadAssets } from '@/constants/images'
interface IProps extends ImageProps {
  append?: boolean | undefined
  type?: string | undefined
}

const cachedMap = []

const cachedMapMaxLength = 2000

const data = 'data:image/png;base64,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'


const errImage = loadAssets('@/assets/img/lose_picture_1.png')

const PreImage = (props: IProps) => {
  const { src, className, type } = props
  const [option, setOption] = useState<any>({})
  const [ratio, setRatio] = useState<number>(1)
  const [placeholder, setPlaceholder] = useState<any>(data)
  const [animate, setAnimate] = useState<boolean>(false)

  useEffect(() => {
    const option = parseOssImageInfo(autoAddImageHost(src))
    if (option) {
      setRatio(option.width / option.height)
    }
    // setOption(option)
  }, [src])

  const rootClass = classNames(
    'bw-preImage',
    className
  )

  useDidShow(() => {
    animate && setAnimate(false)
  })

  const onload = () => {
    props?.onLoad
    setPlaceholder(null)
    setAnimate(true)
  }

  const imageBoxClass = classNames(
    'bw-preImage-loadImg',
    {
      'op1': !placeholder
    },
    {
      'imgShow': animate
    }
  )

  // x-oss-process=image/resize,p_50
  return (
    <div className={rootClass}>
      {/* <Image src={src} /> */}
      {placeholder && <div className='bw-preImage-zw'>
        <ImageBox mode='aspectFit' className={type === 'height' ? 'bw-preImage-zw-height' : 'bw-preImage-zw-img'} style={{ height: process.env.TARO_ENV === 'weapp' ? "" : 'auto' }} src={placeholder} />
      </div>}
      <ImageBox className={imageBoxClass}   {...props} src={autoAddImageHost(src)} mode={props.mode || 'scaleToFill'} onLoad={onload} webp />
    </div>
  )
}

export default PreImage

const fetchUrl = (src) => {
  src = autoAddImageHost(src)
  return new Promise((resolve, reject) => {
    if (process.env.TARO_ENV === 'h5') {
      const img = new Image()
      img.src = src
      img.onload = function () {
        resolve(src)
      }

      img.onerror = function () {
        console.log('onerror', src)
        reject()
      }
    } else {
      // Taro.getImageInfo({
      //   src,
      //   success: () => {
      //     resolve(src)
      //   },
      //   fail: () => {
      //     console.log('taro fail', src)
      //     reject()
      //   }
      // })
    }
  })
}

let IS_SUPPORT_WEBP = false

function checkWebp() {
  if (process.env.TARO_ENV === 'weapp') {
    return IS_SUPPORT_WEBP = true
  }
  var img = new Image();
  img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
  img.onload = function () {
    var result = (img.width > 0) && (img.height > 0);
    IS_SUPPORT_WEBP = Boolean(result)
  }
  img.onerror = function () {
    IS_SUPPORT_WEBP = false
  }
}

// checkWebp()

export {
  IS_SUPPORT_WEBP
}

export function XImage(props: ImageProps & {
  query?: Record<string, string>;
  src?: string | undefined;
  onload?: () => void;
  onerror?: () => void;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * 禁用占位模式
   * 默认 false 开启占位
   */
  disabledPlaceholder?: boolean;
}) {
  // const { style, src, query, className, placeholder, mode, ...rest } = props
  const { style, src, query, onload, onerror, className, placeholder, mode, ...rest } = props

  const [url, setUrl] = useState('')

  const [status, setStatus] = useState('placeholder')

  const urlR = useMemo(() => {
    if (!src) return ''
    const srcoss = qs.stringifyUrl({ url: autoAddImageHost(src || ''), query: query || {} })
    return srcoss
  }, [src, query])

  useEffect(() => {
    if (!!src) {

      if (!cachedMap.includes(urlR)) {
        if (cachedMap.length >= cachedMapMaxLength) {
          cachedMap.pop()
        }
        cachedMap.unshift(urlR)

        if (process.env.TARO_ENV === 'h5') {
          fetchUrl(urlR).then(() => {
            setUrl(urlR)
            setStatus('success')
            onload?.()
          }).catch(() => {
            onerror?.()
            setStatus('error')
            setUrl(errImage)
          })
        } else {
          setUrl(urlR)
        }
      } else {
        setStatus('success')
        setUrl(urlR)
      }

    }
  }, [urlR])

  const resultMode = useMemo(() => {
    // if (status === 'placeholder') return 'aspectFit'
    if (!mode) return 'aspectFill'
    return mode
  }, [mode])

  const containerStyle = useMemo(() => {
    if (props.disabledPlaceholder) return style || {}
    return {
      ...(placeholder ? {backgroundImage: `url(${placeholder})`} : {}),
      ...(style || {}),
    }
  }, [placeholder, style, props.disabledPlaceholder])

  const weappOnComplete = {
    onLoad: () => setStatus('success'),
    onError: () => {
      console.log('weapp img err', url)
      setStatus('error')
      setUrl(errImage)
    }
  }

  const names = classNames(
    'bw-x-image-wrapper', 
    `bw-x-image-wrapper__${resultMode}`,
    `bw-x-image-wrapper-${process.env.TARO_ENV}`,
    {
      'bw-x-image-wrapper_placeholder': !props.disabledPlaceholder,
    }, 
    className)

  return <View className={names} style={containerStyle}>
    {
      process.env.TARO_ENV === 'weapp' ?
      <ImageBox {...rest} src={url} className={`bw-x-image bw-x-image__${status} bw-x-image__${resultMode}`} mode={resultMode} onLoad={weappOnComplete.onLoad} onError={weappOnComplete.onError} webp /> :
      <ImageBox {...rest} src={url} className={`bw-x-image bw-x-image__${status} bw-x-image__${resultMode}`} mode={resultMode} />
    }
  </View>
}

const watermarkBase64 = {
  100: 'bWFya2VyX2J3XzEwMC5wbmc=',
  120: 'bWFya2VyX2J3XzEyMC5wbmc=',
  20: 'bWFya2VyX2J3XzIwLnBuZw==',
  50: 'bWFya2VyX2J3XzUwLnBuZw==',
  60: 'bWFya2VyX2J3XzYwLnBuZw==',
  70: 'bWFya2VyX2J3XzcwLnBuZw==',
  80: 'bWFya2VyX2J3XzgwLnBuZw==',
}

export const addWaterMarker = (url?: string) => {
  if (!url) return ''
  const a = qs.stringifyUrl({
    url,
    query: {
      'x-oss-process': `image/watermark,image_${watermarkBase64['60']},g_se,x_20,y_20`
    }
  })
  return a
}