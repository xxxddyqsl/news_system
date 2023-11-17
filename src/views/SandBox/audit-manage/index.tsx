import React from 'react'
import {Outlet} from 'react-router-dom'
// 审核管理 -组件
export default function index() {
  return (
    <div>
        index 审核管理 -组件
      <Outlet></Outlet>
    </div>
  )
}
