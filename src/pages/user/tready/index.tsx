
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import ListItem from "@/components/ListItem";
import './index.scss'
import agreements from "@/constants/agreements";
function Tready (){

  const MapList = Object.keys(agreements).map(key => {
    return {
      title: key,
    }
  })

  return (<View className='bw-tready m-t-24'>
    {
      MapList.map((item,index)=>{
        const name = agreements[item.title].name
        return <ListItem 
          key={index} 
          type={1} 
          left={name}
          handleClick={() => {
            Taro.navigateTo({
              url: `/pages/webview/index?name=${encodeURIComponent(item.title)}`
            })
          }}  
        ></ListItem>
      })
    }
  </View>)

}

export default Tready