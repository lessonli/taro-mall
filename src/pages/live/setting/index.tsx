import ListItem from "@/components/ListItem"
import Upload, { IFile, ImgOutLined } from "@/components/Upload"
import { isAppWebview, PRIMARY_COLOR } from "@/constants"
import { Input, View, Text, Switch } from "@tarojs/components"
import { useDebounceFn } from "ahooks"
import Schema, { Rules } from "async-validator"
import { useCallback, useMemo } from "react"
import { useState } from "react"
import { AtButton, AtSwitch } from "taro-ui"
import './index.scss'
import Taro from "@tarojs/taro"
import BwModal from "@/components/Modal"
import { useRef } from "react"
import { useEffect } from "react"
import { useH5Title } from "@/components/NavigationBar"
import Popup from "@/components/Popup"
import { PickerView } from "antd-mobile"
import dayjs from "dayjs"
import api4498 from "@/apis/21/api4498"
import api4496 from "@/apis/21/api4496"
import api2092 from "@/apis/21/api2092"
import api4542 from "@/apis/21/api4542"
import api4614, {IResapi4614} from "@/apis/21/api4614"
import { getCategories } from "@/utils/cachedService"
import api4626 from "@/apis/21/api4626"
import KnownModal, { ModelContentBeforeStartLive } from "../components/KnownModal"
import { autoAddImageHost, cutImagePrefixToService } from "@/components/PreImage/transformImageSrc"
import { session } from "@/utils/storge"
import asyncValidate from "./asyncValidate"
import { useAsync } from "@/utils/hooks"

/**
 * 直播设置
 */
export default () => {

  const getRecentlyDays = useCallback((days: number = 30) => {
    const current = dayjs()
    const ds = Array(days).fill(undefined).reduce((res, _, i) => {
      const date = current.add(i, 'days')
      // const month = date.get('month') + 1
      // const day = date.get('date')
      const value = dayjs(date).format('YYYY-MM-DD')
      const children = getHoursInDay(value, current)
      res.push({
        label: dayjs(date).format('MM月DD日'),
        value,
        children,
      })
      return res
    }, [])
    return ds
  }, [])

  const getHoursInDay = useCallback((date: string, current = new Date()) => {
    const h = new Date(current).getHours()
    const a = dayjs(date).isAfter(current, 'day')
    
    return Array(24).fill(undefined).reduce((res, _, i) => {
      if (a || (!a && h <= i)) res.push(i)
      return res
    }, [])
    .map((e) => {
      const children = getMinusInDDhh(`${date} ${Number(e) > 10 ? e : '0' + e}`)
      return {
        label: `${e}时`,
        value: e,
        children
      }
    })
  }, [])

  const getMinusInDDhh = useCallback((date: string) => {
    const current = new Date()
    const a = dayjs(date).isAfter(current, 'hours')
    const currentM = new Date(current).getMinutes()
    return Array(60).fill(undefined).reduce((res, _, i) => {
      if (a || (!a && i > currentM)) res.push(i)
      return res
    }, []).map((i) => ({
      label: `${i}分`,
      value: i
    }))
  }, [])
  // =============================================
  const KNOW_COUNT = 6

  const params = Taro.getCurrentInstance().router?.params || {}

  // 立即直播 直播预展
  const rightNow = Boolean(params?.rightNow)
  // 修改预展
  const editPreLive = Boolean(params?.editPreLive)

  const [values, setValues] = useState({
    title: '',
    startTime: '',
    coverImg: '',
    posterImg: '',
    distPercentOpend: false,
    distPercent: 0,
  })

  const [bools, setBools] = useState({
    known: false,
    knownCount: KNOW_COUNT,
    distPercent: false,
    startTime: false,
  })

  const [distPercents, setDistPercents] = useState<{label: string, value: any}[]>([])

  const [dates] = useState(getRecentlyDays())

  const [liveRoomDetail, setLiveRoomDetail] = useState<IResapi4614['data']>({})

  const timer = useRef()
  const timerCount = useRef(KNOW_COUNT)
  const aRef = useRef<string[] | undefined>(undefined)
  const distPercentRef = useRef()

  useH5Title(rightNow ? '直播设置' : '直播预展设置')

  const getDefaultDistPercent = async (category) => {
    const res3 = await getCategories()
    const defaultCategory = res3?.find(ele => ele.id === category)?.distPercent
    return defaultCategory
  }

  useEffect(() => {
    (async () => {
      // 获取直播间信息
      const res2 = await api4614()
      setLiveRoomDetail(res2)
      // 获取预展信息
      const res = session.getItem('api4542')
      // const res = await api4542()
      let distPercentOpend = false
      let distPercent = 0
      if (!res?.recordId) {
        // 设置默认分佣比例
        distPercent = await getDefaultDistPercent(res2?.category)
        distPercentOpend = true
      } else {
        distPercentOpend = res?.distPercent > 0
        distPercent = res.distPercent
      }
      const startTime = res?.startTime ? dayjs(res?.startTime).format('YYYY-MM-DD HH:mm') : ''
      setValues({
        ...(res || {}),
        coverImg: autoAddImageHost(res?.coverImg || res2?.defaultCoverImg),
        posterImg: autoAddImageHost(res?.posterImg || res2?.defaultPosterImg),
        title: res?.title || res2?.defaultTitle,
        startTime,
        distPercentOpend,
        distPercent,
      })
    })()
  }, [])

  const handleValuesChange = async (name, value) => {
    console.log(name, value)
    if (name === 'distPercentOpend' && value) {
      const res3 = await getCategories()
      const defaultCategory = res3?.find(ele => ele.id === liveRoomDetail?.category)?.distPercent
      console.log(defaultCategory)
      setValues({
        ...values,
        [name]: value,
        distPercent: defaultCategory
      })
    } else if (name === 'distPercentOpend' && !value) {
      setValues({
        ...values,
        [name]: value,
        distPercent: 0,
      })
    }else {
      setValues({
        ...values,
        [name]: value
      })
    }
    
  }

  const coverImgVal: IFile[] = useMemo(() => {
    if (values.coverImg) return [{
      url: values.coverImg,
      thumbUrl: values.coverImg,
      uid: '0',
      name: values.coverImg,
    }]
    return []
  }, [values.coverImg])

  const posterImgVal: IFile[] = useMemo(() => {
    if (values.posterImg) return [{
      url: values.posterImg,
      thumbUrl: values.posterImg,
      uid: '0',
      name: values.posterImg,
    }]
    return []
  }, [values.posterImg])

  const openBefore = () => {
    setBools({
      ...bools,
      known: true,
    })
  }

  const {run: handleSubmit, pending} = useAsync(async () => {

    const rules: Rules = {
      title: {
        type: 'string',
        required: true,
        message: '请填写直播标题',
      },
      coverImg: {
        type: 'string',
        required: true,
        message: '请填写上传直播封面图',
      },
      posterImg: {
        type: 'string',
        required: true,
        message: '请填写上传海报分享图',
      },
    }

    if (!rightNow) {
      Object.assign(rules, {
        startTime: {
          type: 'string',
          required: true,
          // message: '请选择开播时间',
          validator: (_, value, cb) => {
            if (!value) return new Error('开播时间必填')
            if (dayjs(value).isAfter(new Date())) {
              cb()
            } else {
              return new Error('开播时间有误')
            }
          }
        }
      })
    }
    await asyncValidate(rules, values)
    
    // TODO 提交到后端
    if (rightNow) {
      openBefore()
    } else { // 创建预展直播
      // 区分编辑 与 创建
      const fn = editPreLive ? api4626 : api4496
      const req = {
        uuid: values.recordId || '',
        title: values.title,
        startTime: dayjs(values.startTime).valueOf(),
        posterImg: cutImagePrefixToService(values.posterImg),
        coverImg: cutImagePrefixToService(values.coverImg),
        distPercent: values.distPercent,
      }
      const res = await fn(req)
      const a = await api4542()
      session.setItem('api4542', a)
      setLiveRoomDetail(res)
      Taro.redirectTo({
        url: `/pages/live/preSettingResult/index?recordId=${res?.recordId || ''}`
      })
    }

  }, {manual: true})

  const handleKnown = async () => {
    Taro.showLoading({
      title: '正在为您开通直播间',
      mask: true,
    })
    if (isAppWebview) {
      const a = {
        title: values.title,
        posterImg: cutImagePrefixToService(values.posterImg),
        coverImg: cutImagePrefixToService(values.coverImg),
        distPercent: values.distPercent,
        startTime: new Date().valueOf(),
      }
      api4498(a).then(res => {
        setLiveRoomDetail(res)
        WebViewJavascriptBridge.callHandler(
          'openNativePage',
          JSON.stringify({
            page: '/liveRoom/pusher',
            params: {},
          }),
          (data) => {
            Taro.navigateBack()
          }
        )
      }).finally(() => {
        Taro.hideLoading()
      })
      
    } else {
      Taro.showToast({
        icon: 'none',
        title: '更多功能请到app体验'
      })
    }
  }

  const toAgg = (name: string) => {
    Taro.navigateTo({
      url: `/pages/webview/index?name=${encodeURIComponent(name)}`
    })
  }

  const ModelContent = useMemo(() => () => <View className="fz24 color666">
    <View className="m-b-24">为了维护网络文明健康，净化直播环境，请主播遵守法律法规，弘扬正能量。如下直播规范请务必知晓遵守。</View>
    <View>1、不可在直播间提及其他竞品平台；</View>
    <View>2、不可在直播间展示个人微信号，主动或被动引导用户线下交易；</View>
    <View>3、任何违法违规、色情暴力、低俗不良行为将被处罚封禁；</View>
  </View>, [])

  useEffect(() => {
    (async () => {
      const res = await api2092()
      setDistPercents((res || []).map(e => {
        return {
          label: `成交价${e}%`,
          value: e,
        }
      }))
    })()
  }, [])

  return <View className="livesetting">
    <View className="bw-card m-24">
      <ListItem
        type={1}
        icon={null}
        left={<View className="bw-required">直播标题</View>}
        right={<Input maxlength={10} value={values.title} onInput={v => handleValuesChange('title', v.detail.value)} placeholder="输入直播标题，限10个字"/>}
      />

      <View className="m-t-32 flex items-center">
        <View className="livesetting-Upload-item">
          {/* 比例16:9 */}
          <Upload
            mode="single"
            ableCropper
            cropperOption={{aspectRatio: 9 / 16}}
            max={1}
            value={coverImgVal}
            onChange={v => {
              console.log(v)
              handleValuesChange('coverImg', v.length > 0 ? v[0].url : '')
            }}
          >
            <ImgOutLined text="比例16:9"/>
          </Upload>
          <View className="fz24 color666 m-t-8">直播封面图</View>
        </View>

        <View className="livesetting-Upload-item">
          {/* 比例1:1 */}
          <Upload
            mode="single"
            ableCropper
            cropperOption={{aspectRatio: 1 / 1}}
            max={1}
            value={posterImgVal}
            onChange={v => handleValuesChange('posterImg', v.length > 0 ? v[0].url : '')}
          >
            <ImgOutLined text="比例1:1"/>
          </Upload>
          <View className="fz24 color666 m-t-8">海报分享图</View>
        </View>

      </View>
    </View>
  
    <View className="bw-card m-24">
      {
        !rightNow &&
        <ListItem
          type={1}
          left={<View className="bw-required">直播时间</View>}
          right={
            <View onClick={() => setBools({...bools, startTime: true})}>{!!values.startTime ? values.startTime : '请选择开播时间' }</View>
          }
        />
      }
      
      <ListItem
        type={1}
        icon={null}
        left={<View>开启分享佣金</View>}
        right={<View><Switch color={PRIMARY_COLOR} checked={Boolean(values.distPercentOpend)} onChange={v => handleValuesChange('distPercentOpend', Boolean(v.detail.value))} /></View>}
      />
      {
        Boolean(values.distPercentOpend) && 
        <ListItem
          type={1}
          left={<View>佣金比例</View>}
          right={<View onClick={() => setBools({...bools, distPercent: true})}>
            {values.distPercent !== undefined ? `成交价${values.distPercent}%` : '请选择'}
          </View>}
        />
      }
      
    </View>


    <View className="livesetting-footer">
      <AtButton type="primary" onClick={handleSubmit} disabled={pending}>{rightNow ? '立即直播' : (editPreLive ? '修改预展' : '开始预展')}</AtButton>
      <View className="agreements">点击即同意<Text className="agreement-item" onClick={() => toAgg('博物商家入驻协议11.17')}>《博物直播协议》</Text><Text className="agreement-item" onClick={() => toAgg('卖家店铺服务规范')}>《卖家店铺服务规范》</Text></View>
    </View>

    <KnownModal
      title="开播须知"
      visible={bools.known}
      onClose={() => setBools({...bools, known: false})}
      content={<ModelContentBeforeStartLive />}
      onOk={handleKnown}
    ></KnownModal>

    <Popup
      visible={bools.startTime}
      onVisibleChange={v => setBools({...bools, startTime: v})}
      onOk={() => {
        if (aRef.current) {
          const [d, h, m] = aRef.current
          console.log('设置时间', aRef.current);
          const a = `${d} ${Number(h) > 9 ? h : '0' + h}:${Number(m) > 9 ? m : '0' + m}:00`
          handleValuesChange('startTime', a)
        }
      }}
    >
      <PickerView
        cols={3}
        cascade={true}
        data={dates}
        onChange={v => {
          aRef.current = v
        }}
      />
    </Popup>


    {/* 佣金比例选择 */}

    <Popup
      visible={bools.distPercent}
      onVisibleChange={v => setBools({...bools, distPercent: v})}
      onOk={() => {
        handleValuesChange('distPercent', distPercentRef.current)
      }}
    >
      <PickerView
        cols={1}
        cascade={false}
        data={distPercents}
        onChange={v => {
          console.log(v)
          if (v?.length > 0) {
            distPercentRef.current = v[0]
          }
          
        }}
      />
    </Popup>
  </View>
}