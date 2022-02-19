import { View, Text } from "@tarojs/components";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { useCallback, useState } from "react";
import './index.scss'
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useAsync } from "@/utils/hooks";

const Com = (props: {
  fee: number | string;
  length?: number;
  title?: string
  onSubmit: ((v: string) => any) | ((v: string) => Promise<any>);
}, ref) => {

  const l = props.length || 6

  const arr = [1,2,3,4,5,6,7,8,9,11, 0, 10]
  const [state, setstate] = useState<number[]>([]);

  const {run: handleSubmit, pending} = useAsync(props.onSubmit, {manual: true})

  const handNum = useCallback(async (v) => {
    let s = [...state]
    
    if (v !== 11 && state.length < l) {
      s.push(v)
      setstate([...s])
    }

    if (s.length === l && !pending) {
      
      // Taro.showLoading({
      //   title: '正在支付'
      // })
      handleSubmit(s.join(''))
    }
  }, [state, pending])

  const handDel = useCallback(() => {
    const s = [...state]
    s.pop()
    setstate(s)
  }, [state])

  const clear = () => {
    setstate([])
  }

  useImperativeHandle(ref, () => ({
    clear,
  }))

  return <View className="PayPassword">
    <View className="PayPassword-1">
      <View className="PayPassword-1-header">
        <View>{props.title || '支付金额'}</View>
        <View className="PayPassword-1-header-num">￥<Text className="PayPassword-1-header-money">{props.fee}</Text></View>
      </View>
      <View className="PayPassword-1-passwords">
      {
        Array(l).fill(0).map((_, i) => {
          const classname = classNames(
            'PayPassword-1-passwords-item',
            {
              'PayPassword-1-passwords-item__active': state.length > i,
            }
          )
          return <Text key={i} className={classname}>
          {i}
        </Text>
        })
      }
      </View>
    </View>

    <View className="PayPassword-2">
      {
        arr.map(item => {

          const c = classNames(
            'PayPassword-2-item',
            `PayPassword-2-item-${item}`,
            {
              'myIcon': item === 10
            }
          )
          
          return item === 10 ? <Text key={item} className={c} onClick={handDel}>&#xe718;</Text> : <Text onClick={() => handNum(item)} key={item} className={c}>{item}</Text>
        })
      }
    </View>
  </View>
}

export default forwardRef(Com)