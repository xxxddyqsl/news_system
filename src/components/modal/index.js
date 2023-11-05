import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Modal, Radio } from 'antd';

MyModal.propTypes = {
    title: PropTypes.string.isRequired,
    okText: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,

    description: PropTypes.string,
    modifier: PropTypes.string,
    // open  bool 为布尔值类型 isRequired 为 必传
    open: PropTypes.bool.isRequired,
    // func 为 函数类型
    onCreate:  PropTypes.func,
    onCancel: PropTypes.func ,
    onOk: PropTypes.func,
    children:PropTypes.any,
    childrenArr:PropTypes.any,
  }
export default function MyModal(props) {
    // console.log(props.childrenArr)
  return (
    <Modal 
    open={props.open}
    title={props.title}
    okText={props.okText}
    cancelText={props.cancelText}
    onCancel={props.onCancel}
    onOk={props.onOk}
    >

        {/* 方式1：  数组的形式传入 父组件 是 <MyModal childrenArr={[<MyForm/>,]}> </MyModal>  和 MyModal 是一个共同的 父组件 UserList 传值方便 两个自定义组件 互不干扰 只是插入MyModal 显示MyForm */}
        {/* 组件以 数组的形式传入 插槽 - 不具名插槽 根据传入 数组的顺序 遍历显示组件 <></>是 <React.Fragment></React.Fragment> 的语法糖  */}
        {props.childrenArr?.map((Item,index)=><React.Fragment key={index}>{Item}</React.Fragment>)}

        {/* 方式2：  数组的形式传入 父组件 是 <MyModal childrenArr={[MyForm,]}> </MyModal> MyForm的父组件 为 MyModal组件  */}
        {/*props.childrenArr?.map((Item,index)=> <Item key={index}></Item>) */}
    </Modal>
  )
}