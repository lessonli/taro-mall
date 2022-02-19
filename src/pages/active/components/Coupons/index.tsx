import { Text, View, Image } from "@tarojs/components";
import { useCallback, useMemo, useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import compose, { deepClone, fen2yuan, selectorQueryClientRect } from "@/utils/base";
import Big from "big.js";
import Taro from "@tarojs/taro";

import api4880, { IResapi4880 } from "@/apis/21/api4880";


type IData = Required<IResapi4880>["data"];
type ICouponsData = Required<IResapi4880>['data'][0]

import "./index.scss";

interface IDataProps {
  data: IData;
  onClick: (uuid:string) => void
}

interface ITakeState {
  /**
   * 0 未领取
   * 1 已领取
   * 2 已领完
   */
  status: 0 | 1 | 2
}

const TakeState = (props: ITakeState) => {
  return <View>
    {/* 立即使用 */}
    {props.status === 0 && <View>立即领取</View>}
    {props.status === 1 && <View>去使用</View>}
    {props.status === 2 && <View style={{ opacity: '0.5' }}>已领完</View>}

  </View>
}

export const OneRowOneColumn = (props: IDataProps) => {
  console.clear();
  
  console.log(props.data, 'propsOne');

  return <View className="bwCoupons-one">
    <View className="bwCoupons-one-price">
      {props.data && props.data[0]?.grantType === 1 && (
        <>
          <Text className="bwCoupons-one-price-sys">￥</Text>
          <Text className="bwCoupons-one-price-money">
            {fen2yuan(props?.data?.[0].price)}
          </Text>
        </>
      )}
      {props.data?.[0]?.grantType === 2 && (

        <>
          <Text className="bwCoupons-one-price-money">
            {new Big((props?.data?.[0].price) || 10)
              .div(10)
              .toNumber()}
          </Text>
          <Text className="bwCoupons-one-price-sys">折</Text>
        </>
      )}
    </View>
    <View className="bwCoupons-one-desc">
      <View className="bwCoupons-one-desc-title">
        满{fen2yuan(props?.data && props?.data[0]?.minPoint)}元可用
      </View>
      <View className="bwCoupons-one-desc-subtit">
        {props?.data && props?.data[0]?.instruction}
      </View>
    </View>
    <View className="bwCoupons-one-use">
      <View className="bwCoupons-one-use-btn" onClick={() => props.onClick(props?.data?.[0]?.uuid)}>
        <TakeState status={props.data?.[0]?.takeState}></TakeState>
      </View>
    </View>
  </View>
}
export const OneRowDoubleColumns = (props: IDataProps) => {
  return <View className="bwCoupons-two">
    {
      props?.data?.map((item, index) => {
        return <View key={index} className="bwCoupons-two-item">
          <View className="bwCoupons-two-item-t">
            <View className="bwCoupons-two-item-t-left">

              {item?.grantType === 1 && (
                <>
                  <Text className="bwCoupons-two-item-t-left-sys">￥</Text>
                  <Text className="bwCoupons-two-item-t-left-money">
                    {fen2yuan(item?.price)}
                  </Text>
                </>
              )}
              {item?.grantType === 2 && (
                <>
                  <Text className="bwCoupons-two-item-t-left-money">

                    {new Big((item.price) || 10)
                      .div(10)
                      .toNumber()}
                  </Text>
                  <Text className="bwCoupons-one-price-sys">折</Text>
                </>
              )}
            </View>
            <View className="bwCoupons-two-item-t-right">
              <View className="bwCoupons-two-item-t-right-title">
                满{fen2yuan(item?.minPoint)}元可用
              </View>
              <View className="bwCoupons-two-item-t-right-desc">
                {item?.instruction}
              </View>
            </View>
          </View>
          <View className="bwCoupons-two-item-b">
            <View className="bwCoupons-two-item-b-btn" onClick={() => props.onClick(item.uuid)}>
              <TakeState status={item?.takeState}></TakeState>
            </View>
          </View>
        </View>
      })
    }


  </View>
}

export const OneRowThreeColmns = (props: IDataProps) => {
  return <View className="bwCoupons-three">
    {
      props?.data?.map((item, index) => {
        return <View key={index} className="bwCoupons-three-item">
          <View className="bwCoupons-three-item-t">
            <View className="bwCoupons-three-item-t-price">
              {
                item?.grantType === 1 && <>
                  <Text className="bwCoupons-three-item-t-price-sys">￥</Text>
                  <Text className="bwCoupons-three-item-t-price-money">
                    {
                      fen2yuan(item?.price)
                    }
                  </Text>
                </>
              }
              {
                item?.grantType === 2 && <>

                  <Text className="bwCoupons-three-item-t-price-money">
                     {new Big((item.price) || 10)
                      .div(10)
                      .toNumber()}
                    <Text className="bwCoupons-three-item-t-price-sys">折</Text>
                  </Text>
                </>
              }

            </View>
            <View className="bwCoupons-three-item-t-title">
              满{fen2yuan(item?.minPoint)}元可用
            </View>
            <View className="bwCoupons-three-item-t-subtit">
              {item?.instruction}
            </View>
          </View>
          <View className="bwCoupons-three-item-b">
            <View className="bwCoupons-three-item-b-btn" onClick={() => props.onClick(item.uuid)}>
              {/* 立即使用 */}
              <TakeState status={item?.takeState} ></TakeState>
            </View>
          </View>
        </View>
      })
    }

  </View>
}

export const StandardLayoutCoupon = (props: IDataProps) => {
  return <>
    {/* 把单个拆分成组件 start */}
    {
      props?.data?.length === 1 && <OneRowOneColumn {...props}></OneRowOneColumn>
    }

    {/* 把单个拆分成组件 end */}

    {/* 把双个拆分成组件 start */}
    {
      (props?.data?.length === 2 || props.data?.length === 4) && <OneRowDoubleColumns {...props}></OneRowDoubleColumns>
    }
    {/* 把双个拆分成组件 end */}

    {/* 把三个拆分成组件 start */}
    {
      (props?.data?.length === 3 || props?.data?.length > 4) && <OneRowThreeColmns {...props}></OneRowThreeColmns>
    }
    {/* 把三个拆分成组件 end */}
  </>
}

const Coupons = (props: IDataProps, ref) => {

  const query = Taro.createSelectorQuery()
  // console.log(props, "props");
  const couponsRef = useRef()

  useImperativeHandle(ref, () => ({
    getHeight: () =>getHeight()

  }));

  const getHeight = async()=>{
    let once = false 
    let result = {}
    if(!once){
      once = true
      const res= await  selectorQueryClientRect('#ls_coupons_container')
      result = res
      return Promise.resolve(result)
    }
    return Promise.resolve(result)
  }


  const getLayout = useCallback((props:IDataProps)=>{
    
    if(props?.data?.length%3 ===1){
      const data = deepClone(props?.data)
      const oneData = data.splice(0,1)
      
     
      return <>
        <OneRowOneColumn data={oneData} onClick={props.onClick}></OneRowOneColumn>
        {
          data?.length > 0 && <OneRowThreeColmns data={data} onClick={props.onClick}></OneRowThreeColmns>
        }
       
      </>
    }
    if(props?.data?.length%3 ===2){
      const data = deepClone(props?.data)
      const oneRowTwoData = data?.splice(0,2)
      return <>
        <OneRowDoubleColumns data={oneRowTwoData} onClick={props?.onClick} ></OneRowDoubleColumns>
       {
         data?.length > 0 &&  <OneRowThreeColmns data={data} onClick={props.onClick}></OneRowThreeColmns>
       }
      </>
    }

    return <>
      <OneRowThreeColmns {...props}></OneRowThreeColmns>
    </>


  },[props])

  return (
    <View className="bwCoupons" id='ls_coupons_container'>
      {
        getLayout(props)
      }
    </View>
  );
};

export default forwardRef(Coupons);
