

import { View, Text, Textarea } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useState, useCallBack, useMemo, useEffect, useCallback } from "react"
import NavigationBar, {SingleBackBtn} from "@/components/NavigationBar"
import api2476, {IResapi2476} from "@/apis/21/api2476"
import compose, {formatMoeny, fen2yuan } from "@/utils/base"
import api2108, {IResapi2108} from "@/apis/21/api2108"
import { AtButton } from "taro-ui"
import api3866, {IResapi3866} from "@/apis/21/api3866" // 货款配置
import api3884 from "@/apis/21/api3884" // 佣金配置
import { useBoolean } from "ahooks"
import BwModal from "@/components/Modal"
import storge, {session} from "@/utils/storge"


import './index.scss'
import { useDidShow } from "@tarojs/runtime"

export type Iconfig = Required<IResapi3866>['data']
export type IData = Required<IResapi2476>['data']
export type Istatus = Required<IResapi2108>['data']

function PaymentForGoods() {
	const isCommission = Taro.getCurrentInstance().router?.params.commission // 1佣金 2 货款
	console.log(isCommission, 'isCommission');
	const [info, setInfo] = useState<IData>()
	const [userStatus, setUserStatus]  = useState<Istatus>()
	const [visible, setVisible] = useState(false)
	const [config, setConfig] = useState<Iconfig>()
	// const [des, setDes] = useState([]) // 提现说明

	useDidShow(()=>{
		(async()=>{
			const res = await api2476()
			const status = await api2108()
			setInfo(res)
			setUserStatus(status)
		})()
	})

	useDidShow(()=>{
		(async()=>{
			const fn = isCommission ==='1'? api3884: api3866
			const config = await fn()
			setConfig(config)
		})()
	})

		//  是否有提现权限
	const handleWithdrawAuth = ()=>{
		if(config?.enableWithdraw === 0) {
			Taro.showToast({icon:"none", title:'不允许提现'})
			return false
		}
		return true
	}
	//  是否实名认证
	const handleApprove = ()=>{
		if(userStatus?.authStatus === 0){
			return	setVisible(true)
		}
	}

	const handleWithdraw = ()=>{
		if(!handleWithdrawAuth()){
			return
		}
		handleApprove()
		if(userStatus?.authStatus === 2){
			const path = Taro.getCurrentInstance().router?.path
			let currentPath =  path
				let targetUrl = '/pages/user/withdraw/index'
				session.setItem('pages/user/withdraw/index', {
					withdrawLimitMin:config?.withdrawLimitMin,
					withdrawLimitMax: config?.withdrawLimitMax,
					productAvailableAmount: info?.productAvailableAmount,
					type: isCommission,
					commissionAvailableAmount: info?.commissionAvailableAmount,
					bankCardNo: config?.bankCardNo,
					sourceUrl: currentPath
				})
				Taro.navigateTo({
					url: targetUrl
					// url: `${targetUrl}?sourceUrl=${currentPath}&
					// withdrawLimitMin=${config?.withdrawLimitMin}
					// &withdrawLimitMax=${config?.withdrawLimitMax}&
					// bankCardNo=${config?.bankCardNo}&
					// productAvailableAmount=${info?.productAvailableAmount}
					// &type=${isCommission}&
					// commissionAvailableAmount=${info?.commissionAvailableAmount}`
				})
				console.log(session.getItem('pages/user/withdraw/index'));
				
		}
	}

	//  去认证 页面
	const approve = ()=>{	
			const path = Taro.getCurrentInstance().router?.path
			let currentPath =  encodeURIComponent(path)
			let targetUrl = '/pages/user/certify/index'

			Taro.navigateTo({
				url: `${targetUrl}?sourceUrl=${currentPath}`
			})
			setVisible(false)
	}
	const toBill = ()=>{
		Taro.navigateTo({
			url:`/pages/user/paymentForGoods/bill/index?iscommision=${isCommission}`
		})
	}

	const Desc = useMemo(() => {
		return config?.withdrawIntro?.split(/\n/)
	}, [config])

    return(
			<View className='PaymentForGoods'>
				<NavigationBar leftBtn={<SingleBackBtn />}  title={isCommission==='1'? '佣金收入': '货款收入'}></NavigationBar>
				<View className='PaymentForGoods-panel'>
					<View className='PaymentForGoods-panel-allMoney'>
					{/*  货款 */}
					{isCommission ==='2' && <>
						<View className='PaymentForGoods-panel-allMoney-text'>累计货款(元)</View>
						<View className='PaymentForGoods-panel-allMoney-num'>{compose(formatMoeny, fen2yuan)(info?.productTotalAmount)}</View>
					</>}
					{isCommission ==='1' && <>
						<View className='PaymentForGoods-panel-allMoney-text'>累计佣金(元)</View>
						<View className='PaymentForGoods-panel-allMoney-num'>{compose(formatMoeny, fen2yuan)(info?.commissionTotalAmount)}</View>
					</>}
					</View>
					{isCommission ==='2' && <View className='PaymentForGoods-panel-detail'>
						<View className='PaymentForGoods-panel-detail-item'>
							<View className='PaymentForGoods-panel-detail-item-text'>货款余额(元)</View>
							<Text className='PaymentForGoods-panel-detail-item-num'>{compose(formatMoeny, fen2yuan)(info?.productAvailableAmount + info?.productFrozenAmount)}</Text>
						</View>
						<View className='PaymentForGoods-panel-detail-item'>
							<View className='PaymentForGoods-panel-detail-item-text'>待入账(元)</View>
							<Text className='PaymentForGoods-panel-detail-item-num'>{compose(formatMoeny, fen2yuan)(info?.productFrozenAmount)}</Text>
						</View>
						<View className='PaymentForGoods-panel-detail-item'>
							<View className='PaymentForGoods-panel-detail-item-text'>可用余额(元)</View>
							<Text className='PaymentForGoods-panel-detail-item-num'>{compose(formatMoeny, fen2yuan)(info?.productAvailableAmount)}</Text>
						</View>
					</View>}
					{isCommission ==='1' && <View className='PaymentForGoods-panel-detail'>
						<View className='PaymentForGoods-panel-detail-item'>
							<View className='PaymentForGoods-panel-detail-item-text'>佣金余额(元)</View>
							<Text className='PaymentForGoods-panel-detail-item-num'>{compose(formatMoeny, fen2yuan)(info?.commissionAvailableAmount + info?.commissionFrozenAmount)}</Text>
						</View>
						<View className='PaymentForGoods-panel-detail-item'>
							<View className='PaymentForGoods-panel-detail-item-text'>待入账(元)</View>
							<Text className='PaymentForGoods-panel-detail-item-num'>{compose(formatMoeny, fen2yuan)(info?.commissionFrozenAmount)}</Text>
						</View>
						<View className='PaymentForGoods-panel-detail-item'>
							<View className='PaymentForGoods-panel-detail-item-text'>可用余额(元)</View>
							<Text className='PaymentForGoods-panel-detail-item-num'>{compose(formatMoeny, fen2yuan)(info?.commissionAvailableAmount)}</Text>
						</View>
					</View>
					}
					
					<View className='PaymentForGoods-panel-action'>
						<AtButton onClick={()=>{toBill()}} className='PaymentForGoods-panel-action-see'>查看账单</AtButton>
						<AtButton className='PaymentForGoods-panel-action-withdrawal' onClick={()=>handleWithdraw()}>提现</AtButton>
					</View>
				</View>
				<View className='PaymentForGoods-desc'>
					{isCommission ==='2' && 	<View className='PaymentForGoods-desc-tit'>货款提现说明</View>}
					{isCommission ==='1' && 	<View className='PaymentForGoods-desc-tit'>佣金提现说明</View>}
					{isCommission ==='2' && <View className='PaymentForGoods-desc-tip'>
						<View>为保障您的账户资金安全，提现需完成实名认证和设置支付密码。</View>
						<View className='PaymentForGoods-desc-tip-introduce'>
							{Desc?.map((item,index)=>{
								return	<View key={index}>{item}</View>
							})}
						</View>
					</View>}

					{isCommission ==='1' && <View className='PaymentForGoods-desc-tip'>
						<View>为保障您的账户资金安全，提现需完成实名认证和设置支付密码。</View>
						<View className='PaymentForGoods-desc-tip-introduce'>
								{Desc?.map((item,index)=>{
								 return	<View key={index}>{item}</View>
							})}
						</View>
					</View>}
					
				</View>
				<BwModal 
				visible={visible} 
				title='实名认证' 
				 content ={<View>为确保资金安全, 提现需要完成实名认证</View>}
				 onCancel={()=>setVisible(false)} 
				 onClose={()=>setVisible(false)}
				 confirmText ='立即认证'
				 onConfirm = {()=> approve()} // 立即认证
				 />

		
			</View>
		)
}

export default PaymentForGoods

