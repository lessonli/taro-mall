import Schema, { Rules, ValidateSource } from 'async-validator';
import Taro from '@tarojs/taro'
export const onValidateField = (value: ValidateSource, rules: Rules) => {
  const validator = new Schema(rules);
  return new Promise<any>((resolve) => {
    // @ts-ignore
    validator.validate(value, (errors, fields) => {

      if (errors) {
        resolve(errors.filter((item, index) => index === 0));
      } else {
        const errMsg = Object.keys(rules).map((key) => {
          return {
            field: key,
            message: undefined,
          };
        });
        resolve(errMsg);
      }
    });
  }).then(errMsg => {
    const msgList = getErrorMsgList(errMsg)
    return msgList
  })
};

const getErrorMsgList = (errors: any[]) => {
  let msgList: { errMsg?: any } = {};
  // errors?.map((error: { field: React.ReactText; message: any }) => {

  // });
  msgList['errMsg'] = errors[0]?.message || "";
  return msgList.errMsg;
};

export const validateData = async (form, key, value) => {
  if (!form.hasOwnProperty(key)) return
  const errMsg = await onValidateField(
    { [key]: value },
    { [key]: form[key] },
  )
  errMsg && Taro.showToast({ title: errMsg, icon: 'none' })
  return errMsg
}

export const onValidateData = async (form, obj) => {
  let isSuccess = true
  if (!obj) {
    Taro.showToast({ title: '请填写表单', icon: 'none' })
    isSuccess = false
  } else {
    for (const key in form) {
      if (obj.hasOwnProperty(key)) {
        const result = await validateData(form, key, obj[key])
        result && (isSuccess = false)
      } else {
        validateData(form, key, '')
        isSuccess = false
        // break
      }
    }
  }
  return isSuccess
}
