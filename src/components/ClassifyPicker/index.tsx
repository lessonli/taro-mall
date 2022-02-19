import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import classnames from "classnames";

import Popup, { IProps as IPopupProps } from "@/components/Popup";
import { getCategories } from "@/utils/cachedService";

import { IResapi1652 } from "@/apis/21/api1652";

import './index.scss'
import { useState, useEffect, useMemo, useCallback } from 'react';

type IProps = IPopupProps & {
  defaultValue?: [string, string];
  categories?: any[];
}

export default (cprops: IProps) => {

  const { defaultValue, ...props } = cprops

  const [level1Value, setLevel1Value] = useState<number | string>('')

  const [level2Value, setLevel2Value] = useState<number | string>('')

  const {categories = [], visible, onClose, onOk, ...props2} = props

  const level2s = useMemo(() => categories?.find(level1Item => level1Item.id === level1Value)?.children, [categories, level1Value])

  useEffect(() => {
    if (defaultValue) {
      const [v1, v2] = defaultValue
      setLevel1Value(v1)
      setLevel2Value(v2)
    } else {
      const id = categories?.[0]?.id
      setLevel1Value(id)
    }
    
  }, [categories, defaultValue])

  const handleOk = (() => {
    return new Promise((resolve, reject) => {
      if (!level2Value) {
        Taro.showToast({
          icon: 'none',
          title: '请选择二级分类'
        })
        reject()
      } else {
        onOk?.([level1Value, level2Value])
        resolve(undefined)
      }
    })
  })

  const handleSet1 = (id) => {
    // const s2 = categories?.find(level1Item => level1Item.id === id)?.children?.[0]?.id || ''
    setLevel1Value(id)
    setLevel2Value('')
    // setLevel2Value(s2)
  }


  return <View className="ClassifyPicker">
    <Popup
      title="选择分类"
      headerType="close"
      visible={visible}
      {...props2}
      // onOk={handleOk}
    >
      <View className="classify-content">
        
        <View className="level1s">
          {
            categories.map((level1, i) => {
              return <View className={classnames('level1', { 'level1-active': level1.id === level1Value })} key={i} onClick={() => handleSet1(level1.id)}>{level1.name}</View>
            })
          }
        </View>

        <View className="level2s float">
          {
            level2s?.map((level2Item) => {
              return <View
                key={level2Item.id}
                className={classnames('level2Item', { 'level2Item-active': level2Value === level2Item.id})}
                onClick={() => {
                  setLevel2Value(level2Item.id)
                  // handleOk(level2Item.id)
                  onOk?.([level1Value, level2Item.id])
                }}
              >{level2Item.name}</View>
            })
          }
        </View>
      </View>
    </Popup>
  </View>
}