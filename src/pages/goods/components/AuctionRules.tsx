import { chujia, next, lingx, zhif, shangp } from '@/constants/images';
import Taro from '@tarojs/taro';
import { useCallback } from 'react';
import { AtButton } from 'taro-ui';
import './index.scss'

const AuctionRules = (props) => {
  const { onClose } = props
  const close = useCallback(
    () => {
      onClose()
    }, []
  )
  return (
    <div className='AuctionRules'>
      <div className='AuctionRules-content'>
        <div className='GoodsDetail-auctionIntroduce-list'>
          <div className='GoodsDetail-auctionIntroduce-list-item'>
            <img src={chujia} alt="" />
            <p>参与出价</p>
          </div>
          <img src={next} className='GoodsDetail-auctionIntroduce-list-next' alt="" />
          <div className='GoodsDetail-auctionIntroduce-list-item'>
            <img src={lingx} alt="" />
            <p>价高者得</p>
          </div>
          <img src={next} className='GoodsDetail-auctionIntroduce-list-next' alt="" />
          <div className='GoodsDetail-auctionIntroduce-list-item'>
            <img src={zhif} alt="" />
            <p>支付货款</p>
          </div>
          <img src={next} className='GoodsDetail-auctionIntroduce-list-next' alt="" />
          <div className='GoodsDetail-auctionIntroduce-list-item'>
            <img src={shangp} alt="" />
            <p>获得宝贝</p>
          </div>
        </div>
        <div className='AuctionRules-content-item'>
          <p className='AuctionRules-content-item-title'>一、如何参与竞拍</p>
          <p className='AuctionRules-content-item-matter'>1.点击出个价参与竞拍，价高者得；</p>
          <p className='AuctionRules-content-item-matter'>2.竞拍成功，支付货款；</p>
          <p className='AuctionRules-content-item-matter'>3.等待卖家发货；</p>
        </div>
        <div className='AuctionRules-content-item'>
          <p className='AuctionRules-content-item-title'>二、什么是拍品保证金？</p>
          <p className='AuctionRules-content-item-matter'>保证金包括拍品保证金和系统保证金，部分拍品需缴纳保证金后方可参与竞拍，正常交易后全额退回，违约后将按保证金规则进行赔付和处理。</p>
        </div>
        <div className='AuctionRules-content-item'>
          <p className='AuctionRules-content-item-title'>三、如何保证钱款安全？</p>
          <p className='AuctionRules-content-item-matter'>支付的货款由平台担保，当买家确认收货后，货款才会打给商家。</p>
        </div>
        <div className='AuctionRules-content-item'>
          <p className='AuctionRules-content-item-title'>四、收到货不满意，如何处理？</p>
          <p className='AuctionRules-content-item-matter'>1.竞拍成功后，若卖家72小时内未发货，可申请退款；</p>
          <p className='AuctionRules-content-item-matter'>2.7天包退的商品发生退货，可在包退期内退货；</p>
          <p className='AuctionRules-content-item-matter'>3.如遇到交易纠纷，可选择官方客服介入，申请售后冻结货款，保障消费者权益。</p>
        </div>
        <div className='AuctionRules-content-item'>
          <p className='AuctionRules-content-item-title'>五、哪些特殊商品签收后不支持售后？</p>
          <p className='AuctionRules-content-item-matter'>定制商品、二次加工商品、原石、毛货、盲拍盲盒、贵重金属、二手商品、活体商品（花卉、盆栽、宠物等）、证书及虚拟商品（邮费、代购费等）</p>
        </div>
      </div>
      <div className='AuctionRules-btn'>
        <AtButton type='primary' onClick={close}>知道了</AtButton>
      </div>
    </div>
  )
}

export default AuctionRules
