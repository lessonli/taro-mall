import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { useUnmount } from "ahooks";
import compose, { fen2yuan, selectorQueryClientRect, countDownTimeStr } from "@/utils/base";
import { XImage } from "@/components/PreImage";
import { lxla } from "@/constants/images";

import './index.scss'

function Marqueen(props) { 
  const {list} = props  
  const refTimer = useRef(null)
  const refWidth = useRef()
  const refNum = useRef(0)

  // const [text, setText] = useState('ddd')
  const [poLeft, setPoleft] = useState<number>(Taro.getSystemInfoSync().windowWidth);
  const [currIndex, setCurrentindex] = useState(0)
  useEffect(() => {   
    let count = poLeft;

    refNum.current = 0
    computedWidth()
    clearInterval(refTimer.current)
    refTimer.current = setInterval(() => {   
      if (refWidth.current < (-count)) {
        computedWidth()
        refNum.current = refNum.current+1
       
        if (refNum.current > (props.list.length - 1)) {   
          
          refNum.current = 0
        }
      

        setCurrentindex(refNum.current)
        count = Taro.getSystemInfoSync().windowWidth
      }
      count -= 2
      setPoleft((count))
    }, 24)

  }, [list])
  
  const textobj = useMemo(() => {
    return list[currIndex]
  }, [currIndex, list]) 


  const computedWidth = () => {
    Taro.nextTick(() => {
      selectorQueryClientRect('.marquee_text').then(res => {
        refWidth.current = res.width
      })
    })

  }
  

  useUnmount(() => {    
   console.log( '页面离开')
    clearInterval(refTimer.current)
  })



  return <>
    <View className='scroll-wrap'>
      <View className='scroll ovh font28 relative'>
        <View className='marquee_text' style={{ left: `${poLeft}px` }}>
          {/* {text} */}
          <Image src={lxla}  className='lx-lb' />
          {/* <Text>13分钟前</Text> */}
          <Image className='bw-pull-img' src={textobj?.headImg} />
          <Text>
            {textobj?.nickName}
            成功提现了
            <Text style={{color: '#FCE79E'}}>{compose(fen2yuan)(textobj?.withdrawAmount)}</Text>
            元
            </Text>

        </View>
      </View>
    </View>
  </>
}

export default Marqueen