import React from 'react' 
import NewsPublish from '../../../../components/SandBox/publishManage';
// 自定义 hooks
import usePublished from '../../../../components/SandBox/publishManage/usepublished';
import { Button } from 'antd';

// 发布管理 - 已发布组件 
export default function Published() {
  // 调用 自定义 hooks 处理的逻辑代码 返回 - 传入 publishState 0默认状态未发布 1待发布 2已上线 3已下线
  let publishState= 2;
  // 声明 一个 NewButton 函数 调用传入 函数传入 item  在按钮点击时 获取这个传入item
  const {setWarperRef,refElem,configurationTable,warperRef,styles,handleSunset} = usePublished({publishState,NewButtonFn:(item:any)=><Button danger onClick={()=>handleSunset(item)}>下线</Button>});
  return (
    <>
      {/* 待发布 已发布 已下线 这几个组件 样式类似 - 再次封装一个公共的 Publish 组件 */}
      <NewsPublish id={'myPublishListTable'} classWrapper={styles['publish-manage-wrapper']} setWarperRef={() => {
        // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
        setWarperRef(refElem.current.getBoundingClientRect())
      }} configurationTable={configurationTable} rowKey={'id'} warperRef={warperRef} refElem={refElem} ></NewsPublish>
    </>
  )
}
