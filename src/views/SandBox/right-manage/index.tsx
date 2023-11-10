import React from 'react'
import {Outlet} from 'react-router-dom'
// 权限管理 -组件
export default function index() {
  return (
    <div style={{height:'100%'}}>
      <Outlet></Outlet>
    </div>
  )
}
