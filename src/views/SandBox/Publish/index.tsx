import React from 'react'
import {Outlet} from 'react-router-dom'
// 发布管理 -组件
export default function index() {
  return (
    <div>
        index 发布管理 -组件
      <Outlet></Outlet>
    </div>
  )
}
