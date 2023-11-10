import React, { useEffect, useRef, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import { Button, Table, Tag, Modal, Spin, Popover, Switch } from 'antd'
import MyTable from '../../../../components/table';
// 导入 二次封装 axios 内包含了 获取 token 存入本地 + 发起请求携带token
import { $axios } from '../../../../util/request';
import { useSelector, useDispatch } from 'react-redux';
import { getRightsList } from '../../../../redux/actionCreators/rightsSlice';
const { confirm } = Modal;
// 首次拿到权限数据 递归过滤 - 数据库返回数据   - pagepermisson 不等于1 没有权限显示 该菜单 或 后续可以通过 开关 设置1 或 0 配置用户的权限
const rightsFilter = (data: any) => {
  //    children重新赋值
  data.forEach((item: any) => (item.children && item.pagepermisson === 1) && (item.children = rightsFilter(item.children), item.children.length <= 0 && delete (item.children)));
  return data;
}
// 删除权限 过滤数据
const delrightsFilter = (data: any, id: any) => {
  // 过滤第一层
  let dataFilter = data.filter((item: any) => item?.id !== id);
  // 循环过滤   children重新赋值
  dataFilter.forEach((item: any) => (item.children && item.pagepermisson === 1) && (item.children = delrightsFilter(item.children, id), item.children.length <= 0 && delete (item.children)));
  return dataFilter;
}
// 权限管理 - 权限 列表组件
export default function RightList() {
  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => { return state.userSlice });
  const { rightsList } = useSelector((state: any) => { return state.rightsSlice });
  // 状态管理 - 修改函数
  const dispatch = useDispatch<any>();

  const [dataSource, setdataSource] = useState([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    //   $axios({
    //     url: '/api/rights',
    //     method: 'get',
    //     params: {
    //       id: userInfo.id,
    //     },
    //   }).then(res => {
    //     let data = rightsFilter(res.data.Data)
    //     console.log(data)
    //     setdataSource(data)
    //   }).catch((err)=>{
    //     console.log(err)
    // })
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
      title: '权限名称',
      dataIndex: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key: any, record: any, index: any) => { // 自定义渲染函数 表格内容 参数的形式传入, 必须return 返回 否则ts报错
        // console.log(text,record)
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => {
            ConfirmMethod(item)
          }} style={{ marginRight: '16px' }} />

          <Popover content={<div style={{ textAlign: 'center' }}>
            <Switch checked={item.pagepermisson == 1 ? true : false} onChange={() => switchMethod(item)}></Switch>
          </div>} title="页面配置项" trigger="click">
            <Button type="primary" shape="circle" onClick={() => {
              console.log(item)
              {/* 主要配置的就是 pagepermisson  控制左侧菜单栏 是否有权限 显示该页面 ，
                因此pagepermisson为null的 disabled 禁用不支持该功能（正常 为api 接口）后续可能也会调整  */}
            }} icon={<EditOutlined />} disabled={item.pagepermisson == null || item.pagepermisson == undefined} ></Button>
          </Popover>
        </div>
      }
    },
  ];

  function ConfirmMethod(item: any) {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationOutlined></ExclamationOutlined>,
      // content:'2',
      onOk() {
        setLoading(true)
        // 删除
        deleteMethod(item)
      },
      onCancel() {
        console.log('cancel')
      }
    })
  }

  //删除-调用接口
  const deleteMethod = (data: any) => {
    // grade 层级 1级为1 ， 2级为2
    let { grade } = data;
    // 后端 删除的 id 在 grade哪一层
    $axios({
      url: `/api/rights/${grade}/${data.id}`,
      method: 'delete',
    }).then(res => {
      if (res.data.Code != 0) { return alert('删除失败') }
      // 页面删除 - 过滤id 修改状态
      // dataSource?.filter((item:any)=>item?.id!==data?.id)
      setdataSource(delrightsFilter(dataSource, data.id))
      // 隐藏loading
      setLoading(false)
      // console.log(res, loading)
    }).catch((err) => {
      console.log(err)
    })
  }
  // 配置 页面 权限 pagepermisson
  const switchMethod = (data: any) => {
    // 显示loading
    setLoading(true)
    /*
      data.pagepermisson = data.pagepermisson===1?0:1;
       此处进行了 擦边球 直接修改了 data  而状态 dataSource 引用的域 和 data 是同样的 因此 修改 data 的值 状态 dataSource也会改变，
       因此可以 通过 setdataSource([...dataSource]) 重新赋值 触发更新 , 注意如果出现问题 排查

       当然也可以深度拷贝 遍历修改 正规一点
    */
    // data.pagepermisson = data.pagepermisson===1?0:1;
    // 深度拷贝 状态
    let newData = JSON.parse(JSON.stringify(dataSource))

    // 递归遍历 修改
    function filter(msg: any, data: any) {
      msg.map((item: any) => {
        if (item.id == data.id && item.grade == data.grade) {
          item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        } else if (item.children && item.children.length > 0) {
          filter(item.children, data)
        }
      })
      return msg
    }
    let newStater = filter(newData, data)
    // 修改状态
    setdataSource(newStater)

    let { id, grade } = data;
    // 调用接口 修改权限 - RESTful架构风格 - put
    $axios({
      url: `/api/rights/${grade}/${id}`, // grade 告诉后端 修改的权限 所在层级+id
      method: 'put',
      params: {
        pagepermisson: data.pagepermisson === 1 ? 0 : 1, // 要修改的值
      },
    }).then(res => {
      if (res.data.Code === 0) {
        // 隐藏loading
        setLoading(false)
        // 修改权限 成功 - 重新获取权限 更新左侧菜单
        dispatch(getRightsList(userInfo))
      }
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })

  }
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Spin tip="Loading" size="large" spinning={loading} style={{
        top: '50%',
        transform: ' translate(0, 50%)'
      }}>
        <div className="content" />
      </Spin>
      <MyTable id={'MyTable'} dataSource={rightsList} rowKey={'key'} columns={columns} pagination={{
        pageSize: 5,// 每页显示几条
      }}></MyTable>
      {/* <Table dataSource={dataSource}  columns={columns} scroll={{y:scrollY}}  pagination={{
        pageSize: 5,// 每页显示几条
      }} /> */}
    </div>
  )
}
