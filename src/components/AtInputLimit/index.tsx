// import { AtInput } from "taro-ui";
// import { AtInputProps } from "taro-ui/types/input";
// import { Text, View } from "@tarojs/components";

//  Atinput 以及Input 无法 拦截输入值 因此改用原生
const AtInputLimit = (props: {
}) => {
  const results = {
    ...props,    
    onInput: (v, event) =>{   
      let val = v
      if(v.length >=props.maxlength){
        val = v.substring(0, props.maxlength)
      }
      props.onInput(val, event)
      return val
    },
  }
  return <input {...results} />
}

export default AtInputLimit