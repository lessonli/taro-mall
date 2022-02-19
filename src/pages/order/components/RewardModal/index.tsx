

import { View, Text, Image } from "@tarojs/components";

import BwModal from "@/components/Modal";
import { reward2 } from "@/constants/images";

import { Iprops } from "@/components/Modal";
import './index.scss'
interface IRewardModal extends Iprops  {

}

function RewardModal(props:IRewardModal){

  return <View className='rewardModal'>
    <BwModal 
      title={props.title}
      visible={props.visible}
      onCancel={props.onClose}
      onClose={props.onClose}
      confirmText='去看看'
      onConfirm={props.onConfirm}
      content={<View>
        <View>可前往【我的钱包-余额】查看</View>
        <Image className='rewardModal-img' src={reward2}></Image>
      </View>}

    />
  
  </View>
}


export default RewardModal