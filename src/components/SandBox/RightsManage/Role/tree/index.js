import React, { useEffect, useState } from 'react'
import { Modal, Button, Tree } from 'antd'



// 点击 子节点 选中 获取 子节点是否 全部选中
const ChildrenChecked=(parent,info,newchecked)=>{
    let parentKey=[];
    let is = false;
    for (let i in parent) {
        if (parent[i]?.id == info.node.rightid) {
            parentKey.push(parent[i].key);
            for (let k in parent[i].children) {
               //  该父节点 下 所有子节点 都被选中了
               if (newchecked.includes(parent[i].children[k].key)) {
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
    // 返回
    return {
        is,
        parentKey,
    }
}
// 点击子节点 - 取消选中 子节点是否 全部取消选中
const ChildrenCancel = (parent,info,checkedFilter)=>{
     let parentKey=[];
    let is = false;
    //  获取父下的 children
    for (let i in parent) {
        if (parent[i]?.id == info.node.rightid) {
            //去除 父节点的key 变成 半选状态
            // checkedFilter = checkedFilter.filter((ktem) => ktem != parent[i].key)
            parentKey.push(parent[i].key);
            parent[i].children.map((Item) => {
                //  该父节点 的子节点 还有 选中的子 不剔除 半选状态
                if (checkedFilter.includes(Item.key)) {
                    is = true
                }
            })
            break;
        }
    }
     // 返回
     return {
        is,
        parentKey,
    }
}

export default function MyTree(props) {
    //  控制 子选中的 数组， checked数组中 有父的key 结合 halfChecked 父的状态为全选
    const [checked, setCurrentRights] = useState([]);
    // 控制 父 半选 状态 ，如果 结合 checked数组中 有父的key 半选 状态为全选
    const [halfChecked, sethalfChecked] = useState([]);
    const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        // rightid 说明 有父节点 否则 是根节点
        if (!info.node.rightid) {
            let childrenList = []
            // 点击父节点 true 选中
            if (info.checked) {
                //  children说明 有子节点
                if (info.node.children.length > 0) {
                    // 获取 父节点下的子元素
                    info.node.children.map((Item) => childrenList.push(Item.key));
                }
                // 父节点+父的所有子 添加到 checked 状态
                setCurrentRights([...checked, info.node.key, ...childrenList]);
                // 父节点 添加到 halfChecked 状态 -  半选状态 ，因checked中有父节点 此时为全选状态
                sethalfChecked([...halfChecked, info.node.key])
            } else {
                //点击父节点 取消选中
                let newchecked = JSON.parse(JSON.stringify(checked));
                //  获取 父节点下的子元素
                info.node.children.map((Item) => childrenList.push(Item.key));
                // 过滤 checked 中 父节点 + 父节点下的所有子元素
                let checkedFilter = newchecked.filter((Item) => Item != info.node.key && !childrenList.includes(Item))
                // 更新状态
                setCurrentRights(checkedFilter);
                // 过滤 半选状态数组 中 父节点的key
                sethalfChecked(halfChecked.filter((Item) => Item != info.node.key))
            }
        } else {
            // 点击的节点是 子节点
            let parentKey = [];
            let is = false;
            // 深度 拷贝状态
            let newchecked = JSON.parse(JSON.stringify(checked));
            // 子节点 选中
            if (info.checked) {
                // 子节点添加到 子的选中数组中
                newchecked.push(info.node.key);
                // for (let i in props.rightList) {
                //     if (props.rightList[i]?.id == info.node.rightid) {
                //         parentKey.push(props.rightList[i].key);
                //         for (let k in props.rightList[i].children) {
                //             //  该父节点 下 所有子节点 都被选中了
                //             if (newchecked.includes(props.rightList[i].children[k].key)) {
                //                 is = true;
                //             } else {
                //                 // 存在子节点 未被选中了
                //                 is = false;
                //                 break;
                //             }
                //         }
                //         break;
                //     }
                // }
                let {is,parentKey} = ChildrenChecked(props.rightList,info,newchecked)
                console.log('ChildrenChecked==>',is,parentKey)
                //  所有子节点 都被选中了 父节点添加到选中 
                if (is) {
                    // console.log(parentKey)
                    // 合并数组 添加 父的key
                    newchecked = newchecked.concat(parentKey);
                }
                // console.log(is,newchecked)
                setCurrentRights(newchecked);
                // 半选的数组中 没有父节点 添加
                if (!halfChecked.includes(...parentKey))
                    // 父节点添加到选中 半选状态 注意 checked,halfChecked全部都有父的key 父才能是 全选状态
                    sethalfChecked([...halfChecked, ...parentKey]);
            } else {
                // 子节点 取消选中
                // 先 过滤 该 子key
                let checkedFilter = newchecked.filter((Item) => Item != info.node.key);
                //  获取父下的 children
                // for (let i in props.rightList) {
                //     if (props.rightList[i]?.id == info.node.rightid) {
                //         //去除 父节点的key 变成 半选状态
                //         checkedFilter = checkedFilter.filter((ktem) => ktem != props.rightList[i].key)
                //         parentKey.push(props.rightList[i].key);
                //         props.rightList[i].children.map((Item) => {
                //             //  该父节点 的子节点 还有 选中的子 不剔除 半选状态
                //             if (checkedFilter.includes(Item.key)) {
                //                 is = true
                //             }
                //         })
                //         break;
                //     }
                // }
                let {is,parentKey} = ChildrenCancel(props.rightList,info,checkedFilter)
                 //去除 父节点的key 变成 半选状态
                checkedFilter = checkedFilter.filter((Item) => !parentKey.includes(Item))
                console.log('ChildrenChecked==>',is,parentKey)
                setCurrentRights(checkedFilter);
                console.log(is, parentKey, checkedFilter)
                // 子节点已经全部取消选中 ， 剔除 半选状态
                if (!is) {
                    sethalfChecked(halfChecked.filter((Item) => !parentKey.includes(Item)));
                }
            }

        }
    }
    useEffect(() => {
        // 初始化 checked 与 halfChecked 父半选数组
        // props.ItemRights.
        console.log('MyTree==>', props);
        let data = props.ItemRights;
        let parentKey = [];
        data.rights.map((item) => {
            for (let i in props.rightList) {
                if (props.rightList[i].key.includes(item)) {
                    let nodeChildren = props.rightList[i].children;
                    for (let k in nodeChildren) {
                        // 父节点下 存在 子节点未选中 父key添加到 半选 数组中
                        if (!data.rights.includes(nodeChildren[k].key)) {
                            parentKey.push(props.rightList[i].key)
                            break;
                        }
                    }
                }
            }
        })
        // 过滤 去除 存在 子节点未全部选中 的父key
        let newchecked = data.rights.filter((item) => !parentKey.includes(item))
        console.log(parentKey)
        // 父key添加到 半选 数组
        sethalfChecked(parentKey)
        // 获取点击 角色的 权限列表 设置树选中的值
        setCurrentRights(newchecked);
    }, [props.ItemRights])
    return (
        <Tree
            checkable
            // // defaultExpandedKeys={['0-0-0', '0-0-1']}
            // // defaultSelectedKeys={['0-0-0', '0-0-1']}
            // // defaultCheckedKeys={currentRights} //默认选中复选框的树节点 - 非受控 点击第一次的时候 有用受控，后续切换点击 无效
            checkedKeys={{ checked, halfChecked }}//默认选中复选框的树节点 - 受控 每次点击 根据数组内容显示
            checkStrictly={true} // 父子不联动 ，因为 tree的 关联 父选中 子默认全选中 但是其中一些子 又是一些角色 不该有的权限
            // // onSelect={onSelect}
            onCheck={onCheck}
            treeData={props.rightList}
        >
        </Tree>
    )
}
