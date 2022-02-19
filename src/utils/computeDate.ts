import dayjs, { Dayjs } from "dayjs"

import { IChinaTree } from "./cachedService"
function st(
  /**
   * 开始时间
   */
  current: Dayjs = dayjs(),

) {

  const [
    currentYear,
    currentMonth,
    currentDate,
    currentHour,
    currentMinute
  ] = [
      current.year(),
      current.month(),
      current.date(),
      current.hour(),
      current.minute()
    ]

  const MAX_MONTHS = 3

  /**
   * 最大结束时间 往前算3个月
   */
  const endTime = current.add(MAX_MONTHS, 'month')

  const [
    endYear,
    endMonth,
    endDate,
    endHour,
    endMinute
  ] = [
      endTime.year(),
      endTime.month(),
      endTime.date(),
      endTime.hour(),
      endTime.minute()
    ]

  const isSameYear = currentYear === endYear

  const diffs = endTime.diff(current, 'minute')

  const results: IChinaTree = []

  Array(diffs).fill(undefined).forEach((_, i) => {
    const d = current.add(i, 'minute')
    const thisTime = [
      d.year(),
      d.month(),
      d.date(),
      d.hour(),
      d.minute(),
    ]
    const [
      YY, MM, DD, HH, mm
    ] = thisTime
    const yearPath = isSameYear ? 0 : (YY === endYear ? 1 : 0)
    const monthPath = yearPath > 0 ? MM : (MM - currentMonth)
    const datePath = isSameYear && MM === currentMonth ? (DD - currentDate) : DD - 1
    const hourPath = (isSameYear && MM === currentMonth && DD === currentDate) ? (HH - currentHour) : HH
    const mmPath = (isSameYear && MM === currentMonth && DD === currentDate && HH === currentHour) ? mm - currentMinute : mm

    const paths = [
      yearPath,  // 0 0
      monthPath, // 1 2
      datePath, //  2 5
      hourPath, //  3 23
      mmPath, //    4 55
    ]

    paths.forEach((item, level) => {
      // 月份 + 1
      let value = level === 1 ? thisTime[level] + 1 : thisTime[level]
      value = value > 9 ? `${value}` : `0${value}`
      const val = {
        label: value,
        value,
        level,
        time: '',
        // children: []
      }

      const children = Array(level + 1).fill(undefined).reduce((res, _, i) => {
        val.time += ' ' + thisTime[i]

        if (i > 0 && !res[paths[i - 1]].children) {
          res[paths[i - 1]].children = []
        }
        return i > 0 ? res[paths[i - 1]].children : res
      }, results)
      if (!children[item]) {
        children[item] = val
      }

    })

  })

  return results

}

export default st