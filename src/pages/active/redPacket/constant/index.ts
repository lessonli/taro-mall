

export const getDataPicker = (function(){
  const dataPicker:any[] = []
  for(let i = 1;i<11; i++){
    dataPicker.push({
      label:`${i}天`,value:`${i}`
    })
  }
  return dataPicker
})()

export const getDataHoursPicker = (function(){
  const initHoursArr = [2,5,12,24,48,72]
  const result:any[] = []
  initHoursArr.forEach(element => {
    result.push({
      label:`${element}小时`,value:`${element}`
    })
  });
  return result
})()
