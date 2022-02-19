import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import SearchModule from '@/components/SearchModule'
import TabLayout from './components/tabLayout'
import Reclassify from './components/reclassify'
import H5TabBar from '@/components/Tab-bar';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { IResapi1652 } from '@/apis/21/api1652'
import './index.scss'
import { getCategories } from '@/utils/cachedService'
import { useWxShare } from '@/utils/hooks'
import { nextTick } from '@tarojs/runtime'
import NavigationBar, { navigationBarInfo } from '@/components/NavigationBar'
import TabBar from '@/components/Tab-bar'
import { selectTabIndex } from '@/store/atoms'
import { useRecoilState } from 'recoil'
// import TabBar from '@/custom-tab-bar'
export type IList = Required<IResapi1652['data']>
const Classify = () => {
  const [tableKey, setTableKey] = useState<number>()
  const [checkValue, setCheckValue] = useState<number>()
  const [list, setList] = useState<IList>()
  const [selected, setSelected] = useRecoilState(selectTabIndex)

  const tabChange = useCallback((value) => {
    setTableKey(value)
    setCheckValue(value)
  }, [])

  const onChange = (value) => {
    setTableKey(value)
  }

  useWxShare()

  const defaultChange = () => {
    tabChange(0)
  }


  useDidShow(() => {
    (async () => {
      setSelected(1)
      const tabList = await getCategories()
      setList(tabList)
      // setTimeout(() => {
      //   tabChange(0)
      // }, 2000);
    })()
  })
  return (
    <View>
      {/* <StickBox>
          <SearchModule></SearchModule>
        </StickBox> */}
      <NavigationBar
        title={'分类'}
        background={'#ffffff'}
      />
      <View className='classify-top' style={{ top: process.env.TARO_ENV === 'weapp' ? navigationBarInfo?.navigationBarAndStatusBarHeight + 'px' : 0 }}>
        <SearchModule></SearchModule>
      </View>
      {/* <View className='tianchong'></View> */}
      <View className='classify'>
        <View className='classify-left'>
          <TabLayout list={list} value={tableKey} onChange={tabChange}></TabLayout>
        </View>
        <Reclassify list={list} value={tableKey} check={checkValue} onChange={onChange} tabChange={defaultChange}></Reclassify>
      </View>
      {process.env.TARO_ENV !== 'weapp' && <TabBar value={2} />}
    </View>
  )
}

export default Classify
