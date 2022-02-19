import { useContext, createContext, useEffect, useMemo } from "react";
import { View, Text, Image, Checkbox } from "@tarojs/components";
import classNames from "classnames";
import { useCallback } from "react";
import * as images from "@/constants/images";


import './index.scss'

const { checkedImg, nocheckedImg } = images

interface IProps {
  value: (string | number)[],
  onChange?: (v: (string | number)[]) => void;
  children: React.ReactNode;
}

const Context = createContext<{
  value: (string | number)[],
  onChange?: (v: (string | number)[]) => void;
}>({
  value: [],
  onChange: () => { },
})

const LabelCtx = createContext({
  name: null
})

function BWCheckbox(props: {
  className?: string;
}) {

  const { value } = useContext(Context)
  const { name } = useContext(LabelCtx)


  const CheckedSVG = useMemo(() => <Image className="check-icon" src={checkedImg} />, [])

  const CheckDefault = useMemo(() => <Image className="check-icon" src={nocheckedImg} />, [])

  const checked = useMemo(() => {
    // @ts-ignore
    return value.includes(name)
  }, [value, name])

  const classname = classNames(
    'bw-checkbox',
    { 'bw-checkbox-checked': checked },
    props.className,
  )

  return <View className={classname}>
    {
      checked ? CheckedSVG : CheckDefault
    }
  </View>
}

BWCheckbox.Label = function (props: {
  for: string | number;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {

  const { value, onChange } = useContext(Context)
  // 此处不能使用 useCallback ？？？
  const handleLabelClick = (() => {
    if (!!props.disabled) return
    const isChecker = value.includes(props.for)
    onChange?.(
      isChecker ?
        value.filter(item => item !== props.for) :
        value.concat(props.for)
    )
  })



  return <LabelCtx.Provider value={{
    // @ts-ignore
    name: props.for
  }}>
    <View className={props.className} onClick={handleLabelClick} >
      {props.children}
    </View>
  </LabelCtx.Provider>
}

BWCheckbox.Group = function (props: IProps) {
  const { children, ...rest } = props
  return <Context.Provider value={rest}>
    {children}
  </Context.Provider>
}

BWCheckbox.Group.defaultProps = {
  value: []
}

export default BWCheckbox