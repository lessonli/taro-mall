

import {View, Text, ScrollView} from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useState, useCallback, useEffect, useMemo } from 'react'
import {useRequest} from 'ahooks'
import Taro from '@tarojs/taro'
import Tabs from '@/components/Tabs'
import ListItem from '@/components/ListItem'
import { ACCOUNT_BALANCE_STATUS, REGS } from '@/constants'
import Empty from '@/components/Empty';

import './index.scss'
import dayjs from 'dayjs'
import PayFeePopup from '@/components/PayFeePopup'
import BwModal from '@/components/Modal'
import { empty } from '@/constants/images'
import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan, yuan2fen } from "@/utils/base";
import api2876, {IResapi2876} from '@/apis/21/api2876'
import api3728, {IResapi3728} from '@/apis/21/api3728'
import api2516 from '@/apis/21/api2516'
import paySdk from '@/components/PayFeePopup/paySdk'
import { getConfigSwitch } from '@/utils/cachedService'
export type Idata = Required<IResapi2876>['data']

const opts = Object.keys(ACCOUNT_BALANCE_STATUS).map(key => ACCOUNT_BALANCE_STATUS[key])
const Left = (item)=>{
	return (<View className='accountBalance-list-left'>
	<View className='accountBalance-list-left-text'>{item.title}</View>
	<View className='accountBalance-list-left-date'>{dayjs(item?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</View>
</View>)
}

const Item =(props) =>{
	const {item} = props
	return<ListItem  
	 left={Left(item)}
	  right={<Text className={`accountBalance-list-add ${item?.amountSign ===1 ?'SystemAccountInfoColor' : 'color333'}`}>{item?.amountSign === 1 ? '+': '-'}{compose(formatMoeny, fen2yuan)(item?.tradeAmount)}</Text>}
		icon={null}
/> 
}

function AccountBalance() {
	const [currentValue, setCurrentValue] = useState(ACCOUNT_BALANCE_STATUS.all.value)
	const [info, setinfo] = useState<Idata>()
	const [money, setMoney] = useState<string>()
	const [visible, setVisible] = useState({
		recharge:false,
		payFeePopup: false

	})
	
	const notOpen = ()=>{
		Taro.showToast({
			icon: "none",
			title: '暂未开放'
		})
	}
	useEffect(()=>{
		(async()=>{
		const res = 	await api2876()
		setinfo(res)
		})()
	},[])

	const service = useCallback(async (
    // 获取商品
    result?: { pageNo: number, pageSize: number }
  ) => {

    
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize = result?.pageSize || 9

 
    const res = await api3728({
			type: currentValue,
      pageNo,
      pageSize
    })

    return {
      list: res?.data,
      total: res?.total,
      pageNo,
      pageSize,
    }
  }, [currentValue])
		const { data, loadMore, loading,reload, loadingMore, noMore } = useRequest(service, {
			loadMore: true,
			refreshDeps: [currentValue],
			debounceInterval: 200,
			isNoMore: (d) => (d ? d.list.length >= d.total : false),
		// loadingDelay: 500,
	})

		const listStatus = useListStatus({
			list: data?.list,
			loading,
			noMore
		})

		
		const balanceService = () => api2516({
			rechargeAmount: compose(yuan2fen)(money)
    })

		const toPay = () =>{
			return paySdk(balanceService).then(res=>{
					setVisible({...visible, payFeePopup:false})
					setMoney('')
					Taro.showToast({ title: '充值成功', icon: 'none' })
					api2876().then((res2) => {
						setinfo(res2)
					})
				})
		}
		const handleCancel =()=>{
			setVisible({...visible, recharge: false})
		}
		const handleRechange= async () => {
			const res = await getConfigSwitch()
			if (!Boolean(res?.enableRecharge)) {
				return Taro.showToast({
					icon: 'none',
					title: '充值暂未开放，敬请期待~'
				})
			}
			setMoney('')
			setVisible({...visible, recharge:true})
		}
		const handleConfirm=()=>{
			if(money?.length === 0) {
				return Taro.showToast({
					title: '请输入充值金额',
					icon: 'none'
				})
			}
			if (!REGS.price.pattern.test(money)) {
				return Taro.showToast({
					title: '金额格式有误',
					icon: 'none'
				})
			}
			setVisible({...visible, recharge:false, payFeePopup:true})
		}
		const Row = useCallback(({data, index}) => <Item item={data[index]}  />, [data])
    return(
       <View className='accountBalance full-screen-page'>
           <View className='accountBalance-bg'>
						<View className='accountBalance-bg-account'>
							<View className='accountBalance-bg-account-text'>账户余额</View>
							<View className='accountBalance-bg-account-num'>{compose(formatMoeny, fen2yuan)(info?.availableAmount)}</View>
						</View>
						<View className='accountBalance-bg-add'
						// onClick={()=> notOpen()}
						onClick={()=>handleRechange()}
						>
							充值
						</View>
						<View className="fz24 colorEEE accountBalance-intaion">注：账户余额可用于支付订单等，不支持提现</View>
           </View>
					 <View className='accountBalance-tabs m-t-24'>
						 <Tabs options={opts} value={currentValue} onChange={setCurrentValue}></Tabs>
					 </View>
					 <VirtualScrollList 
							loadMore={loadMore}
							subHeight = {getRealSize(268)}
							itemSize ={getRealSize(144)}
							row={Row}
							data={data}
							listStatus={{
								noMore,
								loading: loading || loadingMore,
							}}
							emptyProps= {{
								text: '暂无数据'
							}}
						>
      		</VirtualScrollList>
					 <PayFeePopup
					 disableYUEPay
					 visible={visible.payFeePopup}  
					 headerType="empty"
					 disableYUEPay
					 fee={money *100 || 0} 
					 onSubmit={toPay} 
					 onVisibleChange={()=>setVisible({...visible, payFeePopup:false})}
					 >

					 </PayFeePopup>

					 <BwModal title={'充值金额'} visible={visible.recharge} content={<View> 
						 		<AtInput  
									name='money'
									type="digit"
									value={money} 
									placeholder='请输入充值金额'	
									onChange={(v)=> setMoney(v)} >
									
									</AtInput>
						  </View>} 
							onConfirm = {()=>handleConfirm()}
							onCancel={()=>handleCancel()}
							onClose = {()=>handleCancel()}
							/>
       </View>
    )
}


export default AccountBalance