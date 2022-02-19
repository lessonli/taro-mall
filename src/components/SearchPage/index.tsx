import Taro from '@tarojs/taro'
import { Input } from '@tarojs/components'
import { deletePic } from '@/constants/images'
import storge from '@/utils/storge'
import './index.scss'
import { useCallback, useEffect, useMemo, useState } from 'react'
import api1868, { IResapi1868 } from '@/apis/21/api1868'
import { useDidShow } from '@tarojs/runtime'
import { navigationBarInfo } from '../NavigationBar'
export type IEvaluate = Required<Required<IResapi1868>['data']>
const SearchContainer = (props) => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [value, setValue] = useState<any>('')
  const [focus, setFocus] = useState<boolean>(true)
  const [list, setList] = useState<IEvaluate>()
  const [historyList, setHistoryList] = useState<string[]>(storge.getItem('searchHistory'))
  const { onClose } = props
  const Tag = function (props) {
    const tagClick = useCallback((value) => {
      props.onClick(value)
      // Taro.navigateTo({
      //   url: `/pages/search/searchList/index?searchValue=${value}`
      // })
    }, [])
    const { label } = props
    return (
      <span className='bw-tag' onClick={tagClick.bind(this, label)}>
        {label}
      </span>
    )
  }

  useDidShow(() => {
    setFocus(true)
  })

  useEffect(() => {
    (async () => {
      setFocus(true)
      const result = await api1868()
      result && setList(result)
      console.log(page.router, 111);
    })()
  }, [])

  // 后退
  const goBack = () => {
    // Taro.navigateBack()
    onClose()
  }

  const deleteHistory = useCallback(
    () => {
      setHistoryList([])
      storge.setItem('searchHistory', [])
    },
    [],
  )

  const handInput = useCallback((e) => {
    setValue(e.target.value)
  }, [])

  const handleClick = useCallback((key) => {

    if (value === " " || value === "  ") {
      Taro.showToast({
        title: '请不要输入纯空格',
        icon: 'none'
      })
      return
    }
    if ((value || key)) {
      const lastArr = storge.getItem('searchHistory')
      if (!lastArr.includes(key || value)) {
        lastArr.unshift(key || value)
      }
      storge.setItem('searchHistory', lastArr)
      Taro.navigateTo({
        url: `/pages/search/searchList/index?searchValue=${key || value}`
      })
      setValue('')
      onClose()
    } else {
      setValue('')
      onClose()
      // Taro.navigateBack()
    }
  }, [value])

  const tagClick = (value) => {
    handleClick(value)
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      handleClick(value)
    }
  }

  return (
    <div className='search-module' style={{ top: process.env.TARO_ENV === 'weapp' && page.router?.path !== '/pages/index/index' ? navigationBarInfo?.navigationBarAndStatusBarHeight + 'px' : 0 }}>
      <div className='searchContainer'>
        <i className='myIcon searchContainer-back' onClick={goBack}>&#xe707;</i>
        <div className='searchContainer-box'>
          <i className='myIcon'>&#xe710;</i>
          <input className='searchContainer-box-input' autoFocus={focus} placeholder={page?.router?.params.searchValue || ''} type='search' onKeyPress={onKeyDown} onInput={handInput} ></input>
        </div>
        <div className='searchContainer-btn' onClick={() => { handleClick(null) }}>
          {value ? '搜索' : '取消'}
        </div>
      </div>
      {historyList.length > 0 && <div className='search-module-history'>
        <div className='search-module-history-title'>
          <span>历史记录</span>
          <img src={deletePic} alt="" onClick={deleteHistory} />
        </div>
        <div className='search-module-history-content'>
          {historyList && historyList.map((item, index) => {
            return index <= 9 && <Tag onClick={tagClick} key={index} label={item} />
          })
          }
        </div>
      </div>}
      <div className='search-module-hot'>
        <div className='search-module-hot-title'>
          <span>热门搜索</span>
        </div>
        <div className='search-module-hot-content'>
          {list && list.map((item, index) => {
            return <Tag onClick={tagClick} key={index} label={item} />
          })
          }
        </div>
      </div>
    </div>
  )
}

export default SearchContainer
