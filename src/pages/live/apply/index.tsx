import ListItem from "@/components/ListItem"
import Popup from "@/components/Popup"
import SelectPicker from "@/components/SelectPicker"
import { getCategories, IChinaTree } from "@/utils/cachedService"
import { View, Text, Textarea, Input, Image } from "@tarojs/components"
import { Picker, PickerView } from "antd-mobile"
import { useEffect } from "react"
import { useCallback } from "react"
import { useRef } from "react"
import { useState } from "react"
import { AtButton, AtInput, AtTextarea } from "taro-ui"
import Schema, { Rules } from 'async-validator';
import Taro from "@tarojs/taro"

import './index.scss'
import api4512 from "@/apis/21/api4512"
import { useDebounceFn } from "ahooks"
import Upload, { IFile } from "@/components/Upload"
import { useMemo } from "react"
import { bw_icon } from "@/constants/images"
import api4614 from "@/apis/21/api4614"
import { autoAddImageHost, cutImagePrefixToService } from "@/components/PreImage/transformImageSrc"

/**
 * 直播审核
 */
export default () => {

  const page = Taro.getCurrentInstance()

  const {params} = page.router

  const [formValue, setFormValue] = useState({
    roomName: '',
    introduction: '',
    category: '',
    headImg: '',
    // 直播间公告
    announcement: '',
    roomId: '',
  })

  const [visibles, setvisibles] = useState({
    category: false,
    loading: false,
  })

  const [categories, setCategories] = useState<IChinaTree>([])

  const aRef = useRef()

  useEffect(() => {
    (async () => {
      // TODO: 获取直播信息 params.roomId
      const res = await api4614()
      setFormValue({
        // 店铺默认头像
        headImg: autoAddImageHost(res?.headImg || ''),
        category: res?.category || '',
        introduction: res?.introduction || '',
        roomName: res?.roomName || '',
        roomId: res?.uuid || '',
      })
    })()
  }, [])

  useEffect(() => {
    (async() => {
      const res = await getCategories()
      const val = res?.map(item => ({
        label: item.name,
        value: item.id
      }))
      setCategories(val)
    })()
  }, [])

  const handleFormChange = (name, value) => {
    Object.assign(formValue, {[name]: value})
    console.log(formValue)
    setFormValue({...formValue})
    return value
  }

  const getcategoryName = useCallback((id) => {
    return categories.find(ele => ele.value === id)?.label
  }, [categories])

  const {run: handleSubmit} = useDebounceFn(() => {
    const rules: Rules = {
      headImg: {
        type: 'string',
        required: true,
        message: '请上传直播间头像',
      },
      roomName: {
        type: 'string',
        required: true,
        message: '直播间名称为必填项',
      },
      category: {
        // type: 'string',
        required: true,
        message: '请选择直播分类',
      },
    }

    const validator = new Schema(rules)
    validator.validate({...formValue}, {suppressWarning: true},
      async (errs) => {
        if (errs && errs.length > 0) {
          return Taro.showToast(({
            title: errs[0].message,
            icon: 'none',
          }))
        }
        setvisibles({...visibles, loading: true})
        api4512({...formValue, headImg: cutImagePrefixToService(formValue.headImg)}).then(() => {
          Taro.navigateTo({
            url: '/pages/live/applySuccess/index'
          })
        }).finally(() => {
          setvisibles({...visibles, loading: false})
        })

      }
    )
  }, {wait: 200})

  const headImgRef = useRef()

  const headImg: IFile[] = useMemo(() => {
    return formValue.headImg ? [
      {
        url: formValue.headImg,
        thumbUrl: formValue.headImg,
        uid: '0',
        name: formValue.headImg,
      }
    ] : []
  }, [formValue.headImg])

  return <View className="liveApply">
    {/* {JSON.stringify(headImg)} */}
    <View className="bw-card m-24">
      <ListItem
        className="liveApply-headimg-ListItem"
        type={1}
        left={<View className="bw-required">直播间头像</View>}
        right={<View className="">
          
          <Upload
            ref={headImgRef}
            max={1}
            mode="single"
            value={headImg}
            onChange={(v) => {
              handleFormChange('headImg', v.length > 0 ? v[0].url : '')
            }}
            imageComponent={
              headImg.map(item => <Image src={item.url} key={item.uid} className="liveApply-headImg liveApply-headImg__item" onClick={() => {
                headImgRef.current?.handUpload()
              }} />)
            }
            uploadButton={
              <Image src={formValue.headImg} className="liveApply-headImg" onClick={() => {
                headImgRef.current?.handUpload()
              }} />
            }
          >
          </Upload>
        </View>}
      />

      <ListItem
        type={1}
        icon={null}
        left={<View className="bw-required">直播间名称</View>}
        right={<Input className="liveApply-name-input" value={formValue.roomName} onInput={v => handleFormChange('roomName', v.detail.value)} placeholder="与主营类目相关，限10字" maxlength={10}/>}
      />

      <ListItem
        type={1}
        left={<View className="bw-required">直播分类</View>}
        right={<View onClick={() => setvisibles({...visibles, category: true})}>
          {
            !formValue.category ? <Text className="color-placeholder">请选择直播分类</Text> : <Text className="tabColor">{getcategoryName(formValue.category)}</Text>
          }
        </View>}
      />
    </View>

    <View className="bw-card m-24">
      <AtTextarea placeholder="请输入直播间介绍" maxLength={150} value={formValue.introduction} onChange={(v) => {handleFormChange('introduction', v)}} />
    </View>

    <View className="liveApply-footer">
      <AtButton type="primary" onClick={handleSubmit} loading={visibles.loading}>提交申请</AtButton>
      <View className="m-t-24 fz26 color666">点击即同意<Text className="bw-xieyi" onClick={() => {
        Taro.navigateTo({
          url: `/pages/webview/index?name=${encodeURIComponent('博物商家入驻协议11.17')}`
        })
      }}>《博物有道直播协议》</Text></View>
    </View>

    {/* <pre className="fz12">{JSON.stringify(formValue, null, 2)}</pre> */}

    {/* <SelectPicker
      cols={1}
      visible={visibles.category}
      onVisibleChange={v => setvisibles({...visibles, category: v})}
      data={categories}
      value={[formValue.category]}
      onChange={v => {
        console.log(v)
        handleFormChange('category', v.length > 0 ? v[0] : '')
      }}
    /> */}
    {/* 暂未支持小程序端 */}
    <Popup
      visible={visibles.category}
      onVisibleChange={v => setvisibles({...visibles, category: v})}
      onOk={() => {
        handleFormChange('category', aRef.current?.length > 0 ? aRef.current?.[0] : '')
      }}
    >
      <PickerView
        data={categories}
        cascade={false}
        value={formValue.category ? [formValue.category] : []}
        onChange={v => {
          console.log(v)
          aRef.current = v
        }}
      ></PickerView>
    </Popup>
  </View>
}