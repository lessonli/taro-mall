import { isAppWebview } from '@/constants';
import { conversationList } from '@/store/atoms';
import Taro from '@tarojs/taro';
// import { default as TIMH5 } from 'tim-js-sdk';
// import { default as TIMWEAPP } from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import dev, { env } from 'config/dev';
import { ENV_TYPE } from '@tarojs/taro';
import { debounce } from '@/utils/base';
let options = {
  SDKAppID: 1400568433 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
let num = 0
// console.log(TIMWEAPP, 123213, TIMH5);
export const TIM = require('tim')
export const tim = TIM.create(options); // SDK 实例通常用 tim 表示
// const isMerchant =
export const createIM = (userId, userSig, IMchange, geImtReady, conversationChange, imloginOut, userType) => {
  let monitorValue = {
    MESSAGE_RECEIVED: 0
  }

  // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn//SDK.html#setLogLevel">setLogLevel 接口的说明</a>
  tim.setLogLevel(process.env.NODE_ENV === 'production' ? 4 : 1); // 普通级别，日志量较多，接入时建议使用
  // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
  // 注册腾讯云即时通信 IM 上传插件
  tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
  // 监听事件，例如：
  tim.on(TIM.EVENT.SDK_READY, function (event) {
    // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
    // event.name - TIM.EVENT.SDK_READY
    geImtReady()
  });
  tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
    console.log('收到消息啦', event);
    IMchange(event)
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    // event.name - TIM.EVENT.MESSAGE_RECEIVED
    // event.data - 存储 Message 对象的数组 - [Message]
  });
  tim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
    // 收到消息被撤回的通知
    // event.name - TIM.EVENT.MESSAGE_REVOKED
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
  });
  tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function (event) {
    console.log('消息已读', event);

    // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
    // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
    // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
  });
  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
    console.log('会话列表更新', event);
    conversationChange(event)
    // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
  });
  tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
    // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
    // event.name - TIM.EVENT.GROUP_LIST_UPDATED
    // event.data - 存储 Group 对象的数组 - [Group]
  });
  tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
    // 收到自己或好友的资料变更通知
    // event.name - TIM.EVENT.PROFILE_UPDATED
    // event.data - 存储 Profile 对象的数组 - [Profile]
  });
  tim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
    // 收到黑名单列表更新通知
    // event.name - TIM.EVENT.BLACKLIST_UPDATED
    // event.data - 存储 userID 的数组 - [userID]
  });
  const ImReback = () => {
    Taro.showModal({
      title: '提示',
      content: '通话掉线啦,是否需要重连',
      confirmColor: '#AA1612',
      success: function (res) {
        if (res.confirm) {
          imloginOut()
          tim.login({ userID: userId, userSig: userSig }).then(res => {
            Taro.showToast({
              title: '消息重连成功啦～'
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  const deImReback = debounce(ImReback, 1000)
  tim.on(TIM.EVENT.ERROR, function (event) {
    // imloginOut()
    console.log(event, 12323);

    deImReback()
    // 收到 SDK 发生错误通知，可以获取错误码和错误信息
    // event.name - TIM.EVENT.ERROR
    // event.data.code - 错误码
    // event.data.message - 错误信息
  });
  tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
    console.log(event, 5556666);

    imloginOut()
    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    // event.name - TIM.EVENT.SDK_NOT_READY
  });
  tim.on(TIM.EVENT.KICKED_OUT, function (event) {
    // 收到被踢下线通知
    // event.name - TIM.EVENT.KICKED_OUT
    // event.data.type - 被踢下线的原因，例如:
    //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
    //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
    //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。 
  });
  tim.on(TIM.EVENT.NET_STATE_CHANGE, function (event) {
    //  网络状态发生改变（v2.5.0 起支持）。 
    // event.name - TIM.EVENT.NET_STATE_CHANGE 
    // event.data.state 当前网络状态，枚举值及说明如下： 
    //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络 
    //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中” 
    //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息  
  });
  // 开始登录 
  userType === 'merchant' && tim.login({ userID: userId, userSig: userSig })
  return new Promise<void>((resolve, reject) => {
    resolve(tim)
  })
  // return new Promise<void>((resolve) => {
  //   resolve(tim)
  // })

}
