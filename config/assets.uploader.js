const {uploader} = require('./upload.js')
const path = require('path')

uploader(
  {
    from: [path.resolve(__dirname, '../src/assets/**')]
  }
)