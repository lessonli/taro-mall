

import {ScrollView} from '@tarojs/components'
import {useState} from "react";
import { BW_SCHOOL_STATUS } from "@/constants";

import Tabs from "@/components/Tabs";
import SchoolItem from "@/pages/user/index/bwSchool/components/SchoolItem";


const opts = Object.keys(BW_SCHOOL_STATUS).map(key => BW_SCHOOL_STATUS[key])
function BwSchool() {
  const [currentStatus, setCurrentStatus] = useState(BW_SCHOOL_STATUS.shop.value)
  return(
    <div>
      <Tabs options={opts} composition={1} value={currentStatus} onChange={setCurrentStatus} />

      <div>
        <ScrollView>
          <SchoolItem></SchoolItem>
        </ScrollView>
      </div>
    </div>
  )
}

export default BwSchool
