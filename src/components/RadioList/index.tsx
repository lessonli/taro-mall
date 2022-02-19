import classNames from 'classnames'
import { useState } from 'react'
import ListItem from '../ListItem'
import RadioGroup, { Radio } from '../RadioGroup'
import { Text } from '@tarojs/components'
import './index.scss'

interface Iprops {
  defaultValue?: number | undefined,
  radioListOption: {
    icon: any;
    label: string;
    value: number;
    payType?: number,
    desc?: string,
  }[],
  listClassName?: string | undefined
  onChange: (value: any) => void
}

const RadioList = (props: Iprops) => {
  const { radioListOption, onChange, defaultValue = radioListOption[0].value } = props
  const [checkRadio, setCheckRadio] = useState<number>(defaultValue)
  const onRadioCheck = (value: number) => {
    setCheckRadio(value)
    onChange(value)
  }
  const rootClass = classNames(
    'RadioList',
    props.listClassName
  )
  return (
    <div className='RadioList'>
      {
        radioListOption.map((item, index) => {
          return <RadioGroup key={index} onChange={onRadioCheck} value={checkRadio}>
            <ListItem className={props.listClassName} left={<div className='RadioList-item'>
              <img src={item.icon} alt="" />
              <Text className='ml16'>{item.label}</Text>
              {item.desc ? <span className='payValue'>{item.desc}</span> : null}
            </div>} icon={<Radio name={item.value} />}></ListItem>
          </RadioGroup>
        })
      }
    </div>
  )
}

export default RadioList
