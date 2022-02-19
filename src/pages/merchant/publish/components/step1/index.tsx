import { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import { AtButton, AtInput, AtTextarea } from "taro-ui";
import Taro from '@tarojs/taro'

import ListItem from "@/components/ListItem";
import Upload, { VideoOutLined } from "@/components/Upload";
import {tixing} from "@/constants/images";
import { IResapi1652 } from "@/apis/21/api1652";

import './index.scss'
import ClassifyPicker from "@/components/ClassifyPicker";
import { getCategories, getStatus } from "@/utils/cachedService";
import Schema, { Rules } from 'async-validator';
import storge from '@/utils/storge'
import api2524 from "@/apis/21/api2524";
import BwModal from "@/components/Modal";
import dayjs from "dayjs";
import api2452 from "@/apis/21/api2452";
import { useDidShow } from "@tarojs/runtime";
import agreements from "@/constants/agreements";

// 发布商品

// 创建入口 编辑入口 需要先清除缓存
// 页面内先读取缓存

const PublishFirst = (props: {
  productType: any;
  productId?: string;
  onSubmitSuccess: any;
  prevInfo?: any;
  currentHref?: string;
}) => {
  const [categories, setcategories] = useState<IResapi1652['data']>([]);
  const [defaultCategories, setdefaultCategories] = useState(undefined);
  const [values, setValues] = useState({
    categoryId: [],
    name: '',
    albumPics: [],
    videoLinks: [],
    mobileHtml: '',
  });

  const [visibles, setVisibles] = useState({
    ClassifyPicker: false,
    // 未认证的商铺 去认证
    toAuth: false,
    // 装修
    toDecorate: false,
  });

  const [focusing, setFocusing] = useState(true);

  const getPrevInfo = async () => {
    if (!props.prevInfo) return
    let prevInfo = {...values}
    // @ts-ignore
    const cCategory = await getCategories.parseLastId(props.prevInfo.categoryId)
    const categoryId = cCategory?.paths
    setdefaultCategories(categoryId)
    prevInfo = {
      ...props.prevInfo,
      categoryId,
      albumPics: props.prevInfo.albumPics?.split(',').map((url, i) => (({
        uid: `${i}`,
        name: `${i}`,
        url,
        thumbUrl: url,
      }))),
      videoLinks: (props.prevInfo.videoLinks ? [props.prevInfo.videoLinks] : []).map((url, i) => (({
        uid: `${i}`,
        name: `${i}`,
        url,
        thumbUrl: url,
      }))),
    }
    setValues(prevInfo)
  }

  useEffect(() => {
    (async () => {
      const res = await getCategories()
      setcategories(res)
      getPrevInfo()
    })()
  }, [props.prevInfo]);

  useDidShow(() => {
    // 未装修的店铺： 发布商品前，请进行店铺装修，完善店铺信息
    (async () => {
      const res1 = await api2452()
      if (res1?.returnAddressStatus === 0) {
        setVisibles({
          ...visibles,
          toDecorate: true,
        })
      } else {
        // 未认证的店铺 弹框 每天弹一次
        const today = dayjs().format('YYYY-MM-DD')
        const lastOpenDateWhenMerchantNotAuthed = storge.getItem('lastOpenDateWhenMerchantNotAuthed')
        if (today !== lastOpenDateWhenMerchantNotAuthed) {
          storge.setItem('lastOpenDateWhenMerchantNotAuthed', today)
          api2452().then(res => {
            const apitoAuth = res?.authStatus === 0
            setVisibles({
              ...visibles,
              toAuth: apitoAuth,
            })
          })
        }
      }
    })()
  })

  const handleViaibleChange = useCallback((name, value) => {
    setVisibles({
      ...visibles,
      [name]: value,
    })
  }, [visibles])

  const handleChange = ((name, value) => {
    setValues({
      ...values,
      [name]: value,
    })
    return value
  })

  const categoriesName = useMemo(() => {
    if (values.categoryId?.length) {
      const [id1, id2] = values.categoryId
      const item1 = categories?.find(level1 => level1.id === id1)
      const item2 = item1?.children?.find(leve2 => leve2.id === id2)
      return `${item1?.name}-${item2?.name}`
    }
    return '选择分类'

  }, [categories, values.categoryId])

  const handlesubmit = useCallback(async () => {
    console.log(values)

    const rules: Rules = {
      name: {
        required: true,
        validator: (rule, value, cb) => {
          const l = value?.length
          if (l >=3 && l <=35) {
            return cb()
          } else {
            return new Error('商品名称3~35个字符')
          }
        }
      },
      categoryId: {
        type: 'array',
        len: 2,
        message: '请选择商品分类'
      },
      mobileHtml: {
        validator: (_, value, cb) => {
          const l = value?.length
          if (l > 2000) {
            return new Error('商品描述需要限制在2000字以内')
          }
          cb()
        } 
      },
      albumPics: {
        type: 'array',
        max: 9,
        min: 3,
        message: '请上传3~9张图片',
      }

    }

    const albumPics = (values.albumPics || []).filter(ele => (ele.status !== 'uploading' && ele.url))

    const validator = new Schema(rules)
    validator.validate({...values, albumPics}, {suppressWarning: true}, async (errs) => {
      console.log('errs', errs)
      if (errs && errs.length > 0) {
        return Taro.showToast(({
          title: errs[0].message,
          icon: 'none',
        }))
      }
      const categoryId = values.categoryId[1]
      const ccategoryId = await getCategories.parseLastId(categoryId)
      const categoryIdDistPercent = ccategoryId?.distPercent || undefined

      const req = {
        name: values.name,
        mobileHtml: values.mobileHtml,
        categoryId,
        // 分类 推荐分佣比例
        categoryIdDistPercent,
        albumPics: albumPics.map(ele => ele.url).join(','),
        videoLinks: (values.videoLinks || []).map(ele => ele.url).join(','),
        productType: props.productType
      }

      
      if (props.productId) {
        req.productId = props.productId
      }
      
      
      console.log('req', req)

      props.onSubmitSuccess?.(req)

    })
    
  }, [values])

  return (
    <View className="publish-good-page">
      <View className="PublishFirst">
        <View className="step-1">
          
          <ListItem
            type={1}
            icon={null}
            left={'商品名称'}
            right={<Input className="bw-input-native input-good-name" name="name" value={values.name} onInput={(v) => handleChange('name', v.detail.value)} placeholder="商品名称3-35个字" focus maxlength={35} ></Input>}
          />

          <ListItem
            type={1}
            left={<View>商品分类</View>}
            right={<Text
              className={`${categoriesName === '选择分类' ? 'color-placeholder' : 'tabColor'}`}
              onClick={() => handleViaibleChange('ClassifyPicker', true)}>{categoriesName}</Text>}
          />
        </View>

        <View className="step-2">
          <View>
            <AtTextarea className="detail-textarea"
              height="200"
              count={false}
              value={values.mobileHtml} 
              onChange={(v) => handleChange('mobileHtml', v)} 
              maxLength={2000}
              placeholder="请输入拍品的描述，包含规格，材质及核心卖点介绍等信息…"
              onFocus={() => setFocusing(true)}
              onBlur={() => setFocusing(false)}
            ></AtTextarea>
          </View>
          <View>
            <Upload value={values.albumPics} onChange={(v) => handleChange('albumPics', v)} max={9}></Upload>
            <Upload value={values.videoLinks} onChange={v => handleChange('videoLinks', v)} type="video" max={1}>
              <VideoOutLined />
            </Upload>
          </View>
          <View className="desc m-t-12">
            <Image src={tixing} className="tixing"></Image> 可鉴定商品最后一张上传证书图片
          </View>
        </View>

        <View className="footer">
          <AtButton type="primary" onClick={handlesubmit}>下一步</AtButton>
          <View className="agreements">
            下一步即同意
            <Text className="agreement-item" onClick={() => {
              Taro.navigateTo({
                url: `/pages/webview/index?name=${encodeURIComponent('卖家店铺服务规范')}`
              })
            }}>《{'卖家店铺服务规范'}》</Text>
          </View>
        </View>

      </View>

      <ClassifyPicker
        visible={visibles.ClassifyPicker}
        onVisibleChange={(v) => handleViaibleChange('ClassifyPicker', v)}
        onOk={(v) => {
          handleChange('categoryId', v)
          handleViaibleChange('ClassifyPicker', false)
        }}
        categories={categories}
        defaultValue={defaultCategories}
      ></ClassifyPicker>


    <BwModal
      title="快速认证店铺"
      content={<View>实名认证店铺，可获得首页推荐，平台流量。若无需认证，点击右上角关闭即可。</View>}
      confirmText={"免费认证"}
      visible={visibles.toAuth}
      onClose={() => setVisibles({...visibles, toAuth: false})}
      onConfirm={() => {
        Taro.navigateTo({
          url: `/pages/merchant/storeApprove/index`
        })
      }}
    ></BwModal>

    <BwModal
      title="提示"
      content={<View>发布商品前，请进行店铺装修，完善店铺信息</View>}
      confirmText={"去完善"}
      cancelText="退出发布"
      visible={visibles.toDecorate}
      onClose={() => {
        setVisibles({...visibles, toDecorate: false})
        Taro.navigateBack()
      }}
      onCancel={() => {
        setVisibles({...visibles, toDecorate: false})
        Taro.navigateBack()
      }}
      onConfirm={() => {
        Taro.navigateTo({
          url: `/pages/merchant/storeFitment/index?sourceUrl=${encodeURIComponent(props.currentHref || '')}`
        })
      }}
    ></BwModal>
    </View>
  )
}


export default PublishFirst