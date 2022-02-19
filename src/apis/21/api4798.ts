// @ts-nocheck
/**
 * 根据专题活动id查询绑定店铺信息
 * http://yapi.bwyd.com/project/21/interface/api/4798
 **/

import request from "@/service/http.ts";

export class IReqapi4798 {
  /**
   * 活动id
   */
  activityId?: string | number;
  searchCount?: string | number;
  pageNo?: string | number;
  pageSize?: string | number;
  lastId?: string | number;
  orderItems?: string | number;
}

/**
 * Result<PaginatedData<ActivityShopVo>> :Result
 */
export class IResapi4798 {
  code?: number;
  message?: string;
  traceId?: string;
  /**
   * PaginatedData
   */
  data?: {
    total?: number;
    /**
     * T
     */
    data?: {
      /**
       * 店铺信息 ,MerchantShopVo
       */
      shopInfo?: {
        /**
         * 上架商品数量
         */
        productNum?: number;
        /**
         * 关注粉丝数量
         */
        fansNum?: number;
        /**
         * 店铺保证金金额
         */
        marginShopAmount?: number;
        /**
         * 商品评论统计 ,CommentStatisticVo
         */
        comments?: {
          /**
           * 总评论次数
           */
          totalNum?: number;
          /**
           * 差评次数
           */
          badNum?: number;
          /**
           * 中评次数
           */
          middleNum?: number;
          /**
           * 好评次数
           */
          goodNum?: number;
          /**
           * 好评率
           */
          goodRate?: number;
          /**
           * 平均评分
           */
          avgScore?: number;
        };
        /**
         * 关注状态：0-未关注1-已关注
         */
        followStatus?: number;
        /**
         * 认证状态：0-未认证1-认证中（待审核）2-已认证,,@seecom.bwyd.user.enums.MerchantAuthStatus
         */
        authStatus?: number;
        /**
         * 该店铺是否是自己的店：0-不是1-是
         */
        isOwnShop?: number;
        /**
         * 商户编号
         */
        merchantNo?: string;
        /**
         * 店铺名称
         */
        shopName?: string;
        /**
         * 店铺LOGO
         */
        shopLogo?: string;
        /**
         * 店铺简介
         */
        shopIntro?: string;
        /**
         * 店铺认证标识：1-店铺认证 ,Integer
         */
        shopAuthTags?: number[];
        /**
         * 店铺地址：省
         */
        province?: string;
        /**
         * 店铺地址：市
         */
        city?: string;
        /**
         * 店铺地址：区
         */
        district?: string;
        /**
         * 渠道编号（邀请码）
         */
        channelNo?: string;
        /**
         * 开店时间
         */
        gmtCreate?: string;
        /**
         * 商户等级：1-金牌2-钻石3-服务商
         */
        merchantLevel?: number;
        /**
         * 店铺背景图
         */
        backgroundImg?: string;
      };
      /**
       * 店铺对应的商品信息 ,ProductSearchVo
       */
      prods?: {
        /**
         * 商品库存
         */
        stock?: number;
        /**
         * 商品发布时间
         */
        publishTime?: string;
        /**
         * 商品上下架状态
         */
        publishStatus?: number;
        /**
         * 商品销量
         */
        totalSales?: number;
        /**
         * 分享分佣比例
         */
        sDistPercent?: number;
        /**
         * 商品活动信息 ,ProdActivityVo
         */
        actInfo?: {
          /**
           * 单次限购数量,0或空不限购
           */
          perLimit?: number;
          /**
           * 活动价格
           */
          actPrice?: number;
        };
        /**
         * 商品拍卖信息 ,ProdAucSearchVo
         */
        auction?: {
          /**
           * 当前用户出价是否领先
           */
          ahead?: boolean;
          /**
           * 商品id
           */
          productId?: string;
          /**
           * 加价幅度
           */
          markUp?: number;
          /**
           * 保证金
           */
          margin?: number;
          /**
           * 竞拍开始时间
           */
          startTime?: string;
          /**
           * 竞拍结束时间
           */
          endTime?: string;
          /**
           * 0:竞拍中1:已截拍2:已流拍3:竞拍失败,ProductAuctionStatus
           */
          status?: number;
          /**
           * 起拍价
           */
          initPrice?: number;
          /**
           * 出价次数
           */
          auctionNum?: number;
          /**
           * 是否开启拍卖延时
           */
          delayState?: number;
          /**
           * 最新出价
           */
          lastAucPrice?: number;
          /**
           * 最新出价用户
           */
          lastAucUser?: string;
        };
        /**
         * 商品主键id
         */
        uuid?: string;
        /**
         * 商品名称
         */
        name?: string;
        /**
         * 商品封面
         */
        icon?: string;
        /**
         * 商品价格
         */
        price?: number;
        /**
         * 运费
         */
        freightPrice?: number;
        /**
         * 以逗号分割的产品服务
         */
        serviceIds?: string;
        /**
         * 商品原价
         */
        originalPrice?: number;
        /**
         * 分佣比例
         */
        distPercent?: number;
        /**
         * 商品类型0:一口价商品1:拍卖品,com.bwyd.product.enums.ProductType
         */
        productType?: number;
        /**
         * 是否店铺推荐0:否1:是
         */
        shopRecStatus?: number;
        /**
         * 业务来源0:普通1:直播
         */
        bizSource?: number;
        /**
         * 商户id
         */
        merchantId?: string;
      }[];
    }[];
    hasNext?: boolean;
  };
}

export const req4798Config = (data: IReqapi4798) => ({
  url: `/activity/shops`,
  method: "GET",
  header: {
    "Content-Type": "application/json",
  },
  yapi: "21",
  data,
});

/**
 * 根据专题活动id查询绑定店铺信息
 **/
export default function (data: IReqapi4798 = {}): Promise<IResapi4798["data"]> {
  return request(req4798Config(...arguments));
}
