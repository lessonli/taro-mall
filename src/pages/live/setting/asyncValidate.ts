import Schema, { Rules } from "async-validator"
import Taro from "@tarojs/taro"

const asyncValidate = (rules: Rules, value) => {
  const validator = new Schema(rules)
  return new Promise((reslove, reject) => {
    validator.validate(
      {...value},
      {suppressWarning: true},
      (errs) => {
        if (errs && errs.length > 0) {
          Taro.showToast({
            icon: 'none',
            title: errs[0].message
          })
          reject(errs)
        } else {
          reslove(value)
        }
      }
    )
  })
}

export default asyncValidate