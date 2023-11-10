import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
   SmileOutlined,
   LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate,useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Layout, Button, theme, Avatar, Dropdown, Space } from 'antd';
const { Header } = Layout;

export default function TopHeader(props:any) {
  console.log(props)
  const items: MenuProps['items'] = [
    
    {
      key: '2',
      label: (
        <div>
         {props.userInfo.roleName}
        </div>
      ),
      icon: <SmileOutlined />,
      // disabled: true,
    },
    
    {
      key: 'LogoutOut',
      danger: true,
      icon: <LogoutOutlined />,
      label: (
        <div onClick={()=>{
          // console.log('退出')
          localStorage.removeItem('token');
          //  重定向跳转到 login
          navigate('/login');
        }}>
          退出
        </div>
      ),
    },
  ];
   // 路由v6 跳转
   const navigate = useNavigate();
   // 路由v6 获取url信息
   const Location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />



      <div style={{ float: 'right', marginRight: '20px' }}>
        <Dropdown menu={{ items }}>
          <Space>
            <span style={{ marginRight: '8px' }}>欢迎<span style={{color:'#1890ff'}}>{props.userInfo.username}</span>回来</span>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}
