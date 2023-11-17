import React, { useEffect, useRef, useState } from 'react'
import {
  DeleteOutlined,
  ExclamationOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Modal, Button, Tree } from 'antd'
import type { DataNode, TreeProps } from 'antd/es/tree';
import MyTable from '../../../../components/table'
import MyTree from '../../../../components/SandBox/RightsManage/Role/tree'

import styles from '../../../../assets/css/right-manage/role.module.scss'
import Item from 'antd/es/list/Item';
// 导入 二次封装 axios 内包含了 获取 token 存入本地 + 发起请求携带token
import { $axios } from '../../../../util/request';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { getRightsList } from '../../../../redux/actionCreators/rightsSlice';
import WinResize from '../../../../components/winResize';
// 错误边界 库
import { useErrorBoundary } from 'react-error-boundary';
const { confirm } = Modal;
// ['/user-manage',
// '/user-manage/add',
// '/user-manage/delete',
// '/user-manage/update',
// '/user-manage/list',

// '/right-manage/role/list',
// '/right-manage/role/update',
// '/right-manage/role/delete',
// '/right-manage/right/list',
// '/right-manage/right/update',
// '/right-manage/right/delete',

// '/news-manage',
// '/news-manage/list',
// '/news-manage/add',
// '/news-manage/update/:id',
// '/news-manage/preview/:id',
// '/news-manage/draft',
// '/news-manage/category',

// '/audit-manage',
// '/audit-manage/audit',
// '/audit-manage/list',

// '/publish-manage',
// '/publish-manage/unpublished',
// '/publish-manage/published',
// '/publish-manage/sunset',
// '/home'
// ]

function dataFilter(data: any) {
  data.map((item: any) => {
    // item.rights 字符串 转数组  filter 过滤 数组内的空字符串 /\S/
    item.rights = (item.rights.replace(/\r\n|\n/g, "").split(',').filter((ktem: any) => /\S/.test(ktem)))

  })
  return data;
}

// 权限管理 -  角色 列表组件
export default function RoleList() {
  const { showBoundary } = useErrorBoundary();

  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) =>state.userSlice ,shallowEqual);
  // 状态管理 - 设置
  const dispatch = useDispatch<any>();
  //根据store.js中设置的reducer名字，从 rightsSlice 空间获取state
  const { rightsList } = useSelector((state: any) => state.rightsSlice,shallowEqual);
  //  角色列表
  const [dataSource, setdataSource] = useState<any>([]);
  // 加载 loading
  const [loading, setLoading] = useState(false);
  // 角色权限 设置 树 默认勾选的项  控制 子选中的 数组， checked数组中 有父的key 结合 halfChecked 父的状态为全选
  const [checked, setCurrentRights] = useState<any>([]);
  // 控制 父 半选 状态 ，如果 结合 checked数组中 有父的key 半选 状态为全选
  const [halfChecked, sethalfChecked] = useState<any>([]);
  // 修改的角色 id
  const [currentId, setCurrentId] = useState(0);
  // modal 层 是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 获取权限列表
  const [rightList, setRightList] = useState<any>([])

  // 获取 div 元素 获取高 传入 table 设置table 设置属性  scroll={{y: 100}} 超出滚动
  const refElem = useRef<any>();
  const [warperRef, setWarperRef] = useState();

  const [ItemRights, setItemRights] = useState()
  const showModal = (data: any) => {
    // console.log(data,rightList)
    // 打开 modal 窗口
    setIsModalOpen(true);
    // 获取角色 id
    setCurrentId(data.id);
    // 封装的tree 调用
    // setItemRights(data) ;
    // 初始化 tree 数据-  checked,halfChecked 状态
    let parentKey: any = [];
    // 当前dataSource内的rights权限 数组
    data.rights.map((item: any) => {
      for (let i in rightsList) {
        if (rightsList[i].key.includes(item)) {
          let nodeChildren = rightsList[i].children;
          if (nodeChildren.length > 0) {
            for (let k in nodeChildren) {
              // 父节点下 存在 子节点未选中的  父key添加到 半选 数组中
              if (!data.rights.includes(nodeChildren[k].key)) {
                parentKey.push(rightsList[i].key)
                break;
              }
            }
          }
        }
      }
    })

    // 过滤 去除 存在 子节点未全部选中 的父key
    let newchecked = data.rights.filter((item: any) => !parentKey.includes(item))
    // console.log(parentKey, newchecked)
    // 父key添加到 半选 数组
    sethalfChecked(parentKey)
    // 获取点击 角色的 权限列表 设置树选中的值
    setCurrentRights(newchecked);

  };

  const handleOk = () => {
    // 字符串形式的数组 转数组
    // let arr = eval('('+item.rights+')');
    // console.log(checked, halfChecked)
    // 数组 合并 原数组不变 返回新数组
    let current = checked.concat(halfChecked);
    // 数组去重 - // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
    // /**current.indexOf(item),该方法将从头到尾地检索数组，看它是否含有对应的元素。如果找到一个item，则返回 item的"第一次出现的位置"。**/
    let list = current.filter((item: any, index: any) => current.indexOf(item) === index);
    let delerights: any = null;
    // 确认 利用map 映射 - 修改权限数据 状态 item.id == 匹配当前修改的 currentId 展开...item对象 修改内的rights属性 重新赋值为 list，封装 原item 返回
    let data = dataSource.map((item: any) => {
      if (item.id == currentId) {
        // 获取修改的 权限项
        delerights = item.rights.filter((item: any, index: any) => !list.includes(item))
        return { ...item, rights: list }
      } else {
        return item
      }
    });
    // console.log(dataSource, list, data, delerights);
    // 更新状态
    setdataSource(data);
    let setData: any = {
      rights: (list.join(',')),
    };
    // 获取修改的 权限项 存在值
    if ((delerights && delerights.length > 0)) {
      setData.rightsdele = delerights.join(',')
    }

    $axios({
      url: '/api/roles',
      method: 'put',
      data: {
        id: currentId,
        set: {
          ...setData,
        },
      }
    }).then(res => {
      if (res.data.Code === 0) {
        // console.log(res,currentId,userInfo)
        // 修改的角色权限currentId 等级等于自己时 roleid （自己的权限发生变化） - 重新 获取权限 及其权限列表发生变化 -  更新左侧菜单栏
        currentId == userInfo.roleid && dispatch(getRightsList(userInfo))
      }
    }).catch((err) => {
      console.log(err)
    })

    // 关闭 modal
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 根据 数据库返回 设置 table头 及其 对应显示的内容
  const columns: any = [
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
      title: '角色名称', // 显示在页面上的内容
      dataIndex: 'roleName',// 想要 显示对应数据的 name 名
    },
    {
      title: '操作', // 显示在页面上的内容
      render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => {
            ConfirmMethod(item)
          }} style={{ marginRight: '16px' }} />

          <Button type="primary" shape="circle" onClick={() => { showModal(item) }} icon={<UnorderedListOutlined />}></Button>


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
    console.log(data)
    $axios({
      url: '/api/roles',
      method: 'delete',
      params: {
        id: data.id
      },
    }).then(res => {
      setLoading(false)
      console.log(res)
      // 删除成功 - 本地修改状态
      if (res.data.Code == 0) {
        let newdata = JSON.parse(JSON.stringify(dataSource));
        setdataSource(newdata.filter((Item: any) => Item.id != data.id));
      }

    }).catch((err) => {
      console.log(err)
    })
  }
  // 获取 角色列表
  useEffect(() => {
    $axios({
      url: '/api/roles',
      method: 'get',
    }).then(res => {
      // 递归过滤 pagepermisson ===1 的数据 说明 有权限展示
      let data = dataFilter(res.data.Data)
      console.log(res.data.Data, data)
      setdataSource(data)
      // console.log(data)
    }).catch((err) => {
      console.log(err)
    })

  }, [])
  // 获取 权限列表
  useEffect(() => {
    // $axios({
    //   url: '/api/rights',
    //   method: 'get',
    //   params: {
    //     id: userInfo.id,
    //   },
    // }).then(res => {
    //   // 递归过滤 pagepermisson ===1 的数据 说明 有权限展示
    //   // let data = rightsFilter(res.data.Data)
    //   console.log(res.data.Data,)
    //   setRightList(res.data.Data)
    // })
    console.log(rightsList)
  }, [])

  // 点击 tree 树时
  const onCheck = (checkedKeys: any, info: any) => {
    try {
      // console.log('onCheck', checkedKeys, info);
      // if(info.checked){

      // }
      // rightid 说明 有父节点 否则 是根节点
      if (!info.node.rightid) {
        //  children说明 有子节点
        let childrenList: any = []
        // true 选中
        if (info.checked) {
          if (info.node.children.length > 0) {
            // 获取 父节点下的子元素
            info.node.children.map((Item: any) => childrenList.push(Item.key));
          }
          setCurrentRights([...checked, info.node.key, ...childrenList]);
          sethalfChecked([...halfChecked, info.node.key])
        } else {
          let newchecked = JSON.parse(JSON.stringify(checked));
          info.node.children.length > 0 && info.node.children.map((Item: any) => childrenList.push(Item.key));
          let checkedFilter = newchecked.filter((Item: any) => Item != info.node.key && !childrenList.includes(Item))
          // console.log(newchecked, checkedFilter)
          setCurrentRights(checkedFilter);
          sethalfChecked(halfChecked.filter((Item: any) => Item != info.node.key))
        }
      } else {
        let parentKey: any = [];
        let is = false;
        // 选中
        if (info.checked) {
          let newchecked = JSON.parse(JSON.stringify(checked));
          newchecked.push(info.node.key);
          for (let i in rightsList) {
            if (rightsList[i]?.id == info.node.rightid) {
              parentKey.push(rightsList[i].key);
              for (let k in rightsList[i].children) {
                //  该父节点 下 所有子节点 都被选中了
                if (newchecked.includes(rightsList[i].children[k].key)) {
                  is = true;
                } else {
                  // 存在子节点 未被选中了
                  is = false;
                  break;
                }
              }
              break;
            }
          }
          //  所有子节点 都被选中了 父节点添加到选中 
          if (is) {
            // 合并数组 添加 父的key
            newchecked = newchecked.concat(parentKey);
          }
          setCurrentRights(newchecked);
          // 半选的数组中 没有父节点 添加
          if (!halfChecked.includes(...parentKey))
            // 父节点添加到选中 半选状态 注意 checked,halfChecked全部都有父的key 父才能是 全选状态
            sethalfChecked([...halfChecked, ...parentKey]);
        } else {
          let newchecked = JSON.parse(JSON.stringify(checked));
          let checkedFilter: any = newchecked.filter((Item: any) => Item != info.node.key);
          let is = false;
          //  获取父下的 children
          for (let i in rightsList) {
            if (rightsList[i]?.id == info.node.rightid) {
              //去除 父节点的key 变成 半选状态
              checkedFilter = checkedFilter.filter((ktem: any) => ktem != rightsList[i].key)
              parentKey.push(rightsList[i].key);
              rightsList[i].children.map((Item: any) => {
                //  该父节点 的子节点 还有 选中的子 不剔除 半选状态
                if (checkedFilter.includes(Item.key)) {
                  is = true
                }
              })
              break;
            }
          }
          setCurrentRights(checkedFilter);
          // 子节点已经全部取消选中 ， 剔除 半选状态
          if (!is) {
            sethalfChecked(halfChecked.filter((Item: any) => !parentKey.includes(Item)));
          }
        }
      }
    } catch (error: any) {
      showBoundary(error);

    }
  };
  useEffect(() => {
    // console.log(checked,halfChecked)
  }, [halfChecked])
  return (
    <div className={styles['right-manage-roles-list-wrapper'] + ' gg-flex-4 gg-flex-2'} ref={refElem}>
      {/* 实时监听页面高度变化 - 获取 元素 获取高*/}
      <WinResize contentElem={refElem} callback={(size: any) => {
        // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
        setWarperRef(refElem.current.getBoundingClientRect())
      }}></WinResize>
      <MyTable id={'myRolesListTable'} dataSource={dataSource} warperRefObj={warperRef} warperRef={refElem.current} columns={columns} pagination={{
        pageSize: 5,// 每页显示几条
      }}></MyTable>


      <Modal title="权限分配" open={isModalOpen} onOk={() => { handleOk() }} onCancel={handleCancel}>
        <Tree
          checkable
          // defaultExpandedKeys={['0-0-0', '0-0-1']}
          // defaultSelectedKeys={['0-0-0', '0-0-1']}
          // defaultCheckedKeys={currentRights} //默认选中复选框的树节点 - 非受控 点击第一次的时候 有用受控，后续切换点击 无效

          //checkedKeys 默认选中复选框的树节点 - 受控 每次点击 根据数组内容显示 checked,选中的key数组 halfChecked父节点（半选状态） 选中的key数组 -checked和halfChecked同时存在父key 全选状态
          checkedKeys={{ checked, halfChecked }}
          checkStrictly={true} // 父子不联动 ，因为 tree的 关联 父选中 子默认全选中 但是其中一些子 又是一些角色 不该有的权限
          // onSelect={onSelect}
          onCheck={onCheck}
          treeData={rightsList}
        />

        {/* <MyTree ItemRights={ItemRights} rightList={rightList}></MyTree> */}
      </Modal>
    </div>
  )
}
