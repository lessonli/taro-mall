
import { View, Text } from '@tarojs/components'

import './index.scss'
function Recharge() {
    return(
       <View className='Recharge'>
				<View className='Recharge-panel'>
						<View className='Recharge-panel-account'>
							<View className='Recharge-panel-account-text'>账户余额</View>
							<Text className='Recharge-panel-account-num'>0.00</Text>	
						</View>
						<View></View>
				</View>
       </View>
    )
}

export default Recharge