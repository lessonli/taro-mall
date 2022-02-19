import Taro from '@tarojs/taro'
import { Input } from '@tarojs/components'
import { deletePic } from '@/constants/images'
import storge from '@/utils/storge'
import './index.scss'
import { useCallback, useEffect, useMemo, useState } from 'react'
import api1868, { IResapi1868 } from '@/apis/21/api1868'
import NavigationBar from '@/components/NavigationBar'
export type IEvaluate = Required<Required<IResapi1868>['data']>
const searchContainer = () => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const [value, setValue] = useState<any>('')
  const [focus, setFocus] = useState<boolean>(false)
  const [list, setList] = useState<IEvaluate>()
  const [historyList, setHistoryList] = useState<string[]>(storge.getItem('searchHistory'))
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
  useEffect(() => {
    (async () => {
      const result = await api1868()
      console.log(result);
      result && setList(result)
    })()
  }, [])

  // 后退
  const goBack = () => {
    Taro.navigateBack()
  }

  const deleteHistory = useCallback(
    () => {
      setHistoryList([])
      storge.setItem('searchHistory', [])
    },
    [],
  )

  const handInput = useCallback((e) => {
    setValue(e.detail.value)
  }, [])

  const handleClick = useCallback((key) => {
    if (value || key) {
      const lastArr = storge.getItem('searchHistory')
      if (!lastArr.includes(key || value)) {
        lastArr.unshift(key || value)
      }
      storge.setItem('searchHistory', lastArr)
      Taro.navigateTo({
        url: `/pages/search/searchList/index?searchValue=${key || value}`
      })
    } else {
      setValue('')
      Taro.navigateBack()
    }
  }, [value])

  const tagClick = (value) => {
    handleClick(value)
  }

  return (
    <div className='search-module'>
      <NavigationBar
        title={'搜索'}
        background={'#ffffff'}
      />
      <div className='searchContainer'>
        <i className='myIcon searchContainer-back' onClick={goBack}>&#xe707;</i>
        <div className='searchContainer-box'>
          <i className='myIcon'>&#xe710;</i>
          <Input placeholder={page?.router?.params.searchValue || '请输入关键字查询'} onInput={handInput} onFocus={setFocus.bind(this, true)} onBlur={setFocus.bind(this, false)} value={value}></Input>
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

export default searchContainer
