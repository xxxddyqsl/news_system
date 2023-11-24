import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import './table.css'
/**
 * 获取第一个表格的可视化高度
 * @param {*} extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为74) 
 * @param {*} id 当前页面中有多个table时需要制定table的id
 * @param {*}  warperRef 外层的元素宽高 
 */
export function getTableScroll({ extraHeight = undefined, id, warperRef }) {
  // console.log('warper', warperRef)
  if (typeof extraHeight == "undefined") {
    //  默认底部分页32 + 边距 margin 8
    extraHeight =  32 + 8*2;
  }
  let tHeader = null
  if (id) {
    tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName("ant-table-thead")[0] : null
  } else {
    tHeader = document.getElementsByClassName("ant-table-thead")[0]
  }
  //表格header 高度
  let tHeaderHeight = 0
  tHeaderHeight = tHeader.getBoundingClientRect().height

  //窗体高度-表格内容顶部的高度-表格内容底部的高度
  let height;
  if(warperRef){
    height =  warperRef?.getBoundingClientRect().height - extraHeight - tHeaderHeight;
  }else{
    height = `calc(100vh - ${tHeaderHeight + extraHeight}px)`
  }
  // console.log(height, warperRef.getBoundingClientRect(), extraHeight , tHeaderHeight)
  return height
}
export default function MyTable(props) {
  const [scrollY, setScrollY] = useState("")

  useEffect(() => {
    // table 父元素高度发送变化 重新获取 父元素高度 计算table高度
    if(props.warperRefObj){
      setScrollY(getTableScroll({ id: props.id, warperRef: props.warperRef }));
    // console.log('scrollY',scrollY,props ,props.warperRef )

    }
  }, [props.warperRefObj])
  return (
    <>
      <Table
        id={props.id}
        className="components-table-demo-nested MyTable"
        // columns={props.columns}
        // dataSource={props.dataSource}
        scroll={{ y: scrollY  }}
        // pagination={props.pagination}
        style={{ overflow: 'auto !important' }}
        rowKey={(item) => { // 自定义 指定 列表中的每一项 key值 默认为数据中的key字段 
          return (item[props.rowKey] || item.id);
        }}
        {...props.configurationTable} // 传入的 table 配置项 包含 dataSource数据
      />
      {/* 插槽 */}
      {props.children}
    </>
  )
}
