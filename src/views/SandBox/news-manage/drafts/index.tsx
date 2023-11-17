import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Popover, Switch, Modal } from 'antd'
import { $axios } from '../../../../util/request'
import MyTable from '../../../../components/table';
import WinResize from '../../../../components/winResize';
import styles from '../../../../assets/css/news-manage/drafts.module.scss'
import { useSelector, shallowEqual } from 'react-redux';
import Item from 'antd/es/list/Item';
const { confirm } = Modal;

// 新闻管理 - 草稿箱 组件
export default function Drafts() {
  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => state.userSlice, shallowEqual);
  // 获取 div 元素 获取高 传入 table 设置table 设置属性  scroll={{y: 100}} 超出滚动
  const refElem = useRef<any>();
  const [warperRef, setWarperRef] = useState();
  const [draftsList, steDraftsList] = useState<Array<Object>>([]);

  const navigate=useNavigate();
  useEffect(() => {
    $axios({
      url: `/api/newsDrafts`,
      method: 'get',
      params: {
        id: userInfo.id
      }
    }).then(res => {
      steDraftsList(res.data.Data)
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  // 根据 数据库返回 设置 table头 及其 对应显示的内容
  const columns = [
    {
      title: 'ID', // 显示在页面上的内容
      dataIndex: 'id',// 想要 显示对应数据的 name 名
      key: 'id',// key 可写可不写
      render: (id: any, record: any, index: any) => { // 自定义渲染函数 表格内容 参数的形式传入, 必须return 返回 否则ts报错
        // console.log(text,record)
        return <div>{id}</div>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title: any,record: any,) => {
        return <div style={{ color: '#1677ff', cursor: 'pointer' }} onClick={()=>{
          console.log(record.id)
          navigate(`/news-manage/preview`,{state:{id:record.id}})
        }}>{title}</div>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category: any, record: any, index: any) => { // 自定义渲染函数 表格内容 参数的形式传入, 必须return 返回 否则ts报错
        // console.log(id,record)
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => {
            ConfirmMethod(item)
          }} style={{ marginRight: '16px' }} />

          <Button style={{ marginRight: '16px' }} shape="circle" onClick={() => {
            // console.log(item)
            navigate(`/news-manage/update/${item.id}`)
          }} icon={<EditOutlined />} ></Button>
          <Button type="primary" shape="circle" onClick={() => {

          }} icon={<UploadOutlined />} ></Button>

        </div>
      }
    },
  ]
  function ConfirmMethod(item: any) {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationOutlined></ExclamationOutlined>,
      // content:'2',
      onOk() {
        // 删除
        deleteMethod(item)
      },
      onCancel() {
        console.log('cancel')
      }
    })
  }
  // 删除草稿
  const deleteMethod = (data: any) => {
    $axios({
      url: `/api/news`,
      method: 'delete',
      data: {
        id: data.id
      }
    }).then(res => {
      console.log(data)
      steDraftsList(draftsList.filter((Item:any)=>Item.id!=data.id))
    }).catch((err) => {
      console.log(err)
    });
  }
  return (
    <div className={styles['news-manage-drafts-list-wrapper'] + ' gg-flex-4 gg-flex-2'} ref={refElem}>
      {/* 实时监听页面高度变化 - 获取 元素 获取高*/}
      <WinResize contentElem={refElem} callback={(size: any) => {
        // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
        setWarperRef(refElem.current.getBoundingClientRect())
      }}></WinResize>
      <MyTable id={'mydraftsListTable'} dataSource={draftsList} warperRefObj={warperRef} warperRef={refElem.current} rowKey={'id'} columns={columns} pagination={{
        pageSize: 5,// 每页显示几条
      }}></MyTable>
    </div>
  )
}
