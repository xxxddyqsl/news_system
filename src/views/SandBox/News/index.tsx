import React from 'react'
import {Outlet} from 'react-router-dom'
// 新闻管理 -组件
export default function index() {
  return (
    <div>
        index 新闻管理 -组件
      <Outlet></Outlet>
    </div>
  )
}
