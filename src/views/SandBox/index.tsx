import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Outlet } from 'react-router-dom'

import TopHeader from '../../components/SandBox/TopHeader/TopHeader'
import SideMenu from '../../components/SandBox/SideMenu/SideMenu'

import { Layout, theme } from 'antd';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
// 导入 二次封装 axios 内包含了 获取 token 存入本地 + 发起请求携带token
import { $axios } from '../../util/request'
//状态管理
import { useSelector, useDispatch } from 'react-redux'
import { getRightsList } from '../../redux/actionCreators/rightsSlice';
import { changMenuList } from '../../redux/actionCreators/MenuSlice';

const { Content } = Layout;
// 枚举 - 对应 菜单 显示icon 
const iconList: any = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,// 一级
  '/user-manage/list': <UserOutlined />,// 二级
  '/right-manage': <UserOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />,
  '/news-manage': <UserOutlined />,
  '/audit-manage': <VideoCameraOutlined />,
  '/publish-manage': <UploadOutlined />,
}

// 递归过滤 - 数据库返回数据  绑定icon - pagepermisson 不等于1 等于0是 没有权限显示  等于null 不是页面 该菜单 或 后续可以通过 开关 设置1 或 0 配置用户的权限
// const rightsFilter = (data:any)=>{
//   // 过滤第一层
//   let dataFilter = data.filter((item:any) =>item.pagepermisson && item.pagepermisson === 1 );
//   // 循环过滤  添加 icon字段  children重新赋值
//   data.forEach( (item:any) =>(item.icon=iconList[item.key],  item.children && item.pagepermisson === 1) && ( item.children = rightsFilter(item.children) ,item.children.length<=0?item.children='':''   ) );
//   return data;
// }

// 优化 后端处理 数据库 权限pagepermisson 不等于1 没有权限显示的数据不返回 ，增加 icon字段 children数组为空 没有子节点 赋值空字符串 否则 影响子节点渲染
const rightsFilter = (data: any) => {
  // 过滤 权限pagepermisson
  let dataFilter = data.filter((item: any) => item.pagepermisson && item.pagepermisson === 1);
  // 循环过滤  添加 icon字段  children重新赋值
  dataFilter.forEach((item: any) => (item.icon = iconList[item.key], item.children && item.pagepermisson === 1) && (item.children = rightsFilter(item.children), item.children.length <= 0 && delete (item.children)));
  return dataFilter;
}
// 主 - 沙盒组件
export default function NewsSandBox() {
  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => { return state.userSlice });
  const { rightsList } = useSelector((state: any) => { return state.rightsSlice });
  const { MenuList } = useSelector((state: any) => { return state.MenuSlice });
  // 状态管理 - 设置
  const dispatch = useDispatch<any>();

  const [collapsed, setCollapsed] = useState(false);
  const [contentElem, setcontentElem] = useState('');
  // 获取 Content 组件元素 获取高 传入 table 设置table 设置属性  scroll={{y: 100}} 超出滚动
  const getcontentElem = useCallback((node: any) => setcontentElem(node), [])

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [MenuData, setMenuData] = useState();
  useEffect(()=>{
    // 用户信息发生变化重新获取权限
    dispatch(getRightsList(userInfo))
    console.log('获取rights-1')
  },[userInfo])
  useEffect(() => {
    if(rightsList.length > 0){
      // 获取到权限列表 - 获取数据根据权限 设置左侧菜单栏
      dispatch(changMenuList({ value:rightsList , type: 'MenuList' }))
      console.log('rights列表已缓存')
    }
  }, [rightsList])
  return (
    <Layout>
      {/* 左侧栏 SideMenu  */}
      <SideMenu MenuData={MenuList}></SideMenu>
      <Layout>
        {/* 顶部  TopHeader*/}
        <TopHeader userInfo={userInfo}></TopHeader>
        <Content ref={(node) => {
          getcontentElem(node)
          // console.log(node?.getBoundingClientRect().height)
        }}
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {/* 子路由 - 内容 */}
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  )
}
