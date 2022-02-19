
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import ListItem from '@/components/ListItem'
import { AtButton, AtInput } from 'taro-ui'
import { useState, useCallback, useMemo, useEffect } from 'react'
import BwModal from '@/components/Modal'
import api3002 from '@/apis/21/api3002'
import './index.scss'
import { XImage } from '@/components/PreImage'
import Upload, { VideoOutLined, IFile } from '@/components/Upload/index'
import { getStatus, getUserInfo } from '@/utils/cachedService'
import PreviewImg from '@/components/PreviewImg'
import { BWYD_ICON } from '@/constants/images'
import { useDebounceFn } from 'ahooks'
import { useAsync } from '@/utils/hooks'
import { getWeappUserProfileAuth } from '@/components/WxComponents/useWeappLogin'

function AccountInfo() {
  const [visible, setVisible] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [userStatus, setUserStatus] = useState({})
  const [nickName, setNickName] = useState<string>()
  // const [albumPicsArr, setalbumPicsArr] = useState<[]>([])

  const initFn = async () => {
    const userInfoRes = await getUserInfo.reset()
    const userStatusRes = await getStatus.reset()
    setUserInfo(userInfoRes)
    setUserStatus(userStatusRes)
    setNickName(userInfoRes?.nickName)
  }

  useEffect(() => {
    initFn()
  }, [])

  const onChange = (e) => {
  //  let str = e.replace(/\s*/g,"");
    let str = e.trim()
    setNickName(str)
  }

  
  const handleNickname = async () => {
    if(nickName?.length === 0) {
      return Taro.showToast({
        title:'请填写昵称',
        icon: 'none'
      })
    }
    await api3002({ nickName })
    const userInfoRes = await getUserInfo.reset()
    setUserInfo(userInfoRes)
    setVisible(false)
    setNickName('')
  }
// const {run: handleNickname} = useDebounceFn(async()=>{
//   if(nickName?.length === 0) {
//     return Taro.showToast({
//       title:'请填写昵称',
//       icon: 'none'
//     })
//   }
//   await api3002({ nickName })
//   const userInfoRes = await getUserInfo.reset()
//   setUserInfo(userInfoRes)
//   setVisible(false)
//   setNickName('')
// }, {wait:200})
  const handleClose =  useCallback(()=>{
    setNickName('')
    setVisible(false)
  }, [])

  const handleValuesChange = async(v) => {
      if(v[0].url){ 
       await api3002({headImg: v[0].url})
       const userRes =  await getUserInfo.reset()
       setUserInfo(userRes)
      }
  }

  const phoneRight = useMemo(() => {
    if (userInfo?.mobile) {
      return <View>
        <Text>{userInfo?.mobile}</Text>
      </View>
    }
  }, [userInfo])

  const {run, pending} = useAsync(async () => {
    await getWeappUserProfileAuth({sendCustomEventName: 'user_center'})
    await initFn()

  }, {manual: true})

  const UploadAvator = useMemo(() => {
    return <Upload
      value={[]}
      className='bw-accountInfo-upload'
      max={1}
      onChange={(v) => handleValuesChange(v)}
    >
      <View className='System-accountInfo-list-imgWrap'>
        <XImage className='System-accountInfo-list-img' src={userInfo?.headImg} ></XImage>
      </View>
    </Upload>
  }, [userInfo?.headImg])
  return (
    <View className='System-accountInfo'>
      <View className='System-accountInfo-list'>
        <ListItem className='System-accountInfo-listItem' type={1} left={<View className='System-accountInfo-list-left'>个人头像</View>} right={UploadAvator} />
        <ListItem type={1} left={<View className='System-accountInfo-list-left'>昵称</View>} right={<View className='color666' onClick={() => {setVisible(true); setNickName(userInfo.nickName)} }>{userInfo?.nickName}</View>} />
        <ListItem type={1} left={<View className='System-accountInfo-list-left'>手机号</View>} right={phoneRight} icon={(userInfo.mobile) ? <Text className='myIcon fz32'>&#xe734;</Text> : <Text className='myIcon fz32'>&#xe726;</Text>} />
        <ListItem type={1} left={<View className='System-accountInfo-list-left'>微信</View>} right={<View className='color999'>{userStatus?.wxAuthStatus ? '已绑定' : '未绑定'}</View>} icon={(userStatus.wxAuthStatus) ? <Text className='myIcon fz32'>&#xe734;</Text> : <Text className='myIcon'>&#xe726;</Text>} />
      </View>

      {
        process.env.TARO_ENV === 'weapp' &&  userStatus?.needRefreshUserInfo === 1
        &&
        <AtButton className="m-t-36 tbwx-btn" onClick={run} disabled={pending} ><Text className={`myIcon ${pending ? 'active' : ''}`}>&#xe700;</Text>同步微信头像昵称</AtButton>
      }

      {visible && <BwModal
        title='请输入昵称'
        visible={visible}
        cancelText='取消'
        confirmText='修改'
        onClose={handleClose}
        onCancel={handleClose}
        onConfirm={handleNickname}
        content={<View className='System-accountInfo-input'><AtInput autoFocus value={nickName} name='nickName' onChange={onChange} ></AtInput>
        </View>} 
      />}


    </View>
  )
}
export default AccountInfo
