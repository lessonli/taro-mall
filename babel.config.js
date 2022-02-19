// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      // useBuiltIns: 'usage',
      // targets: {
      //   ios: '9',
      //   android: '4'
      // }
    }]
  ],
  "plugins": [
    ['babel-plugin-transform-globalthis'],
    // ['@babel/plugin-proposal-class-properties'],
    ["import", { libraryName: "antd-mobile", style: "css" }], // `style: true` 会加载 less 文件
  ]
}
