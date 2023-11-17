import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
// MyForm.propTypes = {}

function MyForm(props) {
    // console.log(props)
    return (
        <>
            <Form
                // labelCol={{ span: 8 }} // label 标题占的比例 为栅格系统 24 份 当前标题为占 8
                labelCol={props.labelCol}
                //wrapperCol={{ span: 16 }}// 内容区域 如 input 当前为占 16
                wrapperCol={props.wrapperCol}
                form={props.form}
                layout={props.layout || "vertical"} // 布局方向 默认为 vertical 垂直方向 horizontal 为水平方向
                name={props.name||"form_in_modal"}
                // onFinish={props.onFinish}
                initialValues={{ modifier: 'public' }}
            >

                {/* 插槽 */}
                {props.children}
            </Form>
        </>
    )
}

export default MyForm
