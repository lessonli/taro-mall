import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { Swiper, SwiperItem, Video } from '@tarojs/components'
import { Carousel, WingBlank } from 'antd-mobile';
import './index.scss'
import { useEffect, useState } from 'react'
import 'antd-mobile/lib/carousel/style/index.less';
import PreImage, { addWaterMarker, XImage } from '../PreImage';
import { DEVICE_NAME } from '@/constants';
import qs from 'query-string'
interface Iprops {
  list: any[] | undefined
  videoLink?: string | undefined
  bottom?: string | undefined
  type?: string | undefined
  goodsType?: number | undefined
  mode?: string | undefined
}
const BwSwiper = (props: Iprops) => {
  const { list, videoLink, type, goodsType, mode } = props
  const env = process.env.TARO_ENV
  const [current, setCurrent] = useState<number>(0)
  const [swiperList, setSwiperList] = useState<any[]>([])
  const [pause, setPause] = useState<boolean>(false)
  const swiperChange = (e) => {
    setCurrent(e.target.current || 0)

  }

  useDidShow(() => {
    setTimeout(() => {
      setPause(false)
    }, 10);
  })

  useDidHide(() => {
    setPause(true)
  })

  const goRoute = (item) => {
    if (env === 'h5') {
      // item.h5Url && (window.location.href = item.h5Url)
      if (item.h5Url.indexOf(window.location.host) > -1) {
        Taro.navigateTo({
          url: item.h5Url.split(window.location.host)[1]
        })
      } else {
        item.h5Url && (window.location.href = item.h5Url)
      }
    } else {
      item.maUrl && Taro.navigateTo({ url: `${item.maUrl}` })
    }
    if (type === 'goodsDetail') {
      Taro.previewImage({
        current: addWaterMarker(item.src), // 当前显示图片的http链接
        urls: list?.map(addWaterMarker) // 需要预览的图片http链接列表
      })
    }
  }

  useEffect(() => {
    let arr = []
    // if (props.type === 'goodsDetail' && goodsType === 1 && list && list?.length > 3) {

    //   arr = list?.map(item => {
    //     return {
    //       src: item.icon || item,
    //       h5Url: item.h5Url || '',
    //       maUrl: item.maUrl || ''
    //     }
    //   })
    //   arr = arr.filter((item, index) => index < 3)
    //   if (videoLink) {
    //     arr.push({ src: videoLink, type: 'video' })
    //   }
    //   setSwiperList(arr)
    // } else {
    arr = list?.map(item => {
      return {
        src: item.icon || item,
        h5Url: item.h5Url || '',
        maUrl: item.maUrl || ''
      }
    })
    if (videoLink) {
      arr.push({ src: videoLink, type: 'video' })
    }
    setSwiperList(arr)
    // }

  }, [list])
  const Acarousel = (props) => {
    return (
      <Carousel
        autoplay={!videoLink && !pause ? true : false}
        infinite
        className='bw-swiper-box'
      >
        {props.swiperList?.map((val, index) => (
          <div className='bw-swiper-box-item' key={`${val}${index}`}>
            {!val?.type ? <PreImage mode={mode} src={val.src} key={`${val}${index}`}
              type={type}
              onClick={() => { goRoute(val) }}
              // style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
              }} /> :
              <Video id={`video${videoLink}`}
                src={val.src}
                controls={true}
                autoplay={true}
                loop={true}
                muted={true} />

            }
          </div>
        ))}
        {/* {
          videoLink && <div className='bw-swiper-box-item'>
            <Video id={`video${videoLink}`}
              src={videoLink}
              controls={false}
              autoplay={true}
              loop={true}
              muted={false} />
          </div>
        } */}
      </Carousel>
    );

  }

  return (
    <div className='bw-swiper'>
      {
        env === 'h5' ?
          <Acarousel swiperList={swiperList}></Acarousel>
          : < Swiper
            className='bw-swiper-box'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            onChange={swiperChange}
            current={current}
            autoplay={!videoLink && !pause ? true : false}
            circular
            indicatorDots={false}
          >
            {
              swiperList?.map((val, index) => {
                return <SwiperItem key={index}>
                  <div className='bw-swiper-box-item'>
                    {!val?.type ? <PreImage mode={mode} src={val.src} key={`${val}${index}`}
                      type={type}
                      onClick={() => { goRoute(val) }}
                      // style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
                      onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                      }} /> :
                      <>{videoLink && <Video id={`video${videoLink}`}
                        className='bw-swiper-video'
                        src={val.src}
                        controls={true}
                        autoplay={true}
                        loop={true}
                        muted={true} />}</>

                    }
                  </div>
                </SwiperItem>
              })
            }
          </Swiper>
      }
      {/* {
        env === 'h5' ? <div className='pageState'>
          <div className='pageState-content'>
            {
              list?.map((item, index) => {
                return <span className={current === index ? 'pageState-content-item pageState-content-active' : 'pageState-content-item'} key={index}></span>
              })
            }
          </div>
        </div> : null
        
      } */}
      {env === 'weapp' && <div className='pageState'>
        <div className='pageState-content'>
          {
            swiperList?.map((item, index) => {
              return <span className={current === index ? 'pageState-content-item pageState-content-active' : 'pageState-content-item'} key={index}></span>
            })
          }
        </div>
      </div>}
    </div>
  )
}

export default BwSwiper
