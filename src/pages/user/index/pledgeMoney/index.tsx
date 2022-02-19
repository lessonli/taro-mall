
import NavigationBar, {SingleBackBtn, navigationBarInfo}  from '@/components/NavigationBar';
import Taro from "@tarojs/taro";
import { useState, useEffect, useMemo, useCallback } from 'react'
import { ScrollView, View, Text,Picker } from '@tarojs/components'
import Tabs from "@/components/Tabs";
import PledgeListItem from "@/pages/user/index/pledgeMoney/components/PledgeListItem";
import { PLEDGE_MONEY_STATUS} from "@/constants";
import { useRequest } from "ahooks"
import { empty } from '@/constants/images';
import dayjs from 'dayjs';
import VirtualScrollList, { LoadingView, NoMore, useListStatus } from "@/components/ScrollView";
import compose, { countDownTimeStr, formatMoeny, getRealSize, fen2yuan } from "@/utils/base";
import Empty from '@/components/Empty';
import api3590 from '@/apis/21/api3590';


import './index.scss'


const opts = Object.keys(PLEDGE_MONEY_STATUS).map(key => PLEDGE_MONEY_STATUS[key])

function PledgeMoney() {
  const isBuyer = Taro.getCurrentInstance().router?.params.isBuyer
  const [currentStatus, setCurrentStatus] = useState(PLEDGE_MONEY_STATUS.all.value)
  console.log(currentStatus, 'currentStatus');
  
  const [dateSel, setDateSel] = useState(dayjs(new Date()).startOf('month').format('YYYY-MM-DD') )
  const [ title] = useState(isBuyer === 'true' ?'竞拍保证金': '发拍保证金')

  const changeDate = ({detail:{value}})=>{
    console.log(value, 'value');
    
    setDateSel(dayjs(value))
  }
 
  
  const service = useCallback(async (
    result?: { pageNo: number, pageSize: number }
  ) => {  
    const pageNo = result?.pageNo ? result?.pageNo + 1 : 1
    const pageSize =  result?.pageSize || 15  
    
    const res = await api3590({
      startTimeStr: dayjs(dateSel).format('YYYY-MM-DD'),
      endTimeStr: dayjs(dateSel).endOf('month').format('YYYY-MM-DD'),
      statusList: currentStatus,
      marginType: isBuyer === 'true'? 0 : 1,
      pageNo,
      pageSize,
    })



    return {
      pageNo,
      pageSize,
      list: res?.data || [],
      total: res?.total || 0,
    }

  }, [currentStatus, dateSel])
  const { data, loadMore, reload, loadingMore, noMore, loading } = useRequest(service, {
    loadMore: true,
    refreshDeps: [currentStatus, dateSel]
  })
  console.log(noMore, 'noMore');
  

  const listStatus = useListStatus({
    list: data?.list,
    loading,
    noMore
  })
  const subHeight = useMemo(() => {
    return process.env.TARO_ENV === 'h5' ? getRealSize(188) : (getRealSize(188) + navigationBarInfo?.navigationBarAndStatusBarHeight)
  }, [])
  const Row = useCallback(({data, index}) => <PledgeListItem data={data[index]}  />, [])
  return(
    <div className='PledgeMoney-wrapper full-screen-page'>
      <NavigationBar background='#fff' leftBtn={<SingleBackBtn />}  title={title} />
      <Tabs
        options={opts}
        composition={1}
        value={currentStatus}
        onChange={setCurrentStatus}
      />
      <View>   
        <div>
        <div className='pledgeMoney-picker'>
          <Picker fields='month' mode='date' value ={dayjs(dateSel).format('YYYY-MM-DD')}  onChange={changeDate}>
            <View className='pledgeMoney-picker-currentTime'>
              {dayjs(dateSel).format('YYYY年MM月')}
              <Text className='myIcon pledgeMoney-picker-currentTime-icon'>&#xe742;</Text>
            </View>
          </Picker>
        </div>
        </div>
        </View>

      <VirtualScrollList 
        loadMore={loadMore}
        subHeight={subHeight}
        itemSize={getRealSize(254)}
        row={Row}
        data={data}
        listStatus={{
          noMore,
          loading: loading || loadingMore,
        }}
        emptyProps={{
          text: '暂无数据'
        }}
      >

      </VirtualScrollList>    
    </div>
  )
}

export default PledgeMoney
