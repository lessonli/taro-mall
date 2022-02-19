import { start1, start2 } from "@/constants/images"
import { View, Image } from "@tarojs/components"

import "./stars.scss";

export default (props: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) => {
  return <View className={`bw-stars ${props.className || ''}`}>
    {
      new Array(5).fill(1).map((_, i) => <Image key={i} src={i < props.value ? start2 : start1} className="bw-stars-item" onClick={() => props.onChange(i + 1)} />)
    }
  </View>
}