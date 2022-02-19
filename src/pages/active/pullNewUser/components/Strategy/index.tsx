

import { View, Text,Image  } from "@tarojs/components";
import { XImage } from "@/components/PreImage";
import { yqgl } from "@/constants/images";
// import { inviteStrategy } from "../../constants";

import './index.scss'

function Strategy(props){
  return <View className='bw-pull-new-strategy-list'>
    <Image className='bw-pull-new-strategy-list-img' src={yqgl}></Image>
  </View>

}

export default Strategy