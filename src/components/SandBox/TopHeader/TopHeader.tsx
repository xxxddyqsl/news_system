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
//状态管理
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { changeUserSlice } from '../../../redux/actionCreators/userSlice';
import { BASE_URL } from '../../../util/request_http';


const { Header } = Layout;

export default function TopHeader(props:any) {
//   console.log(props)
  const dispatch=useDispatch();

  const items: MenuProps['items'] = [
    {
      key: '2',
      label: (
        <div>
         {props.userInfo?.roleName||props.userInfo?.roles?.roleName}
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
          // 退出登录 销毁 个人信息 持久化
          dispatch(changeUserSlice({value:undefined,type:'userInfo'}))
          //  重定向跳转到 login
          navigate('/login',{replace:true});
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Button
        type="text"
        icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => props.callback()}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: 'right', marginRight: '20px' }}>
        <Dropdown menu={{ items }}>
          <Space>
            <span style={{ marginRight: '8px' }}>欢迎<span style={{color:'#1890ff'}}>{props.userInfo?.username}</span>回来</span>
            {props.userInfo.avatar?<Avatar size="large" src={BASE_URL+props.userInfo.avatar} />:<Avatar size="large" icon={<UserOutlined />} />}
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}
