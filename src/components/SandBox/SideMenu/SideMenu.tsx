import React, { useEffect, useState } from 'react'

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useNavigate,useLocation } from 'react-router-dom';

const { Sider } = Layout;
const items: MenuProps['items'] = [
  {
    key: '/home',
    icon: <UserOutlined />,
    label: '首页',
  },
  {
    key: '/user-manage',
    icon: <VideoCameraOutlined />,
    label: '用户管理',
    children: [
      {
        key: '/user-manage/list',
        icon: <VideoCameraOutlined />,
        label: '用户管理列表',
      },
    ],
  },
  {
    key: '/right-manage',
    icon: <UploadOutlined />,
    label: '权限管理',
    children: [
      {
        key: '/right-manage/role/list',
        icon: <VideoCameraOutlined />,
        label: '角色列表',
      },
      {
        key: '/right-manage/right/list',
        icon: <VideoCameraOutlined />,
        label: '权限列表',
      },
    ],
  },
]
// 左侧菜单栏 -组件 
export default function SideMenu(props: any) {
  // 路由v6 跳转
  const navigate = useNavigate();
  // 路由v6 获取url信息
  const Location = useLocation();
 //获取 路由信息 设置 默认展开的 菜单 - 值为数组形式 可多个
 const OpenKeys = ['/'+Location.pathname.split('/')[1]];
 //获取 路由信息 设置 默认显示的 菜单 - 值为数组形式 可多个
 const SelectedKeys = [Location.pathname];
  // console.log(props)
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', }}>
        <div className="demo-logo-vertical" >
          DEMO
        </div>
        <div style={{ flex: '1', overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={OpenKeys} //获取 路由信息 设置 默认展开的 菜单
            selectedKeys={SelectedKeys} //获取 路由信息 设置 显示的 菜单
            items={props.MenuData}
            onClick={(e) => {
              let { key } = e
              navigate(key)
            }}
          />
        </div>
      </div>
    </Sider>
  )
}
