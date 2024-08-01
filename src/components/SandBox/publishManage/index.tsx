import React from 'react'
import WinResize from '../../winResize'
import MyTable from '../../table'
//   {/* 待发布 已发布 已下线 这几个组件 样式类似 - 再次封装一个公共的 NewsPublish 组件 */}
export default function NewsPublish(props:any) {
  return (
    <>
     <div className={props.classWrapper + ' gg-flex-4 gg-flex-2'} ref={props.refElem} style={{height:'100%'}}>
        {/* 实时监听页面高度变化 - 获取 元素 获取高*/}
        <WinResize contentElem={props.refElem} callback={(size: any) => {
          // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
          props.setWarperRef(props.refElem.current.getBoundingClientRect())
        }}></WinResize>
        <MyTable id={props.id} warperRefObj={props.warperRef} warperRef={props.refElem.current} rowKey={props.rowKey} configurationTable={props.configurationTable} ></MyTable>
      </div>

    </>
  )
}
