import { DEVICE_NAME } from "@/constants"

/**
 * 参考 https://www.jianshu.com/p/262658b8d19c
 * 小程序文档 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#21
 * @param props 
 * @returns 
 */
export const WxOpenLaunchWeapp = (props: {
  /**
   * 所需跳转的小程序内页面路径及参数
   */
  path: string;
  children: React.ReactNode;
}) => {
  const wxopenlaunchweapp = `<wx-open-launch-weapp username="${WEAPP_GH_ID}" path="${props.path}" style="position: absolute; top: 0;left: 0;bottom: 0; right: 0; z-index: 2;">
    <script type="text/wxtag-template">
      <div id="wx-open-launch-weapp-btn" style="width: 100%;height: 100%;position: absolute; top: 0;left: 0;opacity: 0;">按钮</div>
    </script>
  </wx-open-launch-weapp>`

  return DEVICE_NAME === 'wxh5' ? <div className="WxWrapperComponent" style={{ position: 'relative' }}>
    <div className="WxWrapperComponent-content">
      {
        props.children
      }
    </div>
    <div dangerouslySetInnerHTML={{ __html: wxopenlaunchweapp }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
  </div> : <>{props.children}</>
}