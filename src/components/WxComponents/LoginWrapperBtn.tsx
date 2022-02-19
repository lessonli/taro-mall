import { loginCertify } from "@/utils/base"
import { getUserInfo } from "@/utils/cachedService"
import React from "react"

/**
 * 按钮逻辑执行前 需要先登录
 */
export default (
  Com
) => {
  return class extends React.Component {

    onClick = async (...args) => {
      try {
        await getUserInfo()
        console.log('用户已登录');
        this.props.onClick?.(...args)
      } catch (err) {
        if (err?.code === 1000 || err?.code === 1010) {
          loginCertify()
        }
      }
    }

    render() {
      const props = {
        ...this.props,
        onClick: this.onClick,
      }
      return <Com {...props} />
    }
  }
}