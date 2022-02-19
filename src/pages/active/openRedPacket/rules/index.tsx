import { View, Text } from "@tarojs/components";
import './index.scss'

function Rules(){
  return <View className='redRules'>
      <View className='redRules-title'>活动规则</View>
      <View className='redRules-content'>
        <View className='redRules-content-title'>【到账范围】</View>
        <View className='redRules-content-com'>
          <View className='redRules-content-com-item'>红包是指用户参与博物有道小程序成功领取红包后获得的现金红包和余额红包。现金红包支持从红包领取记录中手动提现到微信零钱；余额红包领取后自动提现至博物有道钱包账户，不支持提现微信零钱和银行卡，可用于博物有道全平台无门槛消费。</View>
        </View>
        <View className='redRules-content-title'>【红包领取方法】</View>
        <View className='redRules-content-com'>
          <View className='redRules-content-com-item'>1. 用户在博物有道小程序主动领取红包，红包根据【到账范围】进行奖励下发，可通过红包领取记录进入查看红包明细；</View>
          <View className='redRules-content-com-item'>2. 用户a转发红包到微信群或朋友圈，如有其他用户通过用户a分享的红包链接成功领取1个红包，用户a可获得同等金额奖励红包1个，此类奖励红包每日最高可领取10个，按照红包发放时间生效，超出个数该红包奖励不再发放；</View>
          <View className='redRules-content-com-item'>3. 通过分享链接获得的红包，现金红包需手动领取和提现到微信零钱，余额红包系统自动提现至博物有道钱包余额。</View>
        </View>
        <View className='redRules-content-title'>【下单奖励领取方法】</View>
        <View className='redRules-content-com'>
          <View className='redRules-content-com-item'>用户每天参加平台消费随机获得新的下单奖励，订单确认后可自动入账到博物钱包余额，可通过博物有道小程序进入“我的-钱包-余额”查看。</View>
        </View>
        <View className='redRules-content-title'>【余额红包和下单奖励使用方法】</View>
        <View className='redRules-content-com'>
          <View className='redRules-content-com-item'>在博物有道小程序购物时，余额可无门槛抵扣订单金额</View>
          <View className='redRules-content-com-item'>1. 在订单支付时，若用户账户上有余额，可直接使用余额支付。</View>
          <View className='redRules-content-com-item'>2. 用户账户的余额金额与订单金额同等抵扣，即1元余额抵扣1元订单金额；</View>
        </View>
        <View className='redRules-content-title'>【注意事项】</View>
        <View className='redRules-content-com'>
          <View className='redRules-content-com-item'>1.参与活动过程中，需要微信授权，若未授权，可能会出现无法分享或者参与活动的情况。</View>
          <View className='redRules-content-com-item'>2.用户红包领取以博物有道数据库为准，如发现虚假账号、恶意刷奖或伪造兑奖等以不正当手段规避博物有道管理规则、违反有关法律法规、违反《博物有道用户协议》或者存在涉嫌欺诈、商业牟利、不恰当或者不诚实的使用服务或其他违反博物有道规则、本活动规则的行为，博物有道有权终止其参与活动的资格；若已获得现金，博物有道有权追回，并保留追究其法律责任的权利。</View>
          <View className='redRules-content-com-item'>3.禁止使用任何插件、外挂等不正当手段参与活动，如果用户存在违法违规行为，或者通过插件、外挂等非正常手段参与活动，博物有道将取消用户活动资格，撤销相关红包奖励，终止服务，永久冻结博物有道用户账户或采取其他措施。</View>
          <View className='redRules-content-com-item'>4.针对该活动有任何疑问，可联系博物有道客服进行咨询反馈。</View>
          <View className='redRules-content-com-item'>5.请您在认真阅读并理解规则后自主决定是否参加，如您参加，则视为您已清楚了解活动规则并同意遵守。</View>
          <View className='redRules-content-com-item'>6. 本次活动依托腾讯云及雷木数据三方反欺诈平台作为用户账户是否存在违规情况判定依据，凡被第三方风控标示为“异常6类账号”博物有道将取消该用户参加本次活动规则且冻结所有红包奖励。</View>
          <View className='redRules-content-com-item'>7. 本次活动时间为2021年11月22日至2021年12月12日止，参与本次活动获得的现金红包未提现的，将在活动结束后统一提现至该用户的博物钱包-余额中。</View>
          {/* <View className='redRules-content-com-item'>8.本活动最终解释权归杭州山海物道文化创意有限公司所有。</View> */}
        </View>
      </View>
  </View>
}

export default Rules