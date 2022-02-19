import Taro from '@tarojs/taro'
import { useCallback, useState } from 'react'
import { CommonEvent, Input } from '@tarojs/components'
import SearchContainer from '../SearchPage'
import './index.scss'

const Search = (props) => {
  const [value, setValue] = useState(props.value)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const goSearch = useCallback(() => {
    setShowSearch(true)
    // Taro.navigateTo({
    //   url: '/pages/search/index'
    // })
  }, [])

  const onClose = () => {
    setShowSearch(false)
  }
  return (
    <div className='searchBox'>
      <div className='searchBox-box' onClick={goSearch}>
        <i className='myIcon'>&#xe710;</i>
        <Input placeholder='搜索' value={value}></Input>
      </div>
      {showSearch && <SearchContainer onClose={onClose}></SearchContainer>}
    </div >


  )
}


export default Search
