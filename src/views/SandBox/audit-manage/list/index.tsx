import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  ExclamationOutlined,
} from '@ant-design/icons';
import MyTable from '../../../../components/table'
import { shallowEqual, useSelector } from 'react-redux';
import WinResize from '../../../../components/winResize';
import styles from '../../../../assets/css/audit-manage/audit.module.scss'
import { Button, Tag, message, notification ,Modal} from 'antd';
import axios from 'axios'
const { confirm } = Modal;
// 枚举 - 对应 审核状态
const auditStateList :any = {
  0:'草稿箱', // 说明是草稿
  1:'审核中',
  2:'已通过',
  3:'未通过',
}

// 统一 状态 对应颜色
const colorState:any= {
  0:'rgb(45, 183, 245)',
  1:'orange',
  2:'green',
  3:'red',
}

const ButtonStateList :any = {
  // 0:'草稿箱', // 说明是草稿
  1:'撤销',
  2:'发布',
  3:'更新',
  // 3:'修改',
}

// 审核列表 -组件
export default function AuditList() {
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
        let obj:any = (item.auditState === 2?{danger:true}:item.auditState === 3? {  type:"primary", }:{} );
        return <>
          {/* {
            item.auditState === 1 && <Button>撤销 </Button>
          }
          {
            item.auditState === 2 && <Button danger>发布 </Button>
          }
          {
            item.auditState === 3 && <Button  type="primary">更新 </Button>
          } */}
          {/* 解 构 赋值 */}
          <Button {...obj}  onClick={() => {
            console.log(item)
            // 撤销
            if(item.auditState === 1){
              handleRervert(item)
            }else if(item.auditState === 2){//发布
              confirm({
                title: '你确定要发布?',
                icon: <ExclamationOutlined></ExclamationOutlined>,
                // content:'2',
                onOk() {
                  // 发布
                  handlePublish(item)
                },
                onCancel() {
                  console.log('cancel')
                }
              })
            }else  if(item.auditState === 3){//更新
               // 更新 修改新闻
               handleUpdate(item)
            }
          }} >

            {ButtonStateList[item.auditState]}
          </Button>

        </>
      }
    },
  ]
  useEffect(() => {
    // 查询 出来 所有 id=自己 审核 - 通过 、未通过 、 和审核中的 数据，已发布的不审核列表中显示
    // console.log(userInfo)
    // let userId = userInfo.id;
    // auditState // 审核状态 0 默认状态未审核说明是草稿 还没有审核  1 正在审核 2审核通过 3审核未通过
    let auditState=1;
    //  "publishState": 1,  //发布状态 0默认状态未发布 1待发布 2已上线 3已下线
    let publishState=1;
    axios({
      url: `/api/audit`,
      method:'get',
      params:{
        authorId:userInfo.id, // 新闻编写人的id
        auditState:auditState,// 审核状态 ： 大于等于 1 的数据 ，需要不是 0 草稿 的数据
        publishState:publishState,//发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
      }
    }).then(res => {
      if(res.data.Code === 0 ){
        let data = res.data.Data;
        steAuditList(data)
      }
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });
  }, [userInfo?.id])
  // 撤销
  const handleRervert = (item:any)=>{
    let newsId = item.id
    // auditState 最小状态值 为 0 未审核状态
    let auditState =  item.auditState-1<=0?0 :item.auditState
    let data = {
      //  ...item,
       auditState: auditState,
    }
    //  撤销 - 更新数据
    axios({
      url: `/api/news/${newsId}`,
      method: 'patch',
      data: data,
    }).then(res => {
      // console.log(res)
      if(res.data.Code === 0 ){
        // 过滤数据 更新 状态 - 撤销的数据已经变成草稿箱 未审核数据
        steAuditList(auditList.filter((Ktem:any)=>Ktem.id !== item.id))
        notification.info({
          message: `通知`,
          description: `您可以到【新闻管理/草稿箱】中查看您的新闻`,
          placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
        })
      }
    }).catch((err) => {
      console.log(err)
    });
  }
  // 更新 修改
  const handleUpdate =  (item:any)=>{
    // 编程式导航 - 跳转 更新 修改新闻
    navigate(`/news-manage/update/${item.id}`)
  }
  // 发布
  const handlePublish = (item:any)=>{
   
    let newsId = item.id;
    // 当前  auditState 审核 状态 为 2 已通过 ，因此 只需要修改 publishState 发布状态 为2 已发布上线 和 发布 publishTime 时间戳
    let data = {
      publishState: 2,
      publishTime: Date.now(), // 获得当前的时间戳
    }
      //  发布 - 更新数据
      axios({
        url: `/api/news/${newsId}`,
        method: 'patch',
        data: data,
      }).then(res => {
        // console.log(res)
        if(res.data.Code === 0 ){
          // 过滤数据 更新 状态 - 撤销的数据已经变成草稿箱 未审核数据
          steAuditList(auditList.filter((Ktem:any)=>Ktem.id !== item.id));
          // 跳转-已发布
          navigate('/publish-manage/published')
          notification.info({
            message: `通知`,
            description: `您可以到【发布管理/已发布】中查看您的新闻`,
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
        <MyTable id={'myAuditListTable'} configurationTable={configurationTable} warperRefObj={warperRef} warperRef={refElem.current} rowKey={'id'} ></MyTable>
      </div>
    </>
  )
}
