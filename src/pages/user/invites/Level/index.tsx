
import { View, Text,Image } from "@tarojs/components";
import { AtProgress } from 'taro-ui'
import { useState, useEffect, useCallback, sueMemo } from "react";
import api3782, {IResapi3782} from "@/apis/21/api3782";
import compose, {formatMoeny, fen2yuan} from "@/utils/base";
import './index.scss'
import api2444, {IResapi2444} from "@/apis/21/api2444";
import Taro from "@tarojs/taro";
import { XImage } from "@/components/PreImage";
export type Imerchant = Required<IResapi2444>['data']
export type Idata = Required<IResapi3782>['data']
function Level(){
  const [data, setData] = useState<Idata>()
  const [merchantInfo, setMerchantInfo] = useState<Imerchant>()
  useEffect(()=>{
    (async()=>{
      const res = await api3782()
      const merchant = await api2444()
      setMerchantInfo(merchant)
      setData(res)
    })()
  }, [])

  const copy = (str)=>{
    Taro.setClipboardData({
      data: str,
      success:()=>{
        Taro.showToast({
          icon: null,
          title: '复制成功'
        })
      }
    })
  }

  return (
    <View className='invite-level'>
      <View className={`${data?.nextLevel===3?'invite-level-head-gold':'invite-level-head' }`}>
        <View className='invite-level-head-box'>
          <XImage 
            query={{ 'x-oss-process': 'image/resize,w_80/quality,q_100' }}
            className='invite-level-head-box-img' src={merchantInfo?.shopLogo}>
            
           </XImage>
          <View>
            <View>
              <Text className='color333 fz36'>{merchantInfo?.shopName}</Text>
            </View>
            <View>
              <Text className='color:666 fz26'>邀请码</Text>
              <Text className='color:666 fz26'>{merchantInfo?.channelNo}</Text>
              {/* <Text className='invite-level-head-copy' onClick={()=>copy(merchantInfo?.channelNo) }>复制</Text> */}
            </View>
          </View>
        </View>
      </View>
      <View className='invite-diamond'>
       <View className='invite-diamond-content'>
         {data?.nextLevel === 2 && <>
          <View className='color333 fz32'>钻石商家权益</View>
            <View className='fz28 color666 m-t-16'>
              <View>1.招商佣金：直接招幕金牌商家佣金提升至{compose(formatMoeny, fen2yuan)(data?.inviteNewMerchantCommission)}元/人</View>
              <View>2.招商奖励：团队新增金牌商家新增奖励{compose(formatMoeny, fen2yuan)(data?.inviteNewMerchantTeamCommission)}元/人 </View>
              <View>3.团队佣金：团队金牌商家收益总佣金*{(data?.productTeamCommissionRate)/100}%；</View>
          </View>
        </>}
        {/*   */}
        {data?.nextLevel === 3 && <>
          <View className='color333 fz32'>服务商权益</View>
            <View className='fz28 color666 m-t-16'>
              <View>1.招商佣金：直接招幕金牌商家佣金提升至{compose(formatMoeny, fen2yuan)(data?.inviteNewMerchantCommission)}元/人 </View>
              <View>2.招商奖励：团队新增金牌商家新增奖励{compose(formatMoeny, fen2yuan)(data?.inviteNewMerchantTeamCommission)}元/人 </View>
              <View>3.团队佣金：团队金牌商家收益总佣金*{(data?.productTeamCommissionRate)/100}%；</View>
          </View>
        </>}

        
       </View>
      </View>
      <View className='invite-diamond'>
        {/* 钻石商家 进度条 */}
        {
          data?.nextLevel === 2 && <View className='invite-diamond-content p-b-60'>
          <View className='color333 fz32'>达到以下升级条件可以升级钻石商家</View>
          <View className='invite-diamond-conditions m-t-32'>
            { 
              data?.directMerchantNum !== 0 &&  <View>
                <View className='fz26 color333'>直邀金牌商家{data?.directMerchantNum}人</View>
                <View className='bw-flex'>
                  <AtProgress 
                  className='progress' 
                  isHidePercent strokeWidth ={6}  
                  percent={((data?.currentDirectMerchantNum)/(data?.directMerchantNum))*100}  
                  color='#BD883E' /> 
                <View className='fz24 m-l-16'><Text className='invitelevelCurrent'>{data?.currentDirectMerchantNum}</Text>  <Text>/{data?.directMerchantNum}</Text>  </View>
                </View>
              </View>
            }
            

            {
              data?.directPrivateFansNum !== 0 &&  <View className='m-t-42'>
                <View className='fz26 color333'>个人专属粉丝{data?.directPrivateFansNum}人</View>
                <View className='bw-flex'>
                  <AtProgress className='progress' 
                  isHidePercent
                  strokeWidth ={6}
                  percent={((data?.currentDirectPrivateFansNum)/(data?.directPrivateFansNum))*100} 
                  color='#BD883E' /> 
                  <View className='fz24 m-l-16'><Text className='invitelevelCurrent'>{data?.currentDirectPrivateFansNum}</Text> <Text>/{data?.directPrivateFansNum}</Text>  </View>
                </View>
              </View>
            }

            {

            data?.gmv !== 0  && 
              <View className='m-t-42'>
                <View className='fz26 color333'>累计销售额{compose(fen2yuan)(data?.gmv)}元</View>
                <View className='bw-flex'>
                  <AtProgress className='progress' isHidePercent strokeWidth ={6} percent={ ((compose(fen2yuan)(data?.currentGmv))/(compose(fen2yuan)(data?.gmv)))*100 } color='#BD883E' /> <View className='fz24 m-l-16'><Text className='invitelevelCurrent'>{compose(fen2yuan)(data?.currentGmv)}</Text> <Text>/￥{compose(fen2yuan)(data?.gmv)}</Text>  </View>
                </View>
            </View>
            }
            
          </View>
        </View>
        }


        {/* 服务商商家 进度条 */}
        
        {
          data?.nextLevel === 3 && <View className='invite-diamond-content p-b-60'>
          <View className='color333 fz32'>达到以下升级条件可以升级服务商</View>
          <View className='invite-diamond-conditions m-t-32'>
            {data?.directMerchantNum !== 0 && 
              <View>
              <View className='fz26 color333'>直邀金牌商家{data?.directMerchantNum}人</View>
              <View className='bw-flex'>
                <AtProgress className='progress'
                 isHidePercent strokeWidth = {6}  
                 percent={((data?.currentDirectMerchantNum)/(data?.directMerchantNum))*100}
                color='#BD883E' />
                <View className='fz24 m-l-16'>
                  <Text className='invitelevelCurrent'>{data?.currentDirectMerchantNum}</Text> 
                  <Text>/{data?.directMerchantNum}</Text>  </View>
              </View>
            </View>
            }
            {data?.teamMerchantNum !== 0 && 
              <View>
                <View className='fz26 color333'>团队金牌商家{data?.teamMerchantNum}人</View>
                <View className='bw-flex'>
                  <AtProgress className='progress' isHidePercent percent ={((data?.currentTeamMerchantNum)/(data?.teamMerchantNum))*100} strokeWidth={6} color='#BD883E' /> 
                  <View className='fz24 m-l-16'>
                    <Text  className='invitelevelCurrent'>{data?.currentTeamMerchantNum}</Text> 
                    <Text>/{data?.teamMerchantNum}</Text>  </View>
                </View>
            </View>
            }
            

            {data?.directPrivateFansNum !== 0 && 
               <View className='m-t-42'>
               <View className='fz26 color333'>个人专属粉丝{data?.directPrivateFansNum}人</View>
               <View className='bw-flex'>
                 <AtProgress className='progress' isHidePercent strokeWidth ={6} percent={((data?.currentDirectPrivateFansNum)/(data?.directPrivateFansNum))*100} color='#BD883E' /> 
                 <View className='fz24 m-l-16'><Text className='invitelevelCurrent'>{data?.currentDirectPrivateFansNum}</Text> <Text>/{data?.directPrivateFansNum}</Text>  </View>
               </View>
             </View>
            }
           

            {data?.teamPrivateFansNum !== 0 && 
              <View className='m-t-42'>
                <View className='fz26 color333'>团队专属粉丝{data?.teamPrivateFansNum}人</View>
                <View className='bw-flex'>
                  <AtProgress className='progress' isHidePercent strokeWidth ={6} percent={((data?.currentTeamPrivateFansNum)/(data?.teamPrivateFansNum))*100} color='#BD883E' />
                  <View className='fz24 m-l-16'>
                    <Text className='invitelevelCurrent'>{data?.currentTeamPrivateFansNum}</Text>
                    <Text>/{data?.teamPrivateFansNum}</Text>  </View>
                </View>
              </View>
            }
            
            {data?.transLevel2Num !== 0 && 
              <View className='m-t-42'>
                <View className='fz26 color333'>培养钻石商家 {data?.transLevel2Num}人</View>
                <View className='bw-flex'>
                  <AtProgress className='progress' isHidePercent strokeWidth ={6} percent={ ((data?.currentTransLevel2Num)/(data?.transLevel2Num))*100} color='#BD883E' /> 
                  <View className='fz24 m-l-16'>
                    <Text  className='invitelevelCurrent'>{data?.currentTransLevel2Num}</Text>
                    <Text>/{data?.transLevel2Num}</Text> 
                  </View>
                </View>
            </View>
            }
            

            {
              data?.gmv!==0 && <View className='m-t-42'>
                <View className='fz26 color333'>团队销售额{compose(fen2yuan)(data?.gmv)}元</View>
                <View className='bw-flex'>
                  <AtProgress className='progress' isHidePercent strokeWidth ={6} percent={ ((compose(fen2yuan)(data?.currentGmv))/(compose(fen2yuan)(data?.gmv)))*100 } color='#BD883E' /> 
                  <View className='fz24 m-l-16'>
                    <Text  className='invitelevelCurrent'>{compose(fen2yuan)(data?.currentGmv)}</Text> 
                    <Text>/￥{compose(fen2yuan)(data?.gmv)}</Text>  </View>
                </View>
              </View>
            }
            
          </View>
        </View>
        }
      </View>
    </View>
  )
}

export default Level