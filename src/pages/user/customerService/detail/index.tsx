import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import NavigationBar, {SingleBackBtn} from "@/components/NavigationBar";
import { titleObj, dataMap } from "./constents";
import './index.scss'


function Detail(){
  const {type} = Taro.getCurrentInstance().router?.params
  return (
    <View className='bw-help-detail'>
      {/* <NavigationBar background='#fff' leftBtn={<SingleBackBtn />} title={titleObj[type]}></NavigationBar> */}
      <View className='bw-help-detail-title'> {titleObj[type]}</View>
      {
        dataMap.get(type)?.map(item=>{
          return <View key={item.ans}>
            <View className='bw-help-detail-tit'>{item.que}</View>
            <View className='bw-help-detail-con'>{item.ans}</View>
            {
              item.children && item.children.length>0 && <View>
                {item.children.map((item2,index)=>{
                  return (
                    <View className='bw-help-detail-tit-child' key={index}> {item2} </View>
                  )
                })}
              </View>
            }
          </View>
        })
      }
    </View>
  )
}

export default Detail