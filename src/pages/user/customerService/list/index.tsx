

import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton } from "taro-ui";
import ListItem from "@/components/ListItem";
import { ruzhu, gouwu, paimai, shouhou, caiwu, helpActive } from "@/constants/images";
import api4424 from "@/apis/21/api4424";
import { isAppWebview } from "@/constants";
import './index.scss'

function CustomerService() {

  const LIST = [
    // {
    //   title: '活动相关', type:'5', img: helpActive,children:[
    //     {title: '邀请奖励提现到哪'},
    //     {title: '邀请奖励如何使用'}
    //   ]
    // },

    {
      title: '入驻相关', type: 0, img: ruzhu,
      children: [
        { title: '如何入驻平台' },
        { title: '如何进行店铺认证' },
      ]
    },
    {
      title: '购物相关', type: 1, img: gouwu, children: [
        { title: '发货时间' },
        { title: '发货快递公司' },
        { title: '如何联系商家' },
        { title: '运费问题' },
        { title: '商品不满意' }
      ]
    },
    {
      title: '拍卖相关', type: 2, img: paimai, children: [
        { title: '误出价怎么办' },
        { title: '关于拍卖保证金' },
        { title: '出价之后不想要了' },
        { title: '什么是违约率' },
      ]
    },
    {
      title: '售后相关', type: 3, img: shouhou, children: [
        { title: '如何退货退款' },
        { title: '退货运费怎么算' },
        { title: '七天无理由退换' },
        { title: '商家售假' },
        { title: '没收到货怎么办' },
        { title: '申请仲裁' }

      ]
    },
    {
      title: '财务相关', type: 4, img: caiwu, children: [
        { title: '退款多久到账' },
        { title: '拍卖保证金' },
        { title: '如何提现' },
        { title: '关于余额充值' },
      ]
    }
  ]
  const chartBw = async () => {
    const res = await api4424()
    if (!isAppWebview) {
      Taro.navigateTo({
        url: `/pages/im/message/index?id=${res?.identifier}&type=1`
      })
    } else {
      WebViewJavascriptBridge.callHandler('openNativePage',
        JSON.stringify({
          page: '/im/chat',
          params: {
            identifier: res?.identifier
          }
        })
      )
    }

  }
  return (
    <View className='bw-help'>
      {LIST.map(item => {
        return <View className='bw-help-box m-t-24' key={item.title}>
          <View className='bw-help-box-item'>
            <ListItem
              icon={null}
              type={1}
              left={<View className='bw-help-title'>
                <Image className='bw-help-title-img' src={item.img}></Image>
                <View>{item.title}</View>
              </View>}
            />
            {item.children.length > 0 && item.children.map(item2 => {
              return <ListItem key={item2.title}
                type={1}
                left={item2.title}
                handleClick={() => Taro.navigateTo({ url: `/pages/user/customerService/detail/index?type=${item.type}` })}
              />
            })}
          </View>
        </View>
      })}

      <View onClick={chartBw} className='m-t-52 m-b-24'><AtButton className='fz36' type='primary'>在线客服</AtButton></View>
    </View>
  )
}


export default CustomerService