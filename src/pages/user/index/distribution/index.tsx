
import {Text, ScrollView} from '@tarojs/components'
import { useState, useCallback, useEffect, useMemo } from 'react';
import ListItem from "@/components/ListItem";
import DistributionListItem from './components/ListItem'

import api3746 ,{IResapi3746, IReqapi3746} from '@/apis/21/api3746';
import Empty from '@/components/Empty';
import { empty } from '@/constants/images';
export type Idata = Required<IResapi3746>['data']
import './index.scss'
function Distribution() {
  const [info, setInfo] = useState<Idata>()
  useEffect(()=>{
    (async()=>{
      const res = await api3746() 
      setInfo(res)
    })()    
  }, [])

  
  return(
    <div className='sales-wrapper'>
      <ListItem type='1' left={<div className='sales-head'><Text>销售额</Text><i></i>
      </div>} right={<div className='sales-order'>订单数</div>} icon={null}
      />
      <ScrollView>
        {info?.map((item, idx)=>{
            return <DistributionListItem key={idx}  data={item}></DistributionListItem>
           }
        )}
       {info?.length === 0 &&  <Empty src={empty} text="暂无数据" className="m-t-60" />}
        
       
      </ScrollView>
    </div>
  )
}

export default Distribution
