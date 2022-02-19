import Taro from "@tarojs/taro";
import { Text, View, Input } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
import { useEffect, useCallback, useState } from "react";
import ListItem from "@/components/ListItem";

import api4654, { IResapi4654 } from "@/apis/21/api4654";
import { useAsync } from "@/utils/hooks";
import BwModal from "@/components/Modal";
import './index.scss'


interface IForm {
  path: string,
  query?: string
}

type IformKey = keyof IForm

function GenSchema() {
  const [form, setForm] = useState<IForm>({
    path: '',
    query: ''
  })
  const [fullPath, setFullPath] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  const inputChange = (key: IformKey, value: string) => {
    console.log(value, 'value');

    setForm({ ...form, [key]: value })
  }

  const { run: getSchema, pending } = useAsync(async () => {
    if (!form.path) {
      //  生成小程序schema 路径是必填项  
      return Taro.showToast({ title: '请填写路径', icon: 'none' })
    }
    try {
      const fullPathRes = await api4654({
        path: form.path,
        query: form.query
      })
      console.log();
      
      setFullPath(`https://h5.bowuyoudao.com/pages/active/schema/index?${encodeURIComponent(fullPathRes)}` )
      setVisible(true)
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      })
    }


  }, { manual: true })
  const handleCopy=()=>{
    Taro.setClipboardData({
      data: fullPath,
      success:()=>{
        Taro.showToast({title: '复制成功', icon:'none'})
        setVisible(false)
      }
    })
  }

  return <View className="bw-genSchema">
    <AtForm>
      <AtInput
        value={form.path}
        name='path'
        title='页面路径'
        type='text'
        placeholder='pages/index/index'
        clear
        onChange={(v) => inputChange('path', v as string)}
      />
      <AtInput
        value={form.query}
        name='query'
        title='参数'
        type='text'
        clear
        placeholder='activityId=1111&_type=2'
        onChange={(v) => inputChange('query', v as string)}
      />
      {/* <ListItem type={1} left={'生成链接'} right={fullPath}></ListItem> */}

    </AtForm>
    <AtButton className="m-t-36" disabled={pending} type="primary" onClick={getSchema}>生成Schema</AtButton>
    <BwModal
      visible={visible}
      type='alert'
      content={
        <View className="bw-genSchema-content">
          <View className="bw-genSchema-fullPath">
          {fullPath}
          </View>
          <Text className="copy-btn" onClick={handleCopy}>复制</Text>
        </View>
      }
      onCancel={() => setVisible(false)}
      onClose={() => setVisible(false)}

    ></BwModal>
  </View>
}

export default GenSchema