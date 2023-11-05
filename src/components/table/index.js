import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import './table.css'
/**
 * 获取第一个表格的可视化高度
 * @param {*} extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为74) 
 * @param {*} id 当前页面中有多个table时需要制定table的id
 */
export function getTableScroll({ extraHeight = undefined, id }) {
  if (typeof extraHeight == "undefined") {
    //  默认底部分页32 + 边距10
    extraHeight = 42
  }
  let tHeader = null
  if (id) {
    tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName("ant-table-thead")[0] : null
  } else {
    tHeader = document.getElementsByClassName("ant-table-thead")[0]
  }
  //表格内容距离顶部的距离
  let tHeaderBottom = 0
  if (tHeader) {
    tHeaderBottom = tHeader.getBoundingClientRect().bottom
  }

  //窗体高度-表格内容顶部的高度-表格内容底部的高度
  // let height = document.body.clientHeight - tHeaderBottom - extraHeight
  let height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`
  // console.log(height,tHeader.getBoundingClientRect(),tHeader)

  return height
}
export default function MyTable(props) {
  const [scrollY, setScrollY] = useState("")
  //页面加载完成后才能获取到对应的元素及其位置
  useEffect(() => {
    setScrollY(getTableScroll({ id: props.id }))
  }, [])
  return (
    <>
    <Table
      id={props.id || 'MyTable'}
      className="components-table-demo-nested"
      columns={props.columns}
      dataSource={props.dataSource}
      scroll={{ y: scrollY }}
      pagination={props.pagination}
      style={{ overflow: 'auto !important' }}
      rowKey={(item) => { // 自定义 指定 列表中的每一项 key值 默认为数据中的key字段 
        return (item[props.rowKey]||item.id);
      }}

    />
    {/* 插槽 */}
    {props.children}
    </>
  )
}
