
export const tabs = [
  {title: '提现记录', active: true, value:0},
  {title: '邀请攻略', active: false, value:1},
  {title: '邀请记录', active: false, value:2},

]

// 改为一张图 无用
// export const inviteStrategy = [
//   {title: '1.用户打开您分享的小程序链接/小程序二维码', img: ['https://picsum.photos/id/30/1280/901','https://picsum.photos/id/30/1280/901']},
//   {title: '2.微信授权手机号注册成功', img:['https://picsum.photos/id/306/1024/768']},
//   {title: '3.查看邀请记录', img: ['https://picsum.photos/id/306/1024/768']}
// ]

export const moneyStatus = new Map([
  [1, {
    label: '审核中', value: 1,color: '#999999'
  }],
  [2, {
    label: '已入账', value: 2, color :'#F54C3E'
  }],
  [3, {
    label: '审核拒绝', value: 3, color :'#000000'
  }],
])