import { AtInput } from "taro-ui";
import { AtInputProps } from "taro-ui/types/input";

import { yuan2fen, fen2yuan } from "@/utils/base";

const Hoc = (props: AtInputProps & {
  /**
   * 输入转化 如 分 => 元
   */
  formatter?: (v: string | number) => string | number;
  /**
   * 输出转化 如 元 => 分
   */
  parser?: (v: string | number) => string | number;
}) => {

  const results = {
    ...props,
    // @ts-ignore
    value: props.formatter ? props.formatter(props.value) : props.value,
    // @ts-ignore
    onChange: (v, event) => props.onChange?.(props.parser ? props.parser(v) : v, event),
  }

  return <AtInput {...results} />
}

export default Hoc

const fenToYuan = (num: any) => {
  if (['', undefined, 'undefined', null].includes(num)) return ''
  var regexp = /(?:\.0*|(\.\d+?)0+)$/
  num = (num / 100).toFixed(2)
  num = num.replace(regexp, '$1')
  return num
}

export const AtInputMoney = (props: AtInputProps) => {
  const formatter = (v) => {
    let x = fenToYuan(v)
    if (x === 'NaN') x = ''
    return x
  }

  const parse = v => {
    let x = yuan2fen(v)
    if (isNaN(x)) x = ''
    return x
  }

  return <Hoc type='digit' formatter={formatter} parser={parse} {...props} />
}