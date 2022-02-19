import { Label, Radio, RadioGroup, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ReactNode } from 'react'

import './index.scss'

interface IRedBagItem {

  Radio: ReactNode

  currentRedBag?: any

}

export const RedBagItem = (props: IRedBagItem) => {
  return <View className='bw-RedBag-item'>
    <View className='bw-RedBag-item-left'>
      {/* <XImage></XImage> */}
    </View>
    <View className='bw-RedBag-item-right'>

    </View>
    {
      props.Radio
    }
  </View>
}

interface IRedBag {

  redBagList: Array<any>

}

const RedBag = (props: IRedBag) => {

  const onRadioCheck = () => {

  }

  return (
    <View className='bw-RedBag'>
      <RadioGroup onChange={onRadioCheck}>
        {
          props?.redBagList && props?.redBagList.map(item => {
            return <Label>
              <RedBagItem currentRedBag={item} Radio={<Radio className='bgWhite' value={item.uuid} ></Radio>}></RedBagItem>
            </Label>
          })
        }
      </RadioGroup>
    </View>
  )
}

export default RedBag
