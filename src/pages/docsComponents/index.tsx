import { useState, useEffect, useRef, useMemo } from 'react'
import { View, Button, Image,  } from '@tarojs/components'
import { AtButton, AtInput } from "taro-ui";
import { RadioGroup, Radio } from '@/components/RadioGroup'
import Upload, { VideoOutLined, IFile, BwAppChooseImage } from '@/components/Upload/index'
import BwModal from '@/components/Modal'
import './index.css'

import { getChinaAddsTree, IChinaTree } from "@/utils/cachedService";
import BWPicker from '@/components/SelectPicker/index.v2';
import Tabs from '@/components/Tabs';
import { AtInputMoney } from '@/components/AtInputPlus';
import { useRequest } from 'ahooks';
import { DEVICE_NAME } from '@/constants';
import { XImage } from '@/components/PreImage';
import { BWYD_ICON } from '@/constants/images';
import Cropper from '@/components/Upload/Cropper'
import Popup from '@/components/Popup';

import computeDate from '@/utils/computeDate'

console.warn(888, computeDate());

const App = () => {

  const uploadRef = useRef()

  const [imgs, setImgs] = useState<IFile[]>([
    // 'http://bwyd-test.oss-cn-hangzhou.aliyuncs.com/2a389eb2-8a9c-4e39-a8f7-fb17ada13d4e',
    // 'http://bwyd-test.oss-cn-hangzhou.aliyuncs.com/0690e346-c424-4ea5-8e67-fef17a1a6077'
  ]);

  const [tree, setTree] = useState<IChinaTree>([])

  const [region, setRegion] = useState<string[]>()

  const [regionVisible, setregionVisible] = useState(false);
  const [radioValue, setRadioValue] = useState<number>(2)

  const [money, setmoney] = useState(100);

  const [inputVal, setInputVal] = useState('');

  const ser = async () => {
    console.log('run', 9999)
    return Promise.resolve
    ({list: [], total: 0})
  }

  const {} = useRequest(ser, {
    loadMore: true,
    manual: true,
  })

  const sdkHandle = (type) => {
    if (type === 1) {
    //  const a =  window.BwJsbridgeSdk.callNative('getUserCurrentPosition')
    console.log('app sdk log start')
     WebViewJavascriptBridge.callHandler(
       'testJSFunction', 
       'js 传给app参数', // '{a: 1}'
      (res) => {
        // '{code, data}'
      
       console.log('回调到js', res)
      }
    )
     console.log('app sdk log end')
    //  const a = WebViewJavascriptBridge.callHandler('testJSFunctionSync', 'js同步传给app参数')
    //  console.log('a', a)
    //  console.log(2)
      // if (window.WebViewJavascriptBridge) {
      //   window.WebViewJavascriptBridge.callHandler('jsToNative',{'param': '中文测试'}, function(res) {
      //     alert(JSON.stringify(res))
      //   })
      // } else {
      //   window.addEventListener('WebViewJavascriptBridgeReady', () => {
      //     window.WebViewJavascriptBridge.callHandler(
      //       'jsToNative',
      //       {'param': '中文测试'},
      //       function(res) {
      //         alert(JSON.stringify(res))
      //       }
      //     )
      //   })
      // }
      // window.jsToNative()
    }

    if (type === 2) {
      // window.bwAppToH5()
    }
  }


  useEffect(() => {
    (async () => {
      console.log('uploadRef', uploadRef.current)
      const res = await getChinaAddsTree()
      setTree(res)
      // @ts-ignore
      // setRegion([res[0].value, res[0].children[0].value, res[0].children[0].children[0].value])
    })()
  }, [])
  const radioClick = (value) => {
    setRadioValue(value)

  }
  const [visible, setVisible] = useState<boolean>(false)
  const modalOptions = {
    title: '这是标题',
    content: <div>开启后您得到的商品可以被别的商家分享，分享商家成交后可获得相应佣金，提升您的销售额。当您设置的佣金 > 该品类平台分销最低值时，您的商品会被平台收录并审核，审核通过将在全平台出售。</div>,
    confirmText: '免费1认证',
    closeOnClickOverlay: true,
    onClose: () => {
      setVisible(false)
    },
    onCancel: () => {
    },
    onConfirm: () => {

    }
  }
  const showModal = () => {
    setVisible(true)
  }

  // useEffect(() => {
  //   Cropper({ src: BWYD_ICON })
  // }, [])

  const uploadButton = useMemo(() => {
    return <View>
      <View onClick={() => {
        uploadRef.current?.handUpload()
      }}>这是自定义上传展示</View>
      {
        imgs.map(item => <Image src={item.thumbUrl || item.url} key={item.uid} />)
      }
      <Button onClick={() => {
        uploadRef.current?.handleRemove()
        uploadRef.current?.handUpload()
      }}>重新上传</Button>
    </View>
  }, [imgs])
  return <View>
    <View> docComponents </View>
    <View>
      <View>上传组件</View>
      <Upload value={imgs} max={2} onChange={setImgs} ableCropper ></Upload>
      <Upload value={imgs} onChange={setImgs} >
        <VideoOutLined />
      </Upload>

      <Upload
        ref={uploadRef}
        value={imgs} onChange={setImgs}
        max={1}
        uploadButton={uploadButton}
      ></Upload>
    </View>

    <View>
      <AtButton onClick={() => setregionVisible(true)}>选择地址 {region}</AtButton>
      <BWPicker
        visible={regionVisible}
        onVisibleChange={setregionVisible}
        data={tree}
        cols={3}
        value={region}
        onChange={setRegion}
        title="选择地址"
      ></BWPicker>
    </View>

    <View>
      <div>
        <RadioGroup value={radioValue} onChange={radioClick}>
          <Radio name={2}>
            <span>全国包邮</span>
          </Radio>
          <Radio name={1}>
            <span>全国包邮</span>
          </Radio>
          <Radio name={3}>
            <span>全国包邮</span>
          </Radio>
        </RadioGroup>
      </div>
    </View>
    <View>
      <AtButton onClick={showModal}>打开Modal</AtButton>
    </View>
    <BwModal visible={visible} {...modalOptions} />


    <Tabs options={[
      { label: 'xxxx1', value: 1 },
      { label: 'xxxx2', value: 2 },
    ]}
      value={1}
      composition={2}
    ></Tabs>

    <View>
      <AtInputMoney value={money} onChange={setmoney} />
      ￥{money}
      <input name="xxx" value={inputVal} onChange={ev => {
        let val = ev.target.value
        if (val.length >= 6) {
          val = val.substring(0, 6)
        }
        console.log(val)
        setInputVal(val)
      }} />


    </View>

    <View>
      <View>JSBRIDGE</View>
      <AtButton onClick={() => sdkHandle(1)}>js调用app getUserCurrentPosition</AtButton>
      <AtButton onClick={() => sdkHandle(2)}>app调用js</AtButton>
    </View>

    <XImage src={'https://bwyd-test.oss-cn-hangzhou.aliyuncs.com/bwyd-test/test/h5/9B5C56EF1105259A_w1080_h2400_s1710749.jpg'} style={{width: '100px', height: '100px'}} mode="aspectFill" />
    {/* <Image src={'https://bwyd-test.oss-cn-hangzhou.aliyuncs.com/bwyd-test/test/h5/9B5C56EF1105259A_w1080_h2400_s1710749.jpg?x-oss-process=image%2Fresize%2Cw_120%2Fquality%2Cq_100'} mode="aspectFit"/> */}
  </View>
}

const AppUpload = () => {
  return <View>
    <AtButton type="primary" onClick={() => {
      BwAppChooseImage({
        count: 3,
        sourceType: ['camera', 'album'],
      })
    }}>app上传图片</AtButton>
  </View>
}

const B = () => {
  return <Popup
    title=""
    visible={true}
    layoutCenter
    headerType="empty"
  >
    <View style={{background: 'red'}}>居中展示</View>
  </Popup>
}


export default () => {
  return <View>
    <App />
    {/* <AppUpload /> */}
  </View>
}
