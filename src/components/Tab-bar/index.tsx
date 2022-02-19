import Taro, { switchTab } from '@tarojs/taro'
import { shouye0, shouye1, fenlei0, fenlei1, shangjia0, shangjia1, wode0, wode1, fb0, fb1, siliao, dianp } from "@/constants/images";
import './index.scss'
import { useEffect, useMemo, useState } from 'react'
import { Text } from '@tarojs/components';
import { getStatus } from '@/utils/cachedService'
import api2108 from '@/apis/21/api2108';
import storge, { session } from '@/utils/storge';
import Item from 'antd-mobile/lib/popover/Item';
import { useRecoilState } from 'recoil';
import { noReadNumber } from '@/store/atoms';
import api4094 from '@/apis/21/api4094';
import { BwTaro } from '@/utils/base';

const TabBar = (props) => {
  const page = useMemo(() => Taro.getCurrentInstance(), [])
  const { value, type, isOwnShop } = props
  const [noReadNum, setNoReadNum] = useRecoilState(noReadNumber)
  const identity = storge.getItem('userCurrentPosition')
  const list = useMemo(() => {
    let data = [
      {
        pagePath: '/pages/index/index',
        icon: '&#xe70d;',
        text: '首页',
        path: shouye0,
        checkedPath: shouye1,
        icon1: () => { return <i className='myIcon fz50 icon'>&#xe70d;</i> },
        icon2: () => { return <i className='myIcon fz50 icon color333'>&#xe70d;</i> }
      },
      {
        pagePath: '/pages/classify/index',
        text: '分类',
        path: fenlei0,
        checkedPath: fenlei1,
        icon1: () => { return <i className='myIcon fz50 icon'>&#xe709;</i> },
        icon2: () => { return <i className='myIcon fz50 icon color333'>&#xe709;</i> }
      },
      {
        pagePath: '/pages/im/index',
        text: '消息',
        path: shangjia0,
        checkedPath: shangjia1,
        useCache: true,
        icon1: () => { return <i className='myIcon fz50 icon '>&#xe711;</i> },
        icon2: () => { return <i className='myIcon fz50 icon color333'>&#xe711;</i> }
      },
      {
        pagePath: '/pages/my/index/index',
        text: '我的',
        path: wode0,
        checkedPath: wode1,
        icon1: () => { return <i className='myIcon fz50 icon'>&#xe70e;</i> },
        icon2: () => { return <i className='myIcon fz50 color333 icon'>&#xe70e;</i> }
      }]
    if (type === 'store') {
      data = [{
        pagePath: '/pages/index/index',
        text: '首页',
        path: shouye0,
        checkedPath: shouye1,
        icon1: () => { return <i className='myIcon fz50 icon'>&#xe70d;</i> },
        icon2: () => { return <i className='myIcon fz50 icon color333'>&#xe70d;</i> }
      },
      {
        pagePath: '/pages/store/index',
        text: '店铺',
        path: dianp,
        checkedPath: dianp,
        useCache: true,
        icon1: () => { return <i className='myIcon fz50 icon'>&#xe6fe;</i> },
        icon2: () => { return <i className='myIcon fz50 icon color333'>&#xe6fe;</i> }
      }]

      if (isOwnShop !== 1) {
        data.push({
          pagePath: '/pages/im/index',
          text: '私聊',
          path: siliao,
          checkedPath: siliao,
          icon1: () => { return <i className='myIcon fz50 icon '>&#xe705;</i> },
          icon2: () => { return <i className='myIcon fz50 icon color333'>&#xe705;</i> }
        })
      }
    }
    return data
  }, [identity, type, isOwnShop])


  const switchTab = async (index, item) => {
    if (type === 'store') {
      if (index === 2) {
        const result = await api4094({ merchantId: page.router?.params.merchantId })
        Taro.redirectTo({
          url: `/pages/im/message/index?id=${result?.identifier}&type=1`
        })
        return
      }
    }
    if (value - 1 === index) {
      return
    }
    BwTaro.redirectTo({
      url: item.pagePath
    })
  }
  return (
    <div className='bw-tab-bar'>
      {
        list.map((item, index) => {
          return <div className='bw-tab-bar-item' key={index} onClick={switchTab.bind(this, index, item)}>
            {/* <img src={value - 1 === index ? item.checkedPath : item.path} alt="" /> */}
            {value - 1 === index ? item.icon2() : item.icon1()}
            <p className={value - 1 === index ? 'active' : ''}>{item.text}</p>
            {item.text === '消息' && noReadNum > 0 && <Text className='noRead'>{noReadNum}</Text>
            }
          </div>
        })
      }
    </div >
  )
}

export default TabBar
