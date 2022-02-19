
import { View, Image } from '@tarojs/components'
import './index.scss'
import { bw_icon } from '@/constants/images'
import ListItem from '@/components/ListItem'
import Taro from '@tarojs/taro'
import { XImage } from '@/components/PreImage'

function AboutBw(){
  const mapList = [
    {title: '服务用户协议', name: '用户协议' },
    {title: '隐私政策', name: '隐私政策'}
  
  ]
  return(
    <View className='bwAbout'>
        <View className='bwAbout-logo'>
          <Image className='bwAbout-logo-img' src={bw_icon}></Image>
        </View>
        <View>
          {/* <ListItem type={1} left ={<View>给个好评</View>} /> */}
          {/* <ListItem type={1} left ={<View>服务用户协议</View>} />
          <ListItem type={1} left ={<View>隐私政策</View>} /> */}
          { mapList.map((item,idx)=>{
            return <ListItem type={1} left ={item.title} handleClick={()=> {
              Taro.navigateTo({
                url: `/pages/webview/index?name=${encodeURIComponent(item.name)}`
              })
            }}  ></ListItem>
          })}
        </View>
    </View>
  )
}

export default AboutBw