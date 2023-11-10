import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import MyTable from '../../../components/table'

import { Modal, message, Form, Input, Button, Popover, Switch, Spin } from 'antd';
import MyModal from '../../../components/modal';
import MyForm from '../../../components/form';
import UserForm from '../../../components/users-manage/userForm';
// 导入 二次封装 axios 内包含了 获取 token 存入本地 + 发起请求携带token
import { $axios} from '../../../util/request';
import { useSelector } from 'react-redux';



let { confirm } = Modal
export default function UserList() {
     //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const {userInfo}=useSelector((state:any)=>{return state.userSlice});
  // 用户列表
  const [dataSource, setdataSource] = useState<any>();
  // 角色列表
  const [rolesList, setRolesList] = useState<any>();
  // 区域列表
  const [regionsList, setRegionsList] = useState<any>([]);
  // 是否 禁用区域选择
  const [isDisabledRegions, setIsDisabledRegions] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  // antd 内部封装的 获取form 表单函数 ， form 返回一个对象 内包含了 submit 提交 ，获取value 等等函数
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  // 添加 modal 是否显示
  const [open, setOpen] = useState(false);
  // 更新 modal是否显示
  const [updateOpen, setUpdateOpen] = useState(false);

  // 需要更新的用户对象
  const [currentUpdate, setCurrentUpdate] = useState<any>()
  // loading 动画是否显示
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    $axios({
      url: `/api/users`,
      method: 'get',
      params:{
        roleid:userInfo.roleid,
        region:userInfo.region,
      }
    }).then(res => {
      console.log(res)
      if (res.data.Code != 0) return error();

      let data = res.data.Data;
      setdataSource(data);
    }).catch((err)=>{
      console.log(err)
  });
    // 组件销毁时 触发 （ useEffect 依赖必须是空数组 没有依赖）
    return () => {

    }
  }, [])
  useEffect(() => {
    // 获取 角色列表
    $axios({
      url: `/api/roles`,
      method: 'get',
    }).then(res => {
      // console.log(res)
      if (res.data.Code != 0) return error();

      let data = res.data.Data;
      setRolesList(data);
    }).catch((err)=>{
      console.log(err)
  })
    // 组件销毁时 触发 （ useEffect 依赖必须是空数组 没有依赖）
    return () => {

    }
  }, [])
  useEffect(() => {
    // 获取 区域列表
    $axios({
      url: `/api/regions`,
      method: 'get',
    }).then(res => {
      console.log(res)
      if (res.data.Code != 0) return error();

      let data = res.data.Data;
      setRegionsList(data);
    }).catch((err)=>{
      console.log(err)
  })
    // 组件销毁时 触发 （ useEffect 依赖必须是空数组 没有依赖）
    return () => {

    }
  }, [])
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };
  // 根据 数据库返回 设置 table头 及其 对应显示的内容
  const columns = [
    {
      title: '区域', // 显示在页面上的内容
      dataIndex: 'region',// 想要 显示对应数据的 name 名
      key: 'id',// key 可写可不写
      filters:[ // 筛选 排序 需要筛选菜单的列
        {
          text:'全球',
          value:'全球',
        },
      // 遍历区域列表 取出所需值 返回 自定义的对象 key 然后解构 赋值给数组 ，手动添加一个全球 -数据库未添加 全球 字段
        ...regionsList?.map((item: any)=>(
          {
          text:item.title,
          value:item.value,
          }
        )),
      ],
      onFilter:(value:any,item:any)=>{ // onFilter 用于筛选当前数据 当前数据区域 字段 为region (region为空说明是 全球)
        return (item.region==''?'全球':item.region) === value;
      },
      render: (val: any, record: any, index: any) => { // 自定义渲染函数 表格内容 参数的形式传入, 必须return 返回 否则ts报错
        // console.log(text,record)
        return <div style={{ fontWeight: 'bold' }}>{val && val != '' ? val : '全球'}</div>
      },
    },
    {
      title: '角色名称', // 显示在页面上的内容
      dataIndex: 'roles',// 想要 显示对应数据的 字段 名
      key: 'id',// key 可写可不写
      render: (roles: any, record: any, index: any) => {
        return roles.roleName
      }
    },
    {
      title: '用户名称', // 显示在页面上的内容
      dataIndex: 'username',// 想要 显示对应数据的 字段 名
      key: 'id',// key 可写可不写
    },
    {
      title: '用户状态', // 显示在页面上的内容
      dataIndex: 'rolestate',
      key: 'id',// key 可写可不写
      render: (roleState: any, record: any, index: any) => {
        // console.log(record)
        // roleState 1 为默认用户的状态 开关 1 (为真) 打开 0 (为假)关闭, default 1 为默认用户 禁止删除- 修改状态
        return <Switch onChange={() => {
          setLoading(true)
          //  深度拷贝状态 - 修改 状态
          let newlist = JSON.parse(JSON.stringify(dataSource))
          newlist.map((data: any) => {
            data.id == record.id && (data.rolestate = (data.rolestate == 1 ? 0 : 1))
          });
          // 要修改的内容
          let data = {
            id: record.id,
            set: { rolestate: record.rolestate == 1 ? 0 : 1 }
          }
          handleRoleState(newlist, data)
        }} checked={roleState == 1 ? true : false} disabled={record.default == 1 ? true : false}></Switch>
      }
    },
    {
      title: '操作',
      render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
        return <div>
          {/* default, 表示 用户 默认 1表示 不可删除 0 可删除  */}
          <Button danger shape="circle" disabled={item.default == 1 ? true : false} icon={<DeleteOutlined />} onClick={() => {
            ConfirmMethod(item)
          }} style={{ marginRight: '16px' }} />


          <Button type="primary" shape="circle" onClick={() => {
            // console.log(item)
            // 更新用户
            handleEditUserInfo(item)
            {/* default, 表示 用户 默认 1表示 不可删除 0 可删除  */ }
          }} icon={<EditOutlined />} disabled={item.default == 1 ? true : false} ></Button>
        </div>
      }
    },
  ]
  // 操作 - 删除角色
  const ConfirmMethod = (item: any) => {
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
  // 操作 - 点击 编辑用户
  const handleEditUserInfo = (item: any) => {
  // 不是超级管理员
  if(userInfo.roleid!=1){
    //  只能添加 选择当前自己的区域
    setRegionsList(regionsList.map((item:any)=> item=(!item.value.includes(userInfo.region)?{...item,disabled:true}:item)))
    //  只能添加  自己下一级角色的权限
    setRolesList(rolesList.map((item:any)=> item=(item.roleType<=userInfo.roleid?{...item,disabled:true}:item)))
  }

    // 显示 更新用户 modal窗口
    setUpdateOpen(true)
    console.log(item)
    // 设置 区域是否为必填项
    setIsDisabledRegions(item.roleid == 1 ? true : false)
    // 当前用户信息 传入 updateForm input值
    updateForm.setFieldsValue(item);
    // 保存当前用户信息 - 在更新时 提取id 传入后端
    setCurrentUpdate(item)
  }
  // 操作 - 确认更新用户
  const handleUpdateOk = () => {
    console.log('确认更新用户',)
    let { id } = currentUpdate;
    //  深度拷贝状态 - 修改 状态
    let newlist = JSON.parse(JSON.stringify(dataSource))
    //获取 表单 内容
    updateForm.validateFields().then((value: any) => {
      // 修改 dataSource 状态
      let updateList=newlist.map((data: any) => {
        //等于要修改的id 展开...data 展开修改的内容...value 合并对象 同字段会将原数据替换返回一个新对象
        return data =(data.id === id ? { ...data, ...value } : data);
      });
      console.log(newlist,updateList)
      // setdataSource(updateList)
      // 要修改的内容
      let data = {
        id: id,
        set:value,
      }
      console.log(value)
      setLoading(true)
      // 调用接口 + 修改状态
      handleRoleState(updateList,data)
    }).catch(err => console.log(err))
  }
  // 添加用户
  const handleUserAdd = () => {
    console.log('userAdd',userInfo,rolesList)
    // 显示 modal 组件
    setOpen(true);
    // 不是超级管理员
    if(userInfo.roleid!=1){
      // select 输入框默认值
      // form.setFieldValue('region',userInfo.region)
      //  只能添加 是自己下一级的权限
      // form.setFieldValue('roleid',userInfo.roleid+1)
      //  只能添加 选择当前自己的区域
      setRegionsList(regionsList.map((item:any)=> item=(!item.value.includes(userInfo.region)?{...item,disabled:true}:item)))
      //  只能添加 是自己下一级的权限
       setRolesList(rolesList.map((item:any)=> item=(item.roleType<=userInfo.roleid?{...item,disabled:true}:item)))
    }
  }
  //  select - 区域
  const handleChangeRegion = (value: string, newForm: any) => {
    console.log(value)
    // 获取 form 表单内的 角色id 是否为 超级管理员 1，为 超级管理员时 select区域region 下拉框 为空
    let roleId = newForm.getFieldValue('roleid');
    if (roleId === 1) {
      newForm.setFieldValue('region', '');
    }
  }
  // select -  角色
  const handleChangeRoles = (value: number, newForm: any) => {
    console.log(value)
    // 角色 为 超级管理员时 select区域region 下拉框 为空
    if (value === 1) {
      // 禁用 区域选择
      setIsDisabledRegions(true);
      // 区域选择 赋空值
      newForm.setFieldValue('region', '');
    } else {
      setIsDisabledRegions(false)
    }
  }
  // 确认 提交表单
  const handleAddForm = () => {
    // 点击确认 - 获取 form 表单 数据
    form.validateFields().then((value: any) => {
      console.log(value)
      setLoading(true)
      
      //  post 到后端
      $axios({
        url: `/api/users`,
        method: 'post',
        // params:{...value}, //params 的形式传参数是url中 query
        data: { // data 的形式传参数 是在 body 体中
          ...value,
          rolestate: 1,
          default: 0,
        },
        headers: { 'Content-Type': 'application/json' }
      }).then((res: any) => {
        console.log(res)
        setLoading(false)
        // if(res.data.Code==0)
        let data = res.data.Data;
        console.log(data)
        // 获取 添加成功 返回的数据 添加到状态中
        setdataSource([...dataSource, data])
        // 隐藏 modal
        setOpen(false);
        // 清空 表单 数据
        form.resetFields();
        // 区域选择 恢复默认必填项
        setIsDisabledRegions(false);
      })
    }).catch((err: any) => {
      console.log(err)
      // message.error(err.errorFields[0].errors.join(','))
    })
    console.log('确认', form)
  }
  //  删除用户
  const deleteMethod = (item: any) => {
    console.log(item)
    $axios({
      url: `/api/users`,
      method: 'delete',
      data: {
        id: item.id
      },
    }).then((res) => {
      console.log(res)
      setLoading(false)
      // 删除成功 - 深度拷贝状态 - 修改 状态
      let newlist = JSON.parse(JSON.stringify(dataSource))
      let newdata = newlist.filter((data: any) => data.id != item.id);
      setdataSource(newdata)
    }).catch((err)=>{
      console.log(err)
  })
  }
  //  修改用户-信息 状态
  const handleRoleState = (newlist: any, data: any) => {
    // console.log(res)
    // setdataSource(newlist)

    $axios({
      url: `/api/users`,
      method: 'patch',
      data: data,
    }).then((res) => {
      setLoading(false)
       // 修改 dataSource 状态
       let updateList=newlist.map((item: any) => {
        //等于要修改的id 展开...data 展开修改的内容...value 合并对象 同字段会将原数据替换返回一个新对象
        return item =(item.id === data.id ? { ...res.data.Data } : item);
      });
      // console.log(res,updateList)
      setdataSource(updateList)
      // 关闭 modal
      setUpdateOpen(false)
    }).catch((err)=>{
      console.log(err)
  })
  }
  return (
    <>
      <Spin tip="Loading" size="large" spinning={loading} style={{
        top: '50%',
        transform: ' translate(0, 50%)'
      }}>
        <div className="content" />
      </Spin>
      <Button type={'primary'} onClick={handleUserAdd}>添加用户</Button>
      <MyTable dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5,// 每页显示几条
      }}
        rowKey={'id'} // 自定义设置 key 字段
      >
        {contextHolder}
      </MyTable>

      <MyModal open={open} title={'添加用户'} okText={'确定'} cancelText={'取消'} onCreate={(values: any) => {
        console.log('Received values of form: ', values);
        setOpen(false)
      }} onOk={handleAddForm} onCancel={() => {
        // 取消
        setOpen(false);
        // 清空 表单 数据
        form.resetFields();
        // 区域选择 恢复必填项
        setIsDisabledRegions(false);
      }} childrenArr={[
        <MyForm layout={'vertical'} form={form}>
          <UserForm regionsList={regionsList} isDisabledRegions={isDisabledRegions} handleChangeRegion={(value: any) => {
            handleChangeRegion(value, form)
          }} rolesList={rolesList} handleChangeRoles={(value: any) => {
            handleChangeRoles(value, form)
          }}></UserForm>
          {/* <UserForm regionsList={regionsList} isDisabledRegions={isDisabledRegions} handleChangeRegion={handleChangeRegion} rolesList={rolesList} handleChangeRoles={handleChangeRoles}></UserForm> */}
        </MyForm>,
      ]}>
      </MyModal>

      <MyModal open={updateOpen} title={'更新用户'} okText={'更新'} cancelText={'取消'} onCreate={(values: any) => {
        console.log('Received values of form: ', values);
        setOpen(false)
      }} onOk={handleUpdateOk} onCancel={() => {
        // 取消
        setUpdateOpen(false);
        // 区域选择 恢复必填项
        setIsDisabledRegions(false);
        // 清空 表单 数据
        updateForm.resetFields();
      }} childrenArr={[
        <MyForm layout={'vertical'} form={updateForm}>
          <UserForm regionsList={regionsList} isDisabledRegions={isDisabledRegions} handleChangeRegion={(value: any) => {
            handleChangeRegion(value, updateForm)
          }} rolesList={rolesList} handleChangeRoles={(value: any) => {
            handleChangeRoles(value, updateForm)
          }}></UserForm>
        </MyForm>,
      ]}>
      </MyModal>
    </>
  )
}
