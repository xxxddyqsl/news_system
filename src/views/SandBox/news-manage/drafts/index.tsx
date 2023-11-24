import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Popover, notification, Modal } from 'antd'
import axios from 'axios'
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
    axios({
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
          <Button danger shape="circle" title='删除' icon={<DeleteOutlined />} onClick={() => {
            ConfirmMethod(item)
          }} style={{ marginRight: '16px' }} />

          <Button style={{ marginRight: '16px' }}  title='更新' shape="circle" onClick={() => {
            // console.log(item)
            // 更新 修改新闻
            navigate(`/news-manage/update/${item.id}`)
          }} icon={<EditOutlined />} ></Button>
          <Button type="primary" shape="circle"  title='提交审核' onClick={() => {
            // 提交审核
            console.log(item)
            // auditState 0 为保存草稿  1为提交审核
            handleSave(item,1)
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
  //当前是 提交审核  只需要后端 将auditState = 1 // auditState 0 为保存草稿  1为提交审核 待审核
  const handleSave = (item:any,auditState:Number) => {
    // 获取新闻 id
    let newsId=item.id;
    //  Reflect.deleteProperty 使用 ES6 中 Reflect 对象的 deleteProperty 静态方法 注意 该方法会改变原对象
    // 删除对象 中的 id 字段 + 新闻分类表的数据 category 已有新闻分类id （categoryId）
    //  Reflect.deleteProperty(item,'id');
    //  Reflect.deleteProperty(item,'category');

    //  let data = {
    //   title:item.title,
    //   categoryId:item.categoryId,

    //   content: item.content,
    //   region: userInfo.region,// 发布人 区域
    //   author: userInfo.username, // 发布人name
    //   authorId: userInfo.id,// 发布人id
    //   roleId: userInfo.roleid,
    //   auditState: auditState,// auditState 0 为保存草稿  1为提交审核
    //   publishState: 0,
    //   createTime: Date.now(), // 获得当前的时间戳
    //   star: 0,
    //   view: 0,
    //   publishTime: null,
    // }
    let data = {
      //  ...item,
       auditState: auditState,
    }
    // 提交数据库
    axios({
      url: `/api/news/${newsId}`,
      method: 'patch',
      data: data,
    }).then(res => {
      console.log(res)
      if (res.data.Code === 0) {
        // auditState 0 为保存草稿 跳转到 草稿箱  1为提交审核 跳转到审核列表
        // navigate(auditState === 0 ? '/news-manage/drafts' : '/audit-manage/list')
        navigate( '/audit-manage/list')
        // Notification 通知提醒框
        notification.info({
          message: `通知`,
          // description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
          description: `您可以到【审核管理/审核列表】中查看您的新闻`,
          placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
        })
      }
    }).catch((err) => {
      console.log(err)
    });
  }
  // 删除草稿
  const deleteMethod = (data: any) => {
    axios({
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
    // 自定义 table 配置
    const configurationTable={
      columns:columns, // table 头
      pagination:{
        pageSize: 5,// 每页显示几条
      },
      dataSource:draftsList,// table 数据
    }
  return (
    <div className={styles['news-manage-drafts-list-wrapper'] + ' gg-flex-4 gg-flex-2'} ref={refElem}>
      {/* 实时监听页面高度变化 - 获取 元素 获取高*/}
      <WinResize contentElem={refElem} callback={(size: any) => {
        // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
        setWarperRef(refElem.current.getBoundingClientRect())
      }}></WinResize>
      <MyTable id={'mydraftsListTable'} configurationTable={configurationTable} warperRefObj={warperRef} warperRef={refElem.current} rowKey={'id'} ></MyTable>
    </div>
  )
}
