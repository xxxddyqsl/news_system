import React, { useEffect, useRef, useState } from 'react'
import MyTable from '../../../../components/table'
import {
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { shallowEqual, useSelector } from 'react-redux';
import WinResize from '../../../../components/winResize';
import styles from '../../../../assets/css/audit-manage/audit.module.scss'
import { Button, Tag, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Item from 'antd/es/list/Item';
// 枚举 - 对应 审核状态
const auditStateList: any = {
  0: '草稿箱', // 说明是草稿
  1: '审核中',
  2: '已通过',
  3: '未通过',
}

// 统一 状态 对应颜色
const colorState: any = {
  0: 'rgb(45, 183, 245)',
  1: 'orange',
  2: 'green',
  3: 'red',
}

// 审核管理 - 审核新闻 -组件
export default function NewsAudit() {
  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => state.userSlice, shallowEqual);
  const navigate = useNavigate()
  // 获取 div 元素 获取高 传入 table 设置table 设置属性  scroll={{y: 100}} 超出滚动
  const refElem = useRef<any>();
  const [warperRef, setWarperRef] = useState();
  const [auditList, steAuditList] = useState<Array<Object>>([]);
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title: any, record: any,) => {
        return <div style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => {
          console.log(record.id)
          navigate(`/news-manage/preview`, { state: { id: record.id } })
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState: any, record: any, index: any) => { // 自定义渲染函数 表格内容 参数的形式传入, 必须return 返回 否则ts报错
        // console.log(id,record)
        return <Tag color={colorState[auditState]}>{auditStateList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
        // 根据auditState 状态 设置 button 配置 
        let obj: any = (item.auditState === 2 ? { danger: true } : item.auditState === 3 ? { type: "primary", } : {});
        return <>
          <Button type="primary" shape="circle" title='通过' icon={<CheckOutlined />} style={{ marginRight: '16px' }}
            onClick={() => handleAudit(item)}
          ></Button>
          <Button danger title='驳回' shape="circle"
            onClick={() => handleReject(item)}
            icon={<CloseOutlined />}></Button>
        </>
      }
    },
  ]
  useEffect(() => {
    // 返回 小于 当前  roleid 权限等级 的数据 ，roleid =1 超级管理员 返回所有auditState=1 待审核的数据
    axios({
      url: `/api/auditNews`,
      method: 'get',
      params: {
        auditState: 1,
        roleid: userInfo.roleid, // 权限等级
        region: userInfo.region, // 负责的区域 ， 超级管理员 为空 代表全球
      },
    }).then(res => {
      // console.log(res)
      if (res.data.Code === 0) {
        let data = res.data.Data;
        steAuditList(data)
      }
    }).catch((err) => {
      console.log(err)
    });
  }, [userInfo?.id])
  // 通过
  const handleAudit = (item: any) => {
    // auditState 2 审核通过
    let auditState = 2;
    // 1 待发布
    let publishState = 1;
    let newsId = item.id; // 新闻id
    // 当前  auditState 审核 状态 为 1 正在审核 ，因此 需要修改 auditState 2 和 publishState 1 发布状态 待发布
    let data = {
      auditState, // 审核通过
      publishState,// 待发布
    }
    // 调用 接口 修改状态
    AuditPatch(newsId,data)
  }
  // 驳回
  const handleReject = (item: any) => {
    // auditState 3审核未通过
    let auditState = 3;
    // 0默认状态未发布
    let publishState = 0;
    let newsId = item.id; // 新闻id
    // 当前  auditState 审核 状态 为 1 正在审核 ，因此 需要修改 auditState 3 和 publishState 0 发布状态 0默认状态未发布
    let data = {
      auditState, // 审核未通过
      publishState,// 0默认状态未发布
    }
    // 调用 接口 修改状态
    AuditPatch(newsId,data)
  }
  const AuditPatch=(id:Number,data:Object)=>{
    axios({
      url: `/api/news/${id}`,
      method: 'patch',
      data: data,
    }).then(res => {
      if (res.data.Code === 0) {
        steAuditList(auditList.filter((Ktem: any) => Ktem.id !== id));
        // Notification 通知提醒框
        notification.info({
          message: `通知`,
          description: `您可以到【审核管理/审核列表】中查看您的新闻的审核状态`,
          placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
        })
      }
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
      dataSource:auditList,// table 数据
    }
  return (
    <>
      <div className={styles['audit-manage-wrapper'] + ' gg-flex-4 gg-flex-2'} ref={refElem}>
        {/* 实时监听页面高度变化 - 获取 元素 获取高*/}
        <WinResize contentElem={refElem} callback={(size: any) => {
          // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
          setWarperRef(refElem.current.getBoundingClientRect())
        }}></WinResize>
        <MyTable id={'myAuditListTable'}   warperRefObj={warperRef} warperRef={refElem.current} rowKey={'id'} configurationTable={configurationTable} ></MyTable>
      </div>
    </>
  )
}
