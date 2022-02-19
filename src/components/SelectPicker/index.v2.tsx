import React, { useState, useEffect, useCallback, useMemo } from "react";

import * as ReactDOM from "react-dom";
import { PickerView, PickerViewColumn, View, Text } from "@tarojs/components";
import Popup, { IProps as IPopup } from "@/components/Popup";
import { PickerView as APickerView } from "antd-mobile";
import isEqual from 'lodash/isEqual'

import { getChinaAddsTree, IChinaTree } from "@/utils/cachedService";
import { useRef } from "react";

const BWPicker = (
  props: {
    visible: boolean;
    onVisibleChange?: (v: boolean) => void;
    data: IChinaTree;
    value: string[];
    onChange: (v: string[]) => void;
    cols: number;
    title?: string;
  } & IPopup,
) => {

  const prevValRef = useRef(props.value)
  const currentValRef = useRef(props.value)

  const [weappVal, setWeappVal] = useState([0, 0, 0])
  const [arrInArrs, setarrInArrs] = useState()

  const findItems = (source, indexs) => {
    return indexs.reduce((res, item, i) => {
      // console.log('i', JSON.stringify(res), item, i)
      res[i] = i === 0 ? source[item] : res[i - 1]?.children?.[item]
      return res
    }, [])
  }

  const handleChange = ((e) => {
    // 第一次 与 第二次
    // props.cols
    const state = [...e.detail.value]
    let r = [...e.detail.value]
    if (isEqual(r, prevValRef.current)) return
    // l-1 前的值不相等，后续的值0
    // 修复taro picker 快速滑动，下标响应不对
    Array(props.cols).fill(null).forEach((item, index) => {
      if (index !== props.cols - 1) {
        if (state[index] !== prevValRef.current?.[index]) {
          Array(props.cols).fill(null).forEach((_, j) => {
            if (j > index) {
              r[j] = 0
            }
          })
        }
      }
    })
    prevValRef.current = r
    const s = findItems(props.data, r)
    // console.log(e.detail.value, s)
    const v = s.map(item => {
      return item?.value
    })

    currentValRef.current = v
    const c = arrInArrsFn(v)
    setarrInArrs(c)
    setWeappVal(weappValue(v))
    console.log(v, c);
  })

  const weappValue = useCallback((propsValue) => {

    const arr: number[] = []

    const fn = (source: any[], index: number) => {
      source.forEach((item, i) => {
        if (item.value === propsValue?.[index]) {
          arr[index] = i
          if (item.children && item.children.length) {
            fn(item.children, index + 1)
          }
        }
      })
    }
    fn(props.data, 0)
    return arr
  }, [props.data])

  const arrInArrsFn = (propsValue) => {
    const a = Array(props.cols).fill(undefined)
    return a.reduce((res, current, index) => {
      if (index === 0) {
        res[index] = props.data
      } else {
        if (!propsValue) {
          res[index] = res[index - 1]?.[0]?.children || []
        } else {
          res[index] = res[index - 1]?.find((item) => item.value === propsValue?.[index - 1])?.children || []
        }
      }
      return res
    }, [])

  }

  useEffect(() => {
    setarrInArrs(
      arrInArrsFn(props.value)
    )
  }, [props.data, props.cols])

  const handleH5Change = (v) => {
    console.log('handleH5Change', v);
    
    currentValRef.current = v
  }

  const onSubmit = () => {    
    // 如果没有选值 点击了保存 默认给0
    if (!currentValRef.current || currentValRef.current.length === 0) {
      const a = new Array(props.cols).fill(null)
      const val = a.reduce((res, _, index) => {
        if (index === 0) {
          res[index] = props.data[0]
        } else {
          res[index] = res[index - 1]?.children?.[0]
        }
        return res
      }, [])
      currentValRef.current = val.map(ele => ele.value)
    }    
    props.onChange?.(currentValRef.current)
    props.onOk?.()
  }

  const onVisibleChange = (bool) => {
    
    props.onVisibleChange?.(bool)
  }

  const h5Props = {
    ...props,
    onChange: handleH5Change,
    cascade: true,
  }

  return <Popup
    headerType={props.headerType}
    title={props.title}
    visible={props.visible}
    onOk={onSubmit}
    onVisibleChange={onVisibleChange}
  >
    {
      process.env.TARO_ENV === 'weapp' && (
        <PickerView
          indicatorStyle="height: 50px"
          className='picker'
          style='width: 100%; height: 300px; text-align: center;'
          value={weappVal}
          onChange={handleChange}
        >

          {
            Array(props.cols).fill(null).map((item, index) => {
              return <PickerViewColumn key={index}>
                {
                  arrInArrs?.[index]?.map(itemChild => (
                    <View key={itemChild.value} style='line-height: 50px'>{itemChild.label}</View>
                  ))
                }
              </PickerViewColumn>
            })
          }
        </PickerView>
      )
    }

    {
      process.env.TARO_ENV === 'h5' && (
        <APickerView
          {...h5Props}
        ></APickerView>
      )
    }
  </Popup >
}

export default BWPicker