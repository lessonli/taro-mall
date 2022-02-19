import Taro, { useDidShow } from '@tarojs/taro'
import { zhuanke as img } from '@/constants/images'
import '../index.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IResapi1652 } from '@/apis/21/api1652'
import { ScrollView } from '@tarojs/components'
import { debounce, selectorQueryClientRect } from '@/utils/base'
export type IList = Required<IResapi1652['data']>
interface IProps {
  list: IList,
  value: number
  tableKey?: number | undefined
  onChange: any,
  check: number,
  tabChange: any
}
const Reclassify = (props: IProps) => {
  const { value, list, tableKey, onChange, check, tabChange } = props
  const [heightList, setHeightList] = useState<any>([])
  const [scrollTop, setScrollTop] = useState<number>(Math.random())
  const goSearch = (id, name) => {
    Taro.navigateTo({
      url: `/pages/search/searchList/index?searchId=${id}&searchValue=${name}`
    })
  }


  useEffect(() => {
    // const dom = await selectorQueryClientRect('#swiper')
    // const dom2 = await selectorQueryClientRect('#auction')
    let heightArr = []
    setTimeout(() => {
      list?.forEach(async (item, index) => {
        const dom = await selectorQueryClientRect(`#classify${index}`)
        heightArr.push(dom.top)
        tabChange(0)
      })
    });
    setTimeout(() => {
      setHeightList(heightArr)
    });


  }, [list])


  useEffect(() => {
    //@ts-ignore
    setTimeout(() => {
      setScrollTop(heightList[value] - heightList[0])
    }, 10);
  }, [check])


  const onScroll = (e) => {
    
    heightList.forEach((item, index) => {
      if (index > 0) {
        // console.log(e.detail.scrollTop, heightList[index] - heightList[0]);
        if (e.detail.scrollTop > heightList[index] - heightList[0] - 1) {
          onChange(index)
        }
      }
    })
    if (e.detail.scrollTop <= heightList[1] / 2) {
      onChange(0)
    }
  }
  return (
    // scrollIntoView={`classify${value}`}
    <ScrollView
      onScroll={onScroll}
      scrollY
      // scrollWithAnimation
      scrollTop={scrollTop}
      className='classify-right'>
      <div className='reclassify'>
        {list?.map((item: any, index) => {
          return <div key={index} id={`classify${index}`}>
            <p className='reclassify-title'>
              <span className='reclassify-title-line'></span>
              <span className='reclassify-title-text'>{item.name}</span>
            </p>
            <div className='reclassify-content'>
              {item.children?.map((item: { name: string, icon: string, id: number }, index) => {
                return <div key={index} className='reclassify-content-item' onClick={goSearch.bind(this, item.id, item.name)}>
                  <img src={item.icon} alt="" />
                  <p>{item.name}</p>
                </div>
              })}

            </div>
          </div>
        })}
      </div>
    </ScrollView>
  )
}

export default Reclassify
