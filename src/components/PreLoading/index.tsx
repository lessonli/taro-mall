import { bowu } from '@/constants/images'
import ReactDOM from 'react-dom';
import './index.scss'
import React, { Component } from 'react';
// import Portal from '../Portal';
// const PreLoading = function () {
//   return (
//     <div className='bw-preLoading'>
//       <img className='bw-preLoading-img' src={bowu} alt="" />
//     </div>
//   )
// }
class PreLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertStatus: false, //是否显示提示框|
    }
  }
  open(options) {
    options = options || {};
    options.alertStatus = true;
    this.setState({
      ...options
    })
  }
  //取消
  cancel() {
    this.close()
  }
  close() {
    this.setState({
      alertStatus: false
    })
  }

  render() {
    const { alertStatus } = this.state
    return (
      process.env.TARO_ENV === 'weapp' || alertStatus ? <div className='bw-preLoading'>
        <img className={process.env.TARO_ENV === 'weapp' ? 'bw-preLoading-weapp-img' : 'bw-preLoading-img'} src={bowu} alt="" />
      </div> : null

    )
  }
}
let PreLoadingBOx
if (process.env.TARO_ENV !== 'weapp') {
  let div = document.createElement('div');
  document.body.appendChild(div);
  PreLoadingBOx = ReactDOM.render(<PreLoading />, div);
} else {
  PreLoadingBOx = PreLoading
}

export default PreLoadingBOx
