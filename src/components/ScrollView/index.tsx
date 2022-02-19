import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import { ScrollViewProps } from "@tarojs/components/types/ScrollView";
import classNames from 'classnames';
import { useMemo, forwardRef } from 'react';
import VirtualList from '@tarojs/components/virtual-list'
import Taro from "@tarojs/taro";
import Empty, {IProps as IEmptyProps} from '@/components/Empty'

import "./index.scss";
import { empty } from '@/constants/images';
import { useImperativeHandle, useRef } from 'react';

type IProps = ScrollViewProps & {
  children: React.ReactNode;
  className?: string;
  refreshAble?: boolean;
  loadingMore?: boolean;
  noMore?: boolean;
}

export const useListStatus = ({ list, loading, noMore }) => {
  return useMemo(() => {
    const noMore1 = (list || []).length > 0 && noMore
    return {
      noMore: noMore1,
      empty: !loading && list.length === 0,
      loading: loading || (list.length > 0 && !noMore)
    }
  }, [list, loading, noMore])
}

export const NoMore = () => <View className="bw-scroll-view-nomore">我是有底线的</View>

export const LoadingView = (props: { visible: boolean, children?: React.ReactNode, className?: string }) => <View className={`text-center fz24 pd32 bgGray LoadingView ${props.className || ''}`} style={{ visibility: props.visible ? 'visible' : 'hidden' }}><Text className="loading-icon bgGray"></Text>{props.children || '数据加载中...'}</View>

export const LoadMoreText = (props: { visible: boolean, children?: React.ReactNode }) => <View className="bw-scroll-view-load-more bgGray" style={{ display: props.visible ? '' : 'none' }}>加载更多....</View>

export const RefreshComponent = () => <View className="bw-scroll-view-refresh">松开刷新</View>

export const LoadMoreBtn = (props: {
  visible: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  const names = classNames('bw-scroll-view-LoadMoreBtn', props.className)
  return <View style={{ textAlign: 'center', display: props.visible ? '' : 'none' }} className="mg24">
    <Text {...props} className={names} >{ props.children || '查看更多' }</Text>
  </View>
}

// // 暂时不要使用该组件
// export default (props: IProps) => {

//   const { children, className, ...restProps } = props

//   const names = classNames('bw-scroll-view', className)

//   return <ScrollView className={names} {...restProps}>
//     { props.refreshAble && <RefreshComponent /> }
//     {children}
//     {
//       props.loadingMore && <LoadMoreText />
//     }
//     {
//       props.noMore && <NoMore />
//     }
//   </ScrollView>
// }

const VirtualScrollList = function <T>(props: VirtualList['props'] & {
  /**
   * 减去的高度
   */
  subHeight: number;
  row: any;
  listStatus: {
    noMore: boolean | undefined;
    loading: boolean;
  };
  data: {
    list: T[];
    total: number;
  };
  loadMore: () => void;
  /**
   * 距底部/右边多远时（单位px），触发 loadMore 事件 默认100
   */
  lowerThreshold?: number;

  emptyProps?: IEmptyProps;

  bottomClassName?: string;
}, ref: any) {

  /**
   * 必须在组件初始化时获取， 因为nagvigatarbar 会影响高度计算
   */
  const systemInfo = useRef(Taro.getSystemInfoSync())

  const {subHeight, row, data, lowerThreshold, listStatus, loadMore, emptyProps, bottomClassName, ...rest} = props

  const lowerThreshold1 = lowerThreshold === undefined ? 100 : lowerThreshold

  const h = systemInfo.current.windowHeight - subHeight

  console.log(`虚拟滚动列表高度 ${h}`)

  // 一屏最多展示数量
  const fullScreenMaxItems = Math.ceil(h / props.itemSize)
  // console.log('fullScreenMaxItems', data.total, fullScreenMaxItems)

  const domRef = useRef()

  const handleScroll: VirtualList['props']['onScroll'] = ({ scrollDirection, scrollOffset }) => {
    if (
      scrollDirection === 'forward' &&
      scrollOffset > 0 &&
      scrollOffset > (data?.list?.length - (h / props.itemSize)) * props.itemSize - lowerThreshold1
    ) {
      if (!listStatus.noMore && !listStatus.loading) {
        loadMore?.()
      }
    }
  }

  // 加载中 等状态展示
  const StatusView = useMemo(() => {    
    const {loading, noMore} = listStatus
    if (!loading && data?.list?.length === 0) return <Empty src={emptyProps?.src || empty} text={emptyProps?.text || '暂无商品'} className="p-t-120" {...(emptyProps || {})} />
    return <View className={bottomClassName || ''}>
      {
        noMore && data.total >= fullScreenMaxItems ? <NoMore /> : <LoadingView visible={loading || noMore === undefined} />
      }
    </View>
  }, [listStatus, data])

  useImperativeHandle(ref, () => domRef.current)

  return <VirtualList
    {...rest}
    width="100%"
    height={h}
    itemData={data?.list || []}
    itemCount={data?.list?.length || 0}
    onScroll={handleScroll}
    renderBottom={props.renderBottom || StatusView}
    ref={domRef}
  >
    {props.row}
  </VirtualList>
}

export default forwardRef(VirtualScrollList)