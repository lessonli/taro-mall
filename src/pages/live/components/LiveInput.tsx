import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRef, useState } from 'react'

import './index.scss'

interface Iprops {
  autoFocus?: true | false
  sendMessage: Function
  onBlur: Function
  phrases: string[]
}

const LiveInput = (props: Iprops) => {

  const [value, setValue] = useState<string>('')
  const { sendMessage, autoFocus, onBlur, phrases } = props
  const inputValue = useRef()

  const getInput = (e) => {
    inputValue.current = e.target.value
  }

  const send = (text) => {
    if (inputValue.current) {
      sendMessage(inputValue.current)
    }
    setValue('')
    onBlur()
  }

  const sendPhrases = (text) => {
    sendMessage(text)
    inputValue.current = null
  }


  return (
    <View className='Live-input'>
      <View className='Live-inputBox-hide' onTouchEnd={() => { onBlur() }}></View>
      <View className='Live-inputBox'>
        <View className='Live-inputBox-tips'>
          <View className='Live-inputBox-tips-box'>
            {phrases.map((item, i) => {
              return <Text key={i} className='Live-inputBox-tips-box-item' onClick={() => { sendPhrases(item) }}>{item}</Text>
            })}
          </View>
        </View>
        <View className='Live-inputBox-container'>
          <Input id='input' focus={autoFocus} holdKeyboard={true} cursorSpacing={20} className="Live-inputBox-container-input" onInput={getInput} onConfirm={send} ></Input>
          <Text className='Live-inputBox-container-send' onClick={send}>发送</Text>
        </View>
      </View>
    </View>
  )
}

export default LiveInput
